using core.componente;
using dal.cartera;
using dal.garantias;
using dal.generales;
using dal.monetario;
using modelo;
using Newtonsoft.Json;
using System.Collections.Generic;
using util.dto.consulta;

namespace cartera.comp.consulta.movimiento {

    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar movimientos contables para cuadre contable.
    /// La movimientos se entrega entrega en una List<Map<String, Object>>
    /// </summary>
    public class MovimientosCuadre : ComponenteConsulta {

        /// <summary>
        /// Consulta movimientos contables de cartera.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            if (!rqconsulta.Mdatos.ContainsKey("registroSeguro")) {
                return;
            }
            tconcomprobanteprevio comp = JsonConvert.DeserializeObject<tconcomprobanteprevio>(rqconsulta.Mdatos["registroSeguro"].ToString());

            // Lista de respuesta con lista de movimientos
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            IList<tcarmovimiento> lmovimientos = TcarMovimientoDal.FindMovimientos(comp);
            foreach (tcarmovimiento mov in lmovimientos) {
                Dictionary<string, object> mresponse = MovimientosCuadre.MovimientoToMap(mov);
                lresp.Add(mresponse);
            }

            IList<tgarmovimiento> lmovimientos2 = TgarMovimientoDal.FindMovimientos(comp);
            foreach (tgarmovimiento mov in lmovimientos2) {
                Dictionary<string, object> mresponse = MovimientosCuadre.MovimientoGarantiaToMap(mov);
                lresp.Add(mresponse);
            }


            // Fija la respuesta en el response. La respuesta contiene los movimientos.
            rqconsulta.Response["MOVIMIENTOSCUADRE"] = lresp;
        }

        /// <summary>
        /// Crea un map con los datos de un movimiento de cartera.
        /// </summary>
        public static Dictionary<string, object> MovimientoToMap(tcarmovimiento movimiento)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["operacion"] = movimiento.coperacion ?? "";
            m["ntransaccion"] = TgentransaccionDal.Find(movimiento.cmoduloorigen ?? 0, movimiento.ctransaccionorigen ?? 0).nombre;
            m["nestatus"] = movimiento.cestatus != null ? TcarEstatusDal.Find(movimiento.cestatus).nombre : "";
            m["nsaldo"] = TmonSaldoDal.Find(movimiento.csaldo).nombre;
            m["numcuota"] = movimiento.numcuota;
            m["monto"] = movimiento.monto;
            m["cusuario"] = movimiento.cusuario;
            return m;
        }

        /// <summary>
        /// Crea un map con los datos de un movimiento de cartera.
        /// </summary>
        public static Dictionary<string, object> MovimientoGarantiaToMap(tgarmovimiento movimiento) {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["operacion"] = movimiento.coperacion ?? "";
            m["ntransaccion"] = TgentransaccionDal.Find(movimiento.cmoduloorigen ?? 0, movimiento.ctransaccionorigen ?? 0).nombre;
            m["nestatus"] = movimiento.cestatus != null ? TcarEstatusDal.Find(movimiento.cestatus).nombre : "";
            m["nsaldo"] = TmonSaldoDal.Find(movimiento.csaldo).nombre;
            m["numcuota"] = "";
            m["monto"] = movimiento.monto;
            m["cusuario"] = movimiento.cusuario;
            return m;
        }
    }
}
