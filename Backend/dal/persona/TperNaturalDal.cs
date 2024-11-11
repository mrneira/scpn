using modelo;
using modelo.helper;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.persona
{
    public class TperNaturalDal
    {

        /// <summary>
        /// Entrega datos vigentes de una persona natural.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tpernatural Find(long cpersona, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpernatural obj = new tpernatural();
            try
            {
                obj = contexto.tpernatural.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.verreg == 0).SingleOrDefault();
                if (obj != null)
                {
                    EntityHelper.SetActualizar(obj);
                }
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("BPER-002", "PERSONA NO DEFINIDA EN TPERNATURAL CPERSONA: {0} COMPANIA: {1}", cpersona, ccompania);
            }
            return obj;
        }
        public List<tgencatalogodetalle> FindGenero(int catalogo)
        {
            List<tgencatalogodetalle> listadoDetalle = new List<tgencatalogodetalle>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                listadoDetalle = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == catalogo).ToList();

            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("BPER-002", "No tiene catalogo de Genero");
            }
            return listadoDetalle;
        }
        public List<tgencatalogodetalle> FindEstadoCivil(int catalogo)
        {
            List<tgencatalogodetalle> listadoDetalle = new List<tgencatalogodetalle>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                listadoDetalle = contexto.tgencatalogodetalle.AsNoTracking().Where(x => x.ccatalogo == catalogo).ToList();

            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("BPER-002", "No tiene catalogo de Estado Civil");
            }
            return listadoDetalle;
        }

    }
}
