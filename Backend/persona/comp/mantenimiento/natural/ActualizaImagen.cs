using core.componente;
using core.servicios;
using dal.generales;
using dal.persona;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using Newtonsoft.Json;
using modelo.helper;
using modelo.interfaces;

namespace persona.comp.mantenimiento.natural {

    /// <summary>
    /// Clase que actualiza el codigo de foto y firma en el detalle de la persona
    /// </summary>
    public class ActualizaImagen : ComponenteMantenimiento {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            long cpersona = rm.Cpersona;

            Dictionary<string, long?> marchivoscode = (Dictionary<string, long?>)rm.GetDatos("MARCHIVOSCODE");

            Boolean agrega = false;
            tperpersonadetalle tperPersonaDetalle = TperPersonaDetalleDal.Find(cpersona, rm.Ccompania);
            if (tperPersonaDetalle != null && tperPersonaDetalle.cpersona!=0) {
                long? cfoto = marchivoscode.ContainsKey("carchivofoto")? marchivoscode["carchivofoto"]:null;
                long? cfirma = marchivoscode.ContainsKey("carchivofirma") ? marchivoscode["carchivofirma"] : null;

                if (cfoto != null) {
                    tperPersonaDetalle.carchivofoto = cfoto;
                    agrega = true;
                }
                if (cfirma != null) {
                    tperPersonaDetalle.carchivofirma = cfirma;
                    agrega = true;
                }
                if (agrega) {
                    List<IBean> lbean = new List<IBean>();
                    lbean.Add(tperPersonaDetalle);
                    rm.AdicionarTabla("DETALLE", lbean, 1, true);
                }
            } else {
                throw new AtlasException("BPER-006", "PERSONA NO ENCONTRADA: {0}", cpersona);
            }
        }
    }
}
