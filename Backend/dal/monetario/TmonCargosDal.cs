using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;
using modelo;
using dal.generales;

/// <summary>
/// Clase que implemeta, dml's manuales de la tabla TmonCargosDto.
/// </summary>
public class TmonCargosDal {
        
    /// <summary>
    /// Metodo que entrega la definicion de un cargo general. Busca los datos en cahce, si no encuentra los datos en cache 
    /// busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
    /// </summary>
    /// <param name="csaldo">Codigo de saldo.</param>
    /// <param name="cmoneda">Codigo de moneda del cargo.</param>
    /// <returns>TmonCargosDto</returns>
    public static tmoncargos Find(String csaldo, String cmoneda) {
        tmoncargos obj = null;
        String key = "" + csaldo + "^" + cmoneda;
        CacheStore cs = CacheStore.Instance;
        obj = (tmoncargos)cs.GetDatos("tmoncargos", key);
        if (obj == null) {
            ConcurrentDictionary<String, Object> m = cs.GetMapDefinicion("tmoncargos");
            obj = FindInDataBase(csaldo, cmoneda);
            m[key] = obj;
            cs.PutDatos("tmoncargos", m);
        }
        return obj;
    }
  
    /// <summary>
    /// Consulta en la base de datos la definicion de un cargo general.
    /// </summary>
    /// <param name="csaldo">.</param>
    /// <param name="cmoneda">.</param>
    public static tmoncargos FindInDataBase(string csaldo, string cmoneda) {
        AtlasContexto contexto = Sessionef.GetAtlasContexto();
        tmoncargos obj = null;
        try {
            obj = contexto.tmoncargos.Where(x => x.csaldo.Equals(csaldo) && x.cmoneda.Equals(cmoneda)).Single();
        } catch (System.InvalidOperationException) {
            throw new AtlasException("BMON-010", "CARGO NO DEFINIDO EN TMONCARGOS CSALDO: {0}  CMONEDA: {1}", csaldo, cmoneda); 
        }
        return obj;
    }
        
    /// <summary>
    /// Calcula el valor de un cargo.
    /// </summary>
    /// <param name="csaldo">Codigo de saldo asociado a un cargo.</param>
    /// <param name="cmoneda">Codigo de moenda del cargo.</param>
    /// <param name="montobase">Monto base sobre el cual se calcula el cargo.</param>
    /// <returns>decimal</returns>
    public static decimal? Calcular(String csaldo, String cmoneda, decimal montobase) {
        tmoncargos obj = TmonCargosDal.Find(csaldo, cmoneda);

        return TmonCargosDal.Calcular(montobase, obj.porcentaje, (decimal)obj.valorminimo, (decimal)obj.valormaximo, cmoneda,
                obj.cmonedacargo);
    }

    /// <summary>
    /// Calcula el valor de una comision.
    /// </summary>
    /// <param name="montobase">Monto base sobre el cual se calcula una comision.</param>
    /// <param name="porcentaje">Porcenta flat a aplicar ejemplo iva.</param>
    /// <param name="minimo">Valor minimo a cobrar.</param>
    /// <param name="maximo">Valor maximo a cobrar.</param>
    /// <param name="cmoneda">Codigo de moneda de la comision.</param>
    /// <param name="cmonedacargo">Codigo de moenda en el cual esta definido la comision.</param>
    /// <returns>decimal</returns>
    public static decimal? Calcular(decimal montobase, decimal? porcentaje, decimal minimo, decimal maximo, String cmoneda,
            String cmonedacargo) {
        decimal? comision = Constantes.CERO;

        if (porcentaje != null) {
            comision = montobase * (decimal)porcentaje;
            comision = (decimal)Math.Round(((double)comision / Constantes.CIEN), TgenMonedaDal.GetDecimales(cmoneda), MidpointRounding.AwayFromZero);
        }
        // aplica minimos o maximo
        comision = TmonCargosDal.Aplicaminimomaximo((decimal)comision, (decimal)minimo, maximo);
        comision = TmonCargosDal.Aplicacotizaciones((decimal)comision, cmoneda, cmonedacargo);
        comision = (decimal)Math.Round(((double)comision / Constantes.UNO), TgenMonedaDal.GetDecimales(cmoneda), MidpointRounding.AwayFromZero);
        return comision;
    }
        
    /// <summary>
    /// Aplica valores minimos o maximos al valor de la comision.
    /// </summary>
    /// <param name="comision">Valor calculado de la comision.</param>
    /// <param name="minimo">Valor minimo a cobrar.</param>
    /// <param name="maximo">Valor maximoa a cobrar.</param>
    /// <returns>decimal</returns>
    private static decimal? Aplicaminimomaximo(decimal comision, decimal? minimo, decimal? maximo) {
        decimal? valor = comision;
        if ((minimo != null) && (minimo > 0) && (valor < 0)) {
            valor = minimo;
        }
        if ((maximo != null) && (maximo > 0) && (valor > 0)) {
            valor = maximo;
        }
        return valor;
    }
        
    /// <summary>
    /// Aplica cotizacione de compra venta, si el cargo esta definido en una moneda diferente.
    /// </summary>
    /// <param name="comision">Valor de la comision.</param>
    /// <param name="cmoneda">Codigo de moneda del cargo.</param>
    /// <param name="cmonedacargo">Codigo de moneda en la cual se cobra el cargo.</param>
    /// <returns>decimal</returns>
    private static decimal Aplicacotizaciones(decimal comision, String cmoneda, String cmonedacargo) {
        decimal valor = comision;
        if (cmoneda != cmonedacargo) {
            decimal compra = Constantes.UNO; // cotizacion de compra cmoneda
            decimal venta = Constantes.UNO; // cotizacion de venta cmonedacargo
            valor = (valor * compra) / venta;
        }
        return valor;
    }

}
