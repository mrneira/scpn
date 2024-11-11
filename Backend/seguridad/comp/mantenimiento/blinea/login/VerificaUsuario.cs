using dal.bancaenlinea;
using dal.persona;
using dal.seguridades;
using modelo;
using seguridad.comp.login.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.blinea.login {

    /// <summary>
    /// Clase que se encarga de verificar que el usuario existe.
    /// </summary>
    public class VerificaUsuario : GrabaSession {

        /// <summary>
        /// Metodo que busca si el usuario existe
        /// </summary>
        /// <param name="rqmantenimiento">Request de login.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tbanusuarios obj = TbanUsuariosDal.Find(rqmantenimiento.Cusuario);
            if (obj == null) {
                throw new AtlasException("BLI-007", "USUARIO {0} NO EXISTE", rqmantenimiento.Cusuario);
            }
            tperpersonadetalle p = TperPersonaDetalleDal.Find(obj.cpersona ?? 0, rqmantenimiento.Ccompania);
            tbansuscripcion susban = TbanSuscripcionDal.FindPorIdentificacion(p.identificacion);
            if (susban==null || susban.estatuscusuariocdetalle.CompareTo("ACT") != 0) {
                throw new AtlasException("BLI-010", "LA SUSCRIPCIÓN DE BANCA EN LÍNEA ES INVÁLIDA");
            }
            rqmantenimiento.AddDatos("TBANUSUARIOS", obj);
        }
    }
}
