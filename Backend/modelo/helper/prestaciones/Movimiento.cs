using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace modelo.helper.prestaciones {
    public interface Movimiento {

        string mensaje { get; set; }
        int particion { get; set; }
        int secmensaje { get; set; }
        int? fcontable { get; set; }
        int? ftrabajo { get; set; }
        int? fproceso { get; set; }
        int? fvalor { get; set; }
        DateTime? freal { get; set; }
        int? ctransaccion { get; set; }
        int? cmodulotransaccion { get; set; }
        int? crubro { get; set; }
        string csaldo { get; set; }
        string cclase { get; set; }
        int? ctransaccionorigen { get; set; }
        int? cmoduloorigen { get; set; }
        string cmoneda { get; set; }
        decimal? montomonedalocal { get; set; }
        string cmonedalocal { get; set; }
        decimal? monto { get; set; }
        Boolean? debito { get; set; }
        int? csucursal { get; set; }
        int? cagencia { get; set; }
        int? ccompania { get; set; }
        long? cpersona { get; set; }
        int? csucursalorigen { get; set; }
        int? cagenciaorigen { get; set; }
        string cterminal { get; set; }
        string cusuario { get; set; }
        string cusuarioreverso { get; set; }
        string documento { get; set; }
        string imperativo { get; set; }
        string reverso { get; set; }
        string mensajereverso { get; set; }
        string ccuenta { get; set; }
    }
}
