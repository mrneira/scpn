using core.componente;
using util.dto.mantenimiento;
using dal.inversiones.contabilizacion;
using dal.inversiones.tablaamortizacion;
using modelo;
using dal.inversiones.inversiones;
using util.servicios.ef;
using dal.inversiones.reverso;
using System.Collections.Generic;
using util;
using dal.inversiones.ventaacciones;
using dal.inversiones.precancelacion;

namespace inversiones.comp.mantenimiento.reversar
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales efectuar el reverso contable.
    /// </summary>
    class ReversoContable : ComponenteMantenimiento
    {

        /// <summary>
        /// Ejectua el reverso contable.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (TinvContabilizacionDal.obtenerProcesoPorCcomprobante(rqmantenimiento.Mdatos["ccomprobante"].ToString()) == "REAJUS")
            {

                IList<Dictionary<string, object>> tablatmp = new List<Dictionary<string, object>>();

                tablatmp = TinvReversoDal.ReversoReajustes(rqmantenimiento.Mdatos["ccomprobante"].ToString());

                if (tablatmp[0]["mensaje"].ToString().Trim().Length != 0)
                {
                    throw new AtlasException("INV-0021", "YA EXISTE UN REAJUSTE EN PROCESO PARA LA INVERSIÓN NO. {0} : REVERSO CANCELADO", tablatmp[0]["cinversion"].ToString().Trim());

                }


            }
            else

            {

                TinvTablaAmortizacionDal TinvTablaAmortizacion = new TinvTablaAmortizacionDal();

                TinvTablaAmortizacion.UpdateEstado(
                   rqmantenimiento.Mdatos["ccomprobante"].ToString(),
                    int.Parse(rqmantenimiento.Mdatos["fcontable"].ToString()),
                    int.Parse(rqmantenimiento.Mdatos["ccompania"].ToString()),
                    "PEN");

                TinvPrecancelacionDal TinvPrecancelacion = new TinvPrecancelacionDal();

                TinvPrecancelacion.UpdateEstado(
                    rqmantenimiento.Mdatos["ccomprobante"].ToString(), 
                    "ING", 
                    (string)rqmantenimiento.Cusuario);

                TinvVentaAccionesDal TVentaAccionesDal = new TinvVentaAccionesDal();

                TVentaAccionesDal.UpdateEstado(
                   rqmantenimiento.Mdatos["ccomprobante"].ToString(),
                    int.Parse(rqmantenimiento.Mdatos["fcontable"].ToString()),
                    int.Parse(rqmantenimiento.Mdatos["ccompania"].ToString()),
                    "PEN");

                TinvContabilizacionDal TinvContabilizacion = new TinvContabilizacionDal();

                TinvContabilizacion.DeleteXComprobante(rqmantenimiento.Mdatos["ccomprobante"].ToString());

                long lcinversion = 0;

                try
                {
                    // Únicamente para la compra de la inversión
                    lcinversion = long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString());
                }
                catch
                { }
                if (lcinversion > 0)
                {

                    tinvinversion inversion = TinvInversionDal.Find(lcinversion);

                    inversion.comentariosaprobacion = null;
                    try
                    {
                        inversion.comentariosdevolucion = rqmantenimiento.Mdatos["comentario"].ToString().Trim();
                        inversion.comentariosanulacion = rqmantenimiento.Mdatos["comentario"].ToString().Trim();
                    }
                    catch
                    { }

                    inversion.ccomprobante = null;
                    inversion.estadocdetalle = "ANULA";
                    Sessionef.Actualizar(inversion);
                }
            }

        }

    }
}
