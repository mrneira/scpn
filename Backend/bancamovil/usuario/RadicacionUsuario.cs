using core.componente;
using dal.bancaenlinea;
using dal.persona;
using modelo;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace bancamovil.comp.usuario {

    public class RadicacionUsuario : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que prepara lso datos a devolver en la respuesta.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string serial = rqmantenimiento.GetString("s");
            string cusuario = rqmantenimiento.Cusuario;

            tbanusuarios tbanusuarios = TbanUsuariosDal.Find(cusuario);
            tperpersonadetalle p = TperPersonaDetalleDal.Find(tbanusuarios.cpersona ?? 0, rqmantenimiento.Ccompania);

            Dictionary<string, object> mdata = RadicacionUsuario.Llenar(tbanusuarios, rqmantenimiento);
            rqmantenimiento.Response.Add("mradicacion", mdata);
        }

        /// <summary>
        /// Metodo que arma un map con informacion de radicacion del usuario.
        /// </summary>
        /// <param name="usuarioDetalle">Datos de detalle del usuario.</param>
        /// <param name="terminal">Datos del terminal.</param>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <returns>Dictionary<string, object></returns>
        private static Dictionary<string, object> Llenar(tbanusuarios tbanusuarios, RqMantenimiento rqmantenimiento) {
            Dictionary<string, object> map = new Dictionary<string, object>();
            map.Add("cu", tbanusuarios.cusuario); // Codigo usuario
            map.Add("cp", tbanusuarios.cpersona); // Codigo persona usuario
            int compania = rqmantenimiento.Ccompania;
            map.Add("cc", compania); // Compania
            map.Add("cs", 1);
            map.Add("cag", 1);
            map.Add("ca", 1); // Codigo area

            tperpersonadetalle tperPersonaUduario = TperPersonaDetalleDal.Find(tbanusuarios.cpersona??0, compania);
            map.Add("np", tperPersonaUduario.nombre);
            map.Add("t", rqmantenimiento.GetDatos("ip"));
            map.Add("cpais", "EC"); // Codigo pais
            map.Add("ci", "ES"); // Codigo idioma
            map.Add("cca", "BMV"); // Codigo canal
            map.Add("factual", Fecha.GetDataBaseTimestamp());
            return map;
        }
    }
}
