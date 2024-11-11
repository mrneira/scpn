using canalesdigitales.enums;
using core.componente;
using core.servicios;
using dal.canalesdigitales;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento {
    class ValidaSesion : ComponenteMantenimiento {
        /// <summary>
        /// Método principal que ejecuta la validación de la Sesión del Usuario al momento de realizar un mantenimiento
        /// </summary>
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string token = rqmantenimiento.GetString(nameof(token));
            EliminarSesiones(rqmantenimiento);

            tcanusuariosesion sesion = TcanUsuarioSesionDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal, token);

            if (sesion == null) {
                EjecutarLogout(sesion);
            } else {
                DateTime fechaEstado = (DateTime)(sesion.fultimaaccion ?? sesion.finicio);

                if (fechaEstado.Ticks < Fecha.GetFechaSistema().AddMinutes((double)-sesion.tiemposesion).Ticks) {
                    EjecutarLogout(sesion);
                } else {
                    sesion.fultimaaccion = Fecha.GetFechaSistema();
                    sesion.recurso = string.Join("-", rqmantenimiento.Cmodulotranoriginal, rqmantenimiento.Ctranoriginal) + " " + string.Join("-", rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion);
                    UpdateAnidadoThread.Actualizar(EnumGeneral.COMPANIA_COD, sesion);
                }
            }
        }

        private void EliminarSesiones(RqMantenimiento rqmantenimiento) {
            IList<tcanusuariosesion> listaSesiones = TcanUsuarioSesionDal.FindPorSubCanal(rqmantenimiento.Crol);

            DateTime fechaEstado;
            foreach (tcanusuariosesion sesion in listaSesiones) {
                if (string.Equals(sesion.cusuario, rqmantenimiento.Cusuariobancalinea)) {
                    continue;
                }

                fechaEstado = (DateTime)(sesion.fultimaaccion ?? sesion.finicio);
                if (fechaEstado.Ticks < Fecha.GetFechaSistema().AddMinutes((double)-sesion.tiemposesion).Ticks) {
                    TcanUsuarioSesionDal.Eliminar(sesion);
                }
            }
        }

        private void EjecutarLogout(tcanusuariosesion sesion) {
            if (sesion != null) {
                TcanUsuarioSesionDal.Eliminar(sesion);
            }

            throw new AtlasException("SEG-031", "SESIÓN CADUCADA");
        }
    }
}
