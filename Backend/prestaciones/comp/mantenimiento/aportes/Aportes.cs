using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.prestaciones;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.aportes {
    class Aportes : ComponenteMantenimiento {
        /// <summary>
        /// Clase que actualiza los aportes 
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("APORTES") == null || rm.GetTabla("APORTES").Lregistros.Count() <= 0) {
                return;
            }
            List<IBean> ldatos = rm.GetTabla("APORTES").Lregistros;

            decimal porcentajepatronal = TpreParametrosDal.GetValorNumerico("POR-APORTE-PATRONO");
            decimal porcentajepersonal = TpreParametrosDal.GetValorNumerico("POR-APORTE-PERSONAL");
            foreach (IBean o in ldatos) {
                tpreaporte obj = (tpreaporte)o;
                if (obj.Esnuevo) {
                    long caporte = Secuencia.GetProximovalor("APORTES");
                    tpreaporte aporteactual = TpreAportesDal.FindPorCpersonaFaporte(obj.cpersona, obj.fechaaporte);
                    if (aporteactual != null) {
                        throw new AtlasException("PRE-016", "ESTA INSERTANDO REGISTRANDO APORTES DUPLICADOS");
                    }
                    obj.caporte = caporte;
                }
                obj.ajustepatronal = obj.ajuste * porcentajepatronal / porcentajepersonal;
                obj.ajustepatronal = Math.Round((decimal)obj.ajustepatronal, 4, MidpointRounding.AwayFromZero);

                rm.AddDatos("totalAporteIndividual", obj.Esnuevo == true ? Math.Round((decimal)(obj.aportepersonal + obj.ajuste),2, MidpointRounding.AwayFromZero) : Math.Round((decimal)obj.ajuste,2, MidpointRounding.AwayFromZero));
                rm.AddDatos("totalAportePatronal", obj.Esnuevo == true ? Math.Round((decimal)(obj.aportepatronal + obj.ajustepatronal),2, MidpointRounding.AwayFromZero) : Math.Round((decimal)obj.ajustepatronal,2, MidpointRounding.AwayFromZero));
                rm.AddDatos("cargamanual", true);
                rm.AddDatos("cpersonarecibido", obj.cpersona);
                if (obj.Actualizar) {
                    if (obj.ajuste != 0 || obj.ajustepatronal != 0) {
                        RqMantenimiento rq = (RqMantenimiento)rm.Clone();
                        rq.EncerarRubros();
                        Mantenimiento.ProcesarAnidado(rq, 28, 4);
                    }
                } else {
                    RqMantenimiento rq = (RqMantenimiento)rm.Clone();
                    rq.EncerarRubros();
                    Mantenimiento.ProcesarAnidado(rq, 28, 4);
                }

            }
        }
    }
}
