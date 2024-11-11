using core.componente;
using dal.contabilidad.conciliacionbancaria;
using System.Collections.Generic;
using util.dto.consulta;
using dal.contabilidad.reportes;

namespace contabilidad.comp.consulta.reportes
{
    class LibroMayor : ComponenteConsulta
    {
        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            IList<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            lresp = TconLibroMayorDal.GetLibroMayor(rqconsulta);
            rqconsulta.Response["LIBROMAYOR"] = lresp;

        }
    }
    
}
