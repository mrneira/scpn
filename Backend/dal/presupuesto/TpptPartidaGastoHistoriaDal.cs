using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.presupuesto {

    public class TpptPartidaGastoHistoriaDal {

        /// <summary>
        /// Metodo que crea y entraga un registro de historia de datos de una partida presupuestaria.
        /// </summary>
        /// <param name="tpptpartidagasto">Objeto que contiene los datos de una partida presupuestaria.</param>
        /// <param name="fproceso">Fecha de proceso con el que se genera el historico.</param>
        /// <returns></returns>
        public static void CreaHistoria(tpptpartidagasto tpptpartidagasto, int fproceso) {
            if ((tpptpartidagasto.fvigencia >= fproceso) || Constantes.EsUno(tpptpartidagasto.GetString("registrohistoria"))) {
                return;
            }
            int fcaducidad = Fecha.AdicionaDias365(fproceso, -1);
            tpptpartidagastohistoria obj = new tpptpartidagastohistoria();
            obj.cpartidagasto = tpptpartidagasto.cpartidagasto;
            obj.aniofiscal = tpptpartidagasto.aniofiscal;
            obj.fcaducidad = fcaducidad;

            List<string> lcampos = DtoUtil.GetCamposSinPK(tpptpartidagasto);
            foreach (string campo in lcampos) {
                try {
                    Object valor = DtoUtil.GetValorCampo(tpptpartidagasto, campo);
                    DtoUtil.SetValorCampo(obj, campo, valor);
                } catch (Exception) {
                    throw new AtlasException("PRE-028", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE HISTORIA: {1} ", campo, obj.GetType().Name);
                }
            }
            Sessionef.Save(obj);
            // cambia numeros de mensaje de operacion.
            tpptpartidagasto.fvigencia = fproceso;
            tpptpartidagasto.AddDatos("registrohistoria", "1");
        }
    }
}
