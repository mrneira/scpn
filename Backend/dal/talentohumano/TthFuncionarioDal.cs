using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
    public class TthFuncionarioDal
    {

        /// <summary>
        /// Valida si un funcionario existe en el sistema con su cpersona.
        /// </summary>
        /// <param name="cpersona">Código de cpersona.</param>
        /// <returns></returns>
        public static long FindCpersona(long cpersona)
        {
            tthfuncionariodetalle obj = null;
            long cfuncionarior = -1;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tthfuncionariodetalle.AsNoTracking().Where(x => x.cpersona == cpersona && x.verreg == 0 && x.activo == true).SingleOrDefault();
            if (obj != null)
            {
                cfuncionarior = obj.cfuncionario;
            }
            return cfuncionarior;
        }
        /// <summary>
        /// Valida si un funcionario existe en el sistema con su cpersona.
        /// </summary>
        /// <param name="cpersona">Código de cpersona.</param>
        /// <returns></returns>
        public static long FindCJefeFuncionario(long cpersona)
        {
            tthfuncionariodetalle obj = null;
            long cfuncionarior = -1;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            obj = contexto.tthfuncionariodetalle.AsNoTracking().Where(x => x.cpersona == cpersona && x.verreg == 0 && x.activo == true).SingleOrDefault();
            if (obj != null)
            {
                if (obj.jefecfuncionario == null)
                {
                    cfuncionarior = -1;
                }
                else
                {
                    cfuncionarior = obj.jefecfuncionario.Value;
                }
            }
            return cfuncionarior;
        }

        /// <summary>
        /// Entrega datos vigentes de un funcionario.
        /// </summary>
        /// <param name="identificacion">Identificación de funcionario.</param>
        /// <returns></returns>
        public static tthfuncionariodetalle Find(string identificacion)
        {
            tthfuncionariodetalle obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tthfuncionariodetalle.AsNoTracking().Where(x => x.documento.Equals(identificacion) && x.verreg == 0).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Entrega datos vigentes de un funcionario.
        /// </summary>
        /// <param name="identificacion">Identificación de funcionario.</param>
        /// <returns></returns>
        public static tthfuncionariodetalle Find(long cfuncionario)
        {
            tthfuncionariodetalle obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            obj = contexto.tthfuncionariodetalle.AsNoTracking().Where(x => x.cfuncionario == cfuncionario && x.verreg == 0).SingleOrDefault();
            return obj;
        }
        /// <summary>
        /// Entrega datos vigentes de todos los funcionario por compania
        /// </summary>
        /// <param name="ccompania">Código de compania.</param>
        /// <returns>List<tthfuncionariodetalle></returns>
        public static List<tthfuncionariodetalle> Find(int ccompania)
        {
            List<tthfuncionariodetalle> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tthfuncionariodetalle.AsNoTracking().Where(x => x.ccompania == ccompania && x.verreg == 0).ToList();
            return obj;
        }
        /// <summary>
        /// Entrega datos vigentes de un funcionario.
        /// </summary>
        /// <param name="cfuncionario">Código de funcionario.</param>
        /// <returns></returns>
        public static tthfuncionariodetalle FindFuncionario(long? cfuncionario)
        {
            tthfuncionariodetalle obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tthfuncionariodetalle.AsNoTracking().Where(x => x.cfuncionario == cfuncionario && x.verreg == 0).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Entrega datos vigentes de un funcionario.
        /// </summary>
        /// <param name="cpersona">código de persona de funcionario.</param>
        /// <returns></returns>
        public static tthfuncionariodetalle FindXCpersona(long cpersona)
        {
            tthfuncionariodetalle obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tthfuncionariodetalle.AsNoTracking().Where(x => x.cpersona == cpersona && x.verreg == 0 && x.activo == true).SingleOrDefault(); //CCA 20220818
            return obj;
        }
    }
}
