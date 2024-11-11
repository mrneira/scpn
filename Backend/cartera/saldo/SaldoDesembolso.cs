using cartera.datos;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util;

namespace cartera.saldo {
    /// <summary>
    /// Clase que se encarga del manejo de saldos de desembolso de operaciones de cartera.
    /// </summary>
    public class SaldoDesembolso {

        /// <summary>
        /// Referencia a operacion de cartera.
        /// </summary>
        private tcaroperacion operacion;

        /// <summary>
        /// Referencia a solicitud de cartera.
        /// </summary>
        private tcarsolicitud solicitud;

        /// <summary>
        /// Fecha a la cual se calcula los valores.
        /// </summary>
        private int fproceso;

        /// <summary>
        /// Monto original de la operacion a desembolsar.
        /// </summary>
        private decimal montooriginal = Constantes.CERO;

        /// <summary>
        /// Monto de la operacion a desembolsar.
        /// </summary>
        private decimal monto = Constantes.CERO;

        /// <summary>
        /// Valor de descuento en desembolso.
        /// </summary>
        private decimal descuento = Constantes.CERO;

        /// <summary>
        /// Valor de descuento por absorcion de operaciones de cartera en desembolso
        /// </summary>
        private decimal absorcion = Constantes.CERO;

        /// <summary>
        /// Valores financiados en desembolso de cartera.
        /// </summary>
        private decimal financiado = Constantes.CERO;

        /// <summary>
        /// Valor de seguro de desgravamen en desembolso de cartera.
        /// </summary>
        private decimal segurodesgravamen = Constantes.CERO;

        /// <summary>
        /// Valor de descuento por reincorporado en desembolso de cartera.
        /// </summary>
        private decimal reincorporado = Constantes.CERO;

        /// <summary>
        /// Valor de anticipo en desembolso de cartera.
        /// </summary>
        private decimal anticipo = Constantes.CERO;

        /// <summary>
        /// Monto a desembolsar, sin descuentos.
        /// </summary>
        private decimal montodesembolsar = Constantes.CERO;


        public tcaroperacion Operacion { get => operacion; set => operacion = value; }
        public tcarsolicitud Solicitud { get => solicitud; set => solicitud = value; }
        public int Fproceso { get => fproceso; set => fproceso = value; }

        public decimal MontoOriginal { get => montooriginal; set => montooriginal = value; }
        public decimal Monto { get => monto; set => monto = value; }
        public decimal Descuento { get => descuento; set => descuento = value; }
        public decimal Absorcion { get => absorcion; set => absorcion = value; }
        public decimal Financiado { get => financiado; set => financiado = value; }
        public decimal SeguroDesgravamen { get => segurodesgravamen; set => segurodesgravamen = value; }
        public decimal Reincorporado { get => reincorporado; set => reincorporado = value; }
        public decimal Anticipo { get => anticipo; set => anticipo = value; }
        public decimal MontoDesembolsar { get => montodesembolsar; set => montodesembolsar = value; }

        /// <summary>
        /// Crea una instancia de Desembolso y calcula valores.
        /// </summary>
        /// <param name="operacion">Objeto que contiene información de una operacion de cartera.</param>
        /// <param name="fproceso">Fecha a la cual se calcula los valores.</param>
        public SaldoDesembolso(tcaroperacion operacion, int fproceso)
        {
            this.operacion = operacion;
            this.fproceso = fproceso;
            CalcularSaldosOperacion();
        }

        /// <summary>
        /// Crea una instancia de Desembolso y calcula valores.
        /// </summary>
        /// <param name="solicitud">Objeto que contiene información de una solicitud de cartera.</param>
        /// <param name="fproceso">Fecha a la cual se calcula los valores.</param>
        public SaldoDesembolso(tcarsolicitud solicitud, int fproceso)
        {
            this.solicitud = solicitud;
            this.fproceso = fproceso;
            CalcularSaldosSolcitud();
        }

        /// <summary>
        /// Calcula los valores de desembolso de operacion de cartera.
        /// </summary>
        private void CalcularSaldosOperacion()
        {
            montooriginal = (decimal)operacion.montooriginal;
            monto = (decimal)operacion.monto;
            descuento = TcarOperacionGastosLiquidaDal.GetDescuento(operacion.coperacion);
            reincorporado = TcarSolicitudReincorporadoDal.ValorReincorporado((long)operacion.csolicitud);
            anticipo = TcarSolicitudSegurosDal.ValorAnticipo((long)operacion.csolicitud, false);
            absorcion = CalcularAbsorcion((long)operacion.csolicitud);
            montodesembolsar = (decimal)operacion.montooriginal - descuento - absorcion - reincorporado + financiado + anticipo;
        }

        /// <summary>
        /// Calcula los valores de desembolso de solicitud de cartera.
        /// </summary>
        private void CalcularSaldosSolcitud()
        {
            montooriginal = (decimal)solicitud.montooriginal;
            monto = (decimal)solicitud.monto;
            descuento = TcarSolicitudGastosLiquidaDal.GetDescuento(solicitud.csolicitud);
            reincorporado = TcarSolicitudReincorporadoDal.ValorReincorporado(solicitud.csolicitud);
            anticipo = TcarSolicitudSegurosDal.ValorAnticipo(solicitud.csolicitud, false);
            absorcion = CalcularAbsorcion(solicitud.csolicitud);
            montodesembolsar = (decimal)solicitud.montooriginal - descuento - absorcion - reincorporado + financiado + anticipo;
        }

        /// <summary>
        /// Calcula los valores de absorcion de operaciones de cartera.
        /// </summary>
        private decimal CalcularAbsorcion(long csolicitud)
        {
            decimal montoabsorcion = Constantes.CERO;
            IList<tcarsolicitudabsorcion> loperaciones = TcarSolicitudAbsorcionDal.Find(csolicitud);
            foreach (tcarsolicitudabsorcion op in loperaciones) {
                Operacion operacion = OperacionFachada.GetOperacion(op.coperacion, true);
                Saldo saldo = new Saldo(operacion, fproceso);
                saldo.Calculacuotaencurso();
                montoabsorcion = montoabsorcion + saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas() - saldo.Cxp;
            }
            return montoabsorcion;
        }
    }

}