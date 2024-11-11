using core.componente;
using dal.cartera;
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.consulta;
using dal.monetario;

namespace cartera.comp.consulta.movimiento {

    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar movimientos contables asociados a un numero de mensaje.
    /// La movimientos se entrega entrega en una List<Map<String, Object>>
    /// </summary>
    public class MovimientoDesembolso : ComponenteConsulta {

        /// <summary>
        /// Consulta movimientos contables de cartera.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            String coperacion = rqconsulta.Coperacion;
            String mensaje = (String)rqconsulta.Mdatos["mensajeaconsultar"];

            // Lista de respuesta
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();

            // Consulta datos desembolso
            IList<tcaroperaciondesembolso> lmovi = TcarOperacionDesembolsoDal.Find(coperacion);
            foreach (tcaroperaciondesembolso mov in lmovi) {
                Dictionary<string, object> mresponse = MovimientoDesembolso.MovimientoToMap(mov);
                lresp.Add(mresponse);
            }

            // Consulta gastos de liquidacion
            IList<tcaroperaciongastosliquida> lgastos = TcarOperacionGastosLiquidaDal.Find(coperacion);
            foreach (tcaroperaciongastosliquida gas in lgastos) {
                Dictionary<string, object> mresponse = MovimientoDesembolso.MovimientoToMap(gas);
                lresp.Add(mresponse);
            }

            // Fija la respuesta en el response. La respuesta contiene los movimientos.
            rqconsulta.Response["MOVIMIENTOSD"] = lresp;
        }

        /// <summary>
        /// Crea un map con los datos de un movimiento de cartera.
        /// </summary>
        public static Dictionary<string, object> MovimientoToMap(tcaroperaciondesembolso movimiento)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["coperacion"] = movimiento.coperacion;
            m["secuencia"] = movimiento.secuencia;
            if (movimiento.tipo != null && movimiento.tipo == "T") {
                m["tipo"] = "TRANSFERENCIA";
            } else {
                m["tipo"] = "OTROS";
            }

            m["valor"] = movimiento.valor;

            if (movimiento.tipocuentaccatalogo != null) {
                m["nsaldo"] = TmonSaldoDal.Find(movimiento.csaldo).nombre + ": " + TgenCatalogoDetalleDal.Find((int)movimiento.tipocuentaccatalogo, movimiento.tipocuentacdetalle).nombre + "; " + TgenCatalogoDetalleDal.Find((int)movimiento.tipoinstitucionccatalogo, movimiento.tipoinstitucioncdetalle).nombre + " :" + movimiento.numerocuentabancaria;

            } else {
                m["nsaldo"] = TmonSaldoDal.Find(movimiento.csaldo).nombre;

            }
            m["pagado"] = movimiento.pagado;
            return m;
        }

        /// <summary>
        /// Crea un map con los datos de gastos de liquidacion de la operacion.
        /// </summary>
        public static Dictionary<string, object> MovimientoToMap(tcaroperaciongastosliquida gastosliquida)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["coperacion"] = gastosliquida.coperacion;
            m["secuencia"] = gastosliquida.secuencia;
            m["tipo"] = "SEGURO";
            m["valor"] = gastosliquida.monto;
            m["nsaldo"] = TmonSaldoDal.Find(gastosliquida.csaldo).nombre;
            //SALDO PAGADO AL APROBAR EL CÉDITO - ABSORCIÓN
            m["pagado"] = true;
            return m;
        }

    }
}
