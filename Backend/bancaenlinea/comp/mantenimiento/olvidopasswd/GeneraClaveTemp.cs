using core.componente;
using dal.bancaenlinea;
using dal.generales;
using dal.persona;
using dal.seguridades;
using modelo;
using modelo.helper;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace bancaenlinea.comp.mantenimiento.olvidopasswd {

    /// <summary>
    /// Clase que se encarga de generar el codigo otp de seguridad por usuario.
    /// </summary>
    public class GeneraClaveTemp : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string ident = rqmantenimiento.GetString("ident");
            tperpersonadetalle objpersona = TperPersonaDetalleDal.Find(ident);
            if (objpersona == null) {
                throw new AtlasException("SEG-033", "DATOS INCORRECTOS");
            }
            tbanusuarios tbanusuarios = TbanUsuariosDal.FindPassword(objpersona.cpersona);
            if (tbanusuarios == null) {
                throw new AtlasException("SEG-033", "DATOS INCORRECTOS");
            }

            rqmantenimiento.AddDatos("clavetemp", tbanusuarios.cusuario + "_" + util.ClaveTemporal.GetClave(true));
            rqmantenimiento.AddDatos("identificacion", objpersona.identificacion);
            string clave = rqmantenimiento.GetString("clavetemp");
            clave = EncriptarPassword.Encriptar(clave);

            EntityHelper.SetActualizar(tbanusuarios);
            tbanusuarios.password = clave;
            tbanusuarios.cambiopassword = "1";
            tbanusuarios.estatuscusuariocdetalle = "ACT";
            Sessionef.Actualizar(tbanusuarios);
            rqmantenimiento.Response["validarclavetemp"] = true;
        }

    }
}
