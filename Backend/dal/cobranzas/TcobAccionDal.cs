using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cobranzas
{

    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TcobAccion.
    /// </summary>
    public class TcobAccionDal
    {

        /// <summary>
        /// Metodo que entrega la definicion de una accion de cobranzas.
        /// </summary>
        ///// <param name="ccobranza">Codigo de cobranza.</param>
        /// <param name="ccobranza">Codigo de ccobranza.</param>
        /// <param name="coperacion">Codigo de coperacion.</param>
        /// <returns></returns>
        /// 
        public static long? FinAccion(string coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            long? cont = 0;
            cont = contexto.tcobcobranzaaccion.Where(x => x.coperacion == coperacion)
            .Select(x => x.coperacion)            
            .Count();
            if (cont >= 1)
            { return cont; }
            else
            { return 0; }

                //EntityHelper.SetActualizar(obj);
           
        }
        public static tcobaccion Find(int caccion)
        {
            tcobaccion obj = new tcobaccion();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tcobaccion.Where(x => x.caccion == caccion && x.enviocorreo == true && x.verreg == 0).Single();
                EntityHelper.SetActualizar(obj);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("BPER-001", "ACCION NO DEFINIDA EN TCOBACCION CACCION: {0}", caccion);
            }
            return obj;
        }
        
    }
}
