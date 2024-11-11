using core.componente;
using util.dto.mantenimiento;
using inversiones.comp.mantenimiento.inversiones.contabilizar;

namespace inversiones.comp.mantenimiento.contabilizacion
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para generar la plantilla contable.
    /// </summary>
    public class GeneraPlantilla : ComponenteMantenimiento
    {
        /// <summary>
        /// Prepara la contabilización de la transacción, obteniendo las afectaciones predeterminadas de la plantilla contable.
        /// Contabiliza la transacción generada.
        /// </summary>
        /// <param name="rqmantenimiento">Request del mantenimiento de la transacción.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            clsGuardar lclsGuardar = new clsGuardar();

            lclsGuardar.DetalleSql(rqmantenimiento, long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString()));


            Contabilizar lContabilizar = new Contabilizar();

            lContabilizar.Ejecutar(rqmantenimiento);



        }
    }
}
