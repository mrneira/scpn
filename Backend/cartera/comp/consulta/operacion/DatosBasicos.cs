using core.componente;
using dal.cartera;
using dal.generales;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.operacion {

    /// <summary>
    /// Clase que se encarga de consultar datos basicos de operaciones de cartera.
    /// </summary>
    public class DatosBasicos : ComponenteConsulta {

        /// <summary>
        /// Consulta datos basicos de la operacion.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            String coperacion = rqconsulta.Coperacion;
            tcaroperacion tcaroperacion = TcarOperacionDal.FindSinBloqueo(coperacion);

          
            List<Dictionary<string, object>> loperacion = new List<Dictionary<string, object>>();
            Dictionary<string, object> moperacion = new Dictionary<string, object>();
            moperacion["cmoneda"] = tcaroperacion.cmoneda;
            moperacion["n_moneda"] = TgenMonedaDal.Find(tcaroperacion.cmoneda).nombre;
            moperacion["cpersona"] = tcaroperacion.cpersona;
            moperacion["n_persona"] = TperPersonaDetalleDal.Find((long)tcaroperacion.cpersona, rqconsulta.Ccompania).nombre;
            moperacion["identificacion"] = TperPersonaDetalleDal.Find((long)tcaroperacion.cpersona, rqconsulta.Ccompania).identificacion;
            moperacion["valorcuota"] = tcaroperacion.valorcuota;
            loperacion.Add(moperacion);

            resp["OPERACION"] = loperacion;
        }
    }
}
