using dal.bancaenlinea;
using dal.seguridades;
using modelo;
using seguridad.comp.login.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.blinea.login {


    class Roles : GrabaSessionBancaLinea {

        /// <summary>
        /// Metodo que prepara lso datos a devolver en la respuesta.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta el login.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            Dictionary<string, object> map = (Dictionary<string, object>)rqmantenimiento.Response["mradicacion"];
            map.Add("roles", GetRoles());
        }

        /// <summary>
        /// Entrega la lista de roles activos asociados al usuario.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        private static List<Dictionary<String, Object>> GetRoles() {
          //  int crol = 23; // leer de parametros
            tbanparametros rolop = TbanParametrosDal.FindInDataBase("CODROL");
            if (rolop==null || rolop.numero==0) {
                throw new AtlasException("BLI-013", "CÓDIGO DE ROL NO PARAMETRIZADO");
            }
            int crol = (int)rolop.numero; 

            List<Dictionary<string, object>> lroles = new List<Dictionary<string, object>>();
            tsegrol rol = TsegRolDal.Find(crol);
            
            Dictionary<string, object> map = new Dictionary<string, object>();
            map.Add("id", crol);
		    map.Add("name", rol!=null?rol.nombre:"");
		    lroles.Add(map);

		    return lroles;
	    }

    }

}
