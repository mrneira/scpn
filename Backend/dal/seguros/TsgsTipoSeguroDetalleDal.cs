using dal.generales;
using modelo;
using System;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.seguros {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TsgsTipoSeguroDetalleDto.
    /// </summary>

    public class TsgsTipoSeguroDetalleDal {
        /// <summary>
        /// Consulta en la base de datos la definicion del seguro de desgravamen.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <returns>TcarSegDesgravamenDto</returns>
        /// 
        public static tsgstiposegurodetalle Find(int ctiposeguro)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tsgstiposegurodetalle.AsNoTracking().Where(x => x.ctiposeguro == ctiposeguro && x.verreg == 0).SingleOrDefault();
        }

        /// <summary>
        /// Calcula el seguro de desgravamen.
        /// </summary>
        /// <param name="tasa">Definicion de un impuesto.</param>
        /// <param name="tasaextra">Valor adicional</param>
        /// <param name="montobase">Monto base sobre el cual se calcula el impuesto es el capital ingresado en la solicitud.</param>
        /// <param name="cmoneda">Codigo de moneda con el cual se obtien el numero de decimales a redondear.</param>
        /// <returns>decimal</returns>
        public static decimal Calcular(decimal? tasa, decimal montobase, String cmoneda)
        {
            decimal? valor = Constantes.CERO;
            decimal? tasatotal = tasa == null ? Constantes.CERO : tasa;
            if (tasatotal == null || tasatotal <= 0) {
                return (decimal)valor;
            }
            valor = montobase * tasatotal;
            valor = (decimal)Math.Round((double)(valor / Constantes.CIEN), TgenMonedaDal.GetDecimales(cmoneda), MidpointRounding.AwayFromZero);

            return (decimal)valor;
        }
    }
}
