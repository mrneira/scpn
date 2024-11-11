using core.componente;
using dal.generales;
using dal.persona;
using dal.prestaciones;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;

namespace prestaciones.comp.consulta.expediente {
    class Validaciones :ComponenteConsulta {
        /// <summary>
        /// Clae que valida las bajas de un socio al realizar el expediente
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            long cpersona = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            List<tpreexpediente> lexpediente = TpreExpedienteDal.FindToList(cpersona, rqconsulta.Ccompania);
            if(lexpediente.Count > 0) {
                foreach(tpreexpediente obj in lexpediente) {
                    if(!obj.cdetalleestado.Equals("CAN") && !obj.cdetalleestado.Equals("NEG")) {
                        tperpersonadetalle detalle = TperPersonaDetalleDal.Find(obj.cpersona, (int)obj.ccompania);
                        tgencatalogodetalle catdetalle = TgenCatalogoDetalleDal.Find((int)obj.ccatalogoestado, obj.cdetalleestado);
                        throw new AtlasException("PRE-008", "NO SE PUEDE SIMULAR, USUARIO CON CÉDULA: {0} TIENE UN EXPEDIENTE EN ESTADO: {1}", detalle.identificacion, catdetalle.nombre);
                    }
                }
            }
        }
    }
}
