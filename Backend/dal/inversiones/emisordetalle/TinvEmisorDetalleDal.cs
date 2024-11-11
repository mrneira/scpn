using modelo;
using util.servicios.ef;
using System;
using dal.inversiones.catalogos;

namespace dal.inversiones.emisordetalle
{
    /// <summary>
    /// Clase que encapsula los procedimientos para operar la información de los emisores de instrumentos financieros.
    /// </summary>
    public class TinvEmisorDetalleDal
    {
        private static string DELE = "delete from tinvemisordetalle";

        /// <summary>
        /// Elimna la tabla detalle de emisores.
        /// </summary>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }

        /// <summary>
        /// Crear un nuevo registro en la tabla tinvemisordetalle.
        /// </summary>
        /// <param name="icemisordetalle">Identificador numérico del catálogo detalle del emisor.</param>
        /// <param name="iemisorccatalogo">Identificador del catálogo del emisor.</param>
        /// <param name="iemisorcdetalle">Identificador del catálogo detalle del emisor.</param>
        /// <param name="icalificacionriesgoactualcdetalle">Identificador de la calificación de riesgo del emisor.</param>
        /// <param name="icusuarioing">Identificador del usuario que crea el nuevo emisor.</param>
        /// <param name="isectorcdetalle">Identificador del sector el cual pertenece emisor.</param>
        /// <returns>string[]</returns>
        public static string[] crearNuevo(
            ref long icemisordetalle
            ,int iemisorccatalogo
            ,string iemisorcdetalle
            , string icalificacionriesgoactualcdetalle
            , string icusuarioing
            , string isectorcdetalle)
        {

            string[] lRetorna = new string[2];

            if (icalificacionriesgoactualcdetalle != null && icalificacionriesgoactualcdetalle.ToString().Trim().Length > 0)
            {
                icalificacionriesgoactualcdetalle = TinvCatalogoDetalleDal.FindPorNombre(1207, icalificacionriesgoactualcdetalle);

                lRetorna[0] = icalificacionriesgoactualcdetalle;

            }


            if (isectorcdetalle != null && isectorcdetalle.ToString().Trim().Length > 0)
            {
                isectorcdetalle = TinvCatalogoDetalleDal.FindPorNombre(1205, isectorcdetalle);

                lRetorna[1] = isectorcdetalle;

            }


            icemisordetalle++;
            tinvemisordetalle tInvEmisorDetalle = new tinvemisordetalle();
            tInvEmisorDetalle.emisorccatalogo = iemisorccatalogo;

            tInvEmisorDetalle.emisorcdetalle = iemisorcdetalle;

            tInvEmisorDetalle.cemisordetalle = icemisordetalle;

            if (icalificacionriesgoactualcdetalle != null && icalificacionriesgoactualcdetalle.Trim() != "")
            {
                tInvEmisorDetalle.calificacionriesgoactualccatalogo = 1207;
                tInvEmisorDetalle.calificacionriesgoactualcdetalle = icalificacionriesgoactualcdetalle;
            }

            tInvEmisorDetalle.fingreso = DateTime.Now;
            tInvEmisorDetalle.cusuarioing = icusuarioing;

            if (isectorcdetalle != null && isectorcdetalle.Trim() != "")
            {
                tInvEmisorDetalle.sectorccatalogo = 1205;
                tInvEmisorDetalle.sectorcdetalle = isectorcdetalle;
            }
            Sessionef.Grabar(tInvEmisorDetalle);

            return lRetorna;

        }


    }
}
