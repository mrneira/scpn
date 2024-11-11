using bce.util;
using cartera.datos;
using core.componente;
using dal.cartera;
using dal.garantias;
using dal.garantias.parametros;
using dal.persona;
using dal.seguros;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud {
    /// <summary>
    /// Clase que se encarga de calcular y adicionar seguros a una solicitud de credito.
    /// </summary>
    public class SolicitudSeguros : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            int csolicitud = (int)solicitud.Tcarsolicitud.csolicitud;

            // Control de garantias
            if (!ValidarGarantias(rqmantenimiento, solicitud.Tcarsolicitud)) {
                return;
            }

            // Elimina registros anteriores asociados a la solicitud.
            TcarSolicitudSegurosDal.Delete(csolicitud);
            TcarSolicitudGastosLiquidaDal.Delete(csolicitud);

            // Listas de datos
            List<tcarsolicitudseguros> lseguros = new List<tcarsolicitudseguros>();
            List<tcarsolicitudgastosliquida> lgastos = new List<tcarsolicitudgastosliquida>();

            // Garantias verificadas
            List<tcarsolicitudgarantias> lsolicitudgarantias = (List<tcarsolicitudgarantias>)rqmantenimiento.GetDatos("SOLGARANTIASVALIDADAS");
            foreach (tcarsolicitudgarantias solgar in lsolicitudgarantias) {
                // Datos de garantia
                tgaroperacion operaciongarantia = TgarOperacionDal.FindSinBloqueo(solgar.coperaciongarantia);
                tgartipobien tipobien = TgarTipoBienDal.Find(operaciongarantia.ctipogarantia, operaciongarantia.ctipobien);

                if ((bool)tipobien.aplicaseguro) {
                    // Registra seguro de garantia
                    tcarsolicitudseguros seguro = solgar.Mdatos.ContainsKey("registroSeguro") ? JsonConvert.DeserializeObject<tcarsolicitudseguros>(solgar.Mdatos["registroSeguro"].ToString()) : seguro = new tcarsolicitudseguros();
                    seguro.csolicitud = csolicitud;
                    seguro.coperaciongarantia = operaciongarantia.coperacion;
                    seguro.ctiposeguro = tipobien.ctiposeguro;
                    seguro.formapago = seguro.formapago ?? "D";
                    seguro.montoseguro = decimal.Parse(solgar.Mdatos["valorprima"].ToString());
                    lseguros.Add(seguro);

                    // Registra gasto de liquidacion
                    if (seguro.montoseguro > 0) {
                        lgastos.Add(TcarSolicitudGastosLiquidaDal.CreateTcarSolicitudGastosLiquida(seguro, TsgsTipoSeguroDetalleDal.Find((int)seguro.ctiposeguro).csaldo));
                    }

                    // Registra cash
                    if (seguro.formapago.Equals("A") && seguro.montoanticipo > 0) {
                        seguro.codigoanticipo = seguro.formapago + csolicitud.ToString("D5") + TperPersonaDetalleDal.Find((long)solicitud.Tcarsolicitud.cpersona, (int)solicitud.Tcarsolicitud.ccompania).identificacion;
                        seguro.fanticipo = Fecha.DateToInteger((DateTime)solgar.Mdatos["fanticipo"]);
                        GenerarCash.InsertarCash(rqmantenimiento, csolicitud.ToString(), seguro.codigoanticipo, (long)solicitud.Tcarsolicitud.cpersona,
                                                 decimal.Add((decimal)seguro.montoanticipo, (decimal)seguro.ajusteanticipo), rqmantenimiento.Fconatable, (int)seguro.fanticipo, true);
                    }
                }
            }

            // Adiciona seguro y gastos de liquidacion
            if (lseguros.Count > 0) {
                rqmantenimiento.AdicionarTabla(typeof(tcarsolicitudseguros).Name.ToUpper(), lseguros, false);
            }
            if (lgastos.Count > 0) {
                rqmantenimiento.AdicionarTabla(typeof(tcarsolicitudgastosliquida).Name.ToUpper(), lgastos, false);
            }
        }


        /// <summary>
        /// Completa el pk en la lista de personas asociadas a la solicitud.
        /// </summary>
        /// <param name="lpersona">Lista de personas a completar el pk.</param>
        /// <param name="solicitud">Objeto que contiene informacion de la solicitud.</param>
        private bool ValidarGarantias(RqMantenimiento rq, tcarsolicitud solicitud)
        {
            bool estatus = true;

            // Si es simulacion no valida seguros
            if (rq.Mdatos.ContainsKey("essimulacion") && (bool)rq.Mdatos["essimulacion"]) {
                estatus = false;
                return estatus;
            }

            // Verifica si existen modificaciones de garantias
            if (rq.GetTabla("GARANTIASSOL") == null) {
                estatus = false;
                return estatus;
            }

            // Verifica que los seguros asociados a las garantias no sean de pago anticipado
            List<tcarsolicitudseguros> lsolseg = TcarSolicitudSegurosDal.Find(solicitud.csolicitud);
            foreach (tcarsolicitudseguros seg in lsolseg) {
                if (seg.formapago.Equals("A")) {
                    throw new AtlasException("CAR-0079", "NO SE PERMITE MODIFICAR GARANTÍAS QUE TIENEN SEGUROS ASOCIADOS");
                }
            }

            return estatus;
        }

    }
}
