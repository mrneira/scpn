using dal.cobranzas;
using modelo;
using modelo.helper;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacion.
    /// </summary>
    public class TcarOperacionDal {

        /// <summary>
        /// Codigo de estatus de cartera vigente.
        /// </summary>
        private static string VIGENTE = "VIG";
        /// <summary>
        /// Codigo de estatus de cartera vencida.
        /// </summary>
        private static string VENCIDA = "VEN";
        /// <summary>
        /// Codigo de estatus de cartera cancelada.
        /// </summary>
        private static string CANCELADA = "CAN";
        /// <summary>
        /// Codigo de estatus de cartera castigada.
        /// </summary>
        private static string CASTIGADA = "CAS";
        /// Codigo de estatus de cartera aprobada.
        /// </summary>
        private static string APROBADA = "APR";

        /// <summary>
        /// Consulta en la base de datos la definicion de una operacion de cartera, y bloquea el registro en la base de datos.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>TcarOperacionDto</returns>
        public static tcaroperacion FindWithLock(string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacion obj = contexto.tcaroperacion.Where(x => x.coperacion == coperacion).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BCAR-0001", "OPERACION DE CARTERA: {0} NO EXISTE", coperacion == null ? "" : coperacion);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>TcarOperacionDto</returns>

        public static tcaroperacion FindSinBloqueo(string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacion obj = contexto.tcaroperacion.Where(x => x.coperacion == coperacion).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BCAR-0001", "OPERACION DE CARTERA: {0} NO EXISTE", coperacion == null ? "" : coperacion);
            }
            return obj;
        }

        public static tcaroperacion FindToSolicitud(long csolicitud) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacion obj = contexto.tcaroperacion.Where(x => x.csolicitud == csolicitud).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BCAR-0001", "OPERACION DE CARTERA NO EXISTE");
            }
            return obj;
        }

        /// <summary>
        /// Metodo que elimina el registro actual de tcaroperacion y recupera uno de la tabla de historia.
        /// </summary>
        /// <param name="tcaroperacion">Registro original con el cual se obtiene la historia.</param>
        /// <param name="rqmantenimiento">Numero de mensaje con el que se crea historia del registro.</param>
        /// <param name="fcobro">Fecha de cobro de la operacion.</param>
        public static void MarcaOperacionCancelada(tcaroperacion tcaroperacion, RqMantenimiento rqmantenimiento, int fcobro)
        {
            TcarOperacionHistoriaDal.CreaHistoria(tcaroperacion, rqmantenimiento.Mensaje, fcobro);
            tcaroperacion.cestatus = TcarOperacionDal.CANCELADA;
            tcaroperacion.fcancelacion = fcobro;
            tcaroperacion.cusuariocancelacion = rqmantenimiento.Cusuario;

            TcobCobranzaDal.MarcaCobranzaCancelada(tcaroperacion, rqmantenimiento);
        }

        public static void Reversar(tcaroperacion tcaroperacion)
        {
            tcaroperacionhistoria historia = null;
            try {
                historia = TcarOperacionHistoriaDal.Find(tcaroperacion.coperacion, tcaroperacion.mensajeanterior);
            }
            catch (AtlasException e) {
                if (!e.Codigo.Equals("BCAR-0005")) {
                    throw e;
                }
            }
            if (historia != null) {
                RecuperaHistoria(tcaroperacion, historia);
                //Sessionef.Grabar(tcaroperacion);
                Sessionef.Eliminar(historia);
            }
        }

        /// <summary>
        /// Metodo que fija los valores de un registro de historia en un registro vigente de tcaroperacion.
        /// </summary>
        /// <param name="tcaroperacion">Objeto a fijar los datos de historia.</param>
        /// <param name="historia">Objeto desde el cual se copia los datos de historia al registro vigente.</param>
        private static void RecuperaHistoria(tcaroperacion tcaroperacion, tcaroperacionhistoria historia)
        {
            List<string> lcampos = DtoUtil.GetCamposSinPK(tcaroperacion);
            tcaroperacion.mensaje = historia.mensaje;
            foreach (String campo in lcampos) {
                try {
                    if (campo.Equals("mensaje")) {
                        continue;
                    }
                    Object valor = DtoUtil.GetValorCampo(historia, campo);
                    DtoUtil.SetValorCampo(tcaroperacion, campo, valor);
                }
                catch (Exception) {
                    throw new AtlasException("BCAR-0004", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE HISTORIA: {1} ", campo, historia.GetType().Name);
                }
            }
        }

        /// <summary>
        /// Valida que la operacion este vigente.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene datos de la operacion de cartera.</param>
        public static void ValidaOperacionVigente(tcaroperacion tcaroperacion)
        {
            TcarOperacionDal.ValidaOperacion(tcaroperacion, TcarOperacionDal.VIGENTE);
        }

        /// <summary>
        /// Valida que la operacion este vencida.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene datos de la operacion de cartera.</param>
        public static void ValidaOperacionVencida(tcaroperacion tcaroperacion)
        {
            TcarOperacionDal.ValidaOperacion(tcaroperacion, TcarOperacionDal.VENCIDA);
        }

        /// <summary>
        /// Valida que la operacio se encuentre en un estatus especifico.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene datos de la operacion de cartera.</param>
        /// <param name="estatus">Codigo de estatus a valida, si el estatus de la operacion es diferente al parametro retorna una excepcion.</param>
        public static void ValidaOperacion(tcaroperacion tcaroperacion, string estatus)
        {
            if (tcaroperacion.cestatus.CompareTo(estatus) != 0) {
                tcarestatus tcarEstatus = TcarEstatusDal.Find(tcaroperacion.cestatus);
                throw new AtlasException("BCAR-0016", "TRANSACCION NO PERMITIDA PARA OPERACIONES: {0} ", tcarEstatus.nombre);
            }
        }

        /// <summary>
        /// Valida que la operacion no este castigada.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene datos de la operacion de cartera.</param>
        public static void ValidaOperacionNoCastigada(tcaroperacion tcaroperacion)
        {
            if (tcaroperacion.cestatus.CompareTo(TcarOperacionDal.CASTIGADA) == 0) {
                throw new AtlasException("BCAR-0015", "TRANSACCION NO PERMITIDA PARA OPERACIONES CASTIGADAS");
            }
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una operaciones de cartera.
        /// </summary>
        /// <param name="cpersona">Codigo de persona a buscar operaciones.</param>
        /// <returns>IList<TcarOperacionDto></returns>
        public static IList<tcaroperacion> FindPorPersona(long cpersona)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<string> lestatus = new List<string> { "NEG" };
            IList<tcaroperacion> ldata = contexto.tcaroperacion.AsNoTracking().Where(x => x.cpersona == cpersona && !lestatus.Contains(x.cestatus)).ToList();
            return ldata;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una operaciones de cartera.
        /// </summary>
        /// <param name="cpersona">Codigo de persona a buscar operaciones.</param>
        /// <returns>IList<TcarOperacionDto></returns>
        public static IList<tcaroperacion> FindPorPersona(long cpersona, bool activas)
        {
            // Estatus de operaciones no activas
            List<string> lestatus = new List<string> { "CAN" , "NEG" };

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperacion> ldata = contexto.tcaroperacion.AsNoTracking().Where(x => x.cpersona == cpersona
                                                                                     && ((activas) ? !lestatus.Contains(x.cestatus) : lestatus.Contains(x.cestatus))).ToList();
            return ldata;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de una operaciones de cartera.
        /// </summary>
        /// <param name="cpersona">Codigo de persona a buscar operaciones.</param>
        /// <returns>IList<TcarOperacionDto></returns>
        public static IList<tcaroperacion> FindOperacionesConsolidado(long cpersona,int ctipoproducto)
        {
            // Estatus de operaciones no activas
            List<int> lestatus = new List<int> { 4,5,8 };
            List<string> lestatusoperacion = new List<string> { "NEG" };
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperacion> ldata = contexto.tcaroperacion.AsNoTracking().Where(x => x.cpersona == cpersona && x.cproducto==1 
                                                                                     && (x.ctipoproducto==4 || x.ctipoproducto==5 || x.ctipoproducto==8) 
                                                                                     && !lestatusoperacion.Contains(x.cestatus)).ToList();
            return ldata;
        }

        public static IList<tcaroperacion> FindPrestamoPersonaEstado(long cpersona, bool activas, int cproducto)
        {
            // Estatus de operaciones no activas
            List<string> lestatus = new List<string> { "CAN", "NEG" };

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperacion> ldata = contexto.tcaroperacion.AsNoTracking().Where(x => x.cpersona == cpersona
                                                                                     && ((activas) ? !lestatus.Contains(x.cestatus) : lestatus.Contains(x.cestatus))
                                                                                     && x.cproducto == cproducto).ToList();
            return ldata;
        }
        public static IList<tcaroperacion> FindPrestamoPersonaVigentes(long cpersona, bool activas, int cproducto)
        {
            // Estatus de operaciones no activas
            List<string> lestatus = new List<string> { "CAN" ,"VEN","ANU","NEG"};

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperacion> ldata = contexto.tcaroperacion.AsNoTracking().Where(x => x.cpersona == cpersona
                                                                                     && ((activas) ? !lestatus.Contains(x.cestatus) : lestatus.Contains(x.cestatus))
                                                                                     && x.cproducto == cproducto).ToList();
            return ldata;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de una operaciones de cartera.
        /// </summary>
        /// <param name="cpersona">Codigo de persona a buscar operaciones.</param>
        /// <returns>bool<TcarOperacionDto></returns>
        public static bool FindPorPersonaConsolidado(long cpersona)
        {
            bool existe = true;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            var con = (from x in contexto.tcaroperacion
                       from y in contexto.tcarproducto
                       .Where(y => y.ctipoproducto == x.ctipoproducto && y.cproducto == x.cproducto && y.verreg == 0 && x.cpersona == cpersona
                       && y.consolidado == true)
                       select new {
                           x
                       }).ToList();
            if (con.Count == 0) {
                existe = false;
            }
            return existe;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una operaciones de cartera.
        /// </summary>
        /// <param name="cpersona">Codigo de persona a buscar operaciones.</param>
        /// <param name="loperacionesabsorcion">Lista de operaciones a cancelar.</param>
        /// <returns>bool<TcarOperacionDto></returns>
        public static bool FindPorPersonaAportes(long cpersona, List<string> loperacionesabsorcion)
        {
            // Estatus de operaciones no activas
            List<string> lestatus = new List<string> { "CAN", "APR","NEG" };
            bool existe = true;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            var con = (from x in contexto.tcaroperacion
                       from y in contexto.tcarproducto
                       .Where(y => y.ctipoproducto == x.ctipoproducto && y.cproducto == x.cproducto && y.verreg == 0 && x.cpersona == cpersona
                       && y.montoporaportaciones == true && !loperacionesabsorcion.Contains(x.coperacion) && !lestatus.Contains(x.cestatus))
                       select new {
                           x
                       }).ToList();
            if (con.Count == 0) {
                existe = false;
            }
            return existe;
        }

        /// <summary>
        /// Consulta en la base de datos las operaciones por persona
        /// </summary>
        /// <param name="cpersona">Codigo de persona a buscar operaciones.</param>
        /// <returns>IList<TcarOperacionDto></returns>
        public static IList<tcaroperacion> FindPorPersona(long cpersona, int? cproducto = 0, int? ctipoproducto = 0, string cestatus = null)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperacion> ldata = contexto.tcaroperacion.AsNoTracking().Where(x => x.cpersona == cpersona
                                                                                       && x.cproducto == (cproducto == 0 ? x.cproducto : cproducto)
                                                                                       && x.ctipoproducto == (ctipoproducto == 0 ? x.ctipoproducto : ctipoproducto)
                                                                                       && x.cestatus == (cestatus ?? x.cestatus)).ToList();
            return ldata;
        }

        private static string SQL_SALDOS = " select (select coalesce( sum(r.saldo - r.cobrado - r.descuento) ,0) as saldo  from tcaroperacionrubro r, tcaroperacioncuota c "
        + " where c.coperacion = o.coperacion and c.coperacion = r.coperacion and c.numcuota = r.numcuota "
        + " and r.csaldo = 'CAP-CAR' and r.fpago is null and c.cestatus = 'VIG') vigente, "
        + " coalesce((select sum(r.saldo - r.cobrado - r.descuento)  from tcaroperacionrubro r, tcaroperacioncuota c "
        + " where c.coperacion = o.coperacion and c.coperacion = r.coperacion and c.numcuota = r.numcuota "
        + " and r.csaldo = 'CAP-CAR' and r.fpago is null and c.cestatus = 'VEN'),0) vencido, "
        + " coalesce((select sum(r.saldo - r.cobrado - r.descuento)  from tcaroperacionrubro r, tcaroperacioncuota c "
        + " where c.coperacion = o.coperacion and c.coperacion = r.coperacion and c.numcuota = r.numcuota "
        + " and r.csaldo = 'CAP-CAR' and r.fpago is null and c.cestatus = 'NDV'),0) nodevenga  from tcaroperacion o "
        + " where o.coperacion = @coperacion  and fcancelacion is null ";

        /// <summary>
        /// Entrega objeto con los saldos de una operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static List<object> GetSaldos(String coperacion)
        {

            List<object> ldata = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.Database.SqlQuery<object>(SQL_SALDOS, new SqlParameter("coperacion", coperacion)).ToList();
            return ldata;
        }

        private static string SQL_DESCUENTOS = "select * from tcaroperacion"
                                              + "where cestatus in (select cestatus from tcarestatus"
                                              + "where esdescuento = 1)";
        /// <summary>
        /// Entrega todas las operaciones con todos los estados activos del estutus esdescuentro en true
        /// </summary>
        /// <returns></returns>
        public static List<tcaroperacion> FindDescuentos()
        {
            List<tcaroperacion> ldata = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.Database.SqlQuery<tcaroperacion>(SQL_DESCUENTOS).ToList();
            return ldata;
        }

        private static string SQL_OPERACIONES_APORTES = " select * " +
                                                        " from tcaroperacion o, tcarproducto p " +
                                                        " where o.cmodulo = p.cmodulo " +
                                                        " and   o.cproducto = p.cproducto " +
                                                        " and   o.ctipoproducto = p.ctipoproducto " +
                                                        " and   o.cpersona = @cpersona " +
                                                        " and   p.montoporaportaciones = 1 " +
                                                        " and   p.verreg = 0 " +
                                                        " and   o.cestatus not in ('APR','CAN','NEG')";
        /// <summary>
        /// Entrega todas las operaciones activas que tienen comprometidos aportes
        /// </summary>
        /// <returns></returns>
        public static List<tcaroperacion> FindOperacionesAportes(long cpersona)
        {
            List<tcaroperacion> ldata = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.Database.SqlQuery<tcaroperacion>(SQL_OPERACIONES_APORTES, new SqlParameter("cpersona", cpersona)).ToList();
            return ldata;
        }

        private static String JPQL_DELETE_ARREGLO_PAGOS = "delete from tcaroperacion where coperacion = @coperacion ";

        /// <summary>
        /// Ejecuta reverso de arreglo de pagos de la nueva operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion creada en el arreglo de pagos.</param>
        public static void ReversoArregloPagos(String coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE_ARREGLO_PAGOS, new SqlParameter("coperacion", coperacion));
        }

        /// <summary>
        /// Consulta en la base de datos las operaciones aprobadas.
        /// </summary>
        /// <returns>IList<TcarOperacionDto></returns>
        public static IList<tcaroperacion> FindOperacionesDesembolso()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperacion> ldata = contexto.tcaroperacion.AsNoTracking().Where(x => x.cestatus == APROBADA).ToList();
            return ldata;
        }
    }
}
