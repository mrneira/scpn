namespace util.servicios.contable {

    /// <summary>
    /// Clase que se encarga de validar la ecuacion contable.
    /// </summary>
    public class EcuacionContable {
        /// <summary>
        /// Valor acumulado del saldo deudor del comprobante.
        /// </summary>
        private decimal saldodeudor;
        /// <summary>
        /// Valor acumulado del saldo accredor del comprobante.
        /// </summary>
        private decimal saldoacreedor;
        /// <summary>
        /// Valor acumulado del contingente deudor del comprobante.
        /// </summary>
        private decimal c61;
        /// <summary>
        /// Valor acumulado del contingente deudor por el contra del comprobante.
        /// </summary>
        private decimal c62;
        /// <summary>
        /// Valor acumulado del contingente accredor por contra del comprobante.
        /// </summary>
        private decimal c63;
        /// <summary>
        /// Valor acumulado del contingente accredor del comprobante.
        /// </summary>
        private decimal c64;
        /// <summary>
        /// Valor acumulado de orden deudor del comprobante.
        /// </summary>
        private decimal c761;
        /// <summary>
        /// Valor acumulado de orden deudor por contra del comprobante.
        /// </summary>
        private decimal c762;
        /// <summary>
        /// Valor acumulado de orden accredor por contra del comprobante.
        /// </summary>
        private decimal c763;
        /// <summary>
        /// Valor acumulado de orden accredor del comprobante.
        /// </summary>
        private decimal c764;
        /// <summary>
        /// valor acumulado para saldo deudor de plan decuentas de fondos administrados
        /// </summary>
        private decimal saldodeudorFondosAdministrados;
        /// <summary>
        /// valor acumulado para saldo acreedor de plan decuentas de fondos administrados
        /// </summary>
        private decimal saldoacreedorFondosAdministrados;
        /// <summary>
        /// valor acumulado para saldo deudor de plan decuentas de administradora de fondos
        /// </summary>
        private decimal saldodeudorAdministradoradeFondos;
        /// <summary>
        /// valor acumulado para saldo acreedor de plan decuentas de administradora de fondos
        /// </summary>
        private decimal saldoacreedorAdministradoradeFondos;

        /// <summary>
        /// Crea una instancia de EcuacionContable.
        /// </summary>
        public EcuacionContable()
        {
            saldodeudor = decimal.Zero;
            saldodeudorFondosAdministrados = decimal.Zero;
            saldodeudorAdministradoradeFondos = decimal.Zero;

            saldoacreedor = decimal.Zero;
            saldoacreedorFondosAdministrados = decimal.Zero;
            saldoacreedorAdministradoradeFondos = decimal.Zero;

            c61 = decimal.Zero;
            c62 = decimal.Zero;
            c63 = decimal.Zero;
            c64 = decimal.Zero;
            c761 = decimal.Zero;
            c762 = decimal.Zero;
            c763 = decimal.Zero;
            c764 = decimal.Zero;
        }

        /// <summary>
        /// Valida que se cumpla la ecuación contable. Adicionalamnete si valida cuentas de orden y contingente.
        /// </summary>
        public void Validar()
        {
            if (decimal.Round(saldodeudor, 2).CompareTo(decimal.Round(saldoacreedor, 2)) != 0) {
                throw new AtlasException("BMON-012", "ECUACION CONTABLE BASICA NO CUADRA DEUDOR: {0} ACCREDOR: {1}", saldodeudor, saldoacreedor);
            }

            if (decimal.Round(saldodeudorAdministradoradeFondos, 2).CompareTo(decimal.Round(saldoacreedorAdministradoradeFondos, 2)) != 0) {
                throw new AtlasException("BMON-017", "ECUACION CONTABLE NO CUADRA PARA PLAN ADMINISTRADORA DE FONDOS: DEUDOR {0} ACCREDOR: {1}",
                    saldodeudorAdministradoradeFondos, saldoacreedorAdministradoradeFondos);
            }

            if (decimal.Round(saldodeudorFondosAdministrados, 2).CompareTo(decimal.Round(saldoacreedorFondosAdministrados, 2)) != 0) {
                throw new AtlasException("BMON-018", "ECUACION CONTABLE NO CUADRA PARA PLAN FONDOS ADMINISTRADOS: DEUDOR {0} ACCREDOR: {1}",
                    saldodeudorFondosAdministrados, saldoacreedorFondosAdministrados);
            }

            if (c61.CompareTo(c62) != 0) {
                throw new AtlasException("BMON-013", "ECUACION CONTABLE CONTINGENTE DEUDOR NO CUADRA C61: {0} C62: {1}", c61, c62);
            }

            if (c63.CompareTo(c64) != 0) {
                throw new AtlasException("BMON-014", "ECUACION CONTABLE CONTINGENTE ACREEDOR NO CUADRA C63: {0} C64: {1}", c63, c64);
            }

            if (c761.CompareTo(c762) != 0) {
                throw new AtlasException("BMON-013", "ECUACION CONTABLE CONTINGENTE DEUDOR NO CUADRA C761: {0} C762: {1}", c761, c762);
            }

            if (c763.CompareTo(c764) != 0) {
                throw new AtlasException("BMON-014", "ECUACION CONTABLE CONTINGENTE ACREEDOR NO CUADRA C763: {0} C764: {1}", c763, c764);
            }
        }

        /// <summary>
        /// Actualzia saldos por clase.
        /// </summary>
        /// <param name="cclase">Codigo de clase.</param>
        /// <param name="monto">Monto a sumar o restar por clase.</param>
        /// <param name="suma">true Indica que suma el saldo, false resta el saldo.</param>
        public void ActualizarSaldo(string cclase, decimal monto, bool suma, string tipoplancdetalle, bool esSaldoDeudor)
        {
            if (suma) {
                this.Sumarecuacioncontable(cclase, monto, tipoplancdetalle, esSaldoDeudor);
            } else {
                this.Restarecuacioncontable(cclase, monto, tipoplancdetalle, esSaldoDeudor);
            }
        }

        /// <summary>
        /// Suma saldos pertencecientea a la clase.
        /// </summary>
        /// <param name="cclase">Codigo de clase.</param>
        /// <param name="monto">Monto a sumar.</param>
        private void Sumarecuacioncontable(string cclase, decimal monto, string tipoplancdetalle, bool deudor)
        {
            //bool deudor = TmonClaseDal.Find(cclase).suma.Equals("D") ? true : false;
            if (deudor) {
                saldodeudor = decimal.Add(saldodeudor, monto);
                if (tipoplancdetalle.Equals("PC-FA")) {
                    saldodeudorFondosAdministrados += monto;
                } else {
                    saldodeudorAdministradoradeFondos += monto;
                }
            } else {
                saldoacreedor = decimal.Add(saldoacreedor, monto);
                if (tipoplancdetalle.Equals("PC-FA")) {
                    saldoacreedorFondosAdministrados += monto;
                } else {
                    saldoacreedorAdministradoradeFondos += monto;
                }
            }
        }

        /// <summary>
        /// Resta saldos pertencecientea a la clase.
        /// </summary>
        /// <param name="cclase">Codigo de clase.</param>
        /// <param name="monto">Monto a restar.</param>
        private void Restarecuacioncontable(string cclase, decimal monto, string tipoplancdetalle, bool deudor)
        {
            //bool deudor = TmonClaseDal.Find(cclase).suma.Equals("D") ? true : false;
            if (deudor) {
                saldodeudor = decimal.Subtract(saldodeudor, monto);
                if (tipoplancdetalle.Equals("PC-FA")) {
                    saldodeudorFondosAdministrados -= monto;
                } else {
                    saldodeudorAdministradoradeFondos -= monto;
                }
            } else {
                saldoacreedor = decimal.Subtract(saldoacreedor, monto);
                if (tipoplancdetalle.Equals("PC-FA")) {
                    saldoacreedorFondosAdministrados -= monto;
                } else {
                    saldoacreedorAdministradoradeFondos -= monto;
                }
            }
        }

        /// <summary>
        /// Suma saldos de contingente y orden.
        /// </summary>
        /// <param name="cclase">Codigo de clase</param>
        /// <param name="monto">Monto a sumar</param>
        private void Sumar(string cclase, decimal monto)
        {
            switch (cclase) {
                case "61":
                    c61 = decimal.Add(c61, monto);
                    break;
                case "62":
                    c62 = decimal.Add(c62, monto);
                    break;
                case "63":
                    c63 = decimal.Add(c63, monto);
                    break;
                case "64":
                    c64 = decimal.Add(c64, monto);
                    break;
                case "761":
                    c761 = decimal.Add(c761, monto);
                    break;
                case "762":
                    c762 = decimal.Add(c762, monto);
                    break;
                case "763":
                    c763 = decimal.Add(c763, monto);
                    break;
                case "764":
                    c764 = decimal.Add(c764, monto);
                    break;
            }
        }

        /// <summary>
        /// Resta saldos de contingente y orden.
        /// </summary>
        /// <param name="cclase">Codigo de clase</param>
        /// <param name="monto">Monto a restar</param>
        private void Restar(string cclase, decimal monto)
        {
            switch (cclase) {
                case "61":
                    c61 = decimal.Subtract(c61, monto);
                    break;
                case "62":
                    c62 = decimal.Subtract(c62, monto);
                    break;
                case "63":
                    c63 = decimal.Subtract(c63, monto);
                    break;
                case "64":
                    c64 = decimal.Subtract(c64, monto);
                    break;
                case "761":
                    c761 = decimal.Subtract(c761, monto);
                    break;
                case "762":
                    c762 = decimal.Subtract(c762, monto);
                    break;
                case "763":
                    c763 = decimal.Subtract(c763, monto);
                    break;
                case "764":
                    c764 = decimal.Subtract(c764, monto);
                    break;
            }
        }

    }
}
