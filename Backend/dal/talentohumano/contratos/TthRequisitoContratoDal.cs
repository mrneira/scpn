using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;
using dal.generales;
namespace dal.talentohumano
{
    public class TthRequisitoContratoDal
    {
        public static IList<tthrequisitorelacionlaboral> FindByTipoRelacionLaboral(long ctiporelacionlaboral)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthrequisitorelacionlaboral> ldatos = null;
            ldatos = contexto.tthrequisitorelacionlaboral
                .Where(x => x.ctiporelacionlaboral == ctiporelacionlaboral)
                .ToList();
            foreach (tthrequisitorelacionlaboral obj in ldatos)
            {
                obj.Mdatos.Add("nombrerequisito", TgenCatalogoDetalleDal.Find((int)obj.documentoccatalogo, obj.documentocdetalle).nombre);
            }
            return ldatos;
        }
    }
}
