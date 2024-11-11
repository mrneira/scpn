using core.componente;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;
using modelo.interfaces;
using modelo;
using dal.prestaciones;


namespace prestaciones.comp.mantenimiento.expediente {
    class Flujo :ComponenteMantenimiento {
        /// <summary>
        /// Crea el flujo expediente
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            if(rm.GetTabla("DATOSEXPEDIENTE") == null || rm.GetTabla("DATOSEXPEDIENTE").Lregistros.Count() <= 0) {
                return;
            }

            tpreexpediente obj = (tpreexpediente)rm.GetTabla("DATOSEXPEDIENTE").Lregistros.ElementAt(0);
            long secuencia = long.Parse(rm.GetDatos("secuencia").ToString());
            int siguienteestatus = int.Parse(rm.GetDatos("siguienteestatus").ToString());
            int anteriorestatus = int.Parse(rm.GetDatos("anteriorestatus").ToString());

            if(!obj.Esnuevo) {
                return;
            }

            tpreflujoexpediente flujoexp = new tpreflujoexpediente();
            flujoexp.Esnuevo = obj.Esnuevo;
            flujoexp.secuencia = secuencia;
            flujoexp.cetapaactual = siguienteestatus;
            flujoexp.cetapasiguiente = siguienteestatus + 1;
            flujoexp.fentrada = rm.Freal;
            //flujoexp.fsalida = rm.Freal;
            flujoexp.fechamax = rm.Freal;
            flujoexp.observacion = "OK";
            flujoexp.historico = false;
            rm.AdicionarTabla(typeof(tcarsolicitudetapa).Name.ToUpper(), flujoexp, false);
        }
    }
}
