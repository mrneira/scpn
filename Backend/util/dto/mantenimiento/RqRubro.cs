using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace util.dto.mantenimiento {
    public class RqRubro : ICloneable {


        /// <summary>
        /// Codigo de rubro asociado a una transaccion monetaria
        /// </summary>
        private int rubro;

        /// <summary>
        /// Codigo de compania a la que pertenece la cuenta.
        /// </summary>
        private int compania;

        /// <summary>
        /// Numero de operacion asociada al rubro. Si el valor del atributo esta vacio se toma la cuenta que llega en el request financiero,  dependiendo de la definicion del rubro si es debito o credito.
        /// </summary>
        private string coperacion;

        /// <summary>
        /// Numero de cuota de una tabla de pagos, utilizado en cuentas que manejan tablas de pagos ejemplo pago, prestamos.
        /// </summary>
        private int cuota;

        /// <summary>
        /// Codigo contable con el que se registra el movimiento, si llega un valor en este atributo se respeta es valor casocontrario el codigo contable lo obtiene la aplicacion.
        /// </summary>
        private string codigocontable;

        /**
         * Sucursal destino del movimiento, si afecta a una cuenta producto se toma la sucursal de la cuenta. tambien se utiliza en el manejod e
         * intersucursales.
         */
        private int csucursaldestino;

        /// <summary>
        /// Oficina destino del movimiento, si afecta a una cuenta producto se toma la sucursal de la cuenta. tambien se utiliza en el manejod e intersucursales.
        /// </summary>
        private int cagenciadestino;

        /// <summary>
        /// Monto de la transaccion.
        /// </summary>
        private decimal monto = 0;

        /// <summary>
        /// Codigo de moneda en la que esta expresado el valor del rubro.
        /// </summary>
        private string moneda;

        /// <summary>
        /// Estatus de la cuenta con el que se afecta el moviento, si es una cuneta producto, si llega en blanco se toma de la cuenta producto.
        /// </summary>
        private string cestatus;

        /// <summary>
        /// Indica que con el mismo rubro de la transaccion se va a registrar varios asientos contables, ejemplo, registro de comprobantes contables, contabilizacion de cuotas de plazo fijo o prestamos.
        /// </summary>
        private bool multiple = false;

        /// <summary>
        /// Codigo de tipo de credito que se afecta con la transaccion.
        /// </summary>
        private string ctipodecredito;

        /// <summary>
        /// Codigo de tipo de credito que se afecta con la transaccion.
        /// </summary>
        private int ctiposobregiro;

        /// <summary>
        /// Codigo de estatus de la operacion que se afecta con la transaccion, Nueva, Renovada,Restructurada.
        /// </summary>
        private string estadocuenta;

        /// <summary>
        /// Fecha de inicio de la cuota o del sobregiro.
        /// </summary>
        private int fechainicio;

        /// <summary>
        /// Fecha de vencimiento de la cuota o del sobregiro.
        /// </summary>
        private int fechavencimiento;

        /// <summary>
        /// Indica si el tipo de saldo de una categoria. Ejm false, en contabilizacion de desembolso de un credito.
        /// </summary>
        private bool actualizasaldo = true;

        /// <summary>
        /// Cotizacion de compra o venta, con el cual se calcula el valor en moneda local para grabar en la tbala de journal.
        /// </summary>
        private decimal cotizacion = 0;

        /// <summary>
        /// Objeto que contiene datos adicionales del rubro monetario.
        /// </summary>
        private Dictionary<string, object> mdatos = new Dictionary<string, object>();

        /// <summary>
        /// Crea una instancia de RqRubro.
        /// </summary>
        public RqRubro() {
        }

        /// <summary>
        /// Crea una instancia de RqRubro, dato un DtoRubro que llega desde pantalla.
        /// </summary>
        /// <param name="dtorubro">Objeto que contine informacion de rubros de pantalla.</param>
        public RqRubro(DtoRubro dtorubro) {
            rubro = dtorubro.Rubro;
            monto = dtorubro.Monto;
        }

        /// <summary>
        /// Crea una instancia de RqRubro.
        /// </summary>
        /// <param name="rubro">Codigo de rubro.</param>
        /// <param name="monto">Monto asociado al rubro.</param>
        public RqRubro(Object rubro, Object monto) {
            this.rubro = int.Parse(rubro.ToString());
            if (monto != null) {
                this.monto = decimal.Parse(monto.ToString());
            }
        }

        /// <summary>
        /// Crea una instancia de RqRubro.
        /// </summary>
        /// <param name="rubro">Codigo de rubro.</param>
        /// <param name="monto">Monto asociado al rubro.</param>
        /// <param name="moneda">Codigo de moneda asociada al rubro.</param>
        public RqRubro(int rubro, decimal monto, string moneda) {
            this.rubro = rubro;
            this.monto = monto;
            this.moneda = moneda;
        }

        public int Rubro { get => rubro; set => rubro = value; }
        public int Compania { get => compania; set => compania = value; }
        public string Coperacion { get => coperacion; set => coperacion = value; }
        public int Cuota { get => cuota; set => cuota = value; }
        public string Codigocontable { get => codigocontable; set => codigocontable = value; }
        public int Csucursaldestino { get => csucursaldestino; set => csucursaldestino = value; }
        public int Cagenciadestino { get => cagenciadestino; set => cagenciadestino = value; }
        public decimal Monto { get => monto; set => monto = value; }
        public string Moneda { get => moneda; set => moneda = value; }
        public string Cestatus { get => cestatus; set => cestatus = value; }
        public bool Multiple { get => multiple; set => multiple = value; }
        public string Ctipodecredito { get => ctipodecredito; set => ctipodecredito = value; }
        public int Ctiposobregiro { get => ctiposobregiro; set => ctiposobregiro = value; }
        public string Estadocuenta { get => estadocuenta; set => estadocuenta = value; }
        public int Fechainicio { get => fechainicio; set => fechainicio = value; }
        public int Fechavencimiento { get => fechavencimiento; set => fechavencimiento = value; }
        public bool Actualizasaldo { get => actualizasaldo; set => actualizasaldo = value; }
        public decimal Cotizacion { get => cotizacion; set => cotizacion = value; }
        public Dictionary<string, object> Mdatos { get => mdatos; set => mdatos = value; }

        public virtual object Clone() {
            RqRubro obj = (RqRubro)this.MemberwiseClone();
            return obj;
        }


    }
}
