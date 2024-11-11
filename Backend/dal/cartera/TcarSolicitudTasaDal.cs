using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarSolicitudTasaDto.
    /// </summary>

    public class TcarSolicitudTasaDal {

        /// <summary>
        /// Consulta las tasas asociadas a una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns> List<TcarSolicitudTasaDto></returns>
        public static IList<tcarsolicitudtasa> Find(long csolicitud) {
            IList<tcarsolicitudtasa> ldatos;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudtasa.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
        }

        /// <summary>
        /// Metodo que transforma tasas asociados a una solicitud de credito, a una lista de tasas asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="ltcarsolicitudtasa">Lista de tasas asociadas a la solicitud.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns> List<TcarOperacionTasaDto></returns>
        public static List<tcaroperaciontasa> ToTcarOperacionTasa(List<tcarsolicitudtasa> ltcarsolicitudtasa, String coperacion) {
            List<tcaroperaciontasa> ltasa = new List<tcaroperaciontasa>();
            foreach (tcarsolicitudtasa tasasol in ltcarsolicitudtasa) {
                tcaroperaciontasa t = new tcaroperaciontasa();
                t.coperacion = coperacion;
                t.csaldo = tasasol.csaldo;
                t.cmoneda = (tasasol.cmoneda);
                t.ctasareferencial = (tasasol.ctasareferencial);
                t.margen = (tasasol.margen);
                t.operador = (tasasol.operador);
                t.tasa = (tasasol.tasa);
                t.tasabase = (tasasol.tasabase);
                t.tasaefectiva = (tasasol.tasaefectiva);
                ltasa.Add(t);
            }
            return ltasa;
        }

        public static tcarsolicitudtasa CreateTcarSolicitudTasa(tcarsegmentotasas tasaSegmento) {
            tcarsolicitudtasa tasa = new tcarsolicitudtasa();
            tasa.csaldo = tasaSegmento.csaldo;
            tasa.cmoneda = (tasaSegmento.cmoneda);
            tasa.ctasareferencial = (int)(tasaSegmento.ctasareferencial);
            tasa.operador = (tasaSegmento.operador);
            tasa.margen = (tasaSegmento.margen);
            return tasa;
        }

        public static tcarsolicitudtasa CreateTcarSolicitudTasaFrec(tcarsegmentotasasfrec tasaSegmento) {
            tcarsolicitudtasa tasa = new tcarsolicitudtasa();
            tasa.csaldo = tasaSegmento.csaldo;
            tasa.cmoneda = (tasaSegmento.cmoneda);
            tasa.ctasareferencial = (int)(tasaSegmento.ctasareferencial);
            tasa.operador = (tasaSegmento.operador);
            tasa.margen = (tasaSegmento.margen);
            return tasa;
        }

        public static tcarsolicitudtasa CreateTcarSolicitudTasa(tcarproductotasas tasaproducto) {
            tcarsolicitudtasa tasa = new tcarsolicitudtasa();
            tasa.csaldo = (tasaproducto.csaldo);
            tasa.cmoneda = (tasaproducto.cmoneda);
            tasa.ctasareferencial = (int)(tasaproducto.ctasareferencial);
            tasa.operador = (tasaproducto.operador);
            tasa.margen = (tasaproducto.margen);
            return tasa;
        }

        private static String JPQL_DELETE = "delete from TcarSolicitudTasa  where csolicitud = @csolicitud";

        /// <summary>
        /// Elimina registros de tasas asociados a una solicitud.
        /// </summary>
        /// <param name="csolicitud">Numero de solicituud.</param>
        /// <returns> List<TcarOperacionTasaDto></returns>
        public static void Delete(long csolicitud) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("@csolicitud", csolicitud));
        }
    }
}
