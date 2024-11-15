using amortizacion.helper;
using amortizacion.dto;
using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using dal.generales;
using dal.monetario;
using general.util;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using cartera.contabilidad;
using System.Linq;
using util.enums;
using System.Reflection;
using System.Collections;

namespace cartera.comp.mantenimiento.util {

    /// <summary>
    /// Clase que se se encarga de generar una tabla de pagos de una operacion de credito.
    /// </summary>
    public class TablaPagos : ComponenteMantenimiento {

        /// <summary>
        /// Referencia al objeto que alamce informacion de una operacion de cartera.
        /// </summary>
        private tcaroperacion tcaroperacion;

        /// <summary>
        /// Objeto que contien informacion de una operacion de cartera con la cual se esta ejecutando una transaccion.
        /// </summary>
        private Operacion operacion;

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tcaroperacion = operacion.tcaroperacion;
            GenerarTabla(rqmantenimiento);
        }

        /// <summary>
        /// Metodo que se encarga de generar la tabla de pagos asociada a la solicitud.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con los datos de entrada.</param>
        private void GenerarTabla(RqMantenimiento rqmantenimiento)
        {
            Parametros p = GetParametrosTabla(rqmantenimiento);
            amortizacion.helper.Tabla t = TablaHelper
                .GetInstancia(TcarTipoTablaAmortizacionDal.Find((int)tcaroperacion.ctabla).clase);
            List<amortizacion.dto.Cuota> lcuota = t.Generar(p);
            tcaroperacion.plazo = t.GetPlazo();
            tcaroperacion.fvencimiento = t.GetFvencimiento();
            // valida cuando se ingresa el valor de cuota a pagar, no aplica para cesantía 
            //if (tcaroperacion.numerocuotas == null) {
            //    tcaroperacion.numerocuotas = p.Numerocuotas;
            //}
            tcaroperacion.numerocuotas = p.Numerocuotas;
            if ((tcaroperacion.ctabla == 1) && (tcaroperacion.valorcuota == null))
            {
                tcaroperacion.valorcuota = p.Valorcuota;
            }
            CuotasToTablaCartera(rqmantenimiento, lcuota);
        }

        /// <summary>
        /// Entrega un objeto con los parametros requeridos para generar una tabla de pagos.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con los datos de entrada.</param>
        /// <returns></returns>
        private Parametros GetParametrosTabla(RqMantenimiento rqmantenimiento)
        {
            Parametros p = new Parametros();
            p.Monto = tcaroperacion.monto;
            p.Numerocuotas = tcaroperacion.numerocuotas;
            // Si tiene valor de cuota fija la tabla se genera con este valor de cuota.
            p.Valorcuota = tcaroperacion.valorcuota;
            if (tcaroperacion.cuotainicio == null)
            {
                tcaroperacion.cuotainicio = 1;
            }
            if (tcaroperacion.cuotasgracia != null && tcaroperacion.cuotasgracia > 0)
            {
                p.Cuotasgracia = tcaroperacion.cuotasgracia;
            }
            p.Cuotainicio = tcaroperacion.cuotainicio;
            p.Diapago = tcaroperacion.diapago;
            p.Cfrecuencia = tcaroperacion.cfrecuecia;
            p.Diasfrecuencia = TgenFrecuenciaDal.Find((int)p.Cfrecuencia).dias;
            p.Cmoneda = tcaroperacion.cmoneda;
            p.Basedecalculo = BaseDeCalculo.GetBaseDeCalculo(tcaroperacion.cbasecalculo);
            // Si la solicitud no tiene una fecha de generacion de la tabla, se genera con la fecha contable.
            p.Fgeneraciontabla = tcaroperacion.fgeneraciontabla;
            if (p.Fgeneraciontabla == null)
            {
                p.Fgeneraciontabla = rqmantenimiento.Fconatable;
            }
            if (tcaroperacion.finiciopagos != null)
            {
                p.Finiciopagos = tcaroperacion.finiciopagos;
            }
            p.DiascuotaIndependiente = TcarParametrosDal.GetInteger("DIAS-CUOTA-INDEPENDIENTE", rqmantenimiento.Ccompania);
            p.DiaCuotaMesSiguiente = tcaroperacion.cuotainicio.Equals(Constantes.UNO) ? TcarParametrosDal.GetInteger("DIA-CUOTA-MES", rqmantenimiento.Ccompania) : tcaroperacion.diapago;
            // Lista de tasas con las que se genera la tabla.
            p.Tasas = GetTasas(rqmantenimiento, p.Basedecalculo, (decimal)p.Monto);
            p.Cargos = GetCargos(rqmantenimiento);
            p.CuentasporCobrar = GetCuentasPorCobrar();
            p.Mesnogeneracuota = tcaroperacion.mesnogeneracuota;

            // Rubros de arreglo de pago a adicionar a la tabla.
            if (rqmantenimiento.GetDatos("MSALDOS-ARREGLO-PAGOS-TABLA") != null)
            {
                p.Marreglopago = (Dictionary<string, decimal>)rqmantenimiento.GetDatos("MSALDOS-ARREGLO-PAGOS-TABLA");
            }
            return p;
        }

        /// <summary>
        /// Lista de tasas con las que se genera la tbala de amortizacion.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="basecalculo">Base de calculo utilizada para generar la tabla de pagos.</param>
        /// <param name="monto">Monto sobre el cual se genera la tabla de amortizacion, se utiliza para verificar si genera feci en la tabla de amortizacion.</param>
        /// <returns></returns>
        private List<Tasas> GetTasas(RqMantenimiento rqmantenimiento, BaseDeCalculo basecalculo, decimal monto)
        {
            //
            List<tcaroperaciontasa> ltasas = null;
            if (rqmantenimiento.GetTabla("TCAROPERACIONTASA") != null)
            {
                ltasas = rqmantenimiento.GetTabla("TCAROPERACIONTASA").Lregistros.Cast<tcaroperaciontasa>().ToList();
            }
            if ((ltasas == null) && (rqmantenimiento.GetDatos("TCAROPERACIONTASA-ARREGLO-PAGO") != null))
            {
                ltasas = (List<tcaroperaciontasa>)rqmantenimiento.GetDatos("TCAROPERACIONTASA-ARREGLO-PAGO");
            }
            if (ltasas == null)
            {
                ltasas = TcarOperacionTasaDal.Find(tcaroperacion.coperacion).Cast<tcaroperaciontasa>().ToList();
            }

            List<Tasas> lt = new List<Tasas>();

            foreach (tcaroperaciontasa tcaroperaciontasa in ltasas)
            {
                if (tcaroperaciontasa.csaldo.Equals("FECI") && (monto.CompareTo("5000") <= 5000))
                {
                    // elimina registro de FECI de la base para no considerarlo en la vida de la operacion.
                    continue;
                }
                Tasas tasa = new Tasas();
                tasa.SetCsaldo(tcaroperaciontasa.csaldo);
                tasa.SetCsaldocapital(EnumSaldos.CAPITAL.GetCsaldo());
                tasa.SetTasa(tcaroperaciontasa.tasa);
                AccrualHelper ah = new AccrualHelper(basecalculo);
                tasa.SetTasadia(ah.GetTasadiaria(tasa.GetTasa()));
                lt.Add(tasa);
            }
            return lt;
        }

        /// <summary>
        /// Lista de cargos que se adiciona a la tabla de amortizacion.
        /// </summary>
        /// <returns></returns>
        private List<Cargos> GetCargos(RqMantenimiento rqmantenimiento)
        {
            List<tcaroperacioncargostabla> lcargostabla = null;
            if ((rqmantenimiento.GetDatos("TCAROPERACIONCARGOSTABLA-ARREGLO-PAGO") != null))
            {
                lcargostabla = (List<tcaroperacioncargostabla>)rqmantenimiento.GetDatos("TCAROPERACIONCARGOSTABLA-ARREGLO-PAGO");
            }
            if (lcargostabla == null)
            {
                lcargostabla = TcarOperacionCargosTablaDal.Find(tcaroperacion.coperacion);
            }

            List<Cargos> lc = new List<Cargos>();
            Dictionary<string, decimal> maux = new Dictionary<string, decimal>();

            // Valida solo para operaciones originales
            if (!tcaroperacion.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL))
            {
                return lc;
            }

            // acumula valores por tipo de saldo.
            foreach (tcaroperacioncargostabla obj in lcargostabla)
            {
                if (obj.monto == null || obj.monto <= Constantes.CERO)
                {
                    continue;
                }
                decimal val = !maux.ContainsKey(obj.csaldo) ? Constantes.CERO : maux[obj.csaldo];
                val = decimal.Add(val, (decimal)obj.monto);
                maux[obj.csaldo] = val;
            }
            foreach (KeyValuePair<string, decimal> key in maux)
            {
                Cargos c = new Cargos();
                c.Csaldo = key.Key;
                c.Valor = key.Value;
                lc.Add(c);
            }
            return lc;
        }

        /// <summary>
        /// Lista de cuentas por cobrar que se adiciona a la tabla de amortizacion.
        /// </summary>
        /// <returns></returns>
        private List<CuentasPorCobrar> GetCuentasPorCobrar()
        {
            List<CuentasPorCobrar> lcxc = new List<CuentasPorCobrar>();
            foreach (tcaroperacioncxc obj in operacion.LCuentasPorCobrar)
            {
                CuentasPorCobrar c = new CuentasPorCobrar();
                c.Csaldo = obj.csaldo;
                c.Numcuota = obj.numcuota;
                c.Valor = (decimal)obj.monto;
                lcxc.Add(c);
            }
            return lcxc;
        }

        /// <summary>
        /// Adiciona al request la tabla de pagos para que que esta esta disponible para almacenar en la base de datos.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con los datos de entrada.</param>
        /// <param name="lcuotasgeneral">Lista de cuotas a transformas en cuotas de la solcitud.</param>
        private void CuotasToTablaCartera(RqMantenimiento rqmantenimiento, List<amortizacion.dto.Cuota> lcuotasgeneral)
        {
            List<tcaroperacioncuota> lcuotas = new List<tcaroperacioncuota>();
            List<tcaroperacionrubro> lrubros = new List<tcaroperacionrubro>();
            List<tcaroperacioncxc> lcxc = new List<tcaroperacioncxc>();
            string coperacion = tcaroperacion.coperacion;
            decimal? montopagoextraordinario = rqmantenimiento.GetDecimal("__montopagoextraordinario");
            foreach (amortizacion.dto.Cuota cuota in lcuotasgeneral)
            {
                LlenarTcarOperacionCuota(rqmantenimiento, cuota, lcuotas, lrubros, lcxc, coperacion, montopagoextraordinario);
                montopagoextraordinario = null;
            }
            //Prorrateo de rubros vencidos (NEGOCIACIÓN DE PAGO)
            if ((rqmantenimiento.GetDatos("CODMODULOORIGEN") != null && rqmantenimiento.GetDatos("CODTRANSACCIONORIGEN") != null && long.Parse(rqmantenimiento.GetDatos("CODMODULOORIGEN").ToString()) == 7 && long.Parse(rqmantenimiento.GetDatos("CODTRANSACCIONORIGEN").ToString()) == 52 && ((lcuotas.Count +1) - long.Parse(rqmantenimiento.GetDatos("prorrateo").ToString())) != lcuotas.Count) || (!tcaroperacion.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion) && tcaroperacion.numcuotaprorrateo != null && ((tcaroperacion.numerocuotas + 1) - tcaroperacion.numcuotaprorrateo) != tcaroperacion.numerocuotas))
            {
                IDictionary rubrosarreglopago = (IDictionary)rqmantenimiento.GetDatos("MSALDOS-ARREGLO-PAGOS-TABLA");
                //Encerar rubros vencidos a prorrateados
                foreach (tcaroperacioncuota cuo in lcuotas)
                {
                    foreach (tcaroperacionrubro rub in cuo.GetRubros())
                    {
                        foreach (object key in rubrosarreglopago.Keys)
                        {
                            if (rub.csaldo.Equals(key))
                            {
                                rub.saldo = 0;
                                rub.valorcuota = 0;
                                break;
                            }
                        }
                    }
                }
                //Realizar prorrateo
                List<tcaroperacionrubro> rubrosprorrateo = new List<tcaroperacionrubro>();
                long prorrateo = (rqmantenimiento.GetDatos("prorrateo") != null) ? long.Parse(rqmantenimiento.GetDatos("prorrateo").ToString()) : (long)tcaroperacion.numcuotaprorrateo;
                for (int i = ((int)prorrateo-1); i < lcuotas.Count; i++)
                {
                    foreach (object key in rubrosarreglopago.Keys)
                    {
                        decimal valorprorrateo = decimal.Round((decimal)rubrosarreglopago[key] / (lcuotas.Count - prorrateo + 1), 2);
                        foreach (tcaroperacionrubro rub in lcuotas[i].GetRubros())
                        {
                            if (rub.csaldo.Equals(key))
                            {
                                bool existRubro = false;
                                foreach (tcaroperacionrubro r in rubrosprorrateo)
                                {
                                    if (r.csaldo == rub.csaldo)
                                    {
                                        decimal total = (decimal)r.valorcuota + valorprorrateo;
                                        if((i+1) == lcuotas.Count)
                                        {
                                            if (total != (decimal)rubrosarreglopago[key])
                                            {
                                                total = total - valorprorrateo;
                                                rub.saldo = decimal.Round(((decimal)rubrosarreglopago[key]) - total, 2);
                                                rub.valorcuota = decimal.Round((((decimal)rubrosarreglopago[key]) - total), 2);
                                                total = total + (decimal)rub.valorcuota;
                                            }
                                            else
                                            {
                                                rub.saldo = valorprorrateo;
                                                rub.valorcuota = valorprorrateo;
                                            }
                                        }
                                        else
                                        {
                                            rub.saldo = valorprorrateo;
                                            rub.valorcuota = valorprorrateo;
                                        }
                                        r.valorcuota = total;
                                        existRubro = true;
                                        break;
                                    }
                                }
                                if (!existRubro)
                                {
                                    tcaroperacionrubro help = new tcaroperacionrubro();
                                    help.csaldo = rub.csaldo;
                                    help.valorcuota = valorprorrateo;
                                    rub.saldo = valorprorrateo;
                                    rub.valorcuota = valorprorrateo;
                                    rubrosprorrateo.Add(help);
                                }
                                break;
                            }
                        }
                    }
                }
                operacion.Lcuotas = lcuotas;
            }
            else
            {
                operacion.Lcuotas = lcuotas;
            }
            // Adiciona cabecera de la tabla para que el motor de mantenimiento lo envie a la base.
            rqmantenimiento.AdicionarTabla(typeof(tcaroperacioncuota).Name.ToUpper(), lcuotas, false);
            // Adiciona rubros de la tabla de pagos para que el motor de mantenimiento lo envie a la base.
            rqmantenimiento.AdicionarTabla(typeof(tcaroperacionrubro).Name.ToUpper(), lrubros, false);
            // Adiciona cuentas por cobrar para que el motor de mantenimiento lo envie a la base.
            if (lcxc.Count > 0)
            {
                rqmantenimiento.AdicionarTabla(typeof(tcaroperacioncxc).Name.ToUpper(), lcxc, false);
            }

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con los datos de entrada.</param>
        /// <param name="cuota">Objeto que contiene los datos de una cuota general a transformar en cuota de una operacion.</param>
        /// <param name="ltabla">Lista que almacena cabecera de una tabla de pagos de una operacion de cartera.</param>
        /// <param name="lrubro">Lista que almacena los rubros de la tabla de pagos de una operacion.</param>
        /// <param name="lcxc">Lista que almacena las cuentas por cobrar de una operacion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="montopagoextraordinario">Valor del abono a capital o pago exraordinario que se asocia a la primera cuota.</param>
        private void LlenarTcarOperacionCuota(RqMantenimiento rqmantenimiento, amortizacion.dto.Cuota cuota, List<tcaroperacioncuota> ltabla,
                List<tcaroperacionrubro> lrubro, List<tcaroperacioncxc> lcxc, string coperacion, decimal? montopagoextraordinario)
        {
            tcaroperacioncuota obj = new tcaroperacioncuota();
            obj.coperacion = coperacion;
            obj.numcuota = cuota.Numero;
            obj.fvigencia = rqmantenimiento.Fproceso;
            obj.cestatus = EnumEstatus.VIGENTE.Cestatus;
            obj.ctipocredito = tcaroperacion.ctipocredito;
            obj.cestadooperacion = tcaroperacion.cestadooperacion;
            obj.csegmento = tcaroperacion.csegmento;
            obj.cbanda = 1; // el definitivo se llena cuando crea un rubro en los perfiles conatbles ver this.llenarTcaroperacionRubro.
            obj.dias = cuota.Dias;
            obj.diasreales = cuota.Diasreales;
            obj.finicio = cuota.Finicio;
            obj.fvencimiento = cuota.Fvencimiento;
            obj.capitalreducido = cuota.Capitalreducido;
            obj.interesdeudor = cuota.Interesdeudor;
            obj.pagoextraordinario = montopagoextraordinario;
            ltabla.Add(obj);
            List<tcaroperacionrubro> lrubrosporcuota = LlenarTcaroperacionRubro(rqmantenimiento, cuota, obj, lrubro, lcxc, coperacion);
            obj.SetRubros(lrubrosporcuota);
        }

        /// <summary>
        /// Transforma los rubros de una cuota perteneciente a una tabla de pagos a rubros de una operacion por cuota.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con los datos de entrada.</param>
        /// <param name="cuota"></param>
        /// <param name="operacioncuota">Objeto que contiene los datos de una cuota general a transformar en cuota de una operacion.</param>
        /// <param name="ltablarubro">Lista que almacena los rubros de la tabla de pagos de una operacion.</param>
        /// <param name="lcxcrubro">Lista que almacena las cuentas por cobrar de una operacion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        private List<tcaroperacionrubro> LlenarTcaroperacionRubro(RqMantenimiento rqmantenimiento, amortizacion.dto.Cuota cuota,
                tcaroperacioncuota operacioncuota, List<tcaroperacionrubro> ltablarubro, List<tcaroperacioncxc> lcxcrubro, string coperacion)
        {
            List<CuotaRubro> lcuotarubro = cuota.GetCuotarubros();
            List<tcaroperacionrubro> lrubrosporcuota = new List<tcaroperacionrubro>();
            foreach (CuotaRubro cuotaRubro in lcuotarubro)
            {
                // Definicion del codigo de saldo asociado al rubro.
                tmonsaldo tmonsaldo = TmonSaldoDal.Find(cuotaRubro.Csaldo);
                tcaroperacionrubro obj = new tcaroperacionrubro();
                obj.coperacion = coperacion;
                obj.numcuota = cuota.Numero;
                obj.csaldo = cuotaRubro.Csaldo;
                obj.fvigencia = rqmantenimiento.Fproceso;
                obj.valorcuota = cuotaRubro.Valor;
                obj.interesdeudor = cuotaRubro.Interesdeudor;
                obj.esaccrual = tmonsaldo.esaccrual;
                obj.montoparaaccrual = cuotaRubro.Montotasa;
                // valor del accrual diario.
                if ((tmonsaldo.esaccrual != null) && ((bool)tmonsaldo.esaccrual))
                {
                    obj.accrual = Math.Round((cuotaRubro.Valor / new decimal(cuota.Diasreales)), 7, MidpointRounding.AwayFromZero);
                    obj.saldo = cuotaRubro.Saldoaccrual;
                }
                else
                {
                    obj.accrual = Constantes.CERO;
                    obj.saldo = obj.valorcuota;
                }
                obj.cobrado = Constantes.CERO;
                obj.tasa = cuotaRubro.Tasa;
                obj.tasadia = cuotaRubro.Tasadia;// Esto sirve cuando se trabaja con capitalizacion de interes.
                obj.descuento = Constantes.CERO;
                obj.accrualotrosanios = Constantes.CERO;

                // Cuentas por cobrar
                if (EnumTipoSaldo.EsCxC(tmonsaldo.ctiposaldo))
                {
                    LlenarTcarOperacionCxC(rqmantenimiento, cuota, cuotaRubro, lcxcrubro, coperacion);
                }

                ltablarubro.Add(obj);
                lrubrosporcuota.Add(obj);

            }
            return lrubrosporcuota;
        }

        /// <summary>
        /// Crea cuentas por pagar de operacion
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con los datos de entrada.</param>
        /// <param name="cuota">Objeto que contiene los datos de una cuota general a transformar en cuota de una operacion.</param>
        /// <param name="lcxc">Lista que almacena las cuentas por cobrar de una operacion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        private void LlenarTcarOperacionCxC(RqMantenimiento rqmantenimiento, amortizacion.dto.Cuota cuota, amortizacion.dto.CuotaRubro cuotarubro, List<tcaroperacioncxc> lcxc, string coperacion)
        {
            tcaroperacioncxc obj = new tcaroperacioncxc();
            obj.coperacion = coperacion;
            obj.numcuota = cuota.Numero;
            obj.csaldo = cuotarubro.Csaldo;
            obj.fvigencia = rqmantenimiento.Fproceso;
            obj.monto = cuotarubro.Valor;
            obj.mensaje = rqmantenimiento.Mensaje;

            lcxc.Add(obj);
        }

    }
}