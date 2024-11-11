using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionGastosLiquida.
    /// </summary>
    public class TcarOperacionGastosLiquidaDal {

        /// <summary>
        /// Consulta los gastos de liquidacion asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>TcarOperacionGastosLiquida</returns>
        public static List<tcaroperaciongastosliquida> Find(String coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcaroperaciongastosliquida> lmovi = contexto.tcaroperaciongastosliquida.AsNoTracking().Where(x => x.coperacion == coperacion).ToList();
            return lmovi;
        }

        /// <summary>
        /// Reversa gastos de liquidacion asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <param name="mensaje">Numero de mensaje a reversar.</param>
        private static String JPQL_REVERSO = "update tcaroperaciongastosliquida set fpago = null, mensaje = null where coperacion = @coperacion and mensaje = @mensaje";
        public static void Reversar(String coperacion, String mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_REVERSO, new SqlParameter("mensaje", mensaje), new SqlParameter("coperacion", coperacion));
        }

        /// <summary>
        /// Entrega el valor a descontar por concepto de gastos de liquidacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de credito.</param>
        /// <returns>decimal</returns>
        public static decimal GetDescuento(String coperacion)
        {
            return TcarOperacionGastosLiquidaDal.GetValor(coperacion, false);
        }

        /// <summary>
        /// Entrega el valor a financiar por concepto de gastos de liquidacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de credito.</param>
        /// <returns>decimal</returns>
        public static decimal GetFinanciamiento(String coperacion)
        {
            return TcarOperacionGastosLiquidaDal.GetValor(coperacion, true);
        }

        /// <summary>
        /// Enterag el valor a financiar o descontar.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de credito</param>
        /// <param name="financiar">true, entrega el valor a financiar. false entrega el valor a descontar.</param>
        /// <returns>decimal</returns>
        private static decimal GetValor(String coperacion, Boolean financiar)
        {
            List<tcaroperaciongastosliquida> lcargos = TcarOperacionGastosLiquidaDal.Find(coperacion);
            return TcarOperacionGastosLiquidaDal.GetValor(lcargos, financiar);
        }

        public static decimal GetValor(List<tcaroperaciongastosliquida> lcargos, Boolean financiar)
        {
            decimal valor = Constantes.CERO;
            foreach (tcaroperaciongastosliquida obj in lcargos) {
                if (obj.fpago != null) {
                    continue;
                }
                if (financiar && (bool)obj.financiar) {
                    valor = valor + (decimal)obj.monto;
                }
                if (!financiar && !(bool)obj.financiar) {
                    valor = valor + (decimal)obj.monto;
                }
            }
            return valor;
        }
    }
}
