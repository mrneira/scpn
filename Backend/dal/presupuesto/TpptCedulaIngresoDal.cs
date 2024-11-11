using dal.generales;
using dal.monetario;
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

namespace dal.presupuesto
{

    public class TpptCedulaIngresoDal {

        /// <summary>
        /// Entrega datos de una cédula de ingreso
        /// </summary>
        /// <param name="ccedulaingreso">Codigo de una cédula de ingreso.</param>
        /// <returns></returns>
        public static tpptcedulaingreso Find(string ccedulaingreso, int aniofiscal)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpptcedulaingreso obj = null;
            obj = contexto.tpptcedulaingreso.Where(x => x.ccedulaingreso.Equals(ccedulaingreso) && x.aniofiscal == aniofiscal).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// crea una cédula de ingreso
        /// </summary>
        /// <returns></returns>
        public static tpptcedulaingreso Crear(RqMantenimiento rqmantenimiento, string cpartidaingreso, string ccomprobante, int ccompania, decimal valor, int aniofiscal ) {
            tpptcedulaingreso obj = new tpptcedulaingreso {
                cpartidaingreso = cpartidaingreso,
                ccomprobante = ccomprobante,
                ccompania = ccompania,
                aniofiscal = aniofiscal,
                valor = valor,
                cusuarioing = rqmantenimiento.Cusuario,
                fingreso = rqmantenimiento.Freal
            };
            return obj;
        }


    }

}
