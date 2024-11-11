using dal.generales;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.contabilidad
{

    public class TconComprobanteDal
    {
        /// <summary>
        /// completa el comprobante
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cabecera"></param>
        /// <param name="ccomprobante"></param>
        public static void Completar(RqMantenimiento rqmantenimiento, tconcomprobante cabecera, string ccomprobante)
        {
            if (cabecera.fcontable == 0)
            {
                cabecera.fcontable = rqmantenimiento.Fconatable;
            }
            if (cabecera.ccomprobante == null)
            {
                cabecera.ccomprobante = ccomprobante;
                cabecera.particion = Constantes.GetParticion((int)cabecera.fcontable);
                cabecera.cusuarioing = (string)rqmantenimiento.Cusuario;
                cabecera.cusuariopresupuesto = TconParametrosDal.FindXCodigo("CUSUARIOPRESUPUESTO", rqmantenimiento.Ccompania).texto;
                cabecera.cusuariocontador = TconParametrosDal.FindXCodigo("CUSUARIOCONTADOR", rqmantenimiento.Ccompania).texto;
                cabecera.cusuariocaja = TconParametrosDal.FindXCodigo("CUSUARIOCAJA", rqmantenimiento.Ccompania).texto;
                cabecera.cusuariotesoreria = TconParametrosDal.FindXCodigo("CUSUARIOTESORERIA", rqmantenimiento.Ccompania).texto;
                cabecera.cmodulo = rqmantenimiento.Cmodulo;
                cabecera.ctransaccion = rqmantenimiento.Ctransaccion;
                cabecera.fingreso = rqmantenimiento.Freal;
                cabecera.freal = rqmantenimiento.Freal;
                cabecera.cconcepto = 3;
                cabecera.fproceso = rqmantenimiento.Fproceso;
                cabecera.optlock = 0;
                cabecera.automatico = false;
                cabecera.actualizosaldo = false;
                cabecera.anulado = false;
                cabecera.eliminado = false;
                cabecera.cagencia = rqmantenimiento.Cagencia;
                cabecera.csucursal = rqmantenimiento.Csucursal;
            }
            cabecera.comentario = cabecera.comentario.Trim();
            if ((bool)rqmantenimiento.Mdatos["cuadrado"])
            {
                cabecera.cuadrado = true;
            }
            else
            {
                cabecera.cuadrado = false;
            }
        }

        /// <summary>
        /// crea el comprobante
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="requestoperacion"></param>
        /// <param name="ccomprobante"></param>
        /// <param name="fcontable"></param>
        /// <returns></returns>
        public static tconcomprobante Crear(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion, String ccomprobante, int fcontable)
        {
            tcontipocomprobantetransaccion tipocomprobante = TconTipoComprobanteTransaccionDal.Find(rqmantenimiento.Cmodulotranoriginal, rqmantenimiento.Ctranoriginal);

            tconcomprobante obj = new tconcomprobante();
            obj.ccomprobante = ccomprobante;
            obj.fcontable = fcontable;
            obj.particion = Constantes.GetParticion((int)fcontable);
            obj.ccompania = rqmantenimiento.Ccompania;
            obj.optlock = 0;
            obj.cusuarioing = rqmantenimiento.Cusuario;
            obj.freal = rqmantenimiento.Freal;
            obj.fproceso = rqmantenimiento.Fproceso;
            obj.comentario = "PROCESO BATCH : " + TgenSucursalDal.Find(rqmantenimiento.Csucursal, rqmantenimiento.Ccompania).nombre
                            + " - " + TgenAgenciaDal.Find(rqmantenimiento.Cagencia, rqmantenimiento.Csucursal, rqmantenimiento.Ccompania).nombre
                            + " - MODULO " + TgenModuloDal.Find(rqmantenimiento.Cmodulotranoriginal).nombre
                            + " - TRANSACCION " + TgentransaccionDal.Find(rqmantenimiento.Cmodulotranoriginal, rqmantenimiento.Ctranoriginal).nombre;
            //+ " - PRODUCTO " + TgenProductoDal.Find(rqmantenimiento.Cmoduloproducto,rqmantenimiento.Cproducto).nombre 
            //+ " - TIPOPRODUCTO " + TgenTipoProductoDal.Find(rqmantenimiento.Cmoduloproducto,rqmantenimiento.Cproducto,rqmantenimiento.Ctipoproducto).nombre;
            obj.automatico = true; // se crea como automatico para contabilizacion de modulos.
            obj.cuadrado = true;
            obj.actualizosaldo = false;
            obj.eliminado = false;
            obj.anulado = false;
            obj.cagencia = rqmantenimiento.Cagencia;
            obj.csucursal = rqmantenimiento.Csucursal;
            obj.cmodulo = rqmantenimiento.Cmodulotranoriginal;
            obj.ctransaccion = rqmantenimiento.Ctranoriginal;
            obj.tipodocumentoccatalogo = 1003;
            obj.tipodocumentocdetalle = tipocomprobante == null ? "DIAGEN" : tipocomprobante.tipodocumentocdetalle;
            obj.cconcepto = 3;
            Sessionef.Save(obj);
            return obj;
        }

        /// <summary>
        /// Entrega un lista de cabecera de comprobantes contables pendientes de actualizar saldos.
        /// </summary>
        /// <param name="fultimaactualizacion">Fecha de ultima actualizacion de saldos contables.</param>
        /// <returns>IList<TconComprobanteDto></returns>
        public static List<tconcomprobante> Find(int fultimaactualizacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconcomprobante> lista = new List<tconcomprobante>();
            try
            {
                lista = contexto.tconcomprobante.Where(x => x.fcontable > fultimaactualizacion &&
                                                                    x.actualizosaldo.Value.Equals(false)).OrderBy(x => x.fcontable).ThenBy(x => x.ccomprobante).ToList();

            }
            catch (System.InvalidOperationException)
            {
                throw;
            }
            return lista;
        }

        /// <summary>
        /// Entrega cabecera de un comprobante contable.
        /// </summary>
        /// <param name="ccomprobante">Numero de comprobante contable.</param>
        /// <param name="fcontable">Fecha contable en la que se realizo el comprobante contable.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns>TconComprobanteDto</returns>
        public static tconcomprobante Find(string ccomprobante, int fcontable, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcomprobante obj = null;
            obj = contexto.tconcomprobante.Where(x => x.ccompania == ccompania &&
                                                        x.ccomprobante.Equals(ccomprobante) &&
                                                        x.fcontable == fcontable).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega cabecera de un comprobante contable.
        /// </summary>
        /// <param name="ccomprobante">Numero de comprobante contable.</param>
        /// <param name="fcontable">Fecha contable en la que se realizo el comprobante contable.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns>TconComprobanteDto</returns>
        public static tconcomprobante Find(string ccomprobante, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcomprobante obj = null;
            obj = contexto.tconcomprobante.Where(x => x.ccompania == ccompania &&
                                                        x.ccomprobante.Equals(ccomprobante)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega cabecera de un comprobante contable.
        /// </summary>
        /// <param name="ccomprobante">Numero de comprobante contable.</param>
        /// <param name="fcontable">Fecha contable en la que se realizo el comprobante contable.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns>TconComprobanteDto</returns>
        public static tconcomprobante FindComprobante(string ccomprobante, int fcontable, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcomprobante obj = null;
            obj = contexto.tconcomprobante.Include("tconconcepto").Where(x => x.ccompania == ccompania &&
                                                        x.ccomprobante.Equals(ccomprobante) &&
                                                        x.fcontable == fcontable).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega cabecera de un comprobante contable.
        /// </summary>
        /// <param name="ccomprobante">Numero de comprobante contable.</param>
        /// <returns>TconComprobanteDto</returns>
        public static tconcomprobante FindComprobante(string ccomprobante)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcomprobante obj = null;
            obj = contexto.tconcomprobante.Where(x => x.ccomprobante.Equals(ccomprobante)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        //RRO 20220920
        public static List<tconcomprobante> FindRangoFecha(int finicio, int ffin)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconcomprobante> lista = new List<tconcomprobante>();
            try
            {
                lista = contexto.tconcomprobante.Where(x => x.fcontable >= finicio && x.fcontable <= ffin).OrderBy(x => x.fcontable).ThenBy(x => x.ccomprobante).ToList();

            }
            catch (System.InvalidOperationException)
            {
                throw;
            }
            return lista;
        }

        /// <summary>
        /// elimina un comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="comprobante"></param>
        public static void Eliminar(RqMantenimiento rqmantenimiento, tconcomprobante comprobante)
        {
            comprobante = FindComprobante(comprobante.ccomprobante, comprobante.fcontable, comprobante.ccompania);
            comprobante.eliminado = true;
            comprobante.cusuariomod = rqmantenimiento.Cusuario;
            comprobante.fmodificacion = rqmantenimiento.Freal;
            rqmantenimiento.Actualizar = true;
            rqmantenimiento.Mtablas["CABECERA"] = null;
            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
        }

        #region SQL_COMPROBANTES_PARA_MAYORIZAR
        private static string SQL_1 = "select c.ccomprobante,c.numerocomprobantecesantia, " +
                                " c.fcontable,c.freal, c.cusuarioing, 0 as 'mayorizar', sum(d.monto) as 'valor' , " +
                                " (select o.nombre from tconconcepto o where o.cconcepto = c.cconcepto) as 'nconcepto',  " +
                                " (select a.nombre from tgenagencia a where a.cagencia = c.cagenciaingreso and a.csucursal = c.csucursalingreso and a.ccompania = 1) as 'nagenciaingreso',  " +
                                " (select s.nombre from tgensucursal s where s.csucursal = c.csucursalingreso and s.ccompania = 1) as 'nsucursalingreso' " +
                                " from tconcomprobantedetalle d inner join tconcomprobante c on c.ccomprobante = d.ccomprobante " +
                                " and d.fcontable = c.fcontable and d.particion = c.particion and d.ccompania = c.ccompania " +
                                " where c.cmodulo = 10 and c.anulado = 0 and c.eliminado = 0 and c.actualizosaldo = 0 and c.cuadrado = 1 and c.automatico = 0 and d.debito = 1 " +
                                " and c.fcontable >= @fcontableini  and c.fcontable <= @fcontablefin " +
                                " group by c.ccomprobante,c.numerocomprobantecesantia,  c.fcontable,c.freal, c.cusuarioing, " +
                                " c.cagenciaingreso, c.csucursalingreso, c.cconcepto ";

        private static string SQL_2 = "select c.ccomprobante,c.numerocomprobantecesantia, " +
                                " c.fcontable,c.freal, c.cusuarioing, 0 as 'mayorizar', sum(d.monto) as 'valor' , " +
                                " (select o.nombre from tconconcepto o where o.cconcepto = c.cconcepto) as 'nconcepto',  " +
                                " (select a.nombre from tgenagencia a where a.cagencia = c.cagenciaingreso and a.csucursal = c.csucursalingreso and a.ccompania = 1) as 'nagenciaingreso',  " +
                                " (select s.nombre from tgensucursal s where s.csucursal = c.csucursalingreso and s.ccompania = 1) as 'nsucursalingreso' " +
                                " from tconcomprobantedetalle d inner join tconcomprobante c on c.ccomprobante = d.ccomprobante " +
                                " and d.fcontable = c.fcontable and d.particion = c.particion and d.ccompania = c.ccompania " +
                                " where c.cmodulo = 10 and c.anulado = 0 and c.eliminado = 0 and c.actualizosaldo = 0 and c.cuadrado = 1 and c.automatico = 0 and d.debito = 1 " +
                                " and c.fcontable >= @fcontableini  and c.fcontable <= @fcontablefin " +
                                " and c.tipodocumentocdetalle = @tipodocumentocdetalle " +
                                " group by c.ccomprobante,c.numerocomprobantecesantia,  c.fcontable,c.freal, c.cusuarioing, " +
                                " c.cagenciaingreso, c.csucursalingreso, c.cconcepto ";

        #endregion
        /// <summary>
        /// obtiene la lista de comprobantes para mayorizar
        /// </summary>
        /// <param name="ccomprobante"></param>
        /// <param name="fini"></param>
        /// <param name="ffin"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindComprobantesParaMayorizar(string tipodocumentocdetalle, long fini, long ffin)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@tipodocumentocdetalle"] = tipodocumentocdetalle;
            parametros["@fcontableini"] = fini;
            parametros["@fcontablefin"] = ffin;
            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, tipodocumentocdetalle == "" ? SQL_1 : SQL_2);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }


        #region SQL_COMPROBANTES_PARA_ANULAR
        private static string SQL_ANU_1 = "select c.ccomprobante,c.numerocomprobantecesantia, " +
                                " c.fcontable,c.freal, c.cusuarioing, 0 as 'anular', sum(d.monto) as 'valor' , " +
                                " (select o.nombre from tconconcepto o where o.cconcepto = c.cconcepto) as 'nconcepto',  " +
                                " (select a.nombre from tgenagencia a where a.cagencia = c.cagenciaingreso and a.csucursal = c.csucursalingreso and a.ccompania = 1) as 'nagenciaingreso',  " +
                                " (select s.nombre from tgensucursal s where s.csucursal = c.csucursalingreso and s.ccompania = 1) as 'nsucursalingreso' " +
                                " from tconcomprobantedetalle d inner join tconcomprobante c on c.ccomprobante = d.ccomprobante " +
                                " and d.fcontable = c.fcontable and d.particion = c.particion and d.ccompania = c.ccompania " +
                                " where c.cmodulo = 10 and c.anulado = 0 and c.eliminado = 0 and c.actualizosaldo = 1 and c.cuadrado = 1 and  c.automatico = 0 and d.debito = 1 " +
                                " and c.fcontable >= @fcontableini  and c.fcontable <= @fcontablefin " +
                                " and c.ccomprobante like '%' + @ccomprobante " +
                                " group by c.ccomprobante,c.numerocomprobantecesantia,  c.fcontable,c.freal, c.cusuarioing, " +
                                " c.cagenciaingreso, c.csucursalingreso, c.cconcepto ";

        private static string SQL_ANU_2 = "select c.ccomprobante,c.numerocomprobantecesantia, " +
                                " c.fcontable,c.freal, c.cusuarioing, 0 as 'anular', sum(d.monto) as 'valor' , " +
                                " (select o.nombre from tconconcepto o where o.cconcepto = c.cconcepto) as 'nconcepto',  " +
                                " (select a.nombre from tgenagencia a where a.cagencia = c.cagenciaingreso and a.csucursal = c.csucursalingreso and a.ccompania = 1) as 'nagenciaingreso',  " +
                                " (select s.nombre from tgensucursal s where s.csucursal = c.csucursalingreso and s.ccompania = 1) as 'nsucursalingreso' " +
                                " from tconcomprobantedetalle d inner join tconcomprobante c on c.ccomprobante = d.ccomprobante " +
                                " and d.fcontable = c.fcontable and d.particion = c.particion and d.ccompania = c.ccompania " +
                                " where c.cmodulo = 10 and c.anulado = 0 and c.eliminado = 0 and c.actualizosaldo = 1 and c.cuadrado = 1 and c.automatico = 0 and d.debito = 1 " +
                                " and c.fcontable >= @fcontableini  and c.fcontable <= @fcontablefin " +
                                " and c.ccomprobante = @ccomprobante " +
                                " group by c.ccomprobante,c.numerocomprobantecesantia,  c.fcontable,c.freal, c.cusuarioing, " +
                                " c.cagenciaingreso, c.csucursalingreso, c.cconcepto ";

        #endregion
        /// <summary>
        /// obtiene la lista de comprobantes para mayorizar
        /// </summary>
        /// <param name="ccomprobante"></param>
        /// <param name="fini"></param>
        /// <param name="ffin"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindComprobantesParaAnular(string ccomprobante, long fini, long ffin)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@ccomprobante"] = ccomprobante;
            parametros["@fcontableini"] = fini;
            parametros["@fcontablefin"] = ffin;
            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, ccomprobante == "" ? SQL_ANU_1 : SQL_ANU_2);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        public static tconcomprobante DuplicarComprobanteConFContableActual(tconcomprobante comprobanteOriginal, string ccomprobante, RqMantenimiento rqmantenimiento)
        {
            tconcomprobante comprobanteDuplicado = (tconcomprobante)comprobanteOriginal.Clone();
            comprobanteDuplicado.ccomprobante = ccomprobante;
            comprobanteDuplicado.fcontable = rqmantenimiento.Fconatable;
            comprobanteDuplicado.particion = Constantes.GetParticion(rqmantenimiento.Fconatable);
            comprobanteDuplicado.ccompania = rqmantenimiento.Ccompania;
            comprobanteDuplicado.fingreso = rqmantenimiento.Freal;
            comprobanteDuplicado.freal = rqmantenimiento.Freal;
            comprobanteDuplicado.cusuarioing = rqmantenimiento.Cusuario;
            comprobanteDuplicado.Esnuevo = true;
            return comprobanteDuplicado;
        }

        /// <summary>
        /// crear un comprobante
        /// </summary>
        /// <param name="ccomprobante"></param>
        /// <param name="fcontable"></param>
        /// <param name="particion"></param>
        /// <param name="ccompania"></param>
        /// <param name="optlock"></param>
        /// <param name="tipopersona"></param>
        /// <param name="cpersonarecibido"></param>
        /// <param name="ccomprobanteanulacion"></param>
        /// <param name="freal"></param>
        /// <param name="fproceso"></param>
        /// <param name="comentario"></param>
        /// <param name="automatico"></param>
        /// <param name="cuadrado"></param>
        /// <param name="actualizosaldo"></param>
        /// <param name="anulado"></param>
        /// <param name="eliminado"></param>
        /// <param name="ruteopresupuesto"></param>
        /// <param name="aprobadopresupuesto"></param>
        /// <param name="cplantilla"></param>
        /// <param name="cconcepto"></param>
        /// <param name="cagenciaingreso"></param>
        /// <param name="csucursalingreso"></param>
        /// <param name="ctransaccion"></param>
        /// <param name="cmodulo"></param>
        /// <param name="tipodocumentoccatalogo"></param>
        /// <param name="tipodocumentocdetalle"></param>
        /// <param name="cagencia"></param>
        /// <param name="csucursal"></param>
        /// <param name="montocomprobante"></param>
        /// <param name="numerocomprobantecesantia"></param>
        /// <param name="numerodocumentobancario"></param>
        /// <param name="cusuarioadministrador"></param>
        /// <param name="cusuariopresupuesto"></param>
        /// <param name="cusuariocontador"></param>
        /// <param name="cusuariocaja"></param>
        /// <param name="cusuariotesoreria"></param>
        /// <param name="cusuarioing"></param>
        /// <param name="fingreso"></param>
        /// <param name="cusuariomod"></param>
        /// <param name="fmodificacion"></param>
        /// <returns></returns>
        public static tconcomprobante CrearComprobante(string ccomprobante, int fcontable, int particion, int ccompania, long? optlock,
        string tipopersona, long? cpersonarecibido, string ccomprobanteanulacion, DateTime? freal, int? fproceso, string comentario, bool? automatico, bool? cuadrado,
        bool? actualizosaldo, bool? anulado, bool? eliminado, bool ruteopresupuesto, bool aprobadopresupuesto, int? cplantilla, int? cconcepto,
        int? cagenciaingreso, int? csucursalingreso, int? ctransaccion, int? cmodulo, int? tipodocumentoccatalogo, string tipodocumentocdetalle, int? cagencia,
        int? csucursal, decimal? montocomprobante, string numerocomprobantecesantia, string numerodocumentobancario, string cusuarioadministrador, string cusuariopresupuesto,
        string cusuariocontador, string cusuariocaja, string cusuariotesoreria, string cusuarioing, DateTime? fingreso, string cusuariomod, DateTime? fmodificacion)
        {
            tconcomprobante comprobante = new tconcomprobante();
            comprobante.ccomprobante = ccomprobante;
            comprobante.fcontable = fcontable;
            comprobante.particion = particion;
            comprobante.ccompania = ccompania;
            comprobante.optlock = optlock;
            comprobante.tipopersona = tipopersona;
            comprobante.cpersonarecibido = cpersonarecibido;
            comprobante.ccomprobanteanulacion = ccomprobanteanulacion;
            comprobante.freal = freal;
            comprobante.fproceso = fproceso;
            comprobante.comentario = comentario;
            comprobante.automatico = automatico;
            comprobante.cuadrado = cuadrado;
            comprobante.actualizosaldo = actualizosaldo;
            comprobante.anulado = anulado;
            comprobante.eliminado = eliminado;
            comprobante.ruteopresupuesto = ruteopresupuesto;
            comprobante.aprobadopresupuesto = aprobadopresupuesto;
            comprobante.cplantilla = cplantilla;
            comprobante.cconcepto = cconcepto == null ? 3 : cconcepto;
            comprobante.cagenciaingreso = cagenciaingreso;
            comprobante.csucursalingreso = csucursalingreso;
            comprobante.ctransaccion = ctransaccion;
            comprobante.cmodulo = cmodulo;
            comprobante.tipodocumentoccatalogo = tipodocumentoccatalogo;
            comprobante.tipodocumentocdetalle = tipodocumentocdetalle;
            comprobante.cagencia = cagencia;
            comprobante.csucursal = csucursal;
            comprobante.montocomprobante = montocomprobante;
            comprobante.numerocomprobantecesantia = numerocomprobantecesantia;
            comprobante.numerodocumentobancario = numerodocumentobancario;
            comprobante.cusuarioadministrador = cusuarioadministrador;
            comprobante.cusuariopresupuesto = TconParametrosDal.FindXCodigo("CUSUARIOPRESUPUESTO", ccompania).texto;
            comprobante.cusuariocontador = TconParametrosDal.FindXCodigo("CUSUARIOCONTADOR", ccompania).texto;
            comprobante.cusuariocaja = TconParametrosDal.FindXCodigo("CUSUARIOCAJA", ccompania).texto;
            comprobante.cusuariotesoreria = TconParametrosDal.FindXCodigo("CUSUARIOTESORERIA", ccompania).texto;
            comprobante.cusuarioing = cusuarioing;
            comprobante.fingreso = fingreso;
            comprobante.cusuariomod = cusuariomod;
            comprobante.fmodificacion = fmodificacion;
            return comprobante;
        }
    }

}
