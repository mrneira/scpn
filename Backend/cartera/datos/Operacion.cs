using amortizacion.dto;
using amortizacion.helper;
using cartera.accrual;
using cartera.enums;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using dal.generales;
using modelo;
using modelo.interfaces;
using monetario.util;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.datos {

    /// <summary>
    /// Clase que se encarga de manejar una operacion de cartera.<br>
    /// Ejemplo actualizar saldos de cuotas, generar tablas de amortizacion, calculo de accruales.
    /// </summary>
    public class Operacion {

        /// <summary>
        /// Numero de operacion de cartera.
        /// </summary>
        private string coperacion;
        /// <summary>
        /// Objeto que almacena informacion de una operacion de cartera.
        /// </summary>
        internal tcaroperacion tcaroperacion;
        /// <summary>
        /// Lista de cuotas asociadas a una operacion.
        /// </summary>
        private List<tcaroperacioncuota> lcuotas;

        /// Lista de cuentas por cobrar asociadas a una operacion.
        /// </summary>
        private List<tcaroperacioncxc> lcuentasporcobrar;

        /// <summary>
        /// Crea una instancia de Operacion.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que almacena datos de una operacion de cartera.</param>
        public Operacion(tcaroperacion tcaroperacion)
        {
            this.tcaroperacion = tcaroperacion;
        }

        public string Coperacion { get => coperacion; set => coperacion = value; }
        public tcaroperacion Tcaroperacion { get => tcaroperacion; set => tcaroperacion = value; }

        public List<tcaroperacioncuota> Lcuotas { get { return GetLcuotas(); } set => lcuotas = value; }
        public List<tcaroperacioncxc> LCuentasPorCobrar { get { return GetLCuentasPorCobrar(); } set => lcuentasporcobrar = value; }

        /// <summary>
        /// Metodo que se encarga del calculo de accrual diario de mora.
        /// </summary>
        /// <param name="fproceso">fproceso Fecha a la cual se calcula la mora.</param>
        /// <param name="mensaje">Numero de mensaje con el que se crea el accrual.</param>
        /// <param name="csucursal">Codigo de sucursal a obtener la fecha.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        public void CalcularMora(RqMantenimiento rqmantenimiento, int fproceso, string mensaje, int csucursal, int ccompania, bool registrarSaldo)
        {
            if (this.tcaroperacion.cestatus.Equals("APR")) {
                return;
            }
            if (this.lcuotas == null || this.lcuotas.Count <= 0) {
                // Obtiene cuotas de la base.
                this.lcuotas = TcarOperacionCuotaDal.FindNoPagadas(this.coperacion);
            }

            int fcalculo = (int)TgenFechasDal.Find(fproceso, csucursal, ccompania).fcontable;

            int diasgracia = TcarParametrosDal.GetInteger("DIASGRACIAMORA", (int)this.tcaroperacion.ccompania);

            foreach (tcaroperacioncuota cuota in this.lcuotas) {
                int fvencimiento = (int)cuota.fvencimiento;

                if (cuota.fpago != null) {
                    continue;
                }
                if ((Fecha.AdicionaDias365(fvencimiento, diasgracia).CompareTo(fproceso) >= 0)) {
                    break;
                }
                int fcontableDeVencimiento = fvencimiento;
                int dias = Fecha.Resta365(fproceso, fvencimiento);
                if (dias.CompareTo(diasgracia) <= 0) {
                    fcontableDeVencimiento = (int)TgenFechasDal.Find(fvencimiento, csucursal, ccompania).fcontable;
                }

                // Cuotas que vencen en dia laborable se calcula, si vencen sabado o domingo o feriado se calcula el proximo dia laborable.
                if (fvencimiento.CompareTo(fcontableDeVencimiento) != 0 && fproceso.CompareTo(fcalculo) < 0) {
                    break;
                }
                Accrual accual = new Accrual(this.tcaroperacion, cuota);
                accual.Calcular(rqmantenimiento, fproceso, mensaje, registrarSaldo);
            }
        }



        /// <summary>
        /// Metodo que valida si una operacion tiene cuotas vencidas.
        /// </summary>
        /// <param name="fproceso">Fecha a la cual se valida si existe cuotas que ya llegaron a la fecha de vencimiento.</param>
        /// <returns></returns>
        public bool TieneCuotasConVencimientoPasado(int fproceso)
        {
            List<tcaroperacioncuota> l = this.Lcuotas;
            bool exitecuotasvencidas = false;
            foreach (tcaroperacioncuota cuota in l) {
                if (cuota.fvencimiento < fproceso) {
                    exitecuotasvencidas = true;
                    break;
                }
            }
            return exitecuotasvencidas;
        }

        public List<tcaroperacioncuota> GetLcuotas()
        {
            if (this.lcuotas == null) {
                this.lcuotas = TcarOperacionCuotaDal.FindNoPagadas(this.coperacion);
            }
            this.GetLCuentasPorCobrar();
            return this.lcuotas;
        }

        public List<tcaroperacioncxc> GetLCuentasPorCobrar()
        {
            if (this.lcuentasporcobrar == null) {
                this.lcuentasporcobrar = new List<tcaroperacioncxc>();
                List<tcaroperacioncxc> lcxc = TcarOperacionCxCDal.Find(this.coperacion).OrderBy(x => x.numcuota).ToList();
                foreach (tcaroperacioncxc obj in lcxc) {
                    if (obj.fpago != null) {
                        continue;
                    }
                    if (obj.monto == null || obj.monto <= Constantes.CERO) {
                        continue;
                    }
                    this.lcuentasporcobrar.Add(obj);
                }
            }
            return this.lcuentasporcobrar;
        }

    }



}
