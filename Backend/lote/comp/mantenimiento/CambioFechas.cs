using core.componente;
using dal.generales;
using dal.lote;
using lote.helper;
using lote.resultado;
using modelo;
using System;
using System.Collections.Generic;
using System.Threading;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace lote.comp.mantenimiento
{
    /// <summary>
    /// Clase que se encarga de validar y realzar el cambio de fechas
    /// </summary>
    public class CambioFechas : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rq) {
            IList<Dictionary<string, object>> lresultados = TloteResultadoDal.FindResultadosUltimosProcesados(rq.Fconatable, null, null, null);
            if (lresultados.Count<=0) {
                throw new AtlasException("LOT-0001", "NO SE HA EJECUTADO NINGÚN LOTE PARA LA FECHA: {0}", Fecha.ToDate(rq.Fconatable).ToString("yyyy-MM-dd"));
            }

            foreach (Dictionary<string, object> item in lresultados) {
                tlotecodigo lote = TloteCodigoDal.Find(item["clote"].ToString());
                if (lote.validaejecucion == null || lote.validaejecucion==false) {
                    continue;
                }
                if (item["error"] != null && int.Parse(item["error"].ToString()) > 0) {
                    tgenmodulo mod = TgenModuloDal.Find(int.Parse(item["cmodulo"].ToString()));
                    throw new AtlasException("LOT-0002", "EL LOTE: [{0}] SE ENCUENTRA PROCESADO CON: [{1}] ERRORES PARA EL MÓDULO: [{2}]", lote.nombre, item["error"], mod.nombre);
                }
            }
            IList<tloteresultadoprevio> rprevio = TloteResultadoPrevioDal.Find(rq.Fconatable);

            if (rprevio != null && rprevio.Count > 0) {
                string error = "";
                foreach (tloteresultadoprevio pr in rprevio) {
                    error = error + pr.clote + ": " + pr.ctarea + " ERROR:" + pr.textoresultado+ ". ";
                }
                throw new AtlasException("BLOTE-0006", "NO SE PUEDE CAMBIAR LA FECHA : [{0}], EXISTEN ERRORES {1}: [{2}]", rq.Fconatable, "PREVIOS", error);
            }

            IList<tloteresultadofin> rfin = TloteResultadoFinDal.Find(rq.Fconatable);

            if (rfin != null && rfin.Count > 0)
            {
                string error = "";
                foreach (tloteresultadofin pr in rfin)
                {
                    error = error + pr.clote + ": " + pr.ctarea + " ERROR:" + pr.textoresultado + ". ";
                }
                throw new AtlasException("BLOTE-0006", "NO SE PUEDE CAMBIAR LA FECHA : [{0}], EXISTEN ERRORES {1}: [{2}]", rq.Fconatable,"FINALES" ,error);
            }

            tgenfechacontable fc = TgenfechacontableDal.Find(rq.Ccompania, rq.Fconatable);
            Sessionef.Eliminar(fc);

            tgenfechacontable fcn = new tgenfechacontable();
            fcn.ccompania = fc.ccompania;
            fcn.fcontable = Fecha.AdicionaDias365(fc.fcontable, 1);
            fcn.ftrabajo = Fecha.AdicionaDias365(fc.ftrabajo??0, 1);
            fcn.fanterior = Fecha.AdicionaDias365(fc.fanterior??0, 1);
            fcn.fproxima = Fecha.AdicionaDias365(fc.fproxima??0, 1);
            Sessionef.Save(fcn);
        }


    }
}
