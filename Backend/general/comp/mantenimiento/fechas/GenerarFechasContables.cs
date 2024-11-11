using core.componente;
using dal.generales;
using modelo;
using modelo.servicios;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace general.comp.mantenimiento.fechas
{
    public class GenerarFechasContables : ComponenteMantenimiento {

        /// <summary>
        /// Map que contiene los datos del request de los dias contables y no contables
        /// </summary>
        private Dictionary<int, Dictionary<string, Boolean>> mdays = new Dictionary<int, Dictionary<string, Boolean>>();
        
        /// <summary>
        /// Lista de dias no contables por mes.
        /// </summary>
        private IList<tgenferiados> lnotaccountingdays;

        /// <summary>
        /// Fecha de inicio de generacion del calendario.
        /// </summary>
        private DateTime initdatedate;

        /// <summary>
        /// Fecha de finalizacion de genercion del calendario.
        /// </summary>
        private DateTime enddate;

        /// <summary>
        /// Clase que se encarga de generar las fechas contables para un tiempo determinado
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            this.FillMapDay(rqmantenimiento);
            lnotaccountingdays = TgenFeriadosDal.FindAll(rqmantenimiento.GetInt("anio"));
            enddate = DateTime.ParseExact(rqmantenimiento.GetDatos("anio").ToString()+"1231", "yyyyMMdd", CultureInfo.InvariantCulture);

            this.ProcessBranches(rqmantenimiento);
        }
        /// <summary>
        /// Metodo que genera fechas contables para la sucursal oficina de proceso.
        /// </summary>
        private void ProcessBranches(RqMantenimiento rq) {
            int init = int.Parse(rq.GetDatos("csucursalinicio").ToString());
            int end = int.Parse(rq.GetDatos("csucursalfin").ToString());
            while (init <= end) {
                tgensucursal tgeneBranch = TgenSucursalDal.Find(init, rq.Ccompania);
                if (tgeneBranch != null) {
                    //Obtiene la fecha de inicio por cada sucursal
                    initdatedate = DateTime.ParseExact(rq.GetDatos("fini").ToString(), "yyyyMMdd", CultureInfo.InvariantCulture);
                    this.Delete(init, rq.Ccompania);
                    this.ValidateDatesByBranch(init, rq.Ccompania);
                    this.ProcessByDate(rq, init);
                }
                init++;
            }
        }

        private void ProcessByDate(RqMantenimiento rq, int pBranch) {
            while (initdatedate.CompareTo(enddate) <= 0) {
                this.GenerateCalendar(rq, pBranch);
                initdatedate = initdatedate.AddDays(1);
            }
        }


        /// <summary>
        /// 
        /// </summary>
        private void GenerateCalendar(RqMantenimiento rq, int pBranch) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, Boolean> m = this.mdays[(int)initdatedate.DayOfWeek+1];
            tgenfechas obj = new tgenfechas();
            obj.ccompania = rq.Ccompania;
            obj.csucursal = pBranch;
            obj.fcalendario = Fecha.DateToInteger(initdatedate);
            obj.fcontable = Fecha.DateToInteger(this.GetDate("accounting", m));
            obj.ftrabajo = Fecha.DateToInteger(initdatedate);

            Sessionef.Grabar(obj);
        }

        /// <summary>
        /// Entrega la fecha contable para una fecha real.
        /// </summary>
        private DateTime GetDate(string fieldname, Dictionary<string, Boolean> m) {
            if (m.ContainsKey(fieldname) && m[fieldname]) {
                if (fieldname.CompareTo("working") == 0) {
                    return initdatedate;
                } else if (this.ValidateDayOfTheMonth(initdatedate)) {
                    //Si es fecha contable verifica que el dia dentro del mes sea contable.
                    return initdatedate;
                }
            }

            DateTime aux = initdatedate;
            int day = (int)initdatedate.DayOfWeek+1;
            Boolean cont = true;
            while (cont) {
                day++;
                if (day == 8) {
                    day = 1;
                }
                aux = aux.AddDays(1);
                if (fieldname.CompareTo("accounting") == 0 && !this.ValidateDayOfTheMonth(aux)) {
                    //Si el dia es no contable continua
                    continue;
                }
                if (this.mdays.ContainsKey(day) && this.mdays[day][fieldname]) {
                    cont = false;
                }
            }
            return aux;
        }

        /// <summary>
        /// Valida si el dia es contable dentro del mes, ejemplo 1 de enero no es contable.
        /// </summary>
        private Boolean ValidateDayOfTheMonth(DateTime daytovalidate) {
            Boolean isaccounting = true;
            // Month 1-12
            string mes = (daytovalidate.Month).ToString();
            if (mes.Length == 1) {
                mes = "0" + mes;
            }
            foreach (tgenferiados obj in lnotaccountingdays) {
                if (!obj.mescdetalle.Equals(mes)) {
                    continue;
                }
                int day = daytovalidate.Day;
                if (obj.dia.CompareTo(day) == 0) {
                    isaccounting = false;
                    break;
                }
            }
            return isaccounting;
        }


        private void FillMapDay(RqMantenimiento rq) {
            JArray r = (JArray)rq.GetDatos("LISTACCOUNTINDATE");
            List<object> lobj = r.ToList<object>();
            Boolean isworking = false;
            Boolean isaccounting = false;
        
            foreach (JObject obj in lobj) {
                IDictionary<string, object> m = obj.ToObject<Dictionary<string, object>>(); ;

                int day = int.Parse(m["dia"].ToString());
                Boolean working = Boolean.Parse((m.ContainsKey("trabajo") && m["trabajo"]!=null) ? m["trabajo"].ToString():"false");
                Boolean accounting = Boolean.Parse((m.ContainsKey("contable") && m["contable"]!=null) ? m["contable"].ToString() : "false");
                Dictionary<string, Boolean> maux = new Dictionary<string, Boolean>();
                maux["working"] = working;
                maux["accounting"] = accounting;
                mdays[day] =  maux;
                if (!isworking) {
                    isworking = working;
                }
                if (!isaccounting) {
                    isaccounting = accounting;
                }
            }
                if(!isaccounting || !isworking){
                throw new AtlasException("GENE-0052", "INGRESE AL MENOS UN DÍA CONATBLE Y DE TRABAJO PARA GENERAR EL CALENDARIO");
            }
        }

        /// <summary>
        /// Elimna fechas del calendario por sucursal y mayor a la fecha a regenerar el calendario.
        /// </summary>
        private static string DEL = "delete from TgenFechas "
        + " where csucursal = @csucursal "
        + " and ccompania = @ccompania "
        + " and fcalendario >= @fcalendario ";

        /// <summary>
        /// Elimna fechas del calendario por sucursal y mayor a la fecha a regenerar el calendario.
        /// </summary>
        private void Delete(int pBracnch, int pCompany) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(DEL, new SqlParameter("csucursal", pBracnch), new SqlParameter("ccompania", pCompany), new SqlParameter("fcalendario", Fecha.DateToInteger(this.initdatedate)));
        }


        /// <summary>
        /// Sentencia que se encarga de eliminar el calendario de fechas por sucursal
        /// </summary>
        private static String SQL_VAL = "select max(t.fcalendario) as fcalendario from TgenFechas t "
        + " where t.csucursal = @csucursal "
        + " and t.ccompania = @ccompania "
        + " and t.fcalendario < @fcalendario ";

        /// <summary>
        /// Valida que en la generacion de del calendario no exista huecos de fechas realres.
        /// </summary>
        private void ValidateDatesByBranch(int pBracnch, int pCompany) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@csucursal"] = pBracnch;
            parametros["@ccompania"] = pCompany;
            parametros["@fcalendario"] = Fecha.DateToInteger(this.initdatedate);

            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_VAL);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistroDictionary();

            Dictionary<string, object> fd = (Dictionary<string, object>)ldatos[0];

            if (!fd.ContainsKey("fcalendario") || fd["fcalendario"] ==null) {
                return;
            }
            int? fcalendario = int.Parse(((Dictionary<string, object>)ldatos[0])["fcalendario"].ToString());
            DateTime d = DateTime.ParseExact(fcalendario.ToString(), "yyyyMMdd", CultureInfo.InvariantCulture); ;
            d = d.AddDays(1);
            
            if (d.CompareTo(initdatedate) < 0) {
                throw new AtlasException("GENE-0019", "EL CALENDARIO NO PUEDE DEJAR HUECOS PARA LA SUCURSAL: {0} FCONTABLE ANTERIOR: {1}", pBracnch, d.ToString("yyyy-MM-dd"));
            }

            if (fcalendario > Fecha.DateToInteger(initdatedate)) {
                throw new AtlasException("GENE-0020", "FECHA DE INICIO PARA GENERAR CALENDARIO NO PUEDE SER MENOR A: {0}", fcalendario);
            }
        }


    }
}
