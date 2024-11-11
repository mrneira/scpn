using core.componente;
using core.servicios.mantenimiento;
using dal.seguros;
using modelo;
using monetario.util;
using monetario.util.rubro;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;
using dal.garantias;

namespace seguros.comp.mantenimiento.poliza
{
    class RenovacionIncremento : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            // Datos poliza
            tsgspoliza poliza = (tsgspoliza)rqmantenimiento.GetTabla("POLIZAINCREMENTO").Lregistros.ElementAt(0);
            int secuencia = TsgsPolizaDal.GetSecuencia(poliza.coperacioncartera, poliza.coperaciongarantia);
            tgaroperacion garanterior = TgarOperacionDal.FindSinBloqueo(poliza.coperaciongarantia);
            tsgsseguro coperacionanterio = TsgsSeguroDal.FindToGarantia(garanterior.coperacionanterior.ToString());
            poliza.secuencia = secuencia;
            poliza.cusuarioing = rqmantenimiento.Cusuario;
            poliza.fingreso = rqmantenimiento.Fconatable;
            poliza.ccatalogoestado = 600;
            poliza.cdetalleestado = "PEN";
            poliza.coperacioncarteraanterior = coperacionanterio.coperacioncartera;

            // Datos seguro
            List<tsgsseguro> lseguro = new List<tsgsseguro>();
            tsgsseguro seguro = TsgsSeguroDal.Find(poliza.coperacioncartera, poliza.coperaciongarantia);
            seguro.Actualizar = true;
            seguro.secuenciapoliza = secuencia;
            lseguro.Add(seguro);
            rqmantenimiento.AdicionarTabla(typeof(tsgsseguro).Name.ToUpper(), lseguro, false);

            //if ((decimal)rqmantenimiento.Monto > 0)
            //{
            //    EjecutaDevolucion(poliza, rqmantenimiento);
            //}

        }

        ///// <summary>
        ///// Ejecuta transaccion de pago de devolución
        ///// </summary>
        ///// <param name="poliza">Datos de poliza.</param>
        ///// <param name="rqmantenimiento">Request de mantenimiento.</param>
        //public void EjecutaDevolucion(tsgspoliza poliza, RqMantenimiento rqmantenimiento)
        //{
        //    // Datos devolucion
        //    poliza.valordevolucion = rqmantenimiento.Monto;
        //    poliza.fdevolucion = rqmantenimiento.Fconatable;

        //    // Ejecuta pago
        //    RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
        //    Mantenimiento.ProcesarAnidado(rq, 7, 12);

        //    // Ejecuta monetario
        //    this.EjecutaMonetario(rq, (int)poliza.ctiposeguro);
        //}

        ///// <summary>
        ///// Adiciona rubros al request monetario.
        ///// </summary>
        ///// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        ///// <param name="ctiposeguro">Codigo de seguro.</param>
        //private void EjecutaMonetario(RqMantenimiento rqmantenimiento, int ctiposeguro)
        //{
        //    decimal monto = rqmantenimiento.Monto;

        //    // Ejecuta monetario
        //    RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
        //    rqconta.EncerarRubros();

        //    // Rubro monetario
        //    TransaccionRubro trubro = new TransaccionRubro(rqmantenimiento.Cmodulotranoriginal, rqmantenimiento.Ctranoriginal);
        //    tmonrubro tmonrubro = trubro.GetRubro(TsgsTipoSeguroDetalleDal.Find(ctiposeguro).csaldocxc);

        //    RqRubro rqrubro = new RqRubro(tmonrubro.crubro, monto, rqmantenimiento.Cmoneda);
        //    rqrubro.Coperacion = rqmantenimiento.Coperacion;
        //    rqrubro.Actualizasaldo = false;
        //    rqconta.AdicionarRubro(rqrubro);

        //    // Ejecuta la transaccion monetaria anidada.
        //    if (rqconta.Rubros != null && !(rqconta.Rubros.Count < 1))
        //    {
        //        new ComprobanteMonetario(rqconta);
        //    }
        //}
    }
}
