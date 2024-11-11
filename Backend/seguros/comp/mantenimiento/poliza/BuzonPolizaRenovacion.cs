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
    class BuzonPolizaRenovacion : ComponenteMantenimiento
    {

        /// <summary>
        /// Metodo que ejecuta la devolucion de valores mediante pago normal de cartera.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<IBean> poliza = new List<IBean>();
            if (rqmantenimiento.GetTabla("BUZONRENOVACIONPOLIZAS") == null)
            { return; }

                poliza = rqmantenimiento.GetTabla("BUZONRENOVACIONPOLIZAS").Lregistros;

                List<IBean> poliEliminar = new List<IBean>();

                poliEliminar = rqmantenimiento.GetTabla("BUZONRENOVACIONPOLIZAS").Lregeliminar;
                IList<tsgspoliza> lpoliza = new List<tsgspoliza>();
                List<tsgsseguro> lseguro = new List<tsgsseguro>();
                tsgspoliza polizaMod = new tsgspoliza();

                string accion = rqmantenimiento.Mdatos["accion"].ToString();

                if (accion.Equals("eliminar"))
                {
                    foreach (tsgspoliza polEli in poliEliminar)
                    {

                        tsgspoliza tsgspoliza = TsgsPolizaDal.FindPolizaPen(polEli.coperacioncartera, polEli.coperaciongarantia);
                        rqmantenimiento.Mtablas["BUZONRENOVACIONPOLIZAS"] = null;
                        Sessionef.Eliminar(tsgspoliza);

                        // Datos seguro
                        tsgsseguro seguro = TsgsSeguroDal.Find(polEli.coperacioncartera, polEli.coperaciongarantia);
                        seguro.Actualizar = true;
                        seguro.secuenciapoliza = polEli.secuencia - 1;
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
                                lpoliza.Add(pol);

                                tsgstiposegurodetalle tsgstiposeguro = TsgsTipoSeguroDetalleDal.Find((int)pol.ctiposeguro);
                                // Monto de devolucion
                                if (pol.valorprima > 0)
                                {
                                    // Ejecuta pago
                                    RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();

                                    rq.Coperacion = pol.coperacioncartera;
                                    rq.Monto = (decimal)pol.valorprima;
                                    if (rq.Mdatos.ContainsKey("cuotainicio"))
                                    {
                                        rq.Mdatos.Remove("cuotainicio");
                                    }
                                    if (rq.Mdatos.ContainsKey("numerocuotas"))
                                    {
                                        rq.Mdatos.Remove("numerocuotas");
                                    }
                                    if (rq.Mdatos.ContainsKey("csaldo"))
                                    {
                                        rq.Mdatos.Remove("csaldo");
                                    }
                                    rq.Mdatos.Add("cuotainicio", pol.cuotainicio);
                                    rq.Mdatos.Add("numerocuotas", pol.numerocuotas);
                                    rq.Mdatos.Add("csaldo", tsgstiposeguro.csaldocxc);
                                    rq.Documento = pol.numerofactura.ToString();
                                    Mantenimiento.ProcesarAnidado(rq, 7, 140);
                                }


                            }
                        }
                    }
                    rqmantenimiento.Mtablas["BUZONRENOVACIONPOLIZAS"] = null;
                    //rqmantenimiento.AdicionarTabla("tsgsseguro", lseguro, false);
                    rqmantenimiento.AdicionarTabla("tsgspoliza", lpoliza, false);
                }

        }

    }
}
