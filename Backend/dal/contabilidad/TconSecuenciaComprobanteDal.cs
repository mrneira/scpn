using modelo;
using modelo.helper;
using System;
using System.Data.SqlClient;
using System.Linq;

using util;
using util.servicios.ef;

namespace dal.contabilidad {

    public class TconSecuenciaComprobanteDal {

        private static string SQL = "select secuenciaactual from tconsecuenciacomprobante with (updlock) where csecuenciacomprobante = @secuencia and anio = @anio and mes = @mes ";
        private static readonly object syncLock = new object();

        public static tconsecuenciacomprobante FindWithLock(string secuencia, int anio, int mes, AtlasContexto ctx) {
            ctx.Database.ExecuteSqlCommand(SQL, new SqlParameter("secuencia", secuencia), new SqlParameter("anio", anio), new SqlParameter("mes", mes));
            tconsecuenciacomprobante obj;
            obj = ctx.tconsecuenciacomprobante.Where(x => x.csecuenciacomprobante.Equals(secuencia)
                                                                        && x.anio == anio
                                                                        && x.mes == mes).SingleOrDefault();
            return obj;
        }

        public static string ObtenerSecuenciaComprobante(string secuencia, int fcontable) {
            lock (syncLock) { // synchronize
                int anio = util.Fecha.GetAnio(fcontable);
                int mes = util.Fecha.GetMes(fcontable);
                string secuenciaretorno;
                int secuenciaactual;
                string secuenciaausar = secuencia.ToUpper() + "-" + anio.ToString() + String.Format("{0:00}", mes) + "-";
                AtlasContexto ctx = Sessionef.GetAtlasContexto();

                tconsecuenciacomprobante obj = TconSecuenciaComprobanteDal.FindWithLock(secuencia, anio, mes, ctx);
                if (obj == null) {
                    CrearSecuencia(secuencia, anio, mes);
                    secuenciaretorno = secuenciaausar + "00001";
                } else {
                    secuenciaactual = obj.secuenciaactual.Value;
                    obj.secuenciaactual += 1;
                    ctx.Entry(obj).State = System.Data.Entity.EntityState.Modified;
                    secuenciaretorno = secuenciaausar + String.Format("{0:00000}", (secuenciaactual + 1));
                }
                // ctx.SaveChanges();
                return secuenciaretorno;
            }

        }

        public static void CrearSecuencia(string secuencia, int anio, int mes) {
            AtlasContexto ctx = new AtlasContexto();
            tconsecuenciacomprobante t = new tconsecuenciacomprobante();
            t.csecuenciacomprobante = secuencia;
            t.anio = anio;
            t.mes = mes;
            t.secuenciaactual = 1;
            ctx.Entry(t).State = System.Data.Entity.EntityState.Added;
            ctx.SaveChanges();
        }

    }

}
