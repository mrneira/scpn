using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;
using util;

namespace dal.talentohumano.nomina
{
    public class TnomDecimoCuartoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdecimocuarto.
        /// </summary>
        /// <returns>IList<tnomdecimocuarto></returns>
        public static IList<tnomdecimocuarto> findInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomdecimocuarto> ldatos = ldatos = contexto.tnomdecimocuarto.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomdecimocuarto por mes.
        /// </summary>
        /// <returns>IList<tnomdecimocuarto></tnomdecimocuarto></returns>
        public static IList<tnomdecimocuarto> Find(long? cfuncionario)
        {
            IList<tnomdecimocuarto> obj = null;
            // CCA 20220810
            DateTime factual = Fecha.GetFechaSistema();
            int anioIniCal = (factual.Year) - 1;
            int anioFinCal = factual.Year;
            DateTime finiCalc = new DateTime(anioIniCal, 04, 01);//CCA 20230412
            DateTime ffinCalc = new DateTime(anioFinCal, 03, 31);
            // CCA 20220810
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomdecimocuarto.Where(x => x.cfuncionario == cfuncionario && x.contabilizado == false).ToList();
                //obj = contexto.tnomdecimocuarto.Where(x => x.cfuncionario == cfuncionario && (x.fechageneracion.Value > finiCalc && x.fechageneracion.Value < ffinCalc)).ToList(); //CCA 20220810
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

        public static IList<tnomdecimocuarto> Find(long? cfuncionario, DateTime finicio, DateTime ffin)
        {
            IList<tnomdecimocuarto> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomdecimocuarto.Where(x => x.cfuncionario == cfuncionario && x.contabilizado == true && (x.fechageneracion.Value > finicio && x.fechageneracion.Value < ffin)).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        public static IList<tnomdecimocuarto> Find(long? cfuncionario, string region)
        {
            IList<tnomdecimocuarto> obj = null;
            DateTime factual = Fecha.GetFechaSistema();
            int anioIniCal = (factual.Year) - 1;
            int anioFinCal = factual.Year;
            DateTime finiCalc;
            DateTime ffinCalc;
            if (region == "SIE")
            {
                finiCalc = new DateTime(anioIniCal, 08, 01);//CCA 20240709
                ffinCalc = new DateTime(anioFinCal, 07, 31);
            }
            else
            {
                finiCalc = new DateTime(anioIniCal, 04, 01);//CCA 20240709
                ffinCalc = new DateTime(anioFinCal, 03, 31);
            }

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomdecimocuarto.Where(x => x.cfuncionario == cfuncionario && x.contabilizado == true && (x.fechageneracion.Value > finiCalc && x.fechageneracion.Value < ffinCalc)).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

    }
}
