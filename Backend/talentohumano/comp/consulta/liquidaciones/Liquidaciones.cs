using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using dal.talentohumano;
using dal.generales;

namespace talentohumano.comp.consulta.liquidaciones
{
    class Liquidaciones : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rq)
        {
            long cfuncionario = long.Parse(rq.Mdatos["cfuncionario"].ToString());
            tthfuncionariodetalle tthfuncionario = TthFuncionarioDal.FindFuncionario(cfuncionario);
            tthcontratodetalle tthdesignacionActual = TthContratoDal.FindContratoFuncionario(cfuncionario);
            tthcontratodetalle tthdesignacionAntigua = TthContratoDal.FindContratoMasAntiguoByFuncionario(cfuncionario);
            List<tgencatalogodetalle> lIngresosObligatorios = TgenCatalogoDetalleDal.FindList(1151, "1");
            List<tgencatalogodetalle> lIngresosOpcionales = TgenCatalogoDetalleDal.FindList(1151, "0");
            decimal SBU_actual = Convert.ToDecimal(TthParametrosDal.Find("SBU", rq.Ccompania));
            // calcular o consultar valores que generen ingreso al funcionario: nomina, decimos, fondos de reserva, etc.
            // calcular o consultar valores que generen egresos al funcionario: iess, pagos de adelantos, etc.


            rq.Response.Add("tthfuncionario", tthfuncionario);
            rq.Response.Add("tthdesignacionActual", tthdesignacionActual);
            rq.Response.Add("tthdesignacionAntigua", tthdesignacionAntigua);
            rq.Response.Add("lIngresosObligatorios", lIngresosObligatorios);
            rq.Response.Add("lIngresosOpcionales", lIngresosOpcionales);
            rq.Response.Add("SBU_actual", SBU_actual);
        }
    }
}
