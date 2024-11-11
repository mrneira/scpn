using core.componente;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace persona.comp.mantenimiento.cargapersonas
{
    public class ActualizaImagen : ComponenteMantenimiento
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {      
            
            long cpersona = rm.Cpersona;

            Dictionary<string, long?> marchivoscode = (Dictionary<string, long?>)rm.GetDatos("MARCHIVOSCODE");

            Boolean agrega = false;
            tperpersonadetalle tperPersonaDetalle = TperPersonaDetalleDal.Find(cpersona, rm.Ccompania);
            if (tperPersonaDetalle != null)
            {
                long? cfoto = marchivoscode.ContainsKey("carchivofoto") ? marchivoscode["carchivofoto"] : null;
                long? cfirma = marchivoscode.ContainsKey("carchivofirma") ? marchivoscode["carchivofirma"] : null;
                if (cfoto != null)
                {
                    tperPersonaDetalle.carchivofoto = cfoto;
                    agrega = true;
                }
                if (cfirma != null)
                {
                    tperPersonaDetalle.carchivofirma = cfirma;
                    agrega = true;
                }
                if (agrega)
                {
                    rm.AdicionarTabla("DETALLE", tperPersonaDetalle, 1, false);
                }
            }
            else
            {
                throw new AtlasException("BPER-006", "PERSONA NO ENCONTRADA: {0}", cpersona);
            }
        }
    }
}
