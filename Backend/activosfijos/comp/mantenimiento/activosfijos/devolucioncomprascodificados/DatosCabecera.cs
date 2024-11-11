using core.componente;
using core.servicios;
using dal.activosfijos;
using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.devolucioncomprascodificados
{

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de egreso por devolucion de una compra.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!rqmantenimiento.Mdatos.ContainsKey("kardex"))
            {
                return;
            }

            tacfegreso cabecera = new tacfegreso();
            cabecera.cegreso = int.Parse(Secuencia.GetProximovalor("AFEGRESO").ToString());
            
            cabecera.numeromemo = "";
            cabecera.numerooficio ="";
            cabecera.cusuarioautorizado = "";
            cabecera.cusuariorecibe = "";
            cabecera.tienekardex = true;
            cabecera.movimiento = "A";
            cabecera.eliminado = false;
            cabecera.comentario = "DEVOLUCIÓN COMPRA";
            cabecera.tipoegresoccatalogo = 1305;
            cabecera.tipoegresocdetalle = "DEVCOM";
            cabecera.estadoccatalogo = 1306;
            cabecera.estadocdetalle = "EGRCOM";
            cabecera.cusuarioing = rqmantenimiento.Cusuario;
            cabecera.fingreso = rqmantenimiento.Freal;
            cabecera.fecha = rqmantenimiento.Freal;
            cabecera.optlock = 0;
            cabecera.verreg = 0;
            rqmantenimiento.AdicionarTabla("tacfegreso", cabecera, false);
            rqmantenimiento.Mdatos["cegreso"] = cabecera.cegreso;
            rqmantenimiento.Response["cegreso"] = cabecera.cegreso;
          
        }
    }
}
