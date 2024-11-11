using bce.util;
using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.facturacionelectronica;
using dal.generales;
using dal.monetario;
using facturacionelectronica.comp.consulta.entidades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporpagar {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class Anular : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!(bool)rqmantenimiento.Mdatos["anular"]) {
                return;
            }
            string cctaporpagar = rqmantenimiento.Mdatos["cctaporpagar"].ToString();
            tconcuentaporpagar cxp = TconCuentaporpagarDal.Find(cctaporpagar);
            cxp.estadocxpcdetalle = "INGRES";
            cxp.ccompcontable = null;
            cxp.fmodificacion = rqmantenimiento.Freal;
            cxp.cusuariomod = rqmantenimiento.Cusuario;
            GenerarBce.EliminarPagoBce(rqmantenimiento, cxp.cctaporpagar, null);
            rqmantenimiento.AdicionarTabla("tconcuentaporpagar", cxp, false);
        }

       
    }
}
