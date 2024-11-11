using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using dal.prestaciones;
using dal.socio;
using util;
using modelo.interfaces;
using util.servicios.ef;

namespace prestaciones.comp.mantenimiento.novedades {
    class ActualizarLiquidacion : ComponenteMantenimiento {
        decimal? tvalornov = 0;
        List<tpreliquidacion> Lliq = new List<tpreliquidacion>();
        public override void Ejecutar(RqMantenimiento rm) {
            long cpersona = long.Parse(rm.Mdatos["cpersona"].ToString());
            decimal tvalornov = decimal.Parse(rm.Mdatos["tvalor"].ToString());
            List<tpreexpediente> lexp = TpreExpedienteDal.FindToList(cpersona, rm.Ccompania);
            if (lexp.Count > 0) {
                foreach (tpreexpediente obj in lexp) {
                    if (!obj.cdetalleestado.Equals("CAN") && !obj.cdetalleestado.Equals("NEG")) {
                        tpreliquidacion liq = TpreLiquidacionDal.Find((int)obj.secuencia);
                        liq.dnovedades = tvalornov;
                        Lliq.Add(liq);
                    }
                }
            }
            rm.AdicionarTabla("ACTUALIZARLIQUIDACION", Lliq, false);
        }
    }
}
