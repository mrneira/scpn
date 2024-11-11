using dal.garantias;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.seguros {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TsgsSeguroDto.
    /// </summary>

    public class TsgsSeguroDal {
        /// <summary>
        /// Consulta en la base de datos la definicion del seguro.
        /// </summary>
        /// <param name="coperacioncartera">Codigo de operacion de cartera.</param>
        /// <param name="coperaciongarantia">Codigo de operacion de garantia.</param>
        /// <returns>TsgsSeguroDto</returns>
        /// 
        public static tsgsseguro Find(string coperacioncartera, string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tsgsseguro.AsNoTracking().Where(x => x.coperacioncartera == coperacioncartera && x.coperaciongarantia == coperaciongarantia).SingleOrDefault();
        }

        /// <summary>
        /// Consulta en la base de datos la definicion del seguro.
        /// </summary>
        /// <param name="coperacioncartera">Codigo de operacion de cartera.</param>
        /// <returns>TsgsSeguroDto</returns>
        /// 
        public static tsgsseguro FindToCartera(string coperacioncartera)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tsgsseguro.AsNoTracking().Where(x => x.coperacioncartera == coperacioncartera).SingleOrDefault();
        }

        /// <summary>
        /// Consulta en la base de datos la definicion del seguro.
        /// </summary>
        /// <param name="coperaciongarantia">Codigo de operacion de garantia.</param>
        /// <returns>TsgsSeguroDto</returns>
        /// 
        public static tsgsseguro FindToGarantia(string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tsgsseguro.AsNoTracking().Where(x => x.coperaciongarantia == coperaciongarantia).SingleOrDefault();
        }

        /// <summary>
        /// Transforma las garantias asociadas a la operacion a seguros.
        /// </summary>
        /// <param name="lsolicitudseguros">Lista de seguros de la solicitud.</param>
        /// <param name="rq">Request de mantenimiento.</param>
        /// <returns></returns>
        public static List<tsgsseguro> ToTsgsSeguro(IList<tcarsolicitudseguros> lsolicitudseguros, RqMantenimiento rq)
        {
            List<tsgsseguro> lseguros = new List<tsgsseguro>();
            foreach (tcarsolicitudseguros seg in lsolicitudseguros) {
                tgaroperacion gar = TgarOperacionDal.FindSinBloqueo(seg.coperaciongarantia);

                tsgsseguro s = new tsgsseguro();
                s.coperacioncartera = rq.Coperacion;
                s.coperaciongarantia = seg.coperaciongarantia;
                s.cpersona = gar.cpersona;
                s.ccompania = rq.Ccompania;
                s.ctiposeguro = seg.ctiposeguro;
                s.valorprimaretenida = seg.montoseguro;
                s.cusuarioing = rq.Cusuario;
                s.fingreso = rq.Fconatable;
                s.incremento = gar.renovacion.Value;
                lseguros.Add(s);
            }
            return lseguros;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion del seguro.
        /// </summary>
        /// <param name="coperacioncartera">Codigo de operacion de cartera.</param>
        /// <param name="coperaciongarantia">Codigo de operacion de garantia.</param>
        /// <returns>TsgsSeguroDto</returns>
        /// 
        public static tsgsseguro FindIncremento(string coperacioncartera, string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tsgsseguro.AsNoTracking().Where(x => x.coperacioncartera == coperacioncartera && x.coperaciongarantia == coperaciongarantia && x.incremento == true).SingleOrDefault();
        }

        /// <summary>
        /// Consulta en la base de datos la definicion del seguro.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <returns>TsgsSeguroDto</returns>
        /// 
        public static tsgsseguro FindModificacionSeguro(int cpersona, string coperacioncartera, string coperaciongrantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            tsgsseguro obj = contexto.tsgsseguro.Where(x => x.cpersona == cpersona && x.coperacioncartera == coperacioncartera && x.coperaciongarantia == coperaciongrantia && x.valorprimaretenida > 0 && x.secuenciapoliza == null && x.incremento == false).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la lista de seguros si fué por incremento.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <returns>TsgsSeguro</returns>
        ///
        public static List<tsgsseguro> FindPolizasCan(long cpersona) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tsgsseguro> lseguros = contexto.tsgsseguro.Where(x => x.cpersona == cpersona).ToList();

            return lseguros;
        }
    }
}
