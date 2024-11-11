using core.componente;
using dal.storeprocedure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;

namespace talentohumano.comp.consulta.nomina.nomina
{
    public class PagoDecimos : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string tipo = rqconsulta.Mdatos["tipo"].ToString();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            //parametros["@i_centrocostocdetalle"]= rqconsulta.GetString("parametro_centrocostocdetalle");
            if (tipo.Equals("DTER"))
            {
                rqconsulta.Response["LISTAPERSONAL"] = StoreProcedureDal.GetDataTable("sp_TthConDecimoTerceroPersonal", parametros);

            }
            else {
                rqconsulta.Response["LISTAPERSONAL"] = StoreProcedureDal.GetDataTable("sp_TthConDecimoCuartoPersonal", parametros);

            }
        }
    }
}
