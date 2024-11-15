using cartera.datos;
using cartera.enums;
using core.componente;
using dal.cartera;
using dal.generales;
using modelo;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using util.enums;
using util.thread;

namespace cartera.comp.mantenimiento.aprobacion
{

    public class SolicitudToOperacion : ComponenteMantenimiento
    {

        /// <summary>
        /// Pasa los datos de una solicitud a una operacion. 
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            long csolicitud = long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString());
            //tcarsolicitud tcarsolicitud = TcarSolicitudDal.FindWithLock(csolicitud);

            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;

            if (!tcarsolicitud.cestatussolicitud.Equals(EnumEstatus.APROVADA.Cestatus))
            {
                throw new AtlasException("CAR-0002", "SOLICITUD: {0} ESTA ES ESTATUS: {1}", csolicitud,
                        TcarEstatusSolicitudDal.Find(tcarsolicitud.cestatussolicitud).nombre);
            }

            //tcarsolicitud.cestatussolicitud = "APR";
            tcarsolicitud.faprobacion = rqmantenimiento.Ftrabajo;
            tcaroperacion tcaroperacion = TcarSolicitudDal.ToTcarOperacion(tcarsolicitud, rqmantenimiento);

            // Valida monto para arreglo de pago
            if (!tcarsolicitud.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion))
            {
                this.ValidaMontoArregloPago(rqmantenimiento, tcaroperacion, csolicitud);
            }

            // Genera numero de operacion de cartera.
            string coperacion = TgenOperacionNumeroDal.GetNumeroOperacion((int)tcaroperacion.cmodulo, (int)tcaroperacion.cproducto,
                    (int)tcaroperacion.ctipoproducto, (int)tcaroperacion.csucursal, (int)tcaroperacion.cagencia, (int)tcaroperacion.ccompania);

            tcaroperacion.coperacion = coperacion;

            // fija el numero de operacion en el request para futuras utilizaciones.
            rqmantenimiento.Coperacion = coperacion;

            // Obtiene intancia de datos de cartera asociado al modulo.
            DatosCartera dc = (DatosCartera)ThreadNegocio.GetDatos().GetMdatosmodulo(EnumModulos.CARTERA.Cmodulo);
            Operacion operacion = new Operacion(tcaroperacion);
            operacion.Coperacion = coperacion;
            Dictionary<string, Operacion> moperacion = dc.GetOperaciones();
            // asocia la nueva operacion a los datos de cartera.
            moperacion[coperacion] = operacion;

            // Adiciona datos a Tabla para que haga el commit de los objetos al final.
            rqmantenimiento.AdicionarTabla(tcaroperacion.GetType().Name, tcaroperacion, false);

            // Adiciona el numero de operacion al response.
            rqmantenimiento.Response["coperacion"] = coperacion;
        }

        /// <summary>
        /// Valida informacion de monto de operacion a la fecha para registro de operacion
        /// </summary>
        /// <param name="rqmantenimiento">Datos del requet con los que se ejecuta la transaccion.</param>
        /// <param name="tcaroperacion">Instancia de tcaroperacion.</param>
        /// <param name="csolicitud">Codigo de solicitud.</param>
        private void ValidaMontoArregloPago(RqMantenimiento rqmantenimiento, tcaroperacion tcaroperacion, long csolicitud)
        {
            decimal montototal = Constantes.CERO;
            IList<tcarsolicitudabsorcion> larreglopago = TcarSolicitudAbsorcionDal.Find(csolicitud);
            foreach (tcarsolicitudabsorcion op in larreglopago)
            {
                Operacion operacion = OperacionFachada.GetOperacion(op.coperacion, true);
                saldo.Saldo saldo = new saldo.Saldo(operacion, rqmantenimiento.Fconatable);
                saldo.Calculacuotaencurso();
                //EN UN ARREGLO DE PAGO EL MONTO TOTAL SOLO SE DEBE CONSIDERAR DEL CAPITAL Y NO DE TODOS LOS RUBROS PENDIENTES DE PAGO. LOS RUBROS FALTANTES SE LOS DEBE COLOCVAR COMO CARGOS EN LA NEGOCIACIÓN DE PAGO
                tcarsolicitud sol = TcarSolicitudDal.Find(csolicitud);
                if (!sol.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion))
                {

                    //montototal = (montototal + saldo.Capitalvencido + saldo.GetSaldoCuotasfuturas() - saldo.Cxp);
                    montototal = (decimal)tcaroperacion.monto;
                    break;
                }
                else
                {
                    montototal = (montototal + saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas() - saldo.Cxp);
                }
            }
            tcaroperacion.monto = montototal;
            tcaroperacion.montooriginal = montototal;
        }

    }
}