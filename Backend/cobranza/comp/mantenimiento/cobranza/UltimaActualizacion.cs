using core.componente;
using dal.cobranzas;
using modelo;
using util.dto.mantenimiento;

namespace cobranza.comp.mantenimiento.cobranza {
    public class UltimaActualizacion : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            long ccobranza = long.Parse(rqmantenimiento.Mdatos["ccobranza"].ToString());
            tcobcobranza tcobcobranza = TcobCobranzaDal.FindToCobranza(ccobranza);

            tcobcobranza.Actualizar = true;
            tcobcobranza.fultmodificacion = rqmantenimiento.Fconatable;

            rqmantenimiento.AdicionarTabla("TCOBCOBRANZA", tcobcobranza, false);
        }

    }
}
