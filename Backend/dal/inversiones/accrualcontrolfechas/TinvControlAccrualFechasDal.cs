using util.servicios.ef;
using modelo;
using System.Collections.Generic;
using modelo.servicios;

namespace dal.inversiones.accrualcontrolfechas
{
    /// <summary>
    /// Clase que encapsula los procedimientos para ejecutar las operaciones con el Coontrol del Accrual del Interés para las Fechas.
    /// </summary>

    public class TinvControlAccrualFechasDal
    {

        private static string DELE = "delete from tinvcontrolaccrualfechas";

        /// <summary>
        /// Elimna tabla tinvagentebolsa.
        /// </summary>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }


    }
}
