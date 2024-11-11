using core.componente;
using core.servicios;
using dal.activosfijos;
using dal.talentohumano;
using modelo;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.devolucionesuministro {

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de devoluciones de productos asignados a un funcionario.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            tacfingreso cabecera = new tacfingreso();
            cabecera.cingreso = int.Parse(Secuencia.GetProximovalor("AFINGRESO").ToString());

            tacfegreso usuario = new tacfegreso();
           
            usuario = TacfEgresoDal.FindEgreso(int.Parse(rqmantenimiento.Mdatos["cmovimiento"].ToString()));
            string centrocostos_recibe = TthFuncionarioDal.FindXCpersona(long.Parse(usuario.cusuariorecibe)).centrocostocdetalle;
            rqmantenimiento.Mdatos["centrocostos_recibe"] = centrocostos_recibe;

            cabecera.memoautorizacion = rqmantenimiento.Mdatos["memoautorizacion"].ToString();
            cabecera.tienekardex = true;
            cabecera.tipoingresoccatalogo = 1303;
            cabecera.tipoingresocdetalle = "DEVSUM";
            cabecera.estadoingresoccatalogo = 1304;
            cabecera.estadoingresocdetalle = "INGRES";
            cabecera.numerooficio = rqmantenimiento.Mdatos["numerooficio"].ToString();            
            cabecera.cusuariodevolucion = usuario.cusuariorecibe;
            cabecera.valortotal = decimal.Parse(rqmantenimiento.Mdatos["total"].ToString());
            cabecera.subtotalnosujetoiva = 0;
            cabecera.subtotalsinimpuestos = 0;
            cabecera.ice = 0;
            cabecera.subtotaliva = 0;
            cabecera.subtotalivacero = 0;
            cabecera.iva = 0;
            cabecera.descuento = 0;
            cabecera.propina = 0;
            cabecera.comentario = rqmantenimiento.Mdatos["comentario"].ToString();
            cabecera.ordendecompra = "";
            cabecera.facturanumero = "";
            cabecera.verreg = 0;
            cabecera.optlock = 0;
            cabecera.contabilizar = false;
            cabecera.cegresodevolucion = usuario.cegreso;
            cabecera.cusuarioing = rqmantenimiento.Cusuario;
            cabecera.fechaingreso = rqmantenimiento.Freal;
            rqmantenimiento.Mtablas["CABECERA"] = null;
            rqmantenimiento.AdicionarTabla("tacfingreso", cabecera, true);
            rqmantenimiento.Mdatos["cingreso"] = cabecera.cingreso;
            rqmantenimiento.Response["cingreso"] = cabecera.cingreso;
          
        }
    }
}
