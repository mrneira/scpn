using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla beneficiarios
    /// </summary>
    public class TpreBeneficiarioDal {
        /// <summary>
        /// Métdodo que busca la liquidacion por expediente
        /// </summary>
        /// <param name="secuencia"></param>
        /// <returns></returns>
        public static tpreliquidacion Find(int secuencia) {
            tpreliquidacion obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreliquidacion.AsNoTracking().Where(x => x.secuencia == secuencia && x.verreg == 0).SingleOrDefault();
            if (obj == null) {
                return null;
            }

            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Método que obtiene los beneficiarios por expediente
        /// </summary>
        /// <param name="secuencia"></param>
        /// <returns></returns>
        public static IList<tprebeneficiario> FindBeneficiarios(int secuencia, bool flagtodo = true) {
            IList<tprebeneficiario> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            if (flagtodo)
                obj = contexto.tprebeneficiario.AsNoTracking().Where(x => x.secuencia == secuencia).ToList();
            else
                obj = contexto.tprebeneficiario.AsNoTracking().Where(x => x.secuencia == secuencia && x.pagoexterno == false).ToList();
            if (obj == null) {
                return null;
            }

            return obj;
        }

        /// <summary>
        /// Método que obtiene los beneficiarios por expediente y cédula
        /// </summary>
        /// <param name="secuencia"></param>
        /// <returns></returns>
        public static tprebeneficiario FindToIdentidicacion(int secuencia, string identificacion) {
            tprebeneficiario obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tprebeneficiario.AsNoTracking().Where(x => x.secuencia == secuencia && x.identificacion == identificacion).SingleOrDefault();
            if (obj == null) {
                return null;
            }

            //EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Calcula la liquidación  costo promedio de un producto con el nuevo movimiento
        /// </summary>
        public static decimal CalcularCostoPromedio(decimal total, int cont) {
            if (total <= 0) {
                return 0;
            } else {
                return decimal.Round(total / cont, 5);
            }
        }
    }
}
