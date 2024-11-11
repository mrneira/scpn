using core.componente;
using core.servicios.consulta;
using util;
using util.dto.consulta;

namespace cartera.comp.consulta.reverso {

    /// <summary>
    /// Clase que se encarga de consultar movimientos de cartera a reversar.
    /// </summary>
    public class Movimientos : ComponenteConsulta {

        /// <summary>
        /// Consulta movimientos a reversar de cartera.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            DtoConsulta dtoconsulta = rqconsulta.Mconsulta["MOVIMIENTO"];
            Adicionafiltros(rqconsulta, dtoconsulta);
            MotorConsulta m = new MotorConsulta();
            m.Consultar(rqconsulta);
        }
        
        /// <summary>
        /// Adiciona filtros a la cosnulta.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        /// <param name="dtoconsulta">Dto de consulta de movimientos de cartera.</param>
        private void Adicionafiltros(RqConsulta rqconsulta, DtoConsulta dtoconsulta) {
            int fechacontable = rqconsulta.Fconatable;
            if(rqconsulta.Mdatos.ContainsKey("fechacontable")) {
                fechacontable = int.Parse(rqconsulta.GetDatos("fechacontable").ToString());
            }            
            Filtro fr = new Filtro("reverso", "=", "N");
            dtoconsulta.AddFiltro(fr);

            Filtro fc = new Filtro("fcontable", "=", fechacontable.ToString());
            dtoconsulta.AddFiltro(fc);

            Filtro fp = new Filtro("particion", "=", Constantes.GetParticion(fechacontable).ToString());
            dtoconsulta.AddFiltro(fp);
        }
    }
}
