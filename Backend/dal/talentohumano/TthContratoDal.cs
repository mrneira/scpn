using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
    public class TthContratoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthcontratodetalle.
        /// </summary>
        /// <returns>IList<tthcontratodetalle></returns>
        public static IList<tthcontratodetalle> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthcontratodetalle> ldatos = ldatos = contexto.tthcontratodetalle.AsNoTracking().ToList();
            return ldatos;
        }
        public static IList<tthcontratodetalle> FindActivos()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthcontratodetalle> ldatos = ldatos = contexto.tthcontratodetalle.Where(x=> x.verreg ==0 && x.estadocontratocdetalle.Equals("ACT") ).ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tthcontratodetalle por cfuncionario.
        /// </summary>
        /// <returns>tthcontratodetalle</returns>
        public static tthcontratodetalle FindContratoFuncionario(long cfuncionario)
        {
            tthcontratodetalle obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tthcontratodetalle.Where(x => x.cfuncionario == cfuncionario && x.verreg == 0 ).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tthcontratodetalle por ccontrato.
        /// </summary>
        /// <returns>tthcontratodetalle</returns>
        public static tthcontratodetalle Find(long ccontrato)
        {
            tthcontratodetalle obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tthcontratodetalle.Where(x => x.ccontrato == ccontrato && x.verreg == 0).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tthcontratodetalle por ccontrato.
        /// </summary>
        /// <returns>tthcontratodetalle</returns>
        public static tthcontratodetalle FindContratoMasAntiguoByFuncionario(long cfuncionario)
        {
            tthcontratodetalle obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tthcontratodetalle
                    .Where(x => x.cfuncionario == cfuncionario && x.estadocontratocdetalle != "FIN")
                    .OrderByDescending(x => x.verreg)
                    .SingleOrDefault();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tthcontratodetalle por ccontrato.
        /// </summary>
        /// <returns>tthcontratodetalle</returns>
        public static List<tthcontratodetalle> FindAllContratosByFuncionario(long cfuncionario)
        {
            List<tthcontratodetalle> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tthcontratodetalle.Where(x => x.cfuncionario == cfuncionario && x.verreg == 0 && x.fdesvinculacion == null).ToList();

            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

    }
}
