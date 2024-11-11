using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;
using dal.generales;

namespace dal.talentohumano.nomina.fondosdereserva
{
    public class TnomFondosDeReservaDal
    {
        public static tnomfondoreserva FindByFuncionarioMesAnio(long cfuncionario, string mes, int anio)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnomfondoreserva ldatos = contexto.tnomfondoreserva
                .Where(x => x.cfuncionario == cfuncionario && x.mescdetalle == mes && x.anio == anio)
                .SingleOrDefault();
            return ldatos;
        }
    }
}
