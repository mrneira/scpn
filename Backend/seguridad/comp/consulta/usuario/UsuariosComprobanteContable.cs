using core.componente;
using dal.seguridades;
using modelo;
using System.Collections.Generic;
using util.dto.consulta;

namespace seguridad.comp.consulta.usuario {

    /// <summary>
    /// Clase encargada de validar el horario de acceso a la aplicacion.
    /// </summary>
    /// <author>diza</author>
    public class UsuariosComprobanteContable : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega los usuarios que intervienen en un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            int ccompania = rqconsulta.Ccompania;
            IList<Dictionary<string, object>> lresp = TsegUsuarioDetalleDal.ListaUsuarios(ccompania);
            List<tperpersona> ldatos = new List<tperpersona>();

            foreach (Dictionary<string, object> obj in lresp) {

                tperpersona d = new tperpersona();
                d.AddDatos("cpersona", obj["cpersona"].ToString());
                d.AddDatos("nombre", obj["nombre"].ToString());
                ldatos.Add(d);
            }
            rqconsulta.Response["USUARIOSCOMPROCONTABLE"] = ldatos;
        }

    }
}
