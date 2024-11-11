using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;
using modelo.helper.cartera;
using System.Data.SqlClient;

namespace dal.cartera {
    public class TcarOperacionCxCHistoriaDal {

        /// <summary>
        /// Metodo que entrega una cuenta por cobrar por operacion.
        /// </summary>
        /// <param name="coperacion">Número de operación.</param>
        /// <param name="numcuota">Número de cuota.</param>
        /// <param name="csaldo">Tipo de Saldo.</param>
        /// <param name="fcaducidad">Fecha de Caducidad.</param>
        /// <returns></returns>
        public static tcaroperacioncxchistoria Find(string coperacion, int numcuota, string csaldo, int fcaducidad)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacioncxchistoria obj = contexto.tcaroperacioncxchistoria.AsNoTracking().Where(x => x.coperacion == coperacion && x.numcuota == numcuota && x.csaldo == csaldo && x.fcaducidad == fcaducidad).SingleOrDefault();
            if (obj == null) {
                return obj;
            }
            return obj;
        }

        /// <summary>
        /// Crea un objeto TcarOperacionCxCHistoriaDto, y lo inserta en la base de datos.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="monto">Monto de transaccion.</param>
        /// <param name="csaldo">Codigo de saldo contable.</param>
        /// <param name="numcuota">Numero de cuota.</param>
        /// <param name="fvigencia">Fecha de Vigencia.</param>
        /// <param name="fpago">Fecha de pago.</param>
        public static void Crear(RqMantenimiento rqmantenimiento, string coperacion, string csaldo, int numcuota, decimal monto, int fvigencia, string mensaje)
        {
            tcaroperacioncxchistoria cxc = new tcaroperacioncxchistoria();

            int fcaducidad = Fecha.AdicionaDias365((int)rqmantenimiento.Fproceso, -1);

            cxc.coperacion = coperacion;
            cxc.csaldo = csaldo;
            cxc.numcuota = numcuota;
            cxc.fcaducidad = fcaducidad;
            cxc.particion = Constantes.GetParticion(rqmantenimiento.Fconatable);
            cxc.fvigencia = fvigencia;
            cxc.monto = monto;
            cxc.mensaje = mensaje;
            Sessionef.Save(cxc);
        }

        public static tcaroperacioncxchistoria FindPorCodigoSaldo(RqMantenimiento rqmantenimiento, tcaroperacionrubro rubro)
        {
            int fcaducidad = Fecha.AdicionaDias365((int)rqmantenimiento.Fproceso, -1);

            tcaroperacioncxchistoria cxc = TcarOperacionCxCHistoriaDal.Find(rubro.coperacion, rubro.numcuota, rubro.csaldo, fcaducidad);
            return cxc;
        }


        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TcarOperacionCxCDto.
        /// </summary>
        /// <param name="tcaroperacioncxc">Objeto que contiene los datos a generar historia.</param>
        /// <param name="fproceso">Fecha de proceso con la cual se genera el registro de historia.</param>
        /// <param name="mensaje">Numero de mensaje con el que se crea el registro de reverso.</param>
        /// <param name="generaregistroreverso">True indica que se crea un registro en la tabla TcarOperacionRubroReverso, para ejecutar reversos de cajero.</param>
        /// <returns>int</returns>
        public static void RegistraHistoria(tcaroperacioncxc tcaroperacioncxc, int fproceso, String mensaje, Boolean generaregistroreverso)
        {
            if (generaregistroreverso && !tcaroperacioncxc.Registroregistrosreverso) {
                TcarOperacionCxCReversoDal.RegistraHistoria(tcaroperacioncxc, fproceso, mensaje);
            }
            // Cambia los mensajes del bean principal.
            tcaroperacioncxc.mensaje = (mensaje);
            if ((tcaroperacioncxc.fvigencia >= (fproceso))
                    || Constantes.EsUno(tcaroperacioncxc.GetString("registrohistoria"))) {
                return;
            }
            TcarOperacionCxCHistoriaDal.Historia(tcaroperacioncxc, fproceso);
            tcaroperacioncxc.AddDatos("registrohistoria", "1");
            tcaroperacioncxc.fvigencia = (fproceso);
        }

        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TcarOperacionCxCDto.
        /// </summary>
        /// <param name="tcaroperacioncxc">Objeto que contiene los datos a generar historia.</param>
        /// <param name="fproceso">Fecha de proceso con la cual se genera el registro de historia.</param>
        /// <returns>int</returns>
        private static void Historia(tcaroperacioncxc tcaroperacioncxc, int fproceso)
        {
            int fcaducidad = Fecha.AdicionaDias365(fproceso, -1);

            tcaroperacioncxchistoria obj = new tcaroperacioncxchistoria();
            obj.coperacion = tcaroperacioncxc.coperacion;
            obj.csaldo = tcaroperacioncxc.csaldo;
            obj.numcuota = tcaroperacioncxc.numcuota;
            obj.fcaducidad = fcaducidad;
            obj.particion = Constantes.GetParticion(fcaducidad);
            obj.fvigencia = tcaroperacioncxc.fvigencia;
            obj.monto = tcaroperacioncxc.monto;
            obj.mensaje = tcaroperacioncxc.mensaje;

            Sessionef.Grabar(obj);
        }

        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de cxc, para una operacion y numero de mensaje.
        /// </summary>
        private static String JPQL_DELETE = "delete from TcarOperacionCxCHistoria where mensaje = @mensaje and coperacion = @coperacion ";

        /// <summary>
        /// Elimina registros de historia de cxc dado un numero de operacion y mensaje.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>int</returns>
        public static int Delete(String mensaje, String coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("mensaje", mensaje), new SqlParameter("coperacion", coperacion));
        }
    }
}
