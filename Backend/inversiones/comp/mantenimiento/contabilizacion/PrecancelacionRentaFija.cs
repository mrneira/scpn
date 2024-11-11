using core.componente;
using modelo;
using util.dto.mantenimiento;
using dal.inversiones.tablaamortizacion;
using inversiones.comp.mantenimiento.inversiones.contabilizar;
using dal.inversiones.precancelacion;
using dal.inversiones.inversiones;
using util.servicios.ef;

namespace inversiones.comp.mantenimiento.contabilizacion
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para realizar la precancelación de inversiones.
    /// </summary>
    public class PrecancelacionRentaFija : ComponenteMantenimiento
    {

        /// <summary>
        /// Prepara la contabilización de la transacción, obteniendo las afectaciones predeterminadas de la plantilla contable.
        /// Contabiliza la transacción generada.
        /// Actualiza el estado de los dividendos.
        /// </summary>
        /// <param name="rqmantenimiento">Request del mantenimiento de la transacción.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {


            clsGuardar clsContabilizar = new clsGuardar();

            clsContabilizar.DetalleSql(rqmantenimiento, long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString()));

            Contabilizar lContabilizar = new Contabilizar();

            lContabilizar.Ejecutar(rqmantenimiento);

            TinvTablaAmortizacionDal TTablaAmortizacion = new TinvTablaAmortizacionDal();

            TTablaAmortizacion.UpdatePrecancela(long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString()), (string)rqmantenimiento.Cusuario);

            TinvPrecancelacionDal Tprecancela = new TinvPrecancelacionDal();
            tinvinversion inv = TinvInversionDal.Find(long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString()));
            inv.estadocdetalle = "CAN";
            inv.Actualizar = true;
            inv.Esnuevo = false;
            Sessionef.Grabar(inv);            
            Tprecancela.UpdateEstadoPorCinvprecancelacion("APR",long.Parse(rqmantenimiento.Mdatos["cinvprecancelacion"].ToString()), (string)rqmantenimiento.Cusuario);

        }

    }
}
