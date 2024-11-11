using dal.bancaenlinea;
using dal.bancamovil;
using dal.generales;
using dal.seguridades;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.interfaces;

namespace seguridad.util {

    /// <summary>
    /// Clase que se encarga de ejecutar validaciones de usuario.
    /// </summary>
    public class Usuario: ILogin {

        public void Validarlogin(String cusuario, int ccompania, string ccanal, string serial) {
            int tiemposession = 0;
            DateTime fultimaaccion = DateTime.Now;
            if (ccanal.CompareTo("BMV") == 0) {
                tbansuscripcionmovil subscripcion = TbanSuscripcionMovilDal.FindActivoPorUsuario(cusuario, serial);
                if (subscripcion==null) {
                    throw new AtlasException("BMV-005", "NO EXISTE SUSCRIPCIÓN DEL USUARIO");
                }
                return;
            } else if(ccanal.CompareTo("BAN") == 0) {
                tbanusuariosession session = TbanUsuarioSessionDal.FindActivo(cusuario);
                tiemposession = session.tiemposesion ?? 0;
                fultimaaccion = session.fultimaaccion ?? DateTime.Now;
            } else  {
                // Canal OFI

                //Valida usuario activo
                tsegusuariodetalle tsegUsuarioDetalle = TsegUsuarioDetalleDal.Find(cusuario, ccompania);
                if (tsegUsuarioDetalle.estatuscusuariocdetalle.CompareTo("ACT") != 0)
                {
                    tgencatalogodetalle tgenCatalogoDetalle = TgenCatalogoDetalleDal.Find((int)tsegUsuarioDetalle.estatuscusuariocatalogo, tsegUsuarioDetalle.estatuscusuariocdetalle);
                    //GrabaSession.GuardaSesion(tsegUsuarioDetalle, null);
                    throw new AtlasException("SEG-015", "EL USUARIO {0} SE ENCUENTRA EN ESTATUS {1}", tsegUsuarioDetalle.cusuario, tgenCatalogoDetalle.nombre);
                }
                // Valida sesion activa
                tsegusuariosession session = TsegUsuarioSessionDal.FindActivo(cusuario, ccompania);
                tiemposession = session.tiemposesion ?? 0;
                fultimaaccion = session.fultimaaccion ?? DateTime.Now;
            }

            DateTime freal = DateTime.Now;
            fultimaaccion = fultimaaccion.AddMinutes(double.Parse(tiemposession.ToString()));
		    if (fultimaaccion.CompareTo(freal) < 0){
			        throw new AtlasException("SEG-031", "SESIÓN CADUCADA");
            }
        }

    }
}
