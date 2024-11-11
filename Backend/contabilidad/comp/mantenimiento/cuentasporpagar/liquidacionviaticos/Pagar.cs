using bce.util;
using contabilidad.saldo;
using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.contabilidad.cuentasporpagar.liquidacionviaticos;
using dal.facturacionelectronica;
using dal.generales;
using dal.monetario;
using dal.persona;
using dal.talentohumano;
using facturacionelectronica.comp.consulta.entidades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporpagar.liquidacionviaticos
{

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class Pagar : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            List<IBean> ldetalle = new List<IBean>();
            if (rqmantenimiento.GetTabla("tconliquidaciongastos").Lregistros.Count > 0) {
                ldetalle = rqmantenimiento.GetTabla("tconliquidaciongastos").Lregistros;
                rqmantenimiento.Mtablas["tconliquidaciongastos"] = null;
                CompletarAutorizacion(rqmantenimiento, ldetalle);
            }
        }

        /// <summary>
        /// completar autorización
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="ldetalle"></param>
        public static void CompletarAutorizacion(RqMantenimiento rqmantenimiento, List<IBean> ldetalle) {
            //bool autoriza;
            List<tconliquidaciongastos> lliquidacion = new List<tconliquidaciongastos>();
            List<tconcomprobante> lcomprobante = new List<tconcomprobante>();
            List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();
            foreach (tconliquidaciongastos obj in ldetalle) {

                tconliquidaciongastos liq = TconLiquidacionGastosDal.Find(obj.cliquidaciongastos, rqmantenimiento.Ccompania);
                tconcomprobante comprobante = TconComprobanteDal.FindComprobante(obj.ccomprobante);
                List<tconcomprobantedetalle> comprobantedetalle = TconComprobanteDetalleDal.Find(comprobante.ccomprobante, comprobante.fcontable, comprobante.ccompania);
                liq.cusuarioautorizacion = rqmantenimiento.Cusuario;
                liq.fautorizacion = rqmantenimiento.Freal;
                liq.estadocdetalle = "PAGADO";


                bool periodoActivo;
                periodoActivo = TconPeriodoContableDal.ValidarPeriodoContableActivo(Fecha.GetAnio(comprobante.fcontable), String.Format("{0:00}", Fecha.GetMes(comprobante.fcontable)));
                if (!periodoActivo) {
                    rqmantenimiento.Response["mayorizado"] = "ERROR: PERIODO INACTIVO O NO HA SIDO CREADO";
                    throw new AtlasException("CONTA-009", "ERROR: PERIODO INACTIVO O NO HA SIDO CREADO");
                }

                if (comprobante.cuadrado.Value && !comprobante.actualizosaldo.Value) {
                    //mayorización de detalle del asiento contable
                    SaldoHelper sh = new SaldoHelper();
                    sh.Actualizar(rqmantenimiento.Response, comprobante, comprobantedetalle.ToList<IBean>());
                    comprobante.ruteopresupuesto = true;
                    comprobante.aprobadopresupuesto = true;
                    comprobante.actualizosaldo = true;
                    lcomprobante.Add(comprobante);
                    //Actualización de saldos de presupuesto
                    if (comprobante.ruteopresupuesto && comprobante.aprobadopresupuesto) {
                        SaldoPresupuesto.ActualizarSaldoPresupuesto(rqmantenimiento, comprobante, comprobantedetalle.ToList<IBean>());
                    }
                }

                //transaccion spi o pago por bce
                //tthfuncionariodetalle refban;
                //tperreferenciabancaria referenciabancaria = TperReferenciaBancariaDal.Find(liq.cpersona, rqmantenimiento.Ccompania);
                //if (referenciabancaria == null) {
                //    refban = TthFuncionarioDal.FindXCpersona(liq.cpersona);
                //    if (refban == null) {
                //        throw new AtlasException("BPROV-004", "PERSONA NO POSEE REFERENCIA BANCARIA {0}", liq.cpersona);
                //    }
                //}

                

                ttestransaccion ttestransaccion = new ttestransaccion();
                tperpersonadetalle personadetalle = TperPersonaDetalleDal.Find(liq.cpersona, rqmantenimiento.Ccompania);
                ttestransaccion.identificacionbeneficiario = obj.cedula;
                ttestransaccion.nombrebeneficiario = personadetalle.nombre;
                ttestransaccion.numerocuentabeneficiario = obj.numerocuenta;
                ttestransaccion.tipocuentaccatalogo = obj.tipocuentaccatalogo.Value;
                ttestransaccion.tipocuentacdetalle = obj.tipocuentacdetalle;
                ttestransaccion.institucionccatalogo = obj.tipoinstitucionccatalogo.Value;
                ttestransaccion.institucioncdetalle = obj.tipoinstitucioncdetalle;
                ttestransaccion.valorpago = Math.Abs(liq.valorliquidacion);

                GenerarBce.InsertarPagoBce(rqmantenimiento, obj.cedula, personadetalle.nombre, obj.numerocuenta, personadetalle.cpersona,
                    obj.tipocuentaccatalogo.Value, obj.tipocuentacdetalle, obj.tipoinstitucionccatalogo.Value,
                    obj.tipoinstitucioncdetalle, Math.Round(liq.valorliquidacion, 2), liq.cliquidaciongastos.ToString(), null, liq.ccomprobante);


                rqmantenimiento.AdicionarTabla("tconliquidaciongastos", liq, false);
                rqmantenimiento.AdicionarTabla("tconcomprobante", lcomprobante, false);
                //rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", lcomprobantedetalle, false);
                rqmantenimiento.Response["mayorizado"] = "OK";
            }
        }
    }
}

