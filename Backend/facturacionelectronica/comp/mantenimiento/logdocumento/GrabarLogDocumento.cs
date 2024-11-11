using core.componente;
using dal.facturacionelectronica;
using modelo;
using util.dto.mantenimiento;
using util.servicios.ef;

using modelo;
using System;
using System.Data.SqlClient;
using System.Linq;
using dal.contabilidad;

namespace facturacionelectronica.comp.mantenimiento.logdocumentos
{
    /// <summary>
    /// manteniento de logdocumentos de sri 
    /// </summary>
    public class GrabarLogDocumento : ComponenteMantenimiento
    {
        /// <summary>
        /// Genera un nuevo comprobante para grabar logDocumentos de los comprobantes enviados al Sri.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (!rqmantenimiento.Mdatos.ContainsKey("grabarLogDocumentos"))
            {
                return;
            }

            tcellogdocumentos logdocumentos = new tcellogdocumentos();
            logdocumentos.tipodocumento = rqmantenimiento.Mdatos["tipodocumento"].ToString();
            logdocumentos.numerodocumento = rqmantenimiento.Mdatos["ccomprobante"].ToString();
            logdocumentos.estado = int.Parse(rqmantenimiento.Mdatos["ccomprobante"].ToString());
            logdocumentos.mensaje = rqmantenimiento.Mdatos["mensaje"].ToString();
            logdocumentos.autorizacion = rqmantenimiento.Mdatos["autorizacion"].ToString();
            logdocumentos.clavedeacceso = rqmantenimiento.Mdatos["clavedeacceso"].ToString();
            logdocumentos.esreenvio = bool.Parse(rqmantenimiento.Mdatos["ccomprobante"].ToString());
            logdocumentos.cusuarioing = rqmantenimiento.Cusuario;
            logdocumentos.fingreso = rqmantenimiento.Freal;
            logdocumentos.ambiente = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_AMBIENTE", rqmantenimiento.Ccompania).numero.Value).ToString();
            logdocumentos.tipoemision = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_EMISION", rqmantenimiento.Ccompania).numero.Value).ToString();

            TcelLogDocumentosDal.CrearLogDocumentos(logdocumentos);
        }
    }
}

