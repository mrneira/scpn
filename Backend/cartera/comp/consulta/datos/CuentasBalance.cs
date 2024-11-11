using core.componente;
using dal.cartera;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.datos {
    class CuentasBalance : ComponenteConsulta {
        /// <summary>
        /// Consulta cuentas de balance
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            long cpersona = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            TcarSolicitudCapacidadPagoDal.CompletaIngresos("I", rqconsulta, cpersona);
            TcarSolicitudCapacidadPagoDal.CompletaEgresos("E", rqconsulta, cpersona);
        }

    }
}
