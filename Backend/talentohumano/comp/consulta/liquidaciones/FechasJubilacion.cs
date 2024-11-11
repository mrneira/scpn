using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;

namespace talentohumano.comp.consulta.liquidaciones
{
    public class FechasJubilacion : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            int inicio = int.Parse(rqconsulta.Mdatos["finicio"].ToString());
            int fin = int.Parse(rqconsulta.Mdatos["ffin"].ToString());
            DateTime finicio, ffin;
            finicio = new DateTime();
            ffin = new DateTime();
            try
            {
                finicio = Fecha.ToDate(inicio);
                 ffin = Fecha.ToDate(fin);
            }
            catch (Exception x) {
                rqconsulta.Response["total"] = 0;
            }
            
            int anios = (finicio.Year - ffin.Year);
            bool diacero = false;
            if (ffin.Day == 31) {
                ffin = new DateTime(ffin.Year, ffin.Month, 30);
                    
            }
            
            int[] calculo = Fecha.GetDiferenciaEntreFechas(finicio, ffin);
            if (ffin.Month == 2 || calculo[2] >= 30) {
                if (calculo[2] >= 28 && ffin.Month == 2) {
                    calculo[1] = calculo[1] + 1;
                    calculo[2] = 0;
                    diacero = true;
                }
                if (calculo[2] >= 30) {
                    calculo[2] = 0;
                    calculo[1] = calculo[1] + 1;
                }
                
            }
            if (calculo[2] < 30 && calculo[2]>0) {
                calculo[2] = calculo[2] + 1;
            }
            
            

            decimal tiempo = (calculo[0]) + ((decimal)calculo[1] / 12) + (((decimal)calculo[2]) / 360);
            tiempo = decimal.Round(tiempo, 7, MidpointRounding.AwayFromZero);
            rqconsulta.Response["total"] = tiempo;
        }
    }
}
