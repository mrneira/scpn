using core.componente;
using dal.bancaenlinea;
using dal.persona;
using dal.seguridades;
using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace seguridad.comp.mantenimiento.blinea.login {

    public class RadicacionUsuario : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que prepara lso datos a devolver en la respuesta.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tbanusuarios usuario = (tbanusuarios)rqmantenimiento.GetDatos("TBANUSUARIOS");

            Dictionary<string, object> mdata = RadicacionUsuario.Llenar(usuario, rqmantenimiento);
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

            tsegpolitica tsegPolitica = TsegPoliticaDal.FindInDataBase(rqmantenimiento.Ccompania, rqmantenimiento.Ccanal);
            if (tsegPolitica.diasvalidez != null) {
                IList<Dictionary<string, object>> l = TbanUsuariosDal.FindPasswords(rqmantenimiento.Cusuario, tsegPolitica.repeticiones ?? 0);
                if (l.Count > 0 && l.ElementAt(0)["fmodificacion"]!=null) {
                    DateTime item = (DateTime)l.ElementAt(0)["fmodificacion"];
                    int fcambio = Fecha.DateToInteger(item);
                    int factual = Fecha.GetFechaSistemaIntger();
                    int dias = Fecha.Resta365(factual, fcambio);
                    if (dias > tsegPolitica.diasvalidez) {
                        tbanusuarios.cambiopassword = "1";
                        EntityHelper.SetActualizar(tbanusuarios);
                        Sessionef.Actualizar(tbanusuarios);
                    }
                }
            }

            map["pss"] = tbanusuarios.cambiopassword;

            tperpersonadetalle tperPersonaUduario = TperPersonaDetalleDal.Find(tbanusuarios.cpersona??0, compania);
            map.Add("np", tperPersonaUduario.nombre);
            map.Add("t", rqmantenimiento.GetDatos("ip"));
            map.Add("cpais", "EC"); // Codigo pais
            map.Add("ci", "ES"); // Codigo idioma
            map.Add("cca", "BAN"); // Codigo canal
            map.Add("factual", Fecha.GetDataBaseTimestamp());
            return map;
        }
    }
}
