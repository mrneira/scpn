using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.contabilidad.conciliacionbancaria;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.comprobante {

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de un comprobante contable.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0) {
                return;
            }
            tconcomprobante cabecera = (tconcomprobante)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);

            IList<tconcomprobantedetalle> cuentasBanco = TconComprobanteDetalleDal.Find(cabecera.ccomprobante, cabecera.ccompania);

            bool mayoriza = (bool)rqmantenimiento.Mdatos["cuadrado"];


            if (cuentasBanco.Count > 0 && mayoriza == true && cabecera.tipodocumentocdetalle.Equals("DIAGEN"))
            {
                foreach (tconcomprobantedetalle doc in cuentasBanco)
                {
                    tconbanco tconbanco = TconBancoDal.Find(doc.ccuenta);

                    if (tconbanco != null)
                    {
                        throw new AtlasException("CONTA-022", "NO SE PUEDE GENERAR DIARIO GENERAL PARA LA CUENTA CONTABLE: {0}", doc.ccuenta);
                    }

                }
            }

            if (cuentasBanco.Count > 0 && mayoriza == true && (cabecera.tipodocumentocdetalle.Equals("INGRES") || cabecera.tipodocumentocdetalle.Equals("EGRESO")))
            {

                foreach (tconcomprobantedetalle doc in cuentasBanco)
                {
                    tconbanco tconbanco = TconBancoDal.Find(doc.ccuenta);
                    //if (tconbanco == null)
                    //{
                    //    throw new AtlasException("CONTA-020", "NO SE ENCUENTRA REGISTRADA CUENTA CONTABLE {0} EN BANCOS", doc.ccuenta);
                    //}
                                    
                    if (tconbanco != null && string.IsNullOrEmpty(doc.numerodocumentobancario))
                    {
                        throw new AtlasException("CONTA-021", "NO SE ENCUENTRA INGRESADO NÚMERO DE DOCUMENTO BANCARIO: {0}", doc.ccuenta);
                    }
                    
                }
            }
            string ccomprobante = cabecera.ccomprobante;
            if (ccomprobante == null) {
                ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
                cabecera.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, cabecera.tipodocumentocdetalle);
            }

            //pregunta por el valor del key eliminar dentro del request para actualizar el campo eliminado del comprobante seleccionado
            if (rqmantenimiento.Mdatos.Keys.Contains("eliminar")) {
                TconComprobanteDal.Eliminar(rqmantenimiento, cabecera);
                rqmantenimiento.Response["numerocomprobantecesantia"] = cabecera.numerocomprobantecesantia;
                rqmantenimiento.Mdatos["ccomprobante"] = ccomprobante;
                rqmantenimiento.Mdatos["fcontable"] = cabecera.fcontable;
                return;
            }
            TconComprobanteDal.Completar(rqmantenimiento, cabecera, ccomprobante);
            // fija el numero de comprobante para utilizarlo en clases adicionales del mantenimiento.
            rqmantenimiento.Response["numerocomprobantecesantia"] = cabecera.numerocomprobantecesantia;
            rqmantenimiento.Mdatos["ccomprobante"] = ccomprobante;
            rqmantenimiento.Mdatos["fcontable"] = cabecera.fcontable;
        }
    }
}
