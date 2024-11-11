using modelo.helper.cartera;
using System;
using System.Collections.Generic;
using System.Runtime.Remoting;

using util.thread;

namespace util.enums {
    /// <summary>
    /// Enumeracion que almacena informacion asociada a modulos, ejemplo bean que maneja movimientos, clase que completa informacion de  movimientos etc.
    /// </summary>
    public class EnumModulos {

        /// <summary>
        /// Codigo de modulo.
        /// </summary>
        private int cmodulo;
        /// <summary>
        /// Bean asociado al modulo en la cual se alamacenan movimientos.
        /// </summary>
        private string beanmovimiento;
        /// <summary>
        /// Clase que se encarga de completar datos de movimientos asociados a un modulo.
        /// </summary>
        private string movimientomodulo;
        /// <summary>
        /// Clase que se encarga de actualizar saldos de un movimiento asociado a un modulo.
        /// </summary>
        private string saldosmodulo;
        /// <summary>
        /// Clase que se encarga de ejecutar reversos por modulo.
        /// </summary>
        private string clasereverso;
        /// <summary>
        /// Clase que se encarga de ejecutar lotes por modulo.
        /// </summary>
        private string claselotes;
        /// <summary>
        /// Variable que almacena el nombre de la entidad del proceso de registro de lotes
        /// </summary>
        private String entidadlote;
        /// <summary>
        /// Clase que se encarga de almacenar datos de ejcucion de transacciones por modulo, esta informacion esta disponible desde el inicio al fin de la transaccion.
        /// </summary>
        private string datosmodulo;

        /// <summary>
        /// Crea una instancia de EnumCriterios.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="beanmovimiento">Bean asociado al modulo en la cual se alamacenan movimientos</param>
        /// <param name="movimientomodulo">Clase que se encarga de completar datos de movimientos asociados a un modulo.</param>
        /// <param name="datosmodulo">Clase que se encarga de actualizar saldos de un movimiento asociado a un modulo.</param>
        /// <param name="saldosmodulo">Clase que se encarga de actualizar saldos de un movimiento asociado a un modulo.</param>
        /// <param name="clasereverso">Clase que se encarga de ejecutar reversos por modulo.</param>
        /// <param name="claselotes">Clase que se encarga de almacenar datos de ejcucion de transacciones por modulo, esta informacion esta disponible desde el inicio al fin de la transaccion.</param>
        public EnumModulos(int cmodulo, string beanmovimiento, string movimientomodulo, string datosmodulo, string saldosmodulo, string clasereverso, string claselotes, string entidadlote)
        {
            this.cmodulo = cmodulo;
            this.beanmovimiento = beanmovimiento;
            this.movimientomodulo = movimientomodulo;
            this.datosmodulo = datosmodulo;
            this.saldosmodulo = saldosmodulo;
            this.clasereverso = clasereverso;
            this.claselotes = claselotes;
            this.entidadlote = entidadlote;
        }

        public static readonly EnumModulos SEGUROS = new EnumModulos(6, "modelo.tcarmovimiento", "cartera.movimiento.MovimientoCartera", null,
                                            "cartera.saldo.SaldoCartera", "cartera.movimiento.ReversoCartera", "cartera.lote.TareasCartera", "tcaroperacionlote");
        public static readonly EnumModulos CARTERA = new EnumModulos(7, "modelo.tcarmovimiento", "cartera.movimiento.MovimientoCartera", "cartera.datos.DatosCartera",
                                            "cartera.saldo.SaldoCartera", "cartera.movimiento.ReversoCartera", "cartera.lote.TareasCartera", "tcaroperacionlote");
        public static readonly EnumModulos COBRANZAS = new EnumModulos(8, "modelo.tcarmovimiento", "cartera.movimiento.MovimientoCartera", "cartera.datos.DatosCartera",
                                            "cartera.saldo.SaldoCartera", "cartera.movimiento.ReversoCartera", "cartera.lote.TareasCartera", "tcaroperacionlote");
        public static readonly EnumModulos GARANTIAS = new EnumModulos(9, "modelo.tgarmovimiento", "garantias.movimiento.MovimientoGarantias", "garantias.datos.DatosGarantia",
                                            null, "garantias.movimiento.ReversoGarantia", "garantias.lote.TareasGarantia", "tgaroperacionlote");
        public static readonly EnumModulos CONTABILIDAD = new EnumModulos(10, null, null, "contabilidad.datos.DatosContabilidad", null, null, "contabilidad.lote.TareasContabilidad", "tconregistrolote");
        public static readonly EnumModulos PERSONAS = new EnumModulos(3, null, null, null, null, null, null, "tperpersonalote");
        public static readonly EnumModulos PRESTACIONES = new EnumModulos(28, "modelo.tpremovimiento",
                                    "prestaciones.movimiento.MovimientoPrestaciones", "prestaciones.datos.DatosPrestaciones",
                                    "prestaciones.saldo.SaldoPrestaciones", "prestaciones.movimiento.ReversoPrestaciones",
                                    "prestaciones.lote.TareasPrestaciones", null);
        //public static readonly EnumModulos INVERSIONES = new EnumModulos(12, null, null, null, null, null, "inversiones.lote.TareasInversion", "tinvinversionlote");
        public static readonly EnumModulos INVERSIONES = new EnumModulos(12, null, null, null, null, null, "inversiones.lote.TareasInversion", "");
        public static readonly EnumModulos CANALES_DIGITALES = new EnumModulos(30, null, null, null, null, null, "", "");
        public static IEnumerable<EnumModulos> Values
        {
            get {
                //yield return CAJA;
                //yield return VISTA;
                yield return SEGUROS;
                yield return CARTERA;
                yield return COBRANZAS;
                yield return GARANTIAS;
                yield return CONTABILIDAD;
                yield return PERSONAS;
                yield return PRESTACIONES;
                yield return INVERSIONES;
                yield return CANALES_DIGITALES;
            }
        }

        public int Cmodulo { get => cmodulo; set => cmodulo = value; }
        public string Beanmovimiento { get => beanmovimiento; set => beanmovimiento = value; }
        public string Movimientomodulo { get => movimientomodulo; set => movimientomodulo = value; }
        public string Saldosmodulo { get => saldosmodulo; set => saldosmodulo = value; }
        public string Clasereverso { get => clasereverso; set => clasereverso = value; }
        public string Claselotes { get => claselotes; set => claselotes = value; }
        public string Datosmodulo { get => datosmodulo; set => datosmodulo = value; }

        /// <summary>
        /// Entrega una instancia de la enumeracion dado el codigo de modulo.
        /// </summary>
        /// <param name="cond">Condicion a buscar la enumeracion.</param>
        /// <returns></returns>
        public static EnumModulos GetEnumModulos(int cmodulo)
        {
            EnumModulos obj = null;
            foreach (EnumModulos e in EnumModulos.Values) {
                if (e.cmodulo.Equals(cmodulo)) {
                    obj = e;
                    break;
                }
            }
            return obj;
        }

        /// <summary>
        /// Entrega una instancia del bean que almacena movimientos asociados al modulo.
        /// </summary>
        /// <returns></returns>
        public Movimiento GetInstanceDeMovimiento()
        {
            if (beanmovimiento == null) {
                return null;
            }
            string assembly = beanmovimiento.Substring(0, beanmovimiento.IndexOf("."));
            ObjectHandle handle = Activator.CreateInstance(assembly, beanmovimiento);
            object mov = handle.Unwrap();
            Movimiento movimiento = (Movimiento)mov;

            // movimiento.setPk(key); Completar
            return movimiento;
        }

        /// <summary>
        /// Entrega una instancia de la clase que completa informacion de datos de una cuenta asociadas a un modulo.
        /// </summary>
        /// <returns>MovimientoModulos</returns>
        public movimiento.MovimientoModulos GetInstanceMovimientoModulos()
        {
            if (movimientomodulo == null) {
                return null;
            }
            string assembly = movimientomodulo.Substring(0, movimientomodulo.IndexOf("."));
            ObjectHandle handle = Activator.CreateInstance(assembly, movimientomodulo);
            object obj = handle.Unwrap();
            movimiento.MovimientoModulos mov = (movimiento.MovimientoModulos)obj;
            return mov;
        }

        /// <summary>
        /// Entrega una instancia de la clase que almacena datos del modulo asociados a una transaccion.
        /// </summary>
        /// <returns>DatosModulo</returns>
        public IDatosModulo GetDatosModulo()
        {
            if (datosmodulo == null) {
                return null;
            }
            string assembly = datosmodulo.Substring(0, datosmodulo.IndexOf("."));
            ObjectHandle handle = Activator.CreateInstance(assembly, datosmodulo);
            object obj = handle.Unwrap();
            IDatosModulo dm = (IDatosModulo)obj;
            return dm;
        }

        /// <summary>
        /// Entrega una instancia de la clase que ejecuta reversos de un modulo.
        /// </summary>
        /// <returns>Reverso</returns>
        public movimiento.IReverso GetInstanciaReverso()
        {
            if (clasereverso == null) {
                return null;
            }
            string assembly = clasereverso.Substring(0, clasereverso.IndexOf("."));
            ObjectHandle handle = Activator.CreateInstance(assembly, clasereverso);
            object obj = handle.Unwrap();
            movimiento.IReverso rev = (movimiento.IReverso)obj;
            return rev;
        }

        /// <summary>
        /// Entrega una instancia de la clase que se que se encarga de actualizar saldos por modulo.
        /// </summary>
        /// <returns>Saldo</returns>
        public Saldo GetSaldo()
        {
            if (saldosmodulo == null) {
                return null;
            }
            string assembly = saldosmodulo.Substring(0, saldosmodulo.IndexOf("."));
            ObjectHandle handle = Activator.CreateInstance(assembly, saldosmodulo);
            object obj = handle.Unwrap();
            Saldo sal = (Saldo)obj;
            return sal;
        }

    }
}
