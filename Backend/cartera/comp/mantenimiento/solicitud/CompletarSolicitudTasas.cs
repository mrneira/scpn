using cartera.datos;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using dal.generales;
using general.util;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de completar datos de tasas asociadas a la solicitud.
    /// </summary>
    public class CompletarSolicitudTasas : ComponenteMantenimiento {

        /// <summary>
        /// Objeto que contiene datos de una solicitud
        /// </summary>
        private tcarsolicitud tcarSolicitud;
        /// <summary>
        /// Plazo de la solicitu.
        /// </summary>
        private int? plazo;
        /// <summary>
        /// Request con el que se ejecuta la transaccion.
        /// </summary>
        private RqMantenimiento rqmantenimiento;


        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            this.rqmantenimiento = rqmantenimiento;
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            this.tcarSolicitud = solicitud.Tcarsolicitud;
            this.LlenaPlazo(rqmantenimiento);

            tcarproducto tcp = TcarProductoDal.Find((int)tcarSolicitud.cmodulo, (int)tcarSolicitud.cproducto, (int)tcarSolicitud.ctipoproducto);

            // tasa por segmento
            bool tasadelsegemento = (bool)tcp.tasasegmento;
            bool tasadelsegementofrec = (bool)tcp.tasasegmentofrec;
            // Elimina registros anterioreres asociados a la solicitud.
            TcarSolicitudTasaDal.Delete(solicitud.Tcarsolicitud.csolicitud);
            List<tcarsolicitudtasa> ltasas = new List<tcarsolicitudtasa>();

            if (!tasadelsegemento && !tasadelsegementofrec) {
                this.CompletarTasasDesdeProducto(solicitud, ltasas);

            } else if (tasadelsegemento) {

                this.CompletarTasasDesdeSegmento(solicitud, ltasas);

            } else if (tasadelsegementofrec) {

                this.CompletarTasasDesdeSegmentoFrecuencia(solicitud, ltasas);

            }

            // Adicion la lista de tasas a la solicitud.
            solicitud.Ltasas = ltasas;
            rqmantenimiento.AdicionarTabla("TCARSOLICITUDTASA", ltasas, false);
        }

        /// <summary>
        /// Llena plazo por default de la operacion, al momento de generar la tabla se asigna el plazo real.
        /// </summary>
        /// <param name="rqmantenimiento">Datos con los que se procesa la transaccion.</param>
        private void LlenaPlazo(RqMantenimiento rqmantenimiento) {
            this.plazo = rqmantenimiento.GetInt("plazo");
            if (this.plazo == null) {
                if (this.tcarSolicitud.cfrecuecia == 0) {
                    throw new AtlasException("CAR-0027", "PARA CREDITOS PAGADEROS AL VENCIMIENTO ES OBLIGATORIO INGRESAR EL PLAZO");
                } else {
                    int dias = TgenFrecuenciaDal.Find((int)this.tcarSolicitud.cfrecuecia).dias;
                    int cuotas = (int)this.tcarSolicitud.numerocuotas;
                    this.plazo = dias * cuotas;
                    rqmantenimiento.AddDatos("plazo", plazo);
                }
            }
        }

        /// <summary>
        /// Completa tasas de solicitud de credito desde el tarifario de tasas definido por producto.
        /// </summary>
        /// <param name="solicitud">Datos de solicitud decredito</param>
        /// <param name="ltasas">Objeto a completar lista de tasas.</param>
        private void CompletarTasasDesdeSegmento(Solicitud solicitud, List<tcarsolicitudtasa> ltasas) {
            IList<tcarsegmentotasas> ldatos = TcarSegmentoTasasDal.Find(solicitud.Tcarsolicitud.csegmento, solicitud.Tcarsolicitud.cmoneda);
            foreach (tcarsegmentotasas tasaSegmento in ldatos) {
                tcarsolicitudtasa tasa = TcarSolicitudTasaDal.CreateTcarSolicitudTasa(tasaSegmento);
                this.CompletaInformacion(tasa, solicitud.Tcarsolicitud);
                ltasas.Add(tasa);
            }
        }

        /// <summary>
        /// Completa tasas de solicitud de credito desde el tarifario de tasas definido por producto.
        /// </summary>
        /// <param name="solicitud">Datos de solicitud de credito.</param>
        /// <param name="ltasas">Objeto a completar lista de tasas.</param>
        private void CompletarTasasDesdeSegmentoFrecuencia(Solicitud solicitud, List<tcarsolicitudtasa> ltasas) {
            IList<tcarsegmentotasasfrec> ldatos = TcarSegmentoTasasFrecDal.Find(tcarSolicitud.csegmento, tcarSolicitud.cmoneda, (int)tcarSolicitud.cfrecuecia, (int)this.plazo);
            foreach (tcarsegmentotasasfrec tasaSegmento in ldatos) {
                tcarsolicitudtasa tasa = TcarSolicitudTasaDal.CreateTcarSolicitudTasaFrec(tasaSegmento);
                this.CompletaInformacion(tasa, solicitud.Tcarsolicitud);
                ltasas.Add(tasa);
            }
        }

        /// <summary>
        /// Completa tasas de solicitud de credito desde el tarifario de tasas definido por producto.
        /// </summary>
        /// <param name="solicitud">Datos de solicitud decredito</param>
        /// <param name="ltasas">Objeto a completar lista de tasas.</param>
        private void CompletarTasasDesdeProducto(Solicitud solicitud, List<tcarsolicitudtasa> ltasas) {
            IList<tcarproductotasas> ldatos = TcarProductoTasasDal.Find((int)solicitud.Tcarsolicitud.cmodulo, (int)solicitud.Tcarsolicitud.cproducto, (int)solicitud.Tcarsolicitud.ctipoproducto,
                solicitud.Tcarsolicitud.cmoneda);
            foreach (tcarproductotasas tasaproducto in ldatos) {
                tcarsolicitudtasa tasa = TcarSolicitudTasaDal.CreateTcarSolicitudTasa(tasaproducto);
                this.CompletaInformacion(tasa, solicitud.Tcarsolicitud);
                ltasas.Add(tasa);
            }
        }

        /// <summary>
        /// Completa el pk en la lista de tasas asociadas a la solicitud.
        /// </summary>
        /// <param name="solicitudtasa">Objeto que contiene la definicion de una tasa asociada a la solicitud.</param>
        /// <param name="solicitud">Objeto que contiene informacion de la solicitud.</param>
        private void CompletaInformacion(tcarsolicitudtasa solicitudtasa, tcarsolicitud solicitud) {
            if (solicitudtasa.csolicitud == 0) {
                solicitudtasa.csolicitud = solicitud.csolicitud;
            }
            tgentasareferencial tr = TgenTasareferencialDal.Find(solicitudtasa.ctasareferencial, solicitudtasa.cmoneda);
            solicitudtasa.tasabase = (decimal)tr.tasa;
            if (solicitudtasa.csaldo.CompareTo("INT-CAR") == 0) {
                // nunca llega la tasa simepre se obtiene, si llega la tasa se respeta.
                decimal? tasa = this.rqmantenimiento.GetDecimal("tasa");

                if (tasa != null && ((decimal)tasa).CompareTo(Constantes.CERO) > 0) {
                    solicitudtasa.tasa = solicitud.tasa;
                    solicitudtasa.margen = Tasa.GetMargen(solicitudtasa.tasabase, solicitudtasa.tasa, solicitudtasa.operador);
                } else {
                    solicitudtasa.tasa = Tasa.GetTasa(solicitudtasa.tasabase, solicitudtasa.margen, solicitudtasa.operador);
                    solicitud.tasa = solicitudtasa.tasa;
                    // adiciona la tasa al response para presentar en la pagina de solicitud.
                    this.rqmantenimiento.Response["tasa"] = solicitudtasa.tasa;
                }
            } else {
                solicitudtasa.tasa = Tasa.GetTasa(solicitudtasa.tasabase, solicitudtasa.margen, solicitudtasa.operador);
            }

            // Completa la tasa efectiva de la solici
            solicitudtasa.tasaefectiva = Tasa.GetTasaEfectiva(solicitudtasa.tasa, (int)solicitud.cfrecuecia);
        }


    }
}
