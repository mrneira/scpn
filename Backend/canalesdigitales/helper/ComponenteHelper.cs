using core.componente;
using dal.generales;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Runtime.Remoting;
using util;
using util.dto.consulta;
using util.dto.mantenimiento;

namespace canalesdigitales.helper {
    internal class ComponenteHelper {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public void ProcesaCodigoConsulta(RqConsulta rqconsulta, String codigoconsulta) {

            try {
                IList<tgencompcodigoconsulta> ldata = TgenCompCodigoConsultaDal.Find(codigoconsulta, rqconsulta.Ccanal);

                foreach (tgencompcodigoconsulta obj in ldata) {
                    ProcesarComponenteConsulta(rqconsulta, obj.ccomponente);
                }
            } catch (Exception e) {
                logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e} - {rqconsulta.Cusuariobancalinea} - {JsonConvert.SerializeObject(rqconsulta.Response)}");
                throw new AtlasException("CAN-046", "ERROR AL REALIZAR EL PROCESO, POR FAVOR INTENTE MÁS TARDE");
            }
        }

        /// <summary>
        /// Crea una instancia e invoca al metodo ejecutar del componente de consulta.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta</param>
        /// <param name="componete">Clase de consulta a ejecutar.</param>
        public void ProcesarComponenteConsulta(RqConsulta rqconsulta, string componete) {
            ComponenteConsulta c = null;
            try {
                string assembly = componete.Substring(0, componete.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componete);
                object comp = handle.Unwrap();
                c = (ComponenteConsulta)comp;

            } catch (Exception e) {
                logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e} - {componete} - {rqconsulta.Cusuariobancalinea} - {JsonConvert.SerializeObject(rqconsulta.Response)}");
                throw new AtlasException("CAN-046", "ERROR AL REALIZAR EL PROCESO, POR FAVOR INTENTE MÁS TARDE");
            }
            c.Ejecutar(rqconsulta);
        }

        /// <summary>
        /// Crea una instancia e invoca al metodo ejecutar del componente de mantenimiento.
        /// </summary>
        /// <param name="rqMantenimiento"></param>
        /// <param name="componete"></param>
        /// <param name="cflujo"></param>
        /// <param name="cbaseconocimiento"></param>
        /// <param name="storeprocedure"></param>
        public void ProcesarComponenteMantenimiento(RqMantenimiento rqMantenimiento, String componete) {
            ComponenteMantenimiento c = null;
            try {
                string assembly = componete.Substring(0, componete.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componete);
                object comp = handle.Unwrap();
                c = (ComponenteMantenimiento)comp;

            } catch (Exception e) {
                logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e} - {componete} - {rqMantenimiento.Cusuariobancalinea} - {JsonConvert.SerializeObject(rqMantenimiento.Response)}");
                throw new AtlasException("CAN-046", "ERROR AL REALIZAR EL PROCESO, POR FAVOR INTENTE MÁS TARDE");
            }
            c.Flujo = null;
            c.Cbaseconocimiento = null;
            c.Storeprocedure = null;
            c.Ejecutar(rqMantenimiento);
        }
    }
}
