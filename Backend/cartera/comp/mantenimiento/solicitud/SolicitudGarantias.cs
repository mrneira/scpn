using cartera.enums;
using core.componente;
using dal.cartera;
using dal.garantias;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de completar datos de las garntias asociadas a la solicitud.
    /// </summary>
    public class SolicitudGarantias : ComponenteMantenimiento {
        /// <summary>
        /// Objeto de contiene los datos de solicitud del credito.
        /// </summary>
        private tcarsolicitud tcarsol;

        /// <summary>
        /// Completa informacion de las garantias asociadas a la solicitud de credito.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            // Si es simulacion no valida garantias
            if (rqmantenimiento.Mdatos.ContainsKey("essimulacion") && (bool)rqmantenimiento.Mdatos["essimulacion"]) {
                return;
            }
            if (rqmantenimiento.GetTabla("TCARSOLICITUD") == null) {
                tcarsol = TcarSolicitudDal.FindWithLock((long)rqmantenimiento.GetLong("csolicitud"));
            } else {
                tcarsol = (tcarsolicitud)rqmantenimiento.GetTabla("TCARSOLICITUD").Lregistros.ElementAt(0);
            }
            if (!tcarsol.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion))
            {
                return;
            }

            List<IBean> lgarantiassol = null;
            List<IBean> lgarmod = null;
            List<IBean> lgardb = null;
            List<IBean> lgareli = null;

            lgardb = TcarSolicitudGarantiasDal.FindSolicitudGarantias(tcarsol.csolicitud).Cast<IBean>().ToList();
            if (rqmantenimiento.GetTabla("GARANTIASSOL") != null && rqmantenimiento.GetTabla("GARANTIASSOL").Lregistros.Count() > 0) {
                lgarmod = rqmantenimiento.GetTabla("GARANTIASSOL").Lregistros;
            }
            if (rqmantenimiento.GetTabla("GARANTIASSOL") != null && rqmantenimiento.GetTabla("GARANTIASSOL").Lregeliminar.Count() > 0) {
                lgareli = rqmantenimiento.GetTabla("GARANTIASSOL").Lregeliminar.Cast<IBean>().ToList();
            }
            lgarantiassol = DtoUtil.GetMergedList(lgardb.Cast<IBean>().ToList(), lgarmod, lgareli).Cast<IBean>().ToList();

            if (lgarantiassol != null && lgarantiassol.Count > 0) {
                // Completa datos del pk de la solicitid en las garantias
                CompletaPk(lgarantiassol, tcarsol);

                // Valida que las garantias no esten vigentes
                ValidaVigenciaGarantias(lgarantiassol);

                // Valida los montos de cobertura de garantia
                ValidaMontosGarantias(lgarantiassol, tcarsol);

                rqmantenimiento.AddDatos("SOLGARANTIASVALIDADAS", lgarantiassol.Cast<tcarsolicitudgarantias>().ToList());
            }
        }

        /// <summary>
        /// Completa el pk en la lista de personas asociadas a la solicitud.
        /// </summary>
        /// <param name="lpersona">Lista de personas a completar el pk.</param>
        /// <param name="solicitud">Objeto que contiene informacion de la solicitud.</param>
        private void CompletaPk(List<IBean> lgarantias, tcarsolicitud solicitud)
        {
            if (lgarantias == null) {
                return;
            }
            foreach (tcarsolicitudgarantias p in lgarantias) {
                if (p.csolicitud == 0) {
                    p.csolicitud = solicitud.csolicitud;
                }
                if (!p.Mdatos.ContainsKey("valorprima")) {
                    p.Mdatos["valorprima"] = TcarSolicitudSegurosDal.ValorPrima(p.csolicitud, p.coperaciongarantia);
                }
            }
        }

        private void ValidaVigenciaGarantias(List<IBean> lgarantiassol)
        {
            if (lgarantiassol == null) {
                return;
            }
            foreach (tcarsolicitudgarantias p in lgarantiassol) {
                tgaroperacion operaciongar = TgarOperacionDal.FindSinBloqueo(p.coperaciongarantia);
                if (operaciongar != null) {
                    if (operaciongar.cestatus.CompareTo("APR") == 0) {
                        throw new AtlasException("GAR-007", "LA OPERACIÓN DE GARANTÍA [ {0} ] SE ENCUENTRA VIGENTE", operaciongar.coperacion);
                    }
                }
            }
        }

        private void ValidaMontosGarantias(List<IBean> lgarantias, tcarsolicitud solicitud)
        {
            tcarproducto carprod = TcarProductoDal.Find(tcarsol.cmodulo ?? 0, tcarsol.cproducto ?? 0, tcarsol.ctipoproducto ?? 0);

            if (carprod.exigegarantia == null || carprod.exigegarantia == false) {
                if (lgarantias.Count > 0) {
                    throw new AtlasException("GAR-003", "LA OPERACIÓN NO EXIGE GARANTÍAS");
                }
            } else {
                if (lgarantias.Count <= 0) {
                    throw new AtlasException("GAR-004", "LA OPERACIÓN EXIGE GARANTÍAS");
                }

                if (carprod.porcentajegarantia == null) {
                    throw new AtlasException("GAR-005", "PORCENTAJE DE GARANTÍAS DEL PRODUCTO REQUERIDO");
                }

                Decimal montototalgarantias = Decimal.Zero;
                foreach (tcarsolicitudgarantias p in lgarantias) {
                    tgaroperacionavaluo avalgar = TgarOperacionAvaluoDal.Find(p.coperaciongarantia);
                    if (avalgar != null) {
                        montototalgarantias = Decimal.Add(montototalgarantias, avalgar.valoravaluo ?? 0);
                    }
                }

                Decimal montocubrir = Decimal.Divide(Decimal.Multiply(solicitud.monto ?? 0, carprod.porcentajegarantia ?? 0), 100);
                if (montocubrir.CompareTo(montototalgarantias) > 0) {
                    throw new AtlasException("GAR-006", "EL MONTO TOTAL DE LAS GARANTÍAS [ {0} ], DEBE SER IGUAL O SUPERIOR AL MONTO A CUBRIR DEL PRÉSTAMO [ {1} ]. PORCENTAJE A CUBRIR [ {2} ]"
                        , montototalgarantias.ToString("0,0.00"), montocubrir.ToString("0,0.00"), carprod.porcentajegarantia + "%");
                }
            }

        }

    }
}
