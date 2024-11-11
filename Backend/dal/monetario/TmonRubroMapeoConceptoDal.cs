using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;


namespace dal.monetario {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TmonRubroMapeoConcepto
    /// </summary>
    public class TmonRubroMapeoConceptoDal {

        /// <summary>
        /// Metodo que entrega la definicion de mapeo de rubros de pantalla a rubros de transaccion por concepto. Busca los datos en cahce, si no  encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="ctransacccion">Codigo de transaccion.</param>
        /// <param name="cconcepto">Codigo de concepto.</param>
        /// <returns>IList<TmonRubroMapeoConceptoDto></returns>
        public static IList<tmonrubromapeoconcepto> Find(int cmodulo, int ctransacccion, int cconcepto) {
            IList<tmonrubromapeoconcepto> ldatos = null;
            String key = "" + cmodulo + "^" + ctransacccion + "^" + cconcepto;
            CacheStore cs = CacheStore.Instance;
            ldatos = (IList<tmonrubromapeoconcepto>)cs.GetDatos("tmonrubromapeoconcepto", key);
            if (ldatos == null) {
                ConcurrentDictionary<String, Object> m = cs.GetMapDefinicion("tmonrubromapeoconcepto");
                ldatos = FindInDataBase(cmodulo, ctransacccion, cconcepto);
                m[key] = ldatos;
                cs.PutDatos("tmonrubromapeoconcepto", m);
            }
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de mapeos de rubros de pantalla a rubros de transaccion.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="ctransacccion">Codigo de transaccion.</param>
        /// <param name="cconcepto">Codigo de concepto.</param>
        /// <returns></returns>
        public static IList<tmonrubromapeoconcepto> FindInDataBase(int cmodulo, int ctransacccion, int cconcepto) {
            List<tmonrubromapeoconcepto> ldatos = new List<tmonrubromapeoconcepto>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                ldatos = contexto.tmonrubromapeoconcepto.Where(x => x.ctransaccion == ctransacccion &&
                                                                    x.cmodulo == cmodulo &&
                                                                    x.cconcepto == cconcepto).ToList();
                if (ldatos.Count <= 0) {
                    throw new AtlasException("BMON-007", "MAPEO DE RUBROS NO DEFINIDOS EN TMONRUBROMAPEOCONCEPTO MODULO: {0} TRANSACCION: {1} CONCEPTO: {2}", cmodulo, ctransacccion, cconcepto);
                }
            } catch (System.InvalidOperationException) {
                throw;
            }
            return ldatos;
        }

        /// <summary>
        /// Entrega la definicion de un rubro de mapeo, dado un codigo de rubro de pantalla.
        /// </summary>
        /// <param name="lmapeo">Lista de rubros de mapeo.</param>
        /// <param name="crubropantalla">Codigo de rubro a buscar que llega desde la pantalla.</param>
        /// <returns>TmonRubroMapeoConceptoDto</returns>
        public static tmonrubromapeoconcepto FindPorRubroPantalla(IList<tmonrubromapeoconcepto> lmapeo, int crubropantalla) {
            tmonrubromapeoconcepto mapeo = null;
            foreach (tmonrubromapeoconcepto obj in lmapeo) {
                if (obj.crubropantalla == crubropantalla) {
                    mapeo = obj;
                    break;
                }
            }
            if (mapeo == null) {
                throw new AtlasException("BMON-008",
                        "MAPEO DE RUBROS NO DEFINIDOS EN TMONRUBROMAPEOCONCEPTO MODULO: {0} TRANSACCION: {1} CONCEPTO: {2} RUBROPANTALLA: {3}",
                        lmapeo.ElementAt(0).cmodulo, lmapeo.ElementAt(0).ctransaccion, lmapeo.ElementAt(0).cconcepto,
                        lmapeo.ElementAt(0).crubropantalla);
            }
            return mapeo;
        }

        /// <summary>
        /// Entrega la definicion de un rubro de mapeo, dado un codigo de rubro en el cual esta el monto base.
        /// </summary>
        /// <param name="lmapeo">Lista de rubros de mapeo.</param>
        /// <param name="crubromontobase">Codigo de rubro a buscar.</param>
        /// <returns></returns>
        public static tmonrubromapeoconcepto FindPorRubroBase(IList<tmonrubromapeoconcepto> lmapeo, int crubromontobase) {
            tmonrubromapeoconcepto mapeo = null;
            foreach (tmonrubromapeoconcepto obj in lmapeo) {
                if (obj.crubro == crubromontobase) {
                    mapeo = obj;
                    break;
                }
            }
            if (mapeo == null) {
                throw new AtlasException(
                        "BMON-009",
                        "MAPEO DE RUBROS NO DEFINIDOS EN TMONRUBROMAPEOCONCEPTO MODULO: {0} TRANSACCION: {1} CONCEPTO: {2} RUBROMONTOBASE: {3}",
                        lmapeo.ElementAt(0).cmodulo, lmapeo.ElementAt(0).ctransaccion, lmapeo.ElementAt(0).cconcepto,
                        lmapeo.ElementAt(0).rubromontobase);
            }
            return mapeo;
        }

        /// <summary>
        /// Remplaza el rubro que llega desde la pantalla con el codigo de rubro definido en TmonRubroMapeoConcepto.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion monetaria.</param>
        public static void MapearRubros(RqMantenimiento rqmantenimiento) {
            int cconcepto = (int)rqmantenimiento.GetInt("cconcepto");
            List<RqRubro> lrqrubros = rqmantenimiento.Rubros;
            if (lrqrubros == null) {
                return;
            }
            IList<tmonrubromapeoconcepto> lmapeo = TmonRubroMapeoConceptoDal.Find(rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion, cconcepto);
            foreach (RqRubro rqRubro in lrqrubros) {
                tmonrubromapeoconcepto mapeo = TmonRubroMapeoConceptoDal.FindPorRubroPantalla(lmapeo, rqRubro.Rubro);
                rqRubro.Rubro = (int)mapeo.crubro;
            }
        }

    }
}
