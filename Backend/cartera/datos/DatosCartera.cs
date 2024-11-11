using amortizacion.dto;
using amortizacion.helper;
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
using util.enums;
using util.thread;

namespace cartera.datos {

    /// <summary>
    /// Clase que se encarga de almacenar informacion temporal, utilizada en la ejecucion de transacciones que afectan a operaciones de cartera.
    /// </summary>
    public class DatosCartera : IDatosModulo {


        /// <summary>
        /// Map que almacena definicion de operaciones de cartera.
        /// </summary>
        private Dictionary<string, Operacion> moperacion = new Dictionary<string, Operacion>();

        /// <summary>
        /// Entrega un map con las operaciones de cartera que intervienen en una transaccion.
        /// </summary>
        /// <returns>Dictionary<string, Operacion></returns>
        public Dictionary<string, Operacion> GetOperaciones() {
            return moperacion;
        }

        /// <summary>
        /// Metodo que entrega la informacion de una operacion a de credito.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de credito.</param>
        /// <param name="consulta"></param>
        /// <returns>Operacion</returns>
        public Operacion GetOperacion(string coperacion, bool consulta) {
            Operacion operacion = null;
            if (moperacion.ContainsKey(coperacion)) {
                operacion = moperacion[coperacion];
            }

            if (operacion == null) {
                tcaroperacion tvo = null;
                if (!consulta) {
                    tvo = TcarOperacionDal.FindWithLock(coperacion);
                } else {
                    tvo = TcarOperacionDal.FindSinBloqueo(coperacion);
                }
                operacion = new Operacion(tvo);
                operacion.Coperacion = coperacion;
                moperacion[coperacion] = operacion;
            }
            return operacion;
        }

        /// <summary>
        /// Adiciona una operacion de cartera en el map de datos cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="tcarOperacion">Objeto que contiene informacion de una operacion de cartera.</param>
        /// <returns></returns>
        public Operacion AddOperacion(string coperacion, tcaroperacion tcarOperacion) {
            Operacion operacion = new Operacion(tcarOperacion);
            operacion.Coperacion = coperacion;
            moperacion[coperacion] = operacion;
            return operacion;
        }

        /// <summary>
        /// Objeto que almacena definicion de solicitud de credito.
        /// </summary>
        private Solicitud solicitude;

        /// <summary>
        /// Entrega el valor de: solicitude
        /// </summary>
        /// <returns>Solicitud</returns>
        public Solicitud GetSolicitude() {
            return solicitude;
        }

        /// <summary>
        /// Fija el valor de: solicitude
        /// </summary>
        /// <param name="solicitude">Objeto que contiene datos de solicitud.</param>
        public void SetSolicitude(Solicitud solicitude) {
            this.solicitude = solicitude;
        }

        /// <summary>
        /// Encera el dictionary que contiene informacion de cartera.
        /// </summary>
        public void Encerardatos() {
            moperacion.Clear();
        }

        /// <summary>
        /// Entrega datos de datos cartera alamcenado en un threadlocal.
        /// </summary>
        /// <returns>DatosCartera</returns>
        public static DatosCartera GetDatosCartera() {
            DatosCartera dc = (DatosCartera)ThreadNegocio.GetDatos().GetMdatosmodulo(EnumModulos.CARTERA.Cmodulo);
            return dc;
        }


    }
}
