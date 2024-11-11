using core.componente;
using dal.cartera;
using dal.garantias;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones de las garantias.
    /// </summary>
    public class Garantias : ComponenteMantenimiento {

        /// <summary>
        /// Validación de garantias
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            long csolicitud = long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString());
            tcarsolicitud tcarsolicitud = TcarSolicitudDal.FindWithLock(csolicitud);

            tcarproducto producto = TcarProductoDal.Find((int)tcarsolicitud.cmodulo, (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);

            if ((producto.exigegarantia != null) && ((bool)producto.exigegarantia)) {
                ValidaGarantias(tcarsolicitud, producto);
            }
        }

        /// <summary>
        /// Valida existencia de garantias asociadas al a solicitud.
        /// </summary>
        /// <param name="solicitud">Instancia de tcarsolicitud.</param>
        /// <param name="producto">Instancia de tcarproducto.</param>
        public static void ValidaGarantias(tcarsolicitud solicitud, tcarproducto producto)
        {

            IList<tcarsolicitudgarantias> lgarantias = TcarSolicitudGarantiasDal.FindSolicitudGarantias(solicitud.csolicitud).ToList();
            if (lgarantias.Count < 1) {
                throw new AtlasException("GAR-004", "LA OPERACIÓN EXIGE GARANTÍAS");
            }

            Decimal montototalgarantias = Decimal.Zero;
            foreach (tcarsolicitudgarantias p in lgarantias) {
                tgaroperacionavaluo avalgar = TgarOperacionAvaluoDal.Find(p.coperaciongarantia);
                if (avalgar != null) {
                    montototalgarantias = Decimal.Add(montototalgarantias, avalgar.valorcomercial ?? 0);
                }
            }

            Decimal montocubrir = Decimal.Divide(Decimal.Multiply(solicitud.monto ?? 0, producto.porcentajegarantia ?? 0), 100);
            if (montocubrir.CompareTo(montototalgarantias) > 0) {
                throw new AtlasException("GAR-006", "EL MONTO TOTAL DE LAS GARANTÍAS [ {0} ], DEBE SER IGUAL O SUPERIOR AL MONTO A CUBRIR DEL PRÉSTAMO [ {1} ]. PORCENTAJE A CUBRIR [ {2} ]"
                    , montototalgarantias.ToString("0,0.00"), montocubrir.ToString("0,0.00"), producto.porcentajegarantia + "%");
            }
        }
    }
}
