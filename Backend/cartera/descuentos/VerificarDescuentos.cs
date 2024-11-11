using cartera.datos;
using cartera.enums;
using cartera.saldo;
using dal.cartera;
using dal.generales;
using dal.persona;
using modelo;
using modelo.interfaces;
using socio.datos;
using socio.enums;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.descuentos {
    /// <summary>
    /// Clase que se encarga de verificar los datos del deudor.
    /// </summary>
    public class VerificarDescuentos {

        private int ccompania;
        private int particion = Constantes.CERO;
        private decimal monto = Constantes.CERO;
        private decimal montoVencido = Constantes.CERO;
        private decimal montoDescuento = Constantes.CERO;
        private int diasvencido = Constantes.CERO;
        private int cuotasvencido = Constantes.CERO;
        private int diasvencidodescuento = Constantes.CIEN;
        private int ccatalogo = 704;
        private bool simulacion = false;
        private List<IBean> lcond;

        /// <summary>
        /// Verifica condiciones de descuento
        /// </summary>
        public void Verificar(RqMantenimiento rq, Operacion operacion, int particion, bool simulacion)
        {
            diasvencidodescuento = TcarParametrosDal.GetInteger("DIAS-DESCUENTOS-GARANTE", rq.Ccompania);
            lcond = new List<IBean>();
            ccompania = rq.Ccompania;
            tcaroperacion tcaroperacion = operacion.tcaroperacion;
            this.particion = particion;
            this.simulacion = simulacion;

            int? fcobro = Fecha.DateToInteger(Fecha.GetFinMes(Fecha.GetFecha(rq.Fconatable)));
            operacion.CalcularMora(rq, (int)fcobro, rq.Mensaje, rq.Csucursal, ccompania, true);
            monto = Saldo(operacion, fcobro);
            if (monto <= 0) {
                return;
            }

            Condiciones(rq, tcaroperacion);

            if (this.simulacion) {
                Dictionary<string, object> resp = new Dictionary<string, object>();
                resp["fcobro"] = fcobro;
                resp["monto"] = monto;
                resp["diasvencido"] = diasvencido;
                resp["cuotasvencido"] = cuotasvencido;
                resp["montoDescuento"] = montoDescuento;

                // Add Response
                rq.Response["CONDICIONES"] = lcond;
                rq.Response["DESCUENTOS"] = resp;
            }
        }

        /// <summary>
        /// Verifica condiciones de descuento
        /// </summary>
        private void Condiciones(RqMantenimiento rq, tcaroperacion tcaroperacion)
        {
            // Deudor
            string coperacion = tcaroperacion.coperacion;
            long deudor = (long)tcaroperacion.cpersona;
            Socios objDeudor = new Socios(deudor, rq);
            bool cesantiaDeudor = (objDeudor.GetTservicioArray()[0] >= 20) ? true : false;

            // Garante
            long garante = TcarOperacionPersonaDal.FindGarante(coperacion, rq.Ccompania);
            bool existegarante = (garante > 0) ? true : false;
            Socios objGarante = (existegarante) ? new Socios(garante, rq) : null;
            bool cesantiaGarante = (existegarante) ? (objGarante.GetTservicioArray()[0] >= 20) ? true : false : false;

            // Socio Activo
            if (objDeudor.GetEstadoSocio().cdetalle.Equals(EnumSocio.ACTIVO.Cestatus)) {
                if (diasvencido > 0) {
                    if (diasvencido >= diasvencidodescuento && existegarante) {
                        if (objGarante.GetEstadoSocio().cdetalle.Equals(EnumSocio.ACTIVO.Cestatus)) {
                            GrabarComandancia(tcaroperacion, garante, objGarante.GetEstadoSocio().cdetalle, EnumPersonas.GARANTE.Ctipo);
                        } else {
                            if (cesantiaGarante) {
                                GrabarIsspol(tcaroperacion, garante, objGarante.GetEstadoSocio().cdetalle, EnumPersonas.GARANTE.Ctipo);
                            } else {
                                GrabarComandancia(tcaroperacion, garante, objGarante.GetEstadoSocio().cdetalle, EnumPersonas.GARANTE.Ctipo);
                            }
                        }
                        GrabarComandancia(tcaroperacion, deudor, objDeudor.GetEstadoSocio().cdetalle, EnumPersonas.DEUDOR.Ctipo);
                    } else {
                        GrabarComandancia(tcaroperacion, deudor, objDeudor.GetEstadoSocio().cdetalle, EnumPersonas.DEUDOR.Ctipo);
                    }
                } else {
                    if (objDeudor.GetAutorizacionDebito(coperacion)) {
                        GrabarBancos(rq, tcaroperacion, deudor, objDeudor.GetEstadoSocio().cdetalle, EnumPersonas.DEUDOR.Ctipo);
                    } else {
                        GrabarComandancia(tcaroperacion, deudor, objDeudor.GetEstadoSocio().cdetalle, EnumPersonas.DEUDOR.Ctipo);
                    }
                }
            } else {    // Socio Baja
                if (objDeudor.GetAutorizacionDebito(coperacion)) {
                    if (diasvencido > 0) {
                        if (diasvencido >= diasvencidodescuento && existegarante) {
                            if (objGarante.GetEstadoSocio().cdetalle.Equals(EnumSocio.ACTIVO.Cestatus)) {
                                GrabarComandancia(tcaroperacion, garante, objGarante.GetEstadoSocio().cdetalle, EnumPersonas.GARANTE.Ctipo);
                            } else {
                                if (cesantiaGarante) {
                                    GrabarIsspol(tcaroperacion, garante, objGarante.GetEstadoSocio().cdetalle, EnumPersonas.GARANTE.Ctipo);
                                } else {
                                    GrabarComandancia(tcaroperacion, garante, objGarante.GetEstadoSocio().cdetalle, EnumPersonas.GARANTE.Ctipo);
                                }
                            }
                        }
                        if (cesantiaDeudor) {
                            GrabarIsspol(tcaroperacion, deudor, objDeudor.GetEstadoSocio().cdetalle, EnumPersonas.DEUDOR.Ctipo);
                        } else {
                            GrabarBancos(rq, tcaroperacion, deudor, objDeudor.GetEstadoSocio().cdetalle, EnumPersonas.DEUDOR.Ctipo);
                        }
                    } else {
                        GrabarBancos(rq, tcaroperacion, deudor, objDeudor.GetEstadoSocio().cdetalle, EnumPersonas.DEUDOR.Ctipo);
                    }
                } else {
                    if (cesantiaDeudor) {
                        GrabarIsspol(tcaroperacion, deudor, objDeudor.GetEstadoSocio().cdetalle, EnumPersonas.DEUDOR.Ctipo);
                    } else {
                        if (diasvencido >= diasvencidodescuento && existegarante) {
                            if (objGarante.GetEstadoSocio().cdetalle.Equals(EnumSocio.ACTIVO.Cestatus)) {
                                GrabarComandancia(tcaroperacion, garante, objGarante.GetEstadoSocio().cdetalle, EnumPersonas.GARANTE.Ctipo);
                            } else {
                                if (cesantiaGarante) {
                                    GrabarIsspol(tcaroperacion, garante, objGarante.GetEstadoSocio().cdetalle, EnumPersonas.GARANTE.Ctipo);
                                } else {
                                    GrabarComandancia(tcaroperacion, garante, objGarante.GetEstadoSocio().cdetalle, EnumPersonas.GARANTE.Ctipo);
                                }
                            }
                        }
                        GrabarComandancia(tcaroperacion, deudor, objDeudor.GetEstadoSocio().cdetalle, EnumPersonas.DEUDOR.Ctipo);
                    }
                }
            }
        }

        /// <summary>
        /// Consulta saldo de la operacion a la fecha determinada
        /// </summary>
        private decimal Saldo(Operacion operacion, int? fcobro)
        {
            int pcobro = Constantes.GetParticion((int)fcobro);
            Saldo saldo = new Saldo(operacion, (int)fcobro);
            decimal totaldeuda = saldo.Totalpendientepago;
            if (saldo.Cxp > 0) {
                totaldeuda = totaldeuda - saldo.Cxp;
            }
            if (totaldeuda < 0) {
                totaldeuda = 0;
            }

            // Detalle de deuda
            if (totaldeuda > 0) {
                List<tcaroperacioncuota> lcuotas = saldo.GetCuotasVencidas();
                foreach (tcaroperacioncuota cuota in lcuotas) {
                    int pvencimiento = Constantes.GetParticion((int)cuota.fvencimiento);
                    if (pcobro > pvencimiento) {
                        this.Adionarubro(cuota, pcobro, true);
                    } else {
                        this.Adionarubro(cuota, pcobro, false);
                    }
                }
                if (saldo.Cxp > 0) {
                    tcardescuentosrubros dr = new tcardescuentosrubros {
                        Esnuevo = true,
                        particion = pcobro,
                        coperacion = operacion.Coperacion,
                        csaldo = EnumSaldos.CUENTAXPAGAR.GetCsaldo(),
                        numcuota = 0,
                        vencido = false,
                        monto = saldo.Cxp * (-1)
                    };
                    if (!this.simulacion) {
                        Sessionef.Grabar(dr);
                    }
                }
            }

            diasvencido = saldo.GetDiasMorosidad();
            cuotasvencido = int.Parse(saldo.GetCuotasVencidas().Count.ToString());
            return totaldeuda;
        }

        /// <summary>
        /// Adiciona valores pendientes de pago por rubro.
        /// </summary>
        private void Adionarubro(tcaroperacioncuota cuota, int particioncobro, bool vencido)
        {
            List<tcaroperacionrubro> lrubros = cuota.GetRubros();
            foreach (tcaroperacionrubro rubro in lrubros) {
                if (rubro.GetPendiente().CompareTo(Decimal.Zero) <= 0) {
                    continue;
                }
                tcardescuentosrubros dr = new tcardescuentosrubros {
                    Esnuevo = true,
                    particion = particioncobro,
                    coperacion = rubro.coperacion,
                    csaldo = rubro.csaldo,
                    numcuota = rubro.numcuota,
                    vencido = vencido,
                    monto = rubro.GetPendiente()
                };
                montoVencido = vencido ? (montoVencido + rubro.GetPendiente()) : (montoVencido);
                if (!this.simulacion) {
                    Sessionef.Grabar(dr);
                }
            }
        }

        /// <summary>
        /// Graba detalle de descuento para la comandancia
        /// </summary>
        private void GrabarComandancia(tcaroperacion tcaroperacion, long cpersona, string estadosocio, int tipopersona)
        {
            tcardescuentosdetalle objdescuentosdetalle = new tcardescuentosdetalle {
                particion = particion,
                cpersona = cpersona,
                ccompania = tcaroperacion.ccompania,
                coperacion = tcaroperacion.coperacion,
                crelacion = tipopersona,
                archivoinstitucioncodigo = ccatalogo,
                archivoinstituciondetalle = EnumDescuentos.COMANDANCIA.Cinstitucion,
                monto = tipopersona.Equals(EnumPersonas.GARANTE.Ctipo) ? montoVencido : monto,
            };
            if (this.simulacion) {
                if (tipopersona.Equals(EnumPersonas.GARANTE.Ctipo)) {
                    montoDescuento = montoDescuento + montoVencido;
                } else {
                    montoDescuento = montoDescuento + monto;
                }
                objdescuentosdetalle.AddDatos("narchivo", TgenCatalogoDetalleDal.Find(ccatalogo, EnumDescuentos.COMANDANCIA.Cinstitucion).nombre);
                objdescuentosdetalle.AddDatos("npersona", TperPersonaDetalleDal.Find(cpersona, ccompania).nombre);
                objdescuentosdetalle.AddDatos("ntipopersona", TcarRelacionPersonaDal.GetNombre(tipopersona));
                objdescuentosdetalle.AddDatos("nestadosocio", TgenCatalogoDetalleDal.Find(2703, estadosocio).nombre);
                lcond.Add(objdescuentosdetalle);
            } else {
                if (objdescuentosdetalle.monto > Constantes.CERO) {
                    Sessionef.Grabar(objdescuentosdetalle);
                }
            }
        }

        /// <summary>
        /// Graba detalle de descuento para bancos
        /// </summary>
        private void GrabarBancos(RqMantenimiento rq, tcaroperacion tcaroperacion, long cpersona, string estadosocio, int tipopersona)
        {
            tcardescuentosdetalle objdescuentosdetalle = new tcardescuentosdetalle {
                particion = particion,
                cpersona = cpersona,
                ccompania = tcaroperacion.ccompania,
                coperacion = tcaroperacion.coperacion,
                crelacion = tipopersona,
                archivoinstitucioncodigo = ccatalogo,
                archivoinstituciondetalle = EnumDescuentos.BANCOS.Cinstitucion,
                monto = tipopersona.Equals(EnumPersonas.GARANTE.Ctipo) ? montoVencido : monto,
            };

            if (this.simulacion) {
                if (tipopersona.Equals(EnumPersonas.GARANTE.Ctipo)) {
                    montoDescuento = montoDescuento + montoVencido;
                } else {
                    montoDescuento = montoDescuento + monto;
                }
                objdescuentosdetalle.AddDatos("narchivo", TgenCatalogoDetalleDal.Find(ccatalogo, EnumDescuentos.BANCOS.Cinstitucion).nombre);
                objdescuentosdetalle.AddDatos("npersona", TperPersonaDetalleDal.Find(cpersona, ccompania).nombre);
                objdescuentosdetalle.AddDatos("ntipopersona", TcarRelacionPersonaDal.GetNombre(tipopersona));
                objdescuentosdetalle.AddDatos("nestadosocio", TgenCatalogoDetalleDal.Find(2703, estadosocio).nombre);
                lcond.Add(objdescuentosdetalle);
            } else {
                if (objdescuentosdetalle.monto > Constantes.CERO) {
                    Sessionef.Grabar(objdescuentosdetalle);
                }
            }
        }

        /// <summary>
        /// Graba detalle de descuento para ISSPOL
        /// </summary>
        private void GrabarIsspol(tcaroperacion tcaroperacion, long cpersona, string estadosocio, int tipopersona)
        {
            tcardescuentosdetalle objdescuentosdetalle = new tcardescuentosdetalle {
                particion = particion,
                cpersona = cpersona,
                ccompania = tcaroperacion.ccompania,
                coperacion = tcaroperacion.coperacion,
                crelacion = tipopersona,
                archivoinstitucioncodigo = ccatalogo,
                archivoinstituciondetalle = EnumDescuentos.ISSPOL.Cinstitucion,
                monto = tipopersona.Equals(EnumPersonas.GARANTE.Ctipo) ? montoVencido : monto,
            };
            if (this.simulacion) {
                if (tipopersona.Equals(EnumPersonas.GARANTE.Ctipo)) {
                    montoDescuento = montoDescuento + montoVencido;
                } else {
                    montoDescuento = montoDescuento + monto;
                }
                objdescuentosdetalle.AddDatos("narchivo", TgenCatalogoDetalleDal.Find(ccatalogo, EnumDescuentos.ISSPOL.Cinstitucion).nombre);
                objdescuentosdetalle.AddDatos("npersona", TperPersonaDetalleDal.Find(cpersona, ccompania).nombre);
                objdescuentosdetalle.AddDatos("ntipopersona", TcarRelacionPersonaDal.GetNombre(tipopersona));
                objdescuentosdetalle.AddDatos("nestadosocio", TgenCatalogoDetalleDal.Find(2703, estadosocio).nombre);
                lcond.Add(objdescuentosdetalle);
            } else {
                if (objdescuentosdetalle.monto > Constantes.CERO) {
                    Sessionef.Grabar(objdescuentosdetalle);
                }
            }
        }

    }
}
