using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
    public class TthEstudioFormalDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthestudioformal.
        /// </summary>
        /// <returns>IList<tthestudioformal></returns>
        public static IList<tthestudioformal> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthestudioformal> ldatos = ldatos = contexto.tthestudioformal.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tthestudioformal por secuencia.
        /// </summary>
        /// <returns>IList<tthestudioformal></returns>
        public static String FindTitulo(long cfuncionario)
        {
            tthestudioformal obj = null;
            String titulo = "";

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                
                var result = contexto.tthestudioformal
                           .Where(x => x.cfuncionario == cfuncionario)
                           .Select(x => new
                           {
                               x.titulo,
                               x.nivelacademicocdetalle,
                               x.secuencia
                           }).OrderByDescending(x => x.nivelacademicocdetalle).FirstOrDefault();

                if (result == null)
                {
                    titulo = null;
                }
                else
                {
                    titulo = result.titulo;
                }
            }
            catch (Exception ex)
            {
                titulo = null;

            }
            return titulo;
        }
    }
}
