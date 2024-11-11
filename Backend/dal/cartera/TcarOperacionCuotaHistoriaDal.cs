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
    /// Clase que implemeta dml's manuales de la tabla TcarOperacionCuotaHistoria.
    /// </summary>
    public class TcarOperacionCuotaHistoriaDal {
        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TcarOperacionCuotaDto.
        /// </summary>
        /// <param name="tcaroperacioncuota">Objeto que contiene los datos a generar historia.</param>
        /// <param name="fproceso">Fecha de proceso con la cual se genera el registro de historia.</param>
        /// <param name="mensaje">Numero de mensaje con el que se crea el registro de reverso.</param>
        /// <param name="generaregistroreverso">True indica que se crea un registro en la tabla TcarOperacionRubroReverso, para ejecutar reversos de cajero.</param>
        /// <returns>int</returns>
        public static void RegistraHistoria(tcaroperacioncuota tcaroperacioncuota, int fproceso, String mensaje,
                Boolean generaregistroreverso) {
            if (generaregistroreverso && !tcaroperacioncuota.Registroregistrosreverso) {
                TcarOperacionCuotaReversoDal.RegistraHistoria(tcaroperacioncuota, fproceso, mensaje);
            }
            // Cambia los mensajes del bean principal.
            tcaroperacioncuota.mensaje = (mensaje);
            if ((tcaroperacioncuota.fvigencia >= (fproceso))
                    || Constantes.EsUno(tcaroperacioncuota.GetString("registrohistoria"))) {
                return;
            }
            TcarOperacionCuotaHistoriaDal.Historia(tcaroperacioncuota, fproceso);
            tcaroperacioncuota.AddDatos("registrohistoria", "1");
            tcaroperacioncuota.fvigencia = (fproceso);
        }
        
        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TcarOperacionCuotaDto.
        /// </summary>
        /// <param name="tcaroperacioncuota">Objeto que contiene los datos a generar historia.</param>
        /// <param name="fproceso">Fecha de proceso con la cual se genera el registro de historia.</param>
        /// <returns>int</returns>
        private static void Historia(tcaroperacioncuota tcaroperacioncuota, int fproceso) {
            int fcaducidad = Fecha.AdicionaDias365(fproceso, -1);

            tcaroperacioncuotahistoria obj = new tcaroperacioncuotahistoria();
            obj.coperacion = tcaroperacioncuota.coperacion;
            obj.numcuota = tcaroperacioncuota.numcuota;
            obj.fcaducidad = fcaducidad;
            obj.particion = Constantes.GetParticion(fcaducidad);
            Cuota r = new Cuota();
            IEnumerable<FieldInfo> lcamposcuota = r.GetType().GetAllFields();
            List<String> lcampos = DtoUtil.GetCamposSinPK(tcaroperacioncuota);
            foreach (String campo in lcampos) {
                try {
                    if (campo.Equals("mensajeanterior")) {
                        continue;
                    }
                    // para no generar hsitorico de campos de la clase padre Cuota
                    if (DtoUtil.GetCampo(lcamposcuota, campo) != null) {
                        continue;
                    }
                    Object valor = DtoUtil.GetValorCampo(tcaroperacioncuota, campo);
                    DtoUtil.SetValorCampo(obj, campo, valor);
                } catch (Exception) {
                    throw new AtlasException("BCAR-0009", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE HISTORIA: {1} ", campo, MethodBase.GetCurrentMethod().DeclaringType.Name);
                }
            }
            Sessionef.Grabar(obj);


        }

        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de cuotas, para una operacion y numero de mensaje.
        /// </summary>
            private static String JPQL_DELETE = "delete from TcarOperacionCuotaHistoria where mensaje = @mensaje and coperacion = @coperacion ";

        /// <summary>
        /// Elimina registros de historia de cuotas dado un numero de operacion y mensaje.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>int</returns>
        public static int Delete(String mensaje, String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("mensaje", mensaje), new SqlParameter("coperacion", coperacion));
        }
    }
}
