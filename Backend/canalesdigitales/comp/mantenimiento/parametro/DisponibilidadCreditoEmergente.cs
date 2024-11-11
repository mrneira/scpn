using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.parametro
{
    class DisponibilidadCreditoEmergente : ComponenteMantenimiento
    {
     

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            
            ActulizarDisponibiliad(rqmantenimiento);
        }

        private void ActulizarDisponibiliad(RqMantenimiento rqmantenimiento) {
            DateTime finicio = new DateTime();
            DateTime ffin = new DateTime();
            if (rqmantenimiento.Mdatos.ContainsKey("finicio") && rqmantenimiento.Mdatos.ContainsKey("ffin")) {
                finicio = (DateTime)rqmantenimiento.GetDate(nameof(finicio));
                ffin = (DateTime)rqmantenimiento.GetDate(nameof(ffin));

                List<tcanparametro> lparametros = new List<tcanparametro>();
                tcanparametro parametro = TcanParametroDal.Find("DISPONIBILIDAD-CREDITO-EMERGENTE");

                parametro.valor = $"{Fecha.GetFechaPresentacionAnioMesDia(Fecha.DateToInteger(finicio))}/{Fecha.GetFechaPresentacionAnioMesDia(Fecha.DateToInteger(ffin))}";
                parametro.Actualizar = true;
                parametro.Esnuevo = false;

                lparametros.Add(parametro);

                rqmantenimiento.AdicionarTabla("TCANPARAMETRO", lparametros, false);
            }
        }
    }
}
