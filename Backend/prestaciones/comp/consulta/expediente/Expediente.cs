using core.componente;
using dal.prestaciones;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util.dto.consulta;

namespace prestaciones.comp.consulta.expediente {
    class Expediente :ComponenteConsulta {
        public object TpreexpedienteDal { get; private set; }
        /// <summary>
        /// Clase que entrega los datos del expediente
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];
            string cdetalletipoexp = rqconsulta.Mdatos["cdetalletipoexp"].ToString();
            string etapa = rqconsulta.Mdatos["etapa"].ToString();
            tpreexpediente obj;
            obj = TpreExpedienteDal.FindToLiquidacion(cpersona, rqconsulta.Ccompania, cdetalletipoexp, etapa.Equals("5") ? true : false);
            resp["EXPEDIENTE"] = obj;
        }
    }
}
