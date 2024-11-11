using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using dal.prestaciones;
using modelo;
using Newtonsoft.Json;
using socio.datos;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.validar
{
    /// <summary>
    /// Clase que se encarga de ejecutar los datos del garante.
    /// </summary>
    public class DatosGarante : ComponenteMantenimiento
    {
        /// <summary>
        /// Validación de datos del garante
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            int aportesparam = (int)TcarParametrosDal.GetValorNumerico("APORTES-GARANTE", rqmantenimiento.Ccompania);

            // Datos deudor
            Socios deudor = new Socios((long)tcarsolicitud.cpersona, rqmantenimiento);
            int aportesdeudor = deudor.GetTotalAportes();
            decimal deudorMontoAportes = deudor.GetAcumAportes();

            // Garantes ingresados
            //IList<Dictionary<string, object>> lgarantes = TcarSolicitudPersonaDal.FindGarantesBySolicitud(csolicitud, rqmantenimiento.Ccompania).ToList();
            //ValidaAportes(aportesparam, lgarantes, aportesdeudor);

            // Garantes nuevos
            if (rqmantenimiento.GetTabla("GARANTE") != null && rqmantenimiento.GetTabla("GARANTE").Lregistros.Count > 0)
            {
                tcarsolicitudcapacidadpago capacidadpago = (tcarsolicitudcapacidadpago)rqmantenimiento.GetTabla("GARANTE").Lregistros.ElementAt(0);
                long cpersonagarante = (long)capacidadpago.cpersona;

                IList<Dictionary<string, object>> garante = TpreAportesDal.GetTotalAportes(cpersonagarante);
                OperacionesGarante(tcarsolicitud, capacidadpago, rqmantenimiento);
                SolicitudesGarante(tcarsolicitud.csolicitud, cpersonagarante, rqmantenimiento.Ccompania);
                ValidaAportes(aportesparam, garante, aportesdeudor);
            }
        }

        /// <summary>
        /// Valida aportes de garante.
        /// </summary>
        /// <param name="aportesparam">Parametro de aportes por garante</param>
        /// <param name="lgarantes">Lista de datos de aportes de garantes</param>
        /// <param name="aportesdeudor">Aportes del deudor</param>
        private static void ValidaAportes(int aportesparam, IList<Dictionary<string, object>> lgarantes, int aportesdeudor)
        {
            int aportesgarante = 0;
            if (lgarantes.Count > 0)
            {
                foreach (Dictionary<string, object> obj in lgarantes)
                {
                    aportesgarante = Int32.Parse(obj["naportes"].ToString());
                    if ((aportesparam <= aportesgarante))
                    {
                        continue;
                    }
                    else
                    {
                        if (aportesgarante != aportesdeudor)
                        {
                            throw new AtlasException("CAR-0040", "GARANTE NO CUMPLE CON NÚMERO DE APORTES MÍNIMO");
                        }
                    }
                }

            }
        }

        /// <summary>
        /// Valida operaciones de garante.
        /// </summary>
        /// <param name="solicitud">Instancia de solicitud</param>
        /// <param name="capacidadpago">Instancia de capacidad de pago de garante</param>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        private static void OperacionesGarante(tcarsolicitud solicitud, tcarsolicitudcapacidadpago capacidadpago, RqMantenimiento rq)
        {
            int numoperaciones = Constantes.CERO;
            List<tcarsolicitudabsorcion> labsorcion = new List<tcarsolicitudabsorcion>();
            IList<Dictionary<string, object>> loperacion = TcarOperacionPersonaDal.FindGaranteOnSolicitudes((long)capacidadpago.cpersona, rq.Ccompania);

            if (rq.GetTabla("OPERACIONESPORPERSONA") != null && rq.GetTabla("OPERACIONESPORPERSONA").Lregistros.Count() > 0)
            {
                labsorcion = rq.GetTabla("OPERACIONESPORPERSONA").Lregistros.Cast<tcarsolicitudabsorcion>().ToList();
            }

            foreach (Dictionary<string, object> obj in loperacion)
            {
                string op = obj["coperacion"].ToString();

                foreach (tcarsolicitudabsorcion abs in labsorcion)
                {
                    if (abs.Mdatos.ContainsKey("pagar") && (bool)abs.Mdatos["pagar"])
                    {
                        if (op.Equals(abs.coperacion))
                        {
                            numoperaciones -= 1;
                        }
                    }

                    // Negociacion de pagos
                    if (!EnumEstadoOperacion.ORIGINAL.CestadoOperacion.Equals(solicitud.cestadooperacion))
                    {
                        if (op.Equals(abs.coperacion))
                        {
                            numoperaciones -= 1;
                        }
                    }
                }

                // Solicitudes de cartera
                if (capacidadpago.Mdatos.ContainsKey("labsorciongarante"))
                {
                    List<tcarsolicitudabsorcion> loperacionesgarantiapersonal = JsonConvert.DeserializeObject<List<tcarsolicitudabsorcion>>(capacidadpago.Mdatos["labsorciongarante"].ToString());
                    foreach (tcarsolicitudabsorcion abs in loperacionesgarantiapersonal)
                    {
                        if (abs.Mdatos.ContainsKey("pagar") && (bool)abs.Mdatos["pagar"])
                        {
                            if (op.Equals(abs.coperacion))
                            {
                                numoperaciones -= 1;
                            }
                        }
                    }
                }
                //CCA 20230126
                foreach (tcarsolicitudabsorcion abs in labsorcion)
                {
                    if (op.Equals(abs.coperacion))
                    {
                        numoperaciones -= 1;
                    }

                }
                numoperaciones += 1;
            }

            if (numoperaciones > 0)
            {
                throw new AtlasException("CAR-0042", "GARANTE ESTÁ RELACIONADO CON LA {0}: {1} EN ESTADO: {2}", "OPERACIÓN", loperacion[0]["coperacion"], loperacion[0]["nombre"]);
            }
        }

        /// <summary>
        /// Valida solicitudes de garante.
        /// </summary>
        /// <param name="csolicitud">Código de solicitud</param>
        /// <param name="cpersona">Código de garante</param>
        /// <param name="ccompania">Código de compania</param>
        private static void SolicitudesGarante(long csolicitud, long cpersona, int ccompania)
        {
            IList<Dictionary<string, object>> lsolicitud = TcarSolicitudPersonaDal.FindGaranteOnSolicitudes(csolicitud, cpersona, ccompania);
            if (lsolicitud.Count > 0)
            {
                throw new AtlasException("CAR-0042", "GARANTE ESTÁ RELACIONADO CON LA {0}: {1} EN ESTADO: {2}", "SOLICITUD", lsolicitud[0]["csolicitud"], lsolicitud[0]["estado"]);
            }
        }
    }
}
