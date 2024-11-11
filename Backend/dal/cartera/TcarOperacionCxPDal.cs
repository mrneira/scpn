using System;
using modelo;
using System.Linq;
using util.servicios.ef;
using util;
using System.Collections.Concurrent;
using modelo.helper;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionCxPDto.
    /// </summary>
    public class TcarOperacionCxPDal {


        /// <summary>
        /// Entrega un registro de cuenta por pagar asociado a una operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static tcaroperacioncxp Find(String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacioncxp obj = contexto.tcaroperacioncxp.Local.Where(x => x.coperacion == coperacion).SingleOrDefault();
            if(obj == null) {
                obj = contexto.tcaroperacioncxp.Where(x => x.coperacion == coperacion).SingleOrDefault();
            }
            if (obj == null) {
                return obj;
            }
            return obj;
        }

        /// <summary>
        /// Entrega un registro de cuenta por pagar asociado a una operacion de cartera si no exiete en la base crea un registro.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>TcarOperacionCxPDto</returns>
        public static tcaroperacioncxp FindOrCreate(String coperacion) {
            tcaroperacioncxp obj = Find(coperacion);
            if (obj == null) {
                obj = new tcaroperacioncxp();
                obj.coperacion = coperacion;
                obj.saldo = Constantes.CERO;
                Sessionef.Save(obj);
            }
            return obj;
        }

        /// <summary>
        /// Metodo que suma el monto al saldo de la cxp.
        /// </summary>
        /// <param name="tcaroperacioncxp">Objeto que contiene los saldos de la CXP.</param>
        /// <param name="monto">Monto a sumar al saldo.</param>
        public static void Sumar(tcaroperacioncxp tcaroperacioncxp, decimal? monto) {
            if ((monto != null) && (monto > Constantes.CERO)) {
                tcaroperacioncxp.saldo = tcaroperacioncxp.saldo + monto;
            }
        }

        /// <summary>
        /// Metodo que resta el monto al saldo de la cxp. Valida que el saldo de la CXP no sea negativo.
        /// </summary>
        /// <param name="tcaroperacioncxp">Objeto que contiene los saldos de la CXP.</param>
        /// <param name="monto">Monto a restar del saldo.</param>
        public static void Restar(tcaroperacioncxp tcaroperacioncxp, decimal? monto) {
            if ((monto != null) && (monto > Constantes.CERO)) {
                tcaroperacioncxp.saldo = tcaroperacioncxp.saldo - monto;
            }
            if (tcaroperacioncxp.saldo < Constantes.CERO) {
                throw new AtlasException("BCAR-0014", "SALDO DE LA CUENTA POR PAGAR ASOCIADO A LA OPERACION: {0} NO PUEDE SER NEGATIVO",
                        tcaroperacioncxp.coperacion);
            }
        }

    }

}

