using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using dal.gestordocumental;

namespace talentohumano.comp.consulta.gestordocumental
{
    public class Archivo : ComponenteConsulta
    {
       

        /// <summary>
        /// Map con el orden campos a aplicar a la consulta
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            if (!rqconsulta.Mdatos.ContainsKey("carchivo")) {
                return;
            }

            long carchivo = long.Parse(rqconsulta.Mdatos["carchivo"].ToString());
            tgesarchivo Archivo = TgesArchivoDal.FindArchivo(carchivo);
            rqconsulta.Response["ARCHIVO"] = Archivo;

        }
    }
}
