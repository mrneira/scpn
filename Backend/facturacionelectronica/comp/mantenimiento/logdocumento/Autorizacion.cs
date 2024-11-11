using core.componente;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;
using dal.contabilidad;
using facturacionelectronica.comp.consulta.componentegeneracion;
using facturacionelectronica.comp.consulta.entidades;
using System.Globalization;
using System.Threading;
using dal.facturacionelectronica;

namespace facturacionelectronica.comp.mantenimiento.logdocumento
{
    /// <summary>
    /// Clase que se encarga de completar los datos faltantes de una direccion
    /// </summary>
    public class Autorizacion : ComponenteMantenimiento
    {
        /// <summary>
        /// Metodo que se encarga de completar los datos faltantes
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (rm.GetTabla("AUTORIZACIONLOGDOCUMENTOS") == null || !rm.GetTabla("AUTORIZACIONLOGDOCUMENTOS").Lregistros.Any())
            {
                return;
            }
            List<tcellogdocumentos> ldatos = rm.GetTabla("AUTORIZACIONLOGDOCUMENTOS").Lregistros.Cast<tcellogdocumentos>().ToList();
            foreach (tcellogdocumentos obj in ldatos)
            {
                if ((bool)obj.Mdatos["autorizar"])
                {
                    ConsultarComprobante.ObtenerAutorizacionComprobante(obj, rm.Ccompania);
                    TcelLogDocumentosDal.UpdateDocumentoAutorizacion(obj.clog, 3);
                }
            }
            rm.Mtablas["AUTORIZACIONLOGDOCUMENTOS"] = null;
        }
    }
}
