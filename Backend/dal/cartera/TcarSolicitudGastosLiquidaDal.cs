using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// ClaseClase que implemeta, dml's manuales de la tabla TcarSolicitudGastosLiquidaDto.
    /// </summary>
    public class TcarSolicitudGastosLiquidaDal {

        /// <summary>
        /// Consulta los gastos de liquidacion asociadas a una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>List TcarSolicitudGastosLiquidaDto</returns>
        public static List<tcarsolicitudgastosliquida> Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudgastosliquida.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
        }

        /// <summary>
        /// Metodo que transforma cargos de liquidacion asociados a una solicitud de credito, 
        /// a una lista de cargos de liquidacion asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="lsolicitudgastos">Lista de cargos de liquidacion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>List TcarOperacionGastosLiquidaDto </returns>
        public static List<tcaroperaciongastosliquida> ToTcarSolicitudGastosLiquida(List<tcarsolicitudgastosliquida> lsolicitudgastos, string coperacion)
        {
            List<tcaroperaciongastosliquida> lcargos = new List<tcaroperaciongastosliquida>();
            foreach (tcarsolicitudgastosliquida sol in lsolicitudgastos) {
                tcaroperaciongastosliquida t = new tcaroperaciongastosliquida();
                t.coperacion = (coperacion);
                t.csaldo = (sol.csaldo);
                t.secuencia = (sol.secuencia);
                t.financiar = (sol.financiar);
                t.monto = (sol.monto);
                t.fpago = (sol.fpago);
                t.mensaje = (sol.mensaje);
                lcargos.Add(t);
            }
            return lcargos;
        }

        /// <summary>
        /// Crea un registro de cargos de liquidacion dado los datos de un seguro de desgravamen.
        /// </summary>
        /// <param name="tcarSolicitudSegDesgra">Objeto que contiene informacion de un seguro de desgravamen.</param>
        /// <param name="csaldoseguro">Codigo de saldo del seguro de desgrqravamen.</param>
        /// <returns>TcarSolicitudGastosLiquidaDto</returns>
        public static tcarsolicitudgastosliquida CreateTcarSolicitudGastosLiquida(tcarsolicitudseguros tcarSolicitudSeguro, string csaldoseguro)
        {
            tcarsolicitudgastosliquida gastoliq = new tcarsolicitudgastosliquida();
            gastoliq.csolicitud = (tcarSolicitudSeguro.csolicitud);
            gastoliq.csaldo = (csaldoseguro);
            gastoliq.financiar = (false);

            decimal monto = (decimal)tcarSolicitudSeguro.montoseguro;
            gastoliq.monto = (monto);
            return gastoliq;
        }

        /// <summary>
        /// Actualiza la fecha de pago de gasto de liquidacion.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="fpago">Fecha de pago.</param>
        /// <param name="mensaje">Mensaje de pago.</param>
        public static void UpdatePagoSolicitudGastosLiquida(long csolicitud, int fpago, string mensaje, string ccomprobante)
        {
            List<tcarsolicitudgastosliquida> lgastos = TcarSolicitudGastosLiquidaDal.Find(csolicitud);
            foreach (tcarsolicitudgastosliquida gas in lgastos) {
                gas.fpago = fpago;
                gas.mensaje = mensaje;
                gas.ccomprobante = ccomprobante;
                Sessionef.Actualizar(gas);
            }
        }

        /**
         * Elimina registros de cargos de liquidacion asociadas a una solicitud.
         */
        private static String JPQL_DELETE = "delete from TcarSolicitudGastosLiquida where csolicitud = @csolicitud";

        /// <summary>
        /// Elimina registros de cargos de liquidacion asociados a una solicitud.
        /// </summary>
        /// <param name="csolicitud">Numero de solicituud.</param>
        public static void Delete(long csolicitud)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("csolicitud", csolicitud));

        }

        /**
         * Sentencia que reversa gastos de liquidacion cobrados en una operacion de cartera.
         */
        private static String JPQL_REVERSO = "update TcarSolicitudGastosLiquida set fpago = null, mensaje = null, pagadocaja = null where mensaje = @mensaje";

        /// <summary>
        /// Reversa gastos de liquidacion asociadas a una solicitud de cartera.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje a reversar.</param>
        public static void Reversar(string mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_REVERSO, new SqlParameter("@mensaje", mensaje));
        }

        /// <summary>
        /// Entrega el valor a descontar por concepto de gastos de liquidacion.
        /// </summary>
        /// <param name="csolicitud">Numero de operacion de credito.</param>
        /// <returns>decimal</returns>
        public static decimal GetDescuento(long csolicitud)
        {
            return TcarSolicitudGastosLiquidaDal.GetValor(csolicitud, false);
        }

        /// <summary>
        /// Enterag el valor a financiar o descontar.
        /// </summary>
        /// <param name="csolicitud">Numero de operacion de credito</param>
        /// <param name="financiar">true, entrega el valor a financiar. false entrega el valor a descontar.</param>
        /// <returns>decimal</returns>
        private static decimal GetValor(long csolicitud, Boolean financiar)
        {
            List<tcarsolicitudgastosliquida> lcargos = TcarSolicitudGastosLiquidaDal.Find(csolicitud);
            return TcarSolicitudGastosLiquidaDal.GetValor(lcargos, financiar);
        }

        public static decimal GetValor(List<tcarsolicitudgastosliquida> lcargos, Boolean financiar)
        {
            decimal valor = Constantes.CERO;
            foreach (tcarsolicitudgastosliquida obj in lcargos) {
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
