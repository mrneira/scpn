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
using util.dto.consulta;
using util.thread;

namespace core.servicios.consulta {

    /// <summary>
    /// Clase que se encarga de ejecutar servicios de consulta.
    /// </summary>
    public class Consulta :Servicio {

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
        public override Response Ejecutar(string json) {
            // ccompania:1,csucursal:1,cagencia:1, usuario:USER1,crol:1,cidioma:ES,ccanal:BRC,cmodulo:1,ctransaccion:4,version:1,terminal:ter01
            // c:1^1^1^USER1^1^ES^BRC^1^4^1^ter01,cia:1,
            logtransaccion = new LogTransaccion();

            Stopwatch stopwatch = Stopwatch.StartNew();
            base.Sw = stopwatch;

            try {
                ThreadNegocio.RemoveDatos();
                Datos d = new Datos();
                ThreadNegocio.FijarDatos(d);

                Dictionary<String, Object> mdatos = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);
                RqConsulta rqconsulta = JsonConvert.DeserializeObject<RqConsulta>(json);

                rqconsulta.CompletarRequest(mdatos);
                rqconsulta.Mdatos["sessionid"] = SessionId;
                rqconsulta.Mdatos["useragent"] = userAgent;
                rqconsulta.Cterminalremoto = cterminalremoto;
                if(String.IsNullOrEmpty(rqconsulta.Cterminal.Trim())) {
                    rqconsulta.Cterminal = rqconsulta.Cterminalremoto;
                }
                Procesar(rqconsulta);

                // var jsonResp = JsonConvert.SerializeObject(rqconsulta.Response);
                return rqconsulta.Response;
            } catch(Exception e) {
                throw e;
            } finally {
                ThreadNegocio.RemoveDatos();
            }
        }

        /// <summary>
        /// Ejecuta consulta.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        public void Procesar(RqConsulta rqconsulta) {
            base.Request = rqconsulta;
            base.Response = new Response();
            rqconsulta.Response = base.Response;
            rqconsulta.Mensaje = GetMensaje(rqconsulta.Cusuario);
            base.Validarlogin(true);
            tgentransaccion trans = TgentransaccionDal.Find(rqconsulta.Cmodulo, rqconsulta.Ctransaccion);
            rqconsulta.Tgentransaccion = trans;

            // Fija en el request los datos de la fecha contable.
            Consulta.FijarFechas(rqconsulta);

            // Valida horario de acceso
            ValidarHorarioAcceso(rqconsulta);

            string codigoconsulta = rqconsulta.GetString("CODIGOCONSULTA");
            if(codigoconsulta == null) {
                Consulta.ConsultaGenerica(rqconsulta);
            } else {
                // Si la consulta se realiza utilizando iun codigo de consulta.
                Consulta.ProcesarPorCodigo(rqconsulta, (String)codigoconsulta, trans);
            }

        }

        /// <summary>
        /// Fija fecha contable en el request, adicionalmente 
        /// </summary>
        /// <param name="rq">Request a fijar fechas.</param>
        private static void FijarFechas(RqConsulta rq) {
            tgenfechacontable fcont = TgenfechacontableDal.Find(rq.Ccompania);
            rq.Tgenfechacontable = fcont;
            rq.Fconatable = (int)fcont.fcontable;
            rq.Ftrabajo = fcont.ftrabajo;
            rq.Freal = (DateTime)fcont.GetDatos("FREAL");
        }

        /// <summary>
        /// Ejecuta consulta generica con el motor de consultas.
        /// </summary>
        /// <param name="rqconsulta"></param>
        private static void ConsultaGenerica(RqConsulta rqconsulta) {
            MotorConsulta mc = new MotorConsulta();
            mc.Consultar(rqconsulta);
        }

        /// <summary>
        /// Ejecuta un componente de negocio de consulta.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <param name="codigoconsulta">Codigo de consulta a buscar el componente de negocio a ejecutar dinamicamente.</param>
        /// <param name="tgenetransaccion">Objeto que contiene la deficion de la transaccion a ejecutar.</param>
        private static void ProcesarPorCodigo(RqConsulta rqconsulta, String codigoconsulta, tgentransaccion tgenetransaccion) {
            Consulta.ValidaDefinicionPorTransaccion(rqconsulta, tgenetransaccion, codigoconsulta);

            IList<tgencompcodigoconsulta> ldata = TgenCompCodigoConsultaDal.Find(codigoconsulta, rqconsulta.Ccanal);
            if((codigoconsulta == null) || ldata.Count == 0) {
                throw new AtlasException("GEN-003",
                        "COMPONENTES DE CONSULTA NO DEFINIDOS EN TGENCOMPCODIGOCONSULTA PARA EL CODIGO: {0} CANAL:{1}", codigoconsulta,
                        rqconsulta.Ccanal);
            }
            foreach(tgencompcodigoconsulta obj in ldata) {
                ProcesarComponente(rqconsulta, obj.ccomponente);
            }
        }

        /// <summary>
        /// Valida que el componente de negocio de consulta este definido para el canal.
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// <param name="tgenetransaccion"></param>
        /// <param name="codigoconsulta"></param>
        private static void ValidaDefinicionPorTransaccion(RqConsulta rqconsulta, tgentransaccion tgenetransaccion, String codigoconsulta) {
            IList<tgencompconsulta> ldata = TgenCompConsultaDal.Find(tgenetransaccion, rqconsulta.Ccanal, codigoconsulta);
            if((ldata == null) || ldata.Count == 0) {
                throw new AtlasException("GEN-007", "COMPONENTES DE CONSULTA NO DEFINIDOS EN TGENCOMPCONSULTA PARA EL CODIGO: {0} MODULO: {1} TRANSACCION: {2} CANAL:{3}",
                        codigoconsulta, tgenetransaccion.cmodulo, tgenetransaccion.ctransaccion, rqconsulta.Ccanal);
            }
        }

        /// <summary>
        /// Crea una instancia e invoca al metodo ejecutar del componente de consulta.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <param name="componete">Clase de consulta a ejecutar.</param>
        private static void ProcesarComponente(RqConsulta rqconsulta, string componete) {
            ComponenteConsulta c = null;
            try {
                string assembly = componete.Substring(0, componete.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componete);
                object comp = handle.Unwrap();
                c = (ComponenteConsulta)comp;

            } catch(TypeLoadException e) {
                throw new AtlasException("GEN-001", "CLASE {0} A EJECUTAR NO EXISTE  MODULO: {1} TRANS: {2} ", e, componete,
                                 rqconsulta.Cmodulo, rqconsulta.Ctransaccion);
            } catch(InvalidCastException e) {
                throw new AtlasException("GEN-002", "PROCESO {0} A EJECUTAR MODULE: {1} TRANS: {2}  NO IMPLEMENTA {4}", e, componete,
                                 rqconsulta.Cmodulo, rqconsulta.Ctransaccion, c.GetType().FullName);
            }
            c.Ejecutar(rqconsulta);
        }

        private static void ValidarHorarioAcceso(RqConsulta rq) {
            // Solo valida horario para oficina, no valida para banca en linea, ni movil. ni canales digitales
            if(rq.Ccanal.CompareTo("OFI") != 0) {
                return;
            }
            String componente = "seguridad.comp.consulta.usuario.HorarioAcceso";
            ComponenteConsulta c = null;
            try {
                string assembly = componente.Substring(0, componente.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componente);
                object comp = handle.Unwrap();
                c = (ComponenteConsulta)comp;
                c.Ejecutar(rq);
            } catch(TypeLoadException e) {
                throw new AtlasException("GEN-001", "CLASE {0} A EJECUTAR NO EXISTE  MODULO: {1} TRANS: {2} ", e, componente);
            } catch(InvalidCastException e) {
                throw new AtlasException("GEN-002", "PROCESO {0} A EJECUTAR MODULE: {1} TRANS: {2} NO IMPLEMENTA {4}", e, componente,
                        c.GetType().FullName);
            }
        }

    }
}
