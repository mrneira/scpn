using core.componente;
using core.servicios;
using dal.bancaenlinea;
using dal.generales;
using dal.seguridades;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using util;

namespace seguridad.comp.login.helper {

    /// <summary>
    /// Graba informacion de la session del usuario externo en la base de datos.
    /// </summary>
    public abstract class GrabaSessionBancaLinea : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que almacena los datos de session en la base de datos
        /// </summary>
        /// <param name="tsegUsuarioDetalle"></param>
        /// <param name="tsegUsuarioSession"></param>
        public static void GuardaSesion(tbanusuarios tbanUsuarios, tbanusuariosession tbanUsuarioSession, int ccompania) {
            if (tbanUsuarioSession == null) {
                tbanUsuarioSession = TbanUsuarioSessionDal.Find(tbanUsuarios.cusuario);
            }

            UpdateAnidadoThread.Actualizar(ccompania, tbanUsuarioSession);
            tsegpolitica tsegPolitica = TsegPoliticaDal.Find(ccompania, "BAN");
            if ((tsegPolitica != null) && (tsegPolitica.intentos != null)) {
                if (tbanUsuarioSession.numerointentos >= tsegPolitica.intentos) {
                    // Marca el usuario como inactivo.
                    tbanUsuarios.estatuscusuariocdetalle = "INA";

                    // Actualiza intentos.
                    tbanUsuarioSession.numerointentos = 0;
                    UpdateAnidadoThread.Actualizar(ccompania, tbanUsuarioSession);
                    UpdateAnidadoThread.Actualizar(ccompania, tbanUsuarios);
                }
            }

            int intentos = (int)tbanUsuarioSession.numerointentos;
            if (tbanUsuarios.estatuscusuariocdetalle.CompareTo("ACT") == 0 && intentos.CompareTo(tsegPolitica.intentos - 1) == 0) {
                throw new AtlasException("SEG-029", "EL USUARIO: {0} SE INACTIVARÁ EN EL SIGUIENTE INTENTO FALLIDO DE CONTRASEÑA", tbanUsuarios.cusuario);
            }

        }
    }
}
