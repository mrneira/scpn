using core.componente;
using util.dto.consulta;
using util;
using prestaciones.liquidacion;

namespace prestaciones.comp.consulta.bonificacion {
    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar la binificación por fallecimiento del socio. 
    /// Bonificación entrega en una List<Dictionary<String, Object>>
    /// </summary>
    class BonificacionFallecimiento :ComponenteConsulta {
        public override void Ejecutar(RqConsulta rqconsulta) {
            decimal[] cesantia = new decimal[4];
            Calbonificacacionfallecimiento bonifall = new Calbonificacacionfallecimiento();
            cesantia = bonifall.CalcularBonificacionFallecimiento(rqconsulta);
            object[] valores = new object[] { cesantia[0], cesantia[1], cesantia[2] };
            rqconsulta.Response["BONIFICACIONDEVOLUCION"] = valores;
        }
    }
}
