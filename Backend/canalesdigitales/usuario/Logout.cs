using core.componente;
using dal.canalesdigitales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace canalesdigitales.usuario {
    public class Logout : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ProcesarLogout(rqmantenimiento);
        }

        private void ProcesarLogout(RqMantenimiento rqmantenimiento) {
            string token = rqmantenimiento.GetString(nameof(token));
            tcanusuariosesion sesion = TcanUsuarioSesionDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal, token);
            if (sesion != null) {
                tcanusuariosesionhistoria historia = TcanUsuarioSesionHistoriaDal.Find(sesion.cusuario, sesion.ccanal, sesion.csubcanal, sesion.token);
                TcanUsuarioSesionHistoriaDal.Actualizar(historia);
                TcanUsuarioSesionDal.Eliminar(sesion);
            }
        }
    }
}
