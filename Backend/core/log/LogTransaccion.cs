using core.servicios;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.servicios.ef;

namespace core.log {

    /// <summary>
    /// Clase que se encarga de grabar el log de ejecucion de trasacciones.
    /// </summary>
    /// <author>amerchan</author>
    public class LogTransaccion {

        /// Objeto que almacena el log de una transaccion
        private tgentransaccionlog log;

        /// <summary>
        /// Crea un objeto de log de transacciones.
        /// </summary>
        private void Create(Request request) {
            this.log = new tgentransaccionlog();
            this.log.mensaje = request.Mensaje;
            this.log.ctransaccion = request.Ctransaccion;
            this.log.cmodulo = request.Cmodulo;
            this.log.fcontable = request.Fconatable;
            this.log.cagencia = request.Cagencia;
            this.log.csucursal = request.Csucursal;
            this.log.ccompania = request.Ccompania;
            this.log.ipservidor = LogTransaccion.GetIpServer();
            this.log.cterminal = request.Cterminal;
            this.log.cterminalremoto = request.Cterminalremoto;
            this.log.cusuario = request.Cusuario;
            this.log.freal = request.Freal;
            this.log.crespuesta = Response.cod;
            this.log.mensusuario = "OK";
        }


        /// <summary>
        /// Metodo que graba el log de una transaccion, cuando la transaccion finaliza con exito.
        /// </summary>
        public void GrabarLog(Request request, long tiempo, String tipo) {
            tgentransaccion tran = (tgentransaccion)request.Tgentransaccion;
            if (tran == null || tran.registralog == false) {
                // Si no esta el detalle de la transaccion y no esta parametrizado que registre log retorna null
                return;
            }
            this.Create(request);
            this.log.tiempo = tiempo;
            this.log.tipo = tipo;
            Sessionef.Grabar(this.log);
        }

        /// <summary>
        /// Metodo que graba el log de una transaccion, cuando la transaccion original presenta un error.
        /// </summary>
        public void grabarLogConCommit(Request request, Response response, decimal tiempo, String tipo) {
            if (request == null) {
                return; // En este caso no puede crear el request, ejemplo un bean no existe.
            }
            tgentransaccion tran = (tgentransaccion)request.Tgentransaccion;
            if (tran != null && (tran.cmodulo != 2 || tran.ctransaccion != 1) && !(tran.cmodulo == 2 && tran.ctransaccion == 1001)) {
                this.ActualizaFechaAccionSession(request);
            }

            String grabarlog = request.Mdatos.ContainsKey("grabarlog") == false ? "1" : request.Mdatos["grabarlog"].ToString();
            Boolean savelog = Constantes.EsUno(grabarlog);
            if (!savelog) {
                return; // En este caso no puede crear el request, ejemplo un bean no existe.
            }

            if (tran == null || tran.registralog == null || tran.registralog == false) {
                // Si no esta el detalle de la transaccion y no esta parametrizado que registre log retorna null
                return;
            }
            // crea datos del log
            this.Create(request);
            // Si el valor del campo transaccion es null no grabar en ese caso se trata de obtener la lista de companias
            // y no es la ejecucion de una transaccion o se trata de una lista de valores.
            if (!this.ValidaInsert()) {
                return;
            }
            this.Grabarlog(response, tiempo, tipo);
        }

        private void ActualizaFechaAccionSession(Request request) {
            if (request.Ccanal.CompareTo("OFI") == 0) {
                ActualizaFechaAccionSessionInterna(request.Cusuario, request.Ccompania, request.Freal);
            } else if (request.Ccanal.CompareTo("BAN") == 0) {
                ActualizaFechaAccionSessionExterna(request.Cusuario, request.Ccompania, request.Freal);
            }
        }

        protected void ActualizaFechaAccionSessionInterna(string cusuario, int ccompania, DateTime? freal) {
            String query = "update tsegusuariosession set fultimaaccion=@fultimaaccion where cusuario=@cusuario and ccompania=@ccompania";
            Dictionary<string, object> mparams = new Dictionary<string, object>();
            mparams["@cusuario"] = cusuario;
            mparams["@ccompania"] = ccompania;
            mparams["@fultimaaccion"] = freal;

            this.EjecutaQuery(ccompania, query, mparams);
        }

        protected void ActualizaFechaAccionSessionExterna(string cusuario, int ccompania, DateTime? freal) {
            String query = "update tbanusuariosession set fultimaaccion=@fultimaaccion where cusuario=@cusuario";
            Dictionary<string, object> mparams = new Dictionary<string, object>();
            mparams["@cusuario"] = cusuario;
            mparams["@fultimaaccion"] = freal;

            this.EjecutaQuery(ccompania, query, mparams);
        }

        /// <summary>
        /// Actualiza un bean en un hilo idependiente
        /// </summary>
        private void EjecutaQuery(int ccompania, string query, Dictionary<string, object> mparams) {
            QueryAnidadoThread.Actualizar(ccompania, mparams, query);
        }

        /// <summary>
        /// Graba el log de la transaccion en un hilo diferente.
        /// </summary>
        private void Grabarlog(Response response, decimal tiempo, String tipo) {
            try {
                this.log.tiempo = tiempo;
                this.log.tipo = tipo;
                if (response != null && response.GetCod() != null) {
                    this.log.crespuesta = response.GetCod().Length > 20 ? response.GetCod().Substring(0, 11) : response.GetCod();
                }
                if (response != null && response.GetMsgusu() != null) {
                    this.log.mensusuario =
                            response.GetMsgusu().Length > 249 ? response.GetMsgusu().Substring(0, 249) : response.GetMsgusu();
                }
                // Graba el log en una coneccion independiente.
                InsertAnidadoThread.Grabar(log.ccompania, log);

            } catch (Exception e) {
                throw e;
            }
        }

        /// <summary>
        /// Verifica si almacena o no el log de auditoria.
        /// </summary>
        private Boolean ValidaInsert() {
            if (this.log == null || this.log.cmodulo == null || this.log.ctransaccion == null) {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Entrega la ip del servidor de aplicaciones.
        /// </summary>
        private static String GetIpServer() {
            String sIPAddress = "";

            if (Dns.GetHostAddresses(Dns.GetHostName()).Length > 0) {
                sIPAddress = Dns.GetHostAddresses(Dns.GetHostName())[0].ToString();
            }
            if (Dns.GetHostAddresses(Dns.GetHostName()).Length > 1 && sIPAddress.Length > 15) {
                sIPAddress = Dns.GetHostAddresses(Dns.GetHostName())[1].ToString();
            }
            if (sIPAddress.Length > 15) {
                sIPAddress = sIPAddress.Substring(0, 15);
            }
            return sIPAddress;
        }

    }
}
