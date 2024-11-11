using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace util.parser {

    public class ParserJson {

        public static object ToObject(string json, object tipo) {
            Type t = tipo.GetType();
            object mdatos = JsonConvert.DeserializeObject<dynamic> (json);
            return mdatos;
        }
    }

}
