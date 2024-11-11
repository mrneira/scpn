using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.prestaciones;
using modelo;
using modelo.interfaces;
using Newtonsoft.Json;
using prestaciones.dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.aportes
{
    class AportesConsolidado : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {

            if (rm.GetTabla("APORTES") == null || rm.GetTabla("APORTES").Lregistros.Count() <= 0)
            {
                return;
            }

            List<tpreaporte> ldatos = rm.GetTabla("APORTES").Lregistros.Cast<tpreaporte>().ToList();
            decimal totalAporteIndividual = 0;
            decimal totalAportePatronal = 0;
            long cpersona = 0;
            decimal porcentajepatronal = TpreParametrosDal.GetValorNumerico("POR-APORTE-PATRONO");
            decimal porcentajepersonal = TpreParametrosDal.GetValorNumerico("POR-APORTE-PERSONAL");
            IList<Saldo> itm = new List<Saldo>();
            foreach (tpreaporte o in ldatos)
            {
                tpreaporte obj = o;

                tpreaporte aporteactual = null;
                
                if (obj.caporte == 0)
                {
                aporteactual = TpreAportesDal.FindPorCpersonaFaporte(obj.cpersona, obj.fechaaporte);

                }
                

                List<tpreaporte> ap = ldatos.Where(x => x.cpersona == obj.cpersona && x.fechaaporte == obj.fechaaporte).ToList();

                if (aporteactual!=null || ap.Count > 2)
                {
                    throw new AtlasException("PRE-016", "ESTA INSERTANDO REGISTRANDO APORTES DUPLICADOS");
                }

                if (obj.caporte == 0)
                {
                    long caporte = Secuencia.GetProximovalor("APORTES");
                    obj.caporte = caporte;
                }
                else {
                    obj.Esnuevo = false;
                    obj.Actualizar = true;
                }



                totalAporteIndividual = totalAporteIndividual + (obj.Esnuevo == true ? Math.Round((decimal)(obj.aportepersonal + obj.ajuste), 2, MidpointRounding.AwayFromZero) : Math.Round((decimal)obj.ajuste, 2, MidpointRounding.AwayFromZero));
                totalAportePatronal = totalAportePatronal + (obj.Esnuevo == true ? Math.Round((decimal)(obj.aportepatronal + obj.ajustepatronal), 2, MidpointRounding.AwayFromZero) : Math.Round((decimal)obj.ajustepatronal, 2, MidpointRounding.AwayFromZero));
                cpersona = obj.cpersona;
            }

            Saldo apind = new Saldo();
            apind.ingreso = true;
            apind.saldo = "APPER";
            apind.valor = totalAporteIndividual;
            itm.Add(apind);

            Saldo apat = new Saldo();
            apat.ingreso = true;
            apat.saldo = "APPAT";
            apat.valor = totalAportePatronal;
            itm.Add(apat);
            Saldo total = new Saldo();
            total.ingreso = false;
            total.saldo = "CUEREC";
            total.valor = totalAportePatronal + totalAporteIndividual;
            itm.Add(total);

            var json = JsonConvert.SerializeObject(itm);
            rm.Mdatos.Add("Saldos", json);

            tpreparametros param;
            if (rm.Ctransaccion == 52)
            {
                param = TpreParametrosDal.Find("PLANTILLA-APORTES-MESES-ANTERIOR");
            }
            else {
                param = TpreParametrosDal.Find("PLANTILLA-APORTES");
            }
            if (rm.Ctransaccion == 50)
            {
                param = TpreParametrosDal.Find("PLANTILLA-APORTE-CONSOLIDADO"); // CCA prestaciones 20210325
            }
            rm.AddDatos("cpersona", cpersona);
            rm.Mdatos.Add("cconcepto", 3);
            rm.Mdatos.Add("cplantilla", (int)param.numero);
            rm.Mdatos.Add("tipodocumento", param.texto);
            rm.Mdatos.Add("generarcomprobante", true);
            rm.Mdatos.Add("actualizarsaldosenlinea", true);
            rm.Mdatos.Add("mayorizaraporte", true);
            rm.Mtablas["APORTES"] = null;
            
            RqMantenimiento rq = (RqMantenimiento)rm.Clone();
            rq.EncerarRubros();
            Mantenimiento.ProcesarAnidado(rq, 28, 51);
           
                if (rq.Mdatos.ContainsKey("ccomprobante"))
            {
                long ccomprobante = long.Parse(rq.GetString("ccomprobante"));
                
                foreach (tpreaporte tp in ldatos)
                {
                    tp.comprobantecontable = ccomprobante;
                }

            }
            tconcomprobante ldatosprov = (tconcomprobante)rm.GetTabla("TCONCOMPROBANTE").Registro;
            ldatosprov.cuadrado = true;

            rm.AdicionarTabla("APORTESN", ldatos, false);
            
           



        }
    }
}
