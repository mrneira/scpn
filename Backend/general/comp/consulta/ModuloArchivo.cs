using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using util.dto.consulta;
using dal.generales;
namespace general.comp.consulta
{
    public class ModuloArchivo : ComponenteConsulta {
        /// <summary>
        /// Metodo que entrega un registro de TgenModuloArchivo.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            int carchivo = int.Parse(rqconsulta.Mdatos["carchivo"].ToString());
            rqconsulta.Response["registro"] = TgenModuloArchivoDal.FindArchivo(carchivo);

        }
    }
}
