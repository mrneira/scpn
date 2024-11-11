using modelo;
using modelo.helper;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.cobranzas {
    public class TcobCobranzaDal {

        /// <summary>
        /// Codigo de estatus de cobranza cancelada.
        /// </summary>
        private static string CANCELADA = "CAN";

        /// <summary>
        /// Entrega los datos de cobranza por numero de operacion de cartera
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns></returns>
        public static tcobcobranza Find(string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcobcobranza obj = contexto.tcobcobranza.Where(x => x.coperacion == coperacion).SingleOrDefault();

            return obj;

        }
        public static tcobcobranza FindOperacionUpdate(string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcobcobranza obj = contexto.tcobcobranza.AsNoTracking().Where(x => x.coperacion == coperacion).SingleOrDefault();
            EntityHelper.SetActualizar(obj);
            return obj;
        }


        /// <summary>
        /// Entrega los datos de cobranza por numero de operacion de cartera
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns></returns>
        public static tcobcobranza Find(string coperacion, string cestatus)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcobcobranza obj = contexto.tcobcobranza.AsNoTracking().Where(x => x.coperacion == coperacion && x.cestatus == cestatus).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Entrega los datos de cobranza por numero de operacion de cartera
        /// </summary>
        /// <param name="cestatus">Estado de Cobranza.</param>
        /// <returns></returns>
        public static IList<tcobcobranza> FindEstado(string cestatus)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcobcobranza> obj = contexto.tcobcobranza.AsNoTracking().Where(x => x.cestatus == cestatus).ToList();
            return obj;
        }

        /// <summary>
        /// Enterga una datos vigentes de un usuario.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static tcobcobranza FindCpersona(long? ccobranza, string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcobcobranza obj = null;

            obj = contexto.tcobcobranza.AsNoTracking().Where(x => x.ccobranza == ccobranza && x.coperacion == coperacion).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("COB-001", "COBRANZA NO EXISTE");
            }

            return obj;
        }

        /// <summary>
        /// Enterga una datos vigentes de un usuario.
        /// </summary>
        ///// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="coperacion">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static tcobcobranza FindToCobranza(long ccobranza)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcobcobranza obj = null;

            obj = contexto.tcobcobranza.AsNoTracking().Where(x => x.ccobranza == ccobranza).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("COB-001", "COBRANZA NO EXISTE");
            }
            return obj;
        }

        /// <summary>
        /// Metodo que actualiza la cobranza a cancelada
        /// </summary>
        /// <param name="tcaroperacion">Registro original de operacion.</param>
        /// <param name="rqmantenimiento">Numero de mensaje con el que se crea historia del registro.</param>
        public static void MarcaCobranzaCancelada(tcaroperacion tcaroperacion, RqMantenimiento rqmantenimiento)
        {
            tcobcobranza tcobcobranza = Find(tcaroperacion.coperacion);
            if (tcobcobranza != null) {
                tcobcobranza.cestatus = TcobCobranzaDal.CANCELADA;
                tcobcobranza.fultmodificacion = rqmantenimiento.Fconatable;
                Sessionef.Actualizar(tcobcobranza);
            }
        }

        public static tcobcobranza FindCobranzaByCodigo(string coperacion)
        {
            tcobcobranza obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcobcobranza.AsNoTracking().Where(x => x.coperacion == coperacion).SingleOrDefault();

            return obj;
        }

        public static tcobcobranza FindCobranza(string coperacion)
        {
            tcobcobranza obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcobcobranza.AsNoTracking().Where(x => x.coperacion == coperacion && x.cestatus != "JUD").SingleOrDefault();
            if (obj == null) {
                return null;
            } else {
                return obj;
            }

        }



    }
}
