using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;
using System;
using modelo.interfaces;
using System.Data.SqlClient;
using System.Reflection;
using modelo.helper.cartera;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionRubroHistoria.
    /// </summary>
    public class TcarOperacionRubroHistoriaDal {

        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TcarOperacionRubro.
        /// </summary>
        /// <param name="cuota">Objeto que contiene datos de la cabecera de una cuota.</param>
        /// <param name="rubro">Objeto que contiene los datos a generar historia.</param>
        /// <param name="fproceso">Fecha de proceso con la cual se genera el registro de historia.</param>
        /// <param name="mensaje">Numero de mensaje con el que se crea el registro de reverso.</param>
        /// <param name="generaregistroreverso">True indica que se crea un registro en la tabla TcarOperacionRubroReverso, para ejecutar reversos de cajero.</param>
        /// <returns></returns>
        public static void RegistraHistoria(tcaroperacioncuota cuota, tcaroperacionrubro rubro, int fproceso, String mensaje,
                Boolean generaregistroreverso, int decimales) {
            if (generaregistroreverso && !rubro.Registroregistrosreverso) {
                TcarOperacionRubroReversoDal.RegistraHistoria(rubro, fproceso, mensaje);
                // Cambia los mensajes del bean principal para poder reversar.
                rubro.mensaje = (mensaje);
            }
            if ((rubro.fvigencia >= fproceso) || Constantes.EsUno(rubro.GetString("registrohistoria"))) {
                if (!rubro.Registroregistrosreverso) {
                    rubro.AddDatos("registrohistoria", "1");
                }
                return;
            }
            // Cambia los mensajes del bean principal.
            rubro.mensaje = (mensaje);
            TcarOperacionRubroHistoriaDal.Historia(rubro, fproceso);
            rubro.AddDatos("registrohistoria", "1");
            if ((rubro.esaccrual == null) || !((bool)rubro.esaccrual) || rubro.accrual <= 0) {
                rubro.fvigencia = (fproceso);
                return;
            }

            // se cambia el valor si el accrual diario es mayor a cero
            decimal saldo = TcarOperacionRubroDal.GetSaldoAccrual(cuota, rubro, fproceso, decimales);
            // El saldo del registro vigente que incluir descuentos y cobros
            rubro.saldo = (saldo + rubro.cobrado + rubro.descuento);

            rubro.fvigencia = (fproceso);
        }

        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TcarOperacionRubro.
        /// </summary>
        /// <param name="tcaroperacionrubro">Objeto que contiene los datos a generar historia.</param>
        /// <param name="fproceso">Fecha de proceso con la cual se genera el registro de historia.</param>
        /// <returns></returns>
        private static void Historia(tcaroperacionrubro tcaroperacionrubro, int fproceso) {
            int fcaducidad = Fecha.AdicionaDias365(fproceso, -1);

            tcaroperacionrubrohistoria obj = new tcaroperacionrubrohistoria();
            obj.coperacion = tcaroperacionrubro.coperacion;
            obj.numcuota = tcaroperacionrubro.numcuota;
            obj.csaldo = tcaroperacionrubro.csaldo;
            obj.fcaducidad = fcaducidad;
            obj.particion = Constantes.GetParticion(fcaducidad);
            Rubro r = new Rubro();
            IEnumerable<FieldInfo> lcamposrubro = r.GetType().GetAllFields();
            List<String> lcampos = DtoUtil.GetCamposSinPK((IBean)tcaroperacionrubro);
            foreach (String campo in lcampos) {
                try {
                    // para no generar hsitorico de campos de la clase padre Rubro
                    if (DtoUtil.GetCampo(lcamposrubro, campo) != null) {
                        continue;
                    }
                    Object valor = DtoUtil.GetValorCampo(tcaroperacionrubro, campo);
                    DtoUtil.SetValorCampo(obj, campo, valor);
                } catch (Exception) {
                    throw new AtlasException("BCAR-0009", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE HISTORIA: {1} ", campo,
                            obj.GetType());

                }
            }
            Sessionef.Save(obj);
        }

        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de rubros de cuotas, para una operacion y numero de mensaje.
        /// </summary>
        private static String JPQL_DELETE = "delete from TcarOperacionRubroHistoria where mensaje = @mensaje and coperacion = @coperacion ";

        /// <summary>
        /// Elimina registros de rubro de historia de cuotas dado un numero de operacion y mensaje.
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
