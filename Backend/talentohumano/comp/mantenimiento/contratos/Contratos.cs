using core.componente;
using core.servicios;
using dal.generales;
using dal.persona;
using dal.seguridades;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using System.Text.RegularExpressions;
using dal.contabilidad;

namespace talentohumano.comp.mantenimiento.contratos
{
    /// <summary>
    /// Metodo que se encarga de completar informacion faltante de proveedores.
    /// </summary>
    /// <author>amerchan</author>
    public class Contratos : ComponenteMantenimiento
    {
        /// <summary>
        /// Actualiza informacion de proveedores.
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm) {

            tthcontratodetalle tthcontratodetalle;
            if (rm.GetTabla("CONTRATOS") != null)
            {
                tthcontratodetalle = (tthcontratodetalle)rm.GetTabla("CONTRATOS").Lregistros.ElementAt(0);

                long ccontrato = tthcontratodetalle.ccontrato;
                if (tthcontratodetalle.ccontrato == 0)
                {
                    ccontrato = Secuencia.GetProximovalor("TTH_FUNC");
                    crearCabecera(rm, ccontrato, tthcontratodetalle.cfuncionario);
                }
                
                tthcontratodetalle.ccontrato = ccontrato;
                
                rm.Mdatos["ccontrato"] = ccontrato;
                rm.Response["ccontrato"] = ccontrato;
            }
        }

        private tthcontrato crearCabecera(RqMantenimiento rm, long ccontrato, long cfuncionario)
        {
            tthcontrato tthcontrato = new tthcontrato();
            tthcontrato.ccontrato = ccontrato;
            tthcontrato.cfuncionario = cfuncionario;
            rm.AdicionarTabla("tthcontrato", tthcontrato, true);
            return tthcontrato;
        }
    }
}
