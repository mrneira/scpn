using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.generales
{
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgenCatalogo.
    /// </summary>

  public  class TgenCatalogoDal
    {
        public static tgencatalogo Find(int ccatalogo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencatalogo obj = null;

            obj = contexto.tgencatalogo.AsNoTracking().Where(x => x.ccatalogo == ccatalogo ).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }
        /// <summary>
        /// Consulta TgenCatalogoDetalle dado el codigo legal.
        /// </summary>
        /// <param name="ccatalogo">Codigo de catalogo.</param>
        /// <param name="clegal">Codigo legal.</param>
        /// <returns></returns>
        public static int NuevoCodigo(int cmodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int ccatalogo=0;
            String incrementoinicial="01";
            List<tgencatalogo> ldata = null;

            ldata = contexto.tgencatalogo.AsNoTracking().Where(x => x.cmodulo == cmodulo).ToList();

            
            if (ldata.Count.Equals(0))
            {
                ccatalogo = int.Parse(cmodulo.ToString() + "" + incrementoinicial);
            }
            else {
                ccatalogo = ldata.Max(x => x.ccatalogo) + 1;
            }
            return ccatalogo;
        }


    }
}
