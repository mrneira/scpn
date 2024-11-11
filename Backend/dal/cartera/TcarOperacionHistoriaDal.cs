using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionHistoria.
    /// </summary>
    public class TcarOperacionHistoriaDal {

        /// <summary>
        /// Busca en la base de datos un registro de historia de TcarOperacionHistoria, dado el numero de mensaje y operacion.
        /// </summary>
        /// <param name="coperacion"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public static tcaroperacionhistoria Find(string coperacion, string message) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacionhistoria obj = contexto.tcaroperacionhistoria.Where(x => x.coperacion == coperacion && x.mensaje.Equals(message)).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BCAR-0005", "REGISTRO DE HISTORIA NO EXISTE EN TCAROPERACIONHISTORIA COPERACION: {0}, MENSAJE: {1} ", coperacion, message);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Metodo que crea y entraga un registro de historia de datos de una operacion de cartera.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene los datos de una operacion de cartera.</param>
        /// <param name="mensaje">Numero de mensaje a remplazar en tcaroperacion.</param>
        /// <returns></returns>
        public static void CreaHistoria(tcaroperacion tcaroperacion, String mensaje, int fproceso) {
            if ((tcaroperacion.fvigencia > fproceso) || Constantes.EsUno(tcaroperacion.GetString("registrohistoria"))) {
                return;
            }
            int fcaducidad = Fecha.AdicionaDias365(fproceso, -1);
            tcaroperacionhistoria obj = new tcaroperacionhistoria();
            obj.mensaje = tcaroperacion.mensaje;
            obj.coperacion = tcaroperacion.coperacion;
            obj.fcaducidad = fcaducidad;

            List<string> lcampos = DtoUtil.GetCamposSinPK(tcaroperacion);
            foreach (string campo in lcampos) {
                if (campo.Equals("mensaje")) {
                    continue;
                }
                try {
                    Object valor = DtoUtil.GetValorCampo(tcaroperacion, campo);
                    DtoUtil.SetValorCampo(obj, campo, valor);
                } catch (Exception) {
                    throw new AtlasException("BCAR-0004", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE HISTORIA: {1} ", campo, obj.GetType().Name);
                }
            }
            Sessionef.Save(obj);
            // cambia numeros de mensaje de operacion.
            tcaroperacion.mensajeanterior = tcaroperacion.mensaje;
            tcaroperacion.mensaje = mensaje;
            tcaroperacion.fvigencia = fproceso;
            tcaroperacion.AddDatos("registrohistoria", "1");
        }

    }
}
