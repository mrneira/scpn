using core.componente;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using dal.talentohumano;
using dal.talentohumano.nomina;
using dal.generales;
using util;

namespace talentohumano.comp.mantenimiento.solicitud
{
    /// <summary>
    /// Clase que se encarga de generar registros de horas extras
    /// </summary>
    class GenerarHorasExtras : ComponenteMantenimiento
    {
        /// <summary>
        /// Genera horas extras para el rol de pagos
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (!rm.Mdatos.ContainsKey("cerrar"))
            {
                return;
            }
            IList<tnomhoraextranomina> HEXTRAS = new List<tnomhoraextranomina>();

            if (bool.Parse(rm.Mdatos["cerrar"].ToString()))
            {

                var dlregistros = JsonConvert.DeserializeObject<IList<tnomhoraextranomina>>(@rm.Mdatos["ldatos"].ToString());
                bool aprobada = bool.Parse(rm.Mdatos["aprobada"].ToString());
               
                foreach (tnomhoraextranomina hx in dlregistros)
                {

                    tthcontratodetalle cd = TthContratoDal.FindContratoFuncionario(hx.cfuncionario.Value);
                    tnomhoras param = TnomParamHorasExtrasDal.Find(hx.fingreso.Year, hx.tipocdetalle, cd.regimencdetalle);
                   
                    if (param == null) {
                        tgencatalogodetalle cat = TgenCatalogoDetalleDal.Find(hx.tipoccatalogo.Value, hx.tipocdetalle);
                        tgencatalogodetalle reg = TgenCatalogoDetalleDal.Find(cd.regimenccatalogo.Value, cd.regimencdetalle);

                        throw new AtlasException("TTH-016", "NO SE HA DEFINIDO EL TIPO DE HORA EXTRA: {0} PARA EL RÉGIMEN: {1}", cat.nombre,reg.nombre);
                    }

                    decimal vhora = cd.remuneracion.Value / 240;
                    decimal vtotal = vhora * param.porcentaje.Value;
                    vtotal = decimal.Round(vtotal, 2, MidpointRounding.AwayFromZero);
                    decimal totalHoras = vtotal * hx.horas;
                    totalHoras = decimal.Round(totalHoras, 2, MidpointRounding.AwayFromZero);
                    hx.vhora = vtotal;
                    hx.vtotal = totalHoras;
                    hx.Esnuevo = false;
                    hx.Actualizar = true;
                    hx.estado = false;
                    hx.aprobada = aprobada ? aprobada : false;
                    HEXTRAS.Add(hx);
                }
            }
              
            else
            {
                return;
            }
            rm.AdicionarTabla("tnomhoraextranomina", HEXTRAS, false);

        }
    }
}
