using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using dal.persona;
using dal.talentohumano;
namespace talentohumano.comp.consulta.funcionario
{
    public class BuscarIdentificacion : ComponenteConsulta
    {
        private Dictionary<string, object> mparametros = new Dictionary<string, object>();

        /// <summary>
        /// Map con el orden campos a aplicar a la consulta
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string identificacion = rqconsulta.Mdatos["identificacion"].ToString();
            tperpersonadetalle objPersona = TperPersonaDetalleDal.Find(identificacion);
            tthfuncionariodetalle objFuncionario = TthFuncionarioDal.Find(identificacion);
            if (objPersona != null && objFuncionario!=null) {
                rqconsulta.Response["EXISTE"] = 1;
            }

        }
    }
}
