using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.garantias {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgarOperacionHistoria.
    /// </summary>
    public class TgarOperacionHistoriaDal {

        /// <summary>
        /// Busca en la base de datos un registro de historia de TcarOperacionHistoria, dado el numero de mensaje y operacion.
        /// </summary>
        /// <param name="coperacion"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public static tgaroperacionhistoria Find(string coperacion, string message) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgaroperacionhistoria obj = contexto.tgaroperacionhistoria.Where(x => x.coperacion == coperacion && x.mensaje.Equals(message)).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BGAR-002", "REGISTRO DE HISTORIA NO EXISTE EN TgarOperacionHistoria COPERACION: {0}, MENSAJE: {1} ", coperacion, message);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Metodo que crea y entraga un registro de historia de datos de una operacion de garantia.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene los datos de una operacion de cartera.</param>
        /// <param name="mensaje">Numero de mensaje a remplazar en tcaroperacion.</param>
        /// <returns></returns>
        public static tgaroperacionhistoria CreaHistoria(tgaroperacion tgaroperacion, String mensaje, int fproceso) {
            tgaroperacionhistoria obj = new tgaroperacionhistoria();
            obj.mensaje = tgaroperacion.mensaje;
            obj.coperacion = tgaroperacion.coperacion;

            List<string> lcampos = DtoUtil.GetCamposSinPK(tgaroperacion);
            foreach (string campo in lcampos) {
                if (campo.Equals("mensaje")) {
                    continue;
                }
                try {
                    Object valor = DtoUtil.GetValorCampo(tgaroperacion, campo);
                    DtoUtil.SetValorCampo(obj, campo, valor);
                } catch (Exception) {
                    throw new AtlasException("BGAR-003", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE HISTORIA: {1} ", campo, obj.GetType().Name);
                }
            }
            Sessionef.Save(obj);
            // cambia numeros de mensaje de operacion.
            tgaroperacion.mensajeanterior = tgaroperacion.mensaje;
            tgaroperacion.mensaje = mensaje;
            tgaroperacion.fvigencia = fproceso;
            return obj;
        }

    }
}
