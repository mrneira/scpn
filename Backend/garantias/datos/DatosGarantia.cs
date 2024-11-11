using dal.garantias;
using modelo;
using System;
using System.Collections.Generic;
using util.enums;
using util.thread;

namespace garantias.datos {

    /// <summary>
    /// Clase que se encarga de almacenar informacion temporal, utilizada en la ejecucion de transacciones que afectan a operaciones de garantias.
    /// </summary>
    public class DatosGarantia : IDatosModulo {

        /// <summary>
        /// Map que almacena definicion de operaciones de garantias.
        /// </summary>
        /// <typeparam name="String"></typeparam>
        /// <typeparam name="Operacion"></typeparam>
        /// <param name=""></param>
        /// <returns></returns>
        private Dictionary<string, Operacion> moperacion = new Dictionary<string, Operacion>();

        /// <summary>
        /// Entrega un map con las operaciones de garantias que intervienen en una transaccion.
        /// </summary>
        /// <returns></returns>
        public Dictionary<string, Operacion> GetOperaciones()
        {
            return moperacion;
        }

        /**
         * Metodo que entrega la informacion de una operacion a de garantias.
         * @param coperacion Numero de garantia.
         * @return Operacion
         * @throws Exception
         */
        public Operacion GetOperacion(string coperacion, Boolean consulta)
        {
            Operacion operacion = null;
            if (moperacion.ContainsKey(coperacion)) {
                operacion = moperacion[coperacion];
            }

            if (operacion == null) {
                tgaroperacion tgo = null;
                if (!consulta) {
                    tgo = TgarOperacionDal.FindWithLock(coperacion);
                } else {
                    tgo = TgarOperacionDal.FindSinBloqueo(coperacion);
                }
                operacion = new Operacion(tgo);
                operacion.setCoperacion(coperacion);
                moperacion.Add(coperacion, operacion);
            }
            return operacion;
        }

        public void Encerardatos()
        {
            moperacion.Clear();
        }

        /// <summary>
        /// Entrega datos de datos garantia alamcenado en un threadlocal.
        /// </summary>
        /// <returns></returns>
        public static DatosGarantia GetDatosGarantia()
        {
            DatosGarantia dc = (DatosGarantia)ThreadNegocio.GetDatos().GetMdatosmodulo(EnumModulos.GARANTIAS.Cmodulo);
            return dc;
        }

    }
}
