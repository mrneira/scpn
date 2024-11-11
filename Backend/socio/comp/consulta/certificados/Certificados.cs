using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using dal.socio;

using dal.persona;
using Newtonsoft.Json.Linq;

namespace socio.comp.consulta.certificados
{
    class Certificados: ComponenteConsulta {

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            if (rqconsulta.Mdatos["identificacion"] == null )
            {
                throw new Exception("SOC-777, NO A ENVIADO LA IDENTIFICACIÓN DEL SOCIO");
            }
            tperpersonadetalle personadetalle = TperPersonaDetalleDal.FindByIdentification(rqconsulta.Mdatos["identificacion"].ToString());
            if (personadetalle != null)
            {
                tsoccesantia soc = null;
                if (personadetalle.csocio == 1 && personadetalle.regimen == false)
                {
                    rqconsulta.Response["searchdatos"] = "SOCIOAPORTANTE";
                    soc = TsocCesantiaDal.Find(personadetalle.cpersona, rqconsulta.Ccompania);
                }else if (personadetalle.csocio == 1 && personadetalle.regimen == true)
                {
                    rqconsulta.Response["searchdatos"] = "SOCIONOAPORTANTE";
                }
                else
                {
                    rqconsulta.Response["searchdatos"] = "PERSONA";
                }
                DateTime fechaAux = (soc == null) ? new DateTime(1988, 06, 25) : (DateTime)soc.fingreso;
                
                JObject obj = new JObject {
                                { "identificacion", personadetalle.identificacion},
                                { "fullname", personadetalle.nombre},
                                { "fingreso", fechaAux.ToString("yyyy-MM-dd")}
                            };
                rqconsulta.Response["DATASOCIO"] = obj;
            }
            else
            {
                rqconsulta.Response["searchdatos"] = "CERTIFICADO";
                tsoccertificado soccertificado = TsocCertificadoDal.Find(rqconsulta.Mdatos["identificacion"].ToString());
                if (soccertificado != null)
                {
                    JObject obj = new JObject {
                                { "identificacion", soccertificado.identificacion},
                                { "fullname", soccertificado.apellidopaterno + " " + soccertificado.apellidomaterno + " " + soccertificado.primernombre + " " + soccertificado.segundonombre},
                                { "fingreso", "0000-00-00"}
                            };
                    rqconsulta.Response["DATASOCIO"] = obj;
                }
                else
                {
                    rqconsulta.Response["DATASOCIO"] = null;
                }
            }
        }
    }
}
