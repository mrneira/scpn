using cartera.datos;
using core.componente;
using dal.cartera;
using dal.generales;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.arreglopago {

    /// <summary>
    /// Clase que se encarga de crear una nueva operacion en arreglo de pagos.
    /// </summary>
    public class CreaNuevaOperacionArregloPagos : ComponenteMantenimiento
    {
        /// <summary>
        /// Objeto que contiene rubros y saldos con los que se genera la nueva tabla de amortizacion.
        /// </summary>
        private Dictionary<string, decimal> mcobro;

        /// <summary>
        /// Genera nueva operacion como resultado del arreglo de pagos.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            mcobro = (Dictionary<string, decimal>)rqmantenimiento.GetDatos("MSALDOS-ARREGLO-PAGOS");
            tcaroperacion tcaroperacionanterior = OperacionFachada.GetOperacion(rqmantenimiento).Tcaroperacion;
            this.CrearNuevaOperacion(tcaroperacionanterior, rqmantenimiento);
        }

        /// <summary>
        /// Crea nueva operacion de cartera resultado del arreglo de pagos.
        /// </summary>
        /// <param name="tcaroperacionanterior">Objeto que contiene informacion de la operacion anterior que se cancela en el arreglo de pagos.</param>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        private tcaroperacion CrearNuevaOperacion(tcaroperacion tcaroperacionanterior, RqMantenimiento rqmantenimiento)
        {
            string joper = JsonConvert.SerializeObject((tcaroperacion)tcaroperacionanterior.Clone());
            tcaroperacion tcaroperacionnueva = JsonConvert.DeserializeObject<tcaroperacion>(joper);
            // Genera numero de operacion de cartera.
            tcaroperacionnueva.coperacion = this.GenNumeroOperacion(tcaroperacionnueva);
            tcaroperacionnueva.mensaje = rqmantenimiento.Mensaje;
            tcaroperacionnueva.mensajeanterior = null;
            tcaroperacionanterior.coperacionarreglopago = tcaroperacionnueva.coperacion;

            // Fija condiciones para generar tabla de amortizacion.
            this.FijaCondicionesOperacion(tcaroperacionnueva, rqmantenimiento);
            OperacionFachada.AddOperacion(tcaroperacionnueva);

            Sessionef.Save(tcaroperacionnueva);

            // Clona datos adicionales de tablas de la operacion anterior.
            this.ClonarTablasAdicionales(rqmantenimiento, tcaroperacionanterior.coperacion, tcaroperacionnueva.coperacion);
            this.ClonarDocumentos(tcaroperacionnueva);

            // cambia la operacion del rqmantenimiento para la generacion de la nueva tabla de pagos.
            rqmantenimiento.Coperacion = tcaroperacionnueva.coperacion;
            return tcaroperacionnueva;
        }

        /// <summary>
        /// Clona tablas adicionales asociadas a la operacion de cartera a la que se realiza el arreglo de pagos.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="coperacionanterior">Numero de operacion anterior.</param>
        /// <param name="coperacionnueva">Numero de la nueva operacion.</param>
        private void ClonarTablasAdicionales(RqMantenimiento rqmantenimiento, String coperacionanterior, String coperacionnueva)
        {
            TcarOperacionTasaDal.ClonarTcarOperacionTasaArregloPago(rqmantenimiento, coperacionanterior, coperacionnueva);
            TcarOperacionCargosTablaDal.ClonarTcarOperacionCargosTabla(rqmantenimiento, coperacionanterior, coperacionnueva);
            TcarOperacionPersonaDal.ClonarTcarOperacionPersonaArregloPago(coperacionanterior, coperacionnueva);
        }

        /// <summary>
        /// Fija condiciones de la operacion para generar la tabla de amortizacion.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene informacion de la operacion de cartera.</param>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        private void FijaCondicionesOperacion(tcaroperacion tcaroperacion, RqMantenimiento rqmantenimiento)
        {
            tcaroperacionarreglopago arregloPago = (tcaroperacionarreglopago)rqmantenimiento.GetDatos("TcarOperacionArregloPago");
            tcartipoarreglopago tipoArregloPago = TcarTipoArregloPagoDal.Find(arregloPago.ctipoarreglopago);
            tcaroperacion.cestatus = "VIG";
            tcaroperacion.fapertura = rqmantenimiento.Fconatable;
            tcaroperacion.faprobacion = rqmantenimiento.Fconatable;
            tcaroperacion.cusuarioapertura = rqmantenimiento.Cusuario;
            tcaroperacion.cusuariodesembolso = rqmantenimiento.Cusuario;
            tcaroperacion.fcancelacion = null;
            tcaroperacion.cusuariocancelacion = null;

            tcaroperacion.cestadooperacion = tipoArregloPago.cestadooperacion;
            tcaroperacion.monto = this.GetCapitalArregloPagos();
            tcaroperacion.cuotainicio = 1;
            tcaroperacion.fgeneraciontabla = rqmantenimiento.Fconatable;
            tcaroperacion.finiciopagos = arregloPago.finiciopagos;
            if (arregloPago.valorcuota != null)
            {
                tcaroperacion.valorcuota = arregloPago.valorcuota;
                tcaroperacion.numerocuotas = null;
            }
            if (arregloPago.numerocuotas != null)
            {
                tcaroperacion.numerocuotas = arregloPago.numerocuotas;
                tcaroperacion.valorcuota = null;
            }
        }

        /// <summary>
        /// Entrega el nuevo numero de operacion de cartera.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene datos de la nueva operacion de cartera.</param>
        /// <returns>String</returns>
        private String GenNumeroOperacion(tcaroperacion tcaroperacion)
        {
            String coperacion = TgenOperacionNumeroDal.GetNumeroOperacion((int)tcaroperacion.cmodulo, (int)tcaroperacion.cproducto,
                (int)tcaroperacion.ctipoproducto, (int)tcaroperacion.csucursal, (int)tcaroperacion.cagencia, (int)tcaroperacion.ccompania);
            return coperacion;
        }

        /// <summary>
        /// Entrega el monto con el cual se genera la nueva tabla de amortizacion.
        /// </summary>
        /// <returns>decimal</returns>
        private decimal GetCapitalArregloPagos()
        {
            decimal monto = 0;
            foreach (String key in this.mcobro.Keys)
            {
                if (key.StartsWith("CAP-CAR"))
                {
                    monto = monto + this.mcobro[key];
                }
            }
            return monto;
        }

        /// <summary>
        /// Adiciona documentos a la nueva operacion
        /// </summary>
        /// <param name="tcaroperacionnueva">Nueva operacion.</param>
        private void ClonarDocumentos(tcaroperacion tcaroperacionnueva)
        {
            List<tcaroperaciondocumentos> ldocumentos = new List<tcaroperaciondocumentos>();

            // Obtiene lista de informacion requerida por producto.
            List<tcarproductodocumentos> ldocproducto = TcarProductoDocumentosDal.Find((int)tcaroperacionnueva.cmodulo,
                    (int)tcaroperacionnueva.cproducto, (int)tcaroperacionnueva.ctipoproducto, false);

            // Crea registros de informacion requerida por producto asociados a la solicitud.
            if (ldocproducto != null && ldocproducto.Count > 0)
            {
                List<tcaroperaciondocumentos> lopepro = TcarOperacionDocumentosDal.CreateTcarOperacionDocumentos(ldocproducto, tcaroperacionnueva.coperacion);
                foreach (tcaroperaciondocumentos docpro in lopepro)
                {
                    ldocumentos.Add(docpro);
                    Sessionef.Save(docpro);
                }
            }
        }
    }
}
