using core.componente;
using core.servicios;
using dal.generales;
using dal.seguridades;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;

namespace seguridad.comp.login.helper {

    /// <summary>
    /// Graba informacion de la session del usuario en la base de datos.
    /// </summary>
    public abstract class GrabaSession : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que almacena los datos de session en la base de datos
        /// </summary>
        /// <param name="tsegUsuarioDetalle"></param>
        /// <param name="tsegUsuarioSession"></param>
        public static void GuardaSesion(tsegusuariodetalle tsegUsuarioDetalle, tsegusuariosession tsegUsuarioSession) {
            if (tsegUsuarioSession == null) {
                tsegUsuarioSession = TsegUsuarioSessionDal.Find(tsegUsuarioDetalle.cusuario, (int)tsegUsuarioDetalle.ccompania);
            }
            tsegusuariosessionhistoria historia = TsegUsuarioSessionHistoriaDal.Crearhistoriaerror(tsegUsuarioSession);
            InsertAnidadoThread.Grabar((int)tsegUsuarioSession.ccompania, historia);
            UpdateAnidadoThread.Actualizar((int)tsegUsuarioSession.ccompania, tsegUsuarioSession);



            tsegpolitica tsegPolitica = TsegPoliticaDal.Find((int)tsegUsuarioDetalle.ccompania, tsegUsuarioDetalle.ccanal);

            if (tsegPolitica != null && (tsegPolitica.intentos != null)) {
                if (tsegUsuarioSession.numerointentos >= tsegPolitica.intentos) {
                    // Marca el usuario como inactivo.
                    tsegUsuarioDetalle.estatuscusuariocdetalle = DetalleEstatusUsuario.INACTIVO.Cestatus;
                    tsegUsuarioDetalle.observacion = "INACTIVADO POR SOBREPASAR EL MÁXIMO NÚMERO DE INTENTOS FALLIDOS DE LOGIN";
                    UpdateAnidadoThread.Actualizar((int)tsegUsuarioSession.ccompania, tsegUsuarioDetalle);
                    //InsertAnidadoThread.Grabar((int)tsegUsuarioSession.ccompania, tsegUsuarioDetalle);
                    // Actualiza intentos.
                    tsegUsuarioSession.numerointentos = 0;
                    UpdateAnidadoThread.Actualizar((int)tsegUsuarioSession.ccompania, tsegUsuarioSession);
                    //InsertAnidadoThread.Grabar((int)tsegUsuarioSession.ccompania, tsegUsuarioSession);

                    tgencatalogodetalle tgenCatalogoDetalle = TgenCatalogoDetalleDal.Find((int)tsegUsuarioDetalle.estatuscusuariocatalogo,
                        tsegUsuarioDetalle.estatuscusuariocdetalle);
                    throw new AtlasException("SEG-015", "EL USUARIO {0} SE ENCUENTRA EN ESTATUS {1}", tsegUsuarioDetalle.cusuario,
                            tgenCatalogoDetalle.nombre);
                }
            }
            int intentos = (int)tsegUsuarioSession.numerointentos;
            if (tsegUsuarioDetalle.estatuscusuariocdetalle.CompareTo("ACT") == 0 && intentos.CompareTo(tsegPolitica.intentos - 1) == 0) {
                throw new AtlasException("SEG-029", "EL USUARIO: {0} SE INACTIVARÁ EN EL SIGUIENTE INTENTO FALLIDO DE CONTRASEÑA", tsegUsuarioDetalle.cusuario);
            }
        }
    }
}
