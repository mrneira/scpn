using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util;
using modelo;
using System.Data.Entity.Validation;

namespace core.util {
    public class ManejadorExcepciones {

        /// <summary>
        /// Si es una excepcion del core, completa datos a presentar al usuario.
        /// </summary>
        /// <param name="e"></param>
        /// <returns>String</returns>
        public static Response GetMensajeResponse(Exception e) {
            Response response = new Response();
            try {
                if (e is AtlasException) {
                    GetMensajeCore((AtlasException)e, response);
                } else if (e is DbEntityValidationException) {
                    GetDbEntityValidationException(e, response);
                } else {
                    Exception i = e.InnerException;
                    if (i == null) {
                        response.SetCod("-1");
                        response.SetMsgusu(e.Message);
                    } else {
                        GetMensajeInnerException(i, response);
                    }
                }
            } catch (Exception) {
                response.SetCod("-1");
                response.SetMsgusu(e.Message);
            }
            return response;
        }

        /// <summary>
        /// Si es una excepcion del core, completa datos a presentar al usuario.
        /// </summary>
        /// <param name="e"></param>
        /// <returns>String</returns>
        public static String GetMensaje(Exception e) {
            Response response = GetMensajeResponse(e);
            var jsonResp = JsonConvert.SerializeObject(response);
            return jsonResp;
        }

        /// <summary>
        /// Entrega un mensaje a presentar al usuario cuando es una excepcion del core.
        /// </summary>
        /// <param name="e"></param>
        /// <returns>String</returns>
        private static void GetMensajeCore(AtlasException e, Response response) {
            String msg = "";
            response.SetCod(e.Codigo);
            try {
                tgenresultados r = new tgenresultados();
                AtlasContexto contexto = new AtlasContexto();
                r = contexto.tgenresultados.Where(x => x.cresultado == e.Codigo).First();
                msg = r.mensaje;
            } catch (Exception) {
                response.SetMsgusu("MENSAJE APLICATIVO NO DEFINIDO EN TGENRESULTADOS CODIGO: " + e.Codigo);
                return;
            }
            try {

                if (e.parametros != null) {
                    msg = string.Format(msg, e.parametros);
                }
            } catch (Exception) {
                // no tomar accion
            }
            response.SetMsgusu(msg);
        }

        /// <summary>
        /// Manejo de errores de validacion del entity framework.
        /// </summary>
        /// <param name="e"></param>
        /// <param name="response"></param>
        private static void GetDbEntityValidationException(Exception e, Response response) {
            string mensaje = "";
            DbEntityValidationException ex = (DbEntityValidationException)e;
            foreach (var eve in ex.EntityValidationErrors) {
                mensaje = mensaje + "Tabla " + eve.Entry.Entity.GetType().Name + " en estado" + eve.Entry.State.ToString() + "tiene los siguientes errores: " ;
                foreach (var ve in eve.ValidationErrors) {
                    mensaje = mensaje + "- Property: " + ve.PropertyName + " Error: " + ve.ErrorMessage;
                }
            }
            response.SetCod("-1");
            response.SetMsgusu(mensaje);
        }

        private static void GetMensajeInnerException(Exception e, Response response) {
            if(e.InnerException != null) {
                e = e.InnerException;
            }
            if (e is System.Data.SqlClient.SqlException) {
                SqlExceptionUtil.LlenarMensajeSqlException((System.Data.SqlClient.SqlException)e, response);
                return;
            }
            response.SetCod("-1");
            response.SetMsgusu(e.Message);
        }

    }
}
