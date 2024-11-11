using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionCalificacion.
    /// </summary>
    public class TcarOperacionCalificacionDal {

        /// <summary>
        /// Busca y entrega entrega la calificacion de una operacion de cartera.
        /// </summary>
        public static tcaroperacioncalificacion Find(tcaroperacion tcarOperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacioncalificacion obj = contexto.tcaroperacioncalificacion.AsNoTracking().Where(x => x.coperacion == tcarOperacion.coperacion).SingleOrDefault();
            if (obj == null) {
                obj = TcarOperacionCalificacionDal.Crear(tcarOperacion);
            }
            return obj;
        }

        /// <summary>
        /// Busca y entrega entrega la calificacion de una operacion de cartera.
        /// </summary>
        public static tcaroperacioncalificacion FindFromDatabase(tcaroperacion tcarOperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacioncalificacion obj = contexto.tcaroperacioncalificacion.AsNoTracking().Where(x => x.coperacion == tcarOperacion.coperacion).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Crea un objeto de tipo TcarOperacionCalificacion, sin incluir calificacion.
        /// </summary>
        public static tcaroperacioncalificacion Crear(tcaroperacion tcarOperacion)
        {
            tcaroperacioncalificacion obj = new tcaroperacioncalificacion();
            obj.coperacion = tcarOperacion.coperacion;
            obj.cmoneda = tcarOperacion.cmoneda;
            obj.csegmento = tcarOperacion.csegmento;
            obj.cestadooperacion = tcarOperacion.cestadooperacion;
            obj.monto = Decimal.Zero;
            obj.saldo = Decimal.Zero;
            obj.porcentajeprovconstituida = Decimal.Zero;
            obj.porcentajeprovconstituidaant = Decimal.Zero;
            obj.porcentajeprovisionreq = Decimal.Zero;
            obj.porcentajeprovisionreqant = Decimal.Zero;
            obj.provisionrequerida = Decimal.Zero;
            obj.provisionconstituida = Decimal.Zero;
            obj.provisionrequeridaant = Decimal.Zero;
            obj.provisionconstituidaant = Decimal.Zero;
            obj.diasmorosidad = 0;
            obj.contabilizaprovision = false;
            obj.reversoprovanterior = false;
            return obj;
        }

        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de calificacion.
        /// </summary>
        private static String JPQL_DELETE = "delete from TcarOperacionCalificacion where coperacion = @coperacion ";

        /// <summary>
        /// Elimina registros de calificacion dado un numero de operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>int</returns>
        public static int Delete(String coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                return contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("coperacion", coperacion));
            }
            catch (System.InvalidOperationException) {
                return 0;
            }

        }

        private static string JPQL_PROV_REVERSP = "select o.csucursal, o.cagencia, oc.ctipocredito, oc.cestadooperacion, o.csegmento,oc.cmoneda, sum(oc.provisionconstituidaant) as monto "
            + "from TcarOperacionCalificacion oc, TcarOperacion o where oc.coperacion = o.coperacion and oc.reversoprovanterior = @reversoprovanterior "
            + " group by o.csucursal, o.cagencia, oc.ctipocredito, oc.cestadooperacion, o.csegmento, oc.cmoneda ";

        /// <summary>
        /// Metodo que entrega una lista de objetos con los valores a reversar por tipo de credito y estado de la operacion.
        /// </summary>
        public static IList<Dictionary<string, object>> GetProvisonReversar()
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@reversoprovanterior"] = 0;

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, JPQL_PROV_REVERSP);
            ch.registrosporpagina = 10000000;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        private static string JPQL_PROV_CONTABILIZAR = "select o.csucursal, o.cagencia, o.cmodulo, o.cproducto, o.ctipoproducto, oc.cestadooperacion, o.csegmento, oc.cmoneda, sum(oc.provisionconstituida) as monto "
            + "from TcarOperacionCalificacion oc, TcarOperacion o where oc.coperacion = o.coperacion and oc.contabilizaprovision = @contabilizaprovision  "
            + " group by o.csucursal, o.cagencia, o.cmodulo, o.cproducto, o.ctipoproducto, oc.cestadooperacion, o.csegmento, oc.cmoneda ";

        /// <summary>
        /// Metodo que entrega una lista de objetos con los valores a reversar por tipo de credito y estado de la operacion.
        /// </summary>
        public static IList<Dictionary<string, object>> getProvisonContabilizar()
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@contabilizaprovision"] = false;

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, JPQL_PROV_CONTABILIZAR);
            ch.registrosporpagina = 10000000;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        private static string SQL_UPD_PROV_CONTABILIZADA = "update TcarOperacionCalificacion set contabilizaprovision = '1',  reversoprovanterior = '1' ";

        /// <summary>
        /// Marca registros como contabiliados y ejecutado reverso de provision.
        /// </summary>
	    public static void MarcaConatbilizados()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_UPD_PROV_CONTABILIZADA);
        }



    }
}
