using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.datos
{
    public class ListadoNomina
    {
        [JsonProperty("cfuncionario")]
        public long? cfuncionario { set; get; }
        [JsonProperty("documento")]
        public String documento { set; get; }
        [JsonProperty("ccontrato")]
        public long ccontrato { set; get; }
        [JsonProperty("nombre")]
        public String nombre { set; get; }
        [JsonProperty("cargo")]
        public String cargo { set; get; }
        [JsonProperty("ciudad")]
        public String ciudad { set; get; }
        [JsonProperty("avisoentrada")]
        public int avisoentrada { set; get; }
        [JsonProperty("decimot")]
        public int decimot { set; get; }
        [JsonProperty("decimoc")]
        public int decimoc { set; get; }

    }
}
