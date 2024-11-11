using cartera.datos;
using cartera.enums;
using cartera.monetario;
using core.componente;
using dal.cartera;
using dal.monetario;
using modelo;
using modelo.interfaces;
using monetario.util;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.desembolso {

    /// <summary>
    /// Clase que se encarga de ejecutar monetario de los valores a entregar al realizar desembolsos.
    /// </summary>
    public class MonetarioRubros : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<tcaroperaciondesembolso> ldesembolsos = new List<tcaroperaciondesembolso>();
            List<tcaroperaciondesembolso> ldatostransferencia = CompletarDatos(rqmantenimiento, "TRANSFERENCIA");
            List<tcaroperaciondesembolso> ldatosotros = CompletarDatos(rqmantenimiento, "OTROS");

            if (ldatostransferencia != null && ldatostransferencia.Count > 0) {
                foreach (tcaroperaciondesembolso obj in ldatostransferencia) {
                    if (obj.coperacion == rqmantenimiento.Coperacion) {
                        ldesembolsos.Add(obj);
                    }
                }
            }

            if (ldatosotros != null && ldatosotros.Count > 0) {
                foreach (tcaroperaciondesembolso obj in ldatosotros) {
                    ldesembolsos.Add(obj);
                }
            }

            if (ldesembolsos == null || ldesembolsos.Count == 0) {
                return;
            }

            // procesa creditos a cuenta contable.
            ProcesarCreditoCuentaContable(rqmantenimiento, ldesembolsos);
        }

        /// <summary>
        /// Completa datos de desembolsos
        /// </summary>
        /// <param name="rqmantenimiento">Datos del requet con los que se ejecuta la transaccion.</param>
        /// <param name="tabla">Nombre tabla</param>
        private List<tcaroperaciondesembolso> CompletarDatos(RqMantenimiento rqmantenimiento, string tabla)
        {
            List<IBean> ldatosmod = new List<IBean>();
            List<IBean> ldatoseliminados = new List<IBean>();
            if (rqmantenimiento.GetTabla(tabla) != null && rqmantenimiento.GetTabla(tabla).Lregistros.Count > 0) {
                ldatosmod = rqmantenimiento.GetTabla(tabla).Lregistros.Cast<tcaroperaciondesembolso>().Cast<IBean>().ToList();
            }
            if (rqmantenimiento.GetTabla(tabla) != null && rqmantenimiento.GetTabla(tabla).Lregeliminar.Count > 0) {
                ldatoseliminados = rqmantenimiento.GetTabla(tabla).Lregeliminar.Cast<tcaroperaciondesembolso>().Cast<IBean>().ToList();
            }
            List<tcaroperaciondesembolso> ldatosbase = TcarOperacionDesembolsoDal.FindToTipo(rqmantenimiento.Coperacion, tabla.Equals("TRANSFERENCIA") ? "T" : "C");
            List<tcaroperaciondesembolso> ldatos = DtoUtil.GetMergedList(ldatosbase.Cast<IBean>().ToList(), ldatosmod, ldatoseliminados).Cast<tcaroperaciondesembolso>().ToList();
            return ldatos;
        }



        /// <summary>
        /// Ejecuta creditos a cuenta contable.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del requet con los que se ejecuta la transaccion.</param>
        /// <param name="ldesembolsos">Lista de desembolsos</param>
        private void ProcesarCreditoCuentaContable(RqMantenimiento rqmantenimiento, List<tcaroperaciondesembolso> ldesembolsos)
        {
            RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
            MonetarioHelper.FijaTransaccion(rqconta, EnumEventos.DESEMBOLSOCUENTACONTABLE.Cevento);
            rqconta.EncerarRubros();
            tcaroperacion tcaroperacion = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
            IList<tmonrubro> lrubros = TmonRubroDal.FindInDataBase(rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion);

            foreach (tcaroperaciondesembolso desembolso in ldesembolsos) {
                foreach (tmonrubro rub in lrubros) {
                    if (rub.crubro == desembolso.crubro) {
                        tmonsaldo saldo = TmonSaldoDal.FindInDataBase(desembolso.csaldo);
                        desembolso.csaldo = saldo.csaldo;
                        desembolso.ccuenta = saldo.codigocontable;
                        break;
                    }
                }

                if (desembolso.csaldo != null && desembolso.ccuenta != null && desembolso.valor != null && desembolso.valor > Constantes.CERO) {
                    RqRubro rqrubro = new RqRubro(1, (decimal)desembolso.valor, tcaroperacion.cmoneda);
                    rqrubro.Coperacion = desembolso.coperacion;
                    rqrubro.Codigocontable = desembolso.ccuenta.ToString();
                    rqrubro.Multiple = true;
                    rqconta.AdicionarRubro(rqrubro);
                }
            }
            // ejecuta el monetario
            if (rqconta.Rubros != null && !(rqconta.Rubros.Count < 1)) {
                new ComprobanteMonetario(rqconta);
            }
        }
    }

}
