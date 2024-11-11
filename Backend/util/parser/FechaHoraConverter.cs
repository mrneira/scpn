using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {

    public class FechaHoraConverter : JsonConverter {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) {
            //((DateTime)value).ToString("yyyy-MM-dd HHmmss");
            if (value != null) {
                DateTime d = (DateTime)value;
                if (d.Hour == 0 && d.Minute == 0 && d.Second == 0) {
                    writer.WriteValue(d.ToString("yyyy-MM-dd"));
                } else {
                    //long l = (d).ToBinary();
                    long l = (long)(d - new DateTime(1970, 1, 1)).TotalMilliseconds;
                    writer.WriteValue(l);
                }
            }

        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer) {
            DateTime? date = null;
            if (reader.Value != null) {
                if(reader.Value is long) {
                    long l = (long)reader.Value;
                    //date = DateTime.FromBinary(l);
                    date = (new DateTime(1970, 1, 1)).AddMilliseconds(l);
                } else {
                    date = DateTime.Parse(reader.Value.ToString());
                }
            }
            return date;
        }

        public override bool CanConvert(Type objectType) {
            return true;
        }
    }
}
