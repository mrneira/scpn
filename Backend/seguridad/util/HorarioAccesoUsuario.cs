using dal.seguridades;
using modelo;
using System;
using System.Security.Cryptography;
using System.Text;
using util;

namespace seguridad.util {

    /// <summary>
    /// Clase encargada de validar el horario de acceso a la aplicacion.
    /// </summary>
    public class HorarioAccesoUsuario {

        /// <summary>
        /// Metodo que valida el horario de acceso al sistema por usuario
        /// </summary>
        /// <param name="ccompania"></param>
        /// <param name="cusuario"></param>
        /// <param name="freal"></param>
        /// <returns></returns>
        public static void validaHorarioAccesoPorUsuario(int ccompania, string cusuario, DateTime freal) {
            int diasemana = (int)freal.DayOfWeek;
            //diasemana = diasemana + 1;
            if (String.IsNullOrEmpty(cusuario)) {
                throw new AtlasException("SEG-024", "USUARIO NO ENVIADO");
            }

            tseghorariousuario horario = TsegHorarioUsuarioDal.FindActivo(ccompania, cusuario, diasemana);
            if (horario == null) {
                throw new AtlasException("SEG-025", "EL USUARIO: {0}, NO TIENE DEFINIDO UN HORARIO DE ACCESO PARA EL DIA ACTUAL", cusuario);
            }
            if (horario.horaini == null || horario.horafin == null) {
                throw new AtlasException("SEG-027", "EL USUARIO: {0}, DEBE TENER REGISTRADO LA HORA DE INICIO Y FIN", cusuario);
            }
            string hora = freal.Hour.ToString().PadLeft(2, '0');
            string minuto = freal.Minute.ToString().PadLeft(2, '0');


            int horaacceso = int.Parse(hora + "" + minuto);
            int horaini = int.Parse(horario.horaini.Replace(":", ""));
            int horafin = int.Parse(horario.horafin.Replace(":", ""));

            if (horaacceso < horaini || horaacceso > horafin) {
                throw new AtlasException("SEG-026", "EL USUARIO: {0}, NO ESTA AUTORIZADO PARA ACCEDER EL DIA DE HOY EN ESTA HORA", cusuario);
            }
        }

    }
}
