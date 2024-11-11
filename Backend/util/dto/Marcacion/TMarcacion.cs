using modelo.helper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.dto.TMarcacion
{
    public class TMarcacion: AbstractDto
    {
        [JsonProperty("cusuario")]
        public string cusuario { get; set; }
        [JsonProperty("fmarcacion")]
        public string fmarcacion { get; set; }
        [JsonProperty("fingreso")]
        public string fingreso { get; set; }
        [JsonProperty("fecha")]
        public string fecha { get; set; }
        [JsonProperty("biometrico")]
        public int biometrico { get; set; }
        [JsonProperty("marcacion")]
        public int marcacion { get; set; }
        [JsonProperty("eliminado")]
        public bool eliminado { get; set; }
        [JsonProperty("marcacionint")]
        public int marcacionint { get; set; }
        [JsonProperty("esnuevo")]
        public bool esnuevo { get; set; }
        [JsonProperty("actualizar")]
        public bool actualizar { get; set; }
        [JsonProperty("idreg")]
        public int idreg { get; set; }
    }
}
