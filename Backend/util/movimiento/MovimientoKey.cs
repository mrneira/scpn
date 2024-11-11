using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.movimiento {

    /// <summary>
    /// Interface que tiene que implemntar los beans de pk que manejan datos de movimientos, ejemplo vista, plazo, prestamos, contabilidad, caja,  etc.
    /// </summary>
    public interface MovimientoKey {
        string Mensaje { get; set; }
        int? Particion { get; set; }
        int? Secmensaje { get; set; }
    }
}
