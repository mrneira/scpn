using core.componente;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.parametros {

    /// <summary>
    /// Clase que se encarga de completar información del catálogo de cuentas contables
    /// </summary>
    public class Catalogo : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            //if (rqmantenimiento.GetTabla("CUECONTABLE") == null || rqmantenimiento.GetTabla("CUECONTABLE").Lregistros.Count() < 0) {
            //    return;
            //}

            //int fcierre_ultimo = TconCatalogoDal.MaximoValorFcierre();

            //List<tconsaldoscierre> lsaldoscierre = new List<tconsaldoscierre>();
            //List<IBean> lmantenimiento = new List<IBean>();
            //lmantenimiento = rqmantenimiento.GetTabla("CUECONTABLE").Lregistros;
            //tconsaldoscierre cuentasaldocierre;

            //foreach (tconcatalogo item in lmantenimiento) {
            //    if (item.Esnuevo) {
            //        cuentasaldocierre = new tconsaldoscierre();
            //        cuentasaldocierre.fcierre = fcierre_ultimo;
            //        cuentasaldocierre.particion = Constantes.GetParticion(fcierre_ultimo);
            //        cuentasaldocierre.ccuenta = item.ccuenta;
            //        cuentasaldocierre.cagencia = 1;
            //        cuentasaldocierre.csucursal = 1;
            //        cuentasaldocierre.ccompania = rqmantenimiento.Ccompania;
            //        cuentasaldocierre.cmoneda = "USD";
            //        cuentasaldocierre.cmonedaoficial = "USD";
            //        cuentasaldocierre.monto = 0;
            //        cuentasaldocierre.montooficial = 0;
            //        cuentasaldocierre.tipocierreccatalogo = 1028;
            //        cuentasaldocierre.tipocierrecdetalle = "MES";
            //        lsaldoscierre.Add(cuentasaldocierre);
            //    }
            //}

            //if (lsaldoscierre.Count>0) rqmantenimiento.AdicionarTabla("tconsaldoscierre", lsaldoscierre, false);

        }
    }
}
