using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace prestaciones.dto
{
    public class Saldo
    {
        public decimal valor { get; set; }
        public string saldo { get; set; }
        public bool ingreso { get; set; }

        public Saldo(decimal valor, string saldo,bool ingreso)
        {
            this.valor = valor;
            this.saldo = saldo;
            this.ingreso = ingreso;
        }
        public Saldo()
        {

        }
    }
}
