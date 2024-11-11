using core.componente;
using core.servicios;
using dal.talentohumano;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace talentohumano.comp.mantenimiento.solicitud
{
    public class AjusteManualVacaciones : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            var vacacion = JsonConvert.DeserializeObject<tnomsaldovacaciones>(rqmantenimiento.Mdatos["ajuste"].ToString());
            tthcontratodetalle cd = new tthcontratodetalle();


            tthfuncionariodetalle fun = TthFuncionarioDal.FindFuncionario(vacacion.cfuncionario.Value);

            cd = TthContratoDal.FindContratoFuncionario(vacacion.cfuncionario.Value);
            if (cd == null)
            {
                throw new AtlasException("TTH-024", "EL CONTRATO NO SE HA ENCONTRADO O YA SE HA INGRESADO LA FECHA DE DESVINCULACIÓN");

            }
            vacacion.fechageneracion = rqmantenimiento.Freal;
            vacacion.mesccatalogo = 4;
            vacacion.mescdetalle = completarMes((rqmantenimiento.Freal.Month));
            decimal vtotal = vacacion.dias.Value * (cd.remuneracion.Value / 30);
            vtotal = decimal.Round(vtotal, 2, MidpointRounding.AwayFromZero);
            vacacion.valor = vtotal;
            long cvacacion = Secuencia.GetProximovalor("SVACACION");
            vacacion.csaldovacaciones = cvacacion;
            rqmantenimiento.AdicionarTabla("TNOMSALDOVACACION", vacacion, false);
            rqmantenimiento.Response["VALIDADO"] = true;

        }
        private string completarMes(decimal mesg)
        {
            string mesgenerado = "";
            if (mesg < 10)
            {
                mesgenerado = "0";
            }
            return mesgenerado + mesg.ToString();
        }
    }

}
