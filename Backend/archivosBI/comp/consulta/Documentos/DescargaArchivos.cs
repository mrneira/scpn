using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using dal.ArchivosBI;
using util.dto.consulta;
using System.IO;

namespace archivosBI.comp.consulta.Documentos
{
    public class DescargaArchivos : ComponenteConsulta
    {
        /// <summary>
        /// Metodo que valida la clave del certificado
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            if (rqconsulta.GetDatos("cmodulo") == null && rqconsulta.GetDatos("cdocumento") == null)
            {
                return;
            }
            if (rqconsulta.GetDatos("cmodulo") != null && rqconsulta.GetDatos("cdocumento") != null)
            {
                tgendocumentosbi bi = TgenDocumentosBIDal.Find(rqconsulta.Cmodulo, int.Parse(rqconsulta.Mdatos["cdocumento"].ToString()));
                string archivoBI = bi.reporte+bi.nombre;
                byte[] archivo = File.ReadAllBytes(archivoBI);
                if (archivo != null)
                {
                    rqconsulta.Response["archivoDescarga"] = archivo;
                    rqconsulta.Response["nombre"] = bi.nombre;
                }
                else
                {
                    rqconsulta.Response["archivoDescarga"] = null;
                }
            }
        }
    }
}
