using cartera.enums;
using core.servicios;
using dal.tesoreria;
using modelo;
using System;
using tesoreria.enums;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.fin {
    /// <summary>
    /// Clase que se encarga de totalizar la generacion de descuentos.
    /// </summary>
    public class Recaudacion : ITareaFin {

        // Variables
        static int TRX_RECAUDACION = 70;
        static string RUBRO_BANCOS = "BANCOS";

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            TtesRecaudacionDetalleDal.CashVigencia(requestmodulo.Fconatble, ((int)EnumTesoreria.EstadoRecaudacionCash.NoCobrado).ToString());
            CreaRecaudacion(requestmodulo);
            ActualizaComprobante(requestmodulo);
        }

        /// <summary>
        /// Metodo que se encarga de registrar la cabecera de recaudacion.
        /// </summary>
        private void CreaRecaudacion(RequestModulo requestmodulo)
        {
            int ndetalle = TtesRecaudacionDetalleDal.ObtenerRegistrosRecaudacionesPendientes(requestmodulo.Ftrabajo, ((int)EnumRecaudacion.EstadoRecaudacion.Registrado).ToString());

            if (ndetalle > 0) {
                // Cabecera
                ttesrecaudacion recaudacion = new ttesrecaudacion();
                recaudacion.totalcobro = TtesRecaudacionDetalleDal.ObtenerTotalRecaudacionesPendientes(requestmodulo.Ftrabajo, ((int)EnumRecaudacion.EstadoRecaudacion.Registrado).ToString());
                recaudacion.registrosenviado = ndetalle;
                recaudacion.cusuarioing = requestmodulo.Cusuario;
                recaudacion.fingreso = DateTime.Now;
                recaudacion.fcontable = requestmodulo.Fconatble;
                recaudacion.cmodulo = requestmodulo.Cmodulo;
                recaudacion.ctransaccion = TRX_RECAUDACION;
                recaudacion.cestado = ((int)EnumRecaudacion.EstadoRecaudacion.Registrado).ToString();
                recaudacion.crecaudacion = Secuencia.GetProximovalor("SRECAUDET");
                recaudacion.finicio = requestmodulo.Ftrabajo;
                recaudacion.ffin = requestmodulo.Ftrabajo;
                Sessionef.Grabar(recaudacion);

                // Actualiza detalle
                this.ActualizaCodigoDetalle(requestmodulo, recaudacion);
            }
        }

        /// <summary>
        /// Metodo que se encarga de actualizar el codigo de cabecera en el detalle de recaudacion.
        /// </summary>
        private void ActualizaCodigoDetalle(RequestModulo requestmodulo, ttesrecaudacion recaudacion)
        {
            TtesRecaudacionDetalleDal.RegistrarCodigoDetalle(((int)EnumRecaudacion.EstadoRecaudacion.Registrado).ToString(), requestmodulo.Ftrabajo, recaudacion.crecaudacion);
        }

        /// <summary>
        /// Metodo que se encarga de actualizar el comprobante contable de pago cash.
        /// </summary>
        private void ActualizaComprobante(RequestModulo requestmodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            string sql = string.Format("select distinct m.fcontable, d.crecaudaciondetalle, m.coperacion, d.valorprocesado, m.monto, l.ccomprobante, l.cregistro " +
                                       "into   #tmp_conciliacion " +
                                       "from   ttesretroalimentacion r, ttesrecaudaciondetalle d, tcarmovimiento m, tconregistrolote l " +
                                       "where  r.cmodulodestino = m.cmoduloorigen and r.ctransacciondestino = m.ctransaccionorigen " +
                                       "and    d.coperacion = m.coperacion and d.fcontable = m.fcontable and d.fcontable = l.fproceso " +
                                       "and    l.cregistro = RIGHT('0' + CONVERT(VARCHAR, m.csucursalorigen), 2) + '-' + " +
                                       "                     RIGHT('0' + CONVERT(VARCHAR, m.cagenciaorigen), 2) + '-' + " +
                                       "                     RIGHT('0' + CONVERT(VARCHAR, m.cmoduloorigen), 2) + '-' + " +
                                       "                     RIGHT('0000' + CONVERT(VARCHAR, m.ctransaccionorigen), 4) + '-00-00-00' + '-' + " +
                                       "                     RIGHT('00000000' + CONVERT(VARCHAR, m.fcontable), 8) " +
                                       "and    d.cestado = {0} and m.csaldo = '{1}' and d.ccomprobante is null " +
                                       " " +
                                       "update ttesrecaudaciondetalle " +
                                       "set    ttesrecaudaciondetalle.ccomprobante = #tmp_conciliacion.ccomprobante " +
                                       "from   #tmp_conciliacion " +
                                       "where  ttesrecaudaciondetalle.crecaudaciondetalle = #tmp_conciliacion.crecaudaciondetalle " +
                                       "and    ttesrecaudaciondetalle.cestado = {0}", ((int)EnumRecaudacion.EstadoRecaudacion.Cobrado).ToString(), RUBRO_BANCOS);
            contexto.Database.ExecuteSqlCommand(sql);
        }
    }
}
