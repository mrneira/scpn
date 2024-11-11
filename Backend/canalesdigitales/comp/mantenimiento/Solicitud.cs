using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.models;
using canalesdigitales.WSISSPOL;
using cartera.datos;
using cartera.enums;
using core.componente;
using core.servicios;
using core.servicios.consulta;
using dal.canalesdigitales;
using dal.cartera;
using dal.persona;
using dal.socio;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using util;
using util.dto;
using util.dto.consulta;
using util.dto.mantenimiento;
using util.thread;

namespace canalesdigitales.comp.mantenimiento {

    class Solicitud : ComponenteMantenimiento {

        private readonly WSISSPOLHelper isspolHelper = new WSISSPOLHelper();
        private readonly WSEQUIFAXHelper equifaxHelper = new WSEQUIFAXHelper();
        private readonly ComponenteHelper componenteHelper = new ComponenteHelper();
        private CreditoDTO[] creditosISSPOL = null;
        private EquifaxModel infoEquifax = null;
        private tcanusuario usuario;
        private tperpersonadetalle personaDetalle;
        int[] ctiposProductos;
        private long csolicitud;
        bool esemergente;

        private List<KeyValuePair<int, int>> keyProductosSugeridos;

        /// <summary>
        /// Método principal que ejecuta la Solicitud de crédito
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            //CCA 20231019
            if ((string)rqmantenimiento.Mdatos["CODIGOCONSULTA"] == "CARTERAISSPOL") {
                consultarCreditosIsspol(rqmantenimiento);
            }
            else {
                usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
                personaDetalle = TperPersonaDetalleDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);
                csolicitud = Secuencia.GetProximovalor("CAN-SOLICIT");
                esemergente = Convert.ToBoolean(rqmantenimiento.GetDatos(nameof(esemergente)));

                if (esemergente == true) {
                    ctiposProductos = new int[] { EnumProductosSugeridos.CTIPOPRODUCTO_EMERGENTE };
                    keyProductosSugeridos = new List<KeyValuePair<int, int>> {
                    new KeyValuePair<int, int>(EnumProductosSugeridos.CPRODUCTO, EnumProductosSugeridos.CTIPOPRODUCTO_EMERGENTE)
                };
                } else {
                    ctiposProductos = new int[] { EnumProductosSugeridos.CTIPOPRODUCTO_EMERGENTE, EnumProductosSugeridos.CTIPOPRODUCTO_ORDINARIO, EnumProductosSugeridos.CTIPOPRODUCTO_PLAZOFIJO };
                    keyProductosSugeridos = new List<KeyValuePair<int, int>> {
                    new KeyValuePair<int, int>(EnumProductosSugeridos.CPRODUCTO, EnumProductosSugeridos.CTIPOPRODUCTO_EMERGENTE),
                    new KeyValuePair<int, int>(EnumProductosSugeridos.CPRODUCTO, EnumProductosSugeridos.CTIPOPRODUCTO_ORDINARIO),
                    new KeyValuePair<int, int>(EnumProductosSugeridos.CPRODUCTO, EnumProductosSugeridos.CTIPOPRODUCTO_PLAZOFIJO)
                };
                }

                ValidarPersona(rqmantenimiento);
                ValidarSolicitudes(rqmantenimiento);
                ValidarReferenciaBancaria(rqmantenimiento);
                RegistrarSolicitud(rqmantenimiento);
            }
        }

        //CCA 20231019
        private void consultarCreditosIsspol(RqMantenimiento rqmantenimiento)
        {
            personaDetalle = TperPersonaDetalleDal.Find(Convert.ToInt64(rqmantenimiento.Mdatos["cpersona"]), EnumGeneral.COMPANIA_COD);
            creditosISSPOL = isspolHelper.BuscarCreditosPorCedula(personaDetalle.identificacion);
            decimal totalCuota = 0;
            foreach (CreditoDTO credito in creditosISSPOL)
            {
                int msgError = credito.Mensaje.MensajeError;
                string msgErrorText = credito.Mensaje.DescripcionError;
                if (msgError == 2 || msgError == 5 || msgError == 6 || msgError == 7 || msgError == 8)
                {

                    throw new AtlasException("CAN-029", $"ERROR DE COMUNICACIÓN CON ISSPOL CCA: {credito.Cedula}" + credito.Mensaje.DescripcionError);
                }
                if (Convert.ToBoolean(credito.Mora))
                {
                    throw new AtlasException("CAN-051", $"ACTUALMENTE SE ENCUENTRA EN MORA CON UN CRÉDITO EN EL ISSPOL: {credito.Cedula}");
                }

            }
            rqmantenimiento.Response.Add(nameof(creditosISSPOL), creditosISSPOL);
            rqmantenimiento.Response.Remove("TCARSOLICITUD");
        }

        private void ValidarPersona(RqMantenimiento rqmantenimiento) {
            if (personaDetalle.regimen) {
                throw new AtlasException("CAN-038", "SOCIO SE ENCUENTRA EN REGIMEN");
            }
        }

        private void ValidarSolicitudes(RqMantenimiento rqmantenimiento) {
            List<tcarsolicitud> lsolicitud = TcarSolicitudDal.FindPorPersona(personaDetalle.cpersona, true).ToList();

            if (lsolicitud.Count > 0) {
                throw new AtlasException("CAN-048", $"ACTUALMENTE CUENTA CON UNA SOLICITUD DE CRÉDITO ACTIVA, PARA MÁS INFORMACIÓN CONTÁCTESE CON EL SERVICIO DE CESANTÍA: {personaDetalle.cpersona}");
            }
        }

        private void ValidarReferenciaBancaria(RqMantenimiento rqmantenimiento) {
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tperreferenciabancaria referenciaBancaria = TperReferenciaBancariaDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            if (referenciaBancaria == null || !referenciaBancaria.estado.Equals(EnumEstadosReferenciaBancaria.REFERENCIA_ACTIVA)) {
                throw new AtlasException("CAN-034", "REFERENCIA BANCARIA NO EXISTE PARA USUARIO: {0}", rqmantenimiento.Cusuariobancalinea);
            }
        }


        /// <summary>
        /// Método que realiza el registro de la solicitud del usuario apr realizar un crédito
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        private void RegistrarSolicitud(RqMantenimiento rqmantenimiento) {
            string token = rqmantenimiento.GetString(nameof(token));
            
            //Se crea el registro de la solicitud
            tcansolicitud solicitud = new tcansolicitud {
                csolicitud = csolicitud,
                cusuario = rqmantenimiento.Cusuariobancalinea,
                token = token,
                ip = rqmantenimiento.Cterminal,
                navegador = rqmantenimiento.GetString("navegador"),
                autorizado = true,
                cusuarioing = rqmantenimiento.Cusuario,
                fingreso = Fecha.GetFechaSistema(),
                fcaducidad = Fecha.GetFechaSistema().AddHours(1),
            };

            decimal totalCuotaCesantia = ObtenerCuotaCesantia(rqmantenimiento);
            decimal totalCuotaISSPOL = ObtenerCuotaISSPOL();
            decimal totalCuotaRetenciones = 0;
            // TODO: OBTENER LA CUOTA DE RETENCIONES JUDICIALES

            RegistrarSolicitudDetalle(rqmantenimiento, solicitud, totalCuotaCesantia, totalCuotaISSPOL, totalCuotaRetenciones);
        }

        /// <summary>
        /// Método que obtiene la cuota  de los créditos que el usuario tiene activos en Cesantía
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="usuario"></param>
        /// <returns></returns>
        private decimal ObtenerCuotaCesantia(RqMantenimiento rqmantenimiento) {
            IList<tcaroperacion> operaciones = TcarOperacionDal.FindPorPersona(Convert.ToInt64(usuario.cpersona), true);
            decimal totalCuota = 0;

            foreach (tcaroperacion operacion in operaciones) {
                if (operacion.cestatus == EnumEstadosOperacion.VENCIDA) {
                    throw new AtlasException("CAN-028", "NO PUEDE SOLICITAR UN CRÉDITO PORQUE TIENE UNA CUOTA VENCIDA EN LA OPERACION NÚMERO {0}", operacion.coperacion);
                }
                tcaroperacioncuota cuotaactual = TcarOperacionCuotaDal.GetCuotaActual(operacion.coperacion, rqmantenimiento.Fconatable);
                totalCuota += cuotaactual == null ? Convert.ToDecimal(operacion.valorcuota) : TcarOperacionCuotaDal.GetValorCuota(operacion.coperacion, cuotaactual.numcuota);
            }
            return totalCuota;
        }

        /// <summary>
        /// Método que obtiene la cuota  de los créditos que el usuario tiene activos en el ISSPOL
        /// </summary>
        /// <param name="usuario"></param>
        /// <returns></returns>
        private decimal ObtenerCuotaISSPOL() {
            creditosISSPOL = isspolHelper.BuscarCreditosPorCedula(personaDetalle.identificacion);
            decimal totalCuota = 0;
            foreach (CreditoDTO credito in creditosISSPOL) {
                int msgError = credito.Mensaje.MensajeError;
                if (msgError == 2 || msgError == 5 || msgError == 6 || msgError == 7 || msgError == 8) {
                    throw new AtlasException("CAN-029", $"ERROR DE COMUNICACIÓN CON ISSPOL: {credito.Cedula}", credito.Mensaje.DescripcionError);
                }
                if (Convert.ToBoolean(credito.Mora)) {
                    throw new AtlasException("CAN-051", $"ACTUALMENTE SE ENCUENTRA EN MORA CON UN CRÉDITO EN EL ISSPOL: {credito.Cedula}");
                }
                totalCuota += credito.CuotaTotal;
            }
            return totalCuota;
        }

        /// <summary>
        /// Método que registra el detalle de la Solicitud del crédito
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="solicitud"></param>
        /// <param name="totalCuotaCesantia"></param>
        /// <param name="totalCuotaISSPOL"></param>
        private void RegistrarSolicitudDetalle(RqMantenimiento rqmantenimiento, tcansolicitud solicitud, decimal totalCuotaCesantia, decimal totalCuotaISSPOL, decimal totalCuotaRetenciones) {
            List<CreditoSugeridoModel> lmontosSugeridos = new List<CreditoSugeridoModel> { };
            decimal capacidadpago;
            decimal montootrosingresos;
            decimal otrosingresos = 0;
            decimal totalCuotaBuro = 0;

            tsoccesantia cesantia = TsocCesantiaDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);
            if (esemergente == true) {
                capacidadpago = (Convert.ToDecimal(cesantia.sueldoactual) * 0.50m) + EnumGeneral.RANCHO - totalCuotaCesantia - totalCuotaISSPOL - totalCuotaRetenciones;
            } else {
                bool disponeotrosingresos = Convert.ToBoolean(rqmantenimiento.GetDatos(nameof(disponeotrosingresos)));

                montootrosingresos = (disponeotrosingresos == true) ? Convert.ToDecimal(rqmantenimiento.GetDecimal("montootrosingresos")) : 0;
                otrosingresos = (disponeotrosingresos == true) ? (Convert.ToDecimal(cesantia.sueldoactual) * 0.20m) : 0;

                if (disponeotrosingresos) {
                    if (montootrosingresos > otrosingresos) {
                        throw new AtlasException("CAN-052", "EL MONTO INGRESADO DEBE SER MENOR AL 20% DE SU REMUNERACIÓN");
                    } else {
                        totalCuotaBuro = ObtenerCuotaBuro();
                        capacidadpago = ((Convert.ToDecimal(cesantia.sueldoactual) + montootrosingresos) * 0.50m) + EnumGeneral.RANCHO - totalCuotaCesantia - totalCuotaISSPOL - totalCuotaRetenciones - totalCuotaBuro;
                    }
                } else {
                    totalCuotaBuro = ObtenerCuotaBuro();
                    capacidadpago = ((Convert.ToDecimal(cesantia.sueldoactual) + otrosingresos) * 0.50m) + EnumGeneral.RANCHO - totalCuotaCesantia - totalCuotaISSPOL - totalCuotaRetenciones - totalCuotaBuro;
                }
            }

            if (capacidadpago <= 0) {
                throw new AtlasException("CAN-039", "LA CAPACIDAD DE PAGO NO ES SUFICIENTE PARA SOLICITAR UN CREDITO");
            }

            int ctabla = rqmantenimiento.GetInt(nameof(ctabla)).HasValue ? rqmantenimiento.GetInt(nameof(ctabla)).Value : 1;


            foreach (int ctipoproducto in ctiposProductos) {
                CreditoSugeridoModel montoSugerido = MontoSugerido(rqmantenimiento, capacidadpago, ctabla, ctipoproducto);

                ValidarCuotasEdad(montoSugerido);
                ValidarProductosPermitidos(montoSugerido);
                ValidarOperacionesCliente(rqmantenimiento, montoSugerido);

                tcansolicitud solicitudDB = TcanSolicitudDal.Find(csolicitud);
                if (solicitudDB == null) {
                    InsertAnidadoThread.GrabarJoin(EnumGeneral.COMPANIA_COD, solicitud);
                }

                tcansolicituddetalle solicitudDetalle = new tcansolicituddetalle {
                    csolicitud = csolicitud,
                    cproducto = EnumProductosSugeridos.CPRODUCTO,
                    ctipoproducto = ctipoproducto,
                    token = solicitud.token,
                    identificacionconyuge = rqmantenimiento.Mdatos.ContainsKey("identificacionconyuge") ? rqmantenimiento.GetString("identificacionconyuge") : null,
                    nombreconyuge = rqmantenimiento.Mdatos.ContainsKey("nombreconyuge") ? rqmantenimiento.GetString("nombreconyuge") : null,
                    espolicia = rqmantenimiento.Mdatos.ContainsKey("espolicia") ? Convert.ToBoolean(rqmantenimiento.GetDatos("espolicia")) : false,
                    sueldo = Convert.ToDecimal(cesantia.sueldoactual),
                    rancho = EnumGeneral.RANCHO,
                    otrosingresos = otrosingresos,
                    cesantia = totalCuotaCesantia,
                    isspol = totalCuotaISSPOL,
                    retenciones = totalCuotaRetenciones,
                    buro = totalCuotaBuro,
                    montosugerido = montoSugerido.Monto,
                    plazo = montoSugerido.Plazo,
                    capacidadpago = capacidadpago
                };

                InsertAnidadoThread.GrabarJoin(EnumGeneral.COMPANIA_COD, solicitudDetalle);
                lmontosSugeridos.Add(montoSugerido);
            }

            RegistrarSolicitudesISSPOL();
            RegistrarSolicitudesBuro();
            AgregarCreditosSugeridos(rqmantenimiento, lmontosSugeridos);
        }

        private decimal ObtenerCuotaBuro() {
            infoEquifax = equifaxHelper.BuscarBuroPorCedula(personaDetalle.identificacion);
            return infoEquifax.cuota;
        }

        private void RegistrarSolicitudesISSPOL() {
            short secuencial = 1;
            foreach (CreditoDTO credito in creditosISSPOL) {
                tcansolicitudisspol solicitudISSPOL = new tcansolicitudisspol {
                    csolicitud = csolicitud,
                    secuencia = secuencial,
                    identificacion = credito.Cedula,
                    credito = credito.Credito,
                    tipocredito = credito.TipoCredito,
                    cuota = credito.CuotaTotal,
                    enmora = Convert.ToBoolean(credito.Mora)
                };
                TcanSolicitudISSPOLDal.Crear(solicitudISSPOL);
                secuencial += 1;
            }
        }

        private void RegistrarSolicitudesBuro() {
            if (infoEquifax != null) {
                tcansolicitudburo solicitudBuro = new tcansolicitudburo {
                    csolicitud = csolicitud,
                    secuencia = 1,
                    identificacion = infoEquifax.identificacion,
                    codigoconsulta = infoEquifax.codigoconsulta,
                    cuota = infoEquifax.cuota,
                    mensaje = infoEquifax.mensaje
                };

                TcanSolicitudBuroDal.Crear(solicitudBuro);
            }
        }
        /// <summary>
        /// Método que obtiene monto, plazo, tasas en base a la simulación de crédito
        /// </summary>
        /// <param name="capacidadpago"></param>
        /// <param name="csolicitud"></param>
        /// <param name="ctabla"></param>
        /// <returns></returns>
        private CreditoSugeridoModel MontoSugerido(RqMantenimiento rq, decimal capacidadpago, int ctabla, int ctipoproducto) {
            RqConsulta rqconsulta = new RqConsulta();
            ConsultarTipoProductoCartera(rqconsulta, ctipoproducto);

            List<tcarproductorangos> rangosProductos = TcarProductoRangosDal.findInDataBase(EnumGeneral.MODULO_PRESTAMOS, EnumProductosSugeridos.CPRODUCTO, ctipoproducto);
            tcarproductorangos rangoMinimo = rangosProductos.OrderBy(x => x.montomaximo).FirstOrDefault();
            tcarproductorangos rangoMaximo = null;
            decimal maximoMonto = 0;
            int plazo = 0;
            if (ctipoproducto == EnumProductosSugeridos.CTIPOPRODUCTO_EMERGENTE) {
                rangoMaximo = rangosProductos.OrderBy(x => x.montomaximo).LastOrDefault();
                maximoMonto = rangoMaximo.montomaximo;
                plazo = rangoMaximo.plazomaximo;
            } else if (ctipoproducto == EnumProductosSugeridos.CTIPOPRODUCTO_ORDINARIO) {
                maximoMonto = Convert.ToDecimal(rqconsulta.Response["monto_previo"]);
                rangoMaximo = rangosProductos.Where(x => x.montomaximo >= maximoMonto).OrderBy(x => x.montomaximo).FirstOrDefault();
                plazo = (rangoMaximo != null) ? rangoMaximo.plazomaximo : 0;

            } else if (ctipoproducto == EnumProductosSugeridos.CTIPOPRODUCTO_ORDINARIO) {
                maximoMonto = Convert.ToDecimal(rqconsulta.Response["montovalidado"]);
                rangoMaximo = rangosProductos.Where(x => x.montomaximo >= maximoMonto).OrderBy(x => x.montomaximo).FirstOrDefault();
                plazo = (rangoMaximo != null) ? rangoMaximo.plazomaximo : 0;
            }


            decimal cuota = 0;
            decimal tasa = 0;
            if (rangoMaximo != null) {
                do {
                    ThreadNegocio.FijarDatos(new Datos());
                    RqMantenimiento rqMantenimiento = new RqMantenimiento();
                    rqMantenimiento = RqMantenimiento.Copiar(rq);

                    Response res = new Response();
                    rqMantenimiento.Response = res;

                    //Se realiza una regla de 3 para poder obtener una cuota más bajo
                    if (cuota > 0) {

                        maximoMonto = decimal.Round(maximoMonto * capacidadpago / cuota, 2);

                        var rangoMontos = rangosProductos.FirstOrDefault(x => x.montominimo <= maximoMonto && maximoMonto <= x.montomaximo);

                        if (rangoMontos is null) {
                            throw new AtlasException("CAN-039", "LA CAPACIDAD DE PAGO NO ES SUFICIENTE PARA SOLICITAR UN CREDITO");
                        }

                        plazo = rangoMontos.plazomaximo;
                    }


                    rqMantenimiento.AddDatos("cproducto", EnumProductosSugeridos.CPRODUCTO);
                    rqMantenimiento.AddDatos("ctipoproducto", ctipoproducto);
                    rqMantenimiento.AddDatos("ctabla", ctabla);
                    rqMantenimiento.AddDatos("montooriginal", maximoMonto);
                    rqMantenimiento.AddDatos("numerocuotas", plazo);
                    rqMantenimiento.AddDatos("rollback", true);

                    componenteHelper.ProcesarComponenteMantenimiento(rqMantenimiento, EnumComponentes.SIMULACION);

                    if (rqMantenimiento.Response.ContainsKey("TABLA") && rqMantenimiento.Response.ContainsKey("tasa") && rqMantenimiento.Response.ContainsKey("plazo")) {

                        var primerResultadoTabla = ((List<Dictionary<string, object>>)rqMantenimiento.Response["TABLA"]).FirstOrDefault();

                        tasa = Convert.ToDecimal(rqMantenimiento.Response["tasa"]);
                        cuota = Convert.ToDecimal(primerResultadoTabla["valcuo"]);
                        plazo = ((List<Dictionary<string, object>>)rqMantenimiento.Response["TABLA"]).Count();

                    } else {
                        throw new AtlasException("CAN-035", "OCURRIÓ UN PROBLEMA EN LA SIMULACIÓN DE CRÉDITOS");
                    }

                } while (cuota > capacidadpago);
            }


            CreditoSugeridoModel resultado = new CreditoSugeridoModel();
            resultado.Cproducto = EnumProductosSugeridos.CPRODUCTO;
            resultado.CtipoProducto = ctipoproducto;
            resultado.Cuota = cuota;
            resultado.Plazo = plazo;
            resultado.Tasa = tasa;
            resultado.Monto = maximoMonto;
            resultado.Ctabla = ctabla;

            return resultado;
        }

        private void ConsultarTipoProductoCartera(RqConsulta rqconsulta, int ctipoproducto) {
            string codigoConsulta = "TIPOPRODUCTOCARTERA";
            rqconsulta.Cmodulo = 30;
            rqconsulta.Ctransaccion = 18;
            rqconsulta.Ccanal = "OFI";
            rqconsulta.Ccompania = EnumGeneral.COMPANIA_COD;
            rqconsulta.Freal = Fecha.GetFechaSistema();
            rqconsulta.AddDatos("CODIGOCONSULTA", codigoConsulta);
            rqconsulta.AddDatos("cmoneda", "USD");
            rqconsulta.Mdatos.Add("cpersona", usuario.cpersona);
            if (ctipoproducto == EnumProductosSugeridos.CTIPOPRODUCTO_PLAZOFIJO) {
                rqconsulta.Mdatos.Add("validacionplazofijo", true);
            }

            DtoConsulta tipoProducto = new DtoConsulta("tgentipoproducto", 0, 50, true);
            tipoProducto.AddFiltro(new Filtro("cmodulo", "=", EnumGeneral.MODULO_PRESTAMOS.ToString()));
            tipoProducto.AddFiltro(new Filtro("cproducto", "=", EnumProductosSugeridos.CPRODUCTO.ToString()));
            tipoProducto.AddFiltro(new Filtro("ctipoproducto", "=", ctipoproducto.ToString()));
            rqconsulta.Mconsulta.Add("TIPOPRODUCTO", tipoProducto);
            rqconsulta.Response = new Response();

            componenteHelper.ProcesaCodigoConsulta(rqconsulta, codigoConsulta);
        }

        private void ValidarCuotasEdad(CreditoSugeridoModel creditoSugerido) {
            tpernatural personaNatural = TperNaturalDal.Find(personaDetalle.cpersona, EnumGeneral.COMPANIA_COD);

            if (personaNatural.fnacimiento != null) {
                DateTime fsistema = Fecha.GetFechaSistema();
                DateTime fnacimiento = personaNatural.fnacimiento.Value;

                int meses = Math.Abs((fsistema.Month - fnacimiento.Month) + 12 * (fsistema.Year - fnacimiento.Year));
                int mesessolicitud = meses + creditoSugerido.Plazo;

                int plazoedad = Convert.ToInt32(TcarParametrosDal.GetValorNumerico("PLAZO-EDAD", EnumGeneral.COMPANIA_COD));

                if (Math.Abs(meses / 12) > plazoedad) {
                    throw new AtlasException("CAR-0067", "SOCIO TIENE {0} AÑOS DE EDAD Y SUPERA EL LÍMITE PERMITIDO", Math.Abs(meses / 12));
                }

                if (mesessolicitud > (plazoedad * 12)) {
                    int plazosugerido = (plazoedad * 12) - meses;
                    throw new AtlasException("CAR-0033", "SOLICITUD SUPERA EL PLAZO MÁXIMO DE {0} AÑOS <br> CUOTAS MÁXIMAS SUGERIDAS: {1} CUOTAS", plazoedad, plazosugerido);
                }
            }
        }

        private void ValidarProductosPermitidos(CreditoSugeridoModel montoSugerido) {
            List<tcaroperacion> loperacion = TcarOperacionDal.FindPorPersona(personaDetalle.cpersona, true).ToList();

            foreach (tcaroperacion op in loperacion) {
                tcarproductopermitidos obj = TcarProductoPermitidosDal.FindToPermitido(Convert.ToInt32(op.cmodulo), Convert.ToInt32(op.cproducto), Convert.ToInt32(op.ctipoproducto), montoSugerido.Cproducto, montoSugerido.CtipoProducto);

                if (obj == null) {
                    throw new AtlasException("CAN-049", $"ACTUALMENTE CUENTA CON UN CRÉDITO ACTIVO, PARA MÁS INFORMACIÓN CONTÁCTESE CON EL SERVICIO DE CESANTÍA: {personaDetalle.cpersona}");
                }
            }
        }

        private void ValidarOperacionesCliente(RqMantenimiento rqmantenimiento, CreditoSugeridoModel montoSugerido) {
            int count = 0;

            tcarproducto producto = TcarProductoDal.Find(EnumGeneral.MODULO_PRESTAMOS, montoSugerido.Cproducto, montoSugerido.CtipoProducto);

            // Lista de operaciones por persona
            List<tcaroperacion> loperacion = TcarOperacionDal.FindPorPersona(personaDetalle.cpersona).ToList();
            foreach (tcaroperacion op in loperacion) {
                tcarestatus estatus = TcarEstatusDal.FindInDataBase(op.cestatus);
                if ((estatus.cestatus == EnumEstatus.APROVADA.Cestatus)) {
                    throw new AtlasException("CAR-0048", "SOCIO TIENE LA OPERACIÓN: {0} APROBADA PARA DESEMBOLSO", op.coperacion);
                }

                if (!estatus.cestatus.Equals(EnumEstatus.CANCELADA.Cestatus)) {
                    count += 1;

                    // Calcula dias mora
                    int diasmora = 0;
                    Operacion operacion = OperacionFachada.GetOperacion(op.coperacion, true);

                    if ((operacion.Lcuotas != null) && !(operacion.Lcuotas.Count < 1) && (rqmantenimiento.Fproceso > operacion.Lcuotas[0].fvencimiento)) {
                        diasmora = Fecha.Resta365(Convert.ToInt32(rqmantenimiento.Fproceso), Convert.ToInt32(operacion.Lcuotas[0].fvencimiento));
                    }

                    if (producto.consolidado == null || !(bool)producto.consolidado) {
                        int diasgracia = TcarParametrosDal.GetInteger("DIASGRACIAMORA", EnumGeneral.COMPANIA_COD);
                        if (diasmora > diasgracia) {
                            throw new AtlasException("CAR-0035", "SOCIO EN MORA. OPERACION: {0} - DIAS MORA: {1} - ESTADO: {2}", op.coperacion, diasmora, estatus.nombre);
                        }
                    }

                    // Operacion mismo producto
                    if ((op.cproducto == montoSugerido.Cproducto) && (op.ctipoproducto == montoSugerido.CtipoProducto)) {
                        throw new AtlasException("CAR-0036", "SOCIO TIENE UNA OPERACIÓN ACTIVA DEL MISMO PRODUCTO");
                    }

                    // Operacion sin cuotas pagadas
                    tcaroperacioncuota cuota = TcarOperacionCuotaDal.FindUltimaCuotaPagada(op.coperacion);
                    if (cuota == null && operacion.Lcuotas[0].numcuota == 1) {
                        throw new AtlasException("CAR-0037", "LA OPERACION {0} NO TIENE PAGADA NINGUNA CUOTA", op.coperacion);
                    }
                }
            }

            // Maximo de operaciones por cliente
            int maxoperaciones = Convert.ToInt32(TcarParametrosDal.GetValorNumerico("OPERACIONES-POR-SOCIO", EnumGeneral.COMPANIA_COD));
            if (maxoperaciones <= count) {
                throw new AtlasException("CAR-0034", "NÚMERO DE OPERACIONES ACTIVAS POR SOCIO NO PUEDE SER MAYOR A: {0}", maxoperaciones);
            }
        }


        /// <summary>
        /// Método que envia al front todos los créditos sugeridos que puede tomar el usuario
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="montosSugeridos"></param>
        private void AgregarCreditosSugeridos(RqMantenimiento rqmantenimiento, List<CreditoSugeridoModel> montosSugeridos) {

            List<tcarproducto> listaProductos = TcarProductoDal.FindAllInModule(EnumGeneral.MODULO_PRESTAMOS);
            List<tcartipotablaamortizacion> tablasAmortizacion = TcarTipoTablaAmortizacionDal.FindAll();

            List<CreditoSugeridoModel> creditosSugeridos = listaProductos.Where(lp => keyProductosSugeridos.Contains(new KeyValuePair<int, int>(lp.cproducto, lp.ctipoproducto)))
                .Select(lp => {

                    CreditoSugeridoModel montoSugerido = montosSugeridos.FirstOrDefault(m => m.Cproducto == lp.cproducto && m.CtipoProducto == lp.ctipoproducto);

                    CreditoSugeridoModel modelo = new CreditoSugeridoModel {
                        Csolicitud = csolicitud,
                        Cproducto = lp.cproducto,
                        CtipoProducto = lp.ctipoproducto,
                        Nombre = lp.nombre,
                        Cuota = montoSugerido.Cuota,
                        Plazo = montoSugerido.Plazo,
                        Monto = montoSugerido.Monto,
                        Tasa = montoSugerido.Tasa,
                        Ctabla = montoSugerido.Ctabla,
                        NombreTabla = tablasAmortizacion.FirstOrDefault(x => x.ctabla == montoSugerido.Ctabla).nombre
                    };

                    return modelo;

                }).OrderBy(cred => cred.Nombre).ToList();

            rqmantenimiento.Response.Add(nameof(creditosSugeridos), creditosSugeridos);
            rqmantenimiento.Response.Remove("TCARSOLICITUD");
        }

    }

}
