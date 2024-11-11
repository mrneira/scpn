using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.datos
{
    public class Saldo
    {
        public decimal valor { get; set; }
        public string saldo { get; set; }
        public string centroCosto { get; set; }
        public bool debito { get; set; }
        public bool ingreso { get; set; }
        public Saldo(decimal valor, string saldo,string centroCosto,bool debito) {
            this.valor = valor;
            this.saldo = saldo;
            this.centroCosto = centroCosto;
            this.debito = debito;
        }
        public Saldo()
        {
            
        }
    }
}
