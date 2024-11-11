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
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionRubroReverso.
    /// </summary>
    public class TcarOperacionRubroReversoDal {

        /// <summary>
        /// Metodo que genera un registro en la tabla de reversos teniendo como base un registro de la tabla TcarOperacionRubro.
        /// </summary>
        /// <param name="tcaroperacionrubro">Objeto que contiene los datos a generar historia.</param>
        /// <param name="fproceso">Fecha de proceso con la cual se genera el registro de historia.</param>
        /// <param name="mensaje">Numero de mensaje con el que se crea el registro de reverso.</param>
        /// <returns></returns>
        public static void RegistraHistoria(tcaroperacionrubro tcaroperacionrubro, int? fproceso, String mensaje) {
            tcaroperacionrubroreverso obj = new tcaroperacionrubroreverso();
            obj.mensaje = mensaje;
            obj.coperacion = tcaroperacionrubro.coperacion;
            obj.numcuota = (int)tcaroperacionrubro.numcuota;
            obj.csaldo = tcaroperacionrubro.csaldo;
            obj.ftrabajo = (fproceso);
            obj.mensajerecuperar = (tcaroperacionrubro.mensaje);
            Rubro r = new Rubro();
            IEnumerable<FieldInfo> lcamposrubro = r.GetType().GetAllFields();
            List<String> lcampos = DtoUtil.GetCamposSinPK((IBean)tcaroperacionrubro);
            foreach (String campo in lcampos) {
                if (campo.Equals("mensaje") || campo.Equals("mensajeanterior") || campo.Equals("ftrabajo")) {
                    continue;
                }
                // para no generar hsitorico de campos de la clase padre Rubro
                if(DtoUtil.GetCampo(lcamposrubro, campo) != null) {
                    continue;
                }
                Object valor = DtoUtil.GetValorCampo(tcaroperacionrubro, campo);
                DtoUtil.SetValorCampo(obj, campo, valor);

            }
            Sessionef.Save(obj);
            tcaroperacionrubro.Registroregistrosreverso = true;
        }

        /// <summary>
        /// Entrega una lista de TcarOperacionRubroReverso, dado un numeor de mensaje y operacion de cartera.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje a buscar lista de registros.</param>
        /// <param name="coperacion">Numero de operacion de cartera a buscar la lisat de registros.</param>
        /// <returns>List TcarOperacionRubroReverso</returns>
        public static List<tcaroperacionrubroreverso> FindAndDetach(String mensaje, String coperacion) {
            List<tcaroperacionrubroreverso> lmovi = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            lmovi = contexto.tcaroperacionrubroreverso.AsNoTracking().Where(x => x.mensaje == mensaje && x.coperacion == coperacion).ToList();
            return lmovi;
        }

        /// <summary>
        /// Sentencia que elimina regirtros de rubros de reverso de cuotas, para una operacion y numero de mensaje.
        /// </summary>
        private static String JPQL_DELETE = "delete from TcarOperacionRubroReverso where mensaje = @mensaje and coperacion = @coperacion ";

        /// <summary>
        /// Elimina registros de rubros de reverso de cuotas dado un numero de operacion y mensaje.
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
