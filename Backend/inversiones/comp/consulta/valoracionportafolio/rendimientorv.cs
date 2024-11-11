using core.componente;
using util.dto.consulta;
using dal.inversiones.inversiones;

namespace inversiones.comp.consulta.valoracionportafolio
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para operar la calculadora de rendimientos de la Bolsa de Valores de Quito.
    /// </summary>
    public class rendimientorv : ComponenteConsulta
    {
        /// <summary>
        /// Obtener la dirección electrónica de la calculadora de rendimientos de la Bolsa de Valores.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            rqconsulta.Response["CALCULADORA_RENDIMIENTO_BVQ"] = TinvInversionDal.GetParametro("CALCULADORA_RENDIMIENTO_BVQ");
        }
    }
}
