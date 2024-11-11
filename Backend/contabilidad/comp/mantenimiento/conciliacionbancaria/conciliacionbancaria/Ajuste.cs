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

namespace contabilidad.comp.mantenimiento.conciliacionbancaria.conciliacionbancaria
{
    /// <summary>
    /// Clase que encapsula los procedimientos de mantenimiento de ajustes para de mayor y extracto.
    /// </summary>
    public class Ajuste : ComponenteMantenimiento
    {
        /// <summary>
        /// Ejecutar ajustes.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetDatos("tipoAjuste").ToString() == null)
            {
                return;
            }
            string tipoAjuste = (string)rm.Mdatos["tipoAjuste"];
            dynamic array = JsonConvert.DeserializeObject(rm.Mdatos["lregistrosajuste"].ToString());
            switch (tipoAjuste)
            {
                case "M":
                    break;
                case "E":
                    break;
                default:
                    break;
            }
            rm.Mdatos["lregistrosajuste"] = null;
        }
    }
}
