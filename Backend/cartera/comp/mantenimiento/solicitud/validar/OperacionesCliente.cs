using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.validar
{
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones de numero de operaciones por socio.
    /// </summary>
    public class OperacionesCliente : ComponenteMantenimiento
    {

        /// <summary>
        /// Validación de número de operaciones
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            int count = 0;

            Solicitud solicitud = SolicitudFachada.GetSolicitud();

            // Operaciones de arreglo de pagos
            if (!solicitud.Tcarsolicitud.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion))
            {
                return;
            }
            //CCA 20220418
            if (!solicitud.Tcarsolicitud.Esnuevo)
            {
                return;
            }

            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            tcarproducto producto = TcarProductoDal.Find((int)tcarsolicitud.cmodulo, (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);

            // Valida existencia consolidados
            if (producto.consolidado != null && (bool)producto.consolidado && TcarOperacionDal.FindPorPersonaConsolidado((long)tcarsolicitud.cpersona))
            {
                //throw new AtlasException("CAR-0068", "SOCIO YA REGISTRA UN PRODUCTO CONSOLIDADO");
            }

            // Valida operaciones por aporte
            if (producto.montoporaportaciones != null && (bool)producto.montoporaportaciones)
            {
                if (producto.educativo == null || !(bool)producto.educativo)
                {
                    if (!rqmantenimiento.Mdatos.ContainsKey("essimulacion") || !(bool)rqmantenimiento.Mdatos["essimulacion"])
                    {
                        List<string> lopabs = new List<string>();
                        if (rqmantenimiento.GetTabla("OPERACIONESPORPERSONA") != null)
                        {
                            if (rqmantenimiento.GetTabla("OPERACIONESPORPERSONA").Lregistros.Count() > 0)
                            {
                                List<tcarsolicitudabsorcion> labsorcion = rqmantenimiento.GetTabla("OPERACIONESPORPERSONA").Lregistros.Cast<tcarsolicitudabsorcion>().ToList();

                                foreach (tcarsolicitudabsorcion abs in labsorcion)
                                {
                                    lopabs.Add(abs.coperacion);
                                }
                            }
                        }
                        /*if ((tcarsolicitud.cproducto == 1 && tcarsolicitud.ctipoproducto == 21 && tcarsolicitud.cmodulo == 7)) {
                        }else if(TcarOperacionDal.FindPorPersonaAportes((long)tcarsolicitud.cpersona, lopabs)) {
                            throw new AtlasException("CAR-0083", "NO PUEDE TENER MÁS DE UNA OPERACIÓN ACTIVA QUE COMPROMETA APORTES");
                        }*///CCA 20220808 permite generar creditos siempre y cuando la capacidad de endeudamiento lo permita
                    }
                }
            }

            // Lista de operaciones por persona
            List<tcaroperacion> loperacion = TcarOperacionDal.FindPorPersona((long)tcarsolicitud.cpersona).ToList();
            foreach (tcaroperacion op in loperacion)
            {
                tcarestatus estatus = TcarEstatusDal.FindInDataBase(op.cestatus);
                if ((estatus.cestatus == EnumEstatus.APROVADA.Cestatus))
                {
                    throw new AtlasException("CAR-0048", "SOCIO TIENE LA OPERACIÓN: {0} APROBADA PARA DESEMBOLSO", op.coperacion);
                }

                if (!estatus.cestatus.Equals(EnumEstatus.CANCELADA.Cestatus))
                {
                    count = count + 1;

                    // Calcula dias mora
                    int diasmora = 0;
                    Operacion operacion = OperacionFachada.GetOperacion(op.coperacion, true);

                    if ((operacion.Lcuotas != null) && !(operacion.Lcuotas.Count < 1) && (rqmantenimiento.Fproceso > operacion.Lcuotas[0].fvencimiento))
                    {
                        diasmora = Fecha.Resta365((int)rqmantenimiento.Fproceso, (int)operacion.Lcuotas[0].fvencimiento);
                    }

                    if (producto.consolidado == null || !(bool)producto.consolidado)
                    {
                        int diasgracia = TcarParametrosDal.GetInteger("DIASGRACIAMORA", (int)operacion.tcaroperacion.ccompania);
                        if (diasmora > diasgracia)
                        {
                            throw new AtlasException("CAR-0035", "SOCIO EN MORA. OPERACION: {0} - DIAS MORA: {1} - ESTADO: {2}", op.coperacion, diasmora, estatus.nombre);
                        }
                    }

                    // Operacion mismo producto
                    if ((op.cproducto == tcarsolicitud.cproducto) && (op.ctipoproducto == tcarsolicitud.ctipoproducto))
                    {
                        throw new AtlasException("CAR-0036", "SOCIO TIENE UNA OPERACIÓN ACTIVA DEL MISMO PRODUCTO");
                    }

                    // Operacion sin cuotas pagadas
                    tcaroperacioncuota cuota = TcarOperacionCuotaDal.FindUltimaCuotaPagada(op.coperacion);
                    if (cuota == null && operacion.Lcuotas[0].numcuota == 1)
                    {
                        throw new AtlasException("CAR-0037", "LA OPERACION {0} NO TIENE PAGADA NINGUNA CUOTA", op.coperacion);
                    }
                }
            }

            // Maximo de operaciones por cliente
            int maxoperaciones = (int)TcarParametrosDal.GetValorNumerico("OPERACIONES-POR-SOCIO", rqmantenimiento.Ccompania);
            if (maxoperaciones <= count)
            {
                throw new AtlasException("CAR-0034", "NÚMERO DE OPERACIONES ACTIVAS POR SOCIO NO PUEDE SER MAYOR A: {0}", maxoperaciones);
            }

        }

    }
}
