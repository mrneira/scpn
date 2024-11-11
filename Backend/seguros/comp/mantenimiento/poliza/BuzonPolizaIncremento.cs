using core.componente;
using core.servicios.mantenimiento;
using dal.seguros;
using modelo;
using modelo.helper;
using modelo.interfaces;
using monetario.util;
using monetario.util.rubro;
using System.Collections.Generic;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace seguros.comp.mantenimiento.poliza
{
    class BuzonPolizaIncremento : ComponenteMantenimiento
    {
      /// <summary>
      /// Metodo que ejecuta la devolucion de valores mediante pago normal de cartera.
      /// </summary>
      /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<IBean> poliza = new List<IBean>();
            if (rqmantenimiento.GetTabla("BUZONPOLIZASINCREMENTO") == null)
            { return; }
                poliza = rqmantenimiento.GetTabla("BUZONPOLIZASINCREMENTO").Lregistros;

                List<IBean> poliEliminar = new List<IBean>();

                poliEliminar = rqmantenimiento.GetTabla("BUZONPOLIZASINCREMENTO").Lregeliminar;
                IList<tsgspoliza> lpoliza = new List<tsgspoliza>();
                List<tsgsseguro> lseguro = new List<tsgsseguro>();
                tsgspoliza polizaMod = new tsgspoliza();

                string accion = rqmantenimiento.Mdatos["accion"].ToString();

                if (accion.Equals("eliminar"))
                {
                    foreach (tsgspoliza polEli in poliEliminar)
                    {

                        tsgspoliza tsgspoliza = TsgsPolizaDal.FindPolizaPen(polEli.coperacioncartera, polEli.coperaciongarantia);
                        rqmantenimiento.Mtablas["BUZONPOLIZASINCREMENTO"] = null;
                        Sessionef.Eliminar(tsgspoliza);

                        // Datos seguro
                        tsgsseguro seguro = TsgsSeguroDal.Find(polEli.coperacioncartera, polEli.coperaciongarantia);
                        seguro.Actualizar = true;
                        seguro.secuenciapoliza = null;
                        lseguro.Add(seguro);

                    }
                    rqmantenimiento.AdicionarTabla("tsgsseguro", lseguro, false);
                }

                else
                {

                    foreach (tsgspoliza pol in poliza)
                    {


                        tsgspoliza tsgspoliza = TsgsPolizaDal.FindPolizaPen(pol.coperacioncartera, pol.coperaciongarantia);



                        if (accion.Equals("modificar"))
                        {
                            tsgspoliza.Esnuevo = false;
                            tsgspoliza.Actualizar = true;
                            tsgspoliza.valorasegurado = pol.valorasegurado;
                            tsgspoliza.valorprima = pol.valorfactura;
                            tsgspoliza.numeropoliza = pol.numeropoliza;
                            tsgspoliza.numerofactura = pol.numerofactura;
                            tsgspoliza.valorfactura = pol.valorfactura;
                            tsgspoliza.valordevolucion = pol.valorprimaretenida - pol.valorfactura;
                            lpoliza.Add(tsgspoliza);
                        }
                        else
                        {

                            tsgspoliza tsgspolizaMod = TsgsPolizaDal.FindPolizaPen(pol.coperacioncartera, pol.coperaciongarantia);

                            if (tsgspolizaMod != null)
                            {
                                EntityHelper.SetActualizar(pol);
                                // Datos poliza
                                pol.Esnuevo = false;
                                pol.Actualizar = true;
                                pol.cdetalleestado = "ING";
                                pol.fdevolucion = rqmantenimiento.Fconatable;
                                lpoliza.Add(pol);


                                // Monto de devolucion
                                if (pol.valordevolucion > 0)
                                {
                                    // Ejecuta pago
                                    RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                                    rq.Monto = (decimal)pol.valordevolucion;
                                    rq.Coperacion = pol.coperacioncartera;
                                    rq.Documento = pol.numerofactura.ToString();
                                    Mantenimiento.ProcesarAnidado(rq, 7, 12);

                                    // Ejecuta monetario
                                    this.EjecutaMonetario(rq, (int)pol.ctiposeguro);
                                }
                            }
                        }
                    }
                    rqmantenimiento.Mtablas["BUZONPOLIZASINCREMENTO"] = null;
                    //rqmantenimiento.AdicionarTabla("tsgsseguro", lseguro, false);
                    rqmantenimiento.AdicionarTabla("tsgspoliza", lpoliza, false);
                }
        }
        

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="ctiposeguro">Codigo de seguro.</param>
        private void EjecutaMonetario(RqMantenimiento rqmantenimiento, int ctiposeguro)
        {
            decimal monto = rqmantenimiento.Monto;

            // Ejecuta monetario
            RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
            rqconta.EncerarRubros();

            // Rubro monetario
            TransaccionRubro trubro = new TransaccionRubro(rqmantenimiento.Cmodulotranoriginal, rqmantenimiento.Ctranoriginal);
            tmonrubro tmonrubro = trubro.GetRubro(TsgsTipoSeguroDetalleDal.Find(ctiposeguro).csaldo);

            RqRubro rqrubro = new RqRubro(tmonrubro.crubro, monto, rqmantenimiento.Cmoneda);
            rqrubro.Coperacion = rqmantenimiento.Coperacion;
            rqrubro.Actualizasaldo = false;
            rqconta.AdicionarRubro(rqrubro);

            // Ejecuta la transaccion monetaria anidada.
            if (rqconta.Rubros != null && !(rqconta.Rubros.Count < 1))
            {
                new ComprobanteMonetario(rqconta);
            }
        }
    }
}
