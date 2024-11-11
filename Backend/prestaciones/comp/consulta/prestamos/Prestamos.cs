using core.componente;
using System;
using System.Collections.Generic;
using util.dto.consulta;
using modelo;
using dal.cartera;
using dal.generales;
using cartera.saldo;
using cartera.datos;
using util;
using System.Linq;

namespace prestaciones.comp.consulta.prestamos {
    class Prestamos : ComponenteConsulta {

        // Variables de saldos
        static int cuotapagada = Constantes.CERO;
        static decimal montooriginal = Constantes.CERO;
        static decimal valortotal = Constantes.CERO;
        static decimal valorvencido = Constantes.CERO;
        static decimal valorpagominimo = Constantes.CERO;
        static decimal valorextraordinario = Constantes.CERO;

        /// <summary>
        /// Clase que entrega los datos de los prestamos para prestaciones
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            long cpersona = (long)rqconsulta.Mdatos["cpersona"];
            List<Dictionary<String, Object>> lresp = new List<Dictionary<String, Object>>();
            IList<tcaroperacion> objprestamos = TcarOperacionDal.FindPorPersona(cpersona, true);

            foreach (tcaroperacion obj in objprestamos) {
                Dictionary<String, Object> m = new Dictionary<String, Object>();
                tgenproducto producto = TgenProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto);
                tgentipoproducto tipoproducto = TgenTipoProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tcarestatus estatus = TcarEstatusDal.Find(obj.cestatus);
                rqconsulta.Coperacion = obj.coperacion;
                montooriginal = (decimal)obj.montooriginal;
                valortotal = Saldo(rqconsulta);
                decimal porcentajepagado = decimal.Round(decimal.Divide((cuotapagada * Constantes.CIEN), (int)obj.numerocuotas), 2);
                m["fapertura"] = Fecha.GetFechaPresentacion(obj.fapertura ?? 0);
                m["coperacion"] = obj.coperacion;
                m["operacion"] = producto.nombre;
                m["tipo"] = tipoproducto.nombre;
                m["monto"] = obj.montooriginal;
                m["estatus"] = estatus.nombre;
                m["cestatus"] = estatus.cestatus;
                m["valorvencido"] = valorvencido;
                m["saldo"] = valortotal;
                m["porcentaje"] = porcentajepagado;
                m["pagototal"] = ValidaPago((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto, porcentajepagado);
                m["valorpagominimo"] = valorpagominimo;
                m["valorextraordinario"] = valorextraordinario + valorvencido;
                lresp.Add(m);
            }
            // Fija la respuesta en el response.
            rqconsulta.Response["PRESTAMOS"] = lresp;
        }

        public static decimal Saldo(RqConsulta rqconsulta)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqconsulta);
            int fcobro = (int)rqconsulta.Fconatable;
            Saldo saldo = new Saldo(operacion, fcobro);
            valorvencido = saldo.Totalpendientepago;
            valorpagominimo = valorvencido;
            cuotapagada = saldo.Operacion.Lcuotas.FirstOrDefault().numcuota - Constantes.UNO;
            saldo.Calculacuotaencurso();
            Decimal saldofuturo = saldo.GetSaldoCuotasfuturas();

            decimal totaldeuda = saldo.Totalpendientepago;
            if (saldo.Cxp > 0) {
                totaldeuda = totaldeuda - saldo.Cxp;
            }
            totaldeuda = totaldeuda + saldofuturo;
            if (totaldeuda < 0) {
                totaldeuda = 0;
            }

            // Valida tipo de pago
            tcarproducto producto = TcarProductoDal.Find((int)operacion.Tcaroperacion.cmodulo, (int)operacion.Tcaroperacion.cproducto, (int)operacion.Tcaroperacion.ctipoproducto);
            producto.mincuotaspagoextraordinario = producto.mincuotaspagoextraordinario ?? Constantes.CERO;
            valorextraordinario = saldo.GetSaldoCapitalPorVencer((int)producto.mincuotaspagoextraordinario);
            return totaldeuda;
        }

        private static bool ValidaPago(int cmodulo, int cproducto, int ctipoproducto, decimal porcentajepagado)
        {
            tcarprelacionproducto pp = TcarPrelacionProductoDal.Find(cmodulo, cproducto, ctipoproducto);
            if (pp != null) {
                if (pp.porcentajepagado >= porcentajepagado) {
                    if (pp.porcentajepago == Constantes.CIEN) {
                        valorpagominimo = valortotal;
                        return true;
                    } else {
                        valorpagominimo = decimal.Round(decimal.Add(valorvencido, decimal.Divide(decimal.Multiply(montooriginal, pp.porcentajepago ?? Constantes.UNO), Constantes.CIEN)), 2);
                        if (valorpagominimo >= valortotal) {
                            valorpagominimo = valortotal;
                            return true;
                        }
                        return false;
                    }
                } else {
                    return false;
                }
            }
            return false;
        }
    }
}
