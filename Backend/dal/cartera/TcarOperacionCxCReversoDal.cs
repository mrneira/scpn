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
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionCxCReverso.
    /// </summary>
    public class TcarOperacionCxCReversoDal {

        /// <summary>
        /// Metodo que genera un registro en la tabla de reversos teniendo como base un registro de la tabla TcarOperacionCxC.
        /// </summary>
        /// <param name="tcaroperacioncxc">Objeto que contiene los datos a generar historia.</param>
        /// <param name="fproceso">Fecha de proceso con la cual se genera el registro de historia.</param>
        /// <param name="mensaje">Numero de mensaje con el que se crea el registro de reverso.</param>
        public static void RegistraHistoria(tcaroperacioncxc tcaroperacioncxc, int fproceso, String mensaje) {
            tcaroperacioncxcreverso obj = new tcaroperacioncxcreverso();
            obj.mensaje = mensaje;
            obj.coperacion = tcaroperacioncxc.coperacion;
            obj.csaldo = tcaroperacioncxc.csaldo;
            obj.numcuota = tcaroperacioncxc.numcuota;
            obj.ftrabajo = fproceso;
            obj.fvigencia = tcaroperacioncxc.fvigencia;
            obj.monto = tcaroperacioncxc.monto;
            obj.fpago = tcaroperacioncxc.fpago;
            obj.mensajerecuperar = tcaroperacioncxc.mensaje;

            Sessionef.Save(obj);
            tcaroperacioncxc.Registroregistrosreverso = true;
        }
        
        /// <summary>
        /// Entrega una lista de TcarOperacionCxCReverso, dado un numeor de mensaje y operacion de cartera.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>List TcarOperacionCxCReverso</returns>
        public static List<tcaroperacioncxcreverso> FindAndDetach(String mensaje, String coperacion) {           
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcaroperacioncxcreverso> ldatos = contexto.tcaroperacioncxcreverso.AsNoTracking().Where(x => x.mensaje.Equals(mensaje) && x.coperacion == coperacion).ToList();
            return ldatos;
        }

        /**
         * Sentencia que elimina regirtros de rubros de reverso de cxc, para una operacion y numero de mensaje.
         */
         private static String JPQL_DELETE = "delete from TcarOperacionCxCReverso where mensaje = @mensaje and coperacion = @coperacion ";

        /// <summary>
        /// Elimina registros de cxc reverso dado un numero de operacion y mensaje.
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
