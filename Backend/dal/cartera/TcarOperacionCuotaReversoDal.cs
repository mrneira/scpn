using dal.cartera.cuenta;
using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionCuotaReverso.
    /// </summary>
    public class TcarOperacionCuotaReversoDal {

        /// <summary>
        /// Metodo que genera un registro en la tabla de reversos teniendo como base un registro de la tabla TcarOperacionRubro.
        /// </summary>
        /// <param name="tcaroperacioncuota">Objeto que contiene los datos a generar historia.</param>
        /// <param name="fproceso">Fecha de proceso con la cual se genera el registro de historia.</param>
        /// <param name="mensaje">Numero de mensaje con el que se crea el registro de reverso.</param>
        public static void RegistraHistoria(tcaroperacioncuota tcaroperacioncuota, int fproceso, String mensaje) {
            tcaroperacioncuotareverso obj = new tcaroperacioncuotareverso();
            obj.mensaje = mensaje;
            obj.coperacion = tcaroperacioncuota.coperacion;
            obj.numcuota = tcaroperacioncuota.numcuota;
            obj.ftrabajo = fproceso;
            obj.mensajerecuperar = tcaroperacioncuota.mensaje;
            Cuota r = new Cuota();
            IEnumerable<FieldInfo> lcamposcuota = r.GetType().GetAllFields();
            List<string> lcampos = DtoUtil.GetCamposSinPK(tcaroperacioncuota);

            foreach (string campo in lcampos) {
                if (campo.Equals("mensaje") || campo.Equals("mensajeanterior") || campo.Equals("ftrabajo")) {
                    continue;
                }
                // para no generar hsitorico de campos de la clase padre Cuota
                if (DtoUtil.GetCampo(lcamposcuota, campo) != null) {
                    continue;
                }
                try {
                    Object valor = DtoUtil.GetValorCampo(tcaroperacioncuota, campo);
                    DtoUtil.SetValorCampo(obj, campo, valor);
                } catch (Exception) {
                    throw new AtlasException("BCAR-0010", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE REVERSO: {1} ", campo, obj.GetType().Name);
                }
            }
            Sessionef.Save(obj);
           tcaroperacioncuota.Registroregistrosreverso = true;
        }
        
        /// <summary>
        /// Sentencia que entrega regirtros de cuotas para una operacion y numero de mensaje.
        /// </summary>

        /// <summary>
        /// Entrega una lista de TcarOperacionCuotaReverso, dado un numeor de mensaje y operacion de cartera.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>List TcarOperacionCuotaReverso</returns>
        public static List<tcaroperacioncuotareverso> FindAndDetach(String mensaje, String coperacion) {           
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcaroperacioncuotareverso> ldatos = contexto.tcaroperacioncuotareverso.AsNoTracking().Where(x => x.mensaje.Equals(mensaje) && x.coperacion == coperacion).ToList();
            return ldatos;
        }

        /**
         * Sentencia que elimina regirtros de rubros de reverso de cuotas, para una operacion y numero de mensaje.
         */
         private static String JPQL_DELETE = "delete from TcarOperacionCuotaReverso where mensaje = @mensaje and coperacion = @coperacion ";

        /// <summary>
        /// Elimina registros de cuotas reverso dado un numero de operacion y mensaje.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns></returns>
        public static void Delete(String mensaje, String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("mensaje", mensaje), new SqlParameter("coperacion", coperacion));            
        }
    }
}
