using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarOperacionCxCDal {


        /// <summary>
        /// Metodo que entrega una cuenta por cobrar por operacion.
        /// </summary>
        /// <param name="coperacion">Número de operación.</param>
        /// <param name="numcuota">Número de cuota.</param>
        /// <param name="csaldo">Tipo de Saldo.</param>
        /// <returns></returns>
        public static tcaroperacioncxc Find(string coperacion, int numcuota, string csaldo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacioncxc obj = contexto.tcaroperacioncxc.AsNoTracking().Where(x => x.coperacion == coperacion && x.numcuota == numcuota && x.csaldo == csaldo).SingleOrDefault();
            if (obj == null) {
                return obj;
            }
            return obj;
        }

        /// Consulta en la base de datos cxc a incluir en la tabla de amortizacion de la operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>TcarOperacionCxCDto</returns>
        public static List<tcaroperacioncxc> Find(String coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcaroperacioncxc.AsNoTracking().Where(x => x.coperacion == coperacion).ToList();
        }

        /// <summary>
        /// Crea un objeto TcarOperacionCxCDto, y lo inserta en la base de datos.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="monto">Monto de transaccion.</param>
        /// <param name="csaldo">Codigo de saldo contable.</param>
        /// <param name="numcuota">Numero de cuota.</param>
        /// <param name="fvigencia">Fecha de Vigencia.</param>
        /// <param name="fpago">Fecha de pago.</param>
        public static void Crear(RqMantenimiento rqmantenimiento, String coperacion, decimal monto, string csaldo, int numcuota, int fvigencia)
        {
            tcaroperacioncxc cxc = new tcaroperacioncxc();

            cxc.coperacion = coperacion;
            cxc.numcuota = numcuota;
            cxc.csaldo = csaldo;
            cxc.fvigencia = fvigencia;
            cxc.monto = monto;
            cxc.fpago = null;
            cxc.mensaje = rqmantenimiento.Mensaje;
            Sessionef.Save(cxc);
        }
        /// <summary>
        /// Enterga una lista de rubros tipo capital, dado una lista de rubros de una cuota.
        /// </summary>
        /// <param name="rubroscuota">Lista que contien los rubros asociados a una cuota.</param>
        /// <param name="csaldo">Codigo de saldo a obetener datos del rubro.</param>
        /// <returns>TcarOperacionCxC</returns>
        public static tcaroperacioncxc FindPorCodigoSaldo(tcaroperacionrubro rubro)
        {
            tcaroperacioncxc cxc = TcarOperacionCxCDal.Find(rubro.coperacion, rubro.numcuota, rubro.csaldo);
            return cxc;
        }

        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de cuentas por cobrar, para una operacion y numero de mensaje.
        /// </summary>
        private static String JPQL_DELETEMAYOROIGUALACUOTA = "delete from TcarOperacionCxC where coperacion = @coperacion and numcuota >= @numcuota";

        /// <summary>
        /// Elimina registros de cuotas dado un numero de operacion y mensaje.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>int</returns>
        public static int Delete(String coperacion, int numcuota)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                return contexto.Database.ExecuteSqlCommand(JPQL_DELETEMAYOROIGUALACUOTA, new SqlParameter("coperacion", coperacion), new SqlParameter("numcuota", numcuota));
            }
            catch (System.InvalidOperationException) {
                return 0;
            }
        }

        /// <summary>
        /// Metodo que se encarga de activar cuentas por cobrar lee registros de la tabla tcaroperacioncxcreverso y los pone en la tabla tcaroperacioncxc.
        /// La fecha de vigencia del registro es la fecha de proceso asociada a la operacion.
        /// Elimina los registros de la tabla tcaroperacioncxcreverso, para el numeor de mensaje y operacion.
        /// Si no existe registros en la tabla tcaroperacioncxcreverso, no recupera registros.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje con el cual se obtiene registros a activar.</param>
        /// <param name="coperacion">Numero de operacion de cartera con la cual se obtiene registros a activar.</param>
        /// <param name="fproceso">Fecha de proceso, es la fecha de vigencia del registro que se activa.</param>
        /// <returns></returns>
        public static void ActivarCxC(String mensaje, String coperacion, int fproceso)
        {
            List<tcaroperacioncxcreverso> lreverso = lreverso = TcarOperacionCxCReversoDal.FindAndDetach(mensaje, coperacion);
            Boolean elimino = false;
            Boolean reverso = false;
            foreach (tcaroperacioncxcreverso cxcreverso in lreverso) {
                TcarOperacionCxCDal.ActivaCxC(cxcreverso, fproceso);
                reverso = true;
                if (!elimino && (cxcreverso.fvigencia != fproceso)) {
                    TcarOperacionCxCHistoriaDal.Delete(mensaje, coperacion);
                    elimino = true;
                }
            }
            // Elimina registros de cxc reverso.
            if (reverso) {
                TcarOperacionCxCReversoDal.Delete(mensaje, coperacion);
            }
        }

        /// <summary>
        /// Crea un objeto de tipo TcarOperacionCxC, con los datos de TcarOperacionCxCReverso.
        /// </summary>
        /// <param name="cxcreverso">Objeto que contiene los datos de TcarOperacionCxCReverso con los que se crea los datos de la cxc.</param>
        /// <param name="fproceso">Fecha con la cual se activa el registro.</param>
        /// <returns></returns>
        private static void ActivaCxC(tcaroperacioncxcreverso cxcreverso, int fproceso)
        {
            tcaroperacioncxc obj = new tcaroperacioncxc();
            obj.coperacion = cxcreverso.coperacion;
            obj.numcuota = cxcreverso.numcuota;
            obj.csaldo = cxcreverso.csaldo;
            obj.fvigencia = cxcreverso.fvigencia;
            obj.monto = cxcreverso.monto;
            obj.fpago = cxcreverso.fpago;
            obj.mensaje = (cxcreverso.mensajerecuperar);

            Sessionef.Grabar(obj);
        }

        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de cxc, para una operacion y numero de mensaje.
        /// </summary>
        private static String JPQL_DELETE = "delete from TcarOperacionCxC where mensaje = @mensaje and coperacion = @coperacion ";

        /// <summary>
        /// Elimina registros de cxc dado un numero de operacion y mensaje.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>int</returns>
        public static int Delete(String mensaje, String coperacion)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                return contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("mensaje", mensaje), new SqlParameter("coperacion", coperacion));
            }
            catch (System.InvalidOperationException) {
                return 0;
            }

        }
    }
}
