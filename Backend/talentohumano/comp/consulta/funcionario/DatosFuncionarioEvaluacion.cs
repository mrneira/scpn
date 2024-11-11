using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using dal.talentohumano;
using modelo;
namespace talentohumano.comp.consulta.funcionario
{
    public class DatosFuncionarioEvaluacion : ComponenteConsulta
    {  /// <summary>
       /// Map con el orden campos a aplicar a la consulta
       /// </summary>
       /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            long cfuncionario = long.Parse(rqconsulta.Mdatos["cfuncionario"].ToString());

            long jefecfuncionario = long.Parse(rqconsulta.Mdatos["jefecfuncionario"].ToString());
            
            tthfuncionariodetalle funcionario = TthFuncionarioDal.Find(cfuncionario);
            rqconsulta.Response["FUNCIONARIO"] = funcionario;
            tthcontratodetalle con = TthContratoDal.FindContratoFuncionario(cfuncionario);
            if (con != null)
            {
                tthcargo carg = TthcargoDal.FindInDataBaseCodigo(con.ccargo);
                rqconsulta.Response["CARGO"] = carg.nombre;
            }
            else {
                rqconsulta.Response["CARGO"] = "";
            }
            rqconsulta.Response["TITULO"] = TthEstudioFormalDal.FindTitulo((long)funcionario.cfuncionario);
            
            tthfuncionariodetalle jefe = TthFuncionarioDal.Find(jefecfuncionario);
            rqconsulta.Response["JEFE"] = jefe;
        }
    }
}
