using dal.cartera;
using modelo;
using System.Data.SqlClient;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;
using util.dto.mantenimiento;
using System.Collections.Generic;
using dal.inversiones.contabilizacion;
using dal.inversiones.controlaccrualfechas;

namespace inversiones.lote.previo
{
    /// <summary>
    /// Clase que se encarga de eliminar e insertar la operación de contabilización del accrual diario de los intereses generados.
    /// </summary>
    public class ContabilizacionAccrual : ITareaPrevia
    {

        private RqMantenimiento rqmantenimiento = null;

        /// <summary>
        /// Elimina e inserta la operación de la contabilización del accrual diario.
        /// </summary>
        /// <param name="requestmodulo">Request del  módulo con el que se ejecuta la transaccion.</param>
        /// <param name="ctarea">Identificador de la tarea a ejectuar.</param>
        /// <param name="orden">Orden con el cual se ejecuta la tarea.</param>
        /// <returns></returns>
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden) {

            //TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);

            Insertar(requestmodulo, ctarea, orden);

            //rqmantenimiento = (RqMantenimiento)requestmodulo.GetDatos("RQMANTENIMIENTO");

            //try
            //{
            //   TinvContabilizacionDal.ContabilizaAccruaDiario(
            //    rqmantenimiento.Cusuario
            //    , rqmantenimiento.Cagencia
            //    , rqmantenimiento.Csucursal
            //    , rqmantenimiento.Fconatable);
            //}
            //catch
            //{ }


        }

        /// <summary>
        /// Metodo que se encarga de insertar valores acumulados de movimientos de cartera, para su posterior contabilización.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden) {

            string JPQL_INSERT = "insert into tconcomprobanteprevio(fcontable, particion, ccompania, ccuenta, cagencia," +
                                    " csucursal, cmoduloproducto, cproducto, ctipoproducto, debito, " +
                                    " cclase, cmoneda, ctransaccion, cmodulo, cmonedaoficial," +
                                    " monto, montooficial) " +
                                    " SELECT i.fcontable, i.particion, i.ccompania, i.ccuenta, 2, " +
                                    " 1, 0, 0, 0, i.debito, " +
                                    " (SELECT c.cclase FROM tconcatalogo c WHERE c.ccuenta = i.ccuenta) cclase, 'USD', 1111, 12, 'USD', " +
                                    " sum(i.valor), sum(i.valor) " +
                                    " FROM tinvcontabilizacion i " +
                                    " WHERE i.fcontable >= @fcontabledesde and i.fcontable <= @fcontablehasta and i.particion >= @particion and i.ccompania = 1 " +
                                    " AND i.procesocdetalle   = 'ACCINT' " +
                                    " and not exists(select 1 from tconcomprobanteprevio con where con.fcontable = i.fcontable and con.particion = i.particion " +
                                    " and con.ccompania = i.ccompania and con.ccuenta = i.ccuenta " +
                                    " and con.debito = i.debito) " +
                                    " group by i.fcontable, i.particion, i.ccompania, i.ccuenta, i.debito ";
            // fecha contable a contabilizar.
            int? fcontabledesde = requestmodulo.Fconatble;
            int? fcontablehasta = requestmodulo.Fconatble;
            if (fcontabledesde == null) {
                return;
            }
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_INSERT, new SqlParameter("fcontabledesde", fcontabledesde), new SqlParameter("fcontablehasta", fcontablehasta)
                                                           , new SqlParameter("particion", Constantes.GetParticion(fcontabledesde ?? 0)), new SqlParameter("compania", requestmodulo.Ccompania));


            //int? fdesde = null;
            //int? fhasta = null;
            //int? fdesdeVarPre = null;
            //int? fhastaVarPre = null;

            //tinvcontrolaccrualfechas tinvControl = TinvControlAccrualFechasDal.Find(1);

            //if (tinvControl != null)
            //{
            //    fdesde = tinvControl.finicio;
            //    fhasta = tinvControl.ffin;
            //}

            //if (fdesde == null || fhasta == null || fdesde == 0 || fhasta == 0) return;

            //tinvcontrolaccrualfechas tinvControlVarPre = TinvControlAccrualFechasDal.Find(2);

            //if (tinvControlVarPre != null)
            //{
            //    fdesdeVarPre = tinvControlVarPre.finicio;
            //    fhastaVarPre = tinvControlVarPre.ffin;
            //}

            //AtlasContexto contexto = Sessionef.GetAtlasContexto();
            //contexto.Database.ExecuteSqlCommand(JPQL_INSERT, 
            //    new SqlParameter("cmodulo", 12), 
            //    new SqlParameter("cagencia", rqmantenimiento.Cagencia), 
            //    new SqlParameter("csucursal", rqmantenimiento.Csucursal),
            //    new SqlParameter("fdesde", fdesde),
            //    new SqlParameter("fhasta", fdesde),
            //    new SqlParameter("fdesdeVarPre", fdesdeVarPre),
            //    new SqlParameter("fhastaVarPre", fhastaVarPre));


            //tinvControl.finicio = null;
            //tinvControl.fmodificacion = rqmantenimiento.Freal;
            //tinvControl.cusuariomod = rqmantenimiento.Cusuario;
            //Sessionef.Actualizar(tinvControl);

            //tinvControlVarPre.finicio = null;
            //tinvControlVarPre.fmodificacion = rqmantenimiento.Freal;
            //tinvControlVarPre.cusuariomod = rqmantenimiento.Cusuario;
            //Sessionef.Actualizar(tinvControlVarPre);

            //TinvContabilizacionDal.UpdateFreal("ACCINT", fdesde.Value, fhasta.Value);
            //TinvContabilizacionDal.UpdateFreal("VARPRE", fdesdeVarPre.Value, fhastaVarPre.Value);

        }


        //private void Eliminar(RequestModulo requestmodulo, string ctarea, int? orden) {

        //    //string JPQL_DELETE = "delete from tconcomprobanteprevio where ";
        //    //// fecha contable a contabilizar.
        //    //int? fcontabledesde = 20181216;// requestmodulo.GetInt("fcontabledesde");
        //    //int? fcontablehasta = 20181216;// requestmodulo.GetInt("fcontablehasta");
        //    //if (fcontabledesde == null) {
        //    //    return;
        //    //}
        //    //AtlasContexto contexto = Sessionef.GetAtlasContexto();
        //    //contexto.Database.ExecuteSqlCommand(JPQL_INSERT, new SqlParameter("fcontabledesde", fcontabledesde), new SqlParameter("fcontablehasta", fcontablehasta)
        //    //                                               , new SqlParameter("particion", Constantes.GetParticion(fcontabledesde ?? 0)), new SqlParameter("compania", requestmodulo.Ccompania));


        //}
    }


}
