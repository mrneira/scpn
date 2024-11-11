using dal.generales;
using dal.monetario;
using modelo;
using modelo.interfaces;
using modelo.servicios;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.contabilidad
{

    public class TconComprobanteDetalleDal
    {

        public static void Completar(RqMantenimiento rqmantenimiento, tconcomprobantedetalle detalle, string ccomprobante, string cmonedalocal)
        {
            if (detalle.ccomprobante != null)
            {

            }
            if (detalle.fcontable == 0)
            {
                detalle.fcontable = int.Parse(rqmantenimiento.Mdatos["fcontable"].ToString());
            }
            detalle.cclase = TconCatalogoDal.Find((int)detalle.ccompania, detalle.ccuenta).cclase;

            detalle.particion = Constantes.GetParticion((int)detalle.fcontable);
            detalle.cusuario = rqmantenimiento.Cusuario;
            detalle.montooficial = detalle.monto;
            detalle.suma = TmonClaseDal.Suma(detalle.cclase, detalle.debito);
            detalle.cmonedaoficial = cmonedalocal;
            detalle.optlock = 0;
            if (detalle.ccomprobante == null)
            {
                detalle.ccomprobante = ccomprobante;
                detalle.optlock = 0;
                detalle.csucursal = 1;
                detalle.cagencia = 1;
            }
        }

        public static void Completar(RqMantenimiento rqmantenimiento, List<IBean> ldetalle)
        {
            // El numero de comprobante se obtiene en la clase com.flip.modulos.contabilidad.mantenimiento.comprobante.DatosCabecera
            String ccomprobante = rqmantenimiento.Mdatos["ccomprobante"].ToString();
            String cmonedalocal = TgenParametrosDal.GetValorTexto("MONEDALOCAL", rqmantenimiento.Ccompania);
            foreach (tconcomprobantedetalle obj in ldetalle)
            {
                TconComprobanteDetalleDal.Completar(rqmantenimiento, obj, ccomprobante, cmonedalocal);
            }
        }

        public static List<tconcomprobantedetalle> CrearAutomaticos(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion, tconcomprobante cabecera)
        {


            tconparametros parametro_centrocostos_default = TconParametrosDal.FindXCodigo("CENTROCOSTOS_DEFAULT", rqmantenimiento.Ccompania);
            if (parametro_centrocostos_default == null)
            {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CENTROCOSTOS_DEFAULT");
            }
            string centrocostos_default = parametro_centrocostos_default.texto;
            String cmonedalocal = TgenParametrosDal.GetValorTexto("MONEDALOCAL", rqmantenimiento.Ccompania);
            List<tconcomprobantedetalle> ldetalle = new List<tconcomprobantedetalle>();
            // Comprobante previo por sucursal oficiana con el cual se crea el detalle del comprobante.
            IList<tconcomprobanteprevio> lprevio = TconComprobantePrevioDal.Find(requestoperacion, rqmantenimiento.Ccompania,
                    rqmantenimiento.Csucursal, rqmantenimiento.Cagencia, rqmantenimiento.Cmodulotranoriginal,
                    rqmantenimiento.Ctranoriginal, rqmantenimiento.Cproducto, rqmantenimiento.Ctipoproducto);
            int sec = 1;
            foreach (tconcomprobanteprevio previo in lprevio)
            {
                tconcomprobantedetalle obj = TconComprobanteDetalleDal.Crear(cabecera, previo, cmonedalocal, sec, centrocostos_default);
                sec++;
                ldetalle.Add(obj);
            }
            return ldetalle;
        }

        private static tconcomprobantedetalle Crear(tconcomprobante cabecera, tconcomprobanteprevio previo, String cmonedalocal, int secuencia, string centrocostos_default)
        {
            tconcomprobantedetalle obj = new tconcomprobantedetalle();
            obj.ccomprobante = cabecera.ccomprobante;
            obj.fcontable = cabecera.fcontable;
            obj.particion = cabecera.particion;
            obj.ccompania = cabecera.ccompania;
            obj.secuencia = secuencia;
            obj.cclase = previo.cclase;
            obj.optlock = 0;
            obj.cagencia = previo.cagencia;
            obj.csucursal = previo.csucursal;
            obj.ccuenta = previo.ccuenta;
            obj.debito = previo.debito;
            obj.cmoneda = previo.cmoneda;
            obj.cusuario = cabecera.cusuarioing;
            obj.cmonedaoficial = previo.cmonedaoficial;
            obj.monto = previo.monto;
            obj.montooficial = previo.montooficial;
            obj.suma = TmonClaseDal.Suma(obj.cclase, obj.debito);
            obj.centrocostosccatalogo = 1002;
            obj.centrocostoscdetalle = centrocostos_default;
            Sessionef.Save(obj);
            return obj;
        }


        public static List<tconcomprobantedetalle> Find(string ccomprobante, int fcontable, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconcomprobantedetalle> lista = new List<tconcomprobantedetalle>();
            int particion = Constantes.GetParticion(fcontable);
            lista = contexto.tconcomprobantedetalle.AsNoTracking().Where(x => x.ccomprobante.Equals(ccomprobante) &&
                                                                    x.fcontable == fcontable &&
                                                                    x.particion == particion &&
                                                                    x.ccompania == ccompania).OrderBy(x => x.secuencia).ToList();
            return lista;
        }

        //RRO 20220920
        public static List<tconcomprobantedetalle> FindRangoFecha(string ccuenta, int finicio, int ffin)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconcomprobantedetalle> lista = new List<tconcomprobantedetalle>();
            lista = contexto.tconcomprobantedetalle.AsNoTracking().Where(x => x.ccuenta.Equals(ccuenta) && x.fcontable >= finicio && x.fcontable <= ffin).OrderBy(x => x.numerodocumentobancario).ToList();
            return lista;
        }
        public static List<tconcomprobantedetalle> Find(string ccomprobante, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconcomprobantedetalle> lista = new List<tconcomprobantedetalle>();
            lista = contexto.tconcomprobantedetalle.AsNoTracking().Where(x => x.ccomprobante.Equals(ccomprobante) &&

                                                                    x.ccompania == ccompania).OrderBy(x => x.secuencia).ToList();
            return lista;
        }
        public static List<tconcomprobantedetalle> FindPorCuenta(string ccomprobante, int fcontable, int ccompania, string ccuenta)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconcomprobantedetalle> lista = new List<tconcomprobantedetalle>();
            int particion = Constantes.GetParticion(fcontable);
            lista = contexto.tconcomprobantedetalle.AsNoTracking().Where(x => x.ccomprobante.Equals(ccomprobante) &&
                                                                    x.fcontable == fcontable &&
                                                                    x.particion == particion &&
                                                                    x.ccompania == ccompania &&
                                                                    x.ccuenta.Equals(ccuenta)).OrderBy(x => x.secuencia).ToList();
            return lista;
        }

        private static String SQL = " select t.*, c.nombre  from tconcomprobantedetalle t, tconcatalogo c " +
                                    " where t.ccuenta = c.ccuenta and t.ccompania = c.ccompania " +
                                    " and t.ccomprobante = @ccomprobante and t.fcontable = @fcontable " +
                                    " and t.particion = @particion and t.ccompania = @ccompania " +
                                    " and c.tipoplancdetalle = @tipoplancdetalle " +
                                    " order by t.secuencia ";
        public static IList<Dictionary<string, object>> FindComprobanteDetallePorTipoplan(string ccomprobante, int fcontable, int ccompania, string tipoplancdetalle)
        {
            int particion = Constantes.GetParticion(fcontable);
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@ccomprobante"] = ccomprobante;
            parametros["@fcontable"] = fcontable;
            parametros["@particion"] = particion;
            parametros["@ccompania"] = ccompania;
            parametros["@tipoplancdetalle"] = tipoplancdetalle;

            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        public static List<tconcomprobantedetalle> CrearComprobanteDetalleDeAnulacion(List<tconcomprobantedetalle> detOriginal, string ccomprobante)
        {
            List<tconcomprobantedetalle> detAnulacion = new List<tconcomprobantedetalle>();
            foreach (tconcomprobantedetalle obj in detOriginal)
            {
                tconcomprobantedetalle nuevo = new tconcomprobantedetalle();
                nuevo = obj;
                nuevo.ccomprobante = ccomprobante;
                nuevo.suma = !nuevo.suma;
                nuevo.debito = !nuevo.debito;
                detAnulacion.Add(nuevo);
            }
            return detAnulacion;
        }

        public static List<tconcomprobantedetalle> DuplicarComprobanteDetalleConFContableActual(List<tconcomprobantedetalle> detOriginal, string ccomprobante, RqMantenimiento rqmantenimiento)
        {
            List<tconcomprobantedetalle> detDuplicado = new List<tconcomprobantedetalle>();
            foreach (tconcomprobantedetalle obj in detOriginal)
            {
                tconcomprobantedetalle nuevo = new tconcomprobantedetalle();
                nuevo = obj;
                nuevo.Esnuevo = true;
                nuevo.ccomprobante = ccomprobante;
                nuevo.fcontable = rqmantenimiento.Fconatable;
                nuevo.particion = Constantes.GetParticion(rqmantenimiento.Fconatable);
                nuevo.ccompania = rqmantenimiento.Ccompania;
                detDuplicado.Add(nuevo);
            }
            return detDuplicado;
        }

        public static tconcomprobantedetalle FindSecuencia(string iccomprobante, int ifcontable, int isecuencia)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcomprobantedetalle control = null;

            control = contexto.tconcomprobantedetalle.AsNoTracking().Where(x => x.ccomprobante == iccomprobante &&
                x.fcontable.Equals(ifcontable) &&
                x.secuencia.Equals(isecuencia)).SingleOrDefault();
            if (control == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(control);
            return control;
        }

        public static tconcomprobantedetalle CrearComprobanteDetalle(bool esNuevo, tconcomprobante comprobante,
            long? optlock, string ccompromiso, string ccuenta,
            bool? debito, string cclase, string cmoneda, string cmonedaoficial,
            decimal? monto, decimal? montooficial, bool? suma, string numerodocumentobancario, int? centrocostosccatalogo,
            string centrocostoscdetalle, long? conciliacionbancariaid, string cpartida)
        {
            tconcomprobantedetalle cd = new tconcomprobantedetalle();
            cd.Esnuevo = esNuevo;
            cd.ccomprobante = comprobante.ccomprobante;
            cd.fcontable = comprobante.fcontable;
            cd.particion = comprobante.particion;
            cd.ccompania = comprobante.ccompania;
            cd.optlock = optlock.Value;
            cd.ccompromiso = ccompromiso;
            cd.cagencia = comprobante.cagencia.Value;
            cd.csucursal = comprobante.csucursal.Value;
            cd.ccuenta = ccuenta;
            cd.debito = debito.Value;
            cd.cclase = cclase;
            cd.cmoneda = cmoneda;
            cd.cusuario = comprobante.cusuarioing;
            cd.cmonedaoficial = cmonedaoficial;
            cd.monto = monto.Value;
            cd.montooficial = montooficial.Value;
            cd.suma = suma;
            cd.numerodocumentobancario = numerodocumentobancario;
            cd.centrocostosccatalogo = centrocostosccatalogo;
            cd.centrocostoscdetalle = centrocostoscdetalle;
            cd.conciliacionbancariaid = conciliacionbancariaid;
            cd.cpartida = cpartida;
            return cd;
        }

        public static void validarComprobanteDetalle(IList<IBean> lcomprobantedetalle)
        {
            foreach (tconcomprobantedetalle obj in lcomprobantedetalle)
            {
                if (obj.tconcatalogo != null)
                {
                    if (!obj.tconcatalogo.movimiento.Value)
                        throw new AtlasException("CONTA-012", "ERROR: CUENTA CONTABLE [{0}] NO ES DE MOVIMIENTO", obj.ccuenta);
                }

                if (obj.centrocostoscdetalle == "")
                {
                    throw new AtlasException("CONTA-013", "ERROR: CENTRO DE COSTO NO DEFINIDO PARA CUENTA [{0}]", obj.ccuenta);
                }
            }
        }
    }

}
