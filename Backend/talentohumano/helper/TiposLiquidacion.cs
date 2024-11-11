using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.helper
{
  public  class TiposLiquidacion
    {

          
           /// <summary>
           /// Clase para tipos de liquidación
           /// </summary>
            [JsonProperty("tipoliquidacion")]
            public String tipoliquidacion { set; get; }
             [JsonProperty("honorarios")]
            public decimal honorarios { set; get; }
            [JsonProperty("tipopagoincapacidad")]
            public Boolean tipopagoincapacidad { set; get; }
             [JsonProperty("pdiscapacidad")]
            public decimal pdiscapacidad { set; get; }






    }
}
