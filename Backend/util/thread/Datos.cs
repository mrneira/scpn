using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util.enums;
using util.servicios.contable;

namespace util.thread {
    /// <summary>
    /// Clase utilitaria que almacena datos del request.
    /// </summary>
    public class Datos {

        /// <summary>
        /// Codigo de compania de trabajo.
        /// </summary>
        private int compania = 1;

        /// <summary>
        /// Secuencia de transacciones monetarias.
        /// </summary>
        private int secuenciamonetario = 1;

        /// <summary>
        /// Almacena datos de entrada de ejecucion de una transacion ouede ser un mantenimiento, consulta.
        /// </summary>
        private Request request;

        /// <summary>
        /// Atributo que indica que una transaccion se ejecuta en modo test desde un ide, o modo producccion desde un ejb.
        /// </summary>
        private bool prueba = false;

        /// <summary>
        /// Map utilitario, que almacena informacion de ejecucion de una transaccion, ejemplo la secuencia maxima de un pk de una tabla.
        /// </summary>
        private Dictionary<String, Object> mdatos = new Dictionary<String, Object>();

        /// <summary>
        /// Map utilitario que almacen informacion utilizada en la ejecucion de una transaccion monetaria, el KEY del map es el codigo de MODULO.
        /// </summary>
        private Dictionary<int, IDatosModulo> mdatosmodulo = new Dictionary<int, IDatosModulo>();

        /// <summary>
        /// Map utilitario, de utilizacion secuencias de tablas.
        /// </summary>
        private Dictionary<String, Object> msecuencia = new Dictionary<String, Object>();

        /// <summary>
        /// Map utilitario que almacena instancias de clases que se encargan de actualizar saldos de operaciones.
        /// </summary>
        private Dictionary<int, Dictionary<string, Saldo>> msaldos = new Dictionary<int, Dictionary<string, Saldo>>();

        /// <summary>
        /// Map utilitario, que almacena informacion de moduos que intervienen en una transaccion, se utilzia para ejecutar reversos de distintos modulos.
        /// </summary>
        private Dictionary<String, Object> mtmonmovimiento = new Dictionary<String, Object>();

        public int Compania { get => compania; set => compania = value; }
        public int Secuenciamonetario { get => secuenciamonetario; set => secuenciamonetario = value; }
        public Request Request { get => request; set => request = value; }
        public bool Prueba { get => prueba; set => prueba = value; }
        public Dictionary<string, object> Mdatos { get => mdatos; set => mdatos = value; }
        public Dictionary<int, IDatosModulo> Mdatosmodulo { get => mdatosmodulo; set => mdatosmodulo = value; }
        public Dictionary<string, object> Msecuencia { get => msecuencia; set => msecuencia = value; }
        public Dictionary<int, Dictionary<string, Saldo>> Msaldos { get => msaldos; set => msaldos = value; }
        public Dictionary<string, object> Mtmonmovimiento { get => mtmonmovimiento; set => mtmonmovimiento = value; }

        /// <summary>
        /// 
        /// </summary>
        private Dictionary<String, EcuacionContable> mEcuacionContable = new Dictionary<String, EcuacionContable>();

        public IDatosModulo GetMdatosmodulo(int modulo)
        {
            IDatosModulo d = null;
            if (mdatosmodulo.ContainsKey(modulo)) {
                d = mdatosmodulo[modulo];
            }
            if (d == null) {
                d = EnumModulos.GetEnumModulos(modulo).GetDatosModulo();
                mdatosmodulo[modulo] = d;
            }
            return d;
        }

        /**
         * Fija datos de transaccion asociado a un modulo.
         * @param modulo Codigo del modulo.
         * @param datostransaccion Datos asociados al modulo.
         */
        public void PutMdatosmodulo(int modulo, IDatosModulo datostransaccion)
        {
            mdatosmodulo[modulo] = datostransaccion;
        }

        /// <summary>
        /// Entrega una instancia de Saldo por modulo.
        /// </summary>
        /// <param name="modulo">Codigo de modulo.</param>
        /// <param name="coperacion">Codigo de operacion.</param>
        /// <returns></returns>
        public Saldo GetInstanciaSaldo(int modulo, String coperacion)
        {
            Dictionary<String, Saldo> msaldomodulo = null;
            if (msaldos.ContainsKey(modulo)) {
                msaldomodulo = msaldos[modulo];
            }

            if (msaldomodulo == null) {
                msaldomodulo = new Dictionary<String, Saldo>();
                msaldos[modulo] = msaldomodulo;
            }
            Saldo s = null;
            if (msaldomodulo.ContainsKey(coperacion)) {
                s = msaldomodulo[coperacion];
            }

            if (s == null) {
                s = EnumModulos.GetEnumModulos(modulo).GetSaldo();
                msaldomodulo[coperacion] = s;
            }
            return s;
        }

        /// <summary>
        /// Fija instancia de la clase que maneja saldos asociado a un modulo.
        /// </summary>
        /// <param name="modulo">Codigo del modulo.</param>
        /// <param name="coperacion">Numeor de operacion</param>
        /// <param name="saldo">Instancia de clase de saldo asociados al modulo.</param>
        public void PutInstanciaSaldo(int modulo, string coperacion, Saldo saldo)
        {
            Dictionary<string, Saldo> msaldomodulo = msaldos[modulo];
            if (msaldomodulo == null) {
                msaldomodulo = new Dictionary<string, Saldo>();
                msaldos[modulo] = msaldomodulo;
            }
            msaldomodulo[coperacion] = saldo;
        }

        /// <summary>
        /// Metodo que se encarga de encerar informacion temporal de la transaccion.
        /// </summary>
        public void Encerar()
        {
            try {
                request = null;
                mdatos.Clear();
                msecuencia.Clear();
                EncerarModulos();
            }
            catch (Exception e) {
                e.GetBaseException();
            }
        }

        /// <summary>
        /// Metodo que encera informacion por modulo.
        /// </summary>
        private void EncerarModulos()
        {
            try {

                foreach (int key in mdatosmodulo.Keys) {
                    try {
                        mdatosmodulo[key].Encerardatos();
                    }
                    catch (Exception e) {
                        e.GetBaseException();
                    }
                }
                mdatosmodulo.Clear();
                msaldos.Clear();
            }
            catch (Exception e) {
                e.GetBaseException();
            }
        }

        /**
         * Entrega el valor de: ecuacionContable.
         * @return EcuacionContable
         */
        //public EcuacionContable getEcuacionContable(int csucursal, int cagencia)
        public EcuacionContable getEcuacionContable()
        {
            //String key = "" + csucursal + "-" + cagencia;
            String key = "1-1";
            EcuacionContable e = this.mEcuacionContable.ContainsKey(key) ? this.mEcuacionContable[key] : null;
            if (e == null) {
                //e = new EcuacionContable(csucursal, cagencia);
                e = new EcuacionContable();
                this.mEcuacionContable[key] = e;
            }
            return e;
        }


        public void validarEcuacionContable()
        {
            foreach (String key in mEcuacionContable.Keys) {
                EcuacionContable ec = this.mEcuacionContable[key];
                ec.Validar();
            }
        }

    }

}


