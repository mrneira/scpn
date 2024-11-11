using core.componente;
using dal.generales;
using dal.persona;
using dal.seguridades;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace seguridad.comp.mantenimiento.olvidoContrasenia.gen {
    /// <summary>
    /// Clase que se encarga de generar la clave temp de recuperación de contrasenia.
    /// </summary>
    public class GeneraClaveTemp : ComponenteMantenimiento {
        /// <summary>
        /// Metodo que genera la clave temp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            // rqmantenimiento.Cusuario enviado desde el angular es el número de identificación para este método
            tperpersonadetalle  objpersona = TperPersonaDetalleDal.Find(rqmantenimiento.Cusuario);
            if (objpersona==null) {
                throw new AtlasException("SEG-033", "DATOS INCORRECTOS");
            }
            tsegusuariodetalle  objusuaraio = TsegUsuarioDetalleDal.FindCpersona(objpersona.cpersona, rqmantenimiento.Ccompania);
            if (objpersona == null) {
                throw new AtlasException("SEG-033", "DATOS INCORRECTOS");
            }
            string cusuario = objusuaraio.cusuario.ToString();
            rqmantenimiento.AddDatos("clavetemp", cusuario + "_" + ClaveTemporal.GetClave(true));
            rqmantenimiento.AddDatos("identificacion", objpersona.identificacion);
            string clave = rqmantenimiento.GetString("clavetemp");
            clave = EncriptarPassword.Encriptar(clave);
            tgencatalogodetalle  tgenCatalogoDetalle = TgenCatalogoDetalleDal.Find((int)objusuaraio.estatuscusuariocatalogo,
                        objusuaraio.estatuscusuariocdetalle);
            // rqmantenimiento se reemplaza por el cusuario para que quede como el request original
            rqmantenimiento.Cusuario = cusuario.ToString();
            if (!objusuaraio.estatuscusuariocdetalle.Equals("ACT")) {
                throw new AtlasException("SEG-015", "EL USUARIO {0} SE ENCUENTRA EN ESTATUS {1}", cusuario,
                           tgenCatalogoDetalle.nombre);
            }

            objusuaraio.password = clave;
            objusuaraio.cambiopassword = "1";
            Sessionef.Actualizar(objusuaraio);
            rqmantenimiento.Response["validarclavetemp"] = true;


        }
    }
}

