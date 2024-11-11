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
    class Rechazar :ComponenteMantenimiento {
        /// <summary>
        /// Clase que rechaza el expediente
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            long secuencia = long.Parse(rm.GetDatos("secuencia").ToString());
            int siguienteestatus = int.Parse(rm.GetDatos("siguienteestatus").ToString());
            int anteriorestatus = int.Parse(rm.GetDatos("anteriorestatus").ToString());
            tpreflujoexpediente flujoexp = new tpreflujoexpediente();
            flujoexp.Esnuevo = true;
            flujoexp.secuencia = secuencia;
            flujoexp.cusuarioing = rm.Cusuario;
            flujoexp.fingreso = rm.Freal;
            flujoexp.cetapaactual = anteriorestatus;
            flujoexp.cetapasiguiente = anteriorestatus + 1;
            flujoexp.fentrada = rm.Freal;
            flujoexp.fsalida = rm.Freal;
            flujoexp.fechamax = rm.Freal;
            flujoexp.observacion = rm.GetDatos("comentario").ToString();
            flujoexp.historico = false;
            rm.AdicionarTabla(typeof(tcarsolicitudetapa).Name.ToUpper(), flujoexp, false);
        }
    }
}
