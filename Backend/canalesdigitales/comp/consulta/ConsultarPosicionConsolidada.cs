using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.models;
using core.componente;
using dal.canalesdigitales;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto;
using util.dto.consulta;

namespace canalesdigitales.comp.consulta {

    class ConsultarPosicionConsolidada : ComponenteConsulta {

        private readonly ComponenteHelper componenteHelper = new ComponenteHelper();

        /// <summary>
        /// Método principal que ejecuta la Consulta de Posición Consolidada
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {

            ConsultarCreditos(rqconsulta);
        }

        /// <summary>
        /// Método que consulta los créditos
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ConsultarCreditos(RqConsulta rqconsulta) {

            //Se obtiene el registro del usuario
            tcanusuario usuario = TcanUsuarioDal.Find(rqconsulta.Cusuariobancalinea, rqconsulta.Ccanal);

            //Se obtiene la lista de créditos que tiene esta persona
            IList<tcaroperacion> creditos = TcarOperacionDal.FindPorPersona(Convert.ToInt64(usuario.cpersona), true);

            //Se obtienen todas las cuotas de los créditos
            IList<tcaroperacioncuota> cuotasCreditos = TcarOperacionCuotaDal.FindCuotasPorCoperaciones(creditos.Select(x => x.coperacion).ToList());

            //Se obtienen los estados de la operación
            IList<tcarestatus> estatusOperacion = TcarEstatusDal.FindAll();
            IList<tcarproducto> producto = TcarProductoDal.FindAllInModule(EnumGeneral.MODULO_PRESTAMOS);
            List<CreditoModel> todosCreditos = new List<CreditoModel>();

            creditos.ToList().ForEach(credito => {

                RqConsulta consultaDetalle = new RqConsulta();

                consultaDetalle.Coperacion = credito.coperacion;
                consultaDetalle.Response = new Response();

                componenteHelper.ProcesarComponenteConsulta(consultaDetalle, EnumComponentes.TABLA_PAGOS);

                ////La actual, la cuota anterior y la posterior
                List<Dictionary<string, object>> cuotas = ObtenerCuotasFiltradasPorFechas(consultaDetalle.Response);

                CreditoModel creditoMostrar = new CreditoModel {
                    Coperacion = credito.coperacion,
                    Producto = producto.FirstOrDefault(x => x.cproducto == credito.cproducto && x.ctipoproducto == credito.ctipoproducto).nombre,
                    Estado = estatusOperacion.FirstOrDefault(x => x.cestatus == credito.cestatus).nombre,
                    MontoOriginal = credito.montooriginal.Value,
                    Fvencimiento = credito.fvencimiento.Value,
                    Faprobacion = credito.faprobacion.Value,
                    Tasa = credito.tasa,
                    Cuotas = cuotas
                };

                todosCreditos.Add(creditoMostrar);

            });

            rqconsulta.Response.Add(nameof(todosCreditos), todosCreditos);
        }

        /// <summary>
        /// Método que filtra la data de las cuotas que se obtienen de la base
        /// </summary>
        /// <param name="response"></param>
        /// <returns></returns>
        private List<Dictionary<string, object>> ObtenerCuotasFiltradasPorFechas(Response response) {

            List<Dictionary<string, object>> tabla = ((List<Dictionary<string, object>>)response["TABLA"]);
            //var tablaFiltrada = tabla.Where(x=>Convert.ToDateTime(x["fvencimiento"]));

            List<Dictionary<string, object>> tablaFiltrada = new List<Dictionary<string, object>>();

            int mesFechaAnterior = Fecha.GetFechaSistema().AddMonths(-1).Month;
            int anioFechaAnterior = Fecha.GetFechaSistema().AddMonths(-1).Year;

            int mesActual = Fecha.GetFechaSistema().Month;
            int anioActual = Fecha.GetFechaSistema().Year;

            int mesFechaPosterior = Fecha.GetFechaSistema().AddMonths(1).Month;
            int anioFechaPosterior = Fecha.GetFechaSistema().AddMonths(1).Year;

            tablaFiltrada = tabla.Where(x => (Convert.ToDateTime(x["fvencimiento"]).Month == mesFechaAnterior && Convert.ToDateTime(x["fvencimiento"]).Year == anioFechaAnterior) ||
                                             (Convert.ToDateTime(x["fvencimiento"]).Month == mesActual && Convert.ToDateTime(x["fvencimiento"]).Year == anioActual) ||
                                             (Convert.ToDateTime(x["fvencimiento"]).Month == mesFechaPosterior && Convert.ToDateTime(x["fvencimiento"]).Year == anioFechaPosterior))
                                 .OrderBy(x => x["fvencimiento"]).ToList();

            return tablaFiltrada;
        }

    }

}