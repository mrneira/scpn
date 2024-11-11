using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using modelo;
using dal.contabilidad;
using Newtonsoft.Json;
using modelo.helper;
using dal.prestaciones;
using contabilidad.comp.mantenimiento;

namespace prestaciones.comp.mantenimiento.contabilidad {
    public class Anular :ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if(!rqmantenimiento.Mdatos.ContainsKey("expediente")) {
                return;
            }
            var dlexpediente = JsonConvert.DeserializeObject<IList<tpreexpediente>>(rqmantenimiento.Mdatos["expediente"].ToString());
            //listas para almacenar 
            IList<tpreexpediente> ltpex = new List<tpreexpediente>();
            IList<tconcomprobante> ltcc = new List<tconcomprobante>();

            foreach(tpreexpediente tpexd in dlexpediente) {
                tpreexpediente tpex = TpreExpedienteDal.FindToExpediente((int)tpexd.secuencia);
                string ccomprobante = tpex.comprobantecontable;
                tpex.cdetalleetapa = (int.Parse(tpex.cdetalleetapa) - 1).ToString();
                
                
                tconcomprobante tcc = TconComprobanteDal.FindComprobante(ccomprobante);
                tcc.eliminado = true;
                tpex.comprobantecontable = null;

                ltpex.Add(tpex);
                ltcc.Add(tcc);

            }

            rqmantenimiento.AdicionarTabla("tpreexpediente", ltpex, false);
            rqmantenimiento.AdicionarTabla("tconcomprobante", ltcc, false);

        }
    }
}
