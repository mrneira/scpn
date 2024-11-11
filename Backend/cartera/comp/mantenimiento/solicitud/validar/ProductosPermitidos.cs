using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using dal.garantias;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.validar
{
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones entre productos.
    /// </summary>
    public class ProductosPermitidos : ComponenteMantenimiento
    {

        /// <summary>
        /// Validación de productos
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();

            // Operaciones de arreglo de pagos
            if (!solicitud.Tcarsolicitud.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion))
            {
                return;
            }

            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            List<tcaroperacion> loperacion = TcarOperacionDal.FindPorPersona((long)tcarsolicitud.cpersona, true).ToList();
            if (tcarsolicitud.cmodulo == 7 && tcarsolicitud.cproducto == 1 && (tcarsolicitud.ctipoproducto == 21 || tcarsolicitud.ctipoproducto == 24))
            {
                return;
            }
            /*if (tcarsolicitud.cmodulo == 7 && tcarsolicitud.cproducto == 1 && (tcarsolicitud.ctipoproducto == 4 || tcarsolicitud.ctipoproducto == 5 || tcarsolicitud.ctipoproducto == 8))
            {
                IList<tcaroperacion> lop = TcarOperacionDal.FindOperacionesConsolidado((long)tcarsolicitud.cpersona,(int)tcarsolicitud.ctipoproducto);
                if (lop.Count > 0) {
                    throw new AtlasException("CAR-0086", "YA SE REALIZÓ LA PRIMERA CONSOLIDACIÓN, SELECCIONE SEGUNDA CONSOLIDACIÓN DE DEUDAS");
                }
            }*///CCA 20221021 no existe segunda consolidacion

            foreach (tcaroperacion op in loperacion)
            {

                tcarproductopermitidos obj = TcarProductoPermitidosDal.FindToPermitido((int)op.cmodulo, (int)op.cproducto, (int)op.ctipoproducto,
                                                                                       (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);

                if (obj == null)
                {
                    throw new AtlasException("CAR-0061", "PRODUCTO NO PERMITIDO");
                }
            }


        }

    }
}
