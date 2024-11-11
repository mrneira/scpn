using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.cartera
{
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionTransaccionRubroDto.
    /// </summary>
    public class TcarOperacionTransaccionRubroDal {

        /// <summary>
        /// Crea un objeto TcarOperacionTransaccionRubroDto, y lo inserta en la base de datos.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="mdatos">Dictionary con los valores pagados por tipo de saldo.</param>
        /// <param name="fcontable">Fecha contable en la que se ejecuta la transaccion.</param>
        /// <param name="ftrabajo">Fecha de trabajo en la que se ejecuta la transaccion.</param>
        public static void Crear(RqMantenimiento rqmantenimiento, String coperacion, Dictionary<String, decimal> mdatos, int fcontable,
                int ftrabajo)
        {
            if (mdatos.Count < 1)
            {
                return;
            }
            foreach (KeyValuePair<String, decimal> keys in mdatos)
            {
                decimal acumulado = keys.Value;
                if (acumulado <= Constantes.CERO)
                    continue;
                tcaroperaciontransaccionrubro rubro = new tcaroperaciontransaccionrubro();
                rubro.mensaje = rqmantenimiento.Mensaje;
                rubro.coperacion = coperacion;
                rubro.csaldo = keys.Key;
                rubro.particion = Constantes.GetParticion(fcontable);
                rubro.fcontable = fcontable;
                rubro.ftrabajo = ftrabajo;
                rubro.cmodulo = rqmantenimiento.Cmodulotranoriginal;
                rubro.ctransaccion = rqmantenimiento.Ctranoriginal;
                rubro.monto = acumulado;
                Sessionef.Save(rubro);
            }
        }

        /// <summary>
        /// Metodo que entrega una lista de movimientos de recuperacion .
        /// </summary>
        /// <param name="coperacion">Numero de operacion asociado al numero de mensaje a reversar.</param>
        /// <returns></returns>
        public static IList<tcaroperaciontransaccionrubro> FindRecuperacion(string coperacion, string mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperaciontransaccionrubro> lmovi = contexto.tcaroperaciontransaccionrubro.Where(x => x.mensaje == mensaje && x.coperacion == coperacion).ToList();
            if (lmovi.Count == 0)
            {
                throw new AtlasException("CAR-0052", "NO EXSTE REGISTROS DE RECUPERACIÓN EN COPERACION: {0}", coperacion);
            }
            return lmovi;
        }

        /// <summary>
        /// Metodo que entrega una lista de pagos por operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns></returns>
        public static List<tcaroperaciontransaccionrubro> FindRubrosPorOperacion(string coperacion, string mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcaroperaciontransaccionrubro> rubro = contexto.tcaroperaciontransaccionrubro.Where(x => x.coperacion == coperacion && x.mensaje == mensaje).ToList();
            return rubro;
        }
        
        /// <summary>
        /// Metodo que entrega una lista de movimientos de recuperacion .
        /// </summary>
        /// <param name="coperacion">Numero de operacion asociado al numero de mensaje a reversar.</param>
        /// <returns></returns>
        public static IList<tcaroperaciontransaccionrubro> FindCancelacion(string coperacion, string mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperaciontransaccionrubro> lmovi = contexto.tcaroperaciontransaccionrubro.Where(x => x.mensaje == mensaje && x.coperacion == coperacion).ToList();
            if (lmovi.Count == 0)
            {
                throw new AtlasException("CAR-0052", "NO EXSTE REGISTROS DE CANCELACIÓN EN COPERACION: {0}", coperacion);
            }
            return lmovi;
        }
    }
}
