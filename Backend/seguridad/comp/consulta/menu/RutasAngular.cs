using core.componente;
using dal.generales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;

namespace seguridad.comp.consulta.menu {

    /// <summary>
    /// Clase que consulta y entrega las rutas de transacciones asociadas a un rol.
    /// </summary>
    public class RutasAngular : ComponenteConsulta {

        /// <summary>
        /// Ejecuta la consultas de rutas por transaccion.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            rqconsulta.Response["rutas"] = RutasAngular.GetRutas(rqconsulta);
        }

        /// <summary>
        /// Entrega las rutas por transaccion.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        /// <returns>List<Dictionary<String, Object>></returns>
        private static List<Dictionary<String, Object>> GetRutas(RqConsulta rqconsulta) {
            IList<Dictionary<string, object>> datos = TgentransaccionDal.FindRutas(rqconsulta.Crol, rqconsulta.Ccompania);
            List<Dictionary<String, Object>>  lrutas = ArmarRutas(datos);
            return lrutas;
        }

        /// <summary>
        /// Amra las rutas por transaccion.
        /// </summary>
        /// <param name="objetos">Objeto con la definicion de las rutas.</param>
        /// <returns>List<Dictionary<String, Object>></returns>
        private static List<Dictionary<String, Object>> ArmarRutas(IList<Dictionary<string, object>> objetos) {
            List<Dictionary<String, Object>> lrutas = new List<Dictionary<String, Object>>();
            foreach (Dictionary<string, object> obj in objetos) {
                if (obj["cmodulo"] == null || obj["ruta"] == null) {
                    continue;
                }
                int modulo = int.Parse(obj["cmodulo"].ToString());
                int transaccion = int.Parse(obj["ctransaccion"].ToString());
                String ruta = (String)obj["ruta"];
                Dictionary<String, Object> mruta = new Dictionary<String, Object> {
                    // ejemplo de ruta
                    // { path: '0-2', loadChildren: 'app/modulos/generales/modulos/modulos.module#ModulosModule', canActivate:
                    // [VerificaAutorizacionService] },
                    ["path"] = "" + modulo + "-" + transaccion,
                    ["loadChildren"] = ruta
                };
                String[] canActivate = new String[1];
                canActivate[0] = ""; // En pantalla modificado con el tipo de dato "VerificaAutorizacionService", no como string
                mruta["canActivate"] = canActivate;

                lrutas.Add(mruta);
            }
            return lrutas;
        }

    }
}
