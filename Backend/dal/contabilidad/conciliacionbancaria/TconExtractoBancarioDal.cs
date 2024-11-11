using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.contabilidad.conciliacionbancaria
{
    public class TconExtractoBancarioDal
    {

        /// <summary>
        /// Consulta la no existencia de registros en el libro Bancos.
        /// </summary>
        /// <param name="cuentabanco">Numero de cuenta corriente que la institucion mantiene en el sistema financiero.</param>
        /// <param name="documento">Numero de documento, del banco origen.</param>
        public static tconextractobancario Find(long cextractobancario, string documento)
        {
            //RRO 20221213
            tconextractobancario obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconextractobancario.Where(x => x.cextractobancario == cextractobancario && x.documento == documento).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Consulta extractobancario por cextractobancario y comprobante 
        /// </summary>
        /// <param name="cextractobancario"></param>
        /// <param name="comprobante"></param>
        /// <returns></returns>
        public static tconextractobancario FindComprobante(long cextractobancario, string comprobante)
        {
            tconextractobancario obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconextractobancario.Where(x => x.cextractobancario == cextractobancario && x.comprobante == comprobante).SingleOrDefault();
            return obj;
        }


        public static tconextractobancario FindExtractoBancario(long cextractobancario)
        {
            tconextractobancario obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconextractobancario.Where(x => x.cextractobancario == cextractobancario).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Consulta los saldos de la libro bancos, mayor a una fecha y por cuenta.
        /// </summary>
        /// <param name="ccuentabanco">Numero de cuenta corriente que la institucion mantiene en el sistema financiero.</param>
        /// <param name="finicio">fecha inicio.</param>
        /// <param name="ffin">fecha fin.</param>
        public static List<tconextractobancario> extractoSaldo(string ccuentabanco, int finicio, int ffin)
        {
            List<tconextractobancario> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconextractobancario.Where(x => x.ccuentabanco == ccuentabanco && x.fmovimiento >= finicio && x.fmovimiento <= ffin).ToList();
            return obj;
        }



        /// <summary>
        /// Consulta la no existencia de registros en el libro Bancos.
        /// </summary>
        /// <param name="cuentabanco">Numero de cuenta corriente que la institucion mantiene en el sistema financiero.</param>
        /// <param name="documento">Numero de documento, del banco origen.</param>
        /// <param name="fmovimiento">Numero de documento, del banco origen.</param>
        public static List<tconextractobancario> FindAjuste(string documento)
        {

            List<tconextractobancario> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconextractobancario.Where(x => x.documento == documento
                                                           && x.ajusteextracto == false
                                                           && x.conciliado == false).ToList();
            return obj;
        }

        public static int ActualizarCampoAxiliar(long cextractobancario, string documentoAux)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = "update tconextractobancario set conciliaaux = '" + documentoAux + "' where cextractobancario = " + cextractobancario.ToString() + "; ";
                return contexto.Database.ExecuteSqlCommand(lSQL);
            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }
        }

        public static int ActualizarConciliacionExtracto(long cextractobancario)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = "UPDATE tconextractobancario SET conciliado = 1 where cextractobancario = " + cextractobancario.ToString() + " and conciliado = 0;";
                return contexto.Database.ExecuteSqlCommand(lSQL);
            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }
        }


        public static int ActualizarAjusteExtracto(long cextractobancario)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = "UPDATE tconextractobancario SET ajusteextracto = 1 where cextractobancario = " + cextractobancario.ToString() + " and ajusteextracto = 0;";
                return contexto.Database.ExecuteSqlCommand(lSQL);
            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }
        }
    }
}
