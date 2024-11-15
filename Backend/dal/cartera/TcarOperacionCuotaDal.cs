using dal.cartera.cuenta;
using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using util;
using util.enums;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionCuota.
    /// </summary>
    public class TcarOperacionCuotaDal {

        /// <summary>
        /// Entrega una lista de cuotas pendientes de pago. Incluye los rubros pendientes de pago asociados a la cuota.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera a buscar cuotas no pagadas.</param>
        /// <returns>List TcarOperacionCuota</returns>
        public static List<tcaroperacioncuota> FindNoPagadas(String coperacion) {
            List<tcaroperacioncuota> lcuotas = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            lcuotas = contexto.tcaroperacioncuota.Where(x => x.coperacion == coperacion && x.fpago == null).OrderBy(x => x.numcuota).ToList();
            if (lcuotas.Count.Equals(0)) {
                return lcuotas;
            }
            int minnumerocuota = lcuotas[0].numcuota;
            List<tcaroperacionrubro> lrubros = (List<tcaroperacionrubro>)TcarOperacionRubroDal.FindNoPagadas(coperacion, minnumerocuota);
            foreach (tcaroperacioncuota cuota in lcuotas) {
                TcarOperacionCuotaDal.CompletarRubrosEnCuotas(cuota, lrubros);
            }
            return lcuotas;
        }

        /// <summary>
        /// Entrega la última cuota pagada dado el numero de operacion
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera a buscar cuotas no pagadas.</param>
        /// <returns>TcarOperacionCuota</returns>
        private static string ULT_SQL = "select * from TcarOperacionCuota t where coperacion = @coperacion and fpago is not null order by fpago desc, numcuota desc";

        public static tcaroperacioncuota FindUltimaCuotaPagada(String coperacion) {
            IList<tcaroperacioncuota> ldatos = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldatos = contexto.tcaroperacioncuota.SqlQuery(ULT_SQL, new SqlParameter("@coperacion", coperacion)).ToList();
            if (ldatos.Count > 0) {
                return ldatos[0];
            }
            return null;

        }

        /// <summary>
        /// Entrega las Cuotas hasta una fecha en específico
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera a buscar.</param>
        /// <returns>IList<TcarOperacionCuota></TcarOperacionCuota></returns>
        public static IList<tcaroperacioncuota> FindCuotasHastaFecha(String coperacion, int fvencimiento)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcaroperacioncuota.Where(x => x.coperacion == coperacion && x.fvencimiento <= fvencimiento).OrderBy(x => x.fvencimiento).ToList(); 
        }

        /// <summary>
        /// Adiciona rubros a la cuota.
        /// </summary>
        /// <param name="cuota">Datos de la cuota a adicionar rubros.</param>
        /// <param name="lrubros">Lista de rubros de la operacion.</param>
        /// <param name="inicio">Indice desde el cual busca rubros asociados a una cuota.</param>
        /// <returns></returns>
        private static void CompletarRubrosEnCuotas(tcaroperacioncuota cuota, List<tcaroperacionrubro> lrubros) {
            List<tcaroperacionrubro> rubroscuota = new List<tcaroperacionrubro>();
            foreach (tcaroperacionrubro rubro in lrubros) {
                if (rubro.numcuota == cuota.numcuota) {
                    rubroscuota.Add(rubro);
                }
            }
            cuota.SetRubros(rubroscuota);
        }

        /// <summary>
        /// Metodo que busca y entrega los datos de una cuota asociada a un prestamo, dado el numero de cuota.
        /// </summary>
        /// <param name="lcuotas">Lista de cuotas asociadas a una operacion.</param>
        /// <param name="numcuota">Numero de cuota a buscar en la lista.</param>
        /// <returns></returns>
        public static tcaroperacioncuota Find(List<tcaroperacioncuota> lcuotas, int numcuota) {
            tcaroperacioncuota cuota = null;
            foreach (tcaroperacioncuota obj in lcuotas) {
                if ((obj.numcuota == numcuota)) {
                    cuota = obj;
                    break;
                }
            }
            return cuota;
        }

        /// <summary>
        /// Se obtienen las cuotas según los códigos de las operaciones
        /// </summary>
        /// <param name="lcuotas"></param>
        /// <param name="numcuota"></param>
        /// <returns></returns>
        public static IList<tcaroperacioncuota> FindCuotasPorCoperaciones(List<string> coperaciones) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperacioncuota> ldata = contexto.tcaroperacioncuota.AsNoTracking().Where(x => coperaciones.Contains(x.coperacion)).ToList();

            return ldata;
        }



        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de cuotas, para una operacion y numero de mensaje.
        /// </summary>
        private static String JPQL_DELETE = "delete from TcarOperacionCuota where mensaje = @mensaje and coperacion = @coperacion ";

        /// <summary>
        /// Elimina registros de cuotas dado un numero de operacion y mensaje.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>int</returns>
        public static int Delete(String mensaje, String coperacion) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                return contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("mensaje", mensaje), new SqlParameter("coperacion", coperacion));
            } catch (System.InvalidOperationException) {
                return 0;
            }

        }

        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de cuotas, para una operacion y numero de mensaje.
        /// </summary>
        private static String JPQL_DELETEMAYOROIGUALACUOTA = "delete from TcarOperacionCuota where coperacion = @coperacion and numcuota >= @numcuota";

        /// <summary>
        /// Elimina registros de cuotas dado un numero de operacion y mensaje.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>int</returns>
        public static int Delete(String coperacion, int numcuota) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                return contexto.Database.ExecuteSqlCommand(JPQL_DELETEMAYOROIGUALACUOTA, new SqlParameter("coperacion", coperacion), new SqlParameter("numcuota", numcuota));
            } catch (System.InvalidOperationException) {
                return 0;
            }

        }

        /// <summary>
        /// Metodo que se encarga de activar cuotas lee registros de cuotas de la tabla tcaroperacioncuotareverso y los pone en la tabla tcaroperacioncuota.
        /// La fecha de vigencia del registro es la fecha de proceso asociada a la operacion.
        /// Elimina los registros de la tabla tcaroperacioncuotareverso, para el numeor de mensaje y operacion.
        /// Si no existe registros en la tabla tcaroperacioncuotareverso, no recupera registros.
        /// </summary>
        /// <param name="mensaje">Numero de mensaje con el cual se obtiene registros a activar.</param>
        /// <param name="coperacion">Numero de operacion de cartera con la cual se obtiene registros a activar.</param>
        /// <param name="fproceso">Fecha de proceso, es la fecha de vigencia del registro que se activa.</param>
        /// <returns></returns>
        public static void Activarcuotas(String mensaje, String coperacion, int fproceso) {
            List<tcaroperacioncuotareverso> lreverso = lreverso = TcarOperacionCuotaReversoDal.FindAndDetach(mensaje, coperacion);
            Boolean elimino = false;
            Boolean reverso = false;
            foreach (tcaroperacioncuotareverso cuotareverso in lreverso) {
                TcarOperacionCuotaDal.Activacuota(cuotareverso, fproceso);
                reverso = true;
                if (!elimino && (cuotareverso.fvigencia != fproceso)) {
                    TcarOperacionCuotaHistoriaDal.Delete(mensaje, coperacion);
                    elimino = true;
                }
            }
            // Elimina registros de cuota reverso.
            if (reverso) {
                TcarOperacionCuotaReversoDal.Delete(mensaje, coperacion);
            }
        }

        /// <summary>
        /// Crea un objeto de tipo TcarOperacionCuota, con los datos de TcarOperacionCuotaReverso.
        /// </summary>
        /// <param name="cuotareverso">Objeto que contiene los datos de TcarOperacionCuotaReverso con los que se crea los datos de la cuota.</param>
        /// <param name="fproceso">Fecha con la cual se activa el registro.</param>
        /// <returns></returns>
        private static void Activacuota(tcaroperacioncuotareverso cuotareverso, int fproceso) {

            tcaroperacioncuota obj = new tcaroperacioncuota();
            obj.coperacion = cuotareverso.coperacion;
            obj.numcuota = cuotareverso.numcuota;
            obj.mensaje = (cuotareverso.mensajerecuperar);

            Cuota r = new Cuota();
            IEnumerable<FieldInfo> lcamposcuota = r.GetType().GetAllFields();
            List<String> lcampos = DtoUtil.GetCamposSinPK(obj);
            foreach (String campo in lcampos) {
                if (campo.Equals("mensaje")) {
                    continue;
                }
                // para no generar hsitorico de campos de la clase padre Cuota
                if (DtoUtil.GetCampo(lcamposcuota, campo) != null) {
                    continue;
                }
                try {
                    Object valor = DtoUtil.GetValorCampo(cuotareverso, campo);
                    DtoUtil.SetValorCampo(obj, campo, valor);
                } catch (Exception) {
                    throw new AtlasException("BCAR-0013", "CAMPO: {0} NO DEFINIDO EN LA TABLA : {1}s ", campo, obj.GetType().Name);
                }
            }
            Sessionef.Grabar(obj);
        }

        /// <summary>
        /// Metodo que verifica si una cuota esta vencida en fecha o pagada, retorna true;
        /// </summary>
        /// <param name="cuota">Datos de la cuota.</param>
        /// <param name="fproceso">Fecha de proceso</param>
        /// <returns>Boolean</returns>
        public static Boolean EstavencidaOpagada(tcaroperacioncuota cuota, int? fproceso) {
            if ((cuota.fvencimiento <= fproceso) || (cuota.fpago != null)) {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Valida si la operacion tien cuotas vencidad.
        /// </summary>
        /// <param name="lcuotas"></param>
        /// <param name="fproceso"></param>
        /// <returns></returns>
        public static Boolean TieneCuotasVencidas(List<tcaroperacioncuota> lcuotas, int? fproceso) {
            Boolean existe = false;
            foreach (tcaroperacioncuota cuota in lcuotas) {
                // Ejecuta cambio de estatus si el estatus es diferente y tiene cuotas venciadas
                if (TcarOperacionCuotaDal.EstavencidaOpagada(cuota, fproceso)) {
                    existe = true;
                    break;
                }
            }
            return existe;
        }

        /// <summary>
        /// Entrega el codigo de banda en el que debe estar una cuota de una operacion de cartera.
        /// </summary>
        /// <param name="cuota">Datos de cabecera de una cuota de una operacion de cartera.</param>
        /// <param name="fproceso">Fecha de proceso con la cual se calcula el numero de dias.</param>
        /// <returns>int</returns>
        public static int Cambiobanda(tcaroperacion operacion, tcaroperacioncuota tccuota, int fproceso) {
            int dias = TcarOperacionCuotaDal.GetDias(tccuota, fproceso);
            tcarperfilebanda perfilbanda = TcarPerfilBandaDal.Find((int)operacion.cmodulo, (int)operacion.cproducto, (int)operacion.ctipoproducto,
                                                                   tccuota.cestatus, tccuota.cestadooperacion, operacion.csegmento, dias);
            return (int)perfilbanda.cbanda;
        }

        /// <summary>
        /// Entrega el numero de dias que existe entre la fecha de vencimiento de una cuota y la fecha de proceso.
        /// </summary>
        /// <param name="cuota">Datos que contiene la cabecera de una cuota.</param>
        /// <param name="fproceso">Fecha de proceso.</param>
        /// <returns>int</returns>
        public static int GetDias(tcaroperacioncuota cuota, int fproceso) {
            int dias = 0;
            if (fproceso >= cuota.fvencimiento) {
                dias = Fecha.Resta365(fproceso, (int)cuota.fvencimiento);
            } else {
                dias = Fecha.Resta365((int)cuota.fvencimiento, fproceso);
            }
            return dias;
        }

        /// <summary>
        /// Entrega el saldo de un rubro dado la cuota y el tipo de rubro
        /// </summary>
        /// <param name="tcarOperacionCuota"></param>
        /// <param name="csaldo"></param>
        /// <returns></returns>
        public static decimal GetSaldoRubro(tcaroperacioncuota tcarOperacionCuota, String csaldo) {
            tcaroperacionrubro rubro = null;
            rubro = TcarOperacionCuotaDal.GetRubroPorTipo(tcarOperacionCuota, csaldo);
            return (decimal)(rubro.saldo - (rubro.cobrado) - (rubro.descuento));
        }

        /// <summary>
        /// Entrega un rubro dado el tipo
        /// </summary>
        /// <param name="tcarOperacionCuota"></param>
        /// <param name="csaldo"></param>
        /// <returns>TcarOperacionRubro </returns>
        public static tcaroperacionrubro GetRubroPorTipo(tcaroperacioncuota tcarOperacionCuota, String csaldo) {
            tcaroperacionrubro rubro = null;
            List<tcaroperacionrubro> lrubros = new List<tcaroperacionrubro>();
            lrubros.AddRange(tcarOperacionCuota.GetRubros());
            foreach (tcaroperacionrubro obj in lrubros) {
                if (obj.csaldo == csaldo) {
                    rubro = obj;
                    break;
                }
            }
            return rubro;
        }

        public static decimal GetInteres(tcaroperacioncuota tcarOperacionCuota, int fcalculo, int decimales) {
            tcaroperacionrubro rubro = TcarOperacionCuotaDal.GetRubroPorTipo(tcarOperacionCuota, "INT-CAR");
            return TcarOperacionRubroDal.GetSaldoAccrual(tcarOperacionCuota, rubro, fcalculo, decimales);
        }

        public static decimal GetMora(tcaroperacioncuota tcarOperacionCuota, int fcalculo, int decimales) {
            tcaroperacionrubro rubro = TcarOperacionCuotaDal.GetRubroPorTipo(tcarOperacionCuota, "MORA-CAR");
            return TcarOperacionRubroDal.GetSaldoAccrual(tcarOperacionCuota, rubro, fcalculo, decimales);
        }

        private static String JPQL_DELETE_ARREGLO_PAGOS = "delete from TcarOperacionCuota where coperacion = @coperacion ";

        /// <summary>
        /// Ejecuta reverso de arreglo de pagos de la nueva operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion creada en el arreglo de pagos.</param>
        public static void ReversoArregloPagos(String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE_ARREGLO_PAGOS, new SqlParameter("coperacion", coperacion));
        }

        /// <summary>
        /// Entrega el valor de la cuota de todos los rubros.
        /// </summary>
        /// <param name="coperacion">Numero de la operacion.</param>
        /// <param name="numcuota">Numero de cuota.</param>
        /// <returns></returns>
        public static tcaroperacioncuota GetCuotaActual(string coperacion, int fproceso) {
            List<tcaroperacioncuota> obj = new List<tcaroperacioncuota>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcaroperacioncuota.AsNoTracking().Where(x => x.coperacion == coperacion && x.fvencimiento >= fproceso).ToList();
            if (obj == null || obj.Count() == 0) {
                return null;
            }
            return obj.First();
        }

        /// <summary>
        /// Entrega el valor de la cuota de todos los rubros.
        /// </summary>
        /// <param name="coperacion">Numero de la operacion.</param>
        /// <param name="numcuota">Numero de cuota.</param>
        /// <returns></returns>
        public static decimal GetValorCuota(string coperacion, int numcuota) {
            // Estatus de operaciones no activas
            List<string> ltiposaldo = new List<string> { EnumTipoSaldo.CAPITAL.GetTiposaldo(), EnumTipoSaldo.INTERES.GetTiposaldo(), EnumTipoSaldo.SEGURO.GetTiposaldo() };
            List<tcaroperacionrubro> obj = new List<tcaroperacionrubro>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcaroperacionrubro.AsNoTracking().Where(x => x.coperacion == coperacion && x.numcuota == numcuota &&
                                                                   ltiposaldo.Contains(x.tmonsaldo.ctiposaldo)).ToList();
            return obj.Sum(a => a.valorcuota.Value);
        }

    }

}