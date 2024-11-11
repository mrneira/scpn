using cartera.datos;
using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using modelo;
using util;
using dal.inversiones.plananual;
using dal.generales;
using System.Data;

namespace cartera.comp.mantenimiento.solicitud.validar
{
    public class PorcentajesPlanAnual : ComponenteMantenimiento
    {
        /// <summary>
        /// Valida el porcentaje anual de inversiones
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            int anio = Fecha.GetAnio(rqmantenimiento.Fconatable);
            tgenproducto producto = TgenProductoDal.Find(tcarsolicitud.cmodulo.Value, tcarsolicitud.cproducto.Value);
            tinvplananual plan = TinvPlanAnualDal.Find(producto.tipocdetalle, anio, tcarsolicitud.cmodulo.Value);
            tinvplananualdetalle pdet = TinvPlanAnualDetalleDal.Find(producto.tipocdetalle, anio, tcarsolicitud.cmodulo.Value, tcarsolicitud.cproducto.Value, tcarsolicitud.ctipoproducto.Value);
            validarProcentajeProductoAnual(tcarsolicitud, plan, pdet);
            //validarProcentajeProductoMensual(rqmantenimiento, tcarsolicitud, plan, pdet);

        }
        private void validarProcentajeProductoAnual(tcarsolicitud tcarsolicitud, tinvplananual plan,tinvplananualdetalle pdet) {
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros.Add("@cmodulo", tcarsolicitud.cmodulo.Value);
            parametros.Add("@cproducto", tcarsolicitud.cproducto.Value);
            parametros.Add("@ctipoproducto", tcarsolicitud.ctipoproducto.Value);

            decimal saldoProducto = saldo("sp_CarConSaldoPlanAnual", parametros);
            decimal total = saldoProducto + tcarsolicitud.monto.Value;

            if (pdet.validacion.Value)
            {
                if (total > pdet.pproyectada.Value) {
                    throw new AtlasException("INV-014", "EL MONTO ANUAL ES DE {0} $ Y EL ASIGNADO ES {1} SE HA SUPERADO, CAMBIAR MONTO O REASIGNAR LA PARTICIPACIÓN ANUAL", pdet.participacion.Value.ToString("C"), total.ToString("C"));

                }
                decimal pmensualAnual = 0, pmensualHoy = 0;
                pmensualAnual = total / 12;
                pmensualHoy = pdet.pproyectada.Value / 12;

                pmensualAnual = decimal.Round(pmensualAnual, 7, MidpointRounding.AwayFromZero);
                pmensualHoy = decimal.Round(pmensualHoy, 7, MidpointRounding.AwayFromZero);

                //if (pmensualAnual > pmensualHoy)
                // {
                //    throw new AtlasException("INV-016", "EL MONTO MENSUAL ES DE {0} $ Y EL ASIGNADO ES {1} SE HA SUPERADO, CAMBIAR MONTO O REASIGNAR LA PARTICIPACIÓN ANUAL", pmensualAnual.ToString("C"), pmensualHoy.ToString("C"));

                //}

            }
            else {
                decimal mincremento = pdet.pproyectadareal.Value / 100;
                 decimal panual = total / mincremento;
                 panual = panual * 100;
                Dictionary<string, object> parametrospr = new Dictionary<string, object>();
                parametrospr.Add("@cmodulo", tcarsolicitud.cmodulo.Value);
                decimal saldoPrivativa = saldo("sp_CarConSaldoPrivativa", parametrospr);
                

                saldoPrivativa = saldoPrivativa + tcarsolicitud.monto.Value;
                saldoProducto = saldoProducto + tcarsolicitud.monto.Value;
                decimal porcentajeAnualHoy = saldoProducto / saldoPrivativa;
                porcentajeAnualHoy = decimal.Round(porcentajeAnualHoy, 7, MidpointRounding.AwayFromZero);
                porcentajeAnualHoy = porcentajeAnualHoy * 100;
                decimal porcentajeAnualPlan = pdet.pproyectadareal.Value;
                if ( porcentajeAnualHoy> porcentajeAnualPlan)
                {

                    throw new AtlasException("INV-015", "EL PORCENTAJE ANUAL ES DE {0}% Y EL ASIGNADO ES {1} % SE HA SUPERADO, CAMBIAR PORCENTAJE O REASIGNAR LA PARTICIPACIÓN ANUAL", porcentajeAnualPlan, porcentajeAnualHoy);
                }

                decimal pmensualAnual = 0, pmensualHoy = 0;
                pmensualAnual = porcentajeAnualHoy / 12;
                pmensualHoy = porcentajeAnualPlan / 12;

                pmensualAnual = decimal.Round(pmensualAnual, 7, MidpointRounding.AwayFromZero);
                pmensualHoy = decimal.Round(pmensualHoy, 7, MidpointRounding.AwayFromZero);

                //if (pmensualAnual > pmensualHoy)
               // {
                //    throw new AtlasException("INV-017", "EL PORCENTAJE MENSUAL ES DE {0} $ Y EL ASIGNADO ES {1} SE HA SUPERADO, CAMBIAR PORCENTAJE O REASIGNAR LA PARTICIPACIÓN ANUAL", pmensualAnual, pmensualHoy);

                //}
            }

            
        }
        private void validarProcentajeProductoMensual(RqMantenimiento rm, tcarsolicitud tcarsolicitud, tinvplananual plan, tinvplananualdetalle pdet)
        {
            int finicio = Fecha.TimestampToInteger(new DateTime(Fecha.GetAnio(rm.Fconatable), Fecha.GetMes(rm.Fconatable), 1));
            int ffin = Fecha.TimestampToInteger(new DateTime(Fecha.GetAnio(rm.Fconatable), Fecha.GetMes(rm.Fconatable), Fecha.UltimoDiaMes(Fecha.ToDate(rm.Fconatable))));
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros.Add("@cmodulo", tcarsolicitud.cmodulo.Value);
            parametros.Add("@cproducto", tcarsolicitud.cproducto.Value);
            parametros.Add("@ctipoproducto", tcarsolicitud.ctipoproducto.Value);
            parametros.Add("@finicio", finicio);
            parametros.Add("@ffin", ffin);
            
            decimal saldoProducto = saldo("sp_CarConSaldoMensualTproducto", parametros);
            decimal total = saldoProducto + tcarsolicitud.monto.Value;
            

            decimal mincremento = plan.monto.Value + ((plan.pparticipacion.Value / 100) * plan.monto.Value);
            decimal pmensual = total / mincremento;
            pmensual = pmensual * 100;
            pmensual = decimal.Round(pmensual, 7, MidpointRounding.AwayFromZero);


            if (pmensual > pdet.pproyectada)
            {
                throw new AtlasException("INV-015", "EL PORCENTAJE MENSUAL ES DE {0} % Y EL ASIGNADO ES {1} % SE HA SUPERADO, CAMBIAR MONTO O REASIGNAR LA PARTICIPACIÓN",  pdet.pproyectada, pmensual);
            }
        }
        private decimal saldo(string procedimientoAlmacenado, Dictionary<string, object> parametros) {
            decimal total = 0;

            DataTable dt = dal.storeprocedure.StoreProcedureDal.GetDataTable(procedimientoAlmacenado, parametros,0);
            decimal.TryParse(dt.Rows[0]["saldo"].ToString(),out total);
            return total;
        }

    }
}
