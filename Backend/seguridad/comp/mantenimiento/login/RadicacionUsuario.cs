using dal.generales;
using dal.persona;
using dal.seguridades;
using dal.talentohumano;

using modelo;
using modelo.helper;
using seguridad.comp.login.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace seguridad.comp.mantenimiento.login {

    public class RadicacionUsuario : GrabaSession {

        /// <summary>
        /// Metodo que prepara lso datos a devolver en la respuesta.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tsegusuariodetalle obj = (tsegusuariodetalle)rqmantenimiento.GetDatos("TSEGUSUARIODETALLE");
            tsegterminal ter = (tsegterminal)rqmantenimiento.GetDatos("TSEGTERMINAL");
            Dictionary<string, object> mdata = RadicacionUsuario.Llenar(obj, ter, rqmantenimiento);
            rqmantenimiento.Response["mradicacion"] = mdata;
            rqmantenimiento.Response["usuariobpm"] = obj.usuariobpm;
            rqmantenimiento.Response["impresoraslip"] = obj.impresoraslip;

        }

        /// <summary>
        /// Metodo que arma un map con informacion de radicacion del usuario.
        /// </summary>
        /// <param name="usuarioDetalle">Datos de detalle del usuario.</param>
        /// <param name="terminal">Datos del terminal.</param>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <returns>Dictionary<string, object></returns>
        private static Dictionary<string, object> Llenar(tsegusuariodetalle usuarioDetalle, tsegterminal terminal, RqMantenimiento rqmantenimiento) {
            tgenparametros timeoutminutos = TgenParametrosDal.Find("TIMEOUTMIN", rqmantenimiento.Ccompania);
            tgenparametros timeoutsegundos = TgenParametrosDal.Find("TIMEOUTSEG", rqmantenimiento.Ccompania);
            Dictionary<String, Object> map = new Dictionary<String, Object> {
                ["cu"] = usuarioDetalle.cusuario, // Codigo usuario
                ["sb"] = usuarioDetalle.sobrenombre, // Sobrenombre usuario
                ["cp"] = usuarioDetalle.cpersona // Codigo persona usuario
            };
            int compania = (int)usuarioDetalle.ccompania;
            map["cc"] = compania; // Compania
            tgencompania tgenCompania = TgenCompaniaDal.Find(compania);
            tperpersonadetalle tperPersonaDetalle = TperPersonaDetalleDal.Find((long)tgenCompania.cpersona, compania);
            map["nc"] = tperPersonaDetalle.nombre; // Nombre compania

            map["cs"] = usuarioDetalle.csucursal;
            map["cag"] = usuarioDetalle.cagencia;
            map["ca"] = usuarioDetalle.carea; // Codigo area

            tsegpolitica tsegPolitica = TsegPoliticaDal.FindInDataBase(rqmantenimiento.Ccompania, rqmantenimiento.Ccanal);
            if (tsegPolitica.diasvalidez != null) {
                IList<Dictionary<string, object>> l = TsegUsuarioDetalleDal.FindPasswords(rqmantenimiento.Cusuario, rqmantenimiento.Ccompania, tsegPolitica.repeticiones ?? 0);
                if (l.Count > 0 && l.ElementAt(0)["fmodificacion"]!=null) {
                    DateTime item = (DateTime)l.ElementAt(0)["fmodificacion"];
                    int fcambio = Fecha.DateToInteger(item);
                    int factual = Fecha.GetFechaSistemaIntger();
                    int dias = Fecha.Resta365(factual, fcambio);
                    if (dias > tsegPolitica.diasvalidez) {
                        usuarioDetalle.cambiopassword = "1";
                        EntityHelper.SetActualizar(usuarioDetalle);
                        Sessionef.Actualizar(usuarioDetalle);
                    }
                }
            }

            map["pss"] = usuarioDetalle.cambiopassword;

            tperpersonadetalle pu = TperPersonaDetalleDal.Find((long)usuarioDetalle.cpersona, compania);
            map["np"] = pu.nombre;
            tgenagencia agencia = TgenAgenciaDal.Find((int)usuarioDetalle.cagencia, (int)usuarioDetalle.csucursal, (int)usuarioDetalle.ccompania);
            map["age"] = agencia.nombre;
            if (terminal != null) {// Terminal
                map["t"] = terminal.cterminal;
            } else {
                map["t"] = rqmantenimiento.Cterminalremoto;
            }
            // map.put("ce", cestatus);
            // map.put("ne", destatus);
            map["cpais"] = "EC"; // Codigo pais
            map["ci"] = "ES"; // Codigo idioma
            map["cca"] = usuarioDetalle.ccanal; // Codigo canal
            map["factual"] = DateTime.Now;
            map["timeoutminutos"] = timeoutminutos.texto.ToString();
            map["cfuncionario"] = TthFuncionarioDal.FindCpersona((long)usuarioDetalle.cpersona);
            map["cfuncionariojefe"] = TthFuncionarioDal.FindCJefeFuncionario((long)usuarioDetalle.cpersona);
            map["ambiente"] = TgenParametrosDal.GetValorTexto("AMBIENTE", rqmantenimiento.Ccompania);
            map["timeoutsegundos"] = timeoutsegundos.texto.ToString();
            return map;
        }
    }
}
