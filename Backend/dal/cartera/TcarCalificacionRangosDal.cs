using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera
{

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarCalificacionRangos.
    /// </summary>
    public class TcarCalificacionRangosDal
    {

        /// <summary>
        /// Metodo que entrega una lista de rangos de calificaion de cartera. Busca los datos en cahce, si no encuentra los datos en cache busca
        /// en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        public static IList<tcarcalificacionrangos> Find(String csegmento)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcarcalificacionrangos> ldatos = contexto.tcarcalificacionrangos.Where(x => x.csegmento.Equals(csegmento)).ToList();

            return ldatos;
        }

        /// <summary>
        /// Entrega la calificacion para el tipo de credito, estado operacion y dias de morosidad.
        /// </summary>
        public static string GetCcalificacion(string csegmento, int diasvencido)
        {
            String ccalificaion = "";
            IList<tcarcalificacionrangos> lrangos = TcarCalificacionRangosDal.Find(csegmento);
            foreach (tcarcalificacionrangos obj in lrangos)
            {
                if (obj.diasdesde <= diasvencido && obj.diashasta >= diasvencido)
                {
                    ccalificaion = obj.ccalificacion;
                    break;
                }
            }
            return ccalificaion;
        }


    }
}
