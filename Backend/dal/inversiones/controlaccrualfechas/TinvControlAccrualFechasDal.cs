
using System.Collections.Generic;
using System.Linq;
using System;
using util;
using util.servicios.ef;
using modelo;
using modelo.servicios;
using util.dto.consulta;
using modelo.helper;
using dal.inversiones.contabilizacion;
using System.Data;
using System.Data.SqlClient;


namespace dal.inversiones.controlaccrualfechas
{
    public class TinvControlAccrualFechasDal
    {

        /// <summary>
        /// Obtener una inversión, dado su identificador.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>tinvinversion</returns>
        public static tinvcontrolaccrualfechas Find(long ccontrolaccrualfechas)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvcontrolaccrualfechas obj;
            obj = contexto.tinvcontrolaccrualfechas.Where(x => x.ccontrolaccrualfechas == ccontrolaccrualfechas).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }


    }
}
