using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace canalesdigitales.models {
    public class HorarioDisponibleModel {
        public long chorario { get; set; }
        public int cagencia { get; set; }
        public int csucursal { get; set; }
        public int ccompania { get; set; }
        public int fatencion { get; set; }
        public List<string> lhoras { get; set; }
    }
}
