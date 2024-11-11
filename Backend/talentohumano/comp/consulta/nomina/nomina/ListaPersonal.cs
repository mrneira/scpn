using core.componente;
using dal.storeprocedure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;

namespace talentohumano.comp.consulta.nomina
{
  public  class ListaPersonal : ComponenteConsulta
    {

        /// <summary>
        /// Busqueda del listado actual de
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
           
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            //parametros["@i_centrocostocdetalle"]= rqconsulta.GetString("parametro_centrocostocdetalle");
            rqconsulta.Response["LISTAPERSONAL"] = StoreProcedureDal.GetDataTable("sp_TthConNominaPersonal", parametros);

        }
    
    }
}
