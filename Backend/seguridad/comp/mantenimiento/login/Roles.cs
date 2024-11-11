using dal.seguridades;
using seguridad.comp.login.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.login {


    class Roles : GrabaSession {

        /// <summary>
        /// Metodo que prepara lso datos a devolver en la respuesta.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta el login.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            Dictionary<string, object> map = (Dictionary<string, object>)rqmantenimiento.Response["mradicacion"];
            String usuario = map["cu"].ToString();
            map["roles"] = GetRoles(usuario, rqmantenimiento.Ccompania);
        }

        /// <summary>
        /// Entrega la lista de roles activos asociados al usuario.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        private static List<Dictionary<string, Object>> GetRoles(string cusuario, int ccompania) {
            List<Dictionary<string, Object>> lroles = new List<Dictionary<string, object>>();
            IList<Dictionary<string, object>> datos = TsegRolDal.Find(cusuario, ccompania);
            foreach (Dictionary<string, object> roles in datos) {
                String crol = "" + roles["crol"];
                String nombre = (String)roles["nombre"];
                Dictionary<string, object> lmap = new Dictionary<string, object> {
                    ["id"] = crol,
                    ["name"] = nombre
                };
                lroles.Add(lmap);
            }
            if (lroles.Capacity < 1) {
                throw new AtlasException("SEG-017", "EL USUARIO {0} NO TIENE ASOCIADO ROLES PARA LA COMPANIA: {1}", cusuario, ccompania);
            }
            return lroles;
        }
    }

}
