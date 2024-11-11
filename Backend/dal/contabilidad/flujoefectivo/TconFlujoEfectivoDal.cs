using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.contabilidad.flujoefectivo {
    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TconFlujoEfectivo.
    /// </summary>
    public class TconFlujoEfectivoDal {

        public static List<tconflujoefectivo> Find(int aniofin, int anioinicio, string tipoplancdetalle) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconflujoefectivo> lista = new List<tconflujoefectivo>();
            lista = contexto.tconflujoefectivo.AsNoTracking().Where(x => x.aniofin.Equals(aniofin) &&
                                                                    x.anioinicio.Equals(anioinicio) &&
                                                                    x.tipoplancdetalle == tipoplancdetalle).OrderBy(x => x.ccuenta).ToList();
            return lista;
        }

        /// <summary>
        /// Crea un objeto de tipo tconflujoefectivo, con saldos inicial y final y los valores por default en cero.
        /// </summary>
        /// <param name="aniofin">Anio de finalizacion al cual se obtiene los saldos contables.</param>
        /// <param name="ccuenta">Numero de cuenta contable.</param>
        /// <param name="tipoplancdetalle">Tipo de catalogo de cunetas.</param>
        /// <param name="tipoefectivo">Tipo de flujo de efectivo, CL clientes, PV proveedores etc.</param>
        /// <param name="saldofin">Saldo al 31 de diciembre del anio a generar el flujo de efectivo.</param>
        /// <param name="saldoini">Saldo al 31 de diciembre del anio anterior a generar el flujo de efectivo.</param>
        /// <returns></returns>
        public static tconflujoefectivo Crear(int aniofin, string ccuenta, string tipoplancdetalle, string tipoefectivo, decimal saldofin, decimal saldoini) {
            tconflujoefectivo fe = new tconflujoefectivo();
            fe.aniofin = Int32.Parse(aniofin + "1231");
            fe.anioinicio = Int32.Parse((aniofin - 1) + "1231");
            fe.ccuenta = ccuenta;
            fe.tipoplanccatalogo = 1001;
            fe.tipoplancdetalle = tipoplancdetalle;
            fe.saldoinicial = saldoini;
            fe.saldofinal = saldofin;
            if (fe.ccuenta.StartsWith("73402") || fe.ccuenta.StartsWith("3101")) {
                fe.saldofinal = 0;
            }
            fe.variacion = fe.saldofinal - fe.saldoinicial;
            fe.ajustedebe = 0;
            fe.ajustehaber = 0;
            fe.variacionajustada = 0;
            fe.estadofuente = 0;
            fe.estadouso = 0;
            fe.flujodeefectivo = 0;
            fe.tipo = tipoefectivo;
            fe.clientes = 0;
            fe.proveedores = 0;
            fe.empleados = 0;
            fe.impuestorenta = 0;
            fe.inversion = 0;
            fe.financiamiento = 0;
            fe.otros = 0;
            fe.efectivo = 0;
            return fe;
        }

        /// <summary>
        /// Actuaaliza saldos necesarios para generar los reportes de flujo de efectivo.
        /// </summary>
        /// <param name="fe"></param>
        public static void ActualizarSaldos(tconflujoefectivo fe)
        {
            if (!fe.Actualizar)
            {
                fe.Actualizar = true;
            }
            fe.variacionajustada = fe.variacion + fe.ajustedebe - fe.ajustehaber;
            if (fe.variacionajustada < 0)
            {
                fe.estadofuente = fe.variacionajustada * -1;
            }
            else
            {
                fe.estadouso = fe.variacionajustada;
            }
            if (fe.variacionajustada == 0)
            {
                fe.estadouso = 0;
                fe.estadofuente = 0;
            }
            fe.flujodeefectivo = fe.estadofuente - fe.estadouso;
            switch (fe.tipo)
            {
                case "CL": fe.clientes = fe.variacionajustada != 0 ? fe.variacionajustada * -1 : 0; break;
                case "PV": fe.proveedores = fe.variacionajustada != 0 ? fe.variacionajustada * -1 : 0; break;
                case "EM": fe.empleados = fe.variacionajustada != 0 ? fe.variacionajustada * -1 : 0; break;
                case "IR": fe.impuestorenta = fe.variacionajustada != 0 ? fe.variacionajustada * -1 : 0; break;
                case "OT": fe.otros = fe.variacionajustada != 0 ? fe.variacionajustada * -1 : 0; break;
                case "IN": fe.inversion = fe.variacionajustada != 0 ? fe.variacionajustada * -1 : 0; break;
                case "FC": fe.financiamiento = fe.variacionajustada != 0 ? fe.variacionajustada * -1 : 0; break;
                case "EE": fe.efectivo = fe.flujodeefectivo != 0 ? fe.flujodeefectivo * -1 : 0; break;
            }
        }

        private static readonly string SQL_ELIMINAR = "delete from TCONFLUJOEFECTIVO where ANIOFIN = @aniofin and ANIOINICIO = @anioinicio and tipoplancdetalle = @tipoplancdetalle";

        /// <summary>
        /// Elimina datos anteriores, para hacer un calculo desde cero. 
        /// </summary>
        /// <param name="aniofin"></param>
        public static void Eliminar(int aniofin, string tipoplancdetalle) {
            int anioinicio = Int32.Parse((aniofin - 1) + "1231");
            aniofin = Int32.Parse(aniofin + "1231");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_ELIMINAR, 
                new SqlParameter("aniofin", aniofin), 
                new SqlParameter("anioinicio", anioinicio),
                new SqlParameter("tipoplancdetalle", tipoplancdetalle));
        }

        /// <summary>
        /// Entrega saldos contables al 31 de diciembre del anio de consulta y al 31 de diciembre del anio anterior.
        /// </summary>
        private static readonly string SPQL_SALDOS = "select c.tipoplancdetalle, c.tipoefectivo, cie.ccuenta, monto as montofin, "
            + " (select monto from tconsaldoscierre i where i.ccuenta = cie.ccuenta and i.fcierre = @fconsultainicio) as montoini "
            + " from tconsaldoscierre cie, tconcatalogo c "
            + " where cie.ccuenta = c.ccuenta and c.cnivel = 3 and cie.fcierre = @fconsultafin and c.tipoplancdetalle = @tipoplancdetalle "
            + " order by cie.ccuenta ";

        /// <summary>
        /// Metodo que entrega una lista de objetos con los valores del flujo de efectivo.
        /// </summary>
        public static IList<Dictionary<string, object>> getSaldosFlujo(int aniofin, string tipoplancdetalle) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object> {
                ["@fconsultainicio"] = Int32.Parse((aniofin - 1) + "1231"),
                ["@fconsultafin"] = Int32.Parse(aniofin + "1231"),
                ["@tipoplancdetalle"] = tipoplancdetalle
            };

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SPQL_SALDOS);
            ch.registrosporpagina = 10000000;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

    }
}
