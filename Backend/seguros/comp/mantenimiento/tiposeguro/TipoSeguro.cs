using core.componente;
using core.servicios;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace seguros.comp.mantenimiento.tiposeguro {
    /// <summary>
    /// Metodo que se encarga de registrar los tipos de seguro
    /// </summary>
    /// <author>cveloz</author>
    public class TipoSeguro : ComponenteMantenimiento {
        /// <summary>
        /// Registra tipos de seguro.
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            int codigo = 0;
            List<tsgstiposeguro> ltiposeguro = new List<tsgstiposeguro>();


            if (rm.GetTabla("TIPOSEGURODETALLE") != null) {
                IList<tsgstiposegurodetalle> ldetalle = rm.GetTabla("TIPOSEGURODETALLE").Lregistros.Cast<tsgstiposegurodetalle>().ToList();

                foreach (tsgstiposegurodetalle tiposegurodetalle in ldetalle) {
                    if (tiposegurodetalle.Esnuevo) {
                        codigo = int.Parse(Secuencia.GetProximovalor("TIPOSEGURO").ToString());
                        tiposegurodetalle.ctiposeguro = codigo;

                        tsgstiposeguro tiposeguro = new tsgstiposeguro {
                            ctiposeguro = codigo,
                            ccompania = rm.Ccompania
                        };
                        ltiposeguro.Add(tiposeguro);
                    }
                }

                rm.AdicionarTabla("TsgsTipoSeguro", ltiposeguro, false);
            }
        }


    }
}
