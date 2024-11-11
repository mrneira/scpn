using core.componente;
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace archivosBI.comp.mantenimiento.Documentos
{
    public class SubirArchivo : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            string path = "";
            string narchivo = "";
            string archivo = "";
            tgenparametros param = TgenParametrosDal.Find("CARGA_ARCHIVOS_BI", rqmantenimiento.Ccompania);
            tgendocumentosbi bi = new tgendocumentosbi();
            
            int cmodulo = int.Parse(rqmantenimiento.Mdatos["cmoduloneg"].ToString());
                    path = param.texto;
                    narchivo = (string)rqmantenimiento.Mdatos["narchivo"];
                    archivo = (string)rqmantenimiento.Mdatos["archivo"];
                    archivo = archivo.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "");
                    string pathRaiz = string.Format("{0}", param.texto);
                    string nombreModulo= TgenModuloDal.Find(cmodulo).nombre;
                    path = string.Format("{0}{1}\\", pathRaiz, nombreModulo);
                    string ruta = path + narchivo;
                    if (!Directory.Exists(pathRaiz))
                    {
                        Directory.CreateDirectory(pathRaiz);
                    }
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    if (!File.Exists(ruta))
                    {
                        
                        bi.cmodulo = cmodulo;
                        bi.nombre = narchivo;
                        bi.descripcion = narchivo;
                        bi.reporte = path;
                File.WriteAllBytes(ruta, Convert.FromBase64String(archivo));
                bi.nombredescarga = "ANALISISNEGOCIO";
                    }
                    else
                    {
                        throw new AtlasException("GEN-027", "YA EXISTE OTRO ARCHIVO CON EL MISMO NOMBRE: {0}", narchivo);
                    }
            rqmantenimiento.AdicionarTabla("tgendocumentosbi", bi, false);
        }
    }
}
