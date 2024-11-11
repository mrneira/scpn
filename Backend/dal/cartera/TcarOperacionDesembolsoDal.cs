using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionDesembolsoDto.
    /// </summary>
    public class TcarOperacionDesembolsoDal {
        /// <summary>
        /// Entrega una lista con datos a acreditar desembolso de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>TcarOperacionDesembolsoDto</returns>
        public static List<tcaroperaciondesembolso> Find(String coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcaroperaciondesembolso> ldatos = contexto.tcaroperaciondesembolso.AsNoTracking().Where(x => x.coperacion.Equals(coperacion)).ToList();
            return ldatos;
        }

        /// <summary>
        /// Metodo que entrega una lista de pagos por operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <param name="mensaje">Mensaje de transaccion.</param>
        /// <returns>TcarOperacionDesembolsoDto</returns>
        public static List<tcaroperaciondesembolso> Find(string coperacion, string mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcaroperaciondesembolso> rubro = contexto.tcaroperaciondesembolso.Where(x => x.coperacion == coperacion && x.mensaje == mensaje).ToList();
            return rubro;
        }

        /// <summary>
        /// Entrega una lista con datos a acreditar desembolso de cartera por tipo.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>TcarOperacionDesembolsoDto</returns>
        public static List<tcaroperaciondesembolso> FindToTipo(String coperacion, String tipo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcaroperaciondesembolso> ldatos = contexto.tcaroperaciondesembolso.AsNoTracking().Where(x => x.coperacion.Equals(coperacion) && x.tipo.Equals(tipo)).ToList();
            return ldatos;
        }

        /// <summary>
        /// Entrega el monto a desembolsar.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>decimal</returns>
        public static decimal GetCreditos(String coperacion)
        {
            decimal monto = Constantes.CERO;
            List<tcaroperaciondesembolso> ldatos = TcarOperacionDesembolsoDal.Find(coperacion);
            foreach (tcaroperaciondesembolso obj in ldatos) {
                monto = monto + (decimal)obj.valor;
            }
            return monto;
        }

        /// <summary>
        /// Reversa desembolsos asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <param name="mensaje">Numero de mensaje a reversar.</param>
        private static String JPQL_REVERSO = "update tcaroperaciondesembolso set mensaje = null, pagado = 0, fpago = null where coperacion = @coperacion and mensaje = @mensaje";
        public static void Reversar(String coperacion, String mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_REVERSO, new SqlParameter("coperacion", coperacion), new SqlParameter("mensaje", mensaje));
        }

        /// <summary>
        /// Reversa desembolsos asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <param name="mensaje">Numero de mensaje a reversar.</param>
        private static String JPQL_REVERSO_LIQ_PAR = "update tcaroperaciondesembolso set mensaje = null, transferencia = 0, pagado = 0, fpago = null where coperacion = @coperacion and mensaje = @mensaje";
        public static void ReversarLiquidacionParcial(String coperacion, String mensaje) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_REVERSO_LIQ_PAR, new SqlParameter("coperacion", coperacion), new SqlParameter("mensaje", mensaje));
        }

        /// <summary>
        /// Elimina registros de desembolso por operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns></returns>
        private static String JPQL_DELETE = "delete from TcarOperacionDesembolso where coperacion = @coperacion ";
        public static void Delete(String coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("coperacion", coperacion));
        }

        public static int FindMaxSecuencia(string coperacion)
        {
            int secuenciaMaxima = 0;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcaroperaciondesembolso> ldatos = contexto.tcaroperaciondesembolso.AsNoTracking().Where(x => x.coperacion.Equals(coperacion)).OrderBy(y => y.secuencia).ToList();
            secuenciaMaxima = ldatos[ldatos.Count-1].secuencia;
            return secuenciaMaxima;
        }
    }
}
