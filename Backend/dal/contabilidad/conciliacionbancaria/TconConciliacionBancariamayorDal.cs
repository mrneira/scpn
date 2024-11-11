using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.consulta;
using util.servicios.ef;
using modelo;
using modelo.servicios;
using modelo.helper;
using System.Data;

namespace dal.contabilidad.conciliacionbancaria {

    /// <summary>
    /// Clase que encapsula los procedimientos para ejecutar las operaciones del mayor contable.
    /// </summary>
    public class TconConciliacionBancariamayorDal {

        private static string SqlMaxPkMasUno = "select ISNULL(max(cconciliacionbancariamayor),0) + 1 cConciliacionBancariaMayor from tconconciliacionbancariamayor where @Uno = 1";

        /// <summary>
        /// Obtiene al mayor contable conciliado.
        /// </summary>
        /// <returns>long</returns>
        public static long GetcConciliacionBancariaMayor()
        {

            tconconciliacionbancariamayor fc = new tconconciliacionbancariamayor();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@Uno"] = 1;
            List<string> lcampos = new List<string>();
            lcampos.Add("cConciliacionBancariaMayor");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlMaxPkMasUno);
                fc = (tconconciliacionbancariamayor)ch.GetRegistro("tconconciliacionbancariamayor", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("CONBAN-001", "ERROR EN CÁLCULO DEL ID. PARA tconconciliacionbancariamayor");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }

        private static string SqlSelectCuentaFecha = "SELECT ISNULL(MAX(cusuariocreacion),'') MaxCUsuario FROM dbo.tconconciliacionbancariamayor WHERE (fcontable = @fcontable ) AND(ccuenta = @ccuenta )";

        /// <summary>
        /// Determina si existe el mayor de una cuenta y fecha contables determinadas.
        /// </summary>
        /// <param name="fcontable">Fecha contable.</param>
        /// <param name="ccuenta">Cuenta contable.</param>
        /// <returns>string<tConciliacion></returns>
        public static string GetcExisteCuentaFecha(int fcontable, string ccuenta)
        {

            tconconciliacionbancariamayor fc = new tconconciliacionbancariamayor();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fcontable"] = fcontable;
            parametros["@ccuenta"] = ccuenta;
            List<string> lcampos = new List<string>();
            lcampos.Add("MaxCUsuario");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlSelectCuentaFecha);
                fc = (tconconciliacionbancariamayor)ch.GetRegistro("tconconciliacionbancariamayor", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("CONBAN-001", "ERROR EN CÁLCULO DEL ID. PARA tconconciliacionbancariamayor");
            }

            return fc.Mdatos.Values.ElementAt(0).ToString();

        }

        /// <summary>
        /// Obtiene el mayor contable, dado su identificador.
        /// </summary>
        /// <param name="cConciliacionBancariaMayor">Identificador del mayor contable.</param>
        /// <returns>tconconciliacionbancariamayor<tConciliacion></returns>
        public static tconconciliacionbancariamayor Find(long cConciliacionBancariaMayor)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconconciliacionbancariamayor control = null;

            control = contexto.tconconciliacionbancariamayor.AsNoTracking().Where(x => x.cconciliacionbancariamayor == cConciliacionBancariaMayor).SingleOrDefault();
            if (control == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(control);
            return control;
        }

        /// <summary>
        /// Actualiza el estado del mayor contable sujeto a conciliación, dadas la cuenta contable, y fechas contables inicial y final.
        /// </summary>
        /// <param name="ccuenta">Identificador del mayor contable.</param>
        /// <param name="fechainicial">Fecha contable inicial.</param>
        /// <param name="fechafinal">Fecha contable Final.</param>
        /// <returns>int</returns>
        public static int ActualizarEstado(string ccuenta, int fechainicial, int fechafinal)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = " UPDATE tconconciliacionbancariamayor SET estadoconciliacioncdetalle = CASE WHEN tcb.cconciliacionbancariamayor IS NULL THEN '2' ELSE '1' END FROM tconconciliacionbancariamayor LEFT OUTER JOIN tconconciliacionbancaria tcb ON tcb.cconciliacionbancariamayor = tconconciliacionbancariamayor.cconciliacionbancariamayor WHERE tconconciliacionbancariamayor.fcontable BETWEEN " + 
                    fechainicial + 
                    " AND " + 
                    fechafinal  + 
                    " AND tconconciliacionbancariamayor.ccuenta = '" + 
                    ccuenta.Trim()  + 
                    "' and tcb.optlock = 1 ";

                return contexto.Database.ExecuteSqlCommand(lSQL);

            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }

        }

        /// <summary>
        /// Obtiene el mayor contable sujeto a conciliación, dados el comprobante contable, fecha contable, partición y secuencia.
        /// </summary>
        /// <param name="ccomprobante">Comprobante contable.</param>
        /// <param name="fcontable">Fecha contable.</param>
        /// <param name="particion">Partición.</param>
        /// <param name="secuencia">Secuencia.</param>
        /// <returns>tconconciliacionbancariamayor<tConciliacion></returns>
        public static tconconciliacionbancariamayor Find(string ccomprobante, int fcontable, int particion, int secuencia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconconciliacionbancariamayor obj;
            obj = contexto.tconconciliacionbancariamayor.Where(x => x.ccomprobante.Equals(ccomprobante) &&
                                                            x.fcontable == fcontable &&
                                                            x.particion == particion &&
                                                            x.secuencia == secuencia).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Elimina en cascada la conciliación bancaria, el extracto y el mayor contable, dados el comprobante contable, fecha contable, partición y secuencia.
        /// </summary>
        /// <param name="ccomprobante">Comprobante contable.</param>
        /// <param name="fcontable">Fecha contable.</param>
        /// <param name="particion">Partición.</param>
        /// <param name="secuencia">Secuencia.</param>
        /// <returns></returns>
        public static void EliminarEnCascada(string ccomprobante, int fcontable, int particion, int secuencia)
        {
            tconconciliacionbancariamayor cbm = Find(ccomprobante, fcontable, particion, secuencia);
            string cbid = TconConciliacionBancariaDal.FindMayor(cbm.cconciliacionbancariamayor);
            cbid = cbid == "" ? "0" : cbid;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            string sqlUpdateEB = "update tconconciliacionbancariaeb set estadoconciliacioncdetalle = 2 where cconconciliacionbancariaextracto " +
                            " in (select cconconciliacionbancariaextracto from tconconciliacionbancaria where conciliacionbancariaid = " + cbid + ")";
                                
            contexto.Database.ExecuteSqlCommand(sqlUpdateEB);


            string sqlDeleteCB = "delete from tconconciliacionbancaria WHERE conciliacionbancariaid = " + cbid;

            contexto.Database.ExecuteSqlCommand(sqlDeleteCB);

            string sqlDeleteCBM = "delete from tconconciliacionbancariamayor WHERE ccomprobante = '" + ccomprobante + "' and fcontable = " + fcontable +
                        " and particion = " + particion + " and secuencia = " + secuencia;

            contexto.Database.ExecuteSqlCommand(sqlDeleteCBM);
        }

        /// <summary>
        /// Obtiene el mayor contable a conciliar.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static IList<Dictionary<string, object>> GetMayor(RqConsulta rqconsulta)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            //string lSQL = "SELECT ROW_NUMBER() OVER(ORDER BY tcm.monto desc, tcm.fcontable desc, tcm.ccomprobante, tcm.secuencia) cconciliacionbancariamayor, tcm.ccomprobante, tcm.fcontable, tcm.secuencia, (year(tcc.freal) * 10000) + (month(tcc.freal) * 100) + day(tcc.freal) freal, tcm.debito, tcm.monto, tcc.comentario, '2' estadoconciliacioncdetalle, tcc.numerodocumentobancario, tsocces.credencial, case when tcc.tipopersona = 'PE' then (select distinct max(tperperdet.identificacion) from tperpersonadetalle tperperdet where tperperdet.verreg = 0 and tperperdet.ccompania = tcc.ccompania and tperperdet.cpersona = tcc.cpersonarecibido) else (select distinct max(tperperdet.identificacion) from tperproveedor tperperdet where tperperdet.verreg = 0 and tperperdet.ccompania = tcc.ccompania and tperperdet.cpersona = tcc.cpersonarecibido) end identificacion, case when tcc.tipopersona = 'PE' then (select distinct max(tperperdet.nombre) from tperpersonadetalle tperperdet where tperperdet.verreg = 0 and tperperdet.ccompania = tcc.ccompania and tperperdet.cpersona = tcc.cpersonarecibido) else (select distinct max(tperperdet.nombre) from tperproveedor tperperdet where tperperdet.verreg = 0 and tperperdet.ccompania = tcc.ccompania and tperperdet.cpersona = tcc.cpersonarecibido) end nombre FROM dbo.tconcomprobantedetalle tcm inner join tconcomprobante tcc on tcc.ccomprobante = tcm.ccomprobante and tcc.fcontable = tcm.fcontable and tcc.ccompania = tcm.ccompania and tcc.particion = tcm.particion left outer join (select distinct ccompania, cpersona, credencial from tsoccesantia where verreg = 0) tsocces on tsocces.ccompania = tcm.ccompania and tcc.cpersonarecibido = tsocces.cpersona and tcc.tipopersona = 'PE' where (tcm.ccuenta = '" +
            //    rqconsulta.Mdatos["ccuenta"].ToString().Trim() + 
            //    "') AND tcc.actualizosaldo = 1 AND tcc.eliminado = 0 AND tcc.anulado = 0 AND isnull(tcm.conciliacionbancariaid,0) = 0 and tcm.ccomprobante not in (select distinct tc.ccomprobanteanulacion from tconcomprobante tc where ISNULL(tc.ccomprobanteanulacion,'') <> '') order by tcm.monto desc, tcm.fcontable desc, tcm.ccomprobante, tcm.secuencia";
            
           string lSQL = "SELECT  cd.fcontable , cd.ccomprobante  , c.numerodocumentobancario , cd.debito , cd.monto , c.comentario , cd.secuencia " +
                "FROM tconcomprobantedetalle cd INNER JOIN tconcomprobante c ON c.ccomprobante = cd.ccomprobante " +
                "WHERE cd.conciliacionbancariaid IS NULL AND cd.ccuenta = '" + rqconsulta.Mdatos["ccuenta"].ToString().Trim() + "'" +
                "AND c.cuadrado=1 AND c.actualizosaldo=1 " +
                "AND cd.ccomprobante NOT IN (select distinct c.ccomprobanteanulacion from tconcomprobante c where c.ccomprobanteanulacion IS NOT NULL) ";

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            ch.registrosporpagina = 5000;

            IList<Dictionary<string, object>> listaConciliacionMayor = ch.GetRegistrosDictionary();
            return listaConciliacionMayor;

        }

        public static DataTable GetMayor(string ccuenta, int finicio, int ffin)
        {
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@ccuenta"] = ccuenta;
            parametros["@finicio"] = finicio;
            parametros["@ffin"] = ffin;
            DataTable dt = storeprocedure.StoreProcedureDal.GetDataTable("sp_ConConciliacionMayor", parametros);
            return dt;
        }


    }

    public class tConciliacionMay : tconconciliacionbancariamayor
    {
        public string credencial;
        public string identificacion;
        public string numerodocumentobancario;
        public string nombre;
    }

}
