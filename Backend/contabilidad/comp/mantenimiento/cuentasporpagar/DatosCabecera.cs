using core.componente;
using core.servicios;
using dal.activosfijos;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporpagar {

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de un comprobante contable.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0) {
                return;
            }
            tconcuentaporpagar cabecera = (tconcuentaporpagar)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            cabecera.tipocxp = "S";
            string cctaporpagar = cabecera.cctaporpagar;
            if (cctaporpagar == null) {
                cctaporpagar = Secuencia.GetProximovalor("CUENTASCXP").ToString();

            }

            // Eliminar una cuenta por pagar y si existe el comprobante contable también se lo elimina (cambio de estados)
            if (rqmantenimiento.Mdatos.Keys.Contains("eliminar")) {
                tacfingreso ingreso = TacfIngresoDal.FindIngresoXctaporpagar(cabecera.cctaporpagar);
                List<tconnotacreditocompras> lnotascredito = TconNotaCreditoComprasDal.Find(cabecera.cctaporpagar);
                cabecera.estadocxpcdetalle = "ELIMIN";
                cabecera.fmodificacion = rqmantenimiento.Freal;
                cabecera.cusuariomod = rqmantenimiento.Cusuario;

                if (cabecera.ccompcontable != null)
                {
                    tconcomprobante comprobante = TconComprobanteDal.FindComprobante(cabecera.ccompcontable);
                    comprobante.eliminado = true;
                    comprobante.fmodificacion = rqmantenimiento.Freal;
                    comprobante.cusuariomod = rqmantenimiento.Cusuario;
                    rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
                }

                if (ingreso != null) {
                    ingreso.cctaporpagar = null;
                    rqmantenimiento.AdicionarTabla("tacfingreso", ingreso, false);
                }

                if (lnotascredito.Count > 0) {
                    lnotascredito.ToList().ForEach(x => {
                        x.cctaporpagar = null;
                        x.Actualizar = true;
                        x.cusuariomod = rqmantenimiento.Cusuario;
                        x.fmodificacion = rqmantenimiento.Freal;
                    });
                    rqmantenimiento.AdicionarTabla("tconnotacreditocompras", lnotascredito, false);
                }

                
                return;
            }

            //Asociar una cuenta por pagar a un ingreso
            if (rqmantenimiento.Mdatos.ContainsKey("cingreso")) {
                int cingreso = int.Parse(rqmantenimiento.Mdatos["cingreso"].ToString());
                tacfingreso ingreso = TacfIngresoDal.FindIngreso(cingreso);
                ingreso.cctaporpagar = cctaporpagar;
                rqmantenimiento.AdicionarTabla("tacfingreso", ingreso, false);
            }
            rqmantenimiento.Response["cctaporpagar"] = cctaporpagar;
            TconCuentaporpagarDal.Completar(rqmantenimiento, cabecera, cctaporpagar);
            // fija el numero de comprobante para utilizarlo en clases adicionales del mantenimiento.

        }
    }
}
