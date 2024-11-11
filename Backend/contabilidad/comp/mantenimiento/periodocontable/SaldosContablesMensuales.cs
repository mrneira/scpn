using dal.contabilidad;
using core.componente;
using dal.contabilidad.cuentasporpagar;
using modelo;
using util.dto.mantenimiento;
using util.dto.lote;
using util.servicios.ef;
using util;
using contabilidad.saldo;

namespace contabilidad.comp.mantenimiento.periodocontable
{
    /// <summary>
    /// Clase que se encarga de obtener registros de contabilidad a generar comprobantes y los inserta en TconRegistroLote.
    /// </summary>
    public class SaldosContablesMensuales : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            int fperiodofin = int.Parse(rqmantenimiento.Mdatos["fperiodofin"].ToString());

            tconperiodocontable periodocontable = TconPeriodoContableDal.GetPeriodoXfperiodofin(fperiodofin);
            if (periodocontable == null) {
                throw new AtlasException("CONTA-015", "FIN DE PERIODO {0} NO HA SIDO ENCONTRADO",fperiodofin);
            }
            if (periodocontable.periodocerrado) {
                throw new AtlasException("CONTA-014", "EL PERIODO {0} YA SE ENCUENTRA CERRADO", fperiodofin);
            }

            SaldoCierreHelper sch = new SaldoCierreHelper();
            sch.Rollup(rqmantenimiento.Ccompania, fperiodofin);
            
        }
    }
}