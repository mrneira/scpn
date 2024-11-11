using cartera.datos;
using cartera.enums;
using cartera.monetario;
using core.componente;
using dal.cartera;
using dal.socio;
using modelo;
using monetario.util;
using socio.datos;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.desembolso {

    /// <summary>
    /// Clase que se encarga de ejecutar contabilizacion de valores de reincorporados.
    /// </summary>
    public class MonetarioReincorporado : ComponenteMantenimiento {

        /// <summary>
        /// Ejecuta transaccion monetaria de reincorporado en el desembolso.
        /// </summary>
        /// <param name="rqmantenimiento">Datos con el que se ejecuta el monetario.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tcaroperacion tcaroperacion = operacion.tcaroperacion;

            decimal montoreincorporado = TcarSolicitudReincorporadoDal.ValorReincorporado((long)tcaroperacion.csolicitud);
            if (montoreincorporado <= Constantes.CERO) {
                return;
            }
            // Daots de socio
            Socios socio = new Socios((long)tcaroperacion.cpersona, rqmantenimiento);
            tgencatalogodetalle jerarquia = socio.GetJerarquia();

            // Ejecuta monetario
            this.EjecutaMonetario(rqmantenimiento, jerarquia.cdetalle, montoreincorporado);

            // Crea novedad
            this.CreaNovedad(rqmantenimiento, tcaroperacion, jerarquia, montoreincorporado);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="jerarquia">Jerarquia de socio.</param>
        /// <param name="monto">Valor de reincorporado.</param>
        private void EjecutaMonetario(RqMantenimiento rqmantenimiento, string jerarquia, decimal monto)
        {
            // Ejecuta monetario
            RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
            MonetarioHelper.FijaTransaccion(rqconta, EnumEventos.DESEMBOLSO_REINCORPORADO.Cevento);
            rqconta.EncerarRubros();

            // Codigo de rubro
            int crubro = jerarquia.Equals("CLA") ? 1 : 2;

            RqRubro rqrubro = new RqRubro(crubro, monto, rqmantenimiento.Cmoneda);
            rqrubro.Coperacion = rqmantenimiento.Coperacion;
            rqrubro.Actualizasaldo = false;
            rqconta.AdicionarRubro(rqrubro);

            // Ejecuta la transaccion monetaria anidada.
            if (rqconta.Rubros != null && !(rqconta.Rubros.Count < 1)) {
                new ComprobanteMonetario(rqconta);
            }
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="tcaroperacion">Instancia de operacion de cartera.</param>
        /// <param name="jerarquia">Jerarquia de socio.</param>
        /// <param name="monto">Valor de reincorporado.</param>
        private void CreaNovedad(RqMantenimiento rqmantenimiento, tcaroperacion tcaroperacion, tgencatalogodetalle jerarquia, decimal monto)
        {
            tsocnovedadades novedad = TsocNovedadesDal.Crear();
            novedad.cpersona = tcaroperacion.cpersona;
            novedad.ccompania = tcaroperacion.ccompania;
            novedad.coperacion = tcaroperacion.coperacion;
            novedad.ccatalogonovedad = 220;
            novedad.cdetallenovedad = jerarquia.cdetalle.Equals("CLA") ? "21" : "22";
            novedad.cusuario = rqmantenimiento.Cusuario;
            novedad.fecha = rqmantenimiento.Freal;
            novedad.novedad = "DEVOLUCIÓN CARTERA VENCIDA (V) - " + jerarquia.nombre;
            novedad.valor = monto * (-1);
            novedad.estadovalor = "ACT";
            novedad.retencion = false;
            novedad.numerooficio = tcaroperacion.coperacion;
            novedad.fechaoficio = Fecha.GetFecha(rqmantenimiento.Fconatable);
            novedad.fecharecepcion = Fecha.GetFecha(rqmantenimiento.Fconatable);
            novedad.estado = "ACT";
            novedad.mensaje = rqmantenimiento.Mensaje;
            novedad.reverso = rqmantenimiento.Reverso;
            novedad.automatico = true;

            rqmantenimiento.AdicionarTabla(typeof(tsocnovedadades).Name.ToUpper(), novedad, false);
        }

    }
}
