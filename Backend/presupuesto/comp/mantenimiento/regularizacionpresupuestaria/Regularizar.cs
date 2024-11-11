using contabilidad.comp.mantenimiento;
using core.componente;
using dal.contabilidad;
using dal.presupuesto;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace presupuesto.comp.mantenimiento.regularizacionpresupuestaria
{

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable para regularización presupuestaria
    /// </summary>
    public class Regularizar : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            List<IBean> ldetalle = new List<IBean>();
            string ccomprobante = rqmantenimiento.Mdatos["ccomprobante"].ToString();
            
            tconcomprobante comprobante = (tconcomprobante)rqmantenimiento.Mtablas["CABECERA"].Lregistros.ElementAt(0);
            comprobante.ruteopresupuesto = true;
            comprobante.aprobadopresupuesto = true;
            comprobante.cusuariomod = rqmantenimiento.Cusuario;
            comprobante.fmodificacion = rqmantenimiento.Freal;
            ldetalle = rqmantenimiento.Mtablas["DETALLE"].Lregistros;
            SaldoPresupuesto.ActualizarSaldoPresupuesto(rqmantenimiento, comprobante, ldetalle);
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
           
        }

    }
}
