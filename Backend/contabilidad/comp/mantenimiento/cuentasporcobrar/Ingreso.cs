using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using core.componente;
using core.servicios;
using dal.contabilidad;
using modelo;
using System.Linq;
using util.dto.mantenimiento;
using modelo.interfaces;

namespace contabilidad.comp.mantenimiento.cuentasporcobrar
{
    class Ingreso : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("CUENTASPORCOBRAR") == null || rqmantenimiento.GetTabla("CUENTASPORCOBRAR").Lregistros.Count() < 0)
            {
                return;
            }
            tconcuentaporcobrar cabecera = (tconcuentaporcobrar)rqmantenimiento.GetTabla("CUENTASPORCOBRAR").Lregistros.ElementAt(0);

            // completa datos de la cuenta por cobrar.
            string cctaporcobrar = cabecera.cctaporcobrar;
            if (cabecera.cctaporcobrar == null)
            {
                cctaporcobrar = cabecera.csucursalingreso + "-" + cabecera.cagenciaingreso + "-" + Secuencia.GetProximovalor("CUENTASCXC").ToString();
                rqmantenimiento.Response["cctaporcobrar"] = cctaporcobrar;
            }
            TconCuentaPorCobrarDal.Completar(rqmantenimiento, cabecera, cctaporcobrar);

            // cambia el estado de la cxc a eliminado.
            if (cabecera.Mdatos.Keys.Contains("eliminar"))
            {


                cabecera.estadocdetalle = "ELIMIN";
                cabecera.fmodificacion = rqmantenimiento.Freal;
                cabecera.cusuariomod = rqmantenimiento.Cusuario;
                TconCargaMasivaFacturasParqueaderoDal.DeleteByCxC(cabecera.cctaporcobrar);
                return;
            }

            // crea el comprobante contable y cambia el estado.
            if (cabecera.Mdatos.Keys.Contains("comprobante"))
            {
                tconcomprobante comprobante = new tconcomprobante();
                cabecera.estadocdetalle = "AUTORI";
                cabecera.fmodificacion = rqmantenimiento.Freal;
                cabecera.cusuariomod = rqmantenimiento.Cusuario;
                Comprobante.CompletarAutorizacion(rqmantenimiento, cabecera, "INGRES", comprobante,null);
                Comprobante.GenerarFacturaElectronica(rqmantenimiento, cabecera);
            } 
        }
    }
}
