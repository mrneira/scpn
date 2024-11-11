using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using util.enums;

namespace util.dto.mantenimiento {

    /// <summary>
    /// Request de mantenimientos.
    /// </summary>
    public class RqMantenimientoHelper : RequestMonetario {

        /// <summary>
        /// Map que contiene objetos de tipo BeanMantenimiento, por nombre de tabla o alias.
        /// </summary>
        private Dictionary<string, Tabla> mtablas = new Dictionary<string, Tabla>();

        /** Lista que contiene el orden en el cual se almacenan los bean en la base de datos. */
        private List<string> lorden = new List<string>();

        public Dictionary<string, Tabla> Mtablas { get => mtablas; set => mtablas = value; }
        public List<string> Lorden { get => lorden; set => lorden = value; }


        /// <summary>
        /// Completa informacion del request.
        /// </summary>
        /// <param name="mdatos"></param>
        public void CompletarRequest(Dictionary<string, Object> mdatos) {
            base.LlenarCampos(mdatos["c"]);

            if (Cmodulotranoriginal == EnumModulos.CANALES_DIGITALES.Cmodulo && Ccanal == "CAN") {
                Cusuariobancalinea = Cusuario;
                Cusuario = "BMOVIL";
            }

            if (mdatos.ContainsKey("m") && mdatos.ContainsKey("t") && mdatos["m"] != null && mdatos["t"] != null) {
                Cmodulotranoriginal = Cmodulo;
                Ctranoriginal = Ctransaccion;
                Cmodulo = (int)mdatos["m"];
                Ctransaccion = (int)mdatos["t"];
                mdatos.Remove("m");
                mdatos.Remove("t");
            }
            mdatos.Remove("c");
            // copiar mdatos
            if (mdatos.ContainsKey("mdatos")) {
                JObject a = (JObject)mdatos["mdatos"];
                Dictionary<String, Object> mdatosbean = a.ToObject<Dictionary<String, Object>>();
                this.Mdatos = mdatosbean;

                if (this.Mdatos.ContainsKey("mbce")) {
                    //this.Mbce = this.Mdatos["mbce"].ToString();
                    this.Mbce = new List<modelo.interfaces.IBean>();
                    this.Mdatos.Remove("mbce");
                }

                mdatos.Remove("mdatos");
            }

            if (mdatos.ContainsKey("_RUBROS")) {
                JObject a = (JObject)mdatos["_RUBROS"];
                Dictionary<String, Object> mdatosbean = a.ToObject<Dictionary<String, Object>>();
                base.AdicionarRubros(mdatosbean);
                mdatos.Remove("_RUBROS");
            }
        }

        /// <summary>
        /// Entrega datos de una tabla que llega desde el request.
        /// </summary>
        /// <param name="tabla">Nombre del alias de la tabla a buscar en el dictionary.</param>
        /// <returns>Tabla</returns>
        public Tabla GetTabla(String tabla) {
            if (mtablas == null || !mtablas.ContainsKey(tabla)) {
                return null;
            }
            return mtablas[tabla];
        }




    }
}
