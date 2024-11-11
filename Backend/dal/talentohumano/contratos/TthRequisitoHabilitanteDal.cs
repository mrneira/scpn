using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
    public class TthRequisitoHabilitanteDal
    {
        public static tthrequisitohabilitante FindByRequisitoAndFuncionario(long crequisitorelacionlaboral, long cfuncionario)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tthrequisitohabilitante requisito = contexto.tthrequisitohabilitante
                .Where(x => x.crequisitorelacionlaboral == crequisitorelacionlaboral && x.cfuncionario == cfuncionario)
               
                .SingleOrDefault();

            if (requisito != null)
            {
                //requisito.archivo = null;
            }
            return requisito;
        }
        public static int Find(long cfuncionario) {
            IList<tthrequisitohabilitante> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int total = 0;
            try
            {
            total = contexto.tthrequisitohabilitante.AsNoTracking().Where(x => x.cfuncionario == cfuncionario).Count();
            }
            catch (Exception)
            {

                total = 0;
            }
            return total;


        }
    }
}
