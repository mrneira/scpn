using dal.contabilidad;
using core.componente;
using dal.contabilidad.cuentasporpagar;
using modelo;
using util.dto.mantenimiento;
using util.dto.lote;
using util.servicios.ef;
using util;

namespace contabilidad.comp.mantenimiento.periodocontable
{
    /// <summary>
    /// Clase que se encarga de obtener registros de contabilidad a generar comprobantes y los inserta en TconRegistroLote.
    /// </summary>
    public class CierrePeriodo : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            int fperiodofin = int.Parse(rqmantenimiento.Mdatos["fperiodofin"].ToString());

            tconperiodocontable peridocontable = TconPeriodoContableDal.GetPeriodoXfperiodofin(fperiodofin);
            if (peridocontable.periodocerrado) {
                throw new AtlasException("CONTA-014", "EL PERIODO YA SE ENCUENTRA CERRADO", fperiodofin);
            }

            TconPeriodoContableDal.CerrarPeriodo(fperiodofin);
        }
    }
}