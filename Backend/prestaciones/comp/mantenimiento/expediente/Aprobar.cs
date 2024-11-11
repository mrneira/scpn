using core.componente;
using dal.prestaciones;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace prestaciones.comp.mantenimiento.expediente {
    class Aprobar : ComponenteMantenimiento {
        /// <summary>
        /// Aprueba el flujo del expediente
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("DATOSEXPEDIENTE") == null || rm.GetTabla("DATOSEXPEDIENTE").Lregistros.Count() <= 0) {
                return;
            }

            IList<tpreflujoexpediente> lflu = new List<tpreflujoexpediente>();

            tpreexpediente obj = (tpreexpediente)rm.GetTabla("DATOSEXPEDIENTE").Lregistros.ElementAt(0);
            long secuencia = long.Parse(rm.GetDatos("secuencia").ToString());
            int siguienteestatus = int.Parse(rm.GetDatos("siguienteestatus").ToString());
            int anteriorestatus = int.Parse(rm.GetDatos("anteriorestatus").ToString());
            int ant = siguienteestatus - 1;


            List<tpreflujoexpediente> lflujo = TpreFlujoExpedienteDal.FindList(secuencia, ant);
            long flujoid = 0;

                foreach (tpreflujoexpediente flu in lflujo) {
                    flujoid = flu.flujoid;
                }



            tpreflujoexpediente fluAdd = TpreFlujoExpedienteDal.Find(flujoid, secuencia, ant);
            if (fluAdd != null)
                fluAdd.fsalida = rm.Freal;

            tpreflujoexpediente flujoexp = new tpreflujoexpediente();
            flujoexp.Esnuevo = obj.Esnuevo;
            flujoexp.secuencia = secuencia;
            flujoexp.cusuarioing = rm.Cusuario;
            flujoexp.fingreso = obj.fingreso;
            flujoexp.cetapaactual = siguienteestatus;
            flujoexp.cetapasiguiente = siguienteestatus + 1;
            flujoexp.fentrada = rm.Freal;
            //flujoexp.fsalida = rm.Freal;
            flujoexp.fechamax = rm.Freal;
            flujoexp.observacion = "OK";
            flujoexp.historico = false;

            lflu.Add(fluAdd);
            lflu.Add(flujoexp);

            rm.AdicionarTabla(typeof(tpreflujoexpediente).Name.ToUpper(), lflu, false);
        }
    }
}
