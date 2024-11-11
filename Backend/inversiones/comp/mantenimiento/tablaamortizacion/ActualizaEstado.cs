using core.componente;
using modelo;
using util.dto.mantenimiento;
using util.servicios.ef;
using dal.inversiones.inversiones;
using inversiones.comp.mantenimiento.contabilizacion;

namespace inversiones.comp.mantenimiento.tablaamortizacion
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para realizar los cambios de estados de los dividendos.
    /// </summary>
    class ActualizaEstado : ComponenteMantenimiento
    {

        /// <summary>
        /// Actualiza el estado y comentarios del dividendo.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {


            int lintMora = 0;

            try
            {
                lintMora = int.Parse(rqmantenimiento.Mdatos["mora"].ToString());
            }
            catch
            { }

            clsGuardar clsContabilizar = new clsGuardar();

            clsContabilizar.DetalleSql(rqmantenimiento, long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString()), lintMora);

            tinvtablaamortizacion tInvTablaamortizacion = TinvInversionDal.FindTInvTablaAmortizacion(long.Parse(rqmantenimiento.Mdatos["cinvtablaamortizacion"].ToString()));

            try
            {
                switch (lintMora)
                {
                    case 0:
                        tInvTablaamortizacion.estadocdetalle = rqmantenimiento.Mdatos["estadocdetalle"].ToString();
                        tInvTablaamortizacion.comentariosingreso = rqmantenimiento.Mdatos["comentario"].ToString();

                        tInvTablaamortizacion.valorcancelado = null;
                        try
                        {
                            tInvTablaamortizacion.valorcancelado = decimal.Parse(rqmantenimiento.Mdatos["valorcancelado"].ToString());
                        }
                        catch
                        { }

                        break;
                    case 1:
                        tInvTablaamortizacion.comentariomoraing = rqmantenimiento.Mdatos["comentario"].ToString();
                        tInvTablaamortizacion.mora = (byte)lintMora;
                        break;
                }
            }
            catch
            { }

            tInvTablaamortizacion.valormora = null;
            try
            {
                tInvTablaamortizacion.valormora = decimal.Parse(rqmantenimiento.Mdatos["valormora"].ToString());
            }
            catch
            { }
            Sessionef.Actualizar(tInvTablaamortizacion);

        }

    }
}
