using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;
using System;
using util.thread;
using System.Data.SqlClient;
using modelo.helper.cartera;
using System.Reflection;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionRubro.
    /// </summary>
    public class TcarOperacionRubroDal {

        /// <summary>
        /// Entrega lista de cuotas pendientes de pago.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="minnumerocuota">Cuota desde la cual se busca cuotas no pagadas.</param>
        /// <returns></returns>
        public static IList<tcaroperacionrubro> FindNoPagadas(String coperacion, int minnumerocuota) {
            IList<tcaroperacionrubro> lmovi = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            lmovi = contexto.tcaroperacionrubro.Where(x => x.coperacion == coperacion && x.numcuota >= minnumerocuota).OrderBy(x => x.numcuota).ToList();
            return lmovi;
        }

        /// <summary>
        /// Enterga una lista de rubros tipo capital, dado una lista de rubros de una cuota.
        /// </summary>
        /// <param name="rubroscuota">Lista que contien los rubros asociados a una cuota.</param>
        /// <returns>List TcarOperacionRubro </returns>
        public static List<tcaroperacionrubro> FindCapital(IList<tcaroperacionrubro> rubroscuota) {
            List<tcaroperacionrubro> lcapital = new List<tcaroperacionrubro>();
            foreach (tcaroperacionrubro rubro in rubroscuota) {
                if (!(bool)rubro.esaccrual && (rubro.csaldo.StartsWith("CAP-"))) {
                    lcapital.Add(rubro);
                }
            }
            return lcapital;
        }

        /// <summary>
        /// Enterga una lista de rubros tipo capital, dado una lista de rubros de una cuota.
        /// </summary>
        /// <param name="rubroscuota">Lista que contien los rubros asociados a una cuota.</param>
        /// <param name="csaldo">Codigo de saldo a obetener datos del rubro.</param>
        /// <returns>TcarOperacionRubro</returns>
        public static tcaroperacionrubro FindPorCodigoSaldo(IList<tcaroperacionrubro> rubroscuota, String csaldo) {
            tcaroperacionrubro rubro = null;
            foreach (tcaroperacionrubro obj in rubroscuota) {
                if (obj.csaldo == csaldo) {
                    rubro = obj;
                }
            }
            return rubro;
        }

        public static tcaroperacionrubro FindPorCsaldoStart(IList<tcaroperacionrubro> rubroscuota, String csaldo) {
            tcaroperacionrubro rubro = null;
            foreach (tcaroperacionrubro obj in rubroscuota) {
                if (obj.csaldo.StartsWith(csaldo)) {
                    rubro = obj;
                }
            }
            return rubro;
        }

        public static tcaroperacionrubro FindPorNumcuotaSaldo(String coperacion, int numcuota, String csaldo) {
            tcaroperacionrubro rubro = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            rubro = contexto.tcaroperacionrubro.Where(x => x.coperacion == coperacion && x.numcuota == numcuota && x.csaldo == csaldo).SingleOrDefault();     
            return rubro;
        }

        /// <summary>
        /// Crea un rubro.
        /// </summary>
        /// <param name="cuota">Datos de la cuota a la cual se asocia el rubro.</param>
        /// <param name="csaldo">Codigo de saldo con el cual se crea el rubro.</param>
        /// <param name="valorcuota">Monto o valor de cuota asociado al rubro.</param>
        /// <param name="fvigenecia">Fecha de vigenecia del registro.</param>
        /// <param name="esaccrual">1, Indica que el rubro es un accrual, 0 es un saldo ejemplo capital.</param>
        /// <returns>TcarOperacionRubro</returns>
        public static tcaroperacionrubro CreaRubro(tcaroperacioncuota cuota, String csaldo, decimal valorcuota, int fvigenecia,
                Boolean esaccrual) {
            tcaroperacionrubro rubro = new tcaroperacionrubro();
            rubro.coperacion = cuota.coperacion;
            rubro.csaldo = csaldo;
            rubro.numcuota = cuota.numcuota;
            rubro.fvigencia = (fvigenecia);
            rubro.valorcuota = (valorcuota);
            rubro.interesdeudor = (Constantes.CERO);
            rubro.esaccrual = ((esaccrual == null) ? false : esaccrual);
            rubro.montoparaaccrual = (Constantes.CERO);
            rubro.accrual = (Constantes.CERO);
            rubro.saldo = (Constantes.CERO);
            rubro.cobrado = (Constantes.CERO);
            rubro.descuento = (Constantes.CERO);
            rubro.accrualotrosanios = (Constantes.CERO);
            if (ThreadNegocio.GetDatos().Request != null) {
                rubro.mensaje = (ThreadNegocio.GetDatos().Request.Mensaje);
            }

            return rubro;
        }

        /// <summary>
        /// Metodo que entrega el saldo del accrual de un rubro asociado a una cuota de una operacion.
        /// </summary>
        /// <param name="rubro">Objeto que contiene los datos de un rubro de una operacion de cartera.</param>
        /// <param name="fcalculo">Fecha hasta las cual se calcula el saldo de accrual.</param>
        /// <param name="decimales">Numero de decimales a los cuales se redondea el saldo.</param>
        /// <returns>decimal</returns>
        public static decimal GetSaldoAccrual(tcaroperacioncuota cuota, tcaroperacionrubro rubro, int fcalculo, int decimales) {
            if (rubro == null) {
                return Constantes.CERO;
            }
            // calcula el interes hasta hoy no hasta la fecha de calculo.
            int fechaaux = (int)rubro.fvigencia;
            if (cuota.finicio > rubro.fvigencia) {
                fechaaux = (int)cuota.finicio;
            }
            int dias = 0;
            if (fcalculo >= fechaaux) {
                // cuando se da de baja cuotas futuras el saldo del interes es cero.
                dias = Fecha.Resta365(fcalculo, fechaaux);
            }

            if (dias < 0) {
                dias = 0;
            }
            decimal saldo = (decimal)rubro.saldo;
            //saldo = saldo + ((decimal)rubro.interesdeudor);   // no hay que sumar el interes deudor
            saldo = saldo - ((decimal)rubro.cobrado);
            saldo = saldo - ((decimal)rubro.descuento);
            saldo = saldo + ((decimal)rubro.accrual * (new decimal(dias)));
            saldo = Math.Round(saldo / Constantes.UNO, decimales, MidpointRounding.AwayFromZero);

            // Calcula el interes siempre hasta hoy no hasta el de la cuota.*****************

            return saldo;
        }

        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de rubros de cuotas, para una operacion y numero de mensaje.
        /// </summary>
        private static String JPQL_DELETE = "delete from TcarOperacionRubro where mensaje = @mensaje and coperacion = @coperacion ";

        /// <summary>
        /// Elimina registros de rubro de cuotas dado un numero de operacion y mensaje.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns></returns>
        public static int Delete(String mensaje, String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("mensaje", mensaje), new SqlParameter("coperacion", coperacion));
        }

        private static string JPQL_UPDATE_CODIGO_CONTABLE = "update TcarOperacionRubro set codigocontable = null where mensaje = @mensaje and coperacion = @coperacion ";

        /// <summary>
        /// Actualiza a null el codigo contable de la tabla de amortizacion.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static int ReversaCodigoContable(String mensaje, String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.Database.ExecuteSqlCommand(JPQL_UPDATE_CODIGO_CONTABLE, new SqlParameter("mensaje", mensaje), new SqlParameter("coperacion", coperacion));
        }

        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de rubros de cuotas, para una operacion y numero de de cuota.
        /// </summary>
        private static String JPQL_DELETE_MAYOROIGUAL = "delete from TcarOperacionRubro where coperacion = @coperacion and numcuota >= @numcuota ";

        /// <summary>
        /// Elimina registros de rubro de cuotas dado un numero de operacion y mensaje.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <param name="numcuota">Numero de cuota desde la cual se elimina registros.</param>
        /// <returns></returns>
        public static void Delete(String coperacion, int numcuota) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE_MAYOROIGUAL, new SqlParameter("coperacion", coperacion), new SqlParameter("numcuota", numcuota));
        }

        /// <summary>
        /// Metodo que se encarga de activar rubros lee registros de cuotas de la tabla tcaroperacionrubroreverso y los pone en la tabla tcaroperacionrubro.
        /// La fecha de vigencia del registro es la fecha de proceso asociada a la operacion.
        /// Elimina los registros de la tabla tcaroperacioncuotareverso, para el numeor de mensaje y operacion.
        /// Si no existe registros en la tabla tcaroperacioncuotareverso, no recupera registros.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje con el cual se obtiene registros a activar.</param>
        /// <param name="coperacion">Numero de operacion de cartera con la cual se obtiene registros a activar.</param>
        /// <param name="fproceso">Fecha de proceso, es la fecha de vigencia del registro que se activa.</param>
        /// <returns></returns>
        public static void Activarcuotas(String mensaje, String coperacion, int fproceso) {
            List<tcaroperacionrubroreverso> lreverso = TcarOperacionRubroReversoDal.FindAndDetach(mensaje, coperacion);
            Boolean eliminohistoria = false;
            Boolean reverso = false;
            foreach (tcaroperacionrubroreverso rubroreverso in lreverso) {
                TcarOperacionRubroDal.Activacuota(rubroreverso, fproceso);
                reverso = true;
                if (!eliminohistoria && (rubroreverso.fvigencia != fproceso)) {
                    TcarOperacionRubroHistoriaDal.Delete(mensaje, coperacion);
                    eliminohistoria = true;
                }
            }
            // Elimina registros de tabla de rubros reverso.
            if (reverso) {
                TcarOperacionRubroReversoDal.Delete(mensaje, coperacion);
            }
        }

        /// <summary>
        /// Crea un objeto de tipo TcarOperacionRubro, con los datos de TcarOperacionRubroReverso.
        /// </summary>
        /// <param name="rubro">cuotareverso Objeto que contiene los datos de TcarOperacionRubroReverso con los que se crea los datos de la cuota.</param>
        /// <param name="fproceso">Fecha con la cual se activa el registro.</param>
        /// <returns></returns>
        private static void Activacuota(tcaroperacionrubroreverso rubroreverso, int fproceso) {
            tcaroperacionrubro obj = new tcaroperacionrubro();
            obj.coperacion = rubroreverso.coperacion;
            obj.numcuota = rubroreverso.numcuota;
            obj.csaldo = rubroreverso.csaldo;
            obj.mensaje = (rubroreverso.mensajerecuperar);

            Rubro r = new Rubro();
            IEnumerable<FieldInfo> lcamposrubro = r.GetType().GetAllFields();
            List<String> lcampos = DtoUtil.GetCamposSinPK(obj);
            foreach (String campo in lcampos) {
                if (campo.Equals("mensaje")) {
                    continue;
                }
                // para no generar hsitorico de campos de la clase padre Rubro
                if (DtoUtil.GetCampo(lcamposrubro, campo) != null) {
                    continue;
                }
                try {
                    Object valor = DtoUtil.GetValorCampo(rubroreverso, campo);
                    DtoUtil.SetValorCampo(obj, campo, valor);
                } catch (Exception) {
                    throw new AtlasException("BCAR-0013", "CAMPO: {0} NO DEFINIDO EN LA TABLA : {1} ", campo);
                }
            }
            Sessionef.Save(obj);
        }

        /// <summary>
        /// Metodo que elimina de la base de datos el registo de tcaroperacionrubro, e inserta un nuevo con el nuevo codigo de saldos.
        /// </summary>
        /// <param name="rubro">Objeto que contiene la informacion de un rubro de una cuota.</param>
        /// <param name="csaldo">Nuevo codigo de saldo al que se asocia el rubro.</param>
        /// <returns>TcarOperacionRubro</returns>
        public static tcaroperacionrubro CambiarCodigoSaldo(tcaroperacionrubro rubro, tcarcambioestado tcarCambioEstado) {
            String csaldo = tcarCambioEstado.csaldodestino;
            if ((csaldo == null) || rubro.csaldo.Equals(csaldo)) {
                return null;
            }
            tcaroperacionrubro nuevo = (tcaroperacionrubro)rubro.Clone();
            Sessionef.Eliminar(rubro);
            nuevo.csaldo = (csaldo);
            Sessionef.Grabar(nuevo);
            return nuevo;
        }

        private static String JPQL_DELETE_ARREGLO_PAGOS = "delete from tcaroperacionrubro where coperacion = @coperacion ";

        /// <summary>
        /// Ejecuta reverso de arreglo de pagos de la nueva operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion creada en el arreglo de pagos.</param>
        public static void ReversoArregloPagos(String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE_ARREGLO_PAGOS, new SqlParameter("coperacion", coperacion));
        }

        /// <summary>
        /// Entrega lista de cuotas pagadas.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static IList<tcaroperacionrubro> FindPagadas(String coperacion)
        {
            IList<tcaroperacionrubro> lpagos = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            lpagos = contexto.tcaroperacionrubro.Where(x => x.coperacion == coperacion && x.fpago != null).OrderBy(x => x.numcuota).ToList();
            return lpagos;
        }
    }

}
