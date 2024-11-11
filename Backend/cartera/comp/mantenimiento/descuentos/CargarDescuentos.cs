using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.descuentos {
    public class CargarDescuentos : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que ejecuta el pago de las operaciones de cash
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("ARCHIVODESCUENTO") == null || rqmantenimiento.GetTabla("ARCHIVODESCUENTO").Lregistros.Count() < 0) {
                throw new AtlasException("CAR-0076", "NO EXISTEN ARCHIVOS PARA PROCESAR");
            }
            int fcarga = rqmantenimiento.Fconatable;

            // Lista de archivos de descuentos
            List<tcardescuentosarchivo> larchivos = rqmantenimiento.GetTabla("ARCHIVODESCUENTO").Lregistros.Cast<tcardescuentosarchivo>().ToList();
            foreach (tcardescuentosarchivo arc in larchivos) {

                // Lista de registros cargados
                DataTable ldetalle = TcarDescuentosDetalleDal.FindDescuentos(arc.particion, arc.archivoinstituciondetalle);
                IList<tcardescuentoscarga> lcarga = TcarDescuentosCargaDal.FindArchivo(arc.particion, arc.archivoinstituciondetalle);
                foreach (tcardescuentoscarga reg in lcarga) {

                    // Valida homologacion
                    if (reg.cproductoarchivo > Constantes.CERO) {
                        tcardescuentosdetalle det = TcarDescuentosDetalleDal.FindHomologado(reg.particion, reg.cpersona, reg.cproductoarchivo, reg.archivoinstituciondetalle);
                        if (det == null) {
                            throw new AtlasException("CAR-0084", "REGISTRO CON PROBLEMA: ID [{0}] - NOMBRE [{1}] - MONTO [{2}]", reg.identificacion, reg.nombre, reg.monto);
                        }
                        TcarDescuentosDetalleDal.Actualizar(reg.monto, fcarga, det.particion, det.coperacion, det.cpersona);
                    } else {

                        // Lista de descuentos
                        decimal montocarga = reg.monto;
                        foreach (DataRow det in ldetalle.Rows) {
                            if (montocarga <= Constantes.CERO) {
                                break;
                            }

                            if (reg.identificacion.Equals(det.Field<string>("identificacion"))) {
                                decimal montoenviado = det.Field<decimal>("monto");
                                decimal montorespuesta = Constantes.CERO;

                                if (montocarga >= montoenviado) {
                                    montorespuesta = montoenviado;
                                    montocarga = montocarga - montorespuesta;
                                } else {
                                    montorespuesta = montocarga;
                                    montocarga = Constantes.CERO;
                                }

                                if (montorespuesta > Constantes.CERO) {
                                    TcarDescuentosDetalleDal.Actualizar(montorespuesta, fcarga, det.Field<int>("particion"), det.Field<string>("coperacion"), det.Field<long>("cpersona"));
                                }
                            }
                        }
                    }
                }

            }
        }
    }
}

