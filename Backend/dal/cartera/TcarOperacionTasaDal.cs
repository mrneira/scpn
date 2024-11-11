using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;
using System;
using util.dto.mantenimiento;
using System.Data.SqlClient;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionTasa.
    /// </summary>
    public class TcarOperacionTasaDal {

        /// <summary>
        /// Entrega la lista de tasas asociadas a una operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static IList<tcaroperaciontasa> Find(string coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcaroperaciontasa.AsNoTracking().Where(x => x.coperacion == coperacion).ToList();
        }

        /// <summary>
        /// Crea y entrega una isntancia de TcarOperacionTasaDto.
        /// </summary>
        /// <param name="tasaproducto">Definicion de tasas asociada al producto.</param>
        /// <returns></returns>
        public static tcaroperaciontasa CreateTcarOperacionTasa(tcarproductotasas tasaproducto) {
            tcaroperaciontasa tasa = new tcaroperaciontasa();
            tasa.csaldo = tasaproducto.csaldo;
            tasa.cmoneda = tasaproducto.cmoneda;
            tasa.ctasareferencial = (int)tasaproducto.ctasareferencial;
            tasa.operador = tasaproducto.operador;
            tasa.margen = tasaproducto.margen;
            return tasa;
        }

        /// <summary>
        /// Clona las tasas de la operacion anterior a la nueva operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion de arreglo de pagos</param>
        /// <param name="coperacionAnterior">Numero de operacion de cartera anterior.</param>
        /// <param name="coperacionnueva">Numero de operacion de cartera nueva.</param>
        public static void ClonarTcarOperacionTasaArregloPago(RqMantenimiento rqmantenimiento, String coperacionAnterior,
                String coperacionnueva) {
            IList<tcaroperaciontasa> ltasas = new List<tcaroperaciontasa>();
            IList<tcaroperaciontasa> ltasasanteriores = TcarOperacionTasaDal.Find(coperacionAnterior);
            foreach (tcaroperaciontasa obj in ltasasanteriores) {
                tcaroperaciontasa nuevo = (tcaroperaciontasa)obj.Clone();
                nuevo.coperacion = coperacionnueva;
                ltasas.Add(nuevo);
                Sessionef.Save(nuevo);
            }
            rqmantenimiento.AddDatos("TCAROPERACIONTASA-ARREGLO-PAGO", ltasas);
        }

        private static String JPQL_DELETE_ARREGLO_PAGOS = "delete from tcaroperaciontasa where coperacion = @coperacion ";

        /// <summary>
        /// Ejecuta reverso de arreglo de pagos de la nueva operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion creada en el arreglo de pagos.</param>
        public static void ReversoArregloPagos(String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE_ARREGLO_PAGOS, new SqlParameter("coperacion", coperacion));
        }


    }

}
