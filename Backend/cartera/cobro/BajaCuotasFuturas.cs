using cartera.cobro.helper;
using cartera.comp.mantenimiento.util;
using cartera.enums;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.cobro {

    /// <summary>
    /// Clase que se encarga de dar de baja el capital de las cuotas por vencer, inclye la cuota en curso.<br>
    ///  Crea registros de historia de las cuotas y los rubros.<br>
    ///  Elimina los registros de cuotas y rubros de la tabla de datos vigentes.
    /// </summary>
    public class BajaCuotasFuturas : CobroHelper {

        /// <summary>
        /// Clase que se encarga de acumular montos por codigo contable y ejecutar monetarios acumulados.
        /// </summary>
        private MonetarioAcumuladoCartera monetarioacumuladocartera = new MonetarioAcumuladoCartera();

        /// <summary>
        /// Numero de cuota en curso, sirve para eliminar cuotas vigentes y es la cuota con la cual inicia la generacion de la nueva tabla.
        /// </summary>
        private int? numcuotaencurso;

        /// <summary>
        /// Crea una instancia de BajaCuotasFuturas.
        /// </summary>
        /// <param name="saldo">Objeto que contiene los valores adeudados por rubro.</param>
        /// <param name="fcobro">Fecha de cobro de las cuotas.</param>
        public BajaCuotasFuturas(saldo.Saldo saldo, int fcobro)
        {
            base.Fijavariables(saldo, fcobro);
        }

        /// <summary>
        /// Cobro de cuotas por vencer de la operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        public void EjecutarBajacuotas(RqMantenimiento rqmantenimiento)
        {
            this.rqmantenimiento = rqmantenimiento;

            this.BajaCuotas();
            // Ejecuta transaccion monetaria.
            monetarioacumuladocartera.EjecutaMonetario(rqmantenimiento, tcaroperacion, EnumEventos.BAJACAPITAL.Cevento);
        }

        /// <summary>
        /// Metodo que se encar de dar de baja cuotas por vencer, elimina cuotas y rubros de las tablas que contienen registros vigentes.
        /// </summary>
        private void BajaCuotas()
        {
            foreach (tcaroperacioncuota cuota in saldo.Operacion.Lcuotas) {
                // si se hace le pago extraordinario en el vencimiento de la cuota esta se marca como pagada, la tabla se regenerea a partir de
                // la sigueinte cuota.
                if (TcarOperacionCuotaDal.EstavencidaOpagada(cuota, fcobro)) {
                    continue;
                }
                if (numcuotaencurso == null) {
                    numcuotaencurso = cuota.numcuota;
                }
                this.Bajacuota(cuota);
            }
            // Eliminar cuotas y rubros de tabla de datos vigentes mayores o iguales al numero de cuota en curso.
            // Con el numero de cuota en curso se regenera la tabla de pagos.
            TcarOperacionRubroDal.Delete(base.tcaroperacion.coperacion, (int)numcuotaencurso);
            TcarOperacionCuotaDal.Delete(base.tcaroperacion.coperacion, (int)numcuotaencurso);
            TcarOperacionCxCDal.Delete(base.tcaroperacion.coperacion, (int)numcuotaencurso);
        }

        /// <summary>
        /// Metodo que da de baja los rubros de capital de una cuota
        /// </summary>
        /// <param name="cuota">Objeto que contiene los datos de una cuota.</param>
        private void Bajacuota(tcaroperacioncuota cuota)
        {
            List<tcaroperacionrubro> lrubros = cuota.GetRubros();
            // Crea registro de historia de la cuota para reversos.
            TcarOperacionCuotaHistoriaDal.RegistraHistoria(cuota, fcobro, rqmantenimiento.Mensaje, true);
            // Se hace un detach para ahcer un delete de todas las cuotas.
            Sessionef.Detach(cuota);

            // Procesa rubros de la cuota.
            foreach (tcaroperacionrubro rubro in lrubros) {
                this.Procesarubro(cuota, rubro);
            }
        }

        /**
         * Metodo que procesa por rubro la baja de capital cuotas por vencer.<br>
         * Crea historia del rubro.<br>
         * Acumula el valor de capital para su posterior contabilizacion.
         * @param rubro
         * @throws Exception
         */
        private void Procesarubro(tcaroperacioncuota cuota, tcaroperacionrubro rubro)
        {
            // Crea registros de historia de todos los rubros de la cuota para reversos.
            TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, fcobro, rqmantenimiento.Mensaje, true, decimales);
            // Baja de cuentas por cobrar
            tcaroperacioncxc cxc = TcarOperacionCxCDal.FindPorCodigoSaldo(rubro);
            if (cxc != null) {
                TcarOperacionCxCHistoriaDal.RegistraHistoria(cxc, fcobro, rqmantenimiento.Mensaje, true);
            }

            // Se hace un detach para ahcer un delete de todas las cuotas.
            Sessionef.Detach(rubro);

            base.Fijamontopagadoenrubro(cuota, rubro, monetarioacumuladocartera);
        }

        /// <summary>
        /// Entrega el valor de: numcuotaencurso
        /// </summary>
        /// <returns>int</returns>
        public int GetNumcuotaencurso()
        {
            return (int)numcuotaencurso;
        }

    }

}
