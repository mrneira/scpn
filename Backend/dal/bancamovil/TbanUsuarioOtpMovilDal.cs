using dal.bancaenlinea;
using modelo;
using modelo.helper;
using System;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.bancamovil {
    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TbanUsuarioOtpMovil.
    /// </summary>
    public class TbanUsuarioOtpMovilDal {

        /// <summary>
        /// Entrega un registro con los datos de password de una sola vez por usuario.
        /// </summary>
        public static tbanusuariootpmovil Find(string cusuario, string serial) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tbanusuariootpmovil obj = contexto.tbanusuariootpmovil.AsNoTracking().Where(x => x.cusuario.Equals(cusuario) && x.serial==serial).SingleOrDefault();
            if (obj == null) {
                return null;
            }

            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Entrega un registro con los datos de password de una sola vez por usuario.
        /// </summary>
        public static tbanusuariootpmovil Crear(String cusuario, string serial, String clavetemporal, String pin) {
            Boolean insertar = false;
            tbanusuariootpmovil obj = TbanUsuarioOtpMovilDal.Find(cusuario, serial);
            if (obj == null) {
                obj = new tbanusuariootpmovil();
                obj.cusuario = cusuario;
                insertar = true;
            }
            obj.serial = serial;
            obj.fcreacion = Fecha.GetFechaSistema();
            // suma 5 minutos a la fecha
            obj.fcaducidad = obj.fcreacion.GetValueOrDefault().AddMinutes(5);

            String encriptado = EncriptarPassword.Encriptar(clavetemporal);
            obj.password = encriptado;

            if (pin != null)
            {
                String pinencript = EncriptarPassword.Encriptar(pin);
                obj.pin = pinencript;
            }

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
        public static void ValidarPassword(String cusuario, string serial, String claveOtp) {
            Boolean error = true;
            tbanusuariootpmovil obj = TbanUsuarioOtpMovilDal.Find(cusuario, serial);
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
