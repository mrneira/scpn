using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.datos
{
    public class ListadoDecimo
    {
        [JsonProperty("cfuncionario")]
        public long? cfuncionario { set; get; }
        [JsonProperty("documento")]
        public String documento { set; get; }
        [JsonProperty("ccontrato")]
        public String ccontrato { set; get; }
        [JsonProperty("centrocosto")]
        public string centrocosto { set; get; }
        [JsonProperty("nombre")]
        public String nombre { set; get; }
        [JsonProperty("cargo")]
        public String cargo { set; get; }
        [JsonProperty("ciudad")]
        public String ciudad { set; get; }
        [JsonProperty("total")]
       public decimal total { set; get; }
        [JsonProperty("centrocostocdetalle")]
       public string centrocostocdetalle { set; get; }

    }
}
