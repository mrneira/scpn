using amortizacion.dto;
using cartera.comp.consulta.solicitud;
using cartera.datos;
using cartera.enums;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using modelo;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.solicitud {
    /// <summary>
    /// Clase que se encarga de generar tabla de pagos asociada a una solicitud asociadas a la solicitud.
    /// </summary>
    public class SolicitudToTablaPagos : ComponenteMantenimiento {
        /// <summary>
        ///Numero de solicitud con la que se genera la tabla de pagos. 
        /// </summary>
        private long csolicitud;

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            csolicitud = tcarsolicitud.csolicitud;
            // Elimina tabla de pagos anterior asociada a la solicitud.
            TcarSolicitudRubroDal.Delete(csolicitud);
            TcarSolicitudCuotaDal.Delete(csolicitud);
            // Genera tabla de pagos.
            List<amortizacion.dto.Cuota> lcuota = solicitud.GenerarTabla(rqmantenimiento);
            tcarsolicitud.numcuotaprorrateo = (tcarsolicitud.numcuotaprorrateo == null) ? 0 : tcarsolicitud.numcuotaprorrateo;
            CuotasToTablaSolicitud(rqmantenimiento, lcuota, tcarsolicitud.cestadooperacion, (int)tcarsolicitud.numcuotaprorrateo, (int)tcarsolicitud.numerocuotas);
            // completar en el response plazo, fecha de generacion y el numero de solicitud.                    
            rqmantenimiento.Response["csolicitud"] = tcarsolicitud.csolicitud;
            rqmantenimiento.Response["plazo"] = tcarsolicitud.plazo;
            rqmantenimiento.Response["fgeneraciontabla"] = tcarsolicitud.fgeneraciontabla;
        }

        /// <summary>
        ///Adiciona al request la tabla de pagos para que este disponible para almacenar en la base de datos. 
        /// </summary>
        /// <param name="rqmantenimiento">Request a adicionar la tabla de pagos.</param>
        /// <param name="lcuotasgeneral">Lista de cuotas a transformar en cuotas de la solcitud.</param>
        private void CuotasToTablaSolicitud(RqMantenimiento rqmantenimiento, List<amortizacion.dto.Cuota> lcuotasgeneral, string cestadooperacion, int numcuotasprorrateo = 0, int numcuotas = 0)
        {
            List<tcarsolicitudcuota> lcuota = new List<tcarsolicitudcuota>();
            List<tcarsolicitudrubro> lrubro = new List<tcarsolicitudrubro>();
            foreach (amortizacion.dto.Cuota cuota in lcuotasgeneral) {
                LlenarTcarSolicitudCuota(cuota, lcuota);
                LlenarTcarSolicitudRubro(cuota, lrubro);
            }

            // Simulacion retorna tabla
            if (rqmantenimiento.Mdatos.ContainsKey("essimulacion") && (bool)rqmantenimiento.Mdatos["essimulacion"]) {
                this.simularTablaPagos(rqmantenimiento, lcuota, lrubro);
            }

            // Adiciona cabecera de la tabla para que el motor de mantenimiento lo envie a la base.
            rqmantenimiento.AdicionarTabla("TcarSolicitudCuotaDto", lcuota, false);
            if (!cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion) && ((numcuotas + 1) - numcuotasprorrateo) != numcuotas)
            {
                IDictionary rubrosarreglopago = (IDictionary)rqmantenimiento.GetDatos("MSALDOS-ARREGLO-PAGOS-TABLA");
                //Encerar rubros vencidos a prorrateados
                foreach (tcarsolicitudrubro rub in lrubro)
                {
                    foreach (object key in rubrosarreglopago.Keys)
                    {
                        if (rub.csaldo.Equals(key))
                        {
                            rub.valorcuota = 0;
                            break;
                        }
                    }
                }
                //Realizar prorrateo
                long prorrateo = (rqmantenimiento.GetDatos("prorrateo") != null) ? long.Parse(rqmantenimiento.GetDatos("prorrateo").ToString()) : numcuotasprorrateo;
                List<tcarsolicitudrubro> rubrosprorrateo = new List<tcarsolicitudrubro>();
                foreach (object key in rubrosarreglopago.Keys)
                {
                    decimal valorprorrateo = decimal.Round((decimal)rubrosarreglopago[key] / (numcuotas - prorrateo + 1), 2);
                    for (int i = (int)prorrateo; i <= numcuotas; i++)
                     {
                        foreach (tcarsolicitudrubro rub in lrubro)
                        {
                            if (i == rub.numcuota && rub.csaldo.Equals(key))
                            {
                                bool existRubro = false;
                                foreach (tcarsolicitudrubro r in rubrosprorrateo)
                                {
                                    if (r.csaldo == rub.csaldo)
                                    {
                                        decimal total = (decimal)r.valorcuota + valorprorrateo;
                                        if (i == numcuotas)
                                        {
                                            if (total != (decimal)rubrosarreglopago[key])
                                            {
                                                total = total - valorprorrateo;
                                                rub.valorcuota = decimal.Round((((decimal)rubrosarreglopago[key]) - total), 2);
                                                total = total + (decimal)rub.valorcuota;
                                            }
                                            else
                                            {
                                                rub.valorcuota = valorprorrateo;
                                            }
                                        }
                                        else
                                        {
                                            rub.valorcuota = valorprorrateo;
                                        }
                                        r.valorcuota = total;
                                        existRubro = true;
                                        break;
                                    }
                                }
                                if (!existRubro)
                                {
                                    tcarsolicitudrubro help = new tcarsolicitudrubro();
                                    help.csaldo = rub.csaldo;
                                    help.valorcuota = valorprorrateo;
                                    rub.valorcuota = valorprorrateo;
                                    rubrosprorrateo.Add(help);
                                }
                                break;
                            }
                        }
                    }
                }
                rqmantenimiento.AdicionarTabla("TcarSolicitudRubroDto", lrubro, false);
            }
            else
            {
                rqmantenimiento.AdicionarTabla("TcarSolicitudRubroDto", lrubro, false);
            }
        }

        /// <summary>
        /// Crea y adiciona una cuota a la solcitud.
        /// </summary>
        /// <param name="cuota">Datos de cuota a transformar en una cuota de la solictud.</param>
        /// <param name="ltabla">Objeto que contiene la cabera de una tabla de pagos.</param>
        private void LlenarTcarSolicitudCuota(amortizacion.dto.Cuota cuota, List<tcarsolicitudcuota> ltabla)
        {
            tcarsolicitudcuota obj = new tcarsolicitudcuota();
            obj.csolicitud = csolicitud;
            obj.numcuota = cuota.Numero;
            obj.capitalreducido = cuota.Capitalreducido;
            obj.dias = cuota.Dias;
            obj.finicio = cuota.Finicio;
            obj.fvencimiento = cuota.Fvencimiento;
            ltabla.Add(obj);
        }

        /// <summary>
        /// Asocia rubros a una cuota de la solicitud.
        /// </summary>
        /// <param name="cuota">Datos de cuota a transformar en rubros.</param>
        /// <param name="ltablarubro">Objeto que contiene la lista de cuotas de una solicitud.</param>

        private void LlenarTcarSolicitudRubro(amortizacion.dto.Cuota cuota, List<tcarsolicitudrubro> ltablarubro)
        {
            List<CuotaRubro> lcuotarubro = cuota.GetCuotarubros();
            foreach (CuotaRubro cuotaRubro in lcuotarubro) {
                tcarsolicitudrubro obj = new tcarsolicitudrubro();
                obj.csolicitud = csolicitud;
                obj.numcuota = cuota.Numero;
                obj.csaldo = cuotaRubro.Csaldo;
                obj.valorcuota = cuotaRubro.Valor;
                ltablarubro.Add(obj);
            }
        }

        /// <summary>
        /// Simula tabla de pagos
        /// </summary>
        /// <param name="rqmantenimiento">Request a adicionar la tabla de pagos.</param>
        /// <param name="lcuota">Lista de cuotas.</param>
        /// <param name="lrubro">Lista de rubros.</param>
        private void simularTablaPagos(RqMantenimiento rqmantenimiento, List<tcarsolicitudcuota> lcuota, List<tcarsolicitudrubro> lrubro)
        {
            TcarSolicitudCuotaDal.CompletaRubros(lcuota, lrubro);
            // Lista de respuesta con la tabla de pagos
            List<Dictionary<String, Object>> lresp = new List<Dictionary<String, Object>>();
            foreach (tcarsolicitudcuota cuota in lcuota) {
                Dictionary<String, Object> mresponse = TablaPagos.CuotaToMap(cuota);
                lresp.Add(mresponse);
            }
            // Fija la respuesta en el response. La respuesta contiene la tabla de pagos.
            rqmantenimiento.Response["TABLA"] = lresp;
        }
    }
}
