using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util.dto.consulta;

namespace util.servicios.mail
{
    public class ParametrosEmail
    {
        public string Pservidor { get; set; }
        public string Pfrom { get; set; }
        public string Pusuario { get; set; }
        public string Ppassword { get; set; }
        public int Ppuerto { get; set; }
        public bool Pssl { get; set; }
        public string PAsunto { get; set; }
        public string PCuerpo { get; set; }
    }
}
