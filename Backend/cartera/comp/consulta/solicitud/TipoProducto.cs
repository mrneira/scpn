using cartera.datos;
using cartera.saldo;
using core.componente;
using core.servicios.consulta;
using dal.cartera;
using dal.generales;
using general.util;
using modelo;
using modelo.interfaces;
using socio.datos;
using System;
using System.Collections.Generic;
using util;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.solicitud {


    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar datos basicos para una solicitud de cartera.
    /// </summary>
    public class TipoProducto : ComponenteConsulta {

        private RqConsulta rqconsulta;

        /// <summary>
        /// Ejecuta consulta.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            this.rqconsulta = rqconsulta;
            MotorConsulta m = new MotorConsulta();
            m.Consultar(rqconsulta);
            Response r = rqconsulta.Response;
            if (r["TIPOPRODUCTO"] == null) {
                return;
            }
            Completardatos();
        }

        /// <summary>
        /// Completa informacion del tipo de producto.
        /// </summary>
        private void Completardatos()
        {
            IList<IBean> ldatos = (IList<IBean>)rqconsulta.Response["TIPOPRODUCTO"];
            foreach (tgentipoproducto prod in ldatos) {
                tcarproducto p = CompletarDatosProducto(prod.Mdatos, (int)prod.cmodulo, (int)prod.cproducto, (int)prod.ctipoproducto);
                Boolean tasasegmento = (Boolean)p.tasasegmento;
                if (!tasasegmento) {
                    CompletarTasaDesdeProducto(prod.Mdatos, (int)prod.cmodulo, (int)prod.cproducto, (int)prod.ctipoproducto);
                } else {
                    CompletarTasaDesdeSegmento(prod.Mdatos, p.csegmento);
                }
            }
        }

        /// <summary>
        /// Compelta datos del producto para la solicitud.
        /// </summary>
        /// <param name="m"></param>
        /// <param name="cmodulo"></param>
        /// <param name="cproducto"></param>
        /// <param name="ctipoproducto"></param>
        /// <returns></returns>
        private tcarproducto CompletarDatosProducto(Dictionary<String, Object> m, int cmodulo, int cproducto, int ctipoproducto)
        {
            bool requieregarante = false;
            tcarproducto p = TcarProductoDal.Find(cmodulo, cproducto, ctipoproducto);
            m.Add("cfrecuencia", p.cfrecuecia);
            m.Add("n_frecuencia", TgenFrecuenciaDal.Find((int)p.cfrecuecia).nombre);
            m.Add("ctabla", p.ctabla);
            m.Add("n_tabla", TcarTipoTablaAmortizacionDal.Find((int)p.ctabla).nombre);
            m.Add("cbasecalculo", p.cbasecalculo);
            m.Add("n_basecalculo", TgenBaseCalculoDal.Find(p.cbasecalculo).nombre);
            m.Add("periodicidadcapital", p.periodicidadcapital);
            m.Add("mesnogeneracuota", p.mesnogeneracuota);
            m.Add("montoporaportaciones", p.montoporaportaciones);
            m.Add("absorberoperaciones", p.absorberoperaciones);
            m.Add("gracia", p.gracia);
            m.Add("cflujo", p.cflujo);
            m.Add("consolidado", p.consolidado);

            long cpersona = rqconsulta.Mdatos.ContainsKey("cpersona") ? (long)rqconsulta.GetDatos("cpersona") : 0;
            if (cpersona > 0) {
                Socios socio = new Socios(cpersona, rqconsulta);
                if (p.montoporaportaciones != null && (bool)p.montoporaportaciones) {
                    decimal saldoaportes = Constantes.CERO;
                    decimal montoaportes = Math.Round(decimal.Parse(socio.GetAcumAportes().ToString()), 2, MidpointRounding.AwayFromZero);

                    // Saldos comprometidos de prestamos
                    decimal saldocomprometido = Constantes.CERO;
                    List<tcaroperacion> loperaciones = TcarOperacionDal.FindOperacionesAportes(cpersona);
                    foreach (tcaroperacion op in loperaciones) {
                        Operacion operacion = OperacionFachada.GetOperacion(op.coperacion, true);
                        Saldo saldo = new Saldo(operacion, rqconsulta.Fconatable);
                        saldo.Calculacuotaencurso();
                        saldocomprometido = decimal.Add(saldocomprometido, saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas() - saldo.Cxp);
                    }
                    saldoaportes = decimal.Subtract(montoaportes, saldocomprometido);
                    if (saldoaportes < 0) {
                        saldoaportes = Constantes.CERO;
                    }
                    m.Add("montodefault", (saldoaportes * (decimal)p.porcentajeaportaciones) / Constantes.CIEN);
                    rqconsulta.Response["monto_previo"]= (saldoaportes * (decimal)p.porcentajeaportaciones) / Constantes.CIEN;
                }
                if (p.requieregarante != null && (bool)p.requieregarante) {
                    requieregarante = (socio.GetTservicioArray()[0] >= 20) ? false : true;
                }
            }
            m.Add("requieregarante", requieregarante);
            m["RANGOS"] = TcarProductoRangosDal.findInDataBase(p.cmodulo, p.cproducto, p.ctipoproducto);
            return p;
        }

        /// <summary>
        /// Completa tasas definidas por producto.
        /// </summary>
        /// <param name="m"></param>
        /// <param name="cmodulo"></param>
        /// <param name="cproducto"></param>
        /// <param name="ctipoproducto"></param>
        private void CompletarTasaDesdeProducto(Dictionary<String, Object> m, int cmodulo, int cproducto, int ctipoproducto)
        {
            String cmoneda = rqconsulta.GetString("cmoneda");
            IList<tcarproductotasas> ltasas = TcarProductoTasasDal.Find(cmodulo, cproducto, ctipoproducto, cmoneda);
            foreach (tcarproductotasas t in ltasas) {
                if (t.csaldo.Equals("INT-CAR")) {
                    m["tasa"] = Tasa.GetTasa((int)t.ctasareferencial, t.cmoneda, t.operador, t.margen);
                }
            }
        }

        /// <summary>
        /// Completa tasas definidas por segmento. 
        /// </summary>
        /// <param name="m"></param>
        /// <param name="csegmento"></param>
        private void CompletarTasaDesdeSegmento(Dictionary<String, Object> m, String csegmento)
        {
            String cmoneda = rqconsulta.GetString("cmoneda");
            IList<tcarsegmentotasas> ltasas = TcarSegmentoTasasDal.Find(csegmento, cmoneda);
            foreach (tcarsegmentotasas t in ltasas) {
                if (t.csaldo.Equals("INT-CAR")) {
                    m["tasa"] = Tasa.GetTasa((int)t.ctasareferencial, t.cmoneda, t.operador, t.margen);
                }
            }
        }
    }
}
