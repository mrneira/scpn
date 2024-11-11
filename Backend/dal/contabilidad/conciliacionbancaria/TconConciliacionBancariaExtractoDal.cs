using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using modelo;
using modelo.servicios;
using util;
using util.servicios.ef;
using modelo.helper;
using modelo.interfaces;

namespace dal.contabilidad.conciliacionbancaria
{
    /// <summary>
    /// Clase que encapsula los procedimientos para ejecutar las operaciones del extracto bancario.
    /// </summary>
    public class tconconciliacionbancariaextDal
    {

        private static string SqlMaxPkMasUno = "select ISNULL(max(cconconciliacionbancariaextracto),0) + 1 cConconciliacionBancariaExtracto from tconconciliacionbancariaeb where @Uno = 1";

        /// <summary>
        /// Obtiene al extracto bancario.
        /// </summary>
        /// <returns>long</returns>
        public static long GetcConconciliacionBancariaExtracto()
        {


            tconconciliacionbancariaeb fc = new tconconciliacionbancariaeb();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@Uno"] = 1;
            List<string> lcampos = new List<string>();
            lcampos.Add("cConconciliacionBancariaExtracto");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlMaxPkMasUno);
                fc = (tconconciliacionbancariaeb)ch.GetRegistro("tconconciliacionbancariaeb", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("CONBAN-002", "ERROR EN OBTENCIÓN DEL ID. PARA tconconciliacionbancariaeb");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }

        private static string SqlSelectCuentaFecha = "SELECT ISNULL(MAX(cusuariocreacion),'') MaxCusuarioCreacion FROM dbo.tconconciliacionbancariaeb WHERE (fecha = @fecha ) AND(ccuenta = @ccuenta )";

        /// <summary>
        /// Determina si existe el extacto, dadas la cuenta y la fecha del documento bancario.
        /// </summary>
        /// <param name="ccuenta">Cuenta contable.</param>
        /// <param name="fecha">Fecha del documento bancario.</param>
        /// <returns>string<tConciliacion></returns>
        public static string GetcExisteCuentaFecha(string ccuenta, int fecha)
        {

            tconconciliacionbancariaeb fc = new tconconciliacionbancariaeb();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fecha"] = fecha;
            parametros["@ccuenta"] = ccuenta;
            List<string> lcampos = new List<string>();
            lcampos.Add("MaxCusuarioCreacion");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlSelectCuentaFecha);
                fc = (tconconciliacionbancariaeb)ch.GetRegistro("tconconciliacionbancariaeb", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("CONBAN-001", "ERROR EN CÁLCULO DEL ID. PARA tconconciliacionbancariaeb");
            }

            return fc.Mdatos.Values.ElementAt(0).ToString();

        }

        /// <summary>
        /// Determina si existe el extacto bancario, dados la cuenta, fecha, número del documento bancario, valor del crédito y valor del débito.
        /// </summary>
        /// <param name="ccuenta">Cuenta contable.</param>
        /// <param name="fecha">Fecha del documento bancario.</param>
        /// <param name="numerodocumentobancario">Número del documento bancario.</param>
        /// <param name="valorcredito">Valor del crédito.</param>
        /// <param name="valordebito">Valor del débito.</param>
        /// <returns>string<tConciliacion></returns>
        public static tconconciliacionbancariaeb GetExisteFechaNumeroDocumento(string ccuenta, int fecha, string numerodocumentobancario, decimal valorcredito, decimal valordebito, string numeroComprobante)
        {
            tconconciliacionbancariaeb obj = new tconconciliacionbancariaeb();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconconciliacionbancariaeb.Where(x => x.ccuenta == ccuenta 
                                                            && x.fecha == fecha 
                                                            && x.numerodocumentobancario == numerodocumentobancario
                                                            && x.numerocomprobante == numeroComprobante
                                                            && x.valorcredito == valorcredito
                                                            && x.valordebito == valordebito).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Obtiene el extracto bancario dado su identificador.
        /// </summary>
        /// <param name="cConconciliacionbancariaextracto">Identificador del extracto bancario.</param>
        /// <returns>tconconciliacionbancariaeb<tConciliacion></returns>
        public static tconconciliacionbancariaeb Find(long cConconciliacionbancariaextracto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconconciliacionbancariaeb control = null;

            control = contexto.tconconciliacionbancariaeb.AsNoTracking().Where(x => x.cconconciliacionbancariaextracto == cConconciliacionbancariaextracto).SingleOrDefault();
            if (control == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(control);
            return control;
        }

        /// <summary>
        /// Actualiza el estado del extracto bancario, dadas la cuenta contable, fecha inicial y final del documento bancario.
        /// </summary>
        /// <param name="ccuenta">Cuenta contable.</param>
        /// <param name="fechainicial">fecha inicial del documento bancario.</param>
        /// <param name="fechafinal">fecha final del documento bancario.</param>
        /// <returns>int</returns>
        public static int ActualizarEstado(string ccuenta, int fechainicial, int fechafinal)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = " UPDATE tconconciliacionbancariaeb SET estadoconciliacioncdetalle = CASE WHEN tcb.cconconciliacionbancariaextracto IS NULL THEN '2' ELSE '1' END FROM tconconciliacionbancariaeb LEFT OUTER JOIN tconconciliacionbancaria tcb ON tcb.cconconciliacionbancariaextracto = tconconciliacionbancariaeb.cconconciliacionbancariaextracto WHERE tconconciliacionbancariaeb.fecha BETWEEN " + 
                    fechainicial  + 
                    " AND " + 
                    fechafinal  + 
                    " AND tconconciliacionbancariaeb.ccuenta = '" + 
                    ccuenta.Trim() + 
                    "' and tcb.optlock = 1 ";

                return contexto.Database.ExecuteSqlCommand(lSQL);

            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }

        }

        public static List<tconconciliacionbancariaeb> GetExtracto(string ccuenta, string estadoconciliacioncdetalle, int finicio, int ffin)
        {
            List<tconconciliacionbancariaeb> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconconciliacionbancariaeb.Where(x => x.ccuenta == ccuenta 
                                                            && x.estadoconciliacioncdetalle == estadoconciliacioncdetalle
                                                            && x.fecha >= finicio
                                                            && x.fecha <= ffin
                                                            && x.ajustextracto != true).ToList();
            return obj;
        }

        public static tconconciliacionbancariaeb GetExtracto(int fecha, string ccuenta, string numerodocumentobancario, decimal valorcredito, decimal valordebito)
        {
            tconconciliacionbancariaeb obj = new tconconciliacionbancariaeb();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconconciliacionbancariaeb.Where(x => x.cuentabancaria == ccuenta
                                                            && x.fecha == fecha
                                                            && x.numerodocumentobancario == numerodocumentobancario
                                                            && x.valorcredito == valorcredito
                                                            && x.valordebito == valordebito).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }


        public static List<tconextractobancario> GetExtractoCP(string ccuentabanco, int finicio, int ffin)
        {
            List<tconextractobancario> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconextractobancario.Where(x => x.ccuentabanco == ccuentabanco 
                                                            && x.fmovimiento >= finicio
                                                            && x.fmovimiento <= ffin
                                                            && x.conciliado == false
                                                            && x.ajusteextracto == false).ToList();
            return obj;
        }


        /// <summary>
        /// Determina si existe el extacto bancario, dados la cuenta, fecha, número del documento bancario, valor del crédito y valor del débito.
        /// </summary>
        /// <param name="ccuenta">Cuenta contable.</param>
        /// <param name="fecha">Fecha del documento bancario.</param>
        /// <param name="numerodocumentobancario">Número del documento bancario.</param>
        /// <param name="valorcredito">Valor del crédito.</param>
        /// <param name="valordebito">Valor del débito.</param>
        /// <returns>string<tConciliacion></returns>
        public static tconextractobancario ExisteFechaNumeroDocumento(string ccuenta, int fecha, string numerodocumentobancario, decimal valorcredito, decimal valordebito, string numeroComprobante)
        {
            tconextractobancario obj = new tconextractobancario();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconextractobancario.Where(x => x.ccuentabanco == ccuenta
                                                            && x.fmovimiento == fecha
                                                            && x.documento == numerodocumentobancario
                                                            && x.comprobante == numeroComprobante
                                                            && x.montocredito == valorcredito
                                                            && x.montodebito == valordebito).SingleOrDefault();
            return obj;
        }

    }
}
