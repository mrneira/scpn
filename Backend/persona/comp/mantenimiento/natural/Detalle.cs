using core.componente;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace persona.comp.mantenimiento.natural {
    public class Detalle : ComponenteMantenimiento {  /// <summary>
                                                      /// Completa nombre del cliente.
                                                      /// </summary>
                                                      /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("NATURAL") != null || rm.GetTabla("DETALLE") != null) {
                long? cpersona = rm.GetLong("c_pk_cpersona");
                tperpersonadetalle tperPersonaDetalle;
                bool datoConsultado = false;
                if (rm.GetTabla("DETALLE") != null) {
                    tperPersonaDetalle = (tperpersonadetalle)rm.GetTabla("DETALLE").Lregistros.ElementAt(0);
                    if (tperPersonaDetalle.cpersona == 0) {
                        tperPersonaDetalle.cpersona = (int)cpersona;
                        tperPersonaDetalle.ccompania = rm.Ccompania;
                    }                
                } else {
                    tperPersonaDetalle = TperPersonaDetalleDal.Find((long)cpersona, rm.Ccompania);
                    datoConsultado = true;
                }
                if (cpersona == null) {
                    cpersona = tperPersonaDetalle.cpersona;
                }
                tpernatural tperNatural = this.GetTperNaturalDto(rm, (long)cpersona);
                String nombreCorrecto = Natural.NombreCambiado(tperNatural);
                bool cambioNombre = false;
                if (tperPersonaDetalle.nombre == null && nombreCorrecto != null) {
                    tperPersonaDetalle.nombre = nombreCorrecto;
                    cambioNombre = true;
                } else if (nombreCorrecto != null && tperPersonaDetalle.nombre != null
                        && nombreCorrecto.CompareTo(tperPersonaDetalle.nombre) != 0) {
                    tperPersonaDetalle.nombre = nombreCorrecto;
                    cambioNombre = true;
                }

                if (cambioNombre) {
                    if (datoConsultado) {
                        rm.AdicionarTabla("DETALLE", tperPersonaDetalle, 1, false);
                    }
                }
            }
        }

        /// <summary>
        /// Entrega datos de una persona natural.
        /// </summary>
        /// <param name="rm">Request con el que se ejecuta la transaccion.</param>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <returns></returns>
        private tpernatural GetTperNaturalDto(RqMantenimiento rm, long cpersona) {
            tpernatural tperNatural = null;
            if (rm.GetTabla("NATURAL") != null) {
                tperNatural = (tpernatural)rm.GetTabla("NATURAL").Lregistros.ElementAt(0);
            }
            if (tperNatural == null) {
                try {
                    tperNatural = TperNaturalDal.Find(cpersona, rm.Ccompania);
                } catch (Exception) {

                    throw;
                }
            }
            return tperNatural;
        }
    }
}
