
using System.Collections.Generic;
using System.Linq;
using System;
using util;
using util.servicios.ef;
using modelo;
using modelo.servicios;
using util.dto.consulta;
using modelo.helper;
using dal.inversiones.contabilizacion;
using System.Data;
using System.Data.SqlClient;
using util.dto.mantenimiento;
using dal.generales;

namespace dal.inversiones.inversiones
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales del módulo de inversiones.
    /// </summary>
    public class TinvInversionDal
    {

        /// <summary>
        /// Obtiene una imágen de la inversión.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <param name="">Identificador del emisor.</param>
        /// <param name="">Valor de la inversión.</param>
        /// <returns>string</returns>

        public static string devolucionInversion(long cinversion, string icusuario, string comentariosdevolucion)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string storeprocedure = "sp_InvManDevolucionInversion";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cinversion"] = cinversion;
            parametros["@comentariosdevolucion"] = comentariosdevolucion;
            parametros["@cusuario"] = icusuario;
            DataTable DataTable = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros,0);
            IList<Dictionary<string, object>> list = DataTable.AsEnumerable().Select(dr => {
                var dic = new Dictionary<string, object>();
                dr.ItemArray.Aggregate(-1, (int i, object v) => {
                    i += 1; dic.Add(DataTable.Columns[i].ColumnName, v);
                    return i;
                });
                return dic;
            }).ToList();


            return "";

        }


        public static string obtenerImagen(long cinversion, string icusuario)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string storeprocedure = "sp_InvManObtieneImagenInversion";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cinversion"] = cinversion;
            parametros["@cusuario"] = icusuario;
            DataTable DataTable = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros,0);
            IList<Dictionary<string, object>> list = DataTable.AsEnumerable().Select(dr => {
                var dic = new Dictionary<string, object>();
                dr.ItemArray.Aggregate(-1, (int i, object v) => {
                    i += 1; dic.Add(DataTable.Columns[i].ColumnName, v);
                    return i;
                });
                return dic;
            }).ToList();


            return "";

        }


        /// <summary>
        /// Obtiene una alerta en el caso de que el emisor exceda su porcentaje máximo para invertir.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <param name="">Identificador del emisor.</param>
        /// <param name="">Valor de la inversión.</param>
        /// <returns>string</returns>
        //public static string alertaPorcentajeInversion(long cinversion, string iemisorcdetalle, decimal valorInversion)
        public static string[] alertaPorcentajeInversion(long cinversion, string iemisorcdetalle, decimal valorInversion, string instrumentocdetalle)
        {

            string[] lRetorna = new string[2];

            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string storeprocedure = "sp_InvConPorcentajeInversion";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@iemisorcdetalle"] = iemisorcdetalle;
            parametros["@cinversion"] = cinversion;
            parametros["@valor"] = valorInversion;
            parametros["@instrumentocdetalle"] = instrumentocdetalle;

            DataTable DataTable = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros,0);
            IList<Dictionary<string, object>> list = DataTable.AsEnumerable().Select(dr => {
                var dic = new Dictionary<string, object>();
                dr.ItemArray.Aggregate(-1, (int i, object v) => {
                    i += 1; dic.Add(DataTable.Columns[i].ColumnName, v);
                    return i;
                });
                return dic;
            }).ToList();

            lRetorna[0] = list[0]["mensaje"].ToString();
            lRetorna[1] = list[0]["Error"].ToString();

            return lRetorna;

            //return list[0]["mensaje"].ToString();

        }

        /// <summary>
        /// Obtener una inversión, dado su identificador.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>tinvinversion</returns>
        public static tinvinversion FindWithLock(long cinversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvinversion obj = contexto.tinvinversion.Where(x => x.cinversion == cinversion).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            return obj;
        }


 //------------------------------------------------------------------------------------------------------------------------


        /// <summary>
        /// Entrega los datos de inversiones por emisor de inversiones
        /// </summary>
        /// <param name="cemisorcdetalle">Emisor de la inversion</param>
        /// <returns></returns>
        public static IList<tinvinversion> FindInversiones( string cemisorcdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tinvinversion> obj = contexto.tinvinversion.AsNoTracking().Where(x => x.numeroacciones > 0 && x.emisorccatalogo == 1213 && x.emisorcdetalle == cemisorcdetalle && x.tasaclasificacioncdetalle == "VAR").ToList();
            return obj;
        }
        public static IList<tinvinversion> FindInversiones(string cemisorcdetalle, string estado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tinvinversion> obj = contexto.tinvinversion.AsNoTracking().Where(x => x.estadocdetalle.Equals(estado)  && x.emisorccatalogo == 1213 && x.emisorcdetalle == cemisorcdetalle).ToList();
            return obj;
        }



        /// <summary>
        /// Entrega los datos de precios de cierre por fecha de ultimo cierre
        /// </summary>
        /// <returns></returns>
        public static IList<tinvprecioscierre> FindOldPreciosCierre()
        {
            string fcierre = "select MAX(fultimocierre) from tinvprecioscierre";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tinvprecioscierre> obj = contexto.tinvprecioscierre.AsNoTracking().Where(x => x.emisorccatalogo == 1213 && x.fvaloracion == Int64.Parse(fcierre)).ToList();
            return obj;
        }


        /// <summary>
        /// Entrega cuetas por emisor al debe
        /// </summary>
        /// <returns></returns>
        public static tinvplantillacontable FindOperacionDebe(string emisordetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvplantillacontable obj = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.entidadccatalogo == 1213 && x.entidadcdetalle == emisordetalle && x.procesocdetalle == "VARPRE" && x.rubrocdetalle == "CAP").SingleOrDefault();
            return obj;
        }
        /// <summary>
        /// Entrega cuetas por emisor al debe
        /// </summary>
        /// <returns></returns>
        public static tinvplantillacontable FindOperacionRubro(string emisordetalle,string proceso, string rubro)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvplantillacontable obj = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.entidadccatalogo == 1213 && x.entidadcdetalle == emisordetalle && x.procesocdetalle == proceso && x.rubrocdetalle == rubro).SingleOrDefault();
            if (obj == null) {
                tgencatalogodetalle em = TgenCatalogoDetalleDal.Find(1213, emisordetalle);
                tgencatalogodetalle pro = TgenCatalogoDetalleDal.Find(1220, proceso);
                tgencatalogodetalle rub = TgenCatalogoDetalleDal.Find(1219, rubro);
                
                throw new AtlasException("INV-0029", "NO SE HA PARAMETRIZADO EL PROCESO {0} DEL EMISOR {1} EL RUBRO DE {2}",(pro==null)?"":pro.nombre, (em == null) ? "" : em.nombre, (rub == null) ? "" : rub.nombre);

            }
            return obj;
        }


        public static IList<tinvplantillacontable> FindProceso(string emisordetalle,string procesocdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tinvplantillacontable> obj = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.entidadcdetalle == emisordetalle && x.procesocdetalle == "VARPRE").ToList();
            return obj;
        }


        /// <summary>
        /// Entrega cuetas por emisor al debe
        /// </summary>
        /// <returns></returns>
        public static tinvplantillacontable FindOperacionHaber(string emisordetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvplantillacontable obj = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.entidadccatalogo == 1213 && x.entidadcdetalle == emisordetalle && x.procesocdetalle == "VARPRE" && x.rubrocdetalle == "ING").SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Entrega cuetas por emisor al debe
        /// </summary>
        /// <returns></returns>
        public static tinvplantillacontable FindOperacionOrdenHaber(string emisordetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvplantillacontable obj = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.entidadccatalogo == 1213 && x.entidadcdetalle == emisordetalle && x.procesocdetalle == "VARPRE" && x.rubrocdetalle == "CTORAC").SingleOrDefault();
            return obj;
        }
        /// <summary>
        /// Entrega cuetas por emisor al debe
        /// </summary>
        /// <returns></returns>
        public static tinvplantillacontable FindOperacionOrdenDebe(string emisordetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvplantillacontable obj = contexto.tinvplantillacontable.AsNoTracking().Where(x => x.entidadccatalogo == 1213 && x.entidadcdetalle == emisordetalle && x.procesocdetalle == "VARPRE" && x.rubrocdetalle == "CTORDE").SingleOrDefault();
            return obj;
        }


        /// <summary>
        /// Entrega los datos precios de historia
        /// </summary>
        /// <returns></returns>
        public static tinvprecioscierrehistoria FindOldPreciosCierreHistoria(string emisordetalle)
        {

            string cinpreciohis = "select MIN(cinpreciohis) from tinvprecioscierrehistoria" + emisordetalle;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvprecioscierrehistoria obj = contexto.tinvprecioscierrehistoria.AsNoTracking().Where(x => x.cemisorccatalogo == 1213 && x.cemisorcdetalle == emisordetalle && x.cinpreciohis == Int32.Parse(cinpreciohis)).SingleOrDefault();
            return obj;
        }




        //-------------------------------------------------------------------------------------------------------------------------------------


        /// <summary>
        /// Obtener una inversión, dado su identificador.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>tinvinversion</returns>
        public static tinvinversion FindWithOutLock(long cinversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvinversion obj = contexto.tinvinversion.Where(x => x.cinversion == cinversion).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            return obj;
        }

        /// <summary>
        /// Obtener una entidad financiera, dado el catálogo y su idemtificador.
        /// </summary>
        /// <param name="ccatalogo">Identificador del catálogo.</param>
        /// <param name="cdetalle">Identificador del detalle del catálogo.</param>
        /// <returns>tinvbancodetalle</returns>
        public static tinvbancodetalle FindBancoDetalle(int ccatalogo, string cdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvbancodetalle obj = null;

            obj = contexto.tinvbancodetalle.AsNoTracking().Where(x => x.bancoccatalogo == ccatalogo && x.bancocdetalle.Equals(cdetalle)).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Obtener los pagos de registrados de las inversiones de renta variable.
        /// </summary>
        /// <param name="rqconsulta">Request de Consulta.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static IList<Dictionary<string, object>> GetPagoRentaVariable(RqConsulta rqconsulta)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            string lwhereAdicional = rqconsulta.Mdatos["whereAdicional"].ToString().Trim();

            lwhereAdicional = lwhereAdicional == "" ? "" : " and " + lwhereAdicional + " ";

            string lSQL = "select a.*, case when a.PlantillaCapital IS NOT NULL OR a.PlantillaInteres IS NOT NULL OR a.PlantillaBancos IS NOT NULL THEN '' ELSE case when a.PlantillaCapital IS NULL THEN 'Parametrice la cuenta contable para el Capital.' else '' end + case when a.PlantillaCapital IS NULL THEN ' ' else '' end + case when a.PlantillaInteres IS NULL THEN 'Parametrice la cuenta contable para el Interés.' else '' end + case when a.PlantillaCapital IS NULL OR a.PlantillaInteres IS NULL THEN ' ' else '' end + case when a.PlantillaBancos IS NULL THEN 'Parametrice la cuenta contable para Bancos.' else '' end END mensaje from(select (select MAX(tplacap.cinvplantillacontable) from tinvplantillacontable tplacap where tplacap.entidadccatalogo = 1213 and tplacap.entidadcdetalle = tinv.emisorcdetalle and tplacap.instrumentoccatalogo = 1202 and tplacap.instrumentocdetalle = tinv.instrumentocdetalle and tplacap.procesoccatalogo = 1220 and tplacap.procesocdetalle = '" +
                rqconsulta.Mdatos["procesocdetalle"].ToString().Trim() +
                "' and tplacap.centrocostoccatalogo = 1002 and tplacap.centrocostocdetalle = tinv.centrocostocdetalle and tplacap.rubroccatalogo = 1219 and tplacap.rubrocdetalle = 'CAP') PlantillaCapital,(select MAX(tplacap.cinvplantillacontable) from tinvplantillacontable tplacap where tplacap.entidadccatalogo = 1213 and tplacap.entidadcdetalle = tinv.emisorcdetalle and tplacap.instrumentoccatalogo = 1202 and tplacap.instrumentocdetalle = tinv.instrumentocdetalle and tplacap.procesoccatalogo = 1220 and tplacap.procesocdetalle = '" +
                rqconsulta.Mdatos["procesocdetalle"].ToString().Trim() +
                "' and tplacap.centrocostoccatalogo = 1002 and tplacap.centrocostocdetalle = tinv.centrocostocdetalle and tplacap.rubroccatalogo = 1219 and tplacap.rubrocdetalle = 'INT') PlantillaInteres " +
                ",(select MAX(tplaban.cinvplantillacontable) from tinvplantillacontable tplaban where tplaban.entidadccatalogo = 1224 and tplaban.entidadcdetalle = tinv.bancocdetalle and tplaban.instrumentoccatalogo = 1202 and tplaban.instrumentocdetalle = tinv.instrumentocdetalle and tplaban.procesoccatalogo = 1220 and tplaban.procesocdetalle = '" +
                rqconsulta.Mdatos["procesocdetalle"].ToString().Trim() +
                "' and tplaban.centrocostoccatalogo = 1002 and tplaban.centrocostocdetalle = tinv.centrocostocdetalle and tplaban.rubroccatalogo = 1219 and tplaban.rubrocdetalle = 'BANCOS') PlantillaBancos " +
                ", tinv.bancopagoccatalogo, tinv.bancopagocdetalle, tinv.emisorcdetalle, tinv.centrocostocdetalle, tinv.bancocdetalle, tinv.fcompra, tinv.fpago, tinv.cinversion, tinv.numerocontrato, isnull(tinv.codigotitulo, '') codigotitulo, tdetemi.nombre emisor, tins.nombre instrumento, tinv.instrumentocdetalle instrumentocodigo, tinv.valornominal, tinv.valornegociacion, tinv.preciounitarioaccion,tinv.numeroacciones,tinv.valoracciones,tinv.preciocompra,tinv.valordividendospagados,tinv.porcentajeparticipacioncupon,tinv.valorefectivo, tdetclainv.nombre clasificacioninversion " +
                ", tinv.observaciones, tinv.observacionespagos, tinv.comisionbolsavalores, tinv.comisionoperador, tinv.comisionretencion, isnull(tinv.comisionbolsavalores, 0) + isnull(tinv.comisionoperador, 0) - isnull(tinv.comisionretencion, 0) comisiontotal, tinv.femision, tagebol.identificacion agentebolsaRUC, tagebol.nombres agentebolsanombres, tagebol.direccion agentebolsadireccion, tagebol.telefono01 agentebolsatelefono01, tdetcomcup.nombre compracupon, tdetsec.nombre sector, tdetsis.nombre sistemacolocacion, tdetest.nombre estado from tinvinversion tinv left outer join tgencatalogodetalle tdettas on tinv.tasaclasificacionccatalogo = tdettas.ccatalogo and tinv.tasaclasificacioncdetalle = tdettas.cdetalle " + 
                "left outer join tinvagentebolsa tagebol on tagebol.cinvagentebolsa = tinv.cinvagentebolsa " +
                "left outer join tinvoperadorinstitucional topeins on topeins.tinvoperadorinstitucional = tinv.tinvoperadorinstitucional " +
                "left outer join tgencatalogodetalle tdetbolval on tinv.bolsavaloresccatalogo = tdetbolval.ccatalogo and tinv.bolsavalorescdetalle = tdetbolval.cdetalle left outer join tgencatalogodetalle tdetcalend on tinv.calendarizacionccatalogo = tdetcalend.ccatalogo and tinv.calendarizacioncdetalle = tdetcalend.cdetalle left outer join tgencatalogodetalle tdetcalrie on tinv.calificacionriesgoinicialccatalogo = tdetcalrie.ccatalogo and tinv.calificacionriesgoinicialcdetalle = tdetcalrie.cdetalle left outer join tgencatalogodetalle tdetcalrieact on tinv.calificacionriesgoactualccatalogo = tdetcalrieact.ccatalogo and tinv.calificacionriesgoactualcdetalle = tdetcalrieact.cdetalle left outer join tgencatalogodetalle tdetcasval on tinv.casavaloresccatalogo = tdetcasval.ccatalogo and tinv.casavalorescdetalle = tdetcasval.cdetalle left outer join tgencatalogodetalle tdetclainv on tinv.clasificacioninversionccatalogo = tdetclainv.ccatalogo and tinv.clasificacioninversioncdetalle = tdetclainv.cdetalle left outer join tgencatalogodetalle tdetcomcup on tinv.compracuponccatalogo = tdetcomcup.ccatalogo and tinv.compracuponcdetalle = tdetcomcup.cdetalle left outer join tgencatalogodetalle tdetemi on tinv.emisorccatalogo = tdetemi.ccatalogo and tinv.emisorcdetalle = tdetemi.cdetalle left outer join tgencatalogodetalle tins on tinv.instrumentoccatalogo = tins.ccatalogo and tinv.instrumentocdetalle = tins.cdetalle left outer join tgencatalogodetalle tdetforaju on tinv.formaajusteinteresccatalogo = tdetforaju.ccatalogo and tinv.formaajusteinterescdetalle = tdetforaju.cdetalle left outer join tgencatalogodetalle tdetins on tinv.instrumentoccatalogo = tdetins.ccatalogo and tinv.instrumentocdetalle = tdetins.cdetalle left outer join tgencatalogodetalle tdetmer on tinv.mercadotipoccatalogo = tdetmer.ccatalogo and tinv.mercadotipocdetalle = tdetmer.cdetalle left outer join tgencatalogodetalle tdetmon on tinv.monedaccatalogo = tdetmon.ccatalogo and tinv.monedacdetalle = tdetmon.cdetalle left outer join tgencatalogodetalle tdetpercap on tinv.periodicidadpagoscapitalccatalogo = tdetpercap.ccatalogo and tinv.periodicidadpagoscapitalcdetalle = tdetpercap.cdetalle left outer join tgencatalogodetalle tdetperint on tinv.periodicidadpagosinteresccatalogo = tdetperint.ccatalogo and tinv.periodicidadpagosinterescdetalle = tdetperint.cdetalle left outer join tgencatalogodetalle tdetpor on tinv.portafolioccatalogo = tdetpor.ccatalogo and tinv.portafoliocdetalle = tdetpor.cdetalle left outer join tgencatalogodetalle tdetsec on tinv.sectorccatalogo = tdetsec.ccatalogo and tinv.sectorcdetalle = tdetsec.cdetalle left outer join tgencatalogodetalle tdetsis on tinv.sistemacolocacionccatalogo = tdetsis.ccatalogo and tinv.sistemacolocacioncdetalle = tdetsis.cdetalle left outer join tgencatalogodetalle tdetest on tinv.estadoccatalogo = tdetest.ccatalogo and tinv.estadocdetalle = tdetest.cdetalle left outer join tconcomprobante tcon ON tcon.ccomprobante = tinv.ccomprobante left outer join tgencatalogodetalle tdetdiaint on tinv.basediasinteresccatalogo = tdetdiaint.ccatalogo and tinv.basediasinterescdetalle = tdetdiaint.cdetalle where tinv.tasaclasificacioncdetalle = 'VAR' and tinv.femision between " +
                rqconsulta.Mdatos["finicial"].ToString().Trim() +
                " and " +
                rqconsulta.Mdatos["ffinal"].ToString().Trim() +
                lwhereAdicional +
                ") a order by a.femision, a.cinversion";


            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);
            IList<Dictionary<string, object>> listaPagos = ch.GetRegistrosDictionary();
            return listaPagos;

        }


        /// <summary>
        /// Obtener el título y los datos de la tabla de amortización.
        /// </summary>
        /// <param name="istrinstrumentocdetalle">Identificador del instrumento.</param>
        /// <param name="istrEmisorCdetalle">Identificador del emisor.</param>
        /// <param name="iintfemision">Fecha de emisión.</param>
        /// <param name="iintfvencimiento">Fecha de vencimiento.</param>
        /// <param name="itasa">Tasa de interés.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static IList<Dictionary<string, object>> obtenerTituloYCinversion(
            string istrinstrumentocdetalle,
            string istrEmisorCdetalle,
            int iintfemision,
            int iintfvencimiento,
            decimal itasa)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            string lSQL = "select a.cinversion, a.codigotitulo from (select tinv.cinversion, tinv.codigotitulo, tgen.nombre emisor, (SELECT MIN(finicio) FROM tinvtablaamortizacion t where t.cinversion = tinv.cinversion) femision, (SELECT MAX(fvencimiento) FROM tinvtablaamortizacion t where t.cinversion = tinv.cinversion) fvencimiento, tinv.tasa from tinvinversion tinv inner join tgencatalogodetalle tgen on tinv.emisorccatalogo = tgen.ccatalogo and tinv.emisorcdetalle = tgen.cdetalle where tinv.instrumentocdetalle = '" + 
                istrinstrumentocdetalle +
                "' and tinv.emisorcdetalle = '" + 
                istrEmisorCdetalle + 
                "') a where a.femision = " + 
                iintfemision.ToString() +
                " and a.fvencimiento = " +
                iintfvencimiento.ToString() +
                " and a.tasa = " + 
                itasa.ToString().Replace(",",".");

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);
            IList<Dictionary<string, object>> listaPagos = ch.GetRegistrosDictionary();
            return listaPagos;

        }


        /// <summary>
        /// Obtener las inversiones que no tienen tablas de amortización.
        /// </summary>
        /// <returns>List<tinvinversion></returns>
        public static List<tinvinversion> GetRentaFijaSinTabla()
        {


            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvinversion> lista = new List<tinvinversion>();
            lista = contexto.tinvinversion.AsNoTracking().Where(x => (x.instrumentocdetalle.Equals("CDP") || x.instrumentocdetalle.Equals("PA") || x.instrumentocdetalle.Equals("BONO")) && x.tasaclasificacioncdetalle.Equals("FIJA")).ToList();
            return lista;

        }


        public static List<tinvinversion> GetXCodigoTitulo(string istrCodigoTitulo)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvinversion> lista = new List<tinvinversion>();
            lista = contexto.tinvinversion.AsNoTracking().Where(x => (x.codigotitulo.Equals(istrCodigoTitulo.Trim()))).ToList();
            return lista;

        }


        /// <summary>
        /// Obtener los dividentos de la tabla de amortización.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static IList<Dictionary<string, object>> GetCuotas(RqConsulta rqconsulta)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            string lwhereAdicional = rqconsulta.Mdatos["whereAdicional"].ToString().Trim();

            lwhereAdicional = lwhereAdicional == "" ? "" : " and " + lwhereAdicional + " ";

            string[] lcInversion = new string[2];

            lcInversion[0] = "tinv.tasaclasificacioncdetalle = 'FIJA' and tinvtabamo.fvencimiento between " +
                rqconsulta.Mdatos["finicial"].ToString().Trim() +
                " and " +
                rqconsulta.Mdatos["ffinal"].ToString().Trim();

            lcInversion[1] = "inv.tasaclasificacioncdetalle = 'FIJA' ";

            if (rqconsulta.Mdatos.ContainsKey("cinversion"))
            {
                if (rqconsulta.Mdatos["cinversion"] != null)
                {
                    if (long.Parse(rqconsulta.Mdatos["cinversion"].ToString()) != 0)
                    {
                        lcInversion[0] = " tinv.cinversion = " + rqconsulta.Mdatos["cinversion"].ToString() + " ";
                        lcInversion[1] = " inv.cinversion = " + rqconsulta.Mdatos["cinversion"].ToString() + " ";
                    }

                }

            }

            string lstrIncluyePagados = " and tabamo.estadocdetalle <> 'PAG' ";

            if (rqconsulta.Mdatos.ContainsKey("incluyePagados"))
            {

                try
                {
                    if (bool.Parse(rqconsulta.Mdatos.ContainsKey("incluyePagados").ToString())) lstrIncluyePagados = "";
                }
                catch
                { }


            }

            string lSQL;

            if (lstrIncluyePagados == "")
            {
                lSQL = "select a.*, case when a.PlantillaCapital IS NOT NULL OR a.PlantillaInteres IS NOT NULL OR a.PlantillaBancos IS NOT NULL THEN '' ELSE case when a.PlantillaCapital IS NULL THEN 'Parametrice la cuenta contable para el Capital.' else '' end + case when a.PlantillaCapital IS NULL THEN ' ' else '' end + case when a.PlantillaInteres IS NULL THEN 'Parametrice la cuenta contable para el Interés.' else '' end + case when a.PlantillaCapital IS NULL OR a.PlantillaInteres IS NULL THEN ' ' else '' end + case when a.PlantillaBancos IS NULL THEN 'Parametrice la cuenta contable para Bancos.' else '' end END mensaje from(select (select nombre from tgencatalogodetalle tcd where tcd.ccatalogo = tinvtabamo.estadoccatalogo and tcd.cdetalle = tinvtabamo.estadocdetalle) tabamo_estado,(select MAX(tplacap.cinvplantillacontable) from tinvplantillacontable tplacap where tplacap.entidadccatalogo = 1213 and tplacap.entidadcdetalle = tinv.emisorcdetalle and tplacap.instrumentoccatalogo = 1202 and tplacap.instrumentocdetalle = tinv.instrumentocdetalle and tplacap.procesoccatalogo = 1220 and tplacap.procesocdetalle = 'RECUP' and tplacap.centrocostoccatalogo = 1002 and tplacap.centrocostocdetalle = tinv.centrocostocdetalle and tplacap.rubroccatalogo = 1219 and tplacap.rubrocdetalle = 'CAP') PlantillaCapital,(select MAX(tplacap.cinvplantillacontable) from tinvplantillacontable tplacap where tplacap.entidadccatalogo = 1213 and tplacap.entidadcdetalle = tinv.emisorcdetalle and tplacap.instrumentoccatalogo = 1202 and tplacap.instrumentocdetalle = tinv.instrumentocdetalle and tplacap.procesoccatalogo = 1220 and tplacap.procesocdetalle = 'RECUP' and tplacap.centrocostoccatalogo = 1002 and tplacap.centrocostocdetalle = tinv.centrocostocdetalle and tplacap.rubroccatalogo = 1219 and tplacap.rubrocdetalle = 'INT') PlantillaInteres,(select MAX(tplaban.cinvplantillacontable) from tinvplantillacontable tplaban where tplaban.entidadccatalogo = 1224 and tplaban.entidadcdetalle = tinv.bancocdetalle and tplaban.instrumentoccatalogo = 1202 and tplaban.instrumentocdetalle = tinv.instrumentocdetalle and tplaban.procesoccatalogo = 1220 and tplaban.procesocdetalle = 'RECUP' and tplaban.centrocostoccatalogo = 1002 and tplaban.centrocostocdetalle = tinv.centrocostocdetalle and tplaban.rubroccatalogo = 1219 and tplaban.rubrocdetalle = 'BANCOS') PlantillaBancos,tinv.emisorcdetalle, tinv.centrocostocdetalle, tinv.bancocdetalle, tinv.fcompra, tinvtabamo.cinvtablaamortizacion, tinvtabamo.comentariomoradev, tinvtabamo.comentariosdevolucion, tinv.cinversion, tinvtabamo.finicio tabamo_fechainicio, case when tinv.instrumentocdetalle = 'CDP' or tinv.instrumentocdetalle = 'PA' then tinv.plazo when tinv.calendarizacioncdetalle = '360' and tinv.instrumentocdetalle in ('OBLIGA', 'TITULA', 'VALTIT') and tinvtabamo.plazo < 370 then case when tinvtabamo.plazo between 23 and 39 then 30 when tinvtabamo.plazo between 53 and 69 then 60 when tinvtabamo.plazo between 83 and 99 then 90 when tinvtabamo.plazo between 113 and 129 then 120 when tinvtabamo.plazo between 143 and 159 then 150 when tinvtabamo.plazo between 173 and 189 then 180 when tinvtabamo.plazo between 203 and 219 then 210 when tinvtabamo.plazo between 233 and 249 then 240 when tinvtabamo.plazo between 263 and 279 then 270 when tinvtabamo.plazo between 293 and 309 then 300 when tinvtabamo.plazo between 323 and 339 then 330 when tinvtabamo.plazo between 353 and 369 then 360 else tinvtabamo.plazo end  else case when tinv.calendarizacioncdetalle = '360' then dbo.sp_InvConRestaDias360(cast(str(tinvtabamo.finicio, 8) as date), cast(str(tinvtabamo.fvencimiento, 8) as date)) else DATEDIFF(D, str(tinvtabamo.finicio, 8), str(tinvtabamo.fvencimiento, 8)) end end tabamo_plazo360, tinvtabamo.valorcancelado tabamo_valorcancelado, tinvtabamo.fvencimiento tabamo_fechavencimiento, DATEDIFF(D, str(tinvtabamo.finicio, 8), str(tinvtabamo.fvencimiento, 8)) tabamo_plazo, (isnull(tinvtabamo.proyeccioncapital, 0)-isnull(tinvtabamo.diferenciainteresimplicito,0)) tabamo_capital, isnull(tinvtabamo.proyeccioninteres, 0) tabamo_interes, tinvtabamo.proyecciontasa tabamo_tasa, isnull(tinvtabamo.valormora, 0) tabamo_mora, isnull(tinvtabamo.proyeccioncapital, 0) + isnull(tinvtabamo.proyeccioninteres, 0) + isnull(tinvtabamo.valormora, 0) tabamo_subtotal, tdetemi.nombre emisor, tins.nombre instrumento, tinv.instrumentocdetalle instrumentocodigo, tinv.valornominal, tinv.valorefectivo, tdetclainv.nombre clasificacioninversion, (select isnull(SUM(tinvtabamo_int.proyeccioninteres), 0) from tinvtablaamortizacion tinvtabamo_int where tinvtabamo_int.cinversion = tinv.cinversion) interesbasadoenvalornominal, (select isnull(MAX(tinvtabamo_fven.fvencimiento), 0) from tinvtablaamortizacion tinvtabamo_fven where tinvtabamo_fven.cinversion = tinv.cinversion) fvencimiento, tdetest.nombre estado from tinvinversion tinv left outer join tgencatalogodetalle tdetclainv on tinv.clasificacioninversionccatalogo = tdetclainv.ccatalogo and tinv.clasificacioninversioncdetalle = tdetclainv.cdetalle left outer join tgencatalogodetalle tdetemi on tinv.emisorccatalogo = tdetemi.ccatalogo and tinv.emisorcdetalle = tdetemi.cdetalle left outer join tgencatalogodetalle tins on tinv.instrumentoccatalogo = tins.ccatalogo and tinv.instrumentocdetalle = tins.cdetalle left outer join tgencatalogodetalle tdetest on tinv.estadoccatalogo = tdetest.ccatalogo and tinv.estadocdetalle = tdetest.cdetalle left outer join tinvtablaamortizacion tinvtabamo on tinvtabamo.cinversion = tinv.cinversion where tinv.tasaclasificacioncdetalle = 'FIJA' and tinvtabamo.fvencimiento between " +
                rqconsulta.Mdatos["finicial"].ToString().Trim() +
                " and " +
                rqconsulta.Mdatos["ffinal"].ToString().Trim() +
                " and tinv.estadocdetalle = 'APR' AND isnull(tinvtabamo.mora,0) in (0, 2)) a order by a.fvencimiento, a.cinversion";
            }
            else
            {
                string lCuotaUnica = " inner join (select inv.cinversion cinversion1, min(tabamo.fvencimiento) fvencimiento1 from tinvinversion inv inner join tinvtablaamortizacion tabamo on inv.cinversion = tabamo.cinversion where " +
                    lcInversion[1] +
                    lstrIncluyePagados + " group by inv.cinversion) b on b.cinversion1 = a.cinversion and b.fvencimiento1 = a.tabamo_fechavencimiento ";

                lSQL = "select case when a.fsistema <= a.fvencimientoCal then DATEDIFF(d, STR(a.fsistema,8), STR(a.fvencimientoCal,8)) + 1 else DATEDIFF(d, STR(a.fvencimientoCal,8), STR(a.fsistema,8)) end Dias, a.*, case when a.PlantillaCapital IS NOT NULL OR a.PlantillaInteres IS NOT NULL OR a.PlantillaBancos IS NOT NULL THEN '' ELSE case when a.PlantillaCapital IS NULL THEN 'Parametrice la cuenta contable para el Capital.' else '' end + case when a.PlantillaCapital IS NULL THEN ' ' else '' end + case when a.PlantillaInteres IS NULL THEN 'Parametrice la cuenta contable para el Interés.' else '' end + case when a.PlantillaCapital IS NULL OR a.PlantillaInteres IS NULL THEN ' ' else '' end + case when a.PlantillaBancos IS NULL THEN 'Parametrice la cuenta contable para Bancos.' else '' end END mensaje from (select " +
                    "(select nombre from tgencatalogodetalle tcd where tcd.ccatalogo = tinvtabamo.estadoccatalogo and tcd.cdetalle = tinvtabamo.estadocdetalle) tabamo_estado," +
                    "(select MAX(tplacap.cinvplantillacontable) from tinvplantillacontable tplacap where tplacap.entidadccatalogo = 1213 and tplacap.entidadcdetalle = tinv.emisorcdetalle and tplacap.instrumentoccatalogo = 1202 and tplacap.instrumentocdetalle = tinv.instrumentocdetalle and tplacap.procesoccatalogo = 1220 and tplacap.procesocdetalle = '" +
                    rqconsulta.Mdatos["procesocdetalle"].ToString().Trim() +
                    "' and tplacap.centrocostoccatalogo = 1002 and tplacap.centrocostocdetalle = tinv.centrocostocdetalle and tplacap.rubroccatalogo = 1219 and tplacap.rubrocdetalle = 'CAP') PlantillaCapital,(select MAX(tplacap.cinvplantillacontable) from tinvplantillacontable tplacap where tplacap.entidadccatalogo = 1213 and tplacap.entidadcdetalle = tinv.emisorcdetalle and tplacap.instrumentoccatalogo = 1202 and tplacap.instrumentocdetalle = tinv.instrumentocdetalle and tplacap.procesoccatalogo = 1220 and tplacap.procesocdetalle = '" +
                    rqconsulta.Mdatos["procesocdetalle"].ToString().Trim() +
                    "' and tplacap.centrocostoccatalogo = 1002 and tplacap.centrocostocdetalle = tinv.centrocostocdetalle and tplacap.rubroccatalogo = 1219 and tplacap.rubrocdetalle = 'INT') PlantillaInteres,(select MAX(tplaban.cinvplantillacontable) from tinvplantillacontable tplaban where tplaban.entidadccatalogo = 1224 and tplaban.entidadcdetalle =  tinv.bancocdetalle and tplaban.instrumentoccatalogo = 1202 and tplaban.instrumentocdetalle = tinv.instrumentocdetalle and tplaban.procesoccatalogo = 1220 and tplaban.procesocdetalle = '" +
                    rqconsulta.Mdatos["procesocdetalle"].ToString().Trim() +
                    "' and tplaban.centrocostoccatalogo = 1002 and tplaban.centrocostocdetalle = tinv.centrocostocdetalle and tplaban.rubroccatalogo = 1219 and tplaban.rubrocdetalle = 'BANCOS') PlantillaBancos,tinv.tir,tinv.emisorcdetalle, isnull(tinv.calendarizacioncdetalle,'') calendarizacioncdetalle, isnull(tinv.interestranscurrido,0) interestranscurrido, isnull(tinv.retencionfuentevalor,0) retencionfuentevalor, tinv.centrocostocdetalle, tinv.bancocdetalle, tinv.fcompra, tinv.fpago, tinvtabamo.cinvtablaamortizacion,tinvtabamo.comentariosingreso, tinvtabamo.comentariomoraapr, tinvtabamo.comentariomoradev, tinvtabamo.comentariomoraing, tinvtabamo.comentariosaprobacion, tinvtabamo.comentariosdevolucion	, tinvtabamo.comentariosanulacion, tinv.cinversion,tinv.numerocontrato,isnull(tinv.codigotitulo, '') codigotitulo,tinvtabamo.finicio tabamo_fechainicio," +
                    "case when tinv.instrumentocdetalle = 'CDP' or tinv.instrumentocdetalle = 'PA' then tinv.plazo " +
                    " when tinv.calendarizacioncdetalle = '360' and tinv.instrumentocdetalle in ('OBLIGA','TITULA','VALTIT') and tinvtabamo.plazo < 370 then case when tinvtabamo.plazo between 23 and 39 then 30 when tinvtabamo.plazo between 53 and 69 then 60 when tinvtabamo.plazo between 83 and 99 then 90 when tinvtabamo.plazo between 113 and 129 then 120 when tinvtabamo.plazo between 143 and 159 then 150 when tinvtabamo.plazo between 173 and 189 then 180 when tinvtabamo.plazo between 203 and 219 then 210 when tinvtabamo.plazo between 233 and 249 then 240 when tinvtabamo.plazo between 263 and 279 then 270 when tinvtabamo.plazo between 293 and 309 then 300 when tinvtabamo.plazo between 323 and 339 then 330 when tinvtabamo.plazo between 353 and 369 then 360 else tinvtabamo.plazo end " +
                    " else " +
                    "case when tinv.calendarizacioncdetalle = '360' then dbo.sp_InvConRestaDias360(cast(str(tinvtabamo.finicio,8) as date), cast(str(tinvtabamo.fvencimiento,8) as date)) else DATEDIFF(D, str(tinvtabamo.finicio, 8), str(tinvtabamo.fvencimiento, 8)) end end tabamo_plazo360,tinvtabamo.valorcancelado tabamo_valorcancelado," +
                    "isnull(tinvtabamo.diferenciainteresimplicito,0) diferenciainteresimplicito, isnull(tinvtabamo.proyeccioninteres,0) as vintes ,isnull(tinvtabamo.proyeccioncapital,0) as vcapital,  ISNULL(tinvtabamo.acumuladoaccrual,0) acumuladoaccrual,ISNULL(tinvtabamo.interesimplicito,0) interesimplicito, isnull((select count(*) from tinvtablaamortizacion ttab where ttab.cinversion = tinv.cinversion),0) NumeroCuotas, (select max(isnull(ttamort.capitalxamortizar,0)) from tinvtablaamortizacion ttamort where ttamort.cinversion = tinv.cinversion and ttamort.fvencimiento in (select max(tTabAmo.fvencimiento) from tinvtablaamortizacion tTabAmo where tTabAmo.cinversion = tinv.cinversion and tTabAmo.fvencimiento < tinvtabamo.fvencimiento)) capitalxamortizar, " +
                    "(YEAR(GETDATE()) * 10000) + (MONTH(GETDATE()) * 100) + CASE WHEN tinv.calendarizacioncdetalle = 360 AND DAY(GETDATE()) > 31 THEN 30 ELSE DAY(GETDATE()) END fsistema, (YEAR(CAST(STR(tinvtabamo.fvencimiento,8) AS DATE)) * 10000) + (MONTH(CAST(STR(tinvtabamo.fvencimiento,8) AS DATE)) * 100) + CASE WHEN tinv.calendarizacioncdetalle = 360 AND DAY(CAST(STR(tinvtabamo.fvencimiento,8) AS DATE)) > 31 THEN 30 ELSE DAY(CAST(STR(tinvtabamo.fvencimiento,8) AS DATE)) END fvencimientoCal," +
                    "tinvtabamo.fvencimiento tabamo_fechavencimiento, DATEDIFF(D, str(tinvtabamo.finicio, 8), str(tinvtabamo.fvencimiento, 8)) tabamo_plazo,(isnull(tinvtabamo.proyeccioncapital,0)-isnull(tinvtabamo.diferenciainteresimplicito,0)) tabamo_capital, " +
                    "isnull(tinvtabamo.interesimplicito,tinvtabamo.proyeccioninteres)" +
                    " tabamo_interes, tinvtabamo.proyecciontasa tabamo_tasa, isnull(tinvtabamo.valormora,0) tabamo_mora, (isnull(tinvtabamo.proyeccioncapital, 0)-isnull(tinvtabamo.diferenciainteresimplicito,0)) +isnull(tinvtabamo.interesimplicito, tinvtabamo.proyeccioninteres) + isnull(tinvtabamo.valormora, 0) tabamo_subtotal,tdetemi.nombre emisor,tins.nombre instrumento, tinv.instrumentocdetalle instrumentocodigo, tinv.valornominal,tinv.valornegociacion,tinv.valorefectivo,tinv.plazo,tinv.tasa,tinv.yield,tdetclainv.nombre clasificacioninversion, tinv.observaciones, tinv.observacionespagos, tinv.comisionbolsavalores,tinv.comisionoperador,tinv.comisionretencion,isnull(tinv.comisionbolsavalores, 0) + isnull(tinv.comisionoperador, 0) - isnull(tinv.comisionretencion, 0) comisiontotal,tinv.fcolocacion,tinv.fregistro,tinv.femision,tagebol.identificacion agentebolsaRUC, tagebol.nombres agentebolsanombres, tagebol.direccion agentebolsadireccion, tagebol.telefono01 agentebolsatelefono01," +
                    "(select isnull(SUM(tinvtabamo_int.interesimplicito), SUM(tinvtabamo_int.proyeccioninteres)) from tinvtablaamortizacion tinvtabamo_int where tinvtabamo_int.cinversion = tinv.cinversion) " +
                    "interesbasadoenvalornominal,(select isnull(MAX(tinvtabamo_fven.fvencimiento), 0) from tinvtablaamortizacion tinvtabamo_fven where tinvtabamo_fven.cinversion = tinv.cinversion) fvencimiento,isnull(cast(tinv.plazo / case when tinv.calendarizacioncdetalle is null then 365 else cast(left(tinv.calendarizacioncdetalle, 3) as int) end as int), 0) diasley,tdetcomcup.nombre compracupon, tdetforaju.nombre formaajusteinteres, tdetsec.nombre sector, tdetsis.nombre sistemacolocacion, tdetest.nombre estado from tinvinversion tinv left outer join tgencatalogodetalle tdettas on tinv.tasaclasificacionccatalogo = tdettas.ccatalogo and tinv.tasaclasificacioncdetalle = tdettas.cdetalle " +
                    "left outer join tinvagentebolsa tagebol on tagebol.cinvagentebolsa = tinv.cinvagentebolsa " +
                    "left outer join tinvoperadorinstitucional topeins on topeins.cinvoperadorinstitucional = tinv.cinvoperadorinstitucional " +
                    "left outer join tgencatalogodetalle tdetbolval on tinv.bolsavaloresccatalogo = tdetbolval.ccatalogo and tinv.bolsavalorescdetalle = tdetbolval.cdetalle left outer join tgencatalogodetalle tdetcalend on tinv.calendarizacionccatalogo = tdetcalend.ccatalogo and tinv.calendarizacioncdetalle = tdetcalend.cdetalle left outer join tgencatalogodetalle tdetcalrie on tinv.calificacionriesgoinicialccatalogo = tdetcalrie.ccatalogo and tinv.calificacionriesgoinicialcdetalle = tdetcalrie.cdetalle left outer join tgencatalogodetalle tdetcalrieact on tinv.calificacionriesgoactualccatalogo = tdetcalrieact.ccatalogo and tinv.calificacionriesgoactualcdetalle = tdetcalrieact.cdetalle left outer join tgencatalogodetalle tdetcasval on tinv.casavaloresccatalogo = tdetcasval.ccatalogo and tinv.casavalorescdetalle = tdetcasval.cdetalle left outer join tgencatalogodetalle tdetclainv on tinv.clasificacioninversionccatalogo = tdetclainv.ccatalogo and tinv.clasificacioninversioncdetalle = tdetclainv.cdetalle left outer join tgencatalogodetalle tdetcomcup on tinv.compracuponccatalogo = tdetcomcup.ccatalogo and tinv.compracuponcdetalle = tdetcomcup.cdetalle left outer join tgencatalogodetalle tdetemi on tinv.emisorccatalogo = tdetemi.ccatalogo and tinv.emisorcdetalle = tdetemi.cdetalle left outer join tgencatalogodetalle tins on tinv.instrumentoccatalogo = tins.ccatalogo and tinv.instrumentocdetalle = tins.cdetalle  left outer join tgencatalogodetalle tdetforaju on tinv.formaajusteinteresccatalogo = tdetforaju.ccatalogo and tinv.formaajusteinterescdetalle = tdetforaju.cdetalle left outer join tgencatalogodetalle tdetins on tinv.instrumentoccatalogo = tdetins.ccatalogo and tinv.instrumentocdetalle = tdetins.cdetalle left outer join tgencatalogodetalle tdetmer on tinv.mercadotipoccatalogo = tdetmer.ccatalogo and tinv.mercadotipocdetalle = tdetmer.cdetalle left outer join tgencatalogodetalle tdetmon on tinv.monedaccatalogo = tdetmon.ccatalogo and tinv.monedacdetalle = tdetmon.cdetalle left outer join tgencatalogodetalle tdetpercap on tinv.periodicidadpagoscapitalccatalogo = tdetpercap.ccatalogo and tinv.periodicidadpagoscapitalcdetalle = tdetpercap.cdetalle left outer join tgencatalogodetalle tdetperint on tinv.periodicidadpagosinteresccatalogo = tdetperint.ccatalogo and tinv.periodicidadpagosinterescdetalle = tdetperint.cdetalle left outer join tgencatalogodetalle tdetpor on tinv.portafolioccatalogo = tdetpor.ccatalogo and tinv.portafoliocdetalle = tdetpor.cdetalle left outer join tgencatalogodetalle tdetsec on tinv.sectorccatalogo = tdetsec.ccatalogo and tinv.sectorcdetalle = tdetsec.cdetalle left outer join tgencatalogodetalle tdetsis on tinv.sistemacolocacionccatalogo = tdetsis.ccatalogo and tinv.sistemacolocacioncdetalle = tdetsis.cdetalle left outer join tgencatalogodetalle tdetest on tinv.estadoccatalogo = tdetest.ccatalogo and tinv.estadocdetalle = tdetest.cdetalle left outer join tinvtablaamortizacion tinvtabamo on tinvtabamo.cinversion = tinv.cinversion left outer join tconcomprobante tcon ON tcon.ccomprobante = tinv.ccomprobante left outer join tgencatalogodetalle tdetdiaint on tinv.basediasinteresccatalogo = tdetdiaint.ccatalogo and tinv.basediasinterescdetalle = tdetdiaint.cdetalle where " +
                    lcInversion[0] +
                    lwhereAdicional +
                    ") a " +
                    lCuotaUnica +
                    " order by a.fvencimiento,a.cinversion";

            }


            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);
            ch.registrosporpagina = 1000000;
            IList<Dictionary<string, object>> listaCuotas = ch.GetRegistrosDictionary();

            return listaCuotas;

        }

        private static string SqlMaxPkMasUno = "select ISNULL(max(cinversion),0) + 1 cInversion from tinvinversion";

        /// <summary>
        /// Obtener el máximo identificador de la inversión, más uno.
        /// </summary>
        /// <returns>long</returns>
        public static long GetcInversion()
        {

            tinvinversion fc = new tinvinversion();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("cInversion");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlMaxPkMasUno);
                fc = (tinvinversion)ch.GetRegistro("tinvinversion", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0001", "'ERROR AL GENERAR CIDINVERSION");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }


        private static string SqlMaxInvHis = "select ISNULL(max(cinversionhis),0) + 1 cinversionhis from tinvinversionhis";

        /// <summary>
        /// Obtener el máximo identificador del histórico de inversiones, más uno.
        /// </summary>
        /// <returns>long</returns>
        public static long GetcInversionHis()
        {

            tinvinversionhis fc = new tinvinversionhis();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("cinversionhis");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlMaxInvHis);
                fc = (tinvinversionhis)ch.GetRegistro("tinvinversionhis", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0019", "ERROR AL GENERAR CINVERSIONHIS");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }


        private static string SqlMaxInvTabHis = "select ISNULL(max(cinvtablaamortizacionhis),0) + 1 cinvtablaamortizacionhis from tinvtablaamortizacionhis";

        /// <summary>
        /// Obtener el máximo identificador del histórico de la tabla de amortización, más uno.
        /// </summary>
        /// <returns>long</returns>
        public static long GetcInversionTabHis()
        {


            tinvtablaamortizacionhis fc = new tinvtablaamortizacionhis();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("cinvtablaamortizacionhis");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlMaxInvTabHis);
                fc = (tinvtablaamortizacionhis)ch.GetRegistro("tinvtablaamortizacionhis", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0020", "ERROR AL GENERAR CINVTABLAAMORTIZACIONHIS");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }



        private static string SqlMaxPkMasUnoTabAmo = "select ISNULL(max(cinvtablaamortizacion),0) + 1 cinvtablaamortizacion from tinvtablaamortizacion";

        /// <summary>
        /// Obtener el máximo identificador de la tabla de amortización, más uno.
        /// </summary>
        /// <returns>long</returns>
        public static long GetcInvTablaAmortizacion()
        {

            tinvtablaamortizacion fc = new tinvtablaamortizacion();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("cinvtablaamortizacion");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlMaxPkMasUnoTabAmo);
                fc = (tinvtablaamortizacion)ch.GetRegistro("tinvtablaamortizacion", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0001", "'ERROR AL GENERAR CIDINVERSION");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }

        /// <summary>
        /// Obtener el código de título por título e inversión.
        /// </summary>
        /// <param name="iCodigotitulo">Código de título.</param>
        /// <param name="cInversion">Identificador de la inversión.</param>
        /// <returns>string</returns>
        public static string FindCodigoTitulo(string iCodigotitulo, long cInversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvinversion> control = null;

            control = contexto.tinvinversion.AsNoTracking().Where(x => x.codigotitulo == iCodigotitulo.Trim() && x.cinversion != cInversion && 
                (x.instrumentocdetalle.Equals("OBLIGA") || x.instrumentocdetalle.Equals("VALTIT") || x.instrumentocdetalle.Equals("TITULA") || x.instrumentocdetalle.Equals("INVHIP"))).ToList();
            if (control.Count == 0)
            {
                return "";
            }
            return iCodigotitulo;
        }

        /// <summary>
        /// Obtener el código de título por título, inversión e instrumento.
        /// </summary>
        /// <param name="iCodigotitulo">Código de título.</param>
        /// <param name="cInversion">Identificador de la inversión.</param>
        /// <param name="iinstrumentocdetalle">Identificador del instrumento financiero.</param>
        /// <returns>string</returns>
        public static string FindCodigoTituloPorInst(string iCodigotitulo, long cInversion, string iinstrumentocdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvinversion> control = null;

            control = contexto.tinvinversion.AsNoTracking().Where(x => x.codigotitulo == iCodigotitulo.Trim() && x.instrumentocdetalle.Equals(iinstrumentocdetalle) && x.cinversion != cInversion).ToList();
            if (control.Count == 0)
            {
                return "";
            }
            return iCodigotitulo;
        }

        /// <summary>
        /// Obtener los nombres de un agente de bolsa.
        /// </summary>
        /// <param name="cinvagentebolsa">Identificador del agente de bolsa.</param>
        /// <returns>string</returns>
        public static string FindAgenteRazonSocial(long cinvagentebolsa)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvagentebolsa> control = null;

            control = contexto.tinvagentebolsa.AsNoTracking().Where(x =>  x.cinvagentebolsa == cinvagentebolsa).ToList();
            if (control.Count == 0)
            {
                return "";
            }
            return control[0].nombres;
        }

        /// <summary>
        /// Obtener el identificador del método de calendarización de una inversión.
        /// </summary>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <returns>string</returns>
        public static string FindCalendarizacioncdetalle(long icinversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvinversion> control = null;

            control = contexto.tinvinversion.AsNoTracking().Where(x => x.cinversion == icinversion).ToList();
            if (control.Count == 0)
            {
                return "";
            }
            return control[0].calendarizacioncdetalle;
        }

        /// <summary>
        /// Obtener una inversión, dado su identificador.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>tinvinversion</returns>
        public static tinvinversion FindxEmisor(int ccatalogo, string cdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvinversion obj;
            obj = contexto.tinvinversion.Where(x => x.emisorccatalogo == ccatalogo && x.emisorcdetalle.Equals(cdetalle)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }



        /// <summary>
        /// Obtener una inversión, dado su identificador.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>tinvinversion</returns>
        public static tinvinversion Find(long cinversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvinversion obj;
            obj = contexto.tinvinversion.Where(x => x.cinversion.Equals(cinversion)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }


        private static string DELET = "delete tinvcontabilizacion where cinversion = @cinversion ";

        /// <summary>
        /// Elimina un registro de la tabla tgencatalogodetalle, dado su identificador y el identificador del catálogo.
        /// </summary>
        /// <param name="istrcdetalle">Identificador del detalle del catálogo.</param>
        /// <param name="iccatalogo">Identificador del catálogo.</param>
        /// <returns></returns>
        public static void DeleteContabiliza(long icinversion = -1)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELET,
                new SqlParameter("cinversion", icinversion));
        }


        /// <summary>
        /// Actualizar el estado de un dividendo de una inversión, a pagado.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>tinvinversion</returns>
        public static tinvinversion actualizaEstadoPagada(long cinversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvinversion obj;
            obj = contexto.tinvinversion.Where(x => x.cinversion.Equals(cinversion)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);

                obj.estadocdetalle = "PAG";

                Sessionef.Actualizar(obj);

            }
            return obj;
        }

        /// <summary>
        /// Dadas las fechas de inicio y fin, obtener su diferencia en años.
        /// </summary>
        /// <param name="iDateMayor">Fecha final.</param>
        /// <param name="iDateMenor">Fecha inicial.</param>
        /// <returns>long</returns>
        public static long FindValidarContabilidad(DateTime iDateMayor, DateTime iDateMenor)
        {


            long llngFechaMayor = (iDateMayor.Year * 10000) + (iDateMayor.Month * 100) + iDateMayor.Day;

            long llngFechaMenor = (iDateMenor.Year * 10000) + (iDateMenor.Month * 100) + iDateMenor.Day;

            string lSql = "select ISNULL(DATEDIFF(YY,'" + llngFechaMenor.ToString().Trim() + "','" + llngFechaMayor.ToString().Trim() + "'),0) Anios";

            tinvinversion fc = new tinvinversion();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("Anios");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
                fc = (tinvinversion)ch.GetRegistro("tinvinversion", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0001", "'ERROR AL GENERAR CIDINVERSION");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }

        /// <summary>
        /// Obtener el concepto contable.
        /// </summary>
        /// <param name="istrOperacion">Identificador de la operación.</param>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>string</returns>
        public static string FindConceptoContable(string istrOperacion, long cinversion, int fconatable)//RNI 20240829
        {

            string lSql = "select '" + istrOperacion + " DE ' + ins.nombre + ' No. ' + rtrim(ltrim(cast(cinversion as varchar(30)))) + ' A ' + emi.nombre + isnull('. CON FECHA ' + cast(cast(str(" + fconatable + ",8) as date) as varchar(max)) + '.','') Concepto from tinvinversion i inner join tgencatalogodetalle ins on ins.ccatalogo = i.instrumentoccatalogo and ins.cdetalle = i.instrumentocdetalle inner join tgencatalogodetalle emi on emi.ccatalogo = i.emisorccatalogo and emi.cdetalle = i.emisorcdetalle where i.cinversion = " +
                cinversion.ToString();

            tinvinversion fc = new tinvinversion();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("Concepto");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
                fc = (tinvinversion)ch.GetRegistro("tinvinversion", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0001", "'ERROR AL GENERAR CIDINVERSION");
            }

            return fc.Mdatos.Values.ElementAt(0).ToString();

        }

        /// <summary>
        /// Obtener un registro de la tabla de amortización.
        /// </summary>
        /// <param name="cinvtablaamortizacion">Identificador de la tabla de amortización.</param>
        /// <returns>tinvtablaamortizacion</returns>
        public static tinvtablaamortizacion FindTablaAmortiza(long cinvtablaamortizacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvtablaamortizacion obj;
            obj = contexto.tinvtablaamortizacion.Where(x => x.cinvtablaamortizacion.Equals(cinvtablaamortizacion)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Dadas las fechas de inicio y fin, obtener su diferencia en años.
        /// </summary>
        /// <param name="iDateMayor">Fecha final.</param>
        /// <param name="iDateMenor">Fecha inicial.</param>
        /// <returns>long</returns>
        public static long DateDiferencia(DateTime iDateMayor, DateTime iDateMenor)
        {

            long llngFechaMayor = (iDateMayor.Year * 10000) + (iDateMayor.Month * 100) + iDateMayor.Day;

            long llngFechaMenor = (iDateMenor.Year * 10000) + (iDateMenor.Month * 100) + iDateMenor.Day;

            string lSql = "select ISNULL(DATEDIFF(YY,'" + llngFechaMenor.ToString().Trim() + "','" + llngFechaMayor.ToString().Trim() + "'),0) Anios";

            tinvinversion fc = new tinvinversion();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("Anios");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
                fc = (tinvinversion)ch.GetRegistro("tinvinversion", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0001", "'ERROR AL GENERAR CIDINVERSION");
            }

            return long.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }

        /// <summary>
        /// Obtener la tabla de amortización.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns>List<tTablaAmortizacion></returns>
        public static List<tTablaAmortizacion> GetTablaAmortiza(RqConsulta rqconsulta)
        {

            long lPlazo = long.Parse(rqconsulta.Mdatos["plazo"].ToString());

            List<tTablaAmortizacion> tTablaPagos = new List<tTablaAmortizacion>();

            tTablaPagos = GeneraTablaPagos(rqconsulta, lPlazo);

            DateTime lfinicio = new DateTime();
            lfinicio = DateTime.Parse(rqconsulta.Mdatos["fcolocacion"].ToString());

            double lFactorDiario = (double)Math.Pow(1 + (double.Parse(rqconsulta.Mdatos["tasa"].ToString()) / 100), (1 / double.Parse(rqconsulta.Mdatos["calendarizacion"].ToString()))) - 1;

            long lNumeroCuota = 0;
            double monto = double.Parse(rqconsulta.Mdatos["valornominal"].ToString());
            double capital = monto;

            double interes = 0;

            List<tTablaAmortizacion> tTablaDiaria = new List<tTablaAmortizacion>();

            int lIndice = 0;

            double lTotalInteres = 0;

            while (lNumeroCuota < lPlazo)
            {

                if (lNumeroCuota != 0)
                {
                    monto = monto + interes;
                }

                interes = monto * lFactorDiario;

                lTotalInteres = lTotalInteres + interes;

                if (tTablaPagos[lIndice].nfvencimiento == lfinicio.AddDays(1))
                {
                    tTablaPagos[lIndice].proyeccioninteres = (decimal)lTotalInteres;

                    tTablaPagos[lIndice].total = tTablaPagos[lIndice].proyeccioncapital + tTablaPagos[lIndice].proyeccioninteres;

                    lTotalInteres = 0;
                    lIndice++;
                }

                lfinicio = lfinicio.AddDays(1);

                lNumeroCuota++;
            }

            if (lIndice < tTablaPagos.Count)
            {
                tTablaPagos[lIndice].proyeccioninteres = (decimal)lTotalInteres;
                tTablaPagos[lIndice].total = tTablaPagos[lIndice].proyeccioncapital + tTablaPagos[lIndice].proyeccioninteres;
            }

            CompletaTablaPagos(ref tTablaPagos, rqconsulta, lPlazo);

            return tTablaPagos;

        }

        /// <summary>
        /// Obtener un registro de la tabla de amortización.
        /// </summary>
        /// <param name="cinvtablaamortizacion">Identificador de la tabla de amortización.</param>
        /// <returns>tinvtablaamortizacion</returns>
        public static tinvtablaamortizacion FindTInvTablaAmortizacion(long cinvtablaamortizacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvtablaamortizacion obj;
            obj = contexto.tinvtablaamortizacion.Where(x => x.cinvtablaamortizacion.Equals(cinvtablaamortizacion)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
        //CCA 20240318
        public static string FindTSector(string emisorcdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            string sector = "";
            tinvemisordetalle obj;
            obj = contexto.tinvemisordetalle.Where(x => x.emisorcdetalle.Equals(emisorcdetalle)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
                sector = obj.enticalificadoracdetalle;
            }
            return sector;
        }

        /// <summary>
        /// Obtener una inversión.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns>List<tInversion></returns>
        public static List<tInversion> GetInversion(RqConsulta rqconsulta)
        {

            //decimal? lcapitaldiferencia = null;
            //tinvinversionhis tinvHis = new tinvinversionhis();
            //tinvHis = TinvInversionHisDal.FindCInversion((long)rqconsulta.Mdatos["cinversion"]);

            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();

            string lSQL = "select isnull(interesvalornominal,0) interesvalornominal, isnull(interesporvencer,0) interesporvencer, isnull(saldocapital,0) saldocapital, isnull(saldointeres,0) saldointeres, isnull(diasvalornominal,0) diasvalornominal, isnull(plazorealxvencer,0) plazorealxvencer, isnull(diastranscurridosinteres,0) diastranscurridosinteres, isnull(invhis.fsistema,0) fsistema, isnull(invhis.interesanterior,0) interesanterior, isnull(invhis.capitalanterior,0) capitalanterior, isnull(invhis.interesnuevo,0) interesnuevo, isnull(invhis.capitalnuevo,0) capitalnuevo, isnull(invhis.interesdiferencia,0) interesdiferencia, isnull(invhis.capitaldiferencia,0) capitaldiferencia, str(invhis.capitaldiferencia,30,10) capitaldiferenciaStr, isnull(invhis.tasanueva,0) tasanueva, isnull(tinv.cinversionhisultimo,0) cinversionhisultimo, tinv.bancopagoccatalogo, tinv.bancopagocdetalle, tinv.comentariospago, tinv.comentariosingreso ,tinv.comentariosaprobacion ,tinv.comentariosanulacion ,tinv.comentariosdevolucion, isnull(tinv.retencionfuentevalor,0) retencionfuentevalor, isnull(tinv.porcentajebolsa,0) porcentajebolsa, isnull(tinv.porcentajeoperador,0) porcentajeoperador, isnull(tinv.porcentajeretencion,0) porcentajeretencion, tc.ccomprobanteanulacion,isnull(tc.fcontable,0) fcontable, isnull(tc.ccompania,0) ccompania,isnull((select sum(ta.proyeccioninteres) interes from tinvtablaamortizacion ta where ta.cinversion = tinv.cinversion),0) as interes, " +
                "tinvagebol.nombrescontacto nombresagente, tgenopeins.nombre nombresoperadorinst, tinv.cinversion,tinv.tasaclasificacionccatalogo, tinv.tasaclasificacioncdetalle,tinv.ccomprobante, tinv.optlock, tinv.codigotitulo, ISNULL(tinv.numerocontrato,'') numerocontrato, tinv.fcolocacion, tinv.fregistro, tinv.fcompra, tinv.fpago, tinv.femision,tinv.fvencimiento, tinv.fultimopago, tinv.fpagoultimocupon, tinv.fultimacompra, " +
                "tinv.cinvagentebolsa, tinv.cinvoperadorinstitucional, tinv.valornominal, tinv.valornegociacion, tinv.valorefectivo, tinv.plazo, tinv.tasa, tinv.diasgraciacapital, tinv.diasgraciainteres, tinv.diasporvencerafechacompra, tinv.boletin, tinv.cotizacion, tinv.yield,tinv.comisionbolsavalores, tinv.comisionoperador, tinv.comisionretencion, tinv.porcentajecalculoprecio, tinv.tir, tinv.porcentajecalculodescuento, tinv.porcentajecalculorendimiento, tinv.interestranscurrido, tinv.porcentajepreciocompra, tinv.porcentajeprecioultimacompra,tinv.preciounitarioaccion, tinv.numeroacciones, tinv.valoracciones, tinv.preciocompra, tinv.valordividendospagados, tinv.porcentajeparticipacioncupon, tinv.tasainterescupon, tinv.observaciones, tinv.observacionespagos, tinv.bolsavaloresccatalogo,tinv.bolsavalorescdetalle,tinv.calendarizacionccatalogo, tinv.calendarizacioncdetalle,tinv.basediasinterescdetalle,tinv.calificacionriesgoinicialccatalogo, tinv.calificacionriesgoinicialcdetalle,tinv.calificacionriesgoactualccatalogo, tinv.calificacionriesgoactualcdetalle,tinv.casavaloresccatalogo, tinv.casavalorescdetalle,tinv.clasificacioninversionccatalogo, tinv.clasificacioninversioncdetalle,tinv.compracuponccatalogo, tinv.compracuponcdetalle,tinv.aceptanteccatalogo,tinv.aceptantecdetalle,tinv.emisorccatalogo, tinv.emisorcdetalle,tinv.formaajusteinteresccatalogo, tinv.formaajusteinterescdetalle,tinv.instrumentoccatalogo, tinv.instrumentocdetalle,tinv.mercadotipoccatalogo, tinv.mercadotipocdetalle,tinv.monedaccatalogo, tinv.monedacdetalle,tinv.periodicidadpagoscapitalccatalogo, tinv.periodicidadpagoscapitalcdetalle,tinv.periodicidadpagosinteresccatalogo, tinv.periodicidadpagosinterescdetalle,tinv.portafolioccatalogo, tinv.portafoliocdetalle,tinv.sectorccatalogo, tinv.sectorcdetalle,tinv.sistemacolocacionccatalogo, tinv.sistemacolocacioncdetalle, tinv.bancoccatalogo, tinv.bancocdetalle,  tinv.estadoccatalogo, tinv.estadocdetalle,tinv.cusuarioing, cast(tinv.fingreso as date) fingreso,tinv.cusuariomod, cast(tinv.fmodificacion as date) fmodificacion, cast(str(tinv.fcolocacion,8) as date) nfcolocacion, cast(str(tinv.fregistro,8) as date) nfregistro, cast(str(tinv.fcompra,8) as date) nfcompra, cast(str(tinv.fpago,8) as date) nfpago, cast(str(tinv.femision,8) as date) nfemision, cast(str(tinv.fvencimiento,8) as date) nfvencimiento, cast(str(tinv.fultimopago,8) as date) nfultimopago, cast(str(tinv.fpagoultimocupon,8) as date) nfpagoultimocupon, cast(str(tinv.fultimacompra,8) as date) nfultimacompra, tinv.centrocostoccatalogo, tinv.centrocostocdetalle, case when cast((select max(tc.fingreso) fcontable from tconcomprobante tc where tc.ccomprobante = tinv.ccomprobante) as date) = cast(GETDATE() as date) then 1 else 0 end PermiteAnular " +
                "FROM tinvinversion AS tinv " + 
                "left outer join tinvagentebolsa tinvagebol on tinvagebol.cinvagentebolsa = tinv.cinvagentebolsa " +
                "left outer join tinvoperadorinstitucional topeins on topeins.cinvoperadorinstitucional = tinv.cinvoperadorinstitucional " +
                "left outer join tgencatalogodetalle tgenopeins on tgenopeins.ccatalogo = topeins.bancoscpnccatalogo and tgenopeins.cdetalle = topeins.bancoscpncdetalle " +
                "left outer join tconcomprobante tc on tc.ccomprobante = tinv.ccomprobante left outer join (select invhis.cinversionhis, max(invhis.fsistema) fsistema, max(invhis.interesanterior) interesanterior, max(invhis.capitalanterior) capitalanterior, max(invhis.interesnuevo) interesnuevo, max(invhis.capitalnuevo) capitalnuevo, max(invhis.interesdiferencia) interesdiferencia, max(invhis.capitaldiferencia) capitaldiferencia, max(invhis.tasanueva) tasanueva from tinvinversionhis invhis group by cinversionhis) invhis on invhis.cinversionhis = tinv.cinversionhisultimo " +
                "where tinv.cinversion = " +
                rqconsulta.Mdatos["cinversion"];

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> ListaInversion = null;

            ListaInversion = ch.GetRegistroDictionary();

            if (ListaInversion.Count > 0)
            {

                List<tInversion> tInversionClone = new List<tInversion>();

                foreach (var p in ListaInversion)
                {

                    long? lcinversionhisultimo = null;
                    if (p["cinversionhisultimo"] != null) lcinversionhisultimo = int.Parse(p["cinversionhisultimo"].ToString());


                    int? ltasaclasificacionccatalogo = null;
                    if (p["tasaclasificacionccatalogo"] != null) ltasaclasificacionccatalogo = int.Parse(p["tasaclasificacionccatalogo"].ToString());

                    long? loptlock = null;
                    if (p["optlock"] != null) loptlock = int.Parse(p["optlock"].ToString());

                    long? ldiasvalornominal = null;
                    if (p["diasvalornominal"] != null) ldiasvalornominal = int.Parse(p["diasvalornominal"].ToString());

                    long? lplazorealxvencer = null;
                    if (p["plazorealxvencer"] != null) lplazorealxvencer = int.Parse(p["plazorealxvencer"].ToString());

                    long? ldiastranscurridosinteres = null;
                    if (p["diastranscurridosinteres"] != null) ldiastranscurridosinteres = int.Parse(p["diastranscurridosinteres"].ToString());


                    int? lfcolocacion = null;
                    if (p["fcolocacion"] != null) lfcolocacion = int.Parse(p["fcolocacion"].ToString());

                    int? lfregistro = null;
                    if (p["fregistro"] != null) lfregistro = int.Parse(p["fregistro"].ToString());

                    int? lfsistema = null;
                    if (p["fsistema"] != null) lfsistema = int.Parse(p["fsistema"].ToString());


                    int? lfcompra = null;
                    if (p["fcompra"] != null) lfcompra = int.Parse(p["fcompra"].ToString());

                    int? lfpago = null;
                    if (p["fpago"] != null) lfpago = int.Parse(p["fpago"].ToString());

                    int? lfemision = null;
                    if (p["femision"] != null) lfemision = int.Parse(p["femision"].ToString());

                    int? lfvencimiento = null;
                    if (p["fvencimiento"] != null) lfvencimiento = int.Parse(p["fvencimiento"].ToString());

                    int? lfultimopago = null;
                    if (p["fultimopago"] != null) lfultimopago = int.Parse(p["fultimopago"].ToString()); ;

                    int? lfpagoultimocupon = null;
                    if (p["fpagoultimocupon"] != null) lfpagoultimocupon = int.Parse(p["fpagoultimocupon"].ToString()); ;

                    int? lfultimacompra = null;
                    if (p["fultimacompra"] != null) lfultimacompra = int.Parse(p["fultimacompra"].ToString()); ;

                    long? lcinvagentebolsa = null;
                    if (p["cinvagentebolsa"] != null) lcinvagentebolsa = long.Parse(p["cinvagentebolsa"].ToString());

                    long? lcinvoperadorinstitucional = null;
                    if (p["cinvoperadorinstitucional"] != null) lcinvoperadorinstitucional = long.Parse(p["cinvoperadorinstitucional"].ToString());

                    decimal? linteresvalornominal = null;
                    if (p["interesvalornominal"] != null) linteresvalornominal = decimal.Parse(p["interesvalornominal"].ToString());

                    decimal? linteresporvencer = null;
                    if (p["interesporvencer"] != null) linteresporvencer = decimal.Parse(p["interesporvencer"].ToString());

                    decimal? lsaldocapital = null;
                    if (p["saldocapital"] != null) lsaldocapital = decimal.Parse(p["saldocapital"].ToString());

                    decimal? lsaldointeres = null;
                    if (p["saldointeres"] != null) lsaldointeres = decimal.Parse(p["saldointeres"].ToString());

                    // FIN

                    decimal? lvalornominal = null;
                    if (p["valornominal"] != null) lvalornominal = decimal.Parse(p["valornominal"].ToString());

                    decimal? linteresdiferencia = null;
                    if (p["interesdiferencia"] != null) linteresdiferencia = decimal.Parse(p["interesdiferencia"].ToString());

                    decimal? lcapitaldiferencia = null;

                    try
                    {
                        if (p["capitaldiferencia"] != null) lcapitaldiferencia = decimal.Parse(p["capitaldiferencia"].ToString());
                    }
                    catch
                    {
                        string mensaje = null;
                        lcapitaldiferencia = clsValidarDecimal(p["capitaldiferenciaStr"].ToString().Trim(), ref mensaje,numerodecimales: 100,iblnValidaPositivo: false);
                    }


                    //try
                    //{
                    //}
                    //catch
                    //{

                    //    tinvinversionhis tinvHis = new tinvinversionhis();
                    //    tinvHis = TinvInversionHisDal.FindCInversion((long)rqconsulta.Mdatos["cinversion"]);


                    //    string a = "xx";


                    //}

                    decimal? linteres = null;
                    if (p["interes"] != null) linteres = decimal.Parse(p["interes"].ToString());

                    decimal? lvalornegociacion = null;
                    if (p["valornegociacion"] != null) lvalornegociacion = decimal.Parse(p["valornegociacion"].ToString());

                    decimal? lvalorefectivo = null;
                    if (p["valorefectivo"] != null) lvalorefectivo = decimal.Parse(p["valorefectivo"].ToString());

                    decimal? ltasanueva = null;
                    if (p["tasanueva"] != null) ltasanueva = decimal.Parse(p["tasanueva"].ToString());


                    int? lplazo = null;
                    if (p["plazo"] != null) lplazo = int.Parse(p["plazo"].ToString());

                    decimal? ltasa = null;
                    if (p["tasa"] != null) ltasa = decimal.Parse(p["tasa"].ToString());

                    int? ldiasgraciacapital = null;
                    if (p["diasgraciacapital"] != null) ldiasgraciacapital = int.Parse(p["diasgraciacapital"].ToString());

                    int? ldiasgraciainteres = null;
                    if (p["diasgraciainteres"] != null) ldiasgraciainteres = int.Parse(p["diasgraciainteres"].ToString());

                    int? ldiasporvencerafechacompra = null;
                    if (p["diasporvencerafechacompra"] != null) ldiasporvencerafechacompra = int.Parse(p["diasporvencerafechacompra"].ToString());


                    long? lboletin = null;
                    if (p["boletin"] != null) lboletin = int.Parse(p["boletin"].ToString());

                    decimal? lcotizacion = null;
                    if (p["cotizacion"] != null) lcotizacion = decimal.Parse(p["cotizacion"].ToString());

                    decimal? lretencionfuentevalor = null;
                    if (p["retencionfuentevalor"] != null) lretencionfuentevalor = decimal.Parse(p["retencionfuentevalor"].ToString());

                    decimal? lyield = null;
                    if (p["yield"] != null) lyield = decimal.Parse(p["yield"].ToString());

                    decimal? lcomisionbolsavalores = null;
                    if (p["comisionbolsavalores"] != null) lcomisionbolsavalores = decimal.Parse(p["comisionbolsavalores"].ToString());

                    decimal? lcomisionoperador = null;
                    if (p["comisionoperador"] != null) lcomisionoperador = decimal.Parse(p["comisionoperador"].ToString());

                    decimal? lcomisionretencion = null;
                    if (p["comisionretencion"] != null) lcomisionretencion = decimal.Parse(p["comisionretencion"].ToString());

                    decimal? lporcentajecalculoprecio = null;
                    if (p["porcentajecalculoprecio"] != null) lporcentajecalculoprecio = decimal.Parse(p["porcentajecalculoprecio"].ToString());

                    decimal? ltir = null;
                    if (p["tir"] != null) ltir = decimal.Parse(p["tir"].ToString());

                    decimal? lporcentajecalculodescuento = null;
                    if (p["porcentajecalculodescuento"] != null) lporcentajecalculodescuento = decimal.Parse(p["porcentajecalculodescuento"].ToString());

                    decimal? lporcentajecalculorendimiento = null;
                    if (p["porcentajecalculorendimiento"] != null) lporcentajecalculorendimiento = decimal.Parse(p["porcentajecalculorendimiento"].ToString());

                    decimal? linterestranscurrido = null;
                    if (p["interestranscurrido"] != null) linterestranscurrido = decimal.Parse(p["interestranscurrido"].ToString());

                    decimal? lporcentajepreciocompra = null;
                    if (p["porcentajepreciocompra"] != null) lporcentajepreciocompra = decimal.Parse(p["porcentajepreciocompra"].ToString());

                    decimal? lporcentajeprecioultimacompra = null;
                    if (p["porcentajeprecioultimacompra"] != null) lporcentajeprecioultimacompra = decimal.Parse(p["porcentajeprecioultimacompra"].ToString());

                    decimal? lpreciounitarioaccion = null;
                    if (p["preciounitarioaccion"] != null) lpreciounitarioaccion = decimal.Parse(p["preciounitarioaccion"].ToString());

                    decimal? lnumeroacciones = null;
                    if (p["numeroacciones"] != null) lnumeroacciones = decimal.Parse(p["numeroacciones"].ToString());

                    decimal? lvaloracciones = null;
                    if (p["valoracciones"] != null) lvaloracciones = decimal.Parse(p["valoracciones"].ToString());

                    decimal? lpreciocompra = null;
                    if (p["preciocompra"] != null) lpreciocompra = decimal.Parse(p["preciocompra"].ToString());

                    decimal? lvalordividendospagados = null;
                    if (p["valordividendospagados"] != null) lvalordividendospagados = decimal.Parse(p["valordividendospagados"].ToString());

                    decimal? lporcentajeparticipacioncupon = null;
                    if (p["porcentajeparticipacioncupon"] != null) lporcentajeparticipacioncupon = decimal.Parse(p["porcentajeparticipacioncupon"].ToString());

                    decimal? ltasainterescupon = null;
                    if (p["tasainterescupon"] != null) ltasainterescupon = decimal.Parse(p["tasainterescupon"].ToString());

                    decimal? linteresanterior = null;
                    if (p["interesanterior"] != null) linteresanterior = decimal.Parse(p["interesanterior"].ToString());

                    decimal? lcapitalanterior = null;
                    if (p["capitalanterior"] != null) lcapitalanterior = decimal.Parse(p["capitalanterior"].ToString());

                    decimal? linteresnuevo = null;
                    if (p["interesnuevo"] != null) linteresnuevo = decimal.Parse(p["interesnuevo"].ToString());

                    decimal? lcapitalnuevo = null;
                    if (p["capitalnuevo"] != null) lcapitalnuevo = decimal.Parse(p["capitalnuevo"].ToString());

                    int? lbolsavaloresccatalogo = null;
                    if (p["bolsavaloresccatalogo"] != null) lbolsavaloresccatalogo = int.Parse(p["bolsavaloresccatalogo"].ToString());

                    int? lcalendarizacionccatalogo = null;
                    if (p["calendarizacionccatalogo"] != null) lcalendarizacionccatalogo = int.Parse(p["calendarizacionccatalogo"].ToString());

                    int? lcalificacionriesgoinicialccatalogo = null;
                    if (p["calificacionriesgoinicialccatalogo"] != null) lcalificacionriesgoinicialccatalogo = int.Parse(p["calificacionriesgoinicialccatalogo"].ToString());

                    int? lcalificacionriesgoactualccatalogo = null;
                    if (p["calificacionriesgoactualccatalogo"] != null) lcalificacionriesgoactualccatalogo = int.Parse(p["calificacionriesgoactualccatalogo"].ToString());

                    int? lcasavaloresccatalogo = null;
                    if (p["casavaloresccatalogo"] != null) lcasavaloresccatalogo = int.Parse(p["casavaloresccatalogo"].ToString());

                    int? lclasificacioninversionccatalogo = null;
                    if (p["clasificacioninversionccatalogo"] != null) lclasificacioninversionccatalogo = int.Parse(p["clasificacioninversionccatalogo"].ToString());

                    int? lcompracuponccatalogo = null;
                    if (p["compracuponccatalogo"] != null) lcompracuponccatalogo = int.Parse(p["compracuponccatalogo"].ToString());

                    int? lemisorccatalogo = null;
                    if (p["emisorccatalogo"] != null) lemisorccatalogo = int.Parse(p["emisorccatalogo"].ToString());
                    int? laceptanteccatalogo = null;
                    if (p["aceptanteccatalogo"] != null) laceptanteccatalogo = int.Parse(p["aceptanteccatalogo"].ToString());
                    string laceptantecdetalle = null;
                    if (p["aceptantecdetalle"] != null) laceptantecdetalle = (string)p["aceptantecdetalle"].ToString();

                    int? lformaajusteinteresccatalogo = null;
                    if (p["formaajusteinteresccatalogo"] != null) lformaajusteinteresccatalogo = int.Parse(p["formaajusteinteresccatalogo"].ToString());

                    int? linstrumentoccatalogo = null;
                    if (p["instrumentoccatalogo"] != null) linstrumentoccatalogo = int.Parse(p["instrumentoccatalogo"].ToString());

                    int? lbancopagoccatalogo = null;
                    if (p["bancopagoccatalogo"] != null) lbancopagoccatalogo = int.Parse(p["bancopagoccatalogo"].ToString());

                    int? lmercadotipoccatalogo = null;
                    if (p["mercadotipoccatalogo"] != null) lmercadotipoccatalogo = int.Parse(p["mercadotipoccatalogo"].ToString());

                    int? lmonedaccatalogo = null;
                    if (p["monedaccatalogo"] != null) lmonedaccatalogo = int.Parse(p["monedaccatalogo"].ToString());

                    int? lperiodicidadpagoscapitalccatalogo = null;
                    if (p["periodicidadpagoscapitalccatalogo"] != null) lperiodicidadpagoscapitalccatalogo = int.Parse(p["periodicidadpagoscapitalccatalogo"].ToString());

                    int? lperiodicidadpagosinteresccatalogo = null;
                    if (p["periodicidadpagosinteresccatalogo"] != null) lperiodicidadpagosinteresccatalogo = int.Parse(p["periodicidadpagosinteresccatalogo"].ToString());

                    int? lportafolioccatalogo = null;
                    if (p["portafolioccatalogo"] != null) lportafolioccatalogo = int.Parse(p["portafolioccatalogo"].ToString());

                    int? lsectorccatalogo = null;
                    if (p["sectorccatalogo"] != null) lsectorccatalogo = int.Parse(p["sectorccatalogo"].ToString());

                    int? lcentrocostoccatalogo = null;
                    if (p["centrocostoccatalogo"] != null) lcentrocostoccatalogo = int.Parse(p["centrocostoccatalogo"].ToString());

                    int? lsistemacolocacionccatalogo = null;
                    if (p["sistemacolocacionccatalogo"] != null) lsistemacolocacionccatalogo = int.Parse(p["sistemacolocacionccatalogo"].ToString());

                    int? lbancoccatalogo = null;
                    if (p["bancoccatalogo"] != null) lbancoccatalogo = int.Parse(p["bancoccatalogo"].ToString());

                    int? lestadoccatalogo = null;
                    if (p["estadoccatalogo"] != null) lestadoccatalogo = int.Parse(p["estadoccatalogo"].ToString());

                    DateTime? lfmodificacion = null;
                    if (p["fmodificacion"] != null) lfmodificacion = DateTime.Parse(p["fmodificacion"].ToString());

                    DateTime? lnfcolocacion = null;
                    if (p["nfcolocacion"] != null) lnfcolocacion = DateTime.Parse(p["nfcolocacion"].ToString());

                    DateTime? lnfregistro = null;
                    if (p["nfregistro"] != null) lnfregistro = DateTime.Parse(p["nfregistro"].ToString());

                    DateTime? lnfcompra = null;
                    if (p["nfcompra"] != null) lnfcompra = DateTime.Parse(p["nfcompra"].ToString());

                    DateTime? lnfpago = null;
                    if (p["nfpago"] != null) lnfpago = DateTime.Parse(p["nfpago"].ToString());


                    DateTime? lnfemision = null;
                    if (p["nfemision"] != null) lnfemision = DateTime.Parse(p["nfemision"].ToString()); // (DateTime)p["nfemision"];

                    DateTime? lnfvencimiento = null;
                    if (p["nfvencimiento"] != null) lnfvencimiento = DateTime.Parse(p["nfvencimiento"].ToString()); // (DateTime)p["nfvencimiento"];

                    DateTime? lnfultimopago = null;
                    if (p["nfultimopago"] != null) lnfultimopago = DateTime.Parse(p["nfultimopago"].ToString());

                    DateTime? lnfpagoultimocupon = null;
                    if (p["nfpagoultimocupon"] != null) lnfpagoultimocupon = DateTime.Parse(p["nfpagoultimocupon"].ToString());

                    DateTime? lnfultimacompra = null;
                    if (p["nfultimacompra"] != null) lnfultimacompra = DateTime.Parse(p["nfultimacompra"].ToString());

                    string lcodigotitulo = (string)p["codigotitulo"];


                    if (lcodigotitulo != null)
                    {
                        lcodigotitulo = lcodigotitulo.Trim();
                    }

                    string lnumerocontrato = (string)p["numerocontrato"];

                    tInversionClone.Add(
                        new tInversion()
                        {
                            cinversion = (long)p["cinversion"]
                            ,
                            codigotitulo = lcodigotitulo
                            ,
                            numerocontrato = lnumerocontrato.Trim()
                            ,
                            tasaclasificacionccatalogo = ltasaclasificacionccatalogo
                            ,
                            tasaclasificacioncdetalle = (string)p["tasaclasificacioncdetalle"]
                            ,
                            ccomprobante = (string)p["ccomprobante"]
                            ,
                            optlock = loptlock
                            ,
                            fcolocacion = lfcolocacion
                            ,
                            fregistro = lfregistro
                            ,
                            fcompra = lfcompra
                            ,
                            fpago = lfpago
                            ,
                            femision = lfemision
                            ,
                            fvencimiento = lfvencimiento
                            , aceptanteccatalogo = laceptanteccatalogo,
                            aceptantecdetalle= laceptantecdetalle
                            ,
                            fultimopago = lfultimopago
                            ,
                            fpagoultimocupon = lfpagoultimocupon
                            ,
                            fultimacompra = lfultimacompra
                            ,
                            cinvagentebolsa = lcinvagentebolsa
                            ,
                            cinvoperadorinstitucional = lcinvoperadorinstitucional
                            ,
                            valornominal = lvalornominal
                            ,
                            valornegociacion = lvalornegociacion
                            ,
                            valorefectivo = lvalorefectivo
                            ,
                            plazo = lplazo
                            ,
                            tasa = ltasa
                            ,
                            diasgraciacapital = ldiasgraciacapital
                            ,
                            diasgraciainteres = ldiasgraciainteres
                            ,
                            diasporvencerafechacompra = ldiasporvencerafechacompra
                            ,
                            boletin = lboletin
                            ,
                            cotizacion = lcotizacion
                            ,
                            yield = lyield
                            ,
                            comisionbolsavalores = lcomisionbolsavalores
                            ,
                            comisionoperador = lcomisionoperador
                            ,
                            comisionretencion = lcomisionretencion
                            ,
                            porcentajecalculoprecio = lporcentajecalculoprecio
                            ,
                            tir = ltir
                            ,
                            porcentajecalculodescuento = lporcentajecalculodescuento
                            ,
                            porcentajecalculorendimiento = lporcentajecalculorendimiento
                            ,
                            interestranscurrido = linterestranscurrido
                            ,
                            porcentajepreciocompra = lporcentajepreciocompra
                            ,
                            porcentajeprecioultimacompra = lporcentajeprecioultimacompra
                            ,
                            preciounitarioaccion = lpreciounitarioaccion
                            ,
                            numeroacciones = lnumeroacciones
                            ,
                            valoracciones = lvaloracciones
                            ,
                            preciocompra = lpreciocompra
                            ,
                            valordividendospagados = lvalordividendospagados
                            ,
                            porcentajeparticipacioncupon = lporcentajeparticipacioncupon
                            ,
                            tasainterescupon = ltasainterescupon
                            ,
                            observaciones = (string)p["observaciones"]
                            ,
                            observacionespagos = (string)p["observacionespagos"]
                            ,
                            bolsavaloresccatalogo = lbolsavaloresccatalogo
                            ,
                            bolsavalorescdetalle = (string)p["bolsavalorescdetalle"]
                            ,
                            calendarizacionccatalogo = lcalendarizacionccatalogo
                            ,
                            calendarizacioncdetalle = (string)p["calendarizacioncdetalle"]
                            ,
                            basediasinterescdetalle = (string)p["basediasinterescdetalle"]
                            ,
                            calificacionriesgoinicialccatalogo = lcalificacionriesgoinicialccatalogo
                            ,
                            calificacionriesgoinicialcdetalle = (string)p["calificacionriesgoinicialcdetalle"]
                            ,
                            calificacionriesgoactualccatalogo = lcalificacionriesgoactualccatalogo
                            ,
                            calificacionriesgoactualcdetalle = (string)p["calificacionriesgoactualcdetalle"]
                            ,
                            casavaloresccatalogo = lcasavaloresccatalogo
                            ,
                            casavalorescdetalle = (string)p["casavalorescdetalle"]
                            ,
                            clasificacioninversionccatalogo = lclasificacioninversionccatalogo
                            ,
                            clasificacioninversioncdetalle = (string)p["clasificacioninversioncdetalle"]
                            ,
                            compracuponccatalogo = lcompracuponccatalogo
                            ,
                            compracuponcdetalle = (string)p["compracuponcdetalle"]
                            ,
                            emisorccatalogo = lemisorccatalogo
                            ,
                            emisorcdetalle = (string)p["emisorcdetalle"]
                            ,
                            formaajusteinteresccatalogo = lformaajusteinteresccatalogo
                            ,
                            formaajusteinterescdetalle = (string)p["formaajusteinterescdetalle"]
                            ,
                            instrumentoccatalogo = linstrumentoccatalogo
                            ,
                            instrumentocdetalle = (string)p["instrumentocdetalle"]
                            ,
                            mercadotipoccatalogo = lmercadotipoccatalogo
                            ,
                            mercadotipocdetalle = (string)p["mercadotipocdetalle"]
                            ,
                            monedaccatalogo = lmonedaccatalogo
                            ,
                            monedacdetalle = (string)p["monedacdetalle"]
                            ,
                            periodicidadpagoscapitalccatalogo = lperiodicidadpagoscapitalccatalogo
                            ,
                            periodicidadpagoscapitalcdetalle = (string)p["periodicidadpagoscapitalcdetalle"]
                            ,
                            periodicidadpagosinteresccatalogo = lperiodicidadpagosinteresccatalogo
                            ,
                            periodicidadpagosinterescdetalle = (string)p["periodicidadpagosinterescdetalle"]
                            ,bancopagoccatalogo = lbancopagoccatalogo

                            ,bancopagocdetalle = (string)p["bancopagocdetalle"]
                            ,
                            portafolioccatalogo = lportafolioccatalogo
                            ,
                            portafoliocdetalle = (string)p["portafoliocdetalle"]
                            ,
                            sectorccatalogo = lsectorccatalogo
                            ,
                            sectorcdetalle = (string)p["sectorcdetalle"]
                            ,
                            bancoccatalogo = lbancoccatalogo
                            ,
                            bancocdetalle = (string)p["bancocdetalle"]
                            ,
                            sistemacolocacionccatalogo = lsistemacolocacionccatalogo
                            ,
                            sistemacolocacioncdetalle = (string)p["sistemacolocacioncdetalle"]
                            ,
                            estadoccatalogo = lestadoccatalogo
                            ,
                            estadocdetalle = (string)p["estadocdetalle"]
                            ,
                            cusuarioing = (string)p["cusuarioing"]
                            ,
                            fingreso = DateTime.Parse(p["fingreso"].ToString())
                            ,
                            cusuariomod = (string)p["cusuariomod"]
                            ,
                            fmodificacion = lfmodificacion
                            ,
                            nfcolocacion = lnfcolocacion
                            ,
                            nfregistro = lnfregistro
                            ,
                            nfcompra= lnfcompra
                            ,nfpago = lnfpago
                            ,
                            nfemision = lnfemision
                            ,
                            nfvencimiento = lnfvencimiento
                            ,
                            nfpagoultimocupon = lnfpagoultimocupon
                            ,
                            nfultimacompra = lnfultimacompra
                            ,
                            nfultimopago = lnfultimopago
                            ,
                            nombresagente = (string)p["nombresagente"]
                            ,
                            nombresoperadorinst = (string)p["nombresoperadorinst"]
                            ,
                            centrocostoccatalogo = lcentrocostoccatalogo 
                            ,centrocostocdetalle = (string)p["centrocostocdetalle"]
                            ,interes = linteres
                            ,ccomprobanteanulacion = (string)p["ccomprobanteanulacion"]
                            ,fcontable = int.Parse(p["fcontable"].ToString())
                            ,ccompania = int.Parse(p["ccompania"].ToString())
                            ,porcentajebolsa = decimal.Parse(p["porcentajebolsa"].ToString())
                            ,porcentajeoperador = decimal.Parse(p["porcentajeoperador"].ToString())
                            ,porcentajeretencion = decimal.Parse(p["porcentajeretencion"].ToString())
                            ,retencionfuentevalor = lretencionfuentevalor
                            ,
                            comentariosingreso = (string)p["comentariosingreso"]
                            ,
                            comentariosaprobacion = (string)p["comentariosaprobacion"]
                            ,
                            comentariosanulacion = (string)p["comentariosanulacion"]
                            ,
                            comentariosdevolucion = (string)p["comentariosdevolucion"]
                            ,PermiteAnular = int.Parse(p["PermiteAnular"].ToString())
                            ,
                            comentariospago = (string)p["comentariospago"]
                            ,
                            cinversionhisultimo = lcinversionhisultimo
                            ,tasanueva = ltasanueva
                            ,interesdiferencia = linteresdiferencia
                            ,capitaldiferencia = lcapitaldiferencia
                            ,interesanterior = linteresanterior
                            ,
                            capitalanterior = lcapitalanterior
                            ,
                            interesnuevo = linteresnuevo
                            ,capitalnuevo = lcapitalnuevo
                            ,fsistema = lfsistema
                            ,interesvalornominal = linteresvalornominal
                            ,
                            interesporvencer = linteresporvencer
                            ,
                            saldocapital = lsaldocapital
                            ,
                            saldointeres = lsaldointeres
                            ,
                            diasvalornominal = ldiasvalornominal
                            ,
                            plazorealxvencer = lplazorealxvencer
                            ,
                            diastranscurridosinteres = ldiastranscurridosinteres

                        });



                }


                return tInversionClone;
            }
            else
            {
                return null;
            }


        }

        /// <summary>
        /// Asignar contenido al mensaje del error.
        /// </summary>
        /// <param name="mensaje">Cadena de referencia que contiene el mansaje a desplegar.</param>
        /// <param name="contenido">Contenido del mensaje.</param>
        public static void mensajeAsignar(ref string mensaje, string contenido)
        {
            if (mensaje.Trim().Length != 0)
            {
                mensaje = mensaje + ".  ";
            }
            mensaje = mensaje + contenido;
        }


        /// <summary>
        /// Asignar el nombre del campo al mensaje.
        /// </summary>
        /// <param name="mensaje">Cadena de referencia que contiene el mansaje a desplegar.</param>
        /// <param name="contenido">Contenido del mensaje.</param>
        /// <param name="nombreCampo">Nombre del campo.</param>
        private static void mensajeAsignarConNombreCampo(ref string mensaje, string contenido, string nombreCampo = "")
        {

            string lmensaje = nombreCampo.Trim().Length == 0 ? "" : nombreCampo.Trim() + " ";
            lmensaje = lmensaje + contenido;
            mensajeAsignar(ref mensaje, lmensaje);
        }


        /// Validar si valor string corresponde a un formato numérico con decimales.
        /// </summary>
        /// <param name="istrDecimal">String a validar.</param>
        /// <param name="mensaje">Mensaje en el caso de que se produzca error.</param>
        /// <param name="nombreCampo">Nombre del campo al cual corresponde el valor.</param>
        /// <param name="numerodecimales">Número máximo de decimales que debe contener el valor validado.</param>
        /// <param name="iblnValidaPositivo">Bandera que indica si el número a validar debe ser positivo.</param>
        /// <returns>decimal</returns>
        private static decimal clsValidarDecimal(string istrDecimal, ref string mensaje, string nombreCampo = "", int numerodecimales = 2, bool iblnValidaPositivo = true)
        {

            if (istrDecimal.Trim().Length > 0)
            {

                decimal lNegativo = istrDecimal.Trim().Substring(0, 1) == "-" ? -1 : 1;

                string separadorDecimal = "";

                if (istrDecimal.IndexOf(",") > -1)
                {
                    separadorDecimal = ",";
                }
                else
                {
                    if (istrDecimal.IndexOf(".") > -1)
                    {
                        separadorDecimal = ".";
                    }
                }

                if (separadorDecimal.Trim().Length > 0)
                {
                    if (istrDecimal.IndexOf(separadorDecimal) == 0)
                    {
                        istrDecimal = "0" + istrDecimal;
                    }
                }
                else
                {
                    separadorDecimal = ".";
                    istrDecimal = istrDecimal + separadorDecimal + "0";
                }

                String[] lvalor = istrDecimal.Split(Convert.ToChar(separadorDecimal));

                try
                {

                    Int64 lenteroaux = 0;

                    decimal ldecimalaux = 0;

                    if (lvalor[0].Trim().Length > 0)
                    {
                        lenteroaux = Int64.Parse(lvalor[0].Trim());
                    }

                    if (lvalor[1].Trim().Length > 0)
                    {

                        if (Int64.Parse(lvalor[1].Trim()) != 0)
                        {

                            string lstrDivisor = "1";

                            for (int i = 0; i < lvalor[1].Trim().Length; i++)
                            {
                                lstrDivisor = lstrDivisor + "0";
                            }

                            ldecimalaux = 1 + decimal.Parse(lvalor[1].Trim()) / decimal.Parse(lstrDivisor);

                            ldecimalaux = ldecimalaux - 1;

                            if (ldecimalaux.ToString().Trim().Length - 2 > numerodecimales)
                            {
                                mensajeAsignarConNombreCampo(ref mensaje, "debe tener máximo " + numerodecimales.ToString().Trim() + " dígitos decimales", nombreCampo);
                            }

                        }

                    }

                    decimal ldecimalResultado = 0;

                    if (lenteroaux < 0)
                    {
                        ldecimalResultado = lenteroaux + (ldecimalaux * -1);
                    }
                    else
                    {
                        if (ldecimalaux < 0)
                        {
                            ldecimalResultado = (lenteroaux * -1) + ldecimalaux;
                        }
                        else
                        {
                            ldecimalResultado = lenteroaux + ldecimalaux;
                        }
                    }

                    if (ldecimalResultado < 0 && iblnValidaPositivo)
                    {
                        mensajeAsignarConNombreCampo(ref mensaje, "debe ser un valor mayor que cero", nombreCampo);
                    }

                    return ldecimalResultado * lNegativo;

                }
                catch
                {
                    mensajeAsignarConNombreCampo(ref mensaje, "debe tener formato numérico de máximo " + numerodecimales.ToString().Trim() + " dígitos decimales", nombreCampo);

                    return 0;
                }
            }
            else
            {
                return 0;
            }

        }

        /// <summary>
        /// Obtener filtro de la plantilla contable.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns>string</returns>
        private static string obtenerWherePlantilla(RqConsulta rqconsulta)
        {
            string lCondicion = "";
            try
            {
                lCondicion = (string)rqconsulta.Mdatos["where"];
            }
            catch
            { }
            return lCondicion;
        }

        /// <summary>
        /// Obtener la plantilla contable.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns>List<tinvContabilidadPlantilla></returns>
        public static List<tinvContabilidadPlantilla> obtenerPlantillaContable(RqConsulta rqconsulta)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();

            string lSQL = "SELECT tgcd.nombre nombrerubro,c.nombre nombrecuenta,p.cinvplantillacontable,p.entidadccatalogo,p.entidadcdetalle,p.instrumentoccatalogo,p.instrumentocdetalle,p.procesoccatalogo,p.procesocdetalle,p.rubroccatalogo,p.rubrocdetalle,p.centrocostoccatalogo,p.centrocostocdetalle,p.ccuenta,p.debito,p.orden,p.activo,p.cusuarioing,p.fingreso,p.cusuariomod,p.fmodificacion FROM tinvplantillacontable p left outer join tconcatalogo c on c.ccuenta = p.ccuenta left outer join tgencatalogodetalle tgcd on tgcd.ccatalogo = p.rubroccatalogo and tgcd.cdetalle = p.rubrocdetalle where " +
                obtenerWherePlantilla(rqconsulta) +
                " p.activo = 1 union " +
                "SELECT (SELECT nombre FROM tgencatalogodetalle WHERE ccatalogo = 1219 AND cdetalle = 'RET') nombrerubro,c.nombre nombrecuenta,null cinvplantillacontable,null entidadccatalogo,null entidadcdetalle,null instrumentoccatalogo,null instrumentocdetalle,null procesoccatalogo,'COMPRA' procesocdetalle,null rubroccatalogo,null rubrocdetalle,null centrocostoccatalogo,null centrocostocdetalle,MAX(p.texto) ccuenta,null debito,9999 orden,1 activo,null cusuarioing,null fingreso,null cusuariomod,null fmodificacion FROM tinvparametros p inner join tconcatalogo c on c.ccuenta = ltrim(rtrim(p.texto)) WHERE p.codigo LIKE 'CTA_CON_RETENCION%' group by c.nombre order by orden";

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> ListaPlantilla = null;

            try
            {
                ListaPlantilla = ch.GetRegistroDictionary();
            }
            catch
            {
                return null;
            }


            if (ListaPlantilla.Count > 0)
            {

                List<tinvContabilidadPlantilla> tTablaPlantillaClone = new List<tinvContabilidadPlantilla>();

                foreach (var p in ListaPlantilla)
                {

                    int? lorden = null;
                    if (p["orden"] != null) lorden = int.Parse(p["orden"].ToString());

                    bool? ldebito = null;
                    if (p["debito"] != null) ldebito = bool.Parse(p["debito"].ToString());

                    int? lentidadccatalogo = null;
                    if (p["entidadccatalogo"] != null) lentidadccatalogo = int.Parse(p["entidadccatalogo"].ToString());

                    int? linstrumentoccatalogo = null;
                    if (p["instrumentoccatalogo"] != null) linstrumentoccatalogo = int.Parse(p["instrumentoccatalogo"].ToString());

                    int? lprocesoccatalogo = null;
                    if (p["procesoccatalogo"] != null) lprocesoccatalogo = int.Parse(p["procesoccatalogo"].ToString());

                    int? lrubroccatalogo = null;
                    if (p["rubroccatalogo"] != null) lrubroccatalogo = int.Parse(p["rubroccatalogo"].ToString());

                    int? lcentrocostoccatalogo = null;
                    if (p["centrocostoccatalogo"] != null) lcentrocostoccatalogo = int.Parse(p["centrocostoccatalogo"].ToString());

                    tTablaPlantillaClone.Add(
                        new tinvContabilidadPlantilla()
                        {

                            nombrecuenta = (string)p["nombrecuenta"],
                            nombrerubro = (string)p["nombrerubro"],
                            entidadccatalogo = lentidadccatalogo,
                            entidadcdetalle = (string)p["entidadcdetalle"],
                            instrumentoccatalogo = linstrumentoccatalogo,
                            instrumentocdetalle = (string)p["instrumentocdetalle"],
                            procesoccatalogo = lprocesoccatalogo,
                            procesocdetalle = (string)p["procesocdetalle"],
                            rubroccatalogo = lrubroccatalogo,
                            rubrocdetalle = (string)p["rubrocdetalle"],
                            centrocostoccatalogo = lcentrocostoccatalogo,
                            centrocostocdetalle = (string)p["centrocostocdetalle"],
                            ccuenta = (string)p["ccuenta"],
                            debito = ldebito,
                            orden = lorden

                        });



                }


                return tTablaPlantillaClone;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Obtener el texto de un parámetro de inversiones, dado su código.
        /// </summary>
        /// <param name="codigo">Request de consulta.</param>
        /// <returns>string</returns>
        public static string GetParametro(string codigo = "AMBIENTE")
        {

            string SqlAmbiente = "select texto texto from tinvparametros where codigo = '" + codigo + "'";

            tinvparametros fc = new tinvparametros();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("texto");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlAmbiente);
                fc = (tinvparametros)ch.GetRegistro("tinvparametros", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0016", "ERROR AL GENERAR TINVPARAMETROS");
            }

            return fc.Mdatos.Values.ElementAt(0).ToString();

        }


        /// <summary>
        /// Obtener el número de un parámetro de inversiones, dado su código.
        /// </summary>
        /// <param name="codigo">Request de consulta.</param>
        /// <returns>decimal</returns>
        public static decimal GetParametroNumero(string codigo)
        {

            string SqlParametros = "select numero numero from tinvparametros where codigo = '" + codigo + "'";

            tinvparametros fc = new tinvparametros();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("numero");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SqlParametros);
                fc = (tinvparametros)ch.GetRegistro("tinvparametros", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0016", "ERROR AL GENERAR TINVPARAMETROS");
            }

            return decimal.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }


        /// <summary>
        /// Obtener el registro de un parámetro de inversiones, dado su código.
        /// </summary>
        /// <param name="codigo">Request de consulta.</param>
        /// <returns>List<tinvparametros></returns>
        public static List<tinvparametros> obtenerTinvParametros(string codigo = "AMBIENTE")
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvparametros> lista = new List<tinvparametros>();

            lista = contexto.tinvparametros.AsNoTracking().Where(x => x.codigo == codigo).ToList();

            return lista;

        }

        /// <summary>
        /// Obtener una lista de la tabla tgencatalogodetalle, dado sus identificadores de catálogo y catálogo detalle.
        /// </summary>
        /// <param name="ccatalogo">Identificador de catálogo.</param>
        /// <param name="cdetalle1">Primer identificador del catálogo detalle.</param>
        /// <param name="cdetalle2">Segundo identificador del catálogo detalle.</param>
        /// <param name="inCondicion">Forzar para que valide con los dos identificadores de detalle.</param>
        /// <returns>List<tgencatalogodetalle></returns>
        public static List<tgencatalogodetalle> obtenerTgenDetalle(
            int ccatalogo
            , string cdetalle1 = ""
            , string cdetalle2 = ""
            , bool inCondicion = false)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tgencatalogodetalle> lista = new List<tgencatalogodetalle>();

            if (cdetalle1 != "" && cdetalle2 != "")
            {
                if (inCondicion)
                {
                    lista = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo && (x.cdetalle.Equals(cdetalle1) || x.cdetalle.Equals(cdetalle2))).OrderBy(x => x.nombre).ToList();
                }
                else
                {
                    lista = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo && !x.cdetalle.Equals(cdetalle1) && !x.cdetalle.Equals(cdetalle2)).OrderBy(x => x.nombre).ToList();
                }
            }
            else if (cdetalle1 != "")
            {
                if (inCondicion)
                {
                    lista = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo && x.cdetalle.Equals(cdetalle1)).OrderBy(x => x.nombre).ToList();
                }
                else
                {
                    lista = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo && !x.cdetalle.Equals(cdetalle1)).OrderBy(x => x.nombre).ToList();
                }

            }
            else
            {
                lista = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == ccatalogo).OrderBy(x => x.nombre).ToList();

            }

            return lista;

        }


        /// <summary>
        /// Obtener una lista de la tabla tinvContabilidadPlantillaAgente.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns>List<tinvContabilidadPlantillaAgente></returns>
        public static List<tinvContabilidadPlantillaAgente> obtenerPlantillaContableAgente(RqConsulta rqconsulta)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();

            string lSQL = "SELECT tgcd.nombre nombrerubro,c.nombre nombrecuenta,p.cinvplantillacontableagente,p.cinvagentebolsa,p.instrumentoccatalogo,p.instrumentocdetalle,p.procesoccatalogo,p.procesocdetalle,p.rubroccatalogo,p.rubrocdetalle,p.centrocostoccatalogo,p.centrocostocdetalle,p.ccuenta,p.debito,p.orden,p.activo,p.cusuarioing,p.fingreso,p.cusuariomod,p.fmodificacion FROM tinvplantillacontableagente p left outer join tconcatalogo c on c.ccuenta = p.ccuenta left outer join tgencatalogodetalle tgcd on tgcd.ccatalogo = p.rubroccatalogo and tgcd.cdetalle = p.rubrocdetalle where " +
                obtenerWherePlantilla(rqconsulta) +
                " p.activo = 1  order by p.orden";

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> ListaPlantilla = null;

            try
            {
                ListaPlantilla = ch.GetRegistroDictionary();
            }
            catch
            {
                return null;
            }


            if (ListaPlantilla.Count > 0)
            {

                List<tinvContabilidadPlantillaAgente> tTablaPlantillaClone = new List<tinvContabilidadPlantillaAgente>();

                foreach (var p in ListaPlantilla)
                {

                    bool? ldebito = null;
                    if (p["debito"] != null) ldebito = bool.Parse(p["debito"].ToString());

                    long? lcinvagentebolsa = null;
                    if (p["cinvagentebolsa"] != null) lcinvagentebolsa = int.Parse(p["cinvagentebolsa"].ToString());

                    int? lorden = null;
                    if (p["orden"] != null) lorden = int.Parse(p["orden"].ToString());

                    int? linstrumentoccatalogo = null;
                    if (p["instrumentoccatalogo"] != null) linstrumentoccatalogo = int.Parse(p["instrumentoccatalogo"].ToString());

                    int? lprocesoccatalogo = null;
                    if (p["procesoccatalogo"] != null) lprocesoccatalogo = int.Parse(p["procesoccatalogo"].ToString());

                    int? lrubroccatalogo = null;
                    if (p["rubroccatalogo"] != null) lrubroccatalogo = int.Parse(p["rubroccatalogo"].ToString());

                    int? lcentrocostoccatalogo = null;
                    if (p["centrocostoccatalogo"] != null) lcentrocostoccatalogo = int.Parse(p["centrocostoccatalogo"].ToString());

                    tTablaPlantillaClone.Add(
                        new tinvContabilidadPlantillaAgente()
                        {

                            nombrecuenta = (string)p["nombrecuenta"],
                            nombrerubro = (string)p["nombrerubro"],
                            cinvagentebolsa = lcinvagentebolsa,
                            instrumentoccatalogo = linstrumentoccatalogo,
                            instrumentocdetalle = (string)p["instrumentocdetalle"],
                            procesoccatalogo = lprocesoccatalogo,
                            procesocdetalle = (string)p["procesocdetalle"],
                            rubroccatalogo = lrubroccatalogo,
                            rubrocdetalle = (string)p["rubrocdetalle"],
                            centrocostoccatalogo = lcentrocostoccatalogo,
                            centrocostocdetalle = (string)p["centrocostocdetalle"],
                            ccuenta = (string)p["ccuenta"],
                            debito = ldebito,
                            orden = lorden

                        });

                }


                return tTablaPlantillaClone;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Obtener una lista de la tabla de amortización temporal.
        /// </summary>
        /// <param name="icinversion">Identificador de la Inversión.</param>
        /// <param name="orderby">Secuencia en el orden de campos al generar la consulta.</param>
        /// <param name="itransaccion">Identificador de la transacción.</param>
        /// <returns>List<tTablaAmortizacion></returns>
        public static List<tTablaAmortizacion> GetTablaAmortizacion(long icinversion, string orderby = "t.finicio,t.fvencimiento", long itransaccion = 0)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();

            string lTmp = "";

            tinvinversion inversion = new tinvinversion();

            inversion = TinvInversionDal.Find(icinversion);

            if (inversion != null)

            {
                if (inversion.cinversionhisultimo != null && inversion.cinversionhisultimo > 0 && itransaccion > 1000 && itransaccion < 2000)
                {
                    lTmp = "tmp";
                }
            }

            string lSQL = "SELECT ROW_NUMBER() OVER(ORDER BY " + 
                orderby + 
                " ASC) AS periodo, isnull(t.acumuladoaccrual,0) acumuladoaccrual, tg.nombre nestado, t.cinvtablaamortizacion,t.optlock,t.cinversion,t.finicio,t.fvencimiento,t.plazo,t.proyeccioncapital,t.proyecciontasa,t.proyeccioninteres,t.valormora,t.estadoccatalogo,t.estadocdetalle,t.fingreso,t.cusuarioing,t.fmodificacion,t.cusuariomod,cast(str(t.finicio,8) as date) nfinicio,cast(str(t.fvencimiento,8) as date) nfvencimiento, i.porcentajecalculoprecio FROM tinvtablaamortizacion" +
                lTmp +
                " t inner join tinvinversion i on i.cinversion = t.cinversion left outer join tgencatalogodetalle tg on tg.ccatalogo = t.estadoccatalogo and tg.cdetalle = t.estadocdetalle where t.cinversion = " +
                icinversion.ToString() +
                " order by " +
                orderby;

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> ListaTablaAmortiza = null;

            try
            {
                ListaTablaAmortiza = ch.GetRegistroDictionary();
            }
            catch
            {
                return null;
            }


            if (ListaTablaAmortiza.Count > 0)
            {

                List<tTablaAmortizacion> tTablaAmortizaClone = new List<tTablaAmortizacion>();

                foreach (var p in ListaTablaAmortiza)
                {

                    decimal? ltotal = 0;

                    int? lplazo = null;
                    if (p["plazo"] != null) lplazo = int.Parse(p["plazo"].ToString());

                    decimal? lproyeccioncapital = null;
                    if (p["proyeccioncapital"] != null)
                    {
                        lproyeccioncapital = decimal.Parse(p["proyeccioncapital"].ToString());
                        ltotal = lproyeccioncapital;
                    }

                    decimal? lproyecciontasa = null;
                    if (p["proyecciontasa"] != null) lproyecciontasa = decimal.Parse(p["proyecciontasa"].ToString());

                    decimal? lporcentajecalculoprecio = null;
                    if (p["porcentajecalculoprecio"] != null) lporcentajecalculoprecio = decimal.Parse(p["porcentajecalculoprecio"].ToString());

                    decimal? lproyeccioninteres = null;
                    if (p["proyeccioninteres"] != null)
                    {
                        lproyeccioninteres = decimal.Parse(p["proyeccioninteres"].ToString());
                        ltotal = ltotal + lproyeccioninteres;
                    }

                    decimal? lvalormora = null;
                    if (p["valormora"] != null)
                    {
                        lvalormora = decimal.Parse(p["valormora"].ToString());
                        ltotal = ltotal + lvalormora;
                    }

                    decimal? lacumuladoaccrual = null;
                    if (p["acumuladoaccrual"] != null) lacumuladoaccrual = decimal.Parse(p["acumuladoaccrual"].ToString());

                    int? lestadoccatalogo = null;
                    if (p["estadoccatalogo"] != null) lestadoccatalogo = int.Parse(p["estadoccatalogo"].ToString());

                    DateTime? lnfinicio = null;
                    if (p["nfinicio"] != null) lnfinicio = DateTime.Parse(p["nfinicio"].ToString());

                    DateTime? lnfvencimiento = null;
                    if (p["nfvencimiento"] != null) lnfvencimiento = DateTime.Parse(p["nfvencimiento"].ToString());

                    tTablaAmortizaClone.Add(
                        new tTablaAmortizacion()
                        {
                            cinvtablaamortizacion = (long)p["cinvtablaamortizacion"]
                            ,
                            optlock = 0
                            ,
                            cinversion = (long)p["cinversion"]
                            ,
                            finicio = int.Parse(p["finicio"].ToString())
                            ,
                            fvencimiento = int.Parse(p["fvencimiento"].ToString())
                            ,
                            plazo = lplazo
                            ,
                            proyeccioncapital = lproyeccioncapital
                            ,
                            proyecciontasa = lproyecciontasa
                            ,
                            proyeccioninteres = lproyeccioninteres
                            ,
                            valormora = lvalormora
                            ,
                            estadoccatalogo = 1218
                            ,
                            estadocdetalle = (string)p["estadocdetalle"]
                            ,
                            nfinicio = lnfinicio
                            ,
                            nfvencimiento = lnfvencimiento
                            ,
                            total = ltotal
                            ,
                            nestado = (string)p["nestado"]
                            ,porcentajecalculoprecio = lporcentajecalculoprecio
                            ,acumuladoaccrual = lacumuladoaccrual
                            ,periodo = (long)p["periodo"]


                        });



                }


                return tTablaAmortizaClone;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Obtener una lista de los rubros de inversiones.
        /// </summary>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static IList<Dictionary<string, object>> GetRubrosContablesAll()
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, "select cdetalle, nombre from tgencatalogodetalle where ccatalogo = 1219 order by clegal");
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        /// <summary>
        /// Obtener el número de dividendos de una inversión.
        /// </summary>
        /// <param name="plazo">Plazo de la inversión.</param>
        /// <param name="iperiodicidadpagoscdetalle">Identificador de la periodicidad de pagos.</param>
        /// <param name="icalendarizacion">Identificador de la calendarización de pagos.</param>
        /// <returns>long</returns>
        public static long GetNumeroPagos(long plazo, string iperiodicidadpagoscdetalle, int icalendarizacion)
        {

            long lnumeropagos = 0;
            switch (iperiodicidadpagoscdetalle)
            {
                case "ANUAL":
                    if (icalendarizacion > 0)
                    {
                        lnumeropagos = plazo / icalendarizacion;
                    }
                    break;
                case "SEM":
                    lnumeropagos = plazo / ((icalendarizacion) / 2);
                    break;
                case "TRIM":
                    lnumeropagos = plazo / ((icalendarizacion) / 4);
                    break;
                case "VENC":
                    lnumeropagos = 1;
                    break;
            }
            return lnumeropagos;

        }

        /// <summary>
        /// Completar la tabla de dividendos.
        /// </summary>
        /// <param name="iTablaPagos">Tabla de pagos.</param>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <param name="iPlazo">Plazo de la inversión.</param>
        /// <returns></returns>
        private static void CompletaTablaPagos(ref List<tTablaAmortizacion> iTablaPagos, RqConsulta rqconsulta, long iPlazo)
        {

            List<tTablaAmortizacion> tTablaPagosCapital = new List<tTablaAmortizacion>();

            List<tTablaAmortizacion> tTablaPagosInteres = new List<tTablaAmortizacion>();

            tTablaPagosInteres = iTablaPagos;

            tTablaPagosCapital = GeneraTablaPagos(rqconsulta, iPlazo, "periodicidadpagoscapitalcdetalle");


            int lIndiceInteres = 0;
            int lIndiceCapital = 0;

            decimal cuota = decimal.Parse(rqconsulta.Mdatos["valornominal"].ToString()) / tTablaPagosCapital.Count;


            if (tTablaPagosInteres.Count <= tTablaPagosCapital.Count)
            {
                while (lIndiceInteres < tTablaPagosInteres.Count)
                {
                    while (lIndiceCapital < tTablaPagosCapital.Count)
                    {
                        if (tTablaPagosCapital[lIndiceCapital].nfvencimiento < tTablaPagosInteres[lIndiceInteres].nfvencimiento)
                        {


                            iTablaPagos.Add(new tTablaAmortizacion()
                            {
                                finicio = tTablaPagosCapital[lIndiceCapital].finicio
                                ,
                                fvencimiento = tTablaPagosCapital[lIndiceCapital].fvencimiento
                                ,
                                nfinicio = tTablaPagosCapital[lIndiceCapital].nfinicio
                                ,
                                nfvencimiento = tTablaPagosCapital[lIndiceCapital].nfvencimiento
                                ,
                                proyecciontasa = decimal.Parse(rqconsulta.Mdatos["tasa"].ToString())
                                ,
                                proyeccioncapital = cuota
                                ,proyeccioninteres = 0
                                ,total = cuota
                                ,plazo = (int)((DateTime)tTablaPagosCapital[lIndiceCapital].nfvencimiento - (DateTime)tTablaPagosCapital[lIndiceCapital].nfinicio).TotalDays
                                ,estadoccatalogo = 1218
                                ,estadocdetalle = "PEN"


                            });

                        }

                        else
                        {
                            if (tTablaPagosCapital[lIndiceCapital].nfvencimiento == tTablaPagosInteres[lIndiceInteres].nfvencimiento)
                            {
                                iTablaPagos[lIndiceInteres].proyeccioncapital = cuota;
                                iTablaPagos[lIndiceInteres].total = cuota + iTablaPagos[lIndiceInteres].proyeccioninteres;

                                lIndiceInteres++;
                            }

                        }
                        lIndiceCapital++;
                    }
                    lIndiceInteres++;
                }

                if (rqconsulta.Mdatos["periodicidadpagosinterescdetalle"].ToString() == "VENC" && rqconsulta.Mdatos["periodicidadpagoscapitalcdetalle"].ToString() != "VENC")
                {
                    iTablaPagos[0].proyeccioncapital = cuota;
                    iTablaPagos[0].total = cuota + iTablaPagos[0].proyeccioninteres;

                }


            }
            else
            {

                long llimiteInteres = tTablaPagosInteres.Count;

                while (lIndiceCapital < tTablaPagosCapital.Count)
                {
                    while (lIndiceInteres < llimiteInteres)
                    {

                        if (tTablaPagosInteres[lIndiceInteres].nfvencimiento == tTablaPagosCapital[lIndiceCapital].nfvencimiento)
                        {
                            iTablaPagos[lIndiceInteres].proyeccioncapital = cuota;
                            iTablaPagos[lIndiceInteres].total = cuota + iTablaPagos[lIndiceInteres].proyeccioninteres;

                            lIndiceCapital++;
                        }

                        lIndiceInteres++;
                    }
                    lIndiceCapital++;
                }

                if (rqconsulta.Mdatos["periodicidadpagoscapitalcdetalle"].ToString() == "VENC" && rqconsulta.Mdatos["periodicidadpagosinterescdetalle"].ToString() != "VENC")
                {
                    iTablaPagos[iTablaPagos.Count - 1].proyeccioncapital = decimal.Parse(rqconsulta.Mdatos["valornominal"].ToString()); 
                    iTablaPagos[iTablaPagos.Count - 1].total = decimal.Parse(rqconsulta.Mdatos["valornominal"].ToString()) + iTablaPagos[iTablaPagos.Count - 1].proyeccioninteres;

                }

            }
        }

        /// <summary>
        /// Generación de dividendos de la tabla de amortización.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <param name="iPlazo">Plazo de la inversión.</param>
        /// <param name="istrPeriodicidad">Identificador de la periodicidad de pagos a realizar.</param>
        /// <returns>List<tTablaAmortizacion></returns>
        private static List<tTablaAmortizacion> GeneraTablaPagos(RqConsulta rqconsulta, long iPlazo, string istrPeriodicidad = "periodicidadpagosinterescdetalle")
        {

            List<tTablaAmortizacion> tTablaClone = new List<tTablaAmortizacion>();

            DateTime lfinicio = new DateTime();
            lfinicio = DateTime.Parse(rqconsulta.Mdatos["fcolocacion"].ToString());

            DateTime lfvencimiento = new DateTime();



            long lLimite;
            if (rqconsulta.Mdatos[istrPeriodicidad].ToString() == "VENC")
            {
                lLimite = iPlazo;
            }
            else
            {
                lLimite = GetNumeroPagos(iPlazo, rqconsulta.Mdatos[istrPeriodicidad].ToString(), int.Parse(rqconsulta.Mdatos["calendarizacion"].ToString()));
            }


            int lFactor = 0;

            if (rqconsulta.Mdatos[istrPeriodicidad].ToString() == "ANUAL")
            {
                lFactor = 12;
            }
            else
            {

                if (rqconsulta.Mdatos[istrPeriodicidad].ToString() == "SEM")
                {
                    lFactor = 6;
                }
                else
                {

                    if (rqconsulta.Mdatos[istrPeriodicidad].ToString() == "TRIM")
                    {
                        lFactor = 3;
                    }
                    else
                    {


                        lfvencimiento = lfinicio.AddDays(lLimite);

                        tTablaClone.Add(
                        new tTablaAmortizacion()
                        {
                            nfinicio = lfinicio,
                            nfvencimiento = lfvencimiento
                            ,plazo = (int)lLimite
                            ,proyecciontasa = decimal.Parse(rqconsulta.Mdatos["tasa"].ToString())
                            ,proyeccioncapital = 0
                            ,proyeccioninteres = 0
                            ,estadoccatalogo = 1218
                            ,estadocdetalle = "PEN"


                        });

                        return tTablaClone;

                    }

                }
            }

            long lIndice = 1;

            while (lIndice <= lLimite)
            {

                lfvencimiento = lfinicio.AddMonths(lFactor).AddDays(-1);

                tTablaClone.Add(
                new tTablaAmortizacion()
                {
                    nfinicio = lfinicio,
                    nfvencimiento = lfvencimiento
                    ,plazo = (int)(lfvencimiento - lfinicio).TotalDays
                    ,proyecciontasa = decimal.Parse(rqconsulta.Mdatos["tasa"].ToString())
                    ,proyeccioncapital = 0
                    ,proyeccioninteres = 0
                    ,estadoccatalogo = 1218
                    ,estadocdetalle = "PEN"
                });

                lfinicio = lfinicio.AddMonths(lFactor);

                lIndice++;
            }

            return tTablaClone;

        }


        private static string DEL = "delete tinvinversion WHERE tasaclasificacioncdetalle = @tasaclasificacioncdetalle ";

        /// <summary>
        /// Elimina una inversión por tipo de tasa.
        /// </summary>
        /// <param name="itasaclasificacioncdetalle">Identificador del tipo de tasa.</param>
        /// <returns></returns>
        public static void Delete(string itasaclasificacioncdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DEL,
                new SqlParameter("tasaclasificacioncdetalle", itasaclasificacioncdetalle));
        }

        /// <summary>
        /// Obtiene el Id. de la Invbersión, por título.
        /// </summary>
        /// <param name="icodigotitulo">Código del título.</param>
        /// <param name="ifemision">Fecha de emisión.</param>
        /// <param name="ifvencimiento">Fecha de vencimiento.</param>
        /// <param name="iplazo">Plazo.</param>
        /// <returns></returns>
        public static long obtenerPorTitulo(
            string icodigotitulo,
            int ifemision,
            int ifvencimiento,
            int iplazo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tinvinversion> lista = new List<tinvinversion>();

            lista = contexto.tinvinversion.AsNoTracking().Where(x => x.codigotitulo.Equals(icodigotitulo) &&
                x.femision == ifemision && x.fvencimiento == ifvencimiento && x.plazo == iplazo).ToList();

            if (lista == null || lista.Count == 0)
            {
                lista = contexto.tinvinversion.AsNoTracking().Where(x => x.codigotitulo.Equals(icodigotitulo) &&
                    x.femision == ifemision && x.plazo == iplazo).ToList();

                if (lista == null || lista.Count == 0)
                {
                    lista = contexto.tinvinversion.AsNoTracking().Where(x => x.codigotitulo.Equals(icodigotitulo) &&
                        x.fvencimiento == ifvencimiento && x.plazo == iplazo).ToList();

                    if (lista == null || lista.Count == 0)
                    {
                        lista = contexto.tinvinversion.AsNoTracking().Where(x => x.codigotitulo.Equals(icodigotitulo) &&
                            x.plazo == iplazo).ToList();

                        if (lista == null || lista.Count == 0)
                        {
                            lista = contexto.tinvinversion.AsNoTracking().Where(x => x.codigotitulo.Equals(icodigotitulo)).ToList();

                        }
                    }
                }
            }


            if (lista == null || lista.Count == 0)
            {
                return 0;
            }
            else
            {
                return lista[0].cinversion;
            }



        }



    }

    public class tInversion : tinvinversion
    {

        public DateTime? nfcolocacion;
        public DateTime? nfregistro;
        public DateTime? nfcompra;
        public DateTime? nfpago;
        public DateTime? nfemision;
        public DateTime? nfvencimiento;
        public DateTime? nfultimopago;

        public DateTime? nfpagoultimocupon;
        public DateTime? nfultimacompra;

        public string nombresagente;
        public string nombresoperadorinst;

        public decimal? interes;
        public string ccomprobanteanulacion;
        public int fcontable;
        public int ccompania;
        public int? PermiteAnular;

        public decimal? tasanueva;

        public decimal? interesdiferencia;
        public decimal? interesanterior;
        public decimal? interesnuevo;

        public decimal? capitaldiferencia;
        public decimal? capitalanterior;
        public decimal? capitalnuevo;

        public int? fsistema;

    }

    public class tTablaAmortizacion : tinvtablaamortizacion
    {

        public DateTime? nfinicio;
        public DateTime? nfvencimiento;
        public decimal? total;
        public decimal? saldo;
        public int numerolinea;
        public string mensaje;
        public string nestado;
        public decimal? porcentajecalculoprecio;
        public long? ppv;
        public double? vpresente;
        public long? periodo;
        public decimal vinteresesperado;
        
    }


    public class tCuotas : tinvinversion
    {

        int? tabamo_fechainicio;
        int? tabamo_fechavencimiento;
        long?    tabamo_plazo;
        decimal?    tabamo_capital;
        decimal? tabamo_interes;
        decimal? tabamo_tasa;
        decimal? tabamo_mora;
        decimal? tabamo_subtotal;                         
        string    emisor;                                                                                                                                                                                                   
        string    instrumentocodigo; 
        decimal?    valornominal;
        decimal? valornegociacion;
        decimal? valorefectivo;                           
        long?    plazo;
        decimal? tasa;
        decimal? yield;                                   
        string    clasificacioninversion;                                                                                                                                                                                   
        string    observaciones;
        decimal? comisionbolsavalores;
        decimal? comisionoperador;
        decimal? comisionretencion;
        decimal? comisiontotal;                           
        int?    fcolocacion; 
        int?    fregistro;   
        int?    femision;    
        string    agentebolsaRUC;       
        string    agentebolsanombres;                                           
        string     agentebolsadireccion;                                                                                                                                                                                                                                             
        string     agentebolsatelefono01;
        decimal? interesbasadoenvalornominal;             
        int?    fvencimiento; 
        long?    diasley;     
        string    compracupon;                                                                                                                                                                                              
        string    formaajusteinteres;                                                                                                                                                                                       
        string    sector;                                                                                                                                                                                                   
        string    sistemacolocacion;                                                                                                                                                                                        
        string    estado;






        /// <summary>
        /// ////////////
        /// </summary>
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
