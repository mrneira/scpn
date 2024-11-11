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
    /// Clase que encapsula los procedimientos de mantenimiento de la conciliación bancaria.
    /// </summary>
    public class Conciliacion : ComponenteMantenimiento
    {
        /// <summary>
        /// Ejecuta la conciliación bancaria.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            //RRO 20221213
            dynamic lAjustesLibro = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosajustelibro"].ToString());
            dynamic lAjustesExtracto = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosajustextracto"].ToString());
            dynamic array = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosgrabar"].ToString());

            foreach (var item in array)
            {
                TconLibroBancosDal.ActualizarConciliacionLibroBanco(Convert.ToInt64(item.rclibrobanco));
                TconExtractoBancarioDal.ActualizarConciliacionExtracto(Convert.ToInt64(item.rcconconciliacionbancariaextracto));
            }


            foreach (var item in lAjustesLibro)
            {
                TconLibroBancosDal.ActualizarAjusteLibroBanco(Convert.ToInt64(item.clibrobanco));
            }


            foreach (var item in lAjustesExtracto)
            {
                TconExtractoBancarioDal.ActualizarAjusteExtracto(Convert.ToInt64(item.cextractobancario));
            }

            rqmantenimiento.Mdatos["lregistrosgrabar"] = null;
            rqmantenimiento.Mdatos["lregistrosajustextracto"] = null;
            rqmantenimiento.Mdatos["lextractoajuste"] = null;
        }
    }

}
