using cartera.datos;
using cartera.enums;
using cartera.saldo;
using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.cartera;
using modelo;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion
{
    class ValidaAprobacionMasiva : ComponenteMantenimiento
    {

        /// <summary>
        /// Metodo que registra el pago de devolucion de valores a personas
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos.ContainsKey("APROBACIONMASIVA"))
            {

                // Datos de devolucion
                JArray a = (JArray)rqmantenimiento.Mdatos["APROBACIONMASIVA"];
                List<tcarsolicitud> lsolicitudes = JsonConvert.DeserializeObject<List<tcarsolicitud>>(rqmantenimiento.Mdatos["APROBACIONMASIVA"].ToString());
                if (lsolicitudes == null || lsolicitudes.Count() <= 0)
                {
                    return;
                }

                // Valida si las solicitudes a aprobar
                this.ValidaSolicitudes(rqmantenimiento, lsolicitudes);

                // Procesa aprobacion de solicitudes
                foreach (tcarsolicitud sol in lsolicitudes)
                {
                    sol.Esnuevo = false;
                    sol.Actualizar = true;
                    sol.cestatussolicitud = EnumEstatus.APROVADA.Cestatus;
                    Solicitud solicitud = new Solicitud(sol);
                    SolicitudFachada.SetSolicitud(solicitud);

                    this.EjecutaAprobacion(rqmantenimiento, sol.csolicitud);
                }
                rqmantenimiento.AdicionarTabla(typeof(tcarsolicitud).Name.ToUpper(), lsolicitudes, false);
            }
        }

        /// <summary>
        /// Ejecuta aprobacion de solicitud
        /// </summary>
        /// <param name="rqmantenimiento">Datos del requet con los que se ejecuta la transaccion.</param>
        /// <param name="csolicitud">Codigo de solicitud.</param>
        private void EjecutaAprobacion(RqMantenimiento rqmantenimiento, long csolicitud)
        {
            // Ejecuta transaccion de aprobacion de solicitud
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            rq.Mensaje = Servicio.GetMensaje(rqmantenimiento.Cusuario);
            rq.EncerarRubros();
            rq.AddDatos("csolicitud", csolicitud);
            rq.AddDatos("aprobar", true);
            Mantenimiento.ProcesarAnidado(rq, 7, 120);
        }

        /// <summary>
        /// Ejecuta validacion de lista de solicitudes a aprobar.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del requet con los que se ejecuta la transaccion.</param>
        /// <param name="lsolicitudes">Listado de solicitudes.</param>
        private void ValidaSolicitudes(RqMantenimiento rqmantenimiento, List<tcarsolicitud> lsolicitudes)
        {
            foreach (tcarsolicitud sol in lsolicitudes)
            {
                // Monto de desembolso
                SaldoDesembolso saldo = new SaldoDesembolso(sol, rqmantenimiento.Fconatable);
                if (sol.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion) && saldo.MontoDesembolsar != TcarSolicitudDesembolsoDal.GetTotalDesembolso(sol.csolicitud))
                {
                    throw new AtlasException("CAR-0082", "EXISTE DIFERENCIA EN EL REGISTRO DE DESEMBOLSO", sol.csolicitud);
                }

                // Pago pendiente de arreglo de pagos
                if (!sol.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion))
                {
                    List<tcaroperacionarreglopago> larreglo = TcarOperacionArregloPagoDal.FindPendientePago(sol.csolicitud);
                    if (larreglo != null && larreglo.Count > 0)
                    {
                        throw new AtlasException("CAR-0080", "SOLICITUD [{0}] TIENE VALORES DE PAGO PENDIENTE", sol.csolicitud);
                    }
                }
            }
        }

    }
}
