using contabilidad.comp.mantenimiento;
using contabilidad.helper;
using contabilidad.saldo;
using core.servicios;
using dal.contabilidad;
using dal.lote;
using dal.monetario;
using dal.presupuesto;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;
using util.servicios.contable;

namespace contabilidad.lote.registro {
    /// <summary>
    /// Clase que se encarga de generar comprobantes contables. Se crea un comprobante contable por sucursal agencia.
    /// </summary>
    public class ContabilizacionModulos : ITareaOperacion {

        /// <summary>
        /// ejecuta la tarea de operación de contabilización de módulos
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="requestoperacion"></param>
        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            // valida que no existan errores en la carga de tconcomprovante previo. Los errores se almacenan en tloteresultadoprevio.
            Boolean errores = TloteResultadoPrevioDal.ExisteErrores(requestoperacion.Fconatble ?? 0, requestoperacion.Numeroejecucion ?? 0, requestoperacion.Clote, null, null);

            if (errores) {
                return;
            }
            // con esta fecha busca los registros en tconcomprobante previo y crea el comprobante contable.
            int fcontable = this.FijaSucursalAgencia(rqmantenimiento, requestoperacion);

            // Crea cabecera del comprobante contable.

            tconcomprobante cabecera = TconComprobanteDal.Crear(rqmantenimiento, requestoperacion, Util.GetCcomprobante(), fcontable);
            cabecera.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, cabecera.tipodocumentocdetalle);
            rqmantenimiento.Mdatos["ccomprobante"] = cabecera.ccomprobante;
            cabecera.freal = rqmantenimiento.Freal;
            // Crea el detalle del comprobante contable.
            List<tconcomprobantedetalle> ldetalle = TconComprobanteDetalleDal.CrearAutomaticos(rqmantenimiento, requestoperacion, cabecera);

            // Recupera el listado de cuentas y partidas presupuestarias asociadas para su uso en la creación del detalle de comprobante contable
            List<tpptcuentaclasificador> lcuentaclasificador = TpptCuentaClasificadorDal.GetCuentasPartidasPresupuestariasPorModulo(7);
            foreach (tconcomprobantedetalle obj in ldetalle) {
                if (lcuentaclasificador.Exists(x => x.ccuenta.Equals(obj.ccuenta))) {
                    obj.cpartida = lcuentaclasificador.Find(x => x.ccuenta.Equals(obj.ccuenta)).cclasificador;
                }
            }

            this.Validaecuacioncontable(ldetalle);

            TconComprobantePrevioDal.ActualizarCregistroEnComprobantePrevio(rqmantenimiento.Ccompania, rqmantenimiento.Csucursal, rqmantenimiento.Cagencia,
                rqmantenimiento.Cmodulotranoriginal, rqmantenimiento.Ctranoriginal, rqmantenimiento.Cmoduloproducto, rqmantenimiento.Cproducto,
                rqmantenimiento.Ctipoproducto, rqmantenimiento.Fconatable, Constantes.GetParticion(rqmantenimiento.Fconatable), requestoperacion.Cregistro);
            cabecera.cconcepto = 3;
            cabecera.montocomprobante = ldetalle.Where(x => x.debito == true).Sum(x => x.monto);
            cabecera.actualizosaldo = true;
            cabecera.cuadrado = true;
            SaldoHelper sh = new SaldoHelper();
            sh.llenarLibroBancos = false; // libro bancos se llenar en el cash para el banco del pichincha.
            sh.ActualizarLote(cabecera, ldetalle);

            SaldoPresupuesto.ActualizarSaldoPresupuestoLote(rqmantenimiento, cabecera, ldetalle.ToList<IBean>());

        }

        /// <summary>
        /// Fija el codigo de sucursal y oficina, este lo toma del codigo de registro que llega en el requestoperacion.
        /// </summary>
        private int FijaSucursalAgencia(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            string cr = requestoperacion.Cregistro;
            Object[] o = cr.Split('-');
            rqmantenimiento.Csucursal = int.Parse(o[0].ToString());
            rqmantenimiento.Cagencia = int.Parse(o[1].ToString());
            rqmantenimiento.Cmodulotranoriginal = int.Parse(o[2].ToString());
            rqmantenimiento.Ctranoriginal = int.Parse(o[3].ToString());
            rqmantenimiento.Cmoduloproducto = int.Parse(o[4].ToString());
            rqmantenimiento.Cproducto = int.Parse(o[5].ToString());
            rqmantenimiento.Ctipoproducto = int.Parse(o[6].ToString());
            return int.Parse(o[7].ToString());
        }

        /// <summary>
        /// Valida que el comprobante cumpla con la ecuacion conatble.
        /// </summary>
        private void Validaecuacioncontable(List<tconcomprobantedetalle> ldetalle)
        {
            EcuacionContable ec = new EcuacionContable();
            tconcatalogo cuentadetalle;
            //string ldetalles = "";
            int i = 0;
            
            foreach (tconcomprobantedetalle detalle in ldetalle) {
                //ldetalles = ldetalle.ToString();
                cuentadetalle = TconCatalogoDal.Find(detalle.ccompania, detalle.ccuenta);
                bool esSaldoDeudor = TmonClaseDal.Find(cuentadetalle.cclase).suma.Equals("D") ? true : false;
                ec.ActualizarSaldo(detalle.cclase, detalle.montooficial ?? 0, detalle.suma ?? false, cuentadetalle.tipoplancdetalle, esSaldoDeudor);
                i++;
                if (i==24)
                {
                    i = 24;
                }
            }
            ec.Validar();

        }


    }
}
