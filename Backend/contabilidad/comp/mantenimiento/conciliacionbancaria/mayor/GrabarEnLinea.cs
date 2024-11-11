using System;
using System.Linq;
using core.componente;
using modelo;
using util.dto.mantenimiento;
using Newtonsoft.Json;
using util.servicios.ef;
using dal.contabilidad.conciliacionbancaria;
using util;
using modelo.interfaces;
using System.Collections.Generic;
using dal.contabilidad;

namespace contabilidad.comp.mantenimiento.conciliacionbancaria.mayor
{
    /// <summary>
    /// Clase que encapsula los procedimientos para grabar el mayor contable.
    /// </summary>
    public class GrabarEnLinea : ComponenteMantenimiento
    {

        /// <summary>
        /// Guarda cuenta contable en el detalle a conciliar.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos.Keys.Contains("anular")) {
                //EliminarDetalleEnConciliacionBancariaMayor(rqmantenimiento);
                return;
            }

            if (rqmantenimiento.Response["mayorizado"].ToString() != "OK") {
                return;
            }

            if (rqmantenimiento.GetTabla("TCONCOMPROBANTE").Registro == null) {
                return;
            }

            tconcomprobante obj = (tconcomprobante)rqmantenimiento.GetTabla("TCONCOMPROBANTE").Registro;
            List<tconcomprobantedetalle> ldetalle = new List<tconcomprobantedetalle>();
            List<tconparametros> lcuentasBancos = TconParametrosDal.FindXNombre("CUENTABANCOS", rqmantenimiento.Ccompania);
            long cConciliacionBancariaMayor = TconConciliacionBancariamayorDal.GetcConciliacionBancariaMayor();
            foreach (tconparametros cuenta in lcuentasBancos) {
                ldetalle = TconComprobanteDetalleDal.FindPorCuenta(obj.ccomprobante, obj.fcontable, obj.ccompania, cuenta.texto.Trim());
                if (ldetalle.Count.Equals(0)) {
                    continue;
                }
                InsertarDetalleEnConciliacionBancariaMayor(ldetalle,ref cConciliacionBancariaMayor, rqmantenimiento);
            }
 

        }

        /// <summary>
        /// Inserta registro en el mayor a conciliar.
        /// </summary>
        /// <param name="detalle">Lista del detalle contable.</param>
        /// <param name="cConciliacionBancariaMayor">Identificador del mayor a conciliar.</param>
        /// <param name="rqMantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        private void InsertarDetalleEnConciliacionBancariaMayor(List<tconcomprobantedetalle> detalle, ref long cConciliacionBancariaMayor, RqMantenimiento rqMantenimiento) {
            foreach(tconcomprobantedetalle item in detalle) {
                tconconciliacionbancariamayor tconConciliacionBancariaMayor = new tconconciliacionbancariamayor
                {
                    cconciliacionbancariamayor = cConciliacionBancariaMayor,
                    optlock = 0,
                    ccomprobante = item.ccomprobante,
                    fcontable = item.fcontable,
                    particion = item.particion,
                    secuencia = item.secuencia,
                    ccompania = item.ccompania,
                    ccuenta = item.ccuenta,
                    freal = Fecha.TimestampToInteger(rqMantenimiento.Freal),
                    debito = item.debito.Value,
                    monto = Convert.ToDecimal(item.monto.Value),
                    comentario = "",
                    estadoconciliacionccatalogo = 1020,
                    estadoconciliacioncdetalle = "2",
                    cusuariocreacion = rqMantenimiento.Cusuario,
                    fingreso = rqMantenimiento.Freal
                };
                Sessionef.Grabar(tconConciliacionBancariaMayor);
                cConciliacionBancariaMayor++;
            }
        }

        /// <summary>
        /// Elimina los registros del mayor contable conciliado.
        /// </summary>
        /// <param name="rqMantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        private void EliminarDetalleEnConciliacionBancariaMayor(RqMantenimiento rqmantenimiento) {

            if (rqmantenimiento.GetTabla("TCONCOMPROBANTE").Registro == null)
            {
                return;
            }

            string ccomprobante = rqmantenimiento.Mdatos["ccomprobante"].ToString();
            int fcontable = int.Parse(rqmantenimiento.Mdatos["fcontable"].ToString());
            int ccompania = int.Parse(rqmantenimiento.Mdatos["ccompania"].ToString());

            tconcomprobante comprobante = TconComprobanteDal.FindComprobante(ccomprobante, fcontable, ccompania);
            List<tconcomprobantedetalle> ldetalle = new List<tconcomprobantedetalle>();
            List<tconparametros> lcuentasBancos = TconParametrosDal.FindXNombre("CUENTABANCOS", rqmantenimiento.Ccompania);
            List<tconconciliacionbancariamayor> lcbmayor = new List<tconconciliacionbancariamayor>();
            foreach (tconparametros cuenta in lcuentasBancos)
            {
                ldetalle = TconComprobanteDetalleDal.FindPorCuenta(comprobante.ccomprobante, comprobante.fcontable, comprobante.ccompania, cuenta.texto.Trim());
                if (ldetalle.Count.Equals(0))
                {
                    continue;
                }

                foreach(tconcomprobantedetalle cd in ldetalle) {
                    TconConciliacionBancariamayorDal.EliminarEnCascada(comprobante.ccomprobante, comprobante.fcontable, comprobante.particion, cd.secuencia);
                }
            }
        }

    }
}
