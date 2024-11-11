using dal.seguridades;
using modelo;
using seguridad.comp.login.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.login {

    public class VerificaTerminal : GrabaSession  {

        /// <summary>
        /// Metodo que se encarga de verificar los datos de la ip de la cual se conecta el usuario
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tsegusuariodetalle obj = (tsegusuariodetalle)rqmantenimiento.GetDatos("TSEGUSUARIODETALLE");
            if (!Constantes.EsUno(obj.agenciadelterminal)) {
                return;
            }
            String ip = (String)rqmantenimiento.Cterminalremoto;
            tsegterminal ter = TsegTerminalDal.Find(ip, rqmantenimiento.Ccompania);
            rqmantenimiento.AddDatos("TSEGTERMINAL", ter);
        }

    }
}
