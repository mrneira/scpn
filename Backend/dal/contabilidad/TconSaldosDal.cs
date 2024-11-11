using dal.generales;
using modelo;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using util;
using util.servicios.ef;

namespace dal.contabilidad {

    public class TconSaldosDal {

        public static tconsaldos Obtienesaldo(tconcomprobantedetalle detalle) {
            tconsaldos tconSaldos = TconSaldosDal.FindWithLock(detalle.ccuenta, (int)detalle.cagencia, (int)detalle.csucursal, (int)detalle.ccompania, detalle.cmoneda);
            if (tconSaldos == null) {
                tconSaldos = TconSaldosDal.Crear(detalle.ccuenta, (int)detalle.cagencia, (int)detalle.csucursal, (int)detalle.ccompania, detalle.cmoneda, detalle.cmonedaoficial, (int)detalle.fcontable);
                Sessionef.Save(tconSaldos);
            }
            return tconSaldos;
        }

        private static string SQL = "select t.* from TconSaldos t where t.ccuenta = @ccuenta and t.cagencia = @cagencia " 
                  + " and t.csucursal = @csucursal and t.ccompania = @ccompania and t.cmoneda = @cmoneda ";

        /// <summary>
        /// Busca en la base de datos un registro de saldo contable vigente bloqueando el registro.
        /// </summary>
        /// <param name="ccuenta">Codigo de cuenta conatable.</param>
        /// <param name="cagencia">Codigo de agencia.</param>
        /// <param name="csucursal">Codigo de sucursal.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="cmoneda">Codigo de moneda asociada a la cuenta contable.</param>
        /// <returns></returns>
        public static tconsaldos FindWithLock(string ccuenta, int cagencia, int csucursal, int ccompania, string cmoneda) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconsaldos obj;
            obj = contexto.tconsaldos.SqlQuery(SQL, new SqlParameter("@ccuenta", ccuenta),
                                                            new SqlParameter("@cagencia", cagencia),
                                                            new SqlParameter("@csucursal", csucursal),
                                                            new SqlParameter("@ccompania", ccompania),
                                                            new SqlParameter("@cmoneda", cmoneda)).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Crea un registro de TconSaldos.
        /// </summary>
        /// <param name="ccuenta">Codigo de cuenta conatable.</param>
        /// <param name="cagencia">Codigo de agencia.</param>
        /// <param name="csucursal">Codigo de sucursal.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="cmoneda">Codigo de moneda asociada a la cuenta contable.</param>
        /// <param name="cmonedaoficial">Codigo de moneda oficial o moneda del pais.</param>
        /// <param name="fcontable">Fecha contable.</param>
        /// <returns></returns>
        public static tconsaldos Crear(string ccuenta, int cagencia, int csucursal, int ccompania, string cmoneda, string cmonedaoficial, int fcontable) {
            tconsaldos t = new tconsaldos();
            t.ccuenta = ccuenta;
            t.cagencia = cagencia;
            t.csucursal = csucursal;
            t.ccompania = ccompania;
            t.cmoneda = cmoneda;
            t.fvigencia = fcontable;
            t.monto = 0;
            t.montooficial = 0;
            t.cmonedaoficial = cmonedaoficial;
            return t;
        }

        /// <summary>
        /// Busca en la base de datos un registro de saldo contable vigente bloqueando el registro.
        /// </summary>
        /// <param name="nivel">Codigo de nivel de cuenta conatable.</param>
        /// <param name="ccuenta">Codigo de agencia.</param>
        /// <param name="csucursal">Codigo de sucursal.</param>
        /// <param name="cagencia">Codigo de cagencia.</param>
        /// <returns></returns>
        public static List<tconsaldos> FindSaldosAlaFecha(int nivel, string ccuenta, int ccompania, int csucursal, int cagencia)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconsaldos> lista = contexto.tconsaldos.Include("tconcatalogo").Where(x => (!ccuenta.Equals("") ? x.ccuenta.Equals(ccuenta):true)
            && x.tconcatalogo.cnivel <= nivel
            && x.tconcatalogo.movimiento.Value.Equals(true) 
            && x.cagencia == cagencia
            && x.csucursal == csucursal).ToList();

            foreach(tconsaldos saldo in lista){
                saldo.Mdatos.Add("nombreCuenta", saldo.tconcatalogo.nombre);
            }
            return lista;
        }

    }

}
