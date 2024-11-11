using modelo;
using modelo.helper;
using System;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.bancaenlinea {
    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TbanUsuarioOtp.
    /// </summary>
    public class TbanUsuarioOtpDal {

        /// <summary>
        /// Entrega un registro con los datos de password de una sola vez por usuario.
        /// </summary>
        public static tbanusuariootp Find(string cusuario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tbanusuariootp obj = contexto.tbanusuariootp.AsNoTracking().Where(x => x.cusuario.Equals(cusuario)).SingleOrDefault();
            if (obj == null) {
                return null;
            }

            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Entrega un registro con los datos de password de una sola vez por usuario.
        /// </summary>
        public static tbanusuariootp Crear(String cusuario, String clavetemporal) {
            Boolean insertar = false;
            tbanusuariootp obj = TbanUsuarioOtpDal.Find(cusuario);
            if (obj == null) {
                obj = new tbanusuariootp();
                obj.cusuario = cusuario;
                insertar = true;
            }
            obj.fcreacion = Fecha.GetFechaSistema();
            // suma 5 minutos a la fecha
            obj.fcaducidad = obj.fcreacion.GetValueOrDefault().AddMinutes(5);

            String encriptado = EncriptarPassword.Encriptar(clavetemporal);
            obj.password = encriptado;
            obj.AddDatos("claveotp", clavetemporal);

            if (insertar) {
                Sessionef.Grabar(obj);
            } else {
                Sessionef.Actualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Metodo que se encarga de validar que el usuairo tenga un password OTP one time password, valido.
        /// </summary>
        public static void ValidarPassword(String cusuario, String claveOtp) {
            Boolean error = true;
            tbanusuariootp obj = TbanUsuarioOtpDal.Find(cusuario);
            if (obj != null) {
                DateTime d = Fecha.GetFechaSistema();
                if (obj.fcreacion.GetValueOrDefault().CompareTo(d) <= 0 && obj.fcaducidad.GetValueOrDefault().CompareTo(d) <= 0) {
                    error = false;
                }
                String encriptado = EncriptarPassword.Encriptar(claveOtp);
                if (obj.password.CompareTo(encriptado) != 0) {
                    error = false;
                }
            }
            if (error) {
                throw new AtlasException("", "CLAVE TEMPORAL INVALIDA");
            }
        }


    }
}
