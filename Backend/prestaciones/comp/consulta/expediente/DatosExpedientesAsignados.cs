using core.componente;
using dal.prestaciones;
using modelo;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util.dto.consulta;

namespace prestaciones.comp.consulta.expediente
{
    class DatosExpedientesAsignados : ComponenteConsulta
    {
        public object TpreexpedienteDal { get; private set; }
        /// <summary>
        /// Clase que entrega los datos del expediente
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string transaccion = rqconsulta.Cmodulo + "^" + rqconsulta.Ctransaccion;
            switch (transaccion){
                case "28^57":
                    {
                        string filterLike = null;
                        foreach (var clave in rqconsulta.Mdatos)
                        {
                            if (clave.Key == "filterlike"){
                                filterLike = (string) clave.Value;
                                break;
                            }
                        }
                        if (filterLike == null)
                        {
                            rqconsulta.Response["cod"] = "PRE-035";
                            rqconsulta.Response["msgusu"] = "NO SE A ENVIADO LA CLAVE filterlike, PARA EL MÓDULO " + rqconsulta.Cmodulo + ", TRANSACCIÓN " + rqconsulta.Ctransaccion + ".";
                        }
                        else{
                            Response resp = rqconsulta.Response;
                            List<tgensecuencia> obj = null;
                            obj = TpreExpedienteAsignacionDal.FindLastValueExpedients(filterLike);
                            resp["EXPEDIENTEREPORTE"] = obj;
                        }
                    }; break;
                default:
                    {
                        rqconsulta.Response["cod"] = "PRE-035";
                        rqconsulta.Response["msgusu"] = "NO SE PUEDE EJECUTAR LA TRANSACCIÓN CON MÓDULO " + rqconsulta.Cmodulo + ", TRANSACCIÓN " + rqconsulta.Ctransaccion + ", LA TRANSACCIÓN NO ESTA PERMITIDA.";
                    }; break;
            }
        }
    }
}
