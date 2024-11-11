using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;

namespace dal.monetario {

    public class TmonMovimientoDal {

        /// <summary> 
        /// Entrega una lista de TmonMOvimiento, son los mensajes a reversar.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje a buscar movimientos.</param>
        /// <returns></returns>
        public static IList<tmonmovimiento> Find(string mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tmonmovimiento> lista = new List<tmonmovimiento>();
            try {
                lista = contexto.tmonmovimiento.Where(x => x.mensaje.Equals(mensaje)).ToList();

            }
            catch (System.InvalidOperationException) {
                throw;
            }
            return lista;
        }


        /// <summary>
        /// Verifica que no exista en el request un key con el mensaje, modulo y operacion, si no existe crea un objeto de tipo TmonMovimiento y  lo almacena en la base de datos.
        /// </summary>
        /// <param name="rqmantenimiento">Datos de requets con el cual se ejecutan transacciones.</param>
        /// <param name="cmodulo">Codigo de modulo asociado a un rubro de una transaccion monetaria.</param>
        /// <param name="coperacion">Numero de operacion que se afecta con el movimiento.</param>
        public static void Crear(RqMantenimiento rqmantenimiento, int cmodulo, string coperacion)
        {
            Dictionary<String, Object> mmov = ThreadNegocio.GetDatos().Mtmonmovimiento;
            if (coperacion == null) {
                coperacion = "0";
            }
            String key = rqmantenimiento.Mensaje + cmodulo + "^" + coperacion;
            if (mmov.ContainsKey(key)) {
                // Si existe en el map el numeor de mensaje, modulo .
                return;
            }
            // System.out.println("datos ==> " + rqmantenimiento.getMensaje() + " " + coperacion + " " + cmodulo);
            //TmonMovimientoDtoKey keymov = new TmonMovimientoDtoKey(rqmantenimiento.Mensaje, cmodulo, coperacion);
            tmonmovimiento mov = new tmonmovimiento();
            mov.mensaje = rqmantenimiento.Mensaje;
            mov.cmodulo = cmodulo;
            mov.coperacion = coperacion;
            mov.fcontable = rqmantenimiento.Fconatable;
            mov.ftrabajo = rqmantenimiento.Ftrabajo;
            mov.fproceso = rqmantenimiento.Fproceso;
            mov.freal = rqmantenimiento.Freal;
            mov.fvalor = rqmantenimiento.Fvalor;
            mov.particion = Constantes.GetParticion(mov.fcontable);
            mov.reverso = rqmantenimiento.Reverso;
            Sessionef.Save(mov);
            mmov[key] = cmodulo;
        }

        private static string SQL_FUTUROS = "select distinct '1' as uno from tmonmovimiento where fcontable = @fcontable and particion = @particion "
            + "and coperacion = @coperacion and reverso = @reverso and mensajereverso is null and freal > @freal";
        /// <summary>
        /// Verifica que no existan transacciones futuras para la operacion, fcontable y particio.
        /// </summary>
        /// <param name="tmonmovimiento">Datos del movimiento a reversar.</param>
        /// <returns></returns>
        public static bool ExisteMovimientosFuturos(tmonmovimiento tmonmovimiento)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            string obj = null;
            try {
                obj = contexto.Database.SqlQuery<string>(SQL_FUTUROS, new SqlParameter("fcontable", tmonmovimiento.fcontable),
                                                                    new SqlParameter("particion", tmonmovimiento.particion),
                                                                    new SqlParameter("coperacion", tmonmovimiento.coperacion),
                                                                    new SqlParameter("reverso", "N"),
                                                                    new SqlParameter("freal", tmonmovimiento.freal)).SingleOrDefault();
                if (obj == null) {
                    return false;
                }
            }
            catch (System.InvalidOperationException) {
                return false;
            }
            return true;
        }

    }

}
