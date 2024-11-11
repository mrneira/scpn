using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using modelo.servicios;
using util;
using util.servicios.ef;
using util.dto.consulta;


namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla secuencia tiempo mixto
    /// </summary>
    public class TpreTiempoMixto {
        /// <summary>
        /// Obtiene fechas de inicio y final por cada cambio de jerarquia del socio  
        /// </summary>
        /// <param name="cpersona">Codigo de la persona</param>
        /// <returns>historial de fechas por jerarquia</returns>
        private static string SQL = " select min(festado) fechaAlta, max(festado) fechaBaja, sg.cdetallejerarquia " +
            "from tsoccesantiahistorico shc inner join tsoctipogrado sg on shc.cgradoactual = sg.cgrado " +
            "where cpersona = @cpersona  " +
            "group by sg.cdetallejerarquia ";

        public static IList<Dictionary<string, object>> Find(long cpersona) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = cpersona;

            List<string> lcampos = new List<string>();
            lcampos.Add("ruta");
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL);
            IList<Dictionary<string, object>> listaRutas = ch.GetRegistrosDictionary();
            return listaRutas;

        }

        /// <summary>
        /// Valida si el soco aplica tiempo mixto
        /// </summary>
        /// <param name="cpersona"></param>
        /// <returns></returns>
        public static bool AplicaTiempoMixto(long cpersona) {
            bool valor = false;
            IList<Dictionary<string, object>> tiempomixto = new List<Dictionary<string, object>>();
            tiempomixto = TpreTiempoMixto.Find(cpersona);
            if(tiempomixto.Count() > 1)
                valor = true;
            else
                valor = false;

            return valor;

        }



    }
}
