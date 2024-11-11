using core.componente;
using dal.prestaciones;
using System.Collections.Generic;
using util.dto.consulta;
using System;
using util;

namespace prestaciones.liquidacion
{
   public class Calbonificacacionfallecimiento
    {
       decimal obtenerPorcentajeBonificacion(decimal numaportes) 
        { decimal parametro = 0;
          
            if (numaportes <= 60)
                parametro = TpreParametrosDal.GetValorNumerico("POR-DEV-IMPOSICIONES-1-60");
            else if (numaportes >= 61 || numaportes <=120 )
                parametro = TpreParametrosDal.GetValorNumerico("POR-DEV-IMPOSICIONES-61-120");
            else  if (numaportes >= 121 || numaportes <= 180)
                parametro = TpreParametrosDal.GetValorNumerico("POR-DEV-IMPOSICIONES-121-180");
            else if (numaportes >= 181 || numaportes <= 240)
                parametro = TpreParametrosDal.GetValorNumerico("POR-DEV-IMPOSICIONES-181-240");
            return parametro;
        }

      public decimal[] CalcularBonificacionFallecimiento(RqConsulta rqconsulta)
        {
            decimal[] valor = new decimal[4];
            decimal cuantiabasica = 0m;
            int cjerarquia =Convert.ToInt32(rqconsulta.Mdatos["cdetallejerarquia"]);
            if (cjerarquia == 2)
            cuantiabasica = TpreParametrosDal.GetValorNumerico("CUANTIABASICAOFICIALES");
            else
            cuantiabasica = TpreParametrosDal.GetValorNumerico("CUANTIABASICACLASES");
            decimal numaportes = Convert.ToDecimal(rqconsulta.Mdatos["numaportaciones"]);
            decimal parametro = obtenerPorcentajeBonificacion(numaportes);
            valor[0] = (cuantiabasica * parametro) / 100;
            valor[1] = cuantiabasica;
            valor[2] = parametro;
            return valor;
        }
    }
}
