using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.socio {
    public class TsocNovedadadesHistoriaDal {

        /// <summary>
        /// Metodo que crea y entraga un registro de historia de datos de una novedad.
        /// </summary>
        /// <param name="tsocnovedadades">Objeto que contiene los datos de una operacion de novedad de un socio.</param>
        /// <param name="fproceso">Fecha de proceso con el que se genera el historico.</param>
        /// <returns></returns>
        public static void CreaHistoria(tsocnovedadades tsocnovedadades, int fproceso) {
            if ((tsocnovedadades.fvigencia >= fproceso) || Constantes.EsUno(tsocnovedadades.GetString("registrohistoria"))) {
                return;
            }
            int fcaducidad = Fecha.AdicionaDias365(fproceso, -1);
            tsocnovedadadeshistoria obj = new tsocnovedadadeshistoria();
            obj.novedad = tsocnovedadades.novedad;
            obj.fcaducidad = fcaducidad;

            List<string> lcampos = DtoUtil.GetCamposSinPK(tsocnovedadades);
            foreach (string campo in lcampos) {
                try {
                    Object valor = DtoUtil.GetValorCampo(tsocnovedadades, campo);
                    DtoUtil.SetValorCampo(obj, campo, valor);
                } catch (Exception) {
                    throw new AtlasException("PRE-028", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE HISTORIA: {1} ", campo, obj.GetType().Name);
                }
            }
            Sessionef.Save(obj);
            // cambia numeros de mensaje de operacion.
            tsocnovedadades.fvigencia = fproceso;
            tsocnovedadades.AddDatos("registrohistoria", "1");
        }

        
    }
}
