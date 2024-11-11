using core.componente;
using dal.prestaciones;
using System.Collections.Generic;
using util.dto.consulta;
using System;
using util;
using System.Data;
using modelo;

namespace prestaciones.liquidacion {
    /// <summary>
    /// Clase que se encarga de calcular valores para la bonificacion.
    /// </summary>
    public class Calbonificacion {
        private static decimal cons1 = 0;
        private static decimal cons2 = 0;
        private static decimal cons3 = 0;
        private static decimal cons4 = 0;
        private static decimal cons5 = 0;
        private static decimal cons6 = 0;
        private static decimal cons7 = 0;
        private static decimal cons8 = 0;
        private static decimal cons9 = 0;

        private static decimal tiempoServ = 0m;

        public decimal[] BonificacionClases(long cpersona, string cdetallejerarquia, IList<Dictionary<string, object>> taportes, DateTime fechabaja, int coeficiente, decimal cuantiabasica, bool tiempoMixto, bool actosservicio) {
            asignarValoresSegunJerarquia(1, fechabaja.Year, actosservicio);
            decimal coeficienteBoni = calcularCoeficieneBonificacion(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, tiempoMixto);
            int totalaportes = 0;
            tpreparametros param = TpreParametrosDal.Find("CAN-MINIMA-APORTES-BONIFICACION");
            totalaportes = int.Parse(taportes[0]["naportes"].ToString());
            decimal[] cesantia = new decimal[3];
            cesantia[0] = coeficienteBoni;
            cesantia[1] = totalaportes >= param.numero ? cuantiabasica * coeficienteBoni : cuantiabasica;
            cesantia[2] = totalaportes >= param.numero ? cesantia[1] - cuantiabasica : 0;
            return cesantia;
        }

        public decimal[] BonificacionOficiales(long cpersona, string cdetallejerarquia, IList<Dictionary<string, object>> taportes, DateTime fechabaja, int coeficiente, decimal cuantiabasica, bool tiempoMixto, bool actosservicio) {
            asignarValoresSegunJerarquia(2, fechabaja.Year, actosservicio);
            decimal coeficienteBoni = calcularCoeficieneBonificacion(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, tiempoMixto);
            int totalaportes = 0;
            tpreparametros param = TpreParametrosDal.Find("CAN-MINIMA-APORTES-BONIFICACION");
            totalaportes = int.Parse(taportes[0]["naportes"].ToString());
            decimal[] cesantia = new decimal[3];
            cesantia[0] = coeficienteBoni;
            cesantia[1] = totalaportes >= param.numero ? cuantiabasica * coeficienteBoni : cuantiabasica;
            cesantia[2] = totalaportes >= param.numero ? cesantia[1] - cuantiabasica : 0;
            return cesantia;
        }

        //formula = [0,1105*(TS-19)+1,1218]
        //TS = tiempo de servicio.
        decimal calculaFactorTiempoServicio(long cpersona, IList<Dictionary<string, object>> taportes, DateTime fechabaja) {
            decimal resultado = 0m;
            decimal ts = 0m;
            int[] dfechas;
            int mesesadicionales = 0;
            DateTime fultimoAporte = TpreAportesDal.GetFultimoaporte(cpersona);
            //mesesadicionales = Fecha.GetDiferenciaEntreFechasMeses(fultimoAporte, fechabaja); //CCA cambios Prestaciones
            tiempoServ = int.Parse(taportes[0]["naportes"].ToString()) + mesesadicionales;
            tpreparametros param = TpreParametrosDal.Find("CAN-MAXIMA-APORTES");
            if (tiempoServ > param.numero) {
                tiempoServ = (int)param.numero;
            }
            ts = tiempoServ / 12;
            resultado = cons1 * (ts - cons2) + cons3;
            return resultado;
        }


        //Factor Jerarquía
        //formula = [1+(20-Grado)*0,175%]
        decimal calculaFactorJerarquia(int coeficiente) {

            decimal resultado = 0m;
            int grado = coeficiente;
            resultado = cons4 + (cons5 - grado) * cons6;
            return resultado;
        }

        decimal calcularFactorTiempoMixto(long cpersona, DateTime fechabaja) {

            // decimal cons1 = 0.658m;
            IList<Dictionary<string, object>> fechas = new List<Dictionary<string, object>>();
            DateTime fechaalta = new DateTime();
            //DateTime fechabaja = new DateTime();
            decimal TSoficial = 0m;
            decimal TOTS = 0m;
            decimal resultado = 0m;
            fechas = TpreTiempoMixto.Find(cpersona);
            foreach (Dictionary<string, object> m in fechas) {
                if ((m["cdetallejerarquia"].ToString()).Equals("OFI")) {
                    fechaalta = Convert.ToDateTime(m["fechaAlta"]);
                    //fechabaja = Convert.ToDateTime(m["fechaBaja"]);
                }
            }

            TSoficial = CalcularMeses(fechaalta, fechabaja);
            TOTS = TSoficial / tiempoServ;
            resultado = TOTS + cons8 * (cons9 - TOTS);
            return resultado;
        }

        decimal calcularCoeficieneBonificacion(long cpersona, string cdetallejerarquia, IList<Dictionary<string, object>> taportes, DateTime fechabaja, int coeficiente, bool tiempoMixto) {
            decimal fts = 0m;
            decimal fj = 0m;
            decimal ftm = 0m;
            decimal RCoeficiente = 0;
            //Factor Tiempo de Servicio\
            fts = calculaFactorTiempoServicio(cpersona, taportes, fechabaja);
            //Factor jerarquia
            fj = calculaFactorJerarquia(coeficiente);

            if (cdetallejerarquia.Equals("OFI") && tiempoMixto) {   //Factor Tiempo Mixto
                ftm = calcularFactorTiempoMixto(cpersona, fechabaja);
                RCoeficiente = fts * fj * cons7 * ftm;
            } else
                RCoeficiente = fts * fj * cons7;
            return RCoeficiente;
        }

        decimal CalcularMeses(DateTime fechaalta, DateTime fechabaja) {
            int[] dfechas;
            decimal tiempoServ = 0m;
            dfechas = util.Fecha.GetDiferenciaEntreFechas(fechaalta, fechabaja);
            decimal tiempoMinimoCesantia = TpreParametrosDal.GetValorNumerico("CAN-TIEMPO-CESANTIA");

            if (dfechas[0] < tiempoMinimoCesantia) {
                throw new AtlasException("PRE-0005", "EL SOCIO CUMPLE CON LA CANTIDAD MÍNIMA DE IMPOSICIONES, SIN EMBARGO, EL TIEMPO TRANSCURRIDO ENTRE LA FECHA DE ALTA Y FECHA DE BAJA NO CUMPLE CON EL MÍNIMO REQUERIDO PARA BONIFICACIÓN");
            }
            tiempoServ = util.Fecha.GetMesesB(dfechas[0], dfechas[1], dfechas[2]);

            return tiempoServ;
        }

        public void asignarValoresSegunJerarquia(int cjerarquia, int yearbaja, bool actosservicio) {
            // int cjerarquia = 2 OFICIALES, int cjerarquia = 1 CLASES
            if (!actosservicio) {
                if (cjerarquia == 2) {
                    tpreconstantes constantes = TpreConstantesDal.Find(yearbaja, "OFI");
                    cons1 = decimal.Parse(constantes.cons1.ToString());
                    cons2 = decimal.Parse(constantes.cons2.ToString());
                    cons3 = decimal.Parse(constantes.cons3.ToString());
                    cons4 = decimal.Parse(constantes.cons4.ToString());
                    cons5 = decimal.Parse(constantes.cons5.ToString());
                    cons6 = decimal.Parse(constantes.cons6.ToString());
                    cons7 = decimal.Parse(constantes.cons7.ToString());
                    cons8 = decimal.Parse(constantes.cons8.ToString());
                    cons9 = decimal.Parse(constantes.cons9.ToString());
                } else {
                    tpreconstantes constantes = TpreConstantesDal.Find(yearbaja, "CLA");
                    cons1 = decimal.Parse(constantes.cons1.ToString());
                    cons2 = decimal.Parse(constantes.cons2.ToString());
                    cons3 = decimal.Parse(constantes.cons3.ToString());
                    cons4 = decimal.Parse(constantes.cons4.ToString());
                    cons5 = decimal.Parse(constantes.cons5.ToString());
                    cons6 = decimal.Parse(constantes.cons6.ToString());
                    cons7 = decimal.Parse(constantes.cons7.ToString());
                }
            }
        }
    }
}
