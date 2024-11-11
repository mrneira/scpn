using core.componente;
using dal.cartera;
using dal.generales;
using dal.persona;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.desembolso {

    /// <summary>
    ///  Clase que se encarga de consultar las operaciones aprobadas para desembolsar.
    /// </summary>
    public class OperacionesDesembolso : ComponenteConsulta {

        /// <summary>
        /// Consulta datos de operaciones aprobadas para desembolsar.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            List<tcaroperacion> loperaciones = new List<tcaroperacion>();
            IList<tcaroperacion> lop = TcarOperacionDal.FindOperacionesDesembolso();

            foreach (tcaroperacion op in lop) {
                //if (op.cusuarioaprobacion.Equals(rqconsulta.Cusuario)) {
                    op.AddDatos("npersona", TperPersonaDetalleDal.Find((int)op.cpersona, (int)op.ccompania).nombre);
                    op.AddDatos("nproducto", TgenProductoDal.Find((int)op.cmodulo, (int)op.cproducto).nombre);
                    op.AddDatos("ntipoproducto", TgenTipoProductoDal.Find((int)op.cmodulo, (int)op.cproducto, (int)op.ctipoproducto).nombre);
                    op.AddDatos("nestadooperacion", TcarEstadoOperacionDal.Find(op.cestadooperacion).nombre);
                    loperaciones.Add(op);
                //}
            }

            resp["OPERACIONESDESEMBOLSOMASIVO"] = loperaciones;
        }
    }
}
