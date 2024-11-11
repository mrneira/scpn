using core.componente;
using util.dto.consulta;
using util;
using prestaciones.liquidacion;
using System.Collections.Generic;
using dal.prestaciones;
using System;
using System.Data;

namespace prestaciones.comp.consulta.bonificacion {
    class Bonificacion {
        /// <summary>
        ///  Clase que se encarga de consultar la bonificación del socio.
        /// </summary> 
        /// 
        Calbonificacion calbonif = new Calbonificacion();
        decimal cuantiabasica = 0m;
        public object[] Ejecutar(long cpersona, string cdetallejerarquia, IList<Dictionary<string, object>> taportes, DateTime fechabaja, int coeficiente, bool actosservicio) {
            bool tiempomixto = TpreTiempoMixto.AplicaTiempoMixto(cpersona);
            decimal[] cesantia = new decimal[4];
            switch(cdetallejerarquia) {
                case "OFI":
                    cesantia = BonificacionOficiales(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, tiempomixto, actosservicio);
                    break;
                case "CLA":
                    cesantia = BonificacionClases(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, actosservicio);
                    break;
                default:
                    throw new AtlasException("PRE-0004", "JERARQUIA NO DEFINIDA PARA LA CPERSONA:{0}", cpersona);
            }
            object[] valores = new object[] { cesantia[1], cuantiabasica, cesantia[0], cesantia[2], tiempomixto };
            return valores;
        }
        /// <summary>
        /// Méttodo que obtiene la binificación por jerarquia oficiales
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="cdetallejerarquia"></param>
        /// <param name="taportes"></param>
        /// <param name="fechabaja"></param>
        /// <param name="coeficiente"></param>
        /// <param name="tiempomixto"></param>
        /// <returns></returns>
        public decimal[] BonificacionOficiales(long cpersona, string cdetallejerarquia, IList<Dictionary<string, object>> taportes, DateTime fechabaja, int coeficiente, bool tiempomixto, bool actosservicio) {
            decimal[] cesantia = new decimal[4];
            if(tiempomixto) {
                if(aplicaTiempoMixto(cpersona, fechabaja)) {
                    cesantia = valorBonificacionOficiales(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, tiempomixto, actosservicio);
                } else {
                    cesantia = BonificacionClases(cpersona, "CLA", taportes, fechabaja, coeficiente, actosservicio);
                }
            } else {
                cesantia = valorBonificacionOficiales(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, tiempomixto, actosservicio);
            }
            return cesantia;
        }
        /// <summary>
        ///  Méttodo que calcula la binificación por jerarquia oficiales
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="cdetallejerarquia"></param>
        /// <param name="taportes"></param>
        /// <param name="fechabaja"></param>
        /// <param name="coeficiente"></param>
        /// <param name="tiempoMixto"></param>
        /// <returns></returns>
        decimal[] valorBonificacionOficiales(long cpersona, string cdetallejerarquia, IList<Dictionary<string, object>> taportes, DateTime fechabaja, int coeficiente, bool tiempoMixto, bool actosservicio) {
            int anio = fechabaja.Year;
            decimal[] cesantia = new decimal[4];
            cuantiabasica = TpreCuantiaBasicaDal.Find(anio, cdetallejerarquia).valor;
            cesantia = calbonif.BonificacionOficiales(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, cuantiabasica, tiempoMixto, actosservicio);
            return cesantia;
        }
        /// <summary>
        /// Méttodo que obtiene la binificación por jerarquia clases
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="cdetallejerarquia"></param>
        /// <param name="taportes"></param>
        /// <param name="fechabaja"></param>
        /// <param name="coeficiente"></param>
        /// <param name="tiempoMixto"></param>
        /// <returns></returns>
        public decimal[] BonificacionClases(long cpersona, string cdetallejerarquia, IList<Dictionary<string, object>> taportes, DateTime fechabaja, int coeficiente, bool actosservicio, bool tiempoMixto = false) {
            decimal[] cesantia = new decimal[4];
            int anio = fechabaja.Year;
            cuantiabasica = TpreCuantiaBasicaDal.Find(anio, cdetallejerarquia).valor;
            cesantia = calbonif.BonificacionClases(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, cuantiabasica, tiempoMixto, actosservicio);
            return cesantia;
        }
        /// <summary>
        /// Méttodo que verifica tiempo de servicio por jerarquia oficiales
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="fechaAlta"></param>
        /// <param name="fechaBaja"></param>
        /// <returns></returns>
        Boolean validarTiempoOficial(long cpersona, DateTime fechaAlta, DateTime fechaBaja) {
            int? numaportesOficial = TpreAportesDal.GetNumAporteOficial(cpersona, fechaAlta, fechaBaja);
            decimal numaportesminimosoficial = TpreParametrosDal.GetValorNumerico("CAN-MINIMA-APORTES-OFICIALES");
            if(numaportesOficial >= numaportesminimosoficial)
                return true;
            else
                return false;
        }
        /// <summary>
        /// Méttodo que verifica tiempo mixto
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="fechabaja"></param>
        /// <returns></returns>
        Boolean aplicaTiempoMixto(long cpersona, DateTime fechabaja) {
            DateTime fechaalta = new DateTime();
            IList<Dictionary<string, object>> fechas = new List<Dictionary<string, object>>();
            fechas = TpreTiempoMixto.Find(cpersona);
            foreach(Dictionary<string, object> m in fechas) {
                if(Convert.ToString(m["cdetallejerarquia"]) == "OFI") {
                    fechaalta = Convert.ToDateTime(m["fechaAlta"]);
                }
            }

            if(validarTiempoOficial(cpersona, fechaalta, fechabaja))
                return true;
            else
                return false;
        }
    }
}
