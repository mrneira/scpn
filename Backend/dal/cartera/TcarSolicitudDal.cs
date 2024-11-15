using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.dto.consulta;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarSolicitud.
    /// </summary>
    public class TcarSolicitudDal {

        /// <summary>
        /// Consulta en la base de datos la definicion de una solicitud de credito, y bloquea el registro en la base de datos.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>TcarSolicitud</returns>
        public static tcarsolicitud FindWithLock(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitud.AsNoTracking().Where(x => x.csolicitud == csolicitud).Single();
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>TcarSolicitud</returns>
        public static tcarsolicitud Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitud.AsNoTracking().Where(x => x.csolicitud == csolicitud).Single();
        }

        /// <summary>
        /// Metodo que completa informacion de la solicitud de credito con los datos del producto.
        /// </summary>
        /// <param name="tcarsolicitid">Objeto que contiene la informacion de credito.</param>
        public static void CompletaDatosdelProducto(tcarsolicitud tcarsolicitid)
        {
            tcarproducto producto = TcarProductoDal.Find((int)tcarsolicitid.cmodulo, (int)tcarsolicitid.cproducto, (int)tcarsolicitid.ctipoproducto);
            if (tcarsolicitid.cbasecalculo == null) {
                // si no llega base de calculo completar del producto.
                tcarsolicitid.cbasecalculo = (producto.cbasecalculo);
            }
            if (tcarsolicitid.cfrecuecia == null) {
                // si no llega base de calculo completar del producto.
                tcarsolicitid.cfrecuecia = (producto.cfrecuecia);
            }
            if (tcarsolicitid.periodicidadcapital == null) {
                // si no llega base de calculo completar del producto.
                tcarsolicitid.periodicidadcapital = (producto.periodicidadcapital);
            }
            // Informacion a completar del producto.
            tcarsolicitid.ctipocredito = (producto.ctipocredito);
            tcarsolicitid.tasareajustable = (producto.tasareajustable);
            tcarsolicitid.mantieneplazo = (producto.mantieneplazo);
            tcarsolicitid.numerocuotasreajuste = (producto.numerocuotasreajuste);
            tcarsolicitid.csegmento = (producto.csegmento);
        }

        /// <summary>
        /// Metodo que transforma los datos de una solicitud de credito en un objeto con datos de una operacion de cartera.
        /// </summary>
        /// <param name="tcarsolicitud">Dalos de la solicitud.</param>
        /// <param name="rqmantenimiento">Datos del request de entrada.</param>
        /// <returns>TcarOperacionDto</returns>
        public static tcaroperacion ToTcarOperacion(tcarsolicitud tcarsolicitud, RqMantenimiento rqmantenimiento)
        {
            tcaroperacion t = new tcaroperacion();
            t.fvigencia = (rqmantenimiento.Ftrabajo);
            t.cpersona = (tcarsolicitud.cpersona);
            t.cmodulo = (tcarsolicitud.cmodulo);
            t.cproducto = (tcarsolicitud.cproducto);
            t.ctipoproducto = (tcarsolicitud.ctipoproducto);
            t.ccompania = (tcarsolicitud.ccompania);
            t.cmoneda = (tcarsolicitud.cmoneda);
            t.cagencia = (tcarsolicitud.cagencia);
            t.csucursal = (tcarsolicitud.csucursal);
            t.ctipocredito = (tcarsolicitud.ctipocredito);
            t.cusuarioapertura = (tcarsolicitud.cusuarioingreso);
            t.cusuarioaprobacion = rqmantenimiento.Cusuario;
            t.cestatus = ("APR");
            t.ccondicionoperativa = ("NOR");
            t.cfrecuecia = (tcarsolicitud.cfrecuecia);
            t.ctabla = (tcarsolicitud.ctabla);
            t.cbasecalculo = (tcarsolicitud.cbasecalculo);
            t.faprobacion = (rqmantenimiento.Ftrabajo);
            t.fgeneraciontabla = (rqmantenimiento.Ftrabajo);
            t.periodicidadcapital = (tcarsolicitud.periodicidadcapital);
            t.tasareajustable = (tcarsolicitud.tasareajustable);
            t.numerocuotasreajuste = (tcarsolicitud.numerocuotasreajuste);
            t.montooriginal = (tcarsolicitud.montooriginal);
            t.monto = (tcarsolicitud.monto);
            t.cuotafija = (tcarsolicitud.cuotafija);
            t.valorcuota = (tcarsolicitud.valorcuota);
            t.diapago = (tcarsolicitud.diapago);
            t.finiciopagos = (tcarsolicitud.finiciopagos);
            t.cuotainicio = (tcarsolicitud.cuotainicio);
            t.numerocuotas = (tcarsolicitud.numerocuotas);
            t.cuotasgracia = (tcarsolicitud.cuotasgracia);
            t.plazo = (tcarsolicitud.plazo);
            t.mantieneplazo = (tcarsolicitud.mantieneplazo);
            t.mensaje = (rqmantenimiento.Mensaje);
            t.tasa = (tcarsolicitud.tasa);
            t.cestadooperacion = (tcarsolicitud.cestadooperacion ?? "N");
            t.csituacionoperacion = ("N");
            t.csolicitud = (tcarsolicitud.csolicitud);
            t.mesnogeneracuota = (tcarsolicitud.mesnogeneracuota);
            t.csegmento = (tcarsolicitud.csegmento);
            t.numcuotaprorrateo = (tcarsolicitud.numcuotaprorrateo);
            t.montoarreglopago = (tcarsolicitud.montoarreglopago);
            return t;
        }

        public object Clone()
        {
            throw new NotImplementedException();
        }


        /// <summary>
        /// Sentencia que permite buscar Solicitudes a partir de un código de persona.
        /// </summary>
        private static string JPQL = "select tp.nombre producto, tt.nombre tipo, tm.nombre moneda, te.nombre estatus, ts.montooriginal, ts.csolicitud" +
                                     " from tgenproducto tp, tgentipoproducto tt, tgenmoneda tm, tcarsolicitud ts, tcarestatussolicitud te" +
                                     " where TS.CTIPOPRODUCTO = TT.CTIPOPRODUCTO" +
                                     " AND TS.CMONEDA = TM.CMONEDA" +
                                     " AND TS.CESTATUSSOLICITUD = TE.CESTATUSSOLICITUD" +
                                     " AND TS.CPRODUCTO = TP.CPRODUCTO AND TS.CMODULO = TP.CMODULO" +
                                     " AND TS.CMODULO = TT.CMODULO AND TS.CPRODUCTO = TT.CPRODUCTO AND TS.CTIPOPRODUCTO = TT.CTIPOPRODUCTO" +
                                     " AND TS.CESTATUSSOLICITUD NOT IN ('CAN','NEG','REP','SIM')" +
                                     " AND TS.CPERSONA = @cpersona" +
                                     " order by ts.csolicitud ";
        /// <summary>
        /// Consulta datos de usuario.
        /// </summary>
        /// <param name="dtoconsulta">Objeto que contien los datos necearios para armar y ejecutar una busqueda.</param>
        public static IList<Dictionary<string, object>> ConsultarLovSolicitud(DtoConsulta dtoconsulta, RqConsulta rqconsulta)
        {

            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = rqconsulta.Mdatos["cpersona"];

            List<string> lcampos = new List<string>();
            lcampos.Add("ruta");
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, JPQL);
            ch.registrosporpagina = 1000;
            IList<Dictionary<string, object>> listaRutas = ch.GetRegistrosDictionary();
            return listaRutas;
        }

        /// <summary>
        /// Consulta las solicitudes por persona.
        /// </summary>
        /// <param name="cpersona">Codigo de persona a buscar.</param>
        /// <returns>IList<TcarOperacionDto></returns>
        public static List<tcarsolicitud> FindPorPersona(long cpersona, bool activas)
        {
            // Estatus de operaciones no activas
            List<string> lestatus = new List<string> { "ANU", "APR", "CAN", "NEG", "REP", "SIM" };

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcarsolicitud> ldata = contexto.tcarsolicitud.AsNoTracking().Where(x => x.cpersona == cpersona
                                                                                    && ((activas) ? !lestatus.Contains(x.cestatussolicitud) : lestatus.Contains(x.cestatussolicitud))).ToList();
            return ldata;
        }

        /// <summary>
        /// Consulta de simulaciones por cestatus
        /// </summary>
        /// <param name="cestatussolicitud">estado de solicitud.</param>
        public static List<tcarsolicitud> FindBycestatus(string cestatussolicitud)
        {
            List<tcarsolicitud> obj = new List<tcarsolicitud>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcarsolicitud.AsNoTracking().Where(x => x.cestatussolicitud == cestatussolicitud).ToList();
            return obj;
        }

        /// <summary>
        /// Eliminar simulaciones.
        /// </summary>
        /// <param name="cestatussolicitud">Código de estatus solicitud.</param>
        public static void EliminarSimulacion(Dictionary<string, string> entidades, string tablaMaestra, string campoTablaMaestra, string cestatussolicitud)
        {
            List<tcarsolicitud> simulaciones = FindBycestatus(cestatussolicitud);
            foreach (tcarsolicitud solicitud in simulaciones) {
                string JPQL = "delete from {0} where {1} = {2}";
                foreach (KeyValuePair<string, string> entidad in entidades) {
                    string sql = string.Format(JPQL, entidad.Key, entidad.Value, solicitud.csolicitud);
                    AtlasContexto contexto = Sessionef.GetAtlasContexto();
                    contexto.Database.ExecuteSqlCommand(sql);
                }
                string JPQLMAESTRA = "delete from tgensolicitud where csolicitud = @csolicitud";
                AtlasContexto contextoMaster = Sessionef.GetAtlasContexto();
                contextoMaster.Database.ExecuteSqlCommand(JPQLMAESTRA, new SqlParameter("@csolicitud", solicitud.csolicitud));
            }
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>TcarSolicitud</returns>
        public static tcarsolicitud FindAlerta(long csolicitud)
        {
            List<string> lestatus = new List<string> { "ANU", "NEG", "SIM" };
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitud.AsNoTracking().Where(x => x.csolicitud == csolicitud && !lestatus.Equals(x.cestatussolicitud) ).Single();
        }
    }
}
