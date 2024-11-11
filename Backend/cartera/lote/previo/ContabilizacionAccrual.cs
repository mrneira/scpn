using cartera.contabilidad;
using cartera.monetario;
using dal.cartera;
using dal.lote;
using modelo;
using modelo.servicios;
using monetario.util;
using monetario.util.rubro;
using System;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;

namespace cartera.lote.previo {
    /// <summary>
    /// Clase que se encarga de llevar a la contabilidad el valor de accuales diarios de intereses y comisiones sin considerar la mora.<br>
    /// Se ejecuta despues del cierre de dia. <br>
    /// Los intereses se cobran y se accruan el primer dia no se cobra ni conatbiliza el dia del vencimiento de la cuota. <br>
    /// Los intereses de sabado y domingo se contabilizan el viernes, en los feriados se contabiliza el día contable previo.
    /// </summary>
    public class ContabilizacionAccrual : ITareaPrevia {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Objeto utilizado en la contabizacion de accruales.
        /// </summary>
        private RqMantenimiento rqmantenimiento = null;
        /// <summary>
        /// Resultset con el valor a contabilizar por codigo de saldo de interes de saldo.
        /// </summary>
        private ScrollableResults rSet = null;
        /// <summary>
        /// Objeto que almacena la defincion de rubros asociados a una transaccion.
        /// </summary>
        private TransaccionRubro transaccionRubro = null;

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            if (this.VerificaYaProcesado(requestmodulo, ctarea)) {
                // si ya se ejecuto la contabilizacion para la fecha no ejecutar nuevamente para evitar la duplicidad de la contabilizacion.
                return;
            }
            // Procesa accrual interes / mora
            this.ProcesarAccrual(requestmodulo, false);
            this.ProcesarAccrual(requestmodulo, true);

            // Marca contabilizacion finalizada.
            this.MarcarContabilizacion(requestmodulo, ctarea);
        }

        private void ProcesarAccrual(RequestModulo requestmodulo, bool esmora)
        {
            rqmantenimiento = (RqMantenimiento)requestmodulo.GetDatos("RQMANTENIMIENTO");
            if (esmora) {
                rqmantenimiento.Mensaje = rqmantenimiento.Mensaje + "-1";
            }
            tcarevento evento = TcarEventoDal.Find("CONTABILIZACION-ACCRUAL"); // 7-504
            rqmantenimiento.Cambiartransaccion(evento.cmodulo ?? 0, evento.ctransaccion ?? 0);
            transaccionRubro = new TransaccionRubro(evento.cmodulo ?? 0, evento.ctransaccion ?? 0);
            try {
                LlenaResultset(requestmodulo.Fconatble, requestmodulo.Fconatbleproxima ?? 0, esmora);
                if (rSet != null) {
                    while (rSet.Next()) {
                        try {
                            Dictionary<string, object> obj = rSet.Get();
                            Contabiliza(obj);
                        }
                        catch (Exception e) {
                            logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e.Message} - {e.InnerException}");
                        }
                    }
                }
            }
            finally {
                rqmantenimiento.Mensaje = requestmodulo.Mensaje;
            }
        }

        private Boolean VerificaYaProcesado(RequestModulo requestmodulo, string ctarea)
        {
            tloteresultadoindividual obj = TloteResultadoIndividualDal.Find(ctarea, requestmodulo.Fconatble, requestmodulo.Clote, requestmodulo.Cmodulo);
            if (obj == null) {
                return false;
            }
            return true;
        }


        /// <summary>
        /// Inserta un registro en TloteResultadoIndividual, utilizado en la duplicidad de contabilizacion de accrual para una misma fecha.
        /// </summary>
        private void MarcarContabilizacion(RequestModulo requestmodulo, string ctarea)
        {
            RequestOperacion ro = new RequestOperacion();
            ro.Cregistro = ctarea;
            ro.Fconatble = requestmodulo.Fconatble;
            ro.Clote = requestmodulo.Clote;
            ro.Cmodulo = requestmodulo.Cmodulo;
            ro.Numeroejecucion = requestmodulo.Numeroejecucion;
            TloteResultadoIndividualDal.registraerror(ro, ctarea, "", "1", "CONTABILIZACION CARTERA OK");
        }

        /// <summary>
        /// Contabiliza accrual por cada registro del resultset
        /// </summary>
        private void Contabiliza(Dictionary<string, object> obj)
        {
            ActualizaRqmantenimiento(obj);
            String csaldo = obj["csaldo"].ToString();
            String cmoneda = obj["cmoneda"].ToString();
            int cmodulo = int.Parse(obj["cmodulo"].ToString());
            int cproducto = int.Parse(obj["cproducto"].ToString());
            int ctipoproducto = int.Parse(obj["ctipoproducto"].ToString());
            decimal monto = decimal.Parse(obj["accrual"].ToString());

            if (monto <= Constantes.CERO) {
                return;
            }

            tmonrubro rubro = transaccionRubro.GetRubro(csaldo);

            //// Contabiliza por modulo / producto / tipo de producto
            rqmantenimiento.AddDatos("cmodulo", cmodulo);
            rqmantenimiento.AddDatos("cproducto", cproducto);
            rqmantenimiento.AddDatos("ctipoproducto", ctipoproducto);

            String codigocontable = Perfiles.GetCodigoContableTipoProducto(csaldo, cmodulo, cproducto, ctipoproducto, null);
            RubroHelper.AdicionarRubro(rqmantenimiento, rubro.crubro, codigocontable, monto, null, cmoneda, null);

            // rubro par ejemplo ingresos o orden por contra
            tmonrubro rubropar = transaccionRubro.GetRubro(rubro.crubropar ?? 0);
            String codigocontablepar = Perfiles.GetCodigoContableTipoProducto(rubropar.csaldo, cmodulo, cproducto, ctipoproducto, null);
            RubroHelper.AdicionarRubro(rqmantenimiento, rubro.crubropar ?? 0, codigocontablepar, monto, null, cmoneda, null);

            // Ejecuta la transaccion monetaria anidada.
            ComprobanteMonetario monetario = new ComprobanteMonetario();
            monetario.Ejecutar(rqmantenimiento);
        }

        /// <summary>
        /// Encera request monetario y actualiza sucursal oficina del accrual a contabilizar.
        /// </summary>
        private void ActualizaRqmantenimiento(Dictionary<string, object> obj)
        {
            rqmantenimiento.EncerarRubros();
            int csucursal = int.Parse(obj["csucursal"].ToString());
            int cagencia = int.Parse(obj["cagencia"].ToString());
            rqmantenimiento.Csucursal = csucursal;
            rqmantenimiento.Cagencia = cagencia;
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera a cerrar provisiones, el viernes se cobra cuentas cuya fecha de vencimiento es sabado o domingo.
        /// </summary>
        private void LlenaResultset(int fcontable, int fcontproxima, bool esmora)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ThreadNegocio.RemoveDatos();
            Datos d = new Datos();
            ThreadNegocio.FijarDatos(d);

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fproxima"] = fcontproxima;
            parametros["@fcontable"] = fcontable;

            if (esmora) {
                this.rSet = new ScrollableResults(contexto, parametros, SQL_RESULTSET_MORA, 5000);
            } else {
                this.rSet = new ScrollableResults(contexto, parametros, SQL_RESULTSET, 5000);
            }
        }

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones a la vista a capitalizar.
        /// </summary>
        private static string SQL_RESULTSET = "select r.csaldo, o.csucursal, o.cagencia, o.cmoneda, o.cmodulo, o.cproducto, o.ctipoproducto, "
                              + "      sum(round( abs( datediff( dd, case when convert(datetime,str(@fproxima)) <  convert(datetime,str(c.fvencimiento)) "
                              + "      then convert(datetime,str(@fproxima)) else convert(datetime,str(c.fvencimiento)) end, "
                              + "      case when convert(datetime,str(r.fvigencia)) > convert(datetime,str(c.finicio)) "
                              + "      then convert(datetime, str(r.fvigencia)) else convert(datetime,str(c.finicio)) end ) ) * r.accrual, 2) "
                              + "      - round( abs( datediff( dd, case when convert(datetime,str(@fcontable)) < convert(datetime,str(c.fvencimiento)) "
                              + "      then convert(datetime,str(@fcontable)) else convert(datetime,str(c.fvencimiento)) end, "
                              + "      case when convert(datetime,str(r.fvigencia)) > convert(datetime,str(c.finicio)) "
                              + "      then convert(datetime,str(r.fvigencia)) else convert(datetime,str(c.finicio)) end ) ) * r.accrual, 2) ) as accrual "
                              + " from tcaroperacionrubro r, tcaroperacioncuota c, tcaroperacion o "
                              + " where r.coperacion = c.coperacion "
                              + " and c.coperacion = o.coperacion "
                              + " and r.numcuota = c.numcuota "
                              + " and convert(datetime,str(@fcontable)) between convert(datetime,str(c.finicio)) and convert(datetime,str(c.fvencimiento)) "
                              + " and c.fpago is null "
                              + " and r.esaccrual = '1' "
                              + " and o.cestatus not in ('APR', 'NEG', 'CAN') "
                              + " and o.cproducto is not null "
                              + " and r.csaldo in ('INT-CAR', 'FONDOCON') "
                              + " group by r.csaldo, o.csucursal, o.cagencia, o.cmoneda, o.cmodulo, o.cproducto, o.ctipoproducto";

        private static string SQL_RESULTSET_MORA = "select r.csaldo, o.csucursal, o.cagencia, o.cmoneda, o.cmodulo, o.cproducto, o.ctipoproducto, "
                              + " sum(round( abs( datediff(dd, convert(datetime, str(@fproxima)), convert(datetime, str(r.fvigencia))) ) * r.accrual, 2) "
                              + "  - round(  abs( datediff(dd, convert(datetime, str(@fcontable)), convert(datetime, str(r.fvigencia))) ) * r.accrual, 2) ) as accrual "
                              + " from   tcaroperacionrubro r, tcaroperacioncuota c, tcaroperacion o "
                              + " where r.coperacion = c.coperacion "
                              + " and    c.coperacion = o.coperacion "
                              + " and r.numcuota = c.numcuota "
                              + " and c.fpago is null "
                              + " and r.fpago is null "
                              + " and r.esaccrual = '1' "
                              + " and o.cestatus not in ('APR', 'NEG', 'CAN') "
                              + " and o.cproducto is not null "
                              + " and r.csaldo in ('MORA-CAR') "
                              + " group by r.csaldo, o.csucursal, o.cagencia, o.cmoneda, o.cmodulo, o.cproducto, o.ctipoproducto";
    }


}
