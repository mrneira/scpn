using core.componente;
using core.log;
using dal.generales;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.Remoting;
using util;
using util.dto;
using util.dto.mantenimiento;
using util.servicios.contable;
using util.servicios.ef;
using util.thread;
using dal.seguridades;

namespace core.servicios.mantenimiento {

    /// <summary>
    /// Clase que se encarga de ejecutar servicios de mantenimiento.
    /// </summary>
    public class Mantenimiento : Servicio {

        private string sessionId = "";

        private string userAgent = "";

        private string cterminalremoto = "";

        public LogTransaccion logtransaccion;

        public string SessionId { get => sessionId; set => sessionId = value; }

        public string UserAgent { get => userAgent; set => userAgent = value; }

        public string Cterminalremoto { get => cterminalremoto; set => cterminalremoto = value; }



        /// <summary>
        /// Ejecuta consulta de las tablas que llegan en el request, si llega un codigo de consulta invoca a clases de consulta especificas.
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        public override Response Ejecutar(string json)
        {
            // ccompania:1,csucursal:1,cagencia:1, usuario:USER1,crol:1,cidioma:ES,ccanal:BRC,cmodulo:1,ctransaccion:4,version:1,terminal:ter01
            // c:1^1^1^USER1^1^ES^BRC^1^4^1^ter01,cia:1,
            logtransaccion = new LogTransaccion();

            Stopwatch stopwatch = Stopwatch.StartNew();
            base.Sw = stopwatch;

            try
            {
                ThreadNegocio.RemoveDatos();
                Datos d = new Datos();
                ThreadNegocio.FijarDatos(d);

                Dictionary<String, Object> mdatos = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
                RqMantenimiento rqMantenimiento = JsonConvert.DeserializeObject<RqMantenimiento>(json);
                d.Compania = rqMantenimiento.Ccompania;

                rqMantenimiento.CompletarRequest(mdatos);
                //ValidarHorarioAcceso(rqMantenimiento);
                rqMantenimiento.Mdatos["sessionid"] = SessionId;
                rqMantenimiento.Mdatos["useragent"] = userAgent;
                rqMantenimiento.Cterminalremoto = cterminalremoto;
                if (String.IsNullOrEmpty(rqMantenimiento.Cterminal.Trim()))
                {
                    rqMantenimiento.Cterminal = rqMantenimiento.Cterminalremoto;
                }
                MantenimientoHelper mh = new MantenimientoHelper();
                mh.LlenaDtoMantenimiento(mdatos, rqMantenimiento);
                base.Response = new Response();
                rqMantenimiento.Response = base.Response;
                base.Request = rqMantenimiento;
                rqMantenimiento.Mensaje = GetMensaje(rqMantenimiento.Cusuario);
               // rqMantenimiento.Cagencia = TsegUsuarioDetalleDal.Find(rqMantenimiento.Cusuario, rqMantenimiento.Ccompania).cagencia.Value;
                ThreadNegocio.GetDatos().Request = rqMantenimiento;

                base.Validarlogin(true);
                // No graba transaccion
                if (rqMantenimiento.Mdatos.ContainsKey("rollback") && (bool)rqMantenimiento.Mdatos["rollback"]) {
                    Sessionef.thread_rollback = true;
                } else {
                    Sessionef.thread_rollback = false;
                }
                Procesar(rqMantenimiento, base.Response);
                return base.Response;
            }
            catch (Exception e) {
                throw;
            }
            finally {
                ThreadNegocio.RemoveDatos();
            }
        }

        public static void Procesar(RqMantenimiento rq, Response response)
        {
            // Fija en el request los datos de la tranaccion y la fecha contable de la aplicacion.
            tgentransaccion trans = TgentransaccionDal.Find(rq.Cmodulo, rq.Ctransaccion);
            rq.Tgentransaccion = trans;

            // Fija en el request los datos de la fecha contable y moneda.
            Mantenimiento.FijarFechas(rq);
            Mantenimiento.FijarMoneda(rq);

            // Valida horario de acceso
            Mantenimiento.ValidarHorarioAcceso(rq);

            // Ejecuta componentes de negocio.
            Mantenimiento.ProcesarPorComp(rq, trans);
            Mantenimiento.ProcesarBce(rq);

            // Validacion de ecuacion contable
            if(rq.Mensajereverso == null) {
                ThreadNegocio.GetDatos().validarEcuacionContable();
            }

            // Almacena datos en las tablas.
            rq.Grabar();
            // Si tiene secuencias automaticas se adiciona al response.
            RqMantenimiento.AddSecunciaToResposnse(response);

        }

        /// <summary>
        /// Fija fecha contable en el request, adicionalmente 
        /// </summary>
        /// <param name="rq">Request a fijar fechas.</param>
        private static void FijarFechas(RqMantenimiento rq)
        {
            tgenfechacontable fcont = TgenfechacontableDal.Find(rq.Ccompania);
            rq.Tgenfechacontable = fcont;
            rq.Fconatable = (int)fcont.fcontable;
            rq.Ftrabajo = fcont.ftrabajo;
            rq.Fproceso = rq.Ftrabajo;
            rq.Freal = (DateTime)fcont.GetDatos("FREAL");
        }

        /// <summary>
        /// Fija moneda en el request, adicionalmente 
        /// </summary>
        /// <param name="rq">Request a fijar moneda.</param>
        private static void FijarMoneda(RqMantenimiento rq)
        {
            rq.Cmoneda = TgenMonedaDal.Find("USD").cmoneda;
        }

        /// <summary>
        /// Obtiene componentes de negocio asociados a la transaccion y los ejecuta.
        /// </summary>
        /// <param name="rqMantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="trans">Objeto que contiene la definicion de la transaccion a ejecutar.</param>
        private static void ProcesarPorComp(RqMantenimiento rqMantenimiento, tgentransaccion trans)
        {
            IList<tgencompmantenimiento> ldata = TgenCompMantenimientoDal.Find(trans, rqMantenimiento.Ccanal);
            if (ldata == null || ldata.Count == 0) {
                return;
            }
            foreach (tgencompmantenimiento obj in ldata) {
                bool reverso = obj.reverso != null ? (bool)obj.reverso : false;
                Mantenimiento.ProcesarComponente(rqMantenimiento, obj.ccomponente, reverso, obj.cflujo, obj.cbaseconocimiento, obj.storeprocedure);
                if (ThreadNegocio.GetDatos() != null && ThreadNegocio.GetDatos().Request == null) {
                    ThreadNegocio.GetDatos().Request = rqMantenimiento;
                }
            }
        }

        ///// <summary>
        ///// Procesa las transacciones de SPI.
        ///// </summary>
        ///// <param name="rqMantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        //private static void ProcesarSpi(RqMantenimiento rqMantenimiento) {
        //    if(rqMantenimiento.Mspi.Count > 0) {
        //        util.ProcesarSpi.CompletaSpi(rqMantenimiento);
        //        rqMantenimiento.Mspi.Clear();
        //    }
        //}

        /// <summary>
        /// Procesa las transacciones de SPI.
        /// </summary>
        /// <param name="rqMantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        private static void ProcesarBce(RqMantenimiento rqMantenimiento)
        {
            if (rqMantenimiento.Mbce != null && rqMantenimiento.Mbce.Count > 0) {
                util.ProcesarBce.CompletaBce(rqMantenimiento);
            }
        }

        /// <summary>
        /// Ejeuta un componente de negocio.
        /// </summary>
        /// <param name="rqMantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="componete">Codigo de componente a ejecutar.</param>
        /// <param name="reverso">true indica que la transaccion se ejecuta en modo reverso.</param>
        /// <param name="cflujo">Codigo de flujo de trabajo</param>
        /// <param name="cbaseconocimiento">Base de conocimiento al que pertenecde el flujo.</param>
        private static void ProcesarComponente(RqMantenimiento rqMantenimiento, String componete, Boolean reverso, String cflujo, String cbaseconocimiento, String storeprocedure)
        {

            if (rqMantenimiento.Reverso.Equals("Y") && reverso) {
                Mantenimiento.ProcesaModoReverso(rqMantenimiento, componete);
            }
            if (rqMantenimiento.Reverso.Equals("N") && (!reverso)) {
                Mantenimiento.ProcesaModoNormal(rqMantenimiento, componete, cflujo, cbaseconocimiento, storeprocedure);
            }
        }

        /// <summary>
        /// Ejecuta componentes en modo normal.
        /// </summary>
        /// <param name="rqMantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="componete">Codigo de componente a ejecutar.</param>
        /// <param name="cflujo">Codigo de flujo de trabajo.</param>
        /// <param name="cbaseconocimiento">Base de conocimiento al que pertenecde el flujo.</param>
        private static void ProcesaModoNormal(RqMantenimiento rqMantenimiento, String componete, String cflujo, String cbaseconocimiento, String storeprocedure)
        {
            ComponenteMantenimiento c = null;
            try {
                string assembly = componete.Substring(0, componete.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componete);
                object comp = handle.Unwrap();
                c = (ComponenteMantenimiento)comp;

            }
            catch (TypeLoadException e) {
                throw new AtlasException("GEN-001", "CLASE {0} A EJECUTAR NO EXISTE  MODULO: {1} TRANS: {2} ", e, componete,
                                 rqMantenimiento.Cmodulo, rqMantenimiento.Ctransaccion);
            }
            catch (InvalidCastException e) {
                throw new AtlasException("GEN-002", "PROCESO {0} A EJECUTAR MODULE: {1} TRANS: {2}  NO IMPLEMENTA {4}", e, componete,
                                 rqMantenimiento.Cmodulo, rqMantenimiento.Ctransaccion, c.GetType().FullName);
            }
            c.Flujo = cflujo;
            c.Cbaseconocimiento = cbaseconocimiento;
            c.Storeprocedure = storeprocedure;
            c.Ejecutar(rqMantenimiento);
        }

        /// <summary>
        /// Ejecuta componentes implementados para ejecutar reversos de transacciones.
        /// </summary>
        /// <param name="rqMantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="componete">Codigo de componente a ejecutar.</param>
        private static void ProcesaModoReverso(RqMantenimiento rqMantenimiento, String componete)
        {
            ComponenteMantenimientoReverso c = null;
            try {
                string assembly = componete.Substring(0, componete.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componete);
                object comp = handle.Unwrap();
                c = (ComponenteMantenimientoReverso)comp;

            }
            catch (TypeLoadException e) {
                throw new AtlasException("GEN-001", "CLASE {0} A EJECUTAR NO EXISTE  MODULO: {1} TRANS: {2} ", e, componete,
                                 rqMantenimiento.Cmodulo, rqMantenimiento.Ctransaccion);
            }
            catch (InvalidCastException e) {
                throw new AtlasException("GEN-002", "PROCESO {0} A EJECUTAR MODULE: {1} TRANS: {2}  NO IMPLEMENTA {4}", e, componete,
                                 rqMantenimiento.Cmodulo, rqMantenimiento.Ctransaccion, c.GetType().FullName);
            }
            c.EjecutarReverso(rqMantenimiento);
        }

        /// <summary>
        /// Ejecuta transacciones anidadas. 
        /// </summary>
        /// <param name="rq"></param>
        /// <param name="cmodulonuevo"></param>
        /// <param name="ctransaccionueva"></param>
        public static void ProcesarAnidado(RqMantenimiento rq, int cmodulonuevo, int ctransaccionueva)
        {
            tgentransaccion tranoriginal = (tgentransaccion)rq.Tgentransaccion;
            int cmodulooriginal = rq.Cmodulo;
            int ctransaccionoriginal = rq.Ctransaccion;
            // cambia a la nueva transaccion.
            rq.Cmodulo = cmodulonuevo;
            rq.Ctransaccion = ctransaccionueva;
            // Fija en el request los datos de la tranaccion y la fecha contable de la aplicacion.
            tgentransaccion tran = TgentransaccionDal.Find(rq.Cmodulo, rq.Ctransaccion);
            rq.Tgentransaccion = tran;

            // Ejecuta componentes de negocio.
            Mantenimiento.ProcesarPorComp(rq, tran);

            // Si tiene secuencias automaticas se adiciona al response.
            RqMantenimiento.AddSecunciaToResposnse(rq.Response);
            // recupera datos anteriores.
            rq.Tgentransaccion = tranoriginal;
            rq.Cmodulo = cmodulooriginal;
            rq.Ctransaccion = ctransaccionoriginal;
        }


        private static void ValidarHorarioAcceso(RqMantenimiento rq)
        {
            if ((rq.Ctransaccion.Equals(16) & rq.Cmodulo.Equals(2)) || (rq.Ctransaccion.Equals(1) & rq.Cmodulo.Equals(2))) {
                return;
            }
            // Las transacciones de subscripcion de banca en linea no se validan
            if (rq.Cmodulo.Equals(23) && (rq.Ctransaccion.Equals(2) || rq.Ctransaccion.Equals(3) || rq.Ctransaccion.Equals(5) || rq.Ctransaccion.Equals(7) || rq.Ctransaccion.Equals(8))) {
                return;
            }
            // Las transacciones de subscripcion de banca movil no se validan
            if (rq.Cmodulo.Equals(29) && (rq.Ctransaccion.Equals(1) || rq.Ctransaccion.Equals(2))) {
                return;
            }
            // Solo valida horario para oficina, no valida para banca en linea ni movil
            if (rq.Ccanal.CompareTo("OFI") != 0) {
                return;
            }
            string componente = "seguridad.comp.man.HorarioAcceso";
            ComponenteMantenimiento c = null;
            try {
                string assembly = componente.Substring(0, componente.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componente);
                object comp = handle.Unwrap();
                c = (ComponenteMantenimiento)comp;
                c.Ejecutar(rq);
            }
            catch (TypeLoadException e) {
                throw new AtlasException("GEN-001", "CLASE {0} A EJECUTAR NO EXISTE  MODULO: {1} TRANS: {2} ", e, componente);
            }
            catch (InvalidCastException e) {
                throw new AtlasException("GEN-002", "PROCESO {0} A EJECUTAR MODULE: {1} TRANS: {2} NO IMPLEMENTA {4}", e, componente,
                        c.GetType().FullName);
            }
        }
    }
}
