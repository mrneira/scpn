using amortizacion.dto;
using dal.generales;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.enums;

namespace amortizacion.helper {

    /// <summary>
    /// Clase utilitaria que contiene logica de negocio comun utiliza en al generacion de tablas de amortizacion.
    /// </summary>
    public abstract class Tabla : TablaHelper {


        public decimal interestotalcuota = 0;

        public List<Cuota> cuotas = new List<Cuota>();

        public abstract List<Cuota> Generar(Parametros parametros);


        /// <summary>
        /// Calcula valor de cuota de saldos tipo accrual.
        /// </summary>
        /// <param name="parametros">Parametros utilizados en la generacion de la tabla de pagos. Ejemplo, lista de tasas, cargos, valor cuota, cpaital, numero de cuotas, fecha de inicio de pagos etc.</param>
        /// <param name="monto">Monto base sobre el cual se calcula el accrual de la cuota.</param>
        /// <param name="acumular">True or False para acumular</param>
        public void CalculaAccrual(Parametros parametros, decimal monto, Boolean acumular)
        {
            List<Tasas> ltasas = parametros.Tasas;
            foreach (Tasas tasas in ltasas) {
                if (tasas.GetTasa() <= 0) {
                    continue;
                }

                // los dias cuota se calculan de acuerdo a la base de calculo.
                interestotalcuota = interestotalcuota + (tasas.Calcular(tasas, monto, diascuota, parametros, acumular));
            }
        }

        protected void CalculaAccrualDias(Parametros parametros, decimal monto, int diasinteres, Boolean acumular)
        {
            List<Tasas> ltasas = parametros.Tasas;
            foreach (Tasas tasas in ltasas) {
                if (tasas.GetTasa() <= Constantes.CERO) {
                    continue;
                }
                // los dias cuota se calculan de acuerdo a la base de calculo.
                decimal interesajuste = tasas.Calcular(tasas, monto, diasinteres, parametros, acumular);
                tasas.SetInteresajuste(interesajuste);
            }
        }

        /// <summary>
        /// Crea una cuota y los rubros asociadas a ella.
        /// </summary>
        /// <param name="parametros">Parametros utilizados en la generacion de la tabla de pagos. Ejemplo, lista de tasas, cargos, valor cuota, cpaital, numero de cuotas, fecha de inicio de pagos etc.</param>
        /// <param name="numcuota">Numero de cuota a crear.</param>
        /// <param name="capital">Valor de capital de la cuota.</param>
        /// <param name="capitalreducido">Capital reducido de la cuota.</param>
        /// <param name="intereses">true, indica que adiciona rubros de interes a la cuota.</param>
        /// <param name="cargos">true, indica que adiciona rubros tipo cargo a la cuota.</param>
        public void Adicionacuota(Parametros parametros, int numcuota, decimal capital, decimal capitalreducido,
                Boolean intereses, Boolean cargos)
        {
            Cuota cuota = new Cuota(numcuota);
            // En la cuota se almacena los dias reales no los dias de la base de calculo, con este valor se calcula el accrual diario.
            cuota.Dias = diascuota;
            cuota.Diasreales = diasreales;
            cuota.Capitalreducido = capitalreducido;
            cuota.Finicio = (int)finicio;
            cuota.Fvencimiento = (int)fvencimiento;

            // adiciona valores de intereses, comisiones, seguros, cargos, que se caluclan con capital y tasa.
            Tabla.Adicionarubrosprovision(parametros.Tasas, cuota, capital, intereses);
            // adiciona valores fijos de imuestos, cargos, comiiones, seguros etc, que se asocian a la cuota.
            if (cargos)
            {
                Tabla.Adicionacargos(parametros.Cargos, cuota);
            }
            // adiciona una cuota a la tabla de amortizacion.
            cuotas.Add(cuota);
        }

        private static void Adicionarubrosprovision(List<Tasas> ltasas, Cuota cuota, decimal capital, Boolean intereses)
        {
            Boolean first = true;

            foreach (Tasas obj in ltasas)
            {
                if (first && (capital >= Constantes.CERO))
                {
                    // Va el capital con cero para el calculod e provisiones ejemplo tabla de interes.
                    // Adiciona categoria de capital de la cuota.
                    CuotaRubro cr = new CuotaRubro(obj.GetCsaldocapital(), capital);
                    cuota.AddCuotaRubro(cr);
                }
                first = false;
                // Adiciona categorias de interes de la cuota.
                if (intereses && (obj.GetValorcuota() > Constantes.CERO))
                {
                    CuotaRubro cr = new CuotaRubro(obj.GetCsaldo(), obj.GetValorcuota());
                    cr.Interesdeudor = obj.GetInteresdeudor();
                    cr.Tasa = obj.GetTasa();
                    cr.Montotasa = obj.GetMontotasa();
                    cr.Saldoaccrual = (decimal)(obj.GetInteresinicial() + obj.GetInteresajuste());
                    // encera el valor del interes hasta la fecha de reajuste, cuando llega un valor de interes a distribuir en las cuotas.
                    obj.SetInteresinicial(Constantes.CERO);
                    obj.SetInteresajuste(Constantes.CERO);
                    cr.Tasadia = obj.GetTasadia();
                    cuota.AddCuotaRubro(cr);
                }
            }
        }

        private static void Adicionacargos(List<Cargos> lcargos, Cuota cuota)
        {
            foreach (Cargos obj in lcargos)
            {
                // Adiciona categorias de valores fijos a la cuota.
                CuotaRubro cr = new CuotaRubro(obj.Csaldo, obj.Valor);
                cuota.AddCuotaRubro(cr);
            }
        }

        /// <summary>
        /// Entrega el valor de: cuotas
        /// </summary>
        /// <returns>List Cuota </returns>
        public List<Cuota> GetCuotas()
        {
            return cuotas;
        }

        /// <summary>
        /// Adiciona rubros a la tabla de pagos resultado de un arreglo de pagos.
        /// </summary>
        /// <param name="parametros">Objeto que contiene parametros con los que se genera la tabla de amortizacion.</param>
        public void AdicionaRubrosArregloPagos(Parametros parametros)
        {
            if (parametros.Marreglopago == null)
            {
                return;
            }
            int numcuotas = (int)parametros.Numerocuotas;
            foreach (String csaldo in parametros.Marreglopago.Keys)
            {
                decimal monto = parametros.Marreglopago[csaldo];
                this.AdicionarArregloPagosPorCuota(parametros, csaldo, monto, numcuotas);
            }
        }

        /// <summary>
        /// Adiciona rubros de arreglo de pagos por cuota.
        /// </summary>
        /// <param name="parametros">Objeto que contiene parametros con los que se genera la tabla de amortizacion.</param>
        /// <param name="csaldo">Codigo de saldo a adicionar como rubro de la tabla de pagos.</param>
        /// <param name="monto">Monto total a distribuir en las cuotas de la tabla de pagos.</param>
        /// <param name="numcuotas">Numero de cuotas de la tabla de pagos.</param>
        private void AdicionarArregloPagosPorCuota(Parametros parametros, String csaldo, decimal monto, int numcuotas)
        {
            decimal montoCuota = (decimal)Math.Round(((double)monto / numcuotas), TgenMonedaDal.GetDecimales(parametros.Cmoneda), MidpointRounding.AwayFromZero);
            decimal montoUltimaCuota = Math.Round(montoCuota * (new decimal(numcuotas)), TgenMonedaDal.GetDecimales(parametros.Cmoneda), MidpointRounding.AwayFromZero);

            decimal diferenia = monto - montoUltimaCuota;
            foreach (Cuota cuota in cuotas)
            {
                if (cuota.Numero.CompareTo(numcuotas) == 0)
                {
                    montoCuota = montoCuota + diferenia;
                }
                // Adiciona categorias de valores fijos a la cuota.
                CuotaRubro cr = new CuotaRubro(csaldo, montoCuota);
                cuota.AddCuotaRubro(cr);
            }
        }

        /// <summary>
        /// Adiciona rubros a la tabla de pagos de cuentas por cobrar.
        /// </summary>
        /// <param name="parametros">Objeto que contiene parametros con los que se genera la tabla de amortizacion.</param>
        public void AdicionaRubrosCxC(Parametros parametros)
        {
            int numcuotainicial = cuotas.First().Numero;
            foreach (CuentasPorCobrar cxc in parametros.CuentasporCobrar)
            {
                if (numcuotainicial > cxc.Numcuota)
                {
                    continue;
                }
                Cuota cuota = cuotas.Find(x => x.Numero == cxc.Numcuota);
                if (cuota == null)
                {
                    Cuota ultimacuota = cuotas.Last();
                    CuotaRubro rubro = ultimacuota.GetCuotarubros().Find(x => x.Csaldo == cxc.Csaldo) ?? null;
                    if (rubro == null)
                    {
                        cuota = ultimacuota;
                    }
                    else
                    {
                        rubro.Valor = decimal.Add(rubro.Valor, cxc.Valor);
                    }
                }
                if (cuota != null)
                {
                    AdicionaCxC(cxc, cuota);
                }
            }
        }

        /// <summary>
        /// Adiciona cuentas por cobrar a la cuota.
        /// </summary>
        private static void AdicionaCxC(CuentasPorCobrar cxc, Cuota cuota)
        {
            // Adiciona cuentas por cobrar a la cuota.
            CuotaRubro cr = new CuotaRubro(cxc.Csaldo, cxc.Valor);
            cuota.AddCuotaRubro(cr);
        }

    }

}
