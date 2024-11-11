using core.componente;
using dal.lote;
using lote.helper;
using lote.resultado;
using System;
using System.Threading;
using util;
using util.dto.mantenimiento;
using modelo;
using System.Collections.Generic;

namespace lote.comp.mantenimiento
{
    /// <summary>
    /// Clase que se encarga de ejecutar lotes o batch de transacciones, levanta un hilo de ejecucion y entrega una respuesta al canal de origen.
    /// </summary>
    public class EjecutorLotes : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetDatos("CLOTE") == null)
            {
                throw new AtlasException("LOTE-0001", "CODIGO DE LOTE REQUERIDO");
            }
            String clote = rqmantenimiento.GetDatos("CLOTE").ToString();
            IList<tlotepredecesora> predecesoras = TLotePredecesoraDal.Find(clote);
            if (predecesoras != null && predecesoras.Count > 0)
            {
                foreach (tlotepredecesora predecesora in predecesoras)
                {
                    //valida que se ejecuto antes el proceso
                    TloteControlEjecucionDal.Ejecucion(rqmantenimiento.Fconatable, predecesora.clotepredecesora);
                    //valida que el proceso no se encuentre en estatus pendiente
                    TloteControlEjecucionDal.LotesenEjecucion(rqmantenimiento.Fconatable, predecesora.clotepredecesora);
                }
            }
            int numejecucion = this.CreaControl(rqmantenimiento, clote);

            LoteHilo lotehilo = new LoteHilo(rqmantenimiento, clote, numejecucion);
            Thread thread = new Thread(lotehilo.Procesar);
            thread.Start();

            rqmantenimiento.Response.SetMsgusu("EJECUTANDO LOTE, " + "CÓDIGO DE EJECUCION: " + numejecucion);
        }

        private int CreaControl(RqMantenimiento rqmantenimiento, String clote)
        {
            TloteControlEjecucionDal.ValidaenEjecucion(rqmantenimiento.Fconatable, clote);
            int numejecucion = TloteControlEjecucionDal.GetNumeroEjecucion(rqmantenimiento.Fconatable, clote);

            ControlLote control = new ControlLote(rqmantenimiento.Ccompania, rqmantenimiento.Fconatable, clote, "C", numejecucion,
                    rqmantenimiento.Cmodulo, rqmantenimiento.Ctranoriginal);
            Thread thread = new Thread(control.Ejecutar);
            thread.Start();
            thread.Join();

            return numejecucion;
        }

    }
}
