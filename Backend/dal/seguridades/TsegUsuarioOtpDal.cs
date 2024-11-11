using modelo;
using modelo.helper;
using System;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.seguridades {
    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TsegUsuarioOtp.
    /// </summary>
    public class TsegUsuarioOtpDal {

        /// Sentencia que entrega informacion de una subscripcion de un usuario en banca en linea dAdo el codigo de usuario.
        //private static string HQL_USUARIO = "from TsegUsuarioOtpDto t where t.pk = :cusuario ";
        /// <summary>
        /// Entrega un registro con los datos de password de una sola vez por usuario.
        /// </summary>
        public static tsegusuariootp Find(String cusuario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsegusuariootp obj = contexto.tsegusuariootp.AsNoTracking().Where(x => x.cusuario.Equals(cusuario)).SingleOrDefault();
            if (obj == null) {
                return null;
            }

            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Entrega un registro con los datos de password de una sola vez por usuario.
        /// </summary>
        public static tsegusuariootp Crear(String cusuario, String clavetemporal) {
            Boolean insertar = false;
            tsegusuariootp obj = TsegUsuarioOtpDal.Find(cusuario);
            if (obj == null) {
                obj = new tsegusuariootp();
                obj.cusuario = cusuario;
                insertar = true;
            }
            obj.fcreacion = Fecha.GetFechaSistema();
            // suma 5 minutos a la fecha
            obj.fcaducidad = obj.fcreacion.GetValueOrDefault().AddMinutes(5);

            String encriptado = EncriptarPassword.Encriptar(clavetemporal);
            obj.cseguridad = encriptado;
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
            tsegusuariootp obj = TsegUsuarioOtpDal.Find(cusuario);
            if (obj != null) {
                DateTime d = Fecha.GetFechaSistema();
                if (obj.fcreacion.GetValueOrDefault().CompareTo(d) <= 0 && obj.fcaducidad.GetValueOrDefault().CompareTo(d) <= 0) {
                    error = false;
                }
                String encriptado = EncriptarPassword.Encriptar(claveOtp);
                if (obj.cseguridad.CompareTo(encriptado) != 0) {
                    error = false;
                }
            }
            if (error) {
                throw new AtlasException("", "CLAVE TEMPORAL INVALIDA");
            }
        }


    }
}
