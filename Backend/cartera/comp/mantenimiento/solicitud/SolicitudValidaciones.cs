using cartera.datos;
using cartera.saldo;
using core.componente;
using dal.cartera;
using modelo;
using socio.datos;
using System.Collections.Generic;
using System.Linq;
using util.dto;
using util.dto.mantenimiento;
using util;
using util.dto.consulta;
using System;
using System.Reflection;
using System.Runtime.Remoting;
using dal.generales;
using Newtonsoft.Json;

namespace cartera.comp.mantenimiento.solicitud
{

    /// <summary>
    /// Clase que se encarga de validar condiciones propias de un tipo de producto específico 
    /// </summary>
    public class SolicitudValidaciones : ComponenteMantenimiento
    {
        static int cuotapagada = Constantes.CERO;
        static decimal montooriginal = Constantes.CERO;
        static decimal valorvencido = Constantes.CERO;
        static decimal valorpagominimo = Constantes.CERO;
        static decimal valorextraordinario = Constantes.CERO;
        List<Dictionary<string, object>> resumen = new List<Dictionary<string, object>>();

        /// <summary>
        /// Validaciones de préstamos al realizar una solicitud
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (!rqmantenimiento.Mdatos.ContainsKey("validacionplazofijo"))
            {
                return;
            }
            if ((bool)rqmantenimiento.Mdatos["validacionplazofijo"])
            {

                bool enviarmonto = false;
                Solicitud existesolicitud = SolicitudFachada.GetSolicitud();
                //Socios socio = new Socios(existesolicitud.Tcarsolicitud.cpersona.Value, rqmantenimiento);
                //long cpersona = long.Parse(existesolicitud.Tcarsolicitud.cpersona.ToString());
                // Consulta Datos del socio
                long cpersona = long.Parse(rqmantenimiento.Mdatos["cpersona"].ToString());
                string componente = "prestaciones.comp.consulta.socio.DatosSocio";
                RqConsulta r = new RqConsulta();
                r = Copiar(rqmantenimiento);
                r.Response = rqmantenimiento.Response;
                r.Mdatos.Remove("cpersona");
                r.Mdatos.Add("cpersona", cpersona);
                r.Mdatos.Remove("componente");
                r.Mdatos.Add("componente", componente);
                r = procesarconsulta(r);
                // Simulación de Cesantía 
                string componente2 = "prestaciones.comp.consulta.expediente.Simulacion";
                RqConsulta rsimulacion = new RqConsulta();
                rsimulacion = Copiar(rqmantenimiento);
                rsimulacion.Response = rqmantenimiento.Response;
                rsimulacion.Mdatos.Remove("componente");
                rsimulacion.Mdatos.Add("componente", componente2);
                DateTime falta;
                DateTime.TryParse(r.Response["p_falta"].ToString(), out falta);
                decimal coeficiente;
                decimal.TryParse(r.Response["p_coeficiente"].ToString(), out coeficiente);
                rsimulacion.Mdatos.Add("fechaalta", falta);
                rsimulacion.Mdatos.Add("fechabaja", DateTime.Now);
                rsimulacion.Mdatos.Add("coeficiente", (int)coeficiente);
                rsimulacion.Mdatos.Add("cdetallejerarquia", r.Response["p_cdetallejerarquia"].ToString());
                rsimulacion.Mdatos.Add("selectedValues", "pagoretenciones, pagonovedades");
                rsimulacion = procesarconsulta(rsimulacion);

                decimal totalCesantia = 0;
                decimal.TryParse(r.Response["p_total"].ToString(), out totalCesantia);

                decimal saldoQuirografario = 0;
                decimal saldoQuirografarioHipotecario = 0;

                decimal saldoPrendario = 0;
                decimal saldoHipotecario = 0;
                decimal montoPrestamoHipotecario = 0;
                decimal vcpf = 0;
                int tiempoHipotecario = 0;
                int tiempoHipotecariotrasn = 0;
                int tiempoQuirografarioHipotecario = 0;
                int tiempoQuirografarioHipotecariotrasn = 0;


                saldoQuirografario = Math.Round(ValorXPrestamoAdeudado(cpersona, rsimulacion, 1), 2, MidpointRounding.AwayFromZero);
                saldoQuirografarioHipotecario = Math.Round(ValorXPrestamoAdeudadoHipotecario(cpersona, rsimulacion, 1), 2, MidpointRounding.AwayFromZero);
                saldoQuirografario = saldoQuirografario - saldoQuirografarioHipotecario;
                
                saldoPrendario = Math.Round(ValorXPrestamoAdeudado(cpersona, rsimulacion, 2), 2, MidpointRounding.AwayFromZero);
                saldoHipotecario = Math.Round(ValorXPrestamoAdeudado(cpersona, rsimulacion, 3), 2, MidpointRounding.AwayFromZero);
                saldoHipotecario = saldoHipotecario + saldoQuirografarioHipotecario;
                montoPrestamoHipotecario = Math.Round(ValorXPrestamoMonto(cpersona, rsimulacion, 3), 2, MidpointRounding.AwayFromZero);
                tiempoHipotecario = TiempoXPrestamo(cpersona, rsimulacion, 3);
                tiempoQuirografarioHipotecario = TiempoXPrestamoGarantia(cpersona, rsimulacion, 1);
                tiempoHipotecario = tiempoHipotecario + tiempoQuirografarioHipotecario;
                tiempoHipotecariotrasn = TiempoTranscurridoXPrestamo(cpersona, rsimulacion, 3);
                tiempoQuirografarioHipotecariotrasn= TiempoTranscurridoXPrestamoGarantia(cpersona, rsimulacion, 1);
                tiempoHipotecariotrasn = tiempoHipotecariotrasn + tiempoQuirografarioHipotecariotrasn;




                vcpf = Math.Round(totalCesantia, 2);// - (montoPrestamoHipotecario / 2);
                decimal validacion = totalCesantia - (saldoQuirografario + saldoPrendario);
                decimal montodefault = 0;
                decimal montoproducto = 0;

                tcarproducto tp = null;
                if (rqmantenimiento.Response.ContainsKey("monto_previo"))
                {

                    tp = TcarProductoDal.Find(7, 1, 21);

                    montodefault = tp.montomaximo.Value;
                    
                }
                if (totalCesantia <= 0)
                {
                    // throw new AtlasException("CAR-001", "EL SOCIO NO TIENE CESANTIA", , componete);
                }

                string mensajeserror = "";
                int totalaportes = 0;
                int.TryParse(r.Response["p_totalaportes"].ToString(), out totalaportes);
                if (totalaportes < 240)
                {
                    mensajeserror = "EL SOCIO NO CUMPLE CON EL NÚMERO MÍNIMO DE APORTACIONES, TOTAL NÚMERO DE APORTES " + totalaportes;
                }
                else
                {

                    if (validacion >= montodefault)
                    {

                        montoproducto = montodefault;
                        if (saldoHipotecario > 0)
                        {
                            string mensajeValidacion = ValidarPrestamosHTiempo(tiempoHipotecario, tiempoHipotecariotrasn, rqmantenimiento.Ccompania);
                            if (!string.IsNullOrEmpty(mensajeValidacion))
                            {
                                Dictionary<string, object> parametros = new Dictionary<string, object>();
                                parametros["descripcion"] = mensajeValidacion;
                                parametros["estado"] = false;
                                resumen.Add(parametros);
                                string mensajeValidacionCesantia = ValidarCesantiaPrestamosH(totalCesantia, saldoHipotecario, montoPrestamoHipotecario, rqmantenimiento.Ccompania, montodefault);
                                if (!string.IsNullOrEmpty(mensajeValidacionCesantia))
                                {
                                    Dictionary<string, object> parametrosC = new Dictionary<string, object>();
                                    parametrosC["descripcion"] = mensajeValidacion;
                                    parametrosC["estado"] = false;
                                    resumen.Add(parametrosC);
                                    decimal porcentaje = TcarParametrosDal.GetValorNumerico("PORCENTAJE_MONTO_PAGADO_H", rqmantenimiento.Ccompania);
                                    porcentaje = porcentaje / 100;
                                    decimal descuento = (porcentaje * montoPrestamoHipotecario);

                                    descuento = decimal.Round(descuento, 2, MidpointRounding.AwayFromZero);
                                    totalCesantia = totalCesantia - descuento;
                                    //string mensajevcpf = ValidarMontoPrestamoConCalculado(vcpf, existesolicitud.Tcarsolicitud.monto.Value);
                                    montoproducto = totalCesantia;
                                }
                                else
                                {
                                    if ((saldoPrendario + saldoQuirografario) > 0)
                                    {

                                        decimal porcentaje = TcarParametrosDal.GetValorNumerico("PORCENTAJE_MONTO_PAGADO_H", rqmantenimiento.Ccompania);
                                        porcentaje = porcentaje / 100;
                                        decimal descuento = (porcentaje * montoPrestamoHipotecario);

                                        descuento = decimal.Round(descuento, 2, MidpointRounding.AwayFromZero);
                                        totalCesantia = totalCesantia - descuento;
                                        montoproducto = totalCesantia - (saldoPrendario + saldoQuirografario);
                                    }
                                    else
                                    {
                                        montoproducto = montodefault;
                                    }

                                }
                            }
                            else
                            {
                                montoproducto = montodefault;
                            }

                        }
                        else
                        {

                            montoproducto = montodefault;
                        }

                    }
                    else
                    {

                        montoproducto = 0;
                        string ESPACIO = (mensajeserror.Length > 0) ? "," : "";
                        mensajeserror = mensajeserror + ESPACIO + "CESANTIA " + totalCesantia.ToString("C") + " ,SUMA DE PRESTAMOS QUIROGRAFARIOS " + saldoQuirografario.ToString("C") + " Y PRÉSTAMOS PRENDARIOS " + saldoPrendario.ToString("C") + " SUPERA LA BASE";

                    }
                }
                if (mensajeserror.Length > 0)
                    rqmantenimiento.Response["MONTONOVALIDO"] = mensajeserror;

                rqmantenimiento.Response["montovalidado"] = montoproducto;





                rqmantenimiento.Response["ESPECIALVALIDACIONES"] = resumen;
                Dictionary<string, object> parametrosTC = new Dictionary<string, object>();
                parametrosTC["descripcion"] = "Monto Cesantía $ " + vcpf;
                parametrosTC["estado"] = true;
                resumen.Add(parametrosTC);
                rqmantenimiento.Response["vcpf"] = vcpf;
            }

        }
        private RqConsulta procesarconsulta(RqConsulta rqconsulta)
        {

            string componete = "";

            ComponenteConsulta c = null;
            try
            {
                componete = rqconsulta.Mdatos["componente"].ToString();
                string assembly = componete.Substring(0, componete.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componete);
                object comp = handle.Unwrap();
                c = (ComponenteConsulta)comp;

            }
            catch (TypeLoadException e)
            {
                throw new AtlasException("GEN-001", "CLASE {0} A EJECUTAR NO EXISTE  MODULO: {1} TRANS: {2} ", e, componete,
                                 rqconsulta.Cmodulo, rqconsulta.Ctransaccion);
            }
            catch (InvalidCastException e)
            {
                throw new AtlasException("GEN-002", "PROCESO {0} A EJECUTAR MODULE: {1} TRANS: {2}  NO IMPLEMENTA {4}", e, componete,
                                 rqconsulta.Cmodulo, rqconsulta.Ctransaccion, c.GetType().FullName);
            }
            c.Ejecutar(rqconsulta);
            return rqconsulta;
        }
        private static RqConsulta Copiar(RqMantenimiento rqMantenimiento)
        {
            RqConsulta rq = new RqConsulta();
            Type tipo = rq.GetType();
            IEnumerable<FieldInfo> lcampos = tipo.GetTypeInfo().DeclaredFields;

            RequestBase rb = new RequestBase();
            Type tiporb = rb.GetType();
            IEnumerable<FieldInfo> lcamposrb = tiporb.GetTypeInfo().DeclaredFields;
            foreach (FieldInfo f in lcamposrb)
            {
                Object valor = f.GetValue(rqMantenimiento);
                f.SetValue(rq, valor);
            }
            rq.Mdatos = rqMantenimiento.Mdatos;

            return rq;
        }

        private decimal ValorXPrestamoMonto(long cpersona, RqConsulta rqconsulta, int cproducto)
        {
            IList<tcaroperacion> objprestamos = TcarOperacionDal.FindPrestamoPersonaEstado(cpersona, true, cproducto);
            decimal montoPrestamo = 0;
            foreach (tcaroperacion obj in objprestamos)
            {
                tgenproducto producto = TgenProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto);
                tcarproducto carproducto = TcarProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tgentipoproducto tipoproducto = TgenTipoProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tcarestatus estatus = TcarEstatusDal.Find(obj.cestatus);
                rqconsulta.Coperacion = obj.coperacion;
                montoPrestamo = (decimal)obj.montooriginal;
            }
            return montoPrestamo;
        }

        private int TiempoXPrestamo(long cpersona, RqConsulta rqconsulta, int cproducto)
        {
            IList<tcaroperacion> objprestamos = TcarOperacionDal.FindPrestamoPersonaVigentes(cpersona, true, cproducto);
            int tiempoPrestamo = 0;

            foreach (tcaroperacion obj in objprestamos)
            {
                tgenproducto producto = TgenProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto);
                tcarproducto carproducto = TcarProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tgentipoproducto tipoproducto = TgenTipoProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tcarestatus estatus = TcarEstatusDal.Find(obj.cestatus);
                rqconsulta.Coperacion = obj.coperacion;
                tiempoPrestamo = tiempoPrestamo + (int)obj.plazo;

            }
            return tiempoPrestamo;
        }
        private int TiempoXPrestamoGarantia(long cpersona, RqConsulta rqconsulta, int cproducto)
        {
            IList<tcaroperacion> objprestamos = TcarOperacionDal.FindPrestamoPersonaVigentes(cpersona, true, cproducto);
            int tiempoPrestamo = 0;

            foreach (tcaroperacion obj in objprestamos)
            {
                tgenproducto producto = TgenProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto);
                tcarproducto carproducto = TcarProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tgentipoproducto tipoproducto = TgenTipoProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tcarestatus estatus = TcarEstatusDal.Find(obj.cestatus);
                rqconsulta.Coperacion = obj.coperacion;
                if (carproducto.exigegarantia != null && carproducto.exigegarantia == true)
                {                   
                    tiempoPrestamo = tiempoPrestamo + (int)obj.plazo;
                }
                else
                {
                    tiempoPrestamo = tiempoPrestamo + 0;
                }

                
               

            }
            return tiempoPrestamo;
        }
        private int TiempoTranscurridoXPrestamo(long cpersona, RqConsulta rqconsulta, int cproducto)
        {
            IList<tcaroperacion> objprestamos = TcarOperacionDal.FindPrestamoPersonaVigentes(cpersona, true, cproducto);
            int tiempoPrestamo = 0;

            foreach (tcaroperacion obj in objprestamos)
            {
                tgenproducto producto = TgenProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto);
                tcarproducto carproducto = TcarProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tgentipoproducto tipoproducto = TgenTipoProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tcarestatus estatus = TcarEstatusDal.Find(obj.cestatus);
                rqconsulta.Coperacion = obj.coperacion;
                DateTime fapertura = Fecha.ToDate(obj.fapertura.Value);
                DateTime factual = Fecha.ToDate(rqconsulta.Fconatable);
                int dias = (factual - fapertura).Days;
                tiempoPrestamo = tiempoPrestamo + dias;

            }
            return tiempoPrestamo;
        }
        private int TiempoTranscurridoXPrestamoGarantia(long cpersona, RqConsulta rqconsulta, int cproducto)
        {
            IList<tcaroperacion> objprestamos = TcarOperacionDal.FindPrestamoPersonaVigentes(cpersona, true, cproducto);
            int tiempoPrestamo = 0;

            foreach (tcaroperacion obj in objprestamos)
            {
                tgenproducto producto = TgenProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto);
                tcarproducto carproducto = TcarProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tgentipoproducto tipoproducto = TgenTipoProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tcarestatus estatus = TcarEstatusDal.Find(obj.cestatus);
                rqconsulta.Coperacion = obj.coperacion;
                DateTime fapertura = Fecha.ToDate(obj.fapertura.Value);
                DateTime factual = Fecha.ToDate(rqconsulta.Fconatable);
                int dias = (factual - fapertura).Days;
                if (carproducto.exigegarantia != null && carproducto.exigegarantia == true)
                {
                    tiempoPrestamo = tiempoPrestamo + dias;
                }
                else
                {
                    tiempoPrestamo = tiempoPrestamo + 0;
                }
                

            }
            return tiempoPrestamo;
        }
        private decimal ValorXPrestamoAdeudado(long cpersona, RqConsulta rqconsulta, int cproducto)
        {
            IList<tcaroperacion> objprestamos = TcarOperacionDal.FindPrestamoPersonaEstado(cpersona, true, cproducto);
            decimal tprestamos = 0;
            foreach (tcaroperacion obj in objprestamos)
            {
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
        private decimal ValorXPrestamoAdeudadoHipotecario(long cpersona, RqConsulta rqconsulta, int cproducto)
        {
            IList<tcaroperacion> objprestamos = TcarOperacionDal.FindPrestamoPersonaEstado(cpersona, true, cproducto);
            decimal tprestamos = 0;
            foreach (tcaroperacion obj in objprestamos)
            {
                tgenproducto producto = TgenProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto);
                tcarproducto carproducto = TcarProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tgentipoproducto tipoproducto = TgenTipoProductoDal.Find((int)obj.cmodulo, (int)obj.cproducto, (int)obj.ctipoproducto);
                tcarestatus estatus = TcarEstatusDal.Find(obj.cestatus);
                rqconsulta.Coperacion = obj.coperacion;
                montooriginal = (decimal)obj.montooriginal;
                if (carproducto.exigegarantia != null && carproducto.exigegarantia == true)
                {
                    tprestamos = tprestamos + Saldo(rqconsulta);
                }
                else {
                    tprestamos = tprestamos + 0;
                }


            }
            return tprestamos;
        }

        private static decimal Saldo(RqConsulta rqconsulta)
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
            if (saldo.Cxp > 0)
            {
                totaldeuda = totaldeuda - saldo.Cxp;
            }
            totaldeuda = totaldeuda + saldofuturo;
            if (totaldeuda < 0)
            {
                totaldeuda = 0;
            }

            tcarproducto producto = TcarProductoDal.Find((int)operacion.Tcaroperacion.cmodulo, (int)operacion.Tcaroperacion.cproducto, (int)operacion.Tcaroperacion.ctipoproducto);
            producto.mincuotaspagoextraordinario = producto.mincuotaspagoextraordinario ?? Constantes.CERO;
            valorextraordinario = saldo.GetSaldoCapitalPorVencer((int)producto.mincuotaspagoextraordinario);
            return totaldeuda;
        }

        private string ValidarPrestamosQP(decimal saldoQuirografario, decimal saldoPrendario, decimal montoMaximo)
        {
            string mensaje = string.Empty;
            decimal totalQP = saldoQuirografario + saldoPrendario;
            if (totalQP > montoMaximo)
            {
                mensaje = string.Format("Total Préstamos Q: $ {0} + P: $ {1} > Monto Máximo Parametrizado {2}", saldoQuirografario, saldoPrendario, montoMaximo);
            }

            return mensaje;
        }

        private string ValidarPrestamosH(decimal saldoHipotecario, decimal montoOriginal, int cCompania)
        {
            string mensaje = string.Empty;
            decimal porcentaje = TcarParametrosDal.GetValorNumerico("PORCENTAJE_PAGADO_PLAZOFIJO_H", cCompania);
            decimal porcentajePagado = montoOriginal * (porcentaje / 100);
            if (porcentajePagado < montoOriginal)
            {
                mensaje = string.Format("Préstamos H: $ {0}, % Pagado: $ {1} es menor del {2} requerido.", montoOriginal, porcentajePagado, porcentaje);
            }
            return mensaje;
        }

        private string ValidarPrestamosHTiempo(int tiempoHipotecario, int tiempotranscurrido, int cCompania)
        {
            string mensaje = string.Empty;
            decimal porcentaje = TcarParametrosDal.GetValorNumerico("PORCENTAJE_TIEMPO_PLAZOFIJO_H", cCompania);
            decimal total = 0;
            if (tiempoHipotecario > 0)
                total = ((decimal)tiempotranscurrido / (decimal)tiempoHipotecario) * 100;

            total = decimal.Round(total, 2, MidpointRounding.AwayFromZero);

            if (total > 0 && total < porcentaje)
            {
                mensaje = string.Format("Tiempo del préstamos: H $ {0}, es menor del: {1}% requerido.", total, porcentaje);
            }
            return mensaje;
        }

        private string ValidarCesantiaPrestamosH(decimal totalCesantia, decimal saldoHipotecario, decimal montoPrestamoHipotecario, int cCompania,decimal montomaximo)
        {
            string mensaje = string.Empty;
            decimal porcentaje = TcarParametrosDal.GetValorNumerico("PORCENTAJE_MONTO_PAGADO_H", cCompania);
            decimal porcentajePagado = 0;
            totalCesantia = totalCesantia - (porcentaje/100 * montoPrestamoHipotecario);


            if (totalCesantia <=montomaximo )
            {
                mensaje = string.Format("Monto del préstamos: H $ {0}, es menor del: {1}% requerido.", porcentajePagado, porcentaje);
            }
            return mensaje;
        }

        private string ValidarMontoPrestamoConCalculado(decimal vcpf, decimal montoMaximoPrestamo)
        {
            string mensaje = string.Empty;

            if (vcpf > montoMaximoPrestamo)
            {
                mensaje = string.Format("Monto VCPF: $ {0}, es mayor que monto máximo parametrizado: $ {1}.", vcpf, montoMaximoPrestamo);
            }
            return mensaje;
        }
    }
}