using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionTransaccionCxPDal.
    /// </summary>
    public class TcarOperacionTransaccionCxPDal {
        /// <summary>
        /// Crea un objeto TcarOperacionTransaccionRubroDto, y lo inserta en la base de datos.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="mdatos">Dictionary con los valores pagados por tipo de saldo.</param>
        /// <param name="fcontable">Fecha contable en la que se ejecuta la transaccion.</param>
        /// <param name="ftrabajo">Fecha de trabajo en la que se ejecuta la transaccion.</param>
        public static void Crear(RqMantenimiento rqmantenimiento, String coperacion, decimal monto, int fcontable,
                int ftrabajo)
        {
            tcaroperaciontransaccioncxp cxpoperacion = new tcaroperaciontransaccioncxp();
            cxpoperacion.mensaje = rqmantenimiento.Mensaje;
            cxpoperacion.coperacion = coperacion;
            cxpoperacion.particion = Constantes.GetParticion(fcontable);
            cxpoperacion.fcontable = fcontable;
            cxpoperacion.ftrabajo = ftrabajo;
            cxpoperacion.cmodulo = rqmantenimiento.Cmodulotranoriginal;
            cxpoperacion.ctransaccion = rqmantenimiento.Ctranoriginal;
            cxpoperacion.monto = monto;
            Sessionef.Save(cxpoperacion);
        }

        /// <summary>
        /// Metodo que entrega una lista de pagos por operacion cxp.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns></returns>
        public static List<tcaroperaciontransaccioncxp> FindPagosPorOperacion(string coperacion, string mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcaroperaciontransaccioncxp> pagos = contexto.tcaroperaciontransaccioncxp.Where(x => x.coperacion == coperacion && x.mensaje == mensaje).ToList();
            return pagos;
        }
    }
}
