using core.componente;
using modelo.interfaces;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using dal.socio;
using System.Globalization;

namespace persona.comp.mantenimiento {
    class Socio :ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {
            if(rm.GetTabla("SOCIO") == null || rm.GetTabla("SOCIO").Lregistros.Count() <= 0) {
                return;
            }
            long? cpersona = rm.GetLong("c_pk_cpersona");
            string formatofechaproceso = string.Empty, formatofechaodengen = string.Empty;
            DateTime festado, fordengen;
            if(rm.GetTabla("SOCIO") != null) {
                long? secuencia = TsocCesantiaHistoricoDal.GetMaxSecuencia((long)cpersona, rm.Ccompania) + 1;
                tsoccesantia obj = (tsoccesantia)rm.GetTabla("SOCIO").Lregistros.ElementAt(0);
                int gradoactual = int.Parse(obj.Mdatos["cgradoactual"].ToString());
                int cestadosocio = int.Parse(obj.Mdatos["cestadosocio"].ToString());
                string ordengen = obj.Mdatos["ordengen"].ToString();
                if(obj.Mdatos.ContainsKey("fformatoproceso")) {
                    formatofechaproceso = obj.Mdatos["fformatoproceso"].ToString();
                    festado = DateTime.ParseExact(obj.Mdatos["festado"].ToString(), formatofechaproceso, CultureInfo.InvariantCulture);
                } else {
                    festado = DateTime.Parse(obj.Mdatos["festado"].ToString());
                }
                if(obj.Mdatos.ContainsKey("fformatoordengen")) {
                    formatofechaodengen = obj.Mdatos["fformatoordengen"].ToString();
                    fordengen = DateTime.ParseExact(obj.Mdatos["fordengen"].ToString(), formatofechaodengen, CultureInfo.InvariantCulture);
                } else {
                    fordengen = DateTime.Parse(obj.Mdatos["fordengen"].ToString());
                }
                tsoccesantiahistorico tsoccesantiahistorico = TsocCesantiaHistoricoDal.Crear();
                if(obj.Esnuevo) {
                    obj.ccompania = rm.Ccompania;
                    obj.cpersona = (long)cpersona;
                    obj.secuenciahistorico = (int)secuencia;
                    tsoccesantiahistorico.cpersona = (long)cpersona;
                    tsoccesantiahistorico.ccompania = rm.Ccompania;
                    tsoccesantiahistorico.secuencia = (int)secuencia;
                    tsoccesantiahistorico.verreg = 0;
                    tsoccesantiahistorico.optlock = 0;
                    tsoccesantiahistorico.cgradoactual = gradoactual;
                    tsoccesantiahistorico.cestadosocio = cestadosocio;
                    tsoccesantiahistorico.ordengen = ordengen;
                    tsoccesantiahistorico.festado = festado;
                    tsoccesantiahistorico.fordengen = fordengen;
                    tsoccesantiahistorico.fechaproceso = rm.Freal;
                    tsoccesantiahistorico.activo = true;

                } else {
                    //tsoccesantia tsoccesantia = TsocCesantiaDal.Find((long)cpersona, (int)rm.Ccompania);
                    tsoccesantiahistorico = TsocCesantiaHistoricoDal.Find((long)cpersona, (int)rm.Ccompania);
                    tsoccesantiahistorico.verreg = 0;
                    tsoccesantiahistorico.optlock = 0;
                    tsoccesantiahistorico.cgradoactual = gradoactual;
                    tsoccesantiahistorico.cestadosocio = cestadosocio;
                    tsoccesantiahistorico.ordengen = ordengen;
                    tsoccesantiahistorico.festado = festado;
                    tsoccesantiahistorico.fordengen = fordengen;
                    // rm.AdicionarTabla("tsoccesantia", tsoccesantia, false);
                }
                rm.AdicionarTabla("TsocCesantiahistorico", tsoccesantiahistorico, false);

            }
        }
    }
}

