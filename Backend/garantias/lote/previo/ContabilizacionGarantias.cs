using dal.garantias;
using modelo;
using System.Data.SqlClient;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace garantias.lote.previo {
    public class ContabilizacionGarantias : ITareaPrevia {
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            TgarOperacionLoteDal.Eliminar(requestmodulo, ctarea);

            Insertar(requestmodulo, ctarea, orden);
        }

        /// <summary>
        /// Metodo que se encarga de insertar valores acumulados de movimientos de cartera, para su posterior contabilización.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            // fecha contable a contabilizar.
            int? fcontabledesde = requestmodulo.GetInt("fcontabledesde");
            int? fcontablehasta = requestmodulo.GetInt("fcontablehasta");
            if (fcontabledesde == null) {
                return;
            }
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_INSERT, new SqlParameter("fcontabledesde", fcontabledesde), new SqlParameter("fconatblehasta", fcontablehasta)
                                                           , new SqlParameter("particion", Constantes.GetParticion(fcontabledesde ?? 0)), new SqlParameter("compania", requestmodulo.Ccompania));
        }

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones de cartera a calcular calificacion y calculo de provision.
        /// </summary>
        private static string JPQL_INSERT = "insert into TCONCOMPROBANTEPREVIO (fcontable, particion, ccompania, ccuenta, cagencia, csucursal, cmoduloproducto, cproducto, ctipoproducto, debito,"
            + "   cclase, cmoneda, ctransaccion, cmodulo, cmonedaoficial, monto, montooficial) "
            + " select fcontable, particion, ccompania, ccuenta, cagenciaorigen, csucursalorigen, 0, 0, 0, debito, "
            + "   cclase, cmoneda, ctransaccionorigen, cmoduloorigen, cmonedalocal, sum(monto) monto, sum(montomonedalocal) monedalocal "
            + " from TGARMOVIMIENTO mov "
            + " where fcontable > @fcontabledesde and fcontable <= @fconatblehasta and particion >= @particion and ccompania = @compania and reverso is null and mensajereverso is null "
            + " and not exists (select 1 from tconcomprobanteprevio con where con.fcontable = mov.fcontable and con.particion = mov.particion "
            + "                 and con.ccompania = mov.ccompania and con.ccuenta = mov.ccuenta and con.cagencia = mov.cagenciaorigen "
            + "                 and con.csucursal = mov.csucursalorigen and con.debito = mov.debito and con.cclase = mov.cclase "
            + "                 and con.cmoneda = mov.cmoneda and con.ctransaccion = mov.ctransaccion and con.cmodulo = mov.cmodulotransaccion "
            + "                 and con.cmonedaoficial = mov.cmonedalocal and con.cmoduloproducto = mov.cmodulo and con.cproducto = mov.cproducto "
            + "                 and con.ctipoproducto = mov.ctipoproducto) "
            + " group by fcontable, particion, ccompania, ccuenta, cagenciaorigen, csucursalorigen, debito, cclase, cmoneda, ctransaccionorigen, cmoduloorigen, cmonedalocal ";
    }


}
