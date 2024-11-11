using core.componente;
using modelo;
using seguridad.util;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.man {

    /// <summary>
    /// Clase que se encarga de crear los usuarios
    /// </summary>
    public class CreaUsuario : ComponenteMantenimiento {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            int ccompania = rqmantenimiento.Ccompania;
            List<tsegusuariodetalle> ltsegUsuarioDetalle = rqmantenimiento.GetTabla("USUARIODETALLE").Lregistros.Cast<tsegusuariodetalle>().ToList();
            if (ltsegUsuarioDetalle.Count > 1) {
                throw new AtlasException("SEG-018", "SE HA ENVIADO MÁS DE UN REGISTRO PARA EL MANTENIMIENTO");
            }
            foreach (tsegusuariodetalle tsegUsuarioDetalle in ltsegUsuarioDetalle) {
                if (!tsegUsuarioDetalle.Esnuevo) {
                    return;
                }
                String cusuario = tsegUsuarioDetalle.cusuario;
                CreaUsuario.CompletaDataUsuario(tsegUsuarioDetalle, ccompania);
                CreaUsuario.CompletaDataPerfil(rqmantenimiento, ccompania, cusuario);
                CreaUsuario.CrearUsuario(rqmantenimiento, cusuario, ccompania);
            }
        }

        /// <summary>
        /// Completa informacion del usuario
        /// </summary>
        private static void CompletaDataUsuario(tsegusuariodetalle tsegUsuarioDetalle, int ccompania) {
            tsegUsuarioDetalle.ccompania = ccompania;
            tsegUsuarioDetalle.estatuscusuariocatalogo = EnumEstatusUsuario.ESTATUS_USUARIO.Ccatalogo;
		    tsegUsuarioDetalle.estatuscusuariocdetalle = EnumDetalleEstatusUsuario.CREADO.Detalle;
            tsegUsuarioDetalle.optlock = 0;
            tsegUsuarioDetalle.cidioma = "ES";
            // Creo el password igual que el nombre del usuario pero en min&uacute;sculas
            String password = EncriptarPassword.Encriptar(tsegUsuarioDetalle.cusuario.ToLower());
            tsegUsuarioDetalle.password = password;
	    }

        /// <summary>
        /// M&eacute;todo que se encarga de crear un usuario en la tabla principal
        /// </summary>
        private static void CrearUsuario(RqMantenimiento rqmantenimiento, String cusuario, int ccompania) {
            tsegusuario tsegUsuario = new tsegusuario();
            tsegUsuario.cusuario = cusuario;
            tsegUsuario.ccompania = ccompania;
            // TODO tsegUsuario.Cinterno = int.Parse(Secuencia.GetProximovalor("USUARIO").ToString());
		    rqmantenimiento.AdicionarTabla("TsegUsuarioDto", tsegUsuario, 0,false);
	    }

        /// <summary>
        /// M&eacute;todo que se encarga de completar los datos de perfil del usuario
        /// </summary>
	    private static void CompletaDataPerfil(RqMantenimiento rqmantenimiento, int ccompania, String cusuario) {
            Tabla tabla = rqmantenimiento.GetTabla("PERFILUSUARIO");
		    if (tabla != null) {
                List<tsegusuariorol> lTsegUsuarioRol = tabla.Lregistros.Cast<tsegusuariorol>().ToList();
                foreach (tsegusuariorol tsegUsuarioRol in lTsegUsuarioRol) {
                    tsegUsuarioRol.ccompania = ccompania;
                    tsegUsuarioRol.cusuario = cusuario;
                }
            } else {
                throw new AtlasException("SEG-019", "EL USUARIO {0} DEBE TENER POR LO MENOS 1 PERFIL", cusuario);
            }
        }

    }
}
