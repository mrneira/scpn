using System;
using core.componente;
using modelo;
using util.dto.mantenimiento;
using Newtonsoft.Json;
using util.servicios.ef;
using dal.contabilidad.conciliacionbancaria;
using util;
using dal.contabilidad;
using contabilidad.enums;
using System.Collections.Generic;
using System.Linq;
using contabilidad.datos;
using dal.tesoreria;

namespace contabilidad.comp.mantenimiento.conciliacionbancaria.conciliacionbancaria
{
    /// <summary>
    /// Clase que encapsula los procedimientos de mantenimiento de la conciliación bancaria.
    /// </summary>
    public class ConciliacionMantenimiento : ComponenteMantenimiento
    {
        /// <summary>
        /// Ejecuta la conciliación bancaria mantenimiento.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetDatos("mes") == null || rm.GetDatos("ccuenta") == null || rm.GetDatos("anio") == null) {
                return;
            }
            int mes = int.Parse(rm.GetDatos("mes").ToString());
            int anio = int.Parse(rm.GetDatos("anio").ToString());
            string ccuenta = rm.GetDatos("ccuenta").ToString();
            TconConciliacionBancariaDal.EliminarConciliacion(mes, anio,ccuenta);
        }
    }
}
