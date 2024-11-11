using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
  public  class TnomPagoImpuestoRentaDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnompagoimpuestorenta.
        /// </summary>
        /// <returns>IList<tnompagoimpuestorenta></returns>
        public static IList<tnompagoimpuestorenta> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnompagoimpuestorenta> ldatos = ldatos = contexto.tnompagoimpuestorenta.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnompagoimpuestorenta por año y funcionario
        /// </summary>
        /// <returns>tnompagoimpuestorenta</returns>
        public static tnompagoimpuestorenta Find(long? anio, long? cfuncionario)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnompagoimpuestorenta obj = null;
            try
            {
                obj = contexto.tnompagoimpuestorenta.Where(x => x.anio == anio && x.cfuncionario == cfuncionario).SingleOrDefault();

            }catch(Exception ex) {
                obj = null;
            }
            if (obj != null) EntityHelper.SetActualizar(obj);
            return obj;
        }

    }
}
