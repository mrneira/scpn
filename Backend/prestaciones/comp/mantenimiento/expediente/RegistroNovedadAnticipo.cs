using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.expediente {
    class RegistroNovedadAnticipo :ComponenteMantenimiento {
        /// <summary>
        /// Registra novedades del anticipo 
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            long cpersona = long.Parse(rm.Mdatos["cpersona"].ToString());
            string cdetalletipoexp = rm.Mdatos["cdetalletipoexp"].ToString();
            string cdetallejerarquia = rm.Mdatos["cdetallejerarquia"].ToString();
            decimal total = decimal.Parse(rm.Mdatos["total"].ToString());
            decimal valorsolicitado = decimal.Parse(rm.Mdatos["valorsolicitado"].ToString());
            if(!cdetalletipoexp.Equals("ANT")) {
                return;
            }
            tpreexpediente obj = (tpreexpediente)rm.GetTabla("DATOSEXPEDIENTE").Lregistros.ElementAt(0);
            tsocnovedadades nov = new tsocnovedadades();
            nov.Esnuevo = true;
            nov.ccompania = rm.Ccompania;
            nov.cpersona = cpersona;
            nov.ccatalogonovedad = 220;
            nov.cdetallenovedad = cdetallejerarquia == "CLA" ? "20" : "19";
            nov.cusuario = rm.Cusuario;
            nov.fecha = rm.Freal;
            nov.fechaoficio = rm.Freal;
            nov.fecharecepcion = rm.Freal;
            nov.novedad = "PAGO ANTICIPO";
            decimal totalliquidacion = 0;
            if (valorsolicitado > 0)
            {
                totalliquidacion = valorsolicitado;
            }
            else {
                totalliquidacion = obj.totalliquidacion;
            }

            nov.valor = totalliquidacion;
            nov.estadovalor = "ACT";
            nov.estado = "ACT";
            nov.retencion = false;
            nov.numerooficio = "";
            nov.porcentajeretencion = 0;
            nov.automatico = true;
            nov.mensaje = rm.Mensaje;
            rm.AdicionarTabla("tsocnovedadades", nov, false);
        }
    }
}

