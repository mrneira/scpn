using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;
using modelo;
using modelo.servicios;
using util.dto.consulta;

namespace dal.contabilidad.conciliacionbancaria
{
    /// <summary>
    /// Clase que encapsula los procedimientos para ejecutar las operaciones de la conciliación bancaria.
    /// </summary>
    public class TconConciliacionBancariaDal
    {
        private static string SqlMaxPkMasUno = "select ISNULL(max(cconconciliacionbancaria),0) + 1 cConciliacionBancaria from tconconciliacionbancaria where @Uno = 1";

        /// <summary>
        /// Obtiene la conciliación bancaria.
        /// </summary>
        /// <returns>long</returns>
        public static long GetcConciliacionBancaria()
        {

            tconconciliacionbancaria fc = new tconconciliacionbancaria();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@Uno"] = 1;
            List<string> lcampos = new List<string>();
            lcampos.Add("cConciliacionBancaria");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlMaxPkMasUno);
                fc = (tconconciliacionbancaria)ch.GetRegistro("tconconciliacionbancaria", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("CONBAN-002", "ERROR EN CÁLCULO DEL ID. PARA tconconciliacionbancaria");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }

        /// <summary>
        /// Obtiene los parámetros para la conciliación bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns>IList<Dictionary<string, object>></returns>

        public static IList<Dictionary<string, object>> GetParametros(RqConsulta rqconsulta)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            string lSQL = "select codigo, cast(isnull(numero,0) as int) numero from tconparametros where codigo like 'CONCILIA_JUNTURA_%'";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);
            IList<Dictionary<string, object>> listaLibroMayor = ch.GetRegistrosDictionary();
            return listaLibroMayor;

        }

        /// <summary>
        /// Obtiene los datos de la conciliación bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns>List<tConciliacion></returns>
        public static List<tConciliacion> GetConciliacion(RqConsulta rqconsulta)
        {
            //dynamic arrayTransaccion = JsonConvert.DeserializeObject(rm.Mdatos["MODIFICARPAGOS"].ToString());
            //List<ttesrecaudacion> ldatos = rm.GetTabla("AUTORIZARAPLICACION").Lregistros.Cast<ttesrecaudacion>().ToList();
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();

            List<tConciliacion> ListaConciliacionClone = new List<tConciliacion>();

            string lSQLMayor = "select *, isnull(a.freal,0) nfreal, ltrim(rtrim(isnull(upper(replace(a.NOM_1, ' ', '')), ''))) apeynommay, ltrim(rtrim(isnull(a.NOM_1, ''))) nnombre, CASE WHEN ISNUMERIC(RTRIM(LTRIM(a.ID_1))) = 1 THEN CAST(RTRIM(LTRIM(a.ID_1)) AS bigint) ELSE - 2000 END identificacionmay, ltrim(rtrim(isnull(a.ID_1, ''))) identificacionmayor from(select ltrim(rtrim(isnull(replace(upper(tconcom.numerodocumentobancario),' ',''),''))) numerodocumentobancariomay, case when tconcom.tipopersona = 'PE' then(select distinct max(tperperdet.nombre) from tperpersonadetalle tperperdet where tperperdet.verreg = 0 and tperperdet.ccompania = tconcom.ccompania and tperperdet.cpersona = tconcom.cpersonarecibido) else (select distinct max(tperperdet.nombre) from tperproveedor tperperdet where tperperdet.verreg = 0 and tperperdet.ccompania = tconcom.ccompania and tperperdet.cpersona = tconcom.cpersonarecibido) end NOM_1, case when tconcom.tipopersona = 'PE' then(select distinct max(tperperdet.identificacion) from tperpersonadetalle tperperdet where tperperdet.verreg = 0 and tperperdet.ccompania = tconcom.ccompania and tperperdet.cpersona = tconcom.cpersonarecibido) else (select distinct max(tperperdet.identificacion) from tperproveedor tperperdet where tperperdet.verreg = 0 and tperperdet.ccompania = tconcom.ccompania and tperperdet.cpersona = tconcom.cpersonarecibido) end ID_1, tperperdet.identificacion, CASE WHEN ISNUMERIC(RTRIM(LTRIM(tsocces.credencial))) = 1 THEN CAST(RTRIM(LTRIM(tsocces.credencial)) AS bigint) ELSE - 2000 END credencialmay, RTRIM(LTRIM(isnull(tsocces.credencial, ''))) credencialmayor," +
                rqconsulta.Mdatos["conciliacionbancariaid"] +
                "conciliacionbancariaid, '2' estadoconciliacioncdetallemay, null cconconciliacionbancaria, ROW_NUMBER() OVER(ORDER BY tconconmay.monto desc, tconconmay.fcontable desc, tconconmay.ccomprobante, tconconmay.secuencia) cconciliacionbancariamayor, tconconmay.ccuenta, tconconmay.fcontable nfcontable, tconconmay.secuencia nsecuencia, tconconmay.ccomprobante nccomprobante, (year(tconcom.freal) * 10000) +(month(tconcom.freal) * 100) + day(tconcom.freal) freal, tconconmay.debito ndebito, tconconmay.monto nmonto, tconcom.comentario ncomentario, 'PENDIENTE' nestadoconciliacioncdetallemayor, tsocces.credencial, case when tconconmay.debito = 1 then tconconmay.monto else 0 end valordebito, case when tconconmay.debito <> 1 then tconconmay.monto else 0 end valorcredito from tconcomprobantedetalle tconconmay inner join tconcomprobante tconcom on tconconmay.ccomprobante = tconcom.ccomprobante and tconconmay.fcontable = tconcom.fcontable and tconconmay.particion = tconcom.particion and tconconmay.ccompania = tconcom.ccompania left outer join(select cpersona, ccompania, credencial, verreg from tsoccesantia where verreg = 0) tsocces on tconcom.cpersonarecibido = tsocces.cpersona and tconcom.tipopersona = 'PE' left outer join tperpersonadetalle tperperdet on tperperdet.ccompania = tsocces.ccompania and tperperdet.cpersona = tsocces.cpersona and tperperdet.verreg = tsocces.verreg where tconconmay.ccuenta = '" + 
                rqconsulta.Mdatos["ccuenta"].ToString().Trim() +
                "' and tconconmay.conciliacionbancariaid is null and tconcom.anulado = 0 and tconcom.eliminado = 0 and tconcom.ccomprobante not in (select ccomprobanteanulacion from tconcomprobante where ccomprobanteanulacion is not null)) a ORDER BY a.nmonto DESC, a.nfcontable DESC, identificacionmay DESC, a.credencialmay DESC, nnombre DESC, a.numerodocumentobancariomay DESC";

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQLMayor);

            IList<Dictionary<string, object>> listaConciliacion = null;

            try
            {
                listaConciliacion = ch.GetRegistroDictionary();
            }
            catch
            {
                return ListaConciliacionClone;
            }

            IList<Dictionary<string, object>> listaExtracto = null;

            if (listaConciliacion.Count > 0)
            {

                long lconciliacionbancariaid = 0;

                decimal lmonto = 0;

                bool lblnControlExtracto = false;

                foreach (var p in listaConciliacion)
                {


                    if (lmonto != decimal.Parse(p["nmonto"].ToString()))
                    {

                        lblnControlExtracto = true;

                        lmonto = decimal.Parse(p["nmonto"].ToString());

                        string lSqlExtracto = "select CASE WHEN ISNULL(tconext.valorcredito,0) <> 0 THEN tconext.valorcredito ELSE tconext.valordebito END montoExtracto, ltrim(rtrim(isnull(tconext.identificacion,''))) identificacionextracto, ltrim(rtrim(isnull(upper(replace(tconext.numerodocumentobancario,' ','')),''))) numerodocumentobancarioext, ltrim(rtrim(isnull(upper(replace(tconext.nombre,' ','')),''))) apeynomext, ltrim(rtrim(isnull(tconext.nombre,''))) nnombre, CASE WHEN ISNUMERIC(RTRIM(LTRIM(tconext.identificacion))) = 1 THEN CAST(RTRIM(LTRIM(tconext.identificacion)) AS bigint) ELSE -1000 END identificacionext, CASE WHEN ISNUMERIC(RTRIM(LTRIM(tconext.credencial))) = 1 THEN CAST(RTRIM(LTRIM(tconext.credencial)) AS bigint) ELSE -1000 END credencialext, tconext.estadoconciliacioncdetalle estadoconciliacioncdetalleext, tconext.cconconciliacionbancariaextracto, tconext.fecha nfecha, tconext.credencial ncredencial, tconext.valorcredito nvalorcredito, tconext.valordebito nvalordebito, 'PENDIENTE' as nestadoconciliacioncdetalleextracto, tconext.concepto nconcepto, tconext.informacion ninformacion, tconext.cuentabancaria ncuentabancaria from tconconciliacionbancariaeb tconext where tconext.ccuenta = '" +
                            rqconsulta.Mdatos["ccuenta"].ToString().Trim() +
                            "' and tconext.estadoconciliacioncdetalle = '2' and (ISNULL(tconext.valorcredito,0) = " + lmonto.ToString().Replace(",", ".") + " OR ISNULL(tconext.valordebito,0) = " + lmonto.ToString().Replace(",", ".") + ") ORDER BY CASE WHEN ISNULL(tconext.valorcredito,0) <> 0 THEN tconext.valorcredito ELSE tconext.valordebito END DESC, tconext.fecha DESC, CASE WHEN ISNUMERIC(RTRIM(LTRIM(tconext.identificacion))) = 1 THEN CAST(RTRIM(LTRIM(tconext.identificacion)) AS bigint) ELSE -1000 END DESC, CASE WHEN ISNUMERIC(RTRIM(LTRIM(tconext.credencial))) = 1 THEN CAST(RTRIM(LTRIM(tconext.credencial)) AS bigint) ELSE -1000 END DESC, ltrim(rtrim(isnull(tconext.nombre,''))) DESC, ltrim(rtrim(isnull(tconext.numerodocumentobancario,''))) DESC";

                        ConsultaHelper che = new ConsultaHelper(contexto, parametros, lSqlExtracto);

                        try
                        {
                            listaExtracto = che.GetRegistroDictionary();

                            if (listaExtracto.Count == 0) { lblnControlExtracto = false; }

                        }
                        catch
                        {
                            lblnControlExtracto = false;
                        }

                    }

                    if (lblnControlExtracto)
                    {

                        Dictionary<string, object> qa = null;

                        foreach (var q in listaExtracto)
                        {

                            if (decimal.Parse(q["montoExtracto"].ToString()) < decimal.Parse(p["nmonto"].ToString()))
                            {
                                break;
                            }

                            if (q["estadoconciliacioncdetalleext"].ToString() == "2")
                            {

                                bool lblnControl = false;

                                if ((p["ndebito"].ToString() == "True" || p["ndebito"].ToString() == "1") && decimal.Parse(q["nvalorcredito"].ToString()) == decimal.Parse(p["nmonto"].ToString())) //nvalorcredito
                                {
                                    lblnControl = true;
                                }

                                if (!lblnControl && (p["ndebito"].ToString() == "False" || p["ndebito"].ToString() == "0") && decimal.Parse(q["nvalordebito"].ToString()) == decimal.Parse(p["nmonto"].ToString())) //nvalorcredito
                                {
                                    lblnControl = true;
                                }

                                if (lblnControl)
                                {

                                    if (Concilia(rqconsulta, p, q))
                                    {
                                        qa = q;

                                        break;
                                    }

                                }

                            }

                        }


                        if (qa != null)
                        {

                            if (lconciliacionbancariaid == 0) lconciliacionbancariaid = (long)p["conciliacionbancariaid"];

                            int lnfreal = int.Parse(p["nfreal"].ToString());

                            long? lcconconciliacionbancaria = null;

                            if (p["cconconciliacionbancaria"] != null) lcconconciliacionbancaria = (long)p["cconconciliacionbancaria"];

                            ListaConciliacionClone.Add(
                                new tConciliacion()
                                {
                                    conciliacionbancariaid = lconciliacionbancariaid,
                                    estadoconciliacioncdetallemay = (string)p["estadoconciliacioncdetallemay"],
                                    cconconciliacionbancaria = lcconconciliacionbancaria,
                                    cconciliacionbancariamayor = (long)p["cconciliacionbancariamayor"],
                                    ccuenta = (string)p["ccuenta"],
                                    nfcontable = int.Parse(p["nfcontable"].ToString()),
                                    nsecuencia = int.Parse(p["nsecuencia"].ToString()),
                                    nccomprobante = (string)p["nccomprobante"],
                                    nfreal = lnfreal,
                                    ndebito = (bool)p["ndebito"],
                                    nmonto = decimal.Parse(p["nmonto"].ToString()),
                                    ncomentario = (string)p["ncomentario"],
                                    nestadoconciliacioncdetallemayor = (string)p["nestadoconciliacioncdetallemayor"],
                                    identificacionmayor = (string)p["identificacionmayor"],
                                    credencialmayor = (string)p["credencialmayor"],
                                    credencial = (string)p["credencialmayor"],
                                    ncredencial = (string)p["credencialmayor"],
                                    apeynommay = (string)p["apeynommay"],
                                    nnombre = (string)p["nnombre"],
                                    nidentificacion = (string)p["identificacionmayor"],
                                    numerodocumentobancariomay = (string)p["numerodocumentobancariomay"],
                                    nnumerodocumentobancario = (string)p["numerodocumentobancariomay"]
                                });

                            ListaConciliacionClone.Add(
                                new tConciliacion()
                                {
                                    conciliacionbancariaid = lconciliacionbancariaid,
                                    cconconciliacionbancaria = lcconconciliacionbancaria,
                                    cconconciliacionbancariaextracto = (long)qa["cconconciliacionbancariaextracto"],
                                    ccuenta = (string)p["ccuenta"],
                                    estadoconciliacioncdetalleext = (string)qa["estadoconciliacioncdetalleext"],
                                    nfecha = int.Parse(qa["nfecha"].ToString()),
                                    ncredencial = (string)qa["ncredencial"],
                                    nvalorcredito = decimal.Parse(qa["nvalorcredito"].ToString()),
                                    nvalordebito = decimal.Parse(qa["nvalordebito"].ToString()),
                                    nestadoconciliacioncdetalleextracto = (string)qa["nestadoconciliacioncdetalleextracto"],
                                    nconcepto = (string)qa["nconcepto"],
                                    ninformacion = (string)qa["ninformacion"],
                                    ncuentabancaria = (string)qa["ncuentabancaria"],
                                    credencial = qa["credencialext"].ToString(),
                                    valordebito = decimal.Parse(qa["nvalordebito"].ToString()),
                                    valorcredito = decimal.Parse(qa["nvalorcredito"].ToString()),
                                    identificacionextracto = (string)qa["identificacionextracto"],
                                    apeynomext = (string)qa["apeynomext"],
                                    nnombre = (string)qa["nnombre"],
                                    numerodocumentobancarioext = (string)qa["numerodocumentobancarioext"],
                                    nnumerodocumentobancario = (string)qa["numerodocumentobancarioext"],
                                    nidentificacion = (string)qa["identificacionextracto"]

                                });

                            qa["estadoconciliacioncdetalleext"] = "1";

                            lconciliacionbancariaid++;

                        }

                    }


                }

                return ListaConciliacionClone;
            }
            else
            {
                return ListaConciliacionClone;
            }


        }

        /// <summary>
        /// Obtiene los parámetros para realizar las junturas para realizar la conciliación en forma automática.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <param name="p">Arreglo con los datos del mayor contable.</param>
        /// <param name="q">Arreglo con los datos del extacto bancario..</param>
        /// <returns>bool<tConciliacion></returns>
        private static bool Concilia(RqConsulta rqconsulta, Dictionary<string, object> p, Dictionary<string, object> q)
        {

            if ((rqconsulta.Mdatos["junturaapellidosnombres"].ToString() == "True" || rqconsulta.Mdatos["junturaapellidosnombres"].ToString() == "1") &&
                (p["apeynommay"].ToString().Trim().Length == 0 || (p["apeynommay"].ToString().Trim().Length > 0 && p["apeynommay"].ToString() != q["apeynomext"].ToString())))
            {
                return false;
            }

            if ((rqconsulta.Mdatos["junturacedula"].ToString() == "True" || rqconsulta.Mdatos["junturacedula"].ToString() == "1") &&
                (long.Parse(p["identificacionmay"].ToString()) <= 0 ||
                p["identificacionmay"].ToString().Trim().Length == 0 ||
                (long.Parse(p["identificacionmay"].ToString()) > 0 && long.Parse(p["identificacionmay"].ToString()) != long.Parse(q["identificacionext"].ToString()))))
            {
                return false;
            }

            if ((rqconsulta.Mdatos["junturacredencial"].ToString() == "True" || rqconsulta.Mdatos["junturacredencial"].ToString() == "1") &&
                (long.Parse(p["credencialmay"].ToString()) <= 0 ||
                p["credencialmay"].ToString().Trim().Length == 0 ||
                (long.Parse(p["credencialmay"].ToString()) > 0 && long.Parse(p["credencialmay"].ToString()) != long.Parse(q["credencialext"].ToString()))))
            {
                return false;
            }

            if ((rqconsulta.Mdatos["junturafecha"].ToString() == "True" || rqconsulta.Mdatos["junturafecha"].ToString() == "1") &&
                int.Parse(p["nfcontable"].ToString()) != int.Parse(q["nfecha"].ToString()))
            {
                return false;
            }

            if ((rqconsulta.Mdatos["junturanumerodocumento"].ToString() == "True" || rqconsulta.Mdatos["junturanumerodocumento"].ToString() == "1") &&
                (p["numerodocumentobancariomay"].ToString().Trim().Length == 0 || (p["numerodocumentobancariomay"].ToString().Trim().Length > 0 && p["numerodocumentobancariomay"].ToString() != q["numerodocumentobancarioext"].ToString())))
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Obtiene la conciliación bancaria.
        /// </summary>
        /// <param name="cConciliacionBancaria">Identificador de la conciliación bancaria a obtener.</param>
        /// <returns>tconconciliacionbancaria<tConciliacion></returns>
        public static tconconciliacionbancaria Find(long cConciliacionBancaria)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconconciliacionbancaria control = null;

            control = contexto.tconconciliacionbancaria.AsNoTracking().Where(x => x.cconconciliacionbancaria == cConciliacionBancaria).SingleOrDefault();
            if (control == null)
            {
                return null;
            }
            return control;
        }

        /// <summary>
        /// Obtiene el mayor contable de la conciliación bancaria.
        /// </summary>
        /// <param name="cConciliacionBancariaMayor">Identificador del mayor conciliado a obtener.</param>
        /// <returns>string<tConciliacion></returns>
        public static string FindMayor(long cConciliacionBancariaMayor)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconconciliacionbancaria control = null;

            control = contexto.tconconciliacionbancaria.AsNoTracking().Where(x => x.cconciliacionbancariamayor == cConciliacionBancariaMayor).SingleOrDefault();
            if (control == null)
            {
                return "";
            }
            return control.conciliacionbancariaid.ToString();
        }

        /// <summary>
        /// Obtiene el extracto bancario de la conciliación bancaria.
        /// </summary>
        /// <param name="cConciliacionBancariaExtracto">Identificador del extracto bancario conciliado.</param>
        /// <returns>string<tConciliacion></returns>
        public static string FindExtracto(long cConciliacionBancariaExtracto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconconciliacionbancaria control = null;

            control = contexto.tconconciliacionbancaria.AsNoTracking().Where(x => x.cconconciliacionbancariaextracto == cConciliacionBancariaExtracto).SingleOrDefault();
            if (control == null)
            {
                return "";
            }
            return control.conciliacionbancariaid.ToString();
        }

        /// <summary>
        /// Elimina registros de la conciliación bancaria, dadas la cuenta contable, fecha inicial y final.
        /// </summary>
        /// <param name="ccuenta">Cuenta contable.</param>
        /// <param name="fechainicial">Fecha inicial.</param>
        /// <param name="fechafinal">Fecha final.</param>
        /// <returns>int</returns>
        public static int Delete(string ccuenta, int fechainicial, int fechafinal)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = " delete from tconconciliacionbancaria where cconconciliacionbancaria in (select cb.cconconciliacionbancaria from dbo.tconconciliacionbancaria as cb left outer join  dbo.tconconciliacionbancariaeb as cbe on cb.cconconciliacionbancariaextracto = cbe.cconconciliacionbancariaextracto left outer join dbo.tconconciliacionbancariamayor as cbm on cb.cconciliacionbancariamayor = cbm.cconciliacionbancariamayor left outer join dbo.tgencatalogodetalle as tcdm on cbm.estadoconciliacionccatalogo = tcdm.ccatalogo and cbm.estadoconciliacioncdetalle = tcdm.cdetalle left outer join dbo.tgencatalogodetalle as tcde on cbe.estadoconciliacionccatalogo = tcde.ccatalogo and cbe.estadoconciliacioncdetalle = tcde.cdetalle where (cbm.fcontable between " +
                    fechainicial +
                    " and " +
                    fechafinal +
                    " or cbe.fecha between " +
                    fechainicial +
                    " and " +
                    fechafinal +
                    ") and (cbm.ccuenta = '" +
                    ccuenta.Trim() + "' or cbe.ccuenta = '" +
                    ccuenta.Trim() + "') and isnull(cb.optlock,0) = 0) ";

                return contexto.Database.ExecuteSqlCommand(lSQL);

            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }

        }

        public static List<tconconciliacionbancaria> GetExtractoPorEstado(string cestado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconconciliacionbancaria> conciliacion;
            conciliacion = contexto.tconconciliacionbancaria.AsNoTracking().Where(x => x.cestado == cestado).ToList();
            return conciliacion;
        }

        public static void EliminarConciliacion(int mes, int anio, string ccuenta) {

            string storeprocedure = "sp_ConManEliminaConciliacion";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@i_mes"] = mes;
            parametros["@i_anio"] = anio;
            parametros["@i_ccuenta"] = ccuenta;
            dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros, 0);
        }
    }

    public class tConciliacion : tconconciliacionbancariamayor
    {
        public long conciliacionbancariaid;
        public string estadoconciliacioncdetallemay;
        public string estadoconciliacioncdetalleext;
        public long? cconconciliacionbancaria;
        public long? cconconciliacionbancariaextracto;
        public int? nfcontable;
        public int? nsecuencia;
        public int? nfecha;
        public string nccomprobante;
        public int? nfreal;
        public bool? ndebito;
        public decimal? nmonto;
        public string ncomentario;
        public string nestadoconciliacioncdetallemayor;
        public string ncredencial;
        public decimal? nvalorcredito;
        public decimal? nvalordebito;
        public string nestadoconciliacioncdetalleextracto;
        public string nconcepto;
        public string ninformacion;
        public string ncuentabancaria;
        public string credencial;
        public decimal? valordebito;
        public decimal? valorcredito;
        public string identificacionmayor;
        public string identificacionextracto;
        public string credencialmayor;
        public string apeynommay;

        public string nnombre;
        public string nidentificacion;
        public string nnumerodocumentobancario;

        public string apeynomext;
        public string numerodocumentobancariomay;
        public string numerodocumentobancarioext;
    }

}
