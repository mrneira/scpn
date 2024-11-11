using dal.cartera;
using dal.generales;
using dal.prestaciones;
using dal.socio;
using modelo;
using prestaciones.comp.consulta.bonificacion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;
using prestaciones.comp.consulta.prestamos;
using System.Data;
using cartera.datos;
using cartera.saldo;

namespace prestaciones.comp.consulta.expediente {
    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar los datos generales con respecto a las prestaciones que tiene un socio. 
    /// Datos Generales entrega en una List<Dictionary<String, Object>>
    /// </summary>
    class DatosGenerales {
        Bonificacion bonif = new Bonificacion();
        decimal aportes = 0, valorinteres = 0;
        static int cuotapagada = Constantes.CERO;
        static decimal montooriginal = Constantes.CERO;
        static decimal valorvencido = Constantes.CERO;
        static decimal valorpagominimo = Constantes.CERO;
        static decimal valorextraordinario = Constantes.CERO;
        /// <summary>
        /// Método que entrega el valor de los ingresos del socio.
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="cdetalletipoexp"></param>
        /// <param name="cdetallejerarquia"></param>
        /// <param name="fechabaja"></param>
        /// <param name="coeficiente"></param>
        /// <param name="taportes"></param>
        /// <returns>Valoringresos</returns>
        public decimal Valoringresos(long cpersona, string cdetalletipoexp, string cdetallejerarquia, DateTime fechabaja, int coeficiente, IList<Dictionary<string, object>> taportes, bool actosservicio) {
            decimal totalingresos = 0;
            aportes = Aportes(cdetalletipoexp, taportes);
            valorinteres = Interes(cdetalletipoexp, taportes);
            decimal valores = 0;
            if (!cdetalletipoexp.Equals("DEV") && !cdetalletipoexp.Equals("DEH")) {
                valores = decimal.Parse(bonif.Ejecutar(cpersona, cdetallejerarquia, taportes, fechabaja, coeficiente, actosservicio)[0].ToString());
            }
            return totalingresos = valorinteres + aportes + valores;
        }

        public decimal Aportes(string cdetalletipoexp, IList<Dictionary<string, object>> taportes) {
            decimal aportes = 0;
            if (cdetalletipoexp.Equals("DEV") || cdetalletipoexp.Equals("DEH")) {
                aportes = decimal.Parse(taportes[0]["TAPORTE"].ToString());
            }
            return aportes;
        }

        public decimal ValorAportes(string cdetalletipoexp, IList<Dictionary<string, object>> taportes) {
            decimal aportes = 0;
            aportes = decimal.Parse(taportes[0]["TAPORTE"].ToString());
            return aportes;
        }

        public decimal Interes(string cdetalletipoexp, IList<Dictionary<string, object>> taportes) {
            decimal valorinteres = 0;
            if (cdetalletipoexp.Equals("DEV") || cdetalletipoexp.Equals("DEH")) {

                valorinteres = decimal.Parse(taportes[0]["interes"].ToString());

            }
            return decimal.Round(valorinteres, 2);
        }

        public int TotalAportes(IList<Dictionary<string, object>> taportes) {
            tpreparametros param = TpreParametrosDal.Find("CAN-MAXIMA-APORTES");
            if (int.Parse(taportes[0]["naportes"].ToString()) > param.numero) {
                return (int)param.numero;
            } else {
                return int.Parse(taportes[0]["naportes"].ToString());
            }
        }
        public decimal Valoregresos(long cpersona, int ccompania, string cdetalletipoexp, string selectedValues, decimal totalingresos, IList<Dictionary<string, object>> taportes,RqConsulta rqconsulta) {
            decimal totaldeuda = 0, tprestamos = 0, tretenciones = 0, tnovedades = 0, daportes = 0;
            int pnovedades = -1, pretenciones = -1, pprestamos = -1;
            if (!String.IsNullOrEmpty(selectedValues)) {
                pnovedades = selectedValues.IndexOf("pagonovedades");
                pretenciones = selectedValues.IndexOf("pagoretenciones");
                pprestamos = selectedValues.IndexOf("pagoprestamos");
            }

            tprestamos = ValorDeudaPrestamos(cpersona, rqconsulta);
            tretenciones = ValorDeudaRetenciones(cpersona, ccompania, totalingresos);
            tnovedades = ValorDeudaNovedades(cpersona, ccompania);
            daportes = (decimal)ValorDeudaAportes(cdetalletipoexp, taportes);
            totaldeuda = daportes;

            if (pnovedades >= 0) {
                totaldeuda = totaldeuda + tnovedades;
            }
            if (pretenciones >= 0) {
                totaldeuda = totaldeuda + tretenciones;
            }
            if (pprestamos >= 0) {
                totaldeuda = totaldeuda + tprestamos;
            }
            return totaldeuda;
        }

        public decimal Valoregresos(long cpersona, int ccompania, string cdetalletipoexp, decimal totalingresos, IList<Dictionary<string, object>> taportes) {
            decimal totaldeuda = 0, tprestamos = 0, tretenciones = 0, tnovedades = 0, daportes = 0;
            tretenciones = ValorDeudaRetenciones(cpersona, ccompania, totalingresos);
            tnovedades = ValorDeudaNovedades(cpersona, ccompania);
            daportes = (decimal)ValorDeudaAportes(cdetalletipoexp, taportes);
            if (cdetalletipoexp.Equals("DEV") || cdetalletipoexp.Equals("DEH")) {
                totaldeuda = daportes;
            }

            if (!cdetalletipoexp.Equals("ANT")) {
                totaldeuda = totaldeuda + tnovedades;
                totaldeuda = totaldeuda + tretenciones;
                totaldeuda = totaldeuda + tprestamos;
            }
            return totaldeuda;
        }
        public decimal ValorDeudaPrestamos(long cpersona,RqConsulta rqconsulta) {
          // RqConsulta rqconsulta = new RqConsulta();
            IList<tcaroperacion> objprestamos = TcarOperacionDal.FindPorPersona(cpersona, true);
            decimal tprestamos = 0;
            foreach (tcaroperacion obj in objprestamos) {
                tgenproducto producto = TgenProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto);
                tcarproducto carproducto = TcarProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tgentipoproducto tipoproducto = TgenTipoProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tcarestatus estatus = TcarEstatusDal.Find(obj.cestatus);
                rqconsulta.Coperacion = obj.coperacion;
                montooriginal = (decimal)obj.montooriginal;
                tprestamos = tprestamos + Saldo(rqconsulta);
            }
            return tprestamos;
        }

        public static decimal Saldo(RqConsulta rqconsulta) {
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

        public decimal ValorDeudaRetenciones(long cpersona, int ccompania, decimal totalingresos) {
            decimal tretenciones = 0, porcentajeretencion = 0;
            IList<tsocnovedadades> ldataretenciones = TsocNovedadesDal.FindToRetenciones(cpersona, ccompania);
            foreach (tsocnovedadades obj in ldataretenciones) {
                Dictionary<String, Object> m = new Dictionary<String, Object>();
                if (!obj.estado.Equals("ACT")) {
                    continue;
                }
                if (obj.porcentajeretencion == null) {
                    obj.porcentajeretencion = decimal.Zero;
                }
                porcentajeretencion = porcentajeretencion + (decimal)obj.porcentajeretencion;
            }
            tretenciones = (porcentajeretencion * Math.Round(totalingresos, 2, MidpointRounding.AwayFromZero)) / 100; ;
            return decimal.Round(tretenciones, 2);
            //return tretenciones;
        }

        public decimal ValorDeudaNovedades(long cpersona, int ccompania) {
            IList<tsocnovedadades> ldataretenciones = TsocNovedadesDal.FindToNovedades(cpersona, ccompania);
            decimal tnovedades = 0;
            foreach (tsocnovedadades obj in ldataretenciones) {
                Dictionary<String, Object> m = new Dictionary<String, Object>();
                if (!obj.estado.Equals("ACT")) {
                    continue;
                }
                if (obj.valor == null) {
                    obj.valor = decimal.Zero;
                }
                tnovedades = tnovedades + (decimal)obj.valor;
            }
            return decimal.Round(tnovedades, 2);
        }

        public decimal? ValorDeudaAportes(string cdetalletipoexp, IList<Dictionary<string, object>> taportes) {
            decimal? total2002 = 0;
            if (cdetalletipoexp.Equals("DEV") || cdetalletipoexp.Equals("DEH")) {
                total2002 = TpreAportesDal.GetTotalAportes2002(taportes);
                total2002 = (total2002 * 20) / 100;
            }
            return Math.Round((decimal)total2002, 2, MidpointRounding.AwayFromZero); 
        }

        public bool Devolucion(long cpersona) {
            IList<Dictionary<string, object>> taportes = new List<Dictionary<string, object>>();
            tpreparametros param = TpreParametrosDal.Find("CAN-MINIMA-APORTES");
            decimal? naportesm = param.numero, naportes = 0;
            bool devolucion = false;
            taportes = TpreAportesDal.GetTotalAportes(cpersona);
            naportes = decimal.Parse(taportes[0]["naportes"].ToString());
            if (naportes < naportesm) {
                devolucion = true;
            } else {
                throw new AtlasException("PRE-007", "NO TIENE DERECHO DEVOLUCIÓN DE APORTES");
            }
            return devolucion;
        }
    }
}
