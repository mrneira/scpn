using core.componente;
using dal.cartera;
using dal.contabilidad;
using dal.garantias;
using dal.generales;
using dal.monetario;
using modelo;
using modelo.helper.cartera;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.consulta;
using util.enums;

namespace cartera.comp.consulta.movimiento {

    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar movimientos contables asociados a un numero de mensaje.
    /// La movimientos se entrega entrega en una List<Map<String, Object>>
    /// </summary>
    public class MovimientosContables : ComponenteConsulta {

        /// <summary>
        /// Consulta movimientos contables de cartera.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            String mensaje = (String)rqconsulta.Mdatos["mensajeaconsultar"];
            //String coperacion = rqconsulta.Coperacion;
            int? fechacontable = rqconsulta.GetDatos("fechacontable") == null ? null : rqconsulta.GetInt("fechacontable");
            if (fechacontable == null) {
                fechacontable = rqconsulta.Fconatable;
            }
            int particion = Constantes.GetParticion(fechacontable ?? 0);

            // Lista de respuesta con la tabla de pagos
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            if (rqconsulta.Response.ContainsKey("MOVIMIENTOS") && rqconsulta.Response["MOVIMIENTOS"] != null) {
                lresp = (List<Dictionary<string, object>>)rqconsulta.Response["MOVIMIENTOS"];
            }

            // Lista de movimientos
            IList<tmonmovimiento> ldatos = TmonMovimientoDal.Find(mensaje);
            foreach (tmonmovimiento mov in ldatos) {
                // Ejecuta el transacciones por modulo.
                List<IBean> lmovi = null;
                if (mov.cmodulo.Equals(EnumModulos.CARTERA.Cmodulo)) {
                    lmovi = TcarMovimientoDal.FindMovimientos(mensaje, mov.coperacion, particion).ToList<IBean>();
                }
                if (mov.cmodulo.Equals(EnumModulos.GARANTIAS.Cmodulo)) {
                    lmovi = TgarMovimientoDal.Find(mensaje, mov.coperacion, particion).ToList<IBean>();
                }
                foreach (IBean bean in lmovi) {
                    Dictionary<string, object> mresponse = MovimientosContables.MovimientoToMap(mov.cmodulo, bean);
                    lresp.Add(mresponse);
                }
            }

            // Fija la respuesta en el response. La respuesta contiene los movimientos.
            rqconsulta.Response["MOVIMIENTOS"] = lresp;
        }

        /// <summary>
        /// Crea un map con los datos de un movimiento de cartera.
        /// </summary>
        public static Dictionary<string, object> MovimientoToMap(int cmodulo, IBean mov)
        {
            Movimiento movimiento = EnumModulos.GetEnumModulos(cmodulo).GetInstanceDeMovimiento();
            movimiento = (Movimiento)mov;

            Dictionary<string, object> m = new Dictionary<string, object>();
            m["mod"] = movimiento.cmodulotransaccion;
            m["nmod"] = TgenModuloDal.Find((int)movimiento.cmodulotransaccion).nombre;
            m["tran"] = movimiento.ctransaccion;
            m["ntran"] = TgentransaccionDal.Find(movimiento.cmodulotransaccion ?? 0, movimiento.ctransaccion ?? 0).nombre;
            m["rubro"] = movimiento.crubro;
            if (movimiento.debito != null && movimiento.debito == true) {
                m["debito"] = movimiento.monto;
            } else {
                m["credito"] = movimiento.monto;
            }
            m["csaldo"] = movimiento.csaldo;
            m["cuenta"] = movimiento.ccuenta;
            m["ncuenta"] = TconCatalogoDal.Find((int)movimiento.ccompania, movimiento.ccuenta).nombre;
            return m;
        }

    }
}
