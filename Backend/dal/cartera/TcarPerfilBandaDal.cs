using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarPerfilBandaDto.
    /// </summary>
    public class TcarPerfilBandaDal {
        /// <summary>
        /// Metodo que entrega la definicion de perfiles de bandas contables de cartera. Busca los datos en cahce, si no encuentra los datos en 
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <param name="cestatus">Codigo de estatus de la cuota.</param>
        /// <param name="cestadooperacion">Codigo de estatus de la operacion de cartera.</param>
        /// <param name="csegmento">Codigo de segmento al que pertenece la operacion de cartera.</param>
        /// <returns></returns>
        public static IList<tcarperfilebanda> Find(int cmodulo, int cproducto, int ctipoproducto, string cestatus, string cestadooperacion, string csegmento) {
            IList<tcarperfilebanda> ldatos = null;
            string key = "" + cmodulo + "^" + cproducto + "^" + ctipoproducto + cestatus + "^" + cestadooperacion + "^" + csegmento;
            CacheStore cs = CacheStore.Instance;
            ldatos = (List<tcarperfilebanda>)cs.GetDatos("tcarperfilebanda", key);
            if (ldatos == null) {
                ConcurrentDictionary<string, Object> m = cs.GetMapDefinicion("tcarperfilebanda");
                ldatos = FindInDataBase(cmodulo, cproducto, ctipoproducto, cestatus, cestadooperacion, csegmento);
                m[key] = ldatos;
                cs.PutDatos("tcarperfilebanda", m);
            }
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de perfiles de badas contables.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <param name="cestatus">Codigo de estatus de la cuota.</param>
        /// <param name="cestadooperacion">Codigo de estatus de la operacion de cartera.</param>
        /// <param name="csegmento">Codigo de segmento al que pertenece la operacion de cartera.</param>
        /// <returns>IList<TcarPerfilBandaDto></returns>
        public static IList<tcarperfilebanda> FindInDataBase(int cmodulo, int cproducto, int ctipoproducto, string cestatus, string cestadooperacion, string csegmento) {

            IList<tcarperfilebanda> ldatos;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldatos = contexto.tcarperfilebanda.Where(x => x.cmodulo.Equals(cmodulo) && x.cproducto.Equals(cproducto) && x.ctipoproducto.Equals(ctipoproducto) && x.cestatus.Equals(cestatus) &&
                                                            x.cestadooperacion.Equals(cestadooperacion) &&
                                                            x.csegmento.Equals(csegmento)).ToList();
            if (ldatos.Count.Equals(0)) {
                throw new AtlasException("BCAR-0018",
                        "BANDAS NO DEFINIDOS TCARPERFILBANDA MODULO: {0} PRODUCTO: {1}  TIPOPRODUCTO: {2} ESTATUS: {3} ESTADO OPERACION: {4}  SEGMENTO: {5}", cmodulo,
                        cproducto, ctipoproducto, cestatus, cestadooperacion, csegmento);
            }
            return ldatos;

        }

        /// <summary>
        /// Entrega la defincion de un perfil contable.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <param name="cestatus">Codigo de estatus de la cuota.</param>
        /// <param name="cestadooperacion">Codigo de estatus de la operacion de cartera.</param>
        /// <param name="csegmento">Codigo de segmento al que pertenece la operacion de cartera.</param>
        /// <param name="dias">Numero de dias a buscar el rango del codigo contable.</param>
        /// <returns></returns>
        public static tcarperfilebanda Find(int cmodulo, int cproducto, int ctipoproducto, string cestatus, string cestadooperacion, string csegmento, int dias) {
            tcarperfilebanda banda = null;
            IList<tcarperfilebanda> ldatos = TcarPerfilBandaDal.Find(cmodulo, cproducto, ctipoproducto, cestatus, cestadooperacion, csegmento);
            foreach (tcarperfilebanda obj in ldatos) {
                if ((dias >= obj.diasdesde) && (dias <= obj.diashasta)) {
                    banda = obj;
                    break;
                }
            }
            if (banda == null) {
                throw new AtlasException("BCAR-0019",
                        "BANDAS NO DEFINIDOS TCARPERFILBANDA MODULO: {0} PRODUCTO: {1}  TIPOPRODUCTO: {2} ESTATUS: {3} ESTADO OPERACION: {4}  SEGMENTO: {5} NUMERO DIAS: {6}",
                        cmodulo, cproducto, ctipoproducto, cestatus, cestadooperacion, csegmento, dias);
            }
            return banda;
        }
    }

}
