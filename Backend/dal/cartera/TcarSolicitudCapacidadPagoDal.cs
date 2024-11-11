using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.consulta;
using util.dto.mantenimiento;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tcarsolicitudcapacidadpagoie.
    /// </summary>
    public class TcarSolicitudCapacidadPagoDal {
        /// <summary>
        /// Adiciona al request el porcentaje para el cálculo de capacidad de pago
        /// </summary>
        /// <param name="rqmantenimiento">Request a adicionar la lista de ingresos.</param>
        public static void PorcentajeCapacidadPago(RqMantenimiento rqmantenimiento)
        {
            decimal porcentajecapacidadpago = TcarParametrosDal.GetValorNumerico("CAPACIDAD-PAGO", rqmantenimiento.Ccompania);
            rqmantenimiento.Response["porcentajecapacidadpago"] = porcentajecapacidadpago;
        }

        /// <summary>
        /// Adiciona al request la lista de ingresos para el calculo de capacidad de pago
        /// </summary>
        /// <param name="tipo">String que permite identificar que es ingreso "I"</param>
        /// <param name="rqmantenimiento">Request a adicionar la lista de ingresos.</param>
        /// <param name="tcarsolicitud">Objeto de solicitud creada</param>
        public static void CompletaIngresos(String tipo, RqMantenimiento rqmantenimiento, tcarsolicitud tcarsolicitud)
        {
            tcarproducto tcarproducto = TcarProductoDal.Find((int)tcarsolicitud.cmodulo, (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);
            rqmantenimiento.Response["INGRESOS"] = ListaIngresos(tipo, rqmantenimiento.Ccompania, (long)tcarsolicitud.cpersona, tcarproducto);
        }

        /// <summary>
        /// Adiciona al request la lista de ingresos para el calculo de capacidad de pago
        /// </summary>
        /// <param name="tipo">String que permite identificar que es ingreso "I"</param>
        /// <param name="rqconsulta">Request a adicionar la lista de ingresos.</param>
        /// <param name="cpersona">Codigo de persona</param>
        public static void CompletaIngresos(String tipo, RqConsulta rqconsulta, long cpersona)
        {
            if (rqconsulta.Mdatos.ContainsKey("cmodulo") && rqconsulta.Mdatos.ContainsKey("cproducto") && rqconsulta.Mdatos.ContainsKey("ctipoproducto")) {
                tcarproducto tcarproducto = TcarProductoDal.Find((int)rqconsulta.GetInt("cmodulo"), (int)rqconsulta.GetInt("cproducto"), (int)rqconsulta.GetInt("ctipoproducto"));
                rqconsulta.Response["INGRESOS"] = ListaIngresos(tipo, rqconsulta.Ccompania, cpersona, tcarproducto);
            } else {
                rqconsulta.Response["INGRESOS"] = ListaIngresos(tipo, rqconsulta.Ccompania, cpersona, null);
            }
        }

        /// <summary>
        /// Genera la lista de cuentas de tipo ingreso
        /// </summary>
        /// <param name="tipo">String que permite identificar que es ingreso "I"</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="cpersona">Codigo de persona.</param>
        public static List<tcarsolicitudcapacidadpagoie> ListaIngresos(String tipo, int ccompania, long cpersona, tcarproducto tcarproducto)
        {
            List<tcarsolicitudcapacidadpagoie> lingresos = new List<tcarsolicitudcapacidadpagoie>();
            decimal sueldo = (decimal)TsocCesantiaDal.Find(cpersona, ccompania).sueldoactual;

            IList<tcarbalance> listaIngresos = TcarBalanceDal.FindInDataBaseToTipo(tipo);
            foreach (tcarbalance detalle in listaIngresos) {
                if ((bool)detalle.activo) {

                    tcarsolicitudcapacidadpagoie ingreso = new tcarsolicitudcapacidadpagoie {
                        Esnuevo = true,
                        secuencia = detalle.cbalance,
                        tipo = detalle.cdetalletipo,
                        nombre = detalle.nombre
                    };

                    if (detalle.cbalance == Constantes.UNO) {
                        ingreso.valor = sueldo;
                    } else {
                        ingreso.valor = detalle.@default != null && (bool)detalle.@default ? detalle.valordefault : Constantes.CERO;
                    }
                    ingreso.Mdatos["editable"] = detalle.editable == null ? false : detalle.editable;
                    ingreso.Mdatos["porcentaje"] = detalle.incremento != null && (bool)detalle.incremento ? detalle.porcentajeincremento : Constantes.CERO;

                    if (tcarproducto != null && tcarproducto.capacidadconyuge != null && (bool)tcarproducto.capacidadconyuge) {
                        ingreso.Mdatos["check"] = detalle.incremento != null && (bool)detalle.incremento ? detalle.incremento : false;
                    } else {
                        ingreso.Mdatos["check"] = false;
                    }

                    lingresos.Add(ingreso);
                }
            }
            return lingresos;
        }

        /// <summary>
        /// Adiciona al request la lista de egresos para el calculo de capacidad de pago 
        /// </summary>
        /// <param name="tipo">String que permite identificar que es egreso "E"</param>
        /// <param name="rqmantenimiento">Request a adicionar la lista de egresos.</param>
        /// <param name="tcarsolicitud">Objeto de solicitud creada</param>
        public static void CompletaEgresos(String tipo, RqMantenimiento rqmantenimiento, tcarsolicitud tcarsolicitud)
        {
            rqmantenimiento.Response["EGRESOS"] = ListaEgresos(tipo, rqmantenimiento.Fconatable, (long)tcarsolicitud.cpersona, null);
        }

        /// <summary>
        /// Adiciona al request la lista de egresos para el calculo de capacidad de pago 
        /// </summary>
        /// <param name="tipo">String que permite identificar que es egreso "E"</param>
        /// <param name="rqconsulta">Request a adicionar la lista de egresos.</param>
        /// <param name="cpersona">Codigo de persona</param>
        public static void CompletaEgresos(String tipo, RqConsulta rqconsulta, long cpersona)
        {
            rqconsulta.Response["EGRESOS"] = ListaEgresos(tipo, rqconsulta.Fconatable, cpersona, null);
        }

        /// <summary>
        /// Genera la lista de cuentas de tipo ingreso
        /// </summary>
        /// <param name="tipo">String que permite identificar que es egreso "E"</param>
        /// <param name="fproceso">Fecha de proceso.</param>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="coperacion">Numero de operacion de cartera que no se debe considerar como egreso.</param>
        public static List<tcarsolicitudcapacidadpagoie> ListaEgresos(String tipo, int fproceso, long cpersona, string coperacion)
        {
            List<tcarsolicitudcapacidadpagoie> legresos = new List<tcarsolicitudcapacidadpagoie>();

            // Solicitudes de cartera
            List<tcarsolicitud> lsolicitudes = TcarSolicitudDal.FindPorPersona(cpersona, true).ToList();
            foreach (tcarsolicitud solicitud in lsolicitudes) {
                // No se consideran solicitudes ingresadas el mismo dia
                if (solicitud.fingreso == fproceso) {
                    continue;
                }
                tcarsolicitudcapacidadpagoie egreso = new tcarsolicitudcapacidadpagoie {
                    Esnuevo = true,
                    secuencia = Convert.ToInt32(solicitud.csolicitud),
                    tipo = tipo,
                    nombre = "SOLICITUD: " + solicitud.csolicitud,
                    valor = TcarSolicitudCuotaDal.GetValorCuota(solicitud.csolicitud, Constantes.UNO)
                };
                // Datos adicionales para el control de cada registro
                egreso.Mdatos["editable"] = false;
                egreso.Mdatos["porcentaje"] = Constantes.CERO;
                egreso.Mdatos["check"] = false;

                legresos.Add(egreso);
            }

            // Operaciones de cartera
            List<tcaroperacion> loperaciones = TcarOperacionDal.FindPorPersona(cpersona, true).Cast<tcaroperacion>().ToList();
            foreach (tcaroperacion operacion in loperaciones) {
                // No considerar operacion de cartera
                if (coperacion != null && coperacion.Equals(operacion.coperacion)) {
                    continue;
                }

                tcaroperacioncuota cuotaactual = TcarOperacionCuotaDal.GetCuotaActual(operacion.coperacion, fproceso);
                if (cuotaactual == null) {
                    List<tcaroperacioncuota> lcuotas = TcarOperacionCuotaDal.FindNoPagadas(operacion.coperacion);
                    cuotaactual = lcuotas.First();
                }

                tcarsolicitudcapacidadpagoie egreso = new tcarsolicitudcapacidadpagoie {
                    Esnuevo = true,
                    secuencia = Int32.Parse(operacion.coperacion),
                    tipo = tipo,
                    nombre = "OPERACIÓN: " + operacion.coperacion + " - " + TcarEstatusDal.FindInDataBase(operacion.cestatus).nombre,
                    valor = cuotaactual == null ? operacion.valorcuota : TcarOperacionCuotaDal.GetValorCuota(operacion.coperacion, cuotaactual.numcuota)
                };
                // Datos adicionales para el control de cada registro
                egreso.Mdatos["editable"] = false;
                egreso.Mdatos["porcentaje"] = Constantes.CERO;
                egreso.Mdatos["check"] = false;

                legresos.Add(egreso);
            }

            IList<tcarbalance> listaEgresos = TcarBalanceDal.FindInDataBaseToTipo(tipo);
            foreach (tcarbalance detalle in listaEgresos) {
                if ((bool)detalle.activo) {
                    tcarsolicitudcapacidadpagoie egreso = new tcarsolicitudcapacidadpagoie {
                        Esnuevo = true,
                        secuencia = detalle.cbalance,
                        tipo = detalle.cdetalletipo,
                        nombre = detalle.nombre,
                        valor = detalle.@default != null && (bool)detalle.@default ? detalle.valordefault : Constantes.CERO
                    };

                    // Datos adicionales para el control de cada registro
                    egreso.Mdatos["editable"] = detalle.editable == null ? false : detalle.editable;
                    egreso.Mdatos["porcentaje"] = detalle.incremento != null && (bool)detalle.incremento ? detalle.porcentajeincremento : Constantes.CERO;
                    egreso.Mdatos["check"] = detalle.incremento != null && (bool)detalle.incremento ? detalle.incremento : false;

                    legresos.Add(egreso);
                }
            }
            return legresos;
        }

        /// <summary>
        /// Consolida registros de ingresos y egresos 
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="ccapacidad">Código de Capacidad de Pago</param>
        /// <param name="csolicitud">Código de solicitud.</param>
        public static void CrearIngresosEgresos(RqMantenimiento rqmantenimiento, long ccapacidad, long csolicitud, string tipo)
        {
            List<tcarsolicitudcapacidadpagoie> lfinal = new List<tcarsolicitudcapacidadpagoie>();

            if (rqmantenimiento.GetTabla("INGRESOS" + tipo) != null && rqmantenimiento.GetTabla("INGRESOS" + tipo).Lregistros.Count > 0) {
                List<tcarsolicitudcapacidadpagoie> lingresos = rqmantenimiento.GetTabla("INGRESOS" + tipo).Lregistros.Cast<tcarsolicitudcapacidadpagoie>().ToList();
                foreach (tcarsolicitudcapacidadpagoie obj in lingresos) {
                    obj.ccapacidad = ccapacidad;
                    obj.csolicitud = csolicitud;
                    lfinal.Add(obj);
                }
            }

            if (rqmantenimiento.GetTabla("EGRESOS" + tipo) != null && rqmantenimiento.GetTabla("EGRESOS" + tipo).Lregistros.Count > 0) {
                List<tcarsolicitudcapacidadpagoie> legresos = rqmantenimiento.GetTabla("EGRESOS" + tipo).Lregistros.Cast<tcarsolicitudcapacidadpagoie>().ToList();
                foreach (tcarsolicitudcapacidadpagoie obj in legresos) {
                    obj.ccapacidad = ccapacidad;
                    obj.csolicitud = csolicitud;
                    lfinal.Add(obj);
                }
            }
        }

    }
}
