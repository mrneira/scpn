using dal.generales;
using dal.seguridades;
using modelo;
using System;
using System.Diagnostics;
using System.Linq;
using System.Runtime.Remoting;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.consulta;
using util.dto.mantenimiento;
using util.interfaces;

namespace core.servicios {

    /// <summary>
    /// Clase, a implementar en las clasees principales de ejecucion de servicios.
    /// </summary>
    public abstract class Servicio {

        /// <summary>
        /// Referencia al objeto request de entrada utilizado en la ejecucion de una transaccion.
        /// </summary>
        private Request request;
        /// <summary>
        /// Referencia al objeto de respuesta resultado de la ejecucion de una transaccion.
        /// </summary>
        private Response response;
        /// <summary>
        /// Objeto que contiene el contador de tiempo resultado de la ejecucion de una transaccion.
        /// </summary>
        private Stopwatch sw;

        /// <summary>
        /// Objeto para generar codigos randomicos.
        /// </summary>
        private static readonly Random random = new Random();

        public Request Request { get => request; set => request = value; }
        public Stopwatch Sw { get => sw; set => sw = value; }
        protected Response Response { get => response; set => response = value; }

        /// <summary>
        /// Metodo que se encarga de ejecutar un servicio, ejemplo consulta, mantenimiento, etc.
        /// </summary>
        /// <param name="mdatos">Metadata con datos de entrada.</param>
        public abstract Response Ejecutar(string json);

        /// <summary>
        /// Enterga el tiempo de ejecucion de la transaccion.
        /// </summary>
        /// <returns></returns>
        public decimal GetTiempo() {
            if (this.sw == null) {
                return Decimal.Zero;
            }
            float el = this.sw.ElapsedMilliseconds;
            float t = el / 1000;
            decimal tiempo = (decimal)t;
            return tiempo;
        }

        public void Validarlogin(bool validar) {
            if (this.request.Cmodulo > 0 && this.request.Ctransaccion > 0) {
                if (this.request.Cmodulo.Equals(2) && (this.request.Ctransaccion.Equals(1) || this.request.Ctransaccion.Equals(16) || this.request.Ctransaccion.Equals(1002))) {
                    return;
                }
                // Las transacciones de subscripcion, otp, de banca en linea no se validan
                if (this.request.Cmodulo.Equals(23) && (this.request.Ctransaccion.Equals(2) || this.request.Ctransaccion.Equals(3) || this.request.Ctransaccion.Equals(5) || this.request.Ctransaccion.Equals(7) || this.request.Ctransaccion.Equals(8))) {
                    return;
                }
                // Las transacciones de subscripcion de banca movil no se validan
                if (this.request.Cmodulo.Equals(29) && (this.request.Ctransaccion.Equals(1) || this.request.Ctransaccion.Equals(2)
                    || this.request.Ctransaccion.Equals(4) || this.request.Ctransaccion.Equals(5) || this.request.Ctransaccion.Equals(6))) {
                    return;
                }

                // Las transacciones de canales digitales
                int[] ctransacciones = { 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 40 };
                if (this.request.Cmodulo.Equals(30) && (ctransacciones.Contains(this.request.Ctransaccion))) {
                    return;
                }
                //if (this.request.Cmodulo.Equals(30) && (this.request.Ctransaccion.Equals(11) || this.request.Ctransaccion.Equals(12) || this.request.Ctransaccion.Equals(13)
                //     || this.request.Ctransaccion.Equals(14) || this.request.Ctransaccion.Equals(15) || this.request.Ctransaccion.Equals(16)|| this.request.Ctransaccion.Equals(17)
                //     || this.request.Ctransaccion.Equals(18) || this.request.Ctransaccion.Equals(19) || this.request.Ctransaccion.Equals(20))) {
                //    return;
                //}
            }
            if (validar) {
                string componente = "seguridad.util.Usuario";
                ILogin c = null;
                try {
                    string assembly = componente.Substring(0, componente.IndexOf("."));
                    ObjectHandle handle = Activator.CreateInstance(assembly, componente);
                    object comp = handle.Unwrap();
                    c = (ILogin)comp;
                    c.Validarlogin(request.Cusuario, request.Ccompania, request.Ccanal, request.GetString("s"));
                } catch (TypeLoadException e) {
                    throw new AtlasException("GEN-001", "CLASE {0} A EJECUTAR NO EXISTE  MODULO: {1} TRANS: {2} ", e, componente);
                } catch (InvalidCastException e) {
                    throw new AtlasException("GEN-002", "PROCESO {0} A EJECUTAR MODULE: {1} TRANS: {2} NO IMPLEMENTA {4}", e, componente,
                            c.GetType().FullName);
                }
            }
        }

        public static string GetMensaje(string prefijo) {
            long cmensaje = DateTime.Now.ToBinary() + random.Next(99999);
            return prefijo + "-" + cmensaje;
        }
    }
}
