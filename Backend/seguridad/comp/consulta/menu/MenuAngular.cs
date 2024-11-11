using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace seguridad.comp.consulta.menu {
    public class MenuAngular {

        /// <summary>
        /// Genera el menu en json para angular.
        /// </summary>
        /// <param name="ldataMenu"></param>
        /// <returns>List<Dictionary<String, Object>></returns>
        public List<Dictionary<String, Object>> Generar(List<Dictionary<String, Object>> ldataMenu) {
            List<Dictionary<String, Object>> lmenujson = new List<Dictionary<String, Object>>();
            List<Dictionary<String, Object>> dataInicial = this.GetNivelMenu(ldataMenu, "-1"); // primer nivel del menu
            foreach(Dictionary<String, Object> menu in dataInicial) {
                String codigo = (String)menu["c"];
                String nombre = (String)menu["nombre"];
                Dictionary<String, Object> mapMenu = this.GenerarNivel(nombre);
                this.AgregarItemMenu(ldataMenu, codigo, mapMenu);
                lmenujson.Add(mapMenu);
            }

            return lmenujson;
        }

        /// <summary>
        /// Agrega un item al menu. 
        /// </summary>
        /// <param name="ldataMenu"></param>
        /// <param name="codigoPadre">Codigo padre del menu.</param>
        /// <param name="mapMenu">Menu a adicionar item.</param>
        private void AgregarItemMenu(List<Dictionary<string, Object>> ldataMenu, string codigoPadre, Dictionary<string, Object> mapMenu) {
            List<Dictionary<string, Object>> dataInicial = this.GetNivelMenu(ldataMenu, codigoPadre);
            List<Dictionary<string, Object>> lmenujsonhijo = new List<Dictionary<string, Object>>();
            List<Dictionary<string, Object>> lmenuitem = new List<Dictionary<string, Object>>();
            foreach(Dictionary<string, Object> menu in dataInicial) {
                string codigo = (string)menu["c"];
                string nombre = (string)menu["nombre"];
                int autoconsulta = (int)menu["autoconsulta"];
                int? modulo = null;
                int? transaccion = null;
                if(menu["modulo"] != null) {
                    modulo = (int)menu["modulo"];
                    transaccion = (int)menu["transaccion"];
                }

                if(modulo == null && transaccion == null) {
                    Dictionary<string, Object> DictionaryMenuHijo = this.GenerarNivel(nombre);
                    this.AgregarItemMenu(ldataMenu, codigo, DictionaryMenuHijo);
                    lmenujsonhijo.Add(DictionaryMenuHijo);
                    mapMenu["items"] = lmenujsonhijo;
                } else {
                    Boolean mostrarenmenu = (Boolean)menu["mm"];
                    // string autoconsulta = (string) menu.get("autoconsulta");
                    if(!mostrarenmenu) {
                        continue;
                    }

                    Boolean crear = menu["crear"] == null ? false : (Boolean)menu["crear"];
                    Boolean editar = menu["editar"] == null ? false : (Boolean)menu["editar"];
                    Boolean eliminar = menu["eliminar"] == null ? false : (Boolean)menu["eliminar"];

                    Dictionary<string, string> mcommand = new Dictionary<string, string>
                    {
                        ["path"] = "/" + modulo + "-" + transaccion,
                        ["mod"] = "" + modulo,
                        ["tran"] = "" + transaccion,
                        ["tit"] = "" + modulo + "-" + transaccion + " " + CultureInfo.InvariantCulture.TextInfo.ToTitleCase(nombre.ToLower()),
                        ["cre"] = crear ? "" + true : "" + false,
                        ["edi"] = editar ? "" + true : "" + false,
                        ["eli"] = eliminar ? "" + true : "" + false,
                        ["ac"] = autoconsulta == 1 ? "" + true : "" + false
                    };
                    Dictionary<string, Object> mitem = new Dictionary<string, Object>
                    {
                        ["label"] = CultureInfo.InvariantCulture.TextInfo.ToTitleCase(nombre.ToLower()),
                        ["icon"] = "play_arrow",
                        ["command"] = mcommand
                    };
                    lmenuitem.Add(mitem);
                }
            }
            if(lmenuitem.Capacity > 0) {
                if(mapMenu.ContainsKey("items")) {
                    lmenuitem.AddRange((List<Dictionary<string, Object>>)mapMenu["items"]);
                }
                mapMenu["items"] = lmenuitem;
            }
        }

        /// <summary>
        /// Genera un nivel de menu.
        /// </summary>
        /// <param name="nombre">Nombre del nivel de menu.</param>
        /// <returns>Dictionary<string, Object></returns>
        private Dictionary<string, Object> GenerarNivel(string nombre) {
            Dictionary<string, Object> DictionaryMenu = new Dictionary<string, Object>
            {
                ["label"] = nombre,
                ["icon"] = "menu"
            };
            return DictionaryMenu;
        }

        /// <summary>
        /// Entrega un nivel de menu.
        /// </summary>
        /// <param name="dataMenu">Lista que contiene elementos a buscar los asociados al codigo padre.</param>
        /// <param name="codigoPadre">Codigo padre.</param>
        /// <returns>List<Dictionary<string, Object>></returns>
        private List<Dictionary<string, Object>> GetNivelMenu(List<Dictionary<string, Object>> dataMenu, string codigoPadre) {
            List<Dictionary<string, Object>> data = new List<Dictionary<string, Object>>();
            foreach(Dictionary<string, Object> menu in dataMenu) {
                Boolean mostrarenmenu = (Boolean)menu["mm"];
                // string autoconsulta = (string) menu.get("autoconsulta");
                if(!mostrarenmenu) {
                    continue;
                }
                string codigo = (string)menu["cp"];
                if(codigo.CompareTo(codigoPadre) == 0) {
                    data.Add(menu);
                }
            }
            return data;
        }
    }
}
