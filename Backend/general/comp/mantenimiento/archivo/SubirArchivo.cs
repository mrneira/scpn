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

namespace general.comp.mantenimiento.archivo {
    public class SubirArchivo : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string path = "";
            string narchivo = "";
            string archivo = "";
            tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqmantenimiento.Ccompania);
            path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
            narchivo = (string)rqmantenimiento.Mdatos["narchivo"];
            archivo = (string)rqmantenimiento.Mdatos["archivo"];
            archivo = archivo.Replace("data:text/plain;base64,", "");
            path = path + "/" + narchivo;
            if (!File.Exists(path)) {
                File.WriteAllBytes(path, Convert.FromBase64String(archivo));
            } else {
                throw new AtlasException("GEN-023", "YA EXISTE OTRO ARCHIVO CON EL MISMO NOMBRE: {0}", narchivo);
            }
        }
    }
}
