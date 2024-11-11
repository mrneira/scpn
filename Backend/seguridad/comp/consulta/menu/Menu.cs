using core.componente;
using dal.seguridades;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;

namespace seguridad.comp.consulta.menu {

    /// <summary>
    /// Clase que consulta y entrega el menu asociado a un rol.
    /// </summary>
    public class Menu : ComponenteConsulta {

        /// <summary>
        /// Arma y entrega el menu.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            List<Dictionary<String, Object>> lmenu = Menu.GetMenu(rqconsulta);
            List<Dictionary<String, Object>> lmenutransaccion = new List<Dictionary<string, object>>();
            foreach (Dictionary<String,Object> obj in lmenu) {
                string val1 = obj.ElementAt(3).Value != null ? obj.ElementAt(3).Value.ToString():"" ;
                if ( val1 != "" ) {
                    lmenutransaccion.Add(obj);
                }
            }
            MenuAngular ma = new MenuAngular();
            List<Dictionary<String, Object>> lmenujson = ma.Generar(lmenu);
            rqconsulta.Response["menutransaccion"] = lmenutransaccion;
            rqconsulta.Response["menu"] = lmenujson;
            IList<Dictionary<String, Object>> lmodulos = Menu.GetModulosMenu(rqconsulta);
            rqconsulta.Response["lmodulos"] = lmodulos;

        }

        /// <summary>
        /// Busca en la base de datos la definicion del menu y arma el menu.
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// <returns>List<Dictionary<String, Object>></returns>
        private static List<Dictionary<String, Object>> GetMenu(RqConsulta rqconsulta) {
            List<Dictionary<String, Object>> lmenu = null;
            IList<Dictionary<string, object>> datos = TsegRolOpcionesDal.Find(rqconsulta.Crol, rqconsulta.Ccompania);
            lmenu = ArmaMenu(datos);
            return lmenu;
        }
        /// <summary>
        /// Obtiene los módulos que contiene el menú
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// <returns></returns>
        private static IList<Dictionary<String, Object>> GetModulosMenu(RqConsulta rqconsulta)
        {
            IList<Dictionary<string, object>> datos = TsegRolOpcionesDal.FindModulos(rqconsulta.Cusuario, rqconsulta.Ccompania);
           
            return datos;
        }
        /// <summary>
        /// Arma y entrega el menu.
        /// </summary>
        /// <param name="objetos"></param>
        /// <returns>List<Dictionary<string, Object>></returns>
        private static List<Dictionary<string, Object>> ArmaMenu(IList<Dictionary<string, object>> objetos) {
            List<Dictionary<string, Object>> lmenu = new List<Dictionary<string, Object>>();

            foreach (Dictionary<string, object> menu in objetos) {
                string copcion = (string)menu["copcion"];
                string nombremenu = (string)menu["nombre"];
                string copcionpadre = (string)menu["copcionpadre"];
                if (copcionpadre == null) {
                    copcionpadre = "-1";
                }
                int? modulo = null;
                if (menu["cmodulo"] != null) {
                    modulo = int.Parse(menu["cmodulo"].ToString());
                }
                int? transaccion = null;
                if (menu["ctransaccion"] != null) {
                    transaccion = int.Parse(menu["ctransaccion"].ToString());
                }
                string nombretransaccion = (string)menu["nombretran"];
                string pagina = (string)menu["pagina"];
                int autoconsulta = menu["autoconsulta"] != null ? ((Boolean)menu["autoconsulta"]) ? 1 : 0 : 0;
                int orden = int.Parse(menu["orden"].ToString());
                Boolean mostrarenmenu = (Boolean)(menu["mostrarenmenu"].ToString()=="True");
                Boolean crear = (Boolean)(menu["crear"]!=null ? menu["crear"].ToString() == "True":false);
                Boolean editar = (Boolean)(menu["editar"]!=null ? menu["editar"].ToString() == "True":false);
                Boolean eliminar = (Boolean)(menu["eliminar"]!=null ? menu["eliminar"].ToString() == "True":false);

                Dictionary<string, Object> minfo = new Dictionary<string, Object> {
                    ["c"] = copcion
                };
                if (modulo != null && transaccion != null) {
                    minfo["nombre"] = nombretransaccion;
                } else {
                    minfo["nombre"] = nombremenu;
                }
                minfo["modulo"] = modulo;
                minfo["transaccion"] = transaccion;
                minfo["pagina"] = pagina;
                minfo["autoconsulta"] = autoconsulta;
                minfo["orden"] = orden;
                minfo["crear"] = crear;
                minfo["editar"] = editar;
                minfo["eliminar"] = eliminar;
                minfo["cp"] = copcionpadre;
                minfo["mm"] = mostrarenmenu;

                lmenu.Add(minfo);
            }
            return lmenu;
        }

    }
}
