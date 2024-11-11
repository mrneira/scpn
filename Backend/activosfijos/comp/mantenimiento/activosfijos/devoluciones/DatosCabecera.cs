using core.componente;
using core.servicios;
using dal.activosfijos;
using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.devoluciones {

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de devoluciones de productos asignados a un funcionario.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            tacfingreso cabecera = new tacfingreso();
            cabecera.cingreso = int.Parse(Secuencia.GetProximovalor("AFINGRESO").ToString());

            cabecera.memoautorizacion = rqmantenimiento.Mdatos["memoautorizacion"].ToString();
            cabecera.memocodificacion = "";
            cabecera.cusuarioautoriza = "";
            cabecera.cusuarioavala = "";
            cabecera.cusuarioadmincontrato = "";
            cabecera.tienekardex = true;
            cabecera.tipoingresoccatalogo = 1303;
            cabecera.tipoingresocdetalle = "DEVFUN";
            cabecera.estadoingresoccatalogo = 1304;
            cabecera.estadoingresocdetalle = "CODIFI";
            cabecera.cusuariodevolucion = rqmantenimiento.Mdatos["cusuariodevolucion"].ToString();
            cabecera.subtotalsinimpuestos = decimal.Parse(rqmantenimiento.Mdatos["subtotal"].ToString());
            cabecera.valortotal = decimal.Parse(rqmantenimiento.Mdatos["total"].ToString());
            cabecera.porcentajeiva = "IVA12";
            cabecera.descuento = 0;
            cabecera.ice = 0;
            cabecera.iva = 0;
            cabecera.subtotaliva = 0;
            cabecera.subtotalivacero = 0;
            cabecera.subtotalnosujetoiva = 0;
            cabecera.propina = 0;
            cabecera.comentario = "";
            cabecera.ordendecompra = "";
            cabecera.facturanumero = "";
            cabecera.verreg = 0;
            cabecera.optlock = 0;
            cabecera.cusuarioing = rqmantenimiento.Cusuario;
            cabecera.fechaingreso = rqmantenimiento.Freal;
            cabecera.fingreso = rqmantenimiento.Freal;
            tacfegreso cabeceraegreso = new tacfegreso();

            cabeceraegreso.cegreso = int.Parse(Secuencia.GetProximovalor("AFEGRESO").ToString());
            cabeceraegreso.optlock = 0;
            cabeceraegreso.verreg = 0;
            cabeceraegreso.fecha = rqmantenimiento.Freal;
            cabeceraegreso.numeromemo = rqmantenimiento.Mdatos["memoautorizacion"].ToString();
            cabeceraegreso.numerooficio = "";
            cabeceraegreso.cusuarioautorizado = "";
            cabeceraegreso.cusuariorecibe = "";
            cabeceraegreso.tienekardex = true;
            cabeceraegreso.movimiento = "A";
            cabeceraegreso.eliminado = false;
            cabeceraegreso.comentario = "";
            cabeceraegreso.tipoegresoccatalogo = 1305;
            cabeceraegreso.tipoegresocdetalle = "ENTREG";
            cabeceraegreso.estadoccatalogo = 1306;
            cabeceraegreso.estadocdetalle = "EGRENT";
            cabeceraegreso.carea = 1;
            cabeceraegreso.ccargo = 1;
            cabeceraegreso.cusuarioing = rqmantenimiento.Cusuario;
            cabeceraegreso.fingreso = rqmantenimiento.Freal;


            rqmantenimiento.AdicionarTabla("tacfingreso", cabecera, false);
            rqmantenimiento.AdicionarTabla("tacfegreso", cabeceraegreso, false);
            rqmantenimiento.Mdatos["cingreso"] = cabecera.cingreso;
            rqmantenimiento.Mdatos["cegreso"] = cabeceraegreso.cegreso;
            rqmantenimiento.Response["cingreso"] = cabecera.cingreso;
            rqmantenimiento.Response["cegreso"] = cabeceraegreso.cegreso;

        }
    }
}
