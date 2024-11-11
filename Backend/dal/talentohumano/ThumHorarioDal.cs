using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using util.servicios.ef;

namespace dal.talentohumano
{
  public  class ThumHorarioDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de thumhorario, con los codigos de horario, nombre y tipo.
        /// </summary>
        /// <returns>IList<TcarAccrualDto></returns>
        public static IList<tthhorario> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthhorario> ldatos = ldatos = contexto.tthhorario.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tthhorario, con los codigos de horario, y dia
        /// </summary>
        /// <returns>tthhorariodetalle</returns>
        public static tthhorariodetalle Find(long chorario, string dia)
        {
            tthhorariodetalle ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                 ldatos = ldatos = contexto.tthhorariodetalle.AsNoTracking().Where(x => x.chorario == chorario && x.diacdetalle.Equals(dia)).Single();


            }
            catch (Exception ex) {
                ldatos = null;
            }
            return ldatos;
        }

        public static tthhorario Find(long chorario)
        {
            tthhorario ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthhorario.AsNoTracking().Where(x => x.chorario == chorario).Single();


            }
            catch (Exception ex)
            {
                ldatos = null;
            }
            return ldatos;
        }


    }
}
