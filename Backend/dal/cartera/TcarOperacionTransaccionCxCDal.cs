using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionTransaccionCxCDto.
    /// </summary>
    public class TcarOperacionTransaccionCxCDal {

        /// <summary>
        /// Crea un objeto TcarOperacionTransaccionCxCDto, y lo inserta en la base de datos.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="monto">Monto de transaccion.</param>
        /// <param name="csaldo">Codigo de saldo contable.</param>
        /// <param name="numcuota">Numero de cuota afectada en la tabla de amortizacion.</param>
        public static void Crear(RqMantenimiento rqmantenimiento, String coperacion, decimal monto, string csaldo, int numcuota)
        {
            tcaroperaciontransaccioncxc cxc = new tcaroperaciontransaccioncxc();
            cxc.mensaje = rqmantenimiento.Mensaje;
            cxc.coperacion = coperacion;
            cxc.csaldo = csaldo;
            cxc.numcuota = numcuota;
            cxc.particion = Constantes.GetParticion(rqmantenimiento.Fconatable);
            cxc.fcontable = rqmantenimiento.Fconatable;
            cxc.ftrabajo = rqmantenimiento.Ftrabajo;
            cxc.cmodulo = rqmantenimiento.Cmodulotranoriginal;
            cxc.ctransaccion = rqmantenimiento.Ctranoriginal;
            cxc.monto = monto;
            Sessionef.Save(cxc);
        }

        /// <summary>
        /// Metodo que entrega una lista de cuentas por cobrar por operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <param name="mensaje">Codigo de mensaje de transaccion.</param>
        /// <returns></returns>
        public static List<tcaroperaciontransaccioncxc> FindRubrosPorOperacion(string coperacion, string mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcaroperaciontransaccioncxc> rubro = contexto.tcaroperaciontransaccioncxc.Where(x => x.coperacion == coperacion && x.mensaje == mensaje).ToList();
            return rubro;
        }

    }
}
