using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace contabilidad.datos
{
    public class SaldoDto
    {
        public decimal valor { get; set; }
        public string saldo { get; set; }
        public string cuenta { get; set; }
        public SaldoDto(decimal valor, string saldo,string cuenta)
        {
            this.valor = valor;
            this.saldo = saldo;
            this.cuenta = cuenta;
        }
        public SaldoDto()
        {

        }
    }
}
