using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;
using modelo;
using modelo.servicios;
using modelo.helper;
using System.Data.SqlClient;
using System.Data;
using dal.inversiones.inversiones;
//using util.dto.mantenimiento;



namespace dal.inversiones.contabilizacion
{
    /// <summary>
    /// Clase que encapsula los procedimientos para contabilizar las operaciones realizadas en el módulo de inversiones.
    /// </summary>
    public class TinvContabilizacionDal
    {



        private static string UPFREAL = "update tinvcontabilizacion set freal = null where procesocdetalle = @procesocdetalle and freal between @fdesde and @fhasta ";

        /// <summary>
        /// Elimina la contabilización de una inversión.
        /// </summary>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <returns></returns>
        public static void UpdateFreal(string iprocesocdetalle, int ifdesde, int ifhasta)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                UPFREAL,
                new SqlParameter("procesocdetalle", iprocesocdetalle),
                new SqlParameter("fdesde", ifdesde),
                new SqlParameter("fhasta", ifhasta));
        }


        /// <summary>
        /// Procesa el accual diario de los intereses.
        /// </summary>
        /// <param name="cusuario">Identificador del usuario.</param>
        /// <param name="fcontable">Fecha contable.</param>
        /// <param name="ccompania">Identificador de la compañía.</param>
        /// <param name="cagencia">Identificador de la agencia.</param>
        /// <param name="csucursal">Identificador de la sucursal.</param>
        /// <param name="freal">Fecha real de proceso.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static void VariacionPrecioContabiliza(string cusuario, int cagencia, int csucursal)
        {

            string storeprocedure = "sp_InvLoteVarPrecioContabiliza";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cusuario"] = cusuario;
            parametros["@cagencia"] = cagencia;
            parametros["@csucursal"] = csucursal;
            parametros["@cmodulo"] = 12;

            dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros, 0);

            //DataTable DataTable = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros, 0);
            //IList<Dictionary<string, object>> list = DataTable.AsEnumerable().Select(dr => {
            //    var dic = new Dictionary<string, object>();
            //    dr.ItemArray.Aggregate(-1, (int i, object v) => {
            //        i += 1; dic.Add(DataTable.Columns[i].ColumnName, v);
            //        return i;
            //    });
            //    return dic;
            //}).ToList();

            //return list;
        }




        /// <summary>
        /// Procesa el accual diario de los intereses.
        /// </summary>
        /// <param name="cusuario">Identificador del usuario.</param>
        /// <param name="fcontable">Fecha contable.</param>
        /// <param name="ccompania">Identificador de la compañía.</param>
        /// <param name="cagencia">Identificador de la agencia.</param>
        /// <param name="csucursal">Identificador de la sucursal.</param>
        /// <param name="freal">Fecha real de proceso.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static void ContabilizaAccruaDiario(string cusuario, int cagencia, int csucursal, int fcontable)
        {

            string storeprocedure = "sp_InvManAccrualContabiliza";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fcontable"] = fcontable;
            parametros["@cusuario"] = cusuario;
            parametros["@cagencia"] = cagencia;
            parametros["@csucursal"] = csucursal;
            parametros["@cmodulo"] = 12;

            dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros, 0);

        }


        public static void VariacionPrecioCierre(string cusuario, int fcontable)
        {

            string storeprocedure = "sp_InvLoteVariacionPrecioCierre";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fcontable"] = fcontable;
            parametros["@cusuario"] = cusuario;

            dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros, 0);

        }


        public static void AccruaInteresDiario(string cusuario, int fcontable, int ccompania, int cagencia, int csucursal)
        {

            string storeprocedure = "sp_InvManAccrualDiario";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fcontablehastain"] = fcontable;
            parametros["@ccompania"] = ccompania;
            parametros["@cusuario"] = cusuario;

            dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros, 0);

        }

        /// <summary>
        /// Obtiene un registro de la tabla tconcomprobante, dado su identificador.
        /// </summary>
        /// <param name="ccomprobante">Identificador de la tabla tconcomprobante.</param>
        /// <returns>tconcomprobante</returns>
        public static tconcomprobante FindTConComprobante(string ccomprobante)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcomprobante obj;
            obj = contexto.tconcomprobante.Where(x => x.ccomprobante.Equals(ccomprobante)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Obtiene el identificador del proceso de la tabla tinvcontabilizacion, dado el identificador del comprobante contable.
        /// </summary>
        /// <param name="ccomprobante">Identificador del comprobante contable.</param>
        /// <returns>string</returns>
        public static string obtenerProcesoPorCcomprobante(string ccomprobante)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvcontabilizacion> obj = null;
            obj = contexto.tinvcontabilizacion.AsNoTracking().Where(x => x.ccomprobante.Equals(ccomprobante)).ToList();
            if (obj.Count == 0)
            {
                return "";
            }

            return obj[0].procesocdetalle;

        }

        /// <summary>
        /// Obtiene un registro de la tabla tinvcontabilizacion, dado su identificador.
        /// </summary>
        /// <param name="cinvcontabilizacion">Identificador de la tabla tinvcontabilizacion.</param>
        /// <returns>tinvcontabilizacion</returns>
        public static tinvcontabilizacion FindTInvContabilizacion(long cinvcontabilizacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvcontabilizacion obj;
            obj = contexto.tinvcontabilizacion.Where(x => x.cinvcontabilizacion.Equals(cinvcontabilizacion)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Obtiene una lista de registros de la tabla tinvcontabilizacion.
        /// </summary>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <param name="orderby">Secuencia del orden el en cual se desean obtener los registros.</param>
        /// <param name="iprocesocdetalle">Identificador del proceso.</param>
        /// <param name="istrCondicionAdicional">Cadena que contiene filtros opcionale para la búsqueda.</param>
        /// <param name="icinvtablaamortizacion">Identificador opcional de la tabla de amortización.</param>
        /// <param name="icinversionrentavariable">Identificador opcional de la tabla de renta variable.</param>
        /// <param name="iblnExcluirContabilizados">Bandera para incluir o excluir los registros ya contabilizados.</param>
        /// <param name="icinversionhisultimo">Identificador opcional del históride de inversiones.</param>
        /// <param name="icinvventaaccion">Identificador opcional de la tabla de venta de acciones.</param>
        /// <param name="icinvprecancelacion">Identificador opcional de la tabla de precancelaciónes de inversiones.</param>
        /// <returns>List<tContabilizacion></returns>
        public static List<tContabilizacion> GetContabilizacion(
            long icinversion = 0,
            string orderby = "catdetrub.clegal",
            string iprocesocdetalle = "",
            string istrCondicionAdicional = "",
            long icinvtablaamortizacion = 0,
            long icinversionrentavariable = 0,
            bool iblnExcluirContabilizados = false,
            long? icinversionhisultimo = null,
            long? icinvventaaccion = null,
            long icinvprecancelacion = 0,
            int imora = 0
            )
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();

            string lprocesocdetalle = iprocesocdetalle == "" ? "" : " and tinvcon.procesocdetalle = '" + iprocesocdetalle + "'";

            string lSQL;

            string lstrFormAdicional = "";

            if (istrCondicionAdicional == "")
            {

                string lWhere = "";

                if (icinvtablaamortizacion > 0)
                {
                    lWhere = " and tinvcon.cinvtablaamortizacion = " + icinvtablaamortizacion + " and isnull(tinvcon.mora,0) = " + imora.ToString().Trim();
                }
                else if (icinversionrentavariable > 0)
                {
                    lWhere = " and tinvcon.cinversionrentavariable = " + icinversionrentavariable;
                }
                else if (icinversionhisultimo != null && icinversionhisultimo != 0)
                {
                    if (icinversionhisultimo > 0) lWhere = " and tinvcon.cinversionhis = " + icinversionhisultimo;
                }
                else if (icinvventaaccion != null && icinvventaaccion != 0)
                {
                    if (icinvventaaccion > 0) lWhere = " and tinvcon.cinvventaaccion= " + icinvventaaccion;
                }
                else if (icinvprecancelacion > 0)
                {
                    lWhere = " and tinvcon.cinvprecancelacion = " + icinvprecancelacion;
                }


                if (iblnExcluirContabilizados)
                {
                    lstrFormAdicional = " left outer join tconcomprobante tconcom on tconcom.ccomprobante = tinvcon.ccomprobante ";
                    lWhere = " AND (tconcom.ccomprobante IS NULL OR tconcom.anulado = 1 OR tconcom.eliminado = 1) ";
                }

                lSQL = "SELECT tconcat.nombre ncuenta,catdetrub.nombre rubro,tinvcon.cinvcontabilizacion,tinvcon.cinversion,  tinvcon.cinvventaaccion, tinvcon.cinvprecancelacion, tinvcon.cinvtablaamortizacion,tinvcon.cinversionrentavariable,tinvcon.procesoccatalogo,tinvcon.procesocdetalle,tinvcon.rubroccatalogo,tinvcon.rubrocdetalle,tinvcon.ccomprobante,tinvcon.fcontable,tinvcon.particion,tinvcon.secuencia,tinvcon.ccompania,tinvcon.valor,case when isnull(tinvcon.debito ,0) = 1 then tinvcon.valor else 0 end valordebe, case when isnull(tinvcon.debito ,0) = 0 then tinvcon.valor else 0 end valorhaber,tinvcon.ccuenta,tinvcon.debito,tinvcon.fingreso,tinvcon.cusuarioing,tinvcon.fmodificacion,tinvcon.cusuariomod FROM tinvcontabilizacion tinvcon " +
                    lstrFormAdicional +
                    "left outer join tgencatalogodetalle catdetrub on catdetrub.ccatalogo = tinvcon.rubroccatalogo and catdetrub.cdetalle = tinvcon.rubrocdetalle left outer join tconcatalogo tconcat on tconcat.ccuenta = tinvcon.ccuenta where tinvcon.cinversion = " +
                    icinversion.ToString() +
                    lprocesocdetalle +
                    istrCondicionAdicional +
                    lWhere +
                    " order by " +
                    orderby;
            }
            else
            {
                lstrFormAdicional = " left outer join tconcomprobante tconcom on tconcom.ccomprobante = tinvcon.ccomprobante ";

                lSQL = "SELECT max(tinvcon.cpartidaingreso) cpartidaingreso, tinvcon.cinvventaaccion, tinvcon.cinvprecancelacion, tinvcon.cinvtablaamortizacion,tinvcon.cinversionrentavariable,tinvcon.ccomprobante,tinvcon.fcontable,tinvcon.particion,tinvcon.secuencia,tinvcon.ccompania,sum(case when isnull(tinvcon.debito, 0) = 1 then tinvcon.valor else 0 end) valordebe,sum(case when isnull(tinvcon.debito, 0) = 0 then tinvcon.valor else 0 end) valorhaber,tinvcon.ccuenta,tinvcon.debito FROM tinvcontabilizacion tinvcon left outer join tconcomprobante tconcom on tconcom.ccomprobante = tinvcon.ccomprobante left outer join tgencatalogodetalle catdetrub on catdetrub.ccatalogo = tinvcon.rubroccatalogo and catdetrub.cdetalle = tinvcon.rubrocdetalle left outer join tconcatalogo tconcat on tconcat.ccuenta = tinvcon.ccuenta where tinvcon.cinversion = " +
                    icinversion.ToString() +
                    lprocesocdetalle +
                    istrCondicionAdicional +
                    " group by tinvcon.cinvventaaccion, tinvcon.cinvprecancelacion, tinvcon.cinvtablaamortizacion,tinvcon.cinversionrentavariable,tinvcon.ccomprobante,tinvcon.fcontable,tinvcon.particion,tinvcon.secuencia,tinvcon.ccompania,tinvcon.debito,tinvcon.ccuenta order by tinvcon.ccuenta,tinvcon.debito";

            }

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> ListaContabiliza = null;

            try
            {
                ListaContabiliza = ch.GetRegistroDictionary();
            }
            catch
            {
                return null;
            }

            if (ListaContabiliza.Count > 0)
            {

                List<tContabilizacion> tTablaContabillizaClone = new List<tContabilizacion>();

                foreach (var p in ListaContabiliza)
                {

                    long? lcinversion = null;
                    int? lprocesoccatalogo = null;
                    int? lrubroccatalogo = null;
                    decimal? lvalor = null;

                    string lcpartidaingreso = null;

                    try
                    {
                        if (p.ContainsKey("cpartidaingreso"))
                        {

                            lcpartidaingreso = (string)p["cpartidaingreso"];
                        }
                    }
                    catch
                    { }


                    if (istrCondicionAdicional == "")
                    {

                        if (p["cinversion"] != null) lcinversion = long.Parse(p["cinversion"].ToString());

                        if (p["procesoccatalogo"] != null) lprocesoccatalogo = int.Parse(p["procesoccatalogo"].ToString());

                        if (p["rubroccatalogo"] != null) lrubroccatalogo = int.Parse(p["rubroccatalogo"].ToString());

                        if (p["valor"] != null)
                        {
                            lvalor = decimal.Parse(p["valor"].ToString());
                        }

                    }

                    long? lcinvventaaccion = null;
                    if (p["cinvventaaccion"] != null) lcinvventaaccion = int.Parse(p["cinvventaaccion"].ToString());

                    long? lcinvtablaamortizacion = null;
                    if (p["cinvtablaamortizacion"] != null) lcinvtablaamortizacion = int.Parse(p["cinvtablaamortizacion"].ToString());

                    long? lcinvprecancelacion = null;
                    if (p["cinvprecancelacion"] != null) lcinvprecancelacion = int.Parse(p["cinvprecancelacion"].ToString());


                    long? lcinversionrentavariable = null;
                    if (p["cinversionrentavariable"] != null) lcinversionrentavariable = int.Parse(p["cinversionrentavariable"].ToString());

                    int? lfcontable = null;
                    if (p["fcontable"] != null) lfcontable = int.Parse(p["fcontable"].ToString());

                    int? lparticion = null;
                    if (p["particion"] != null) lparticion = int.Parse(p["particion"].ToString());

                    int? lsecuencia = null;
                    if (p["secuencia"] != null) lsecuencia = int.Parse(p["secuencia"].ToString());

                    int? lccompania = null;
                    if (p["ccompania"] != null) lccompania = int.Parse(p["ccompania"].ToString());

                    bool? ldebito = null;
                    if (p["debito"] != null) ldebito = bool.Parse(p["debito"].ToString());

                    decimal lvalordebe = 0;
                    if (p["valordebe"] != null) lvalordebe = decimal.Parse(p["valordebe"].ToString());

                    decimal lvalorhaber = 0;
                    if (p["valorhaber"] != null) lvalorhaber = decimal.Parse(p["valorhaber"].ToString());

                    if (istrCondicionAdicional == "")
                    {

                        tTablaContabillizaClone.Add(
                        new tContabilizacion()
                        {
                            rubro = (string)p["rubro"]
                            ,
                            cinvcontabilizacion = (long)p["cinvcontabilizacion"]
                            ,
                            cinversion = lcinversion
                            ,
                            cinvtablaamortizacion = lcinvtablaamortizacion
                            ,
                            cinvprecancelacion = lcinvprecancelacion
                            ,
                            cinversionrentavariable = lcinversionrentavariable
                            ,
                            procesoccatalogo = lprocesoccatalogo
                            ,
                            procesocdetalle = (string)p["procesocdetalle"]
                            ,
                            rubroccatalogo = lrubroccatalogo
                            ,
                            rubrocdetalle = (string)p["rubrocdetalle"]
                            ,
                            ccomprobante = (string)p["ccomprobante"]
                            ,
                            fcontable = lfcontable
                            ,
                            particion = lparticion
                            ,
                            secuencia = lsecuencia
                            ,
                            ccompania = lccompania
                            ,
                            valor = lvalor
                            ,
                            ccuenta = (string)p["ccuenta"]
                            ,
                            debito = ldebito
                            ,
                            valordebe = lvalordebe
                            ,
                            valorhaber = lvalorhaber
                            ,
                            ncuenta = (string)p["ncuenta"]
                            ,
                            cpartidaingreso = lcpartidaingreso
                            ,
                            cinvventaaccion = lcinvventaaccion


                        });

                    }
                    else
                    {
                        tTablaContabillizaClone.Add(
                        new tContabilizacion()
                        {
                            cinvtablaamortizacion = lcinvtablaamortizacion
                            ,
                            cinvprecancelacion = lcinvprecancelacion
                            ,
                            cinversionrentavariable = lcinversionrentavariable
                            ,
                            ccomprobante = (string)p["ccomprobante"]
                            ,
                            fcontable = lfcontable
                            ,
                            particion = lparticion
                            ,
                            secuencia = lsecuencia
                            ,
                            ccompania = lccompania
                            ,
                            ccuenta = (string)p["ccuenta"]
                            ,
                            debito = ldebito
                            ,
                            valordebe = lvalordebe
                            ,
                            valorhaber = lvalorhaber
                            ,
                            cpartidaingreso = lcpartidaingreso
                            ,
                            cinvventaaccion = lcinvventaaccion


                        });


                    }


                }

                return tTablaContabillizaClone;
            }
            else
            {
                return null;
            }


        }


        private static string SqlMaxPkMasUnoTabAmo = "select ISNULL(max(cinvcontabilizacion),0) + 1 cinvcontabilizacion from tinvcontabilizacion";

        /// <summary>
        /// Obtiene el máximo identificador de la tabla tinvcontabilizacion, más uno.
        /// </summary>
        /// <returns></returns>
        public static long GetcInvContabilizacion()
        {

            tinvcontabilizacion fc = new tinvcontabilizacion();

            // parametros de consulta del saldo de aportes.
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            // campos adiciones para la consulta.
            List<string> lcampos = new List<string>();
            lcampos.Add("cinvcontabilizacion");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlMaxPkMasUnoTabAmo);
                fc = (tinvcontabilizacion)ch.GetRegistro("tinvcontabilizacion", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0014", "ERROR AL GENERAR CINVCONTABILIZACION");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }


        /// <summary>
        /// Obtiene un registro de la tabla tinvcontabilizacion.
        /// </summary>
        /// <param name="cinvcontabilizacion">Identificador de la tabla tinvcontabilizacion.</param>
        /// <returns>tinvcontabilizacion</returns>
        public static tinvcontabilizacion FindContabilizacion(long cinvcontabilizacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvcontabilizacion obj;
            obj = contexto.tinvcontabilizacion.Where(x => x.cinvcontabilizacion.Equals(cinvcontabilizacion)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Actualiza la tabla tinvcontabilizacion.
        /// </summary>
        /// <param name="icinvcontabilizacion">Identificador de la tabla tinvcontabilizacion.</param>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <param name="icinvtablaamortizacion">Identificador de la tabla de amortización.</param>
        /// <param name="icinversionrentavariable">Identificador de inversión de renta variable.</param>
        /// <param name="iprocesoccatalogo">Identificador del catálogo proceso.</param>
        /// <param name="iprocesocdetalle">Identificador de proceso.</param>
        /// <param name="irubroccatalogo">Identificador de catálogo del rubro.</param>
        /// <param name="irubrocdetalle">Identificador de rubro.</param>
        /// <param name="iccomprobante">Identificador de comprobante contable.</param>
        /// <param name="ifcontable">Fecha contable.</param>
        /// <param name="iparticion">Partición contable.</param>
        /// <param name="isecuencia">Secuencia en el detalle del comprobante contable.</param>
        /// <param name="iccompania">Identificador de Compañía.</param>
        /// <param name="ivalor">Monto de la transacción.</param>
        /// <param name="iccuenta">Identificador de la cuenta contable.</param>
        /// <param name="idebito">Bandera para determinar si es débito o crédito.</param>
        /// <param name="icusuariomod">Identificador de usuario que realiza la actualización.</param>
        /// <returns></returns>
        public static void Actualizar(long icinvcontabilizacion,
            long? icinversion,
            long? icinvtablaamortizacion,
            long? icinversionrentavariable,
            int? iprocesoccatalogo,
            string iprocesocdetalle,
            int? irubroccatalogo,
            string irubrocdetalle,
            string iccomprobante,
            int? ifcontable,
            int? iparticion,
            int? isecuencia,
            int? iccompania,
            decimal? ivalor,
            string iccuenta,
            bool? idebito,
            string icusuariomod)

        {

            string SQL_INSERT = "UPDATE tinvcontabilizacion SET cinvcontabilizacion=" +
                icinvcontabilizacion.ToString() +
                ",cinversion=" +
                strLong(icinversion) +
                ",cinvtablaamortizacion=" +
                strLong(icinvtablaamortizacion) +
                ",cinversionrentavariable=" +
                strLong(icinversionrentavariable) +
                ",procesoccatalogo=" +
                strInt(iprocesoccatalogo) +
                ",procesocdetalle=" +
                strStr(iprocesocdetalle) +
                ",rubroccatalogo=" +
                strInt(irubroccatalogo) +
                ",rubrocdetalle=" +
                strStr(irubrocdetalle) +
                ",ccomprobante=" +
                strStr(iccomprobante) +
                ",fcontable=" +
                strInt(ifcontable) +
                ",particion=" +
                strInt(iparticion) +
                ",secuencia=" +
                strInt(isecuencia) +
                ",ccompania=" +
                strInt(iccompania) +
                ",valor=" +
                strDecimal(ivalor) +
                ",ccuenta=" +
                strStr(iccuenta) +
                ",debito=" +
                strBool(idebito) +
                ",fmodificacion=getdate(),cusuariomod=" +
                ", '" + icusuariomod.Trim() + "') ";

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {

                contexto.Database.ExecuteSqlCommand(SQL_INSERT);

            }
            catch (System.InvalidOperationException)
            {
                return;
            }

        }


        /// <summary>
        /// Inserta un registro en la tabla tinvcontabilizacion.
        /// </summary>
        /// <param name="icinvcontabilizacion">Identificador de la tabla tinvcontabilizacion.</param>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <param name="icinvtablaamortizacion">Identificador de la tabla de amortización.</param>
        /// <param name="icinversionrentavariable">Identificador de inversión de renta variable.</param>
        /// <param name="iprocesoccatalogo">Identificador del catálogo proceso.</param>
        /// <param name="iprocesocdetalle">Identificador de proceso.</param>
        /// <param name="irubroccatalogo">Identificador de catálogo del rubro.</param>
        /// <param name="irubrocdetalle">Identificador de rubro.</param>
        /// <param name="iccomprobante">Identificador de comprobante contable.</param>
        /// <param name="ifcontable">Fecha contable.</param>
        /// <param name="iparticion">Partición contable.</param>
        /// <param name="isecuencia">Secuencia en el detalle del comprobante contable.</param>
        /// <param name="iccompania">Identificador de Compañía.</param>
        /// <param name="ivalor">Monto de la transacción.</param>
        /// <param name="iccuenta">Identificador de la cuenta contable.</param>
        /// <param name="idebito">Bandera para determinar si es débito o crédito.</param>
        /// <param name="icusuarioing">Identificador de usuario que realiza la inserción.</param>
        /// <param name="icpartidaIngreso">Identificador de la partida presupuestaria de ingresos.</param>
        /// <param name="cinversionhis">Identificador del histórico de inversiones.</param>
        /// <param name="icinvventaaccion">Identificador de la venta de acciones.</param>
        /// <param name="icinvprecancelacion">Identificador de la precancelación de inversiones.</param>
        /// <returns></returns>
        public static void Insertar(long icinvcontabilizacion,
            long? icinversion,
            long? icinvtablaamortizacion,
            long? icinversionrentavariable,
            int? iprocesoccatalogo,
            string iprocesocdetalle,
            int? irubroccatalogo,
            string irubrocdetalle,
            string iccomprobante,
            int? ifcontable,
            int? iparticion,
            int? isecuencia,
            int? iccompania,
            decimal? ivalor,
            string iccuenta,
            bool? idebito,
            string icusuarioing,
            string icpartidaIngreso = null,
            long? cinversionhis = null,
            long? icinvventaaccion = null,
            long? icinvprecancelacion = null,
            int iMora = 0)

        {


            string SQL_INSERT = "INSERT INTO tinvcontabilizacion (cinvcontabilizacion,cinversion,cinvtablaamortizacion,cinversionrentavariable,procesoccatalogo,procesocdetalle,rubroccatalogo,rubrocdetalle,ccomprobante,fcontable,particion,secuencia,ccompania,valor,ccuenta,debito,fingreso,cusuarioing, cpartidaingreso, cinversionhis, cinvventaaccion, cinvprecancelacion, mora) VALUES (" +
                icinvcontabilizacion.ToString() +
                "," + strLong(icinversion) +
                "," + strLong(icinvtablaamortizacion) +
                "," + strLong(icinversionrentavariable) +
                "," + strInt(iprocesoccatalogo) +
                "," + strStr(iprocesocdetalle) +
                "," + strInt(irubroccatalogo) +
                "," + strStr(irubrocdetalle) +
                "," + strStr(iccomprobante) +
                "," + strInt(ifcontable) +
                "," + strInt(iparticion) +
                "," + strInt(isecuencia) +
                "," + strInt(iccompania) +
                "," + strDecimal(ivalor) +
                "," + strStr(iccuenta) +
                "," + strBool(idebito) +
                ",getdate()" +
                ", '" + icusuarioing.Trim() + "', " +
                strStr(icpartidaIngreso) + ", " +
                strLong(cinversionhis) + ", " +
                strLong(icinvventaaccion) + ", " +
                strLong(icinvprecancelacion) + "," +
                iMora.ToString().Trim() + ") ";

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {

                contexto.Database.ExecuteSqlCommand(SQL_INSERT);

            }
            catch (System.InvalidOperationException)
            {
                return;
            }

        }

        /// <summary>
        /// Convierte una variable boolean a string.
        /// </summary>
        /// <param name="ibool">variable boolean.</param>
        /// <returns>string</returns>
        private static string strBool(bool? ibool)
        {
            if (ibool == null)
            {
                return "0";
            }
            else
            {
                return ibool == true ? "1" : "0";
            }

        }

        /// <summary>
        /// Convierte una variable decimal a string.
        /// </summary>
        /// <param name="iDecimal">variable decimal.</param>
        /// <returns>string</returns>
        private static string strDecimal(decimal? iDecimal)
        {
            if (iDecimal == null || iDecimal == 0)
            {
                return "NULL";
            }
            else
            {

                return iDecimal.ToString().Replace(",", ".");
            }

        }

        /// <summary>
        /// Obtiene el formato para guardar una variable string.
        /// </summary>
        /// <param name="iStr">variable string.</param>
        /// <returns>string</returns>
        public static string strStr(string iStr)
        {
            if (iStr == null || iStr.Trim().Length == 0)
            {
                return "NULL";
            }
            else
            {
                return "'" + iStr.Trim() + "'";
            }

        }

        /// <summary>
        /// Convierte una variable long a string.
        /// </summary>
        /// <param name="iLong">variable long.</param>
        /// <returns>string</returns>
        private static string strLong(long? iLong)
        {
            if (iLong == null || iLong == 0)
            {
                return "NULL";
            }
            else
            {
                return iLong.ToString().Trim();
            }
        }

        /// <summary>
        /// Convierte una variable int a string.
        /// </summary>
        /// <param name="iInt">variable entera.</param>
        /// <returns>string</returns>
        private static string strInt(int? iInt)
        {
            if (iInt == null || iInt == 0)
            {
                return "NULL";
            }
            else
            {
                return iInt.ToString().Trim();
            }
        }

        private static string DEL = "delete from tinvcontabilizacion "
            + " where ccomprobante = @ccomprobante "
            + " and ccompania = @ccompania "
            + " and fcontable = @fcontable and cinvtablaamortizacion IS NOT NULL";

        /// <summary>
        /// Elimina la tabla tinvcontabilizacion, dados la compañía, el comprobante y la fecha contable.
        /// </summary>
        /// <param name="iccomprobante">Identificador del comprobante contable.</param>
        /// <param name="ifcontable">Fecha el comrobante contable.</param>
        /// <param name="iccompania">Identificador de la compañía.</param>
        /// <returns></returns>
        public void Delete(string iccomprobante, int ifcontable, int iccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DEL,
                new SqlParameter("ccomprobante", iccomprobante),
                new SqlParameter("ccompania", iccompania),
                new SqlParameter("fcontable", ifcontable));
        }


        private static string DELXCOMP = "delete from tinvcontabilizacion "
            + " where ccomprobante = @ccomprobante ";

        /// <summary>
        /// Elimina la tabla tinvcontabilizacion, dado el comprobante contable.
        /// </summary>
        /// <param name="iccomprobante">Identificador del comprobante contable.</param>
        /// <returns></returns>
        public void DeleteXComprobante(string iccomprobante)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELXCOMP,
                new SqlParameter("ccomprobante", iccomprobante));
        }

        private static string UPD = "update tinvcontabilizacion set ccomprobante = null, ccompania = null, fcontable = null, secuencia = null, particion = null"
            + " where ccomprobante = @ccomprobante "
            + " and ccompania = @ccompania "
            + " and fcontable = @fcontable and procesocdetalle = 'COMPRA'";

        /// <summary>
        /// Actualizar la tabla tinvcontabilizacion, dados la compañía, el comprobante y la fecha contable.
        /// </summary>
        /// <param name="iccomprobante">Identificador del comprobante contable.</param>
        /// <param name="ifcontable">Fecha el comrobante contable.</param>
        /// <param name="iccompania">Identificador de la compañía.</param>
        /// <returns></returns>
        public void Update(string iccomprobante, int ifcontable, int iccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                UPD,
                new SqlParameter("ccomprobante", iccomprobante),
                new SqlParameter("ccompania", iccompania),
                new SqlParameter("fcontable", ifcontable));
        }

        /// <summary>
        /// Obtener la plantilla contable.
        /// </summary>
        /// <param name="iprocesocdetalle">Identificador del proceso.</param>
        /// <param name="irubrocdetalle">Identificador del rubro.</param>
        /// <param name="ientidadccatalogo">Identificador del catálogo de la entidad.</param>
        /// <param name="ientidadcdetalle">Identificador de la entidad.</param>
        /// <param name="iinstrumentocdetalle">Identificador del instrumento financiero.</param>
        /// <param name="icentrocostocdetalle">Identificador del centro de costo.</param>
        /// <returns>List<tinvplantillacontable></returns>
        public static List<tinvplantillacontable> obtenerContabilizacion(
            string iprocesocdetalle,
            string irubrocdetalle,
            int ientidadccatalogo = 0,
            string ientidadcdetalle = "",
            string iinstrumentocdetalle = "",
            string icentrocostocdetalle = "",
            long icinversion = 0)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvplantillacontable> lista = new List<tinvplantillacontable>();

            // -- 		irubrocdetalle	"IMPUES"	string


            //CCA 20230201
            tinvinversion inversion = TinvInversionDal.Find(icinversion);
            if (irubrocdetalle == "COMISI" || irubrocdetalle == "IMPUES")
            {
                lista = contexto.tinvplantillacontable.AsNoTracking().Where(x =>
                    x.rubrocdetalle.Equals(irubrocdetalle) &&
                    x.entidadccatalogo == ientidadccatalogo &&
                    x.entidadcdetalle.Equals(ientidadcdetalle)).ToList();

            }
            else if (irubrocdetalle == "COMBDE")
            {
                lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.rubrocdetalle.Equals(irubrocdetalle)).ToList();
            }
            else if (irubrocdetalle == "CTORDE" || irubrocdetalle == "CTORAC")
            {
                lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.rubrocdetalle.Equals(irubrocdetalle) &&
                    x.instrumentocdetalle.Equals(iinstrumentocdetalle)).ToList();
            }
            else if (irubrocdetalle != "CAP" && irubrocdetalle != "INT" && irubrocdetalle != "ING" && irubrocdetalle != "BANCOS" && irubrocdetalle != "COMBOL" && irubrocdetalle != "PERDID")
            {
                lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.procesocdetalle.Equals(iprocesocdetalle) &&
                    x.rubrocdetalle.Equals(irubrocdetalle) && x.centrocostocdetalle.Equals(icentrocostocdetalle)).ToList();
            }
            else if (irubrocdetalle == "BANCOS")
            {
                //CCA 20230421
                if (inversion.plazo >= 7 && inversion.plazo <= 90 && (iinstrumentocdetalle == "CDP" || iinstrumentocdetalle == "PA"))
                {
                    lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.procesocdetalle.Equals(iprocesocdetalle) &&
                    x.rubrocdetalle.Equals(irubrocdetalle) &&
                    x.entidadccatalogo == ientidadccatalogo &&
                    x.entidadcdetalle.Equals(ientidadcdetalle) && x.centrocostocdetalle.Equals(icentrocostocdetalle) &&
                    x.instrumentocdetalle.Equals(iinstrumentocdetalle) && x.ccuenta.Equals("711020102")).ToList();
                }
                else
                {
                    lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.procesocdetalle.Equals(iprocesocdetalle) &&
                    x.rubrocdetalle.Equals(irubrocdetalle) &&
                    x.entidadccatalogo == ientidadccatalogo &&
                    x.entidadcdetalle.Equals(ientidadcdetalle) && x.centrocostocdetalle.Equals(icentrocostocdetalle) &&
                    x.instrumentocdetalle.Equals(iinstrumentocdetalle)).ToList();
                }


                if (lista == null || lista.Count == 0)
                {
                    lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.procesocdetalle.Equals(iprocesocdetalle) &&
                        x.rubrocdetalle.Equals(irubrocdetalle) &&
                        x.entidadccatalogo == ientidadccatalogo &&
                        x.entidadcdetalle.Equals(ientidadcdetalle) && x.centrocostocdetalle.Equals(icentrocostocdetalle)).ToList();
                }


            }
            else if (irubrocdetalle == "COMBOL")
            {
                lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.procesocdetalle.Equals(iprocesocdetalle) &&
                    x.rubrocdetalle.Equals(irubrocdetalle) &&
                    x.entidadccatalogo == ientidadccatalogo &&
                    x.entidadcdetalle.Equals(ientidadcdetalle) && x.centrocostocdetalle.Equals(icentrocostocdetalle)).ToList();
            }
            else if (irubrocdetalle == "PERDID")
            {
                lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.rubrocdetalle.Equals(irubrocdetalle) && x.entidadcdetalle.Equals(ientidadcdetalle) && x.procesocdetalle.Equals(iprocesocdetalle)).ToList();
            }
            else if (ientidadcdetalle == null || ientidadcdetalle.Trim().Length == 0)
            {
                lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.procesocdetalle.Equals(iprocesocdetalle) &&
                    x.rubrocdetalle.Equals(irubrocdetalle) && x.centrocostocdetalle.Equals(icentrocostocdetalle)).ToList();
            }
            else
            {

                if (irubrocdetalle == "INT" || irubrocdetalle == "CAP" || irubrocdetalle == "ING")
                {

                    lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.procesocdetalle.Equals(iprocesocdetalle) &&
                        x.rubrocdetalle.Equals(irubrocdetalle) &&
                        x.entidadccatalogo == ientidadccatalogo &&
                        x.entidadcdetalle.Equals(ientidadcdetalle) &&
                        x.instrumentocdetalle.Equals(iinstrumentocdetalle) &&
                        x.cpartidaingreso != null && x.centrocostocdetalle.Equals(icentrocostocdetalle)).ToList();
                }

                if (lista == null || lista.Count == 0)
                {
                    lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.procesocdetalle.Equals(iprocesocdetalle) &&
                        x.rubrocdetalle.Equals(irubrocdetalle) &&
                        x.entidadccatalogo == ientidadccatalogo &&
                        x.entidadcdetalle.Equals(ientidadcdetalle) &&
                        x.instrumentocdetalle.Equals(iinstrumentocdetalle) && x.centrocostocdetalle.Equals(icentrocostocdetalle)).ToList();


                    if (icinversion == -1 && lista == null || lista.Count == 0)
                    {
                        lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.procesocdetalle.Equals(iprocesocdetalle) &&
                            x.rubrocdetalle.Equals(irubrocdetalle) &&
                            x.entidadccatalogo == ientidadccatalogo &&
                            x.entidadcdetalle.Equals(ientidadcdetalle)).ToList();

                        if (lista == null || lista.Count == 0)
                        {
                            lista = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.rubrocdetalle.Equals(irubrocdetalle) &&
                                x.entidadccatalogo == ientidadccatalogo &&
                                x.entidadcdetalle.Equals(ientidadcdetalle)).ToList();

                        }



                    }



                }


            }


            return lista;

        }


        private static string DELE = "delete from tinvcontabilizacion where cinversion = @cinversion ";

        /// <summary>
        /// Elimina la contabilización de una inversión.
        /// </summary>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <returns></returns>
        public static void Delete(long icinversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE,
                new SqlParameter("cinversion", icinversion));
        }


        private static string DELET = "delete tinvcontabilizacion WHERE cinversion in (SELECT cinversion FROM tinvinversion WHERE tasaclasificacioncdetalle = @tasaclasificacioncdetalle ) ";

        /// <summary>
        /// Elimina la contabilización por el tipo de tasa de la inversión.
        /// </summary>
        /// <param name="itasaclasificacioncdetalle">Identificador de la tasa de la inversión.</param>
        /// <returns></returns>
        public static void DeletePorTipoInversion(string itasaclasificacioncdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELET,
                new SqlParameter("tasaclasificacioncdetalle", itasaclasificacioncdetalle));
        }


        public static List<tinvcontabilizacion> Find(long icinvtablaamortizacion, byte imora)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tinvcontabilizacion.AsNoTracking().Where(x => x.cinvtablaamortizacion == icinvtablaamortizacion && x.mora == imora).ToList();
        }

        /// <summary>
        /// Obtiene una definición de la contabilización de la inversión, dado su identificador.
        /// </summary>
        /// <param name="icinvcontabilizacion">Identificador de la contabilización de la inversión.</param>
        /// <returns>tinvcontabilizacion</returns>
        public static tinvcontabilizacion FindPorId(long icinvcontabilizacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvcontabilizacion obj;
            obj = contexto.tinvcontabilizacion.Where(x => x.cinvcontabilizacion.Equals(icinvcontabilizacion)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }


        // INI

        //private void contabilizar(RqMantenimiento rqmantenimiento, tinvinversion inversion, string itipodocumentocdetalle)
        //{
        //    tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, inversion, itipodocumentocdetalle); // lblnCompra, lblnReajuste);

        //    decimal montoComprobante = 0;

        //    List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, inversion, comprobante, ref montoComprobante);

        //    comprobante.montocomprobante = montoComprobante;

        //    rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
        //    rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
        //    rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
        //    rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
        //    rqmantenimiento.AdicionarTabla("tinviversion", inversion, false);

        //    rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
        //    SaldoEnLinea lSaldoLinea = new SaldoEnLinea();
        //    lSaldoLinea.Ejecutar(rqmantenimiento);


        //}

        // FIN



    }

    public class tContabilizacion : tinvcontabilizacion
    {

        public string rubro;
        public decimal valordebe;
        public decimal valorhaber;
        public string ncuenta;

    }

    public class tinvContabilidadPlantilla : tinvplantillacontable
    {

        public string nombrecuenta;
        public string nombrerubro;

    }

    public class tinvContabilidadPlantillaAgente : tinvplantillacontableagente
    {
        public string nombrecuenta;
        public string nombrerubro;

    }


}
