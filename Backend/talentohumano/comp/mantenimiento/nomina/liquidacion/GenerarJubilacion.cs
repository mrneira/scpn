using core.componente;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.datos;
using util.dto.mantenimiento;
using modelo;
using util;

namespace talentohumano.comp.mantenimiento.nomina.liquidacion
{
    public class GenerarJubilacion : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.Mdatos.ContainsKey("nuevo"))
            {
                if (!bool.Parse(rm.Mdatos["nuevo"].ToString()))
                {
                    return;
                }
            }
            if (rm.Mdatos.ContainsKey("cerrada")) {
                bool cerrada = bool.Parse(rm.Mdatos["cerrada"].ToString());
                if (cerrada) {
                    return;
                }
            }
            var detalle = JsonConvert.DeserializeObject<List<tnomjubilaciondetalle>>(rm.Mdatos["ldetalle"].ToString());
           // var jub = JsonConvert.DeserializeObject<tnomjubilacion>(rm.Mdatos["registro"].ToString());

            tnomjubilacion tnomjub = new tnomjubilacion();
            if (rm.GetTabla("JUBILACION") != null)
            {
                tnomjub = (tnomjubilacion)rm.GetTabla("JUBILACION").Lregistros.ElementAt(0);
            }

            Jubilacion jubilacion = new Jubilacion(rm.Ccompania,detalle, tnomjub.sbucalculo.Value,tnomjub.anio.Value,tnomjub.cfuncionario.Value,tnomjub.fjubilacion.Value);
            jubilacion.getDatosGenerales();
            rm.Response["INGRESO"] = jubilacion.ing;
            
            rm.Response["EGRESO"] = jubilacion.egr;


        }
    }
}
