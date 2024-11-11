using dal.generales;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.contabilidad.cuentasporpagar {

    public class TconCuentaporpagarMigradaDal {

        /// <summary>
        /// Entrega una cuenta por pagar.
        /// </summary>
        /// <param name="cctaporpagar">Numero de cuenta por pagar.</param>
        /// <returns>tconcuentaporpagar</returns>
        public static tconcuentaporpagarmigrada Find(string cctaporpagarmigrada) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcuentaporpagarmigrada obj = null;
            obj = contexto.tconcuentaporpagarmigrada.Where(x => x.cctaporpagarmigrada.Equals(cctaporpagarmigrada)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

    }

}
