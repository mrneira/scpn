using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using dal.storeprocedure;
namespace talentohumano.comp.consulta.nomina
{
    class Marcaciones : ComponenteConsulta
    {
        
        /// <summary>
        /// Busqueda del listado actual de
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            int fechaint = int.Parse(rqconsulta.Mdatos["fmarcacionint"].ToString());
            string cusuario = rqconsulta.Mdatos["cusuario"].ToString();
            //IList<UsuarioMarcaje> ldatos = 
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros.Add("@eliminado", 0);
            parametros.Add("@fechaint", fechaint);
            parametros.Add("@cusuario", cusuario);
            rqconsulta.Response["MARCACIONES"] = StoreProcedureDal.GetDataTable("sp_TthConMarcacionesNomina", parametros);

        }

    }
   
}
