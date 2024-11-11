using core.componente;
using dal.cartera;
using dal.generales;
using System;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;
using modelo;
using dal.persona;

namespace bancamovil.comp.consulta.socios {

    /// <summary>
    /// Clase que se encarga de consultar datos de prestaciones.
    /// </summary>
    public class InformacionPrestaciones : ComponenteConsulta {

        /// <summary>
        /// Consulta datos basicos de prestaciones.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];

            List<Dictionary<string, object>> ldatos = new List<Dictionary<string, object>>();
            Dictionary<string, object> mdatos = new Dictionary<string, object> {
                ["numeroaportes"] = 351,
                ["montoaportes"] = 12354.56,
                ["tiemposervicio"] = 15.2,
                ["fechaalta"] = new DateTime(2018, 01, 22),
                ["fechabaja"] = null,
                ["tiempoliquidacion"] = null,
                ["estadoliquidacion"] = "",
                ["tipobaja"] = ""
            };
            ldatos.Add(mdatos);

            resp["DATOSPRESTACIONES"] = ldatos;
        }
    }
}

