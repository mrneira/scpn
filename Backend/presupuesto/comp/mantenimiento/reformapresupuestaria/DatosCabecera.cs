using core.componente;
using core.servicios;
using dal.presupuesto;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace presupuesto.comp.mantenimiento.reformapresupuestaria
{

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de un compromiso para una partida.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0) {
                return;
            }
            tpptreforma cabecera = (tpptreforma)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            if (cabecera.creforma == null)
            {
                cabecera.creforma = Secuencia.GetProximovalor("PPTREFORMA").ToString();
            }
            cabecera.cusuarioing = rqmantenimiento.Cusuario;
            cabecera.fingreso = rqmantenimiento.Freal;
            
            List<IBean> lmantenimiento = new List<IBean>();
            List<tpptpartidagasto> lpartidas = new List<tpptpartidagasto>();
            List<tppthistorialpartidagasto> lhistorialpg = new List<tppthistorialpartidagasto>();
            if (rqmantenimiento.GetTabla("DETALLE") != null) {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0) {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
            }

            tpptpartidagasto partida;
            foreach (tpptreformadetalle obj in lmantenimiento) {
                partida = TpptPartidaGastoDal.Find(obj.cpartidagasto, Fecha.GetAnio(rqmantenimiento.Fconatable));
                TpptPartidaGastoHistoriaDal.CreaHistoria(partida, rqmantenimiento.Fconatable);
                obj.creforma = cabecera.creforma;
                obj.aniofiscal = partida.aniofiscal;
                if (obj.decremento) {
                    partida.vmodificado -= obj.valor;
                    partida.vcodificado -= obj.valor;
                    partida.vsaldoporcomprometer -= obj.valor;
                    partida.vsaldopordevengar -= obj.valor;
                    partida.vsaldoporcertificar -= obj.valor;
                } else {
                    partida.vmodificado += obj.valor;
                    partida.vcodificado += obj.valor;
                    partida.vsaldoporcomprometer += obj.valor;
                    partida.vsaldopordevengar += obj.valor;
                    partida.vsaldoporcertificar += obj.valor;
                }
                lpartidas.Add(partida);
                tppthistorialpartidagasto hpg = TpptHistorialPartidaGastoDal.Crear(partida, null, null, null, cabecera.creforma, null,
                    ConstantesPresupuesto.CONCEPTO_REFORMA_PRESUPUESTARIA, cabecera.infoadicional, rqmantenimiento, 0, obj.valor);
                lhistorialpg.Add(hpg);
            }

            rqmantenimiento.AdicionarTabla("tpptpartidagasto", lpartidas, false);
            rqmantenimiento.AdicionarTabla("tppthistorialpartidagasto", lhistorialpg, false);
            rqmantenimiento.Response.Add("creforma", cabecera.creforma);
        }
    }
}
