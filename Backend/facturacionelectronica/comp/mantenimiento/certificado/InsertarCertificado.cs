using core.componente;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;
using facturacionelectronica.comp.consulta.helper;
using dal.facturacionelectronica;

namespace facturacionelectronica.comp.mantenimiento.certificado
{
    /// <summary>
    /// Insertar certificado
    /// </summary>
    public class InsertarCertificado : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetTabla("INFOCERTIFICADO") == null || !rm.GetTabla("INFOCERTIFICADO").Lregistros.Any())
            {
                return;
            }
            List<tcelcertificado> ldatos = rm.GetTabla("INFOCERTIFICADO").Lregistros.Cast<tcelcertificado>().ToList();
            foreach (tcelcertificado obj in ldatos)
            {
                if (obj.Esnuevo)
                {
                    tcelcertificado certificado = new tcelcertificado();
                    certificado.activo = obj.activo;
                    certificado.clave= EncodingPassword.base64Encode(obj.clave);
                    certificado.cusuarioing = obj.cusuarioing;
                    certificado.extension = obj.extension;
                    certificado.fechafin = obj.fechafin;
                    certificado.fechainicio = obj.fechainicio;
                    certificado.fingreso = obj.fingreso;
                    certificado.firma = obj.firma;
                    certificado.nombrecertificado = obj.nombrecertificado;
                    rm.AdicionarTabla("tcelcertificado", certificado, true);
                }
            }
            TcelCertificadoDal.UpdateCertificadoEstado(false);
            rm.Mtablas["INFOCERTIFICADO"] = null;
        }
    }
}
