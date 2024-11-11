using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.servicios;
using core.componente;
using core.servicios;
using dal.canalesdigitales;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto;
using util.dto.consulta;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.consulta {
    class ValidaSesion : ComponenteConsulta {

        /// <summary>
        /// Método principal que ejecuta la validación de la Sesión del Usuario al momento de realizar una consulta
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            string token = rqconsulta.GetString(nameof(token));
            EliminarSesiones(rqconsulta);

            tcanusuariosesion sesion = TcanUsuarioSesionDal.Find(rqconsulta.Cusuariobancalinea, rqconsulta.Ccanal, token);

            if (sesion == null) {
                EjecutarLogout(sesion);
            } else {
                DateTime fechaEstado = (DateTime)(sesion.fultimaaccion ?? sesion.finicio);

                if (fechaEstado.Ticks < Fecha.GetFechaSistema().AddMinutes((double)-sesion.tiemposesion).Ticks) {
                    EjecutarLogout(sesion);
                } else {
                    sesion.fultimaaccion = Fecha.GetFechaSistema();
                    sesion.recurso = string.Join("-", rqconsulta.Cmodulotranoriginal, rqconsulta.Ctranoriginal) + " " + string.Join("-", rqconsulta.Cmodulo, rqconsulta.Ctransaccion);
                    UpdateAnidadoThread.Actualizar(EnumGeneral.COMPANIA_COD, sesion);
                }
            }
        }

        private void EliminarSesiones(RqConsulta rqconsulta) {
            IList<tcanusuariosesion> listaSesiones = TcanUsuarioSesionDal.FindPorSubCanal(rqconsulta.Crol);

            DateTime fechaEstado;
            foreach (tcanusuariosesion sesion in listaSesiones) {
                if (string.Equals(sesion.cusuario, rqconsulta.Cusuariobancalinea)) {
                    continue;
                }

                fechaEstado = (DateTime)(sesion.fultimaaccion ?? sesion.finicio);
                if (fechaEstado.Ticks < Fecha.GetFechaSistema().AddMinutes((double)-sesion.tiemposesion).Ticks) {
                    DeleteAnidadoThread.Eliminar(EnumGeneral.COMPANIA_COD, sesion);
                    //TcanUsuarioSesionDal.Eliminar(sesion);
                }
            }
        }

        private void EjecutarLogout(tcanusuariosesion sesion) {
            if (sesion != null) {
                DeleteAnidadoThread.Eliminar(EnumGeneral.COMPANIA_COD, sesion);
                //TcanUsuarioSesionDal.Eliminar(sesion);
            }

            throw new AtlasException("SEG-031", "SESIÓN CADUCADA");
        }

    }

}
