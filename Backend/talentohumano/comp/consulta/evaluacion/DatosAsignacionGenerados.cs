using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using dal.talentohumano;
using modelo;

namespace talentohumano.comp.consulta.evaluacion
{
    public class DatosAsignacionGenerados : ComponenteConsulta
    {
        /// <summary>
        /// Metodo que entrega la plantilla a consultar.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();

            IList<tthfuncionariodetalle> lmovi = new List<tthfuncionariodetalle>();
            IList<tthcontratodetalle> ldatos = TthContratoDal.FindActivos();
            foreach (tthcontratodetalle fd in ldatos) {
                tthfuncionariodetalle fde = new tthfuncionariodetalle();
                fde = TthFuncionarioDal.Find(fd.cfuncionario);
                lmovi.Add(fde);
            }
            decimal cplantillajefe = TthParametrosDal.GetValorNumerico("PLANTILLAJEFE", rqconsulta.Ccompania);
            decimal cplantilla = decimal.Parse(rqconsulta.Mdatos["cplantilla"].ToString());
            foreach (tthfuncionariodetalle mov in lmovi)
            {
                Dictionary<string, object> mresponse = DatosAsignacionGenerados.MovimientoToMap(mov, cplantilla,cplantillajefe);
                lresp.Add(mresponse);
            }
            // Fija la respuesta en el response. La respuesta contiene las asignaciones de todos los funcionarios.
            rqconsulta.Response["ASIGNACION"] = lresp;
    }
        public static Dictionary<string, object> MovimientoToMap(tthfuncionariodetalle funcionarios,decimal cplantilla,decimal cplantillajefe)
        {
        
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["cfuncionario"] = funcionarios.cfuncionario;
            m["jefecfuncionario"] = funcionarios.jefecfuncionario;
            decimal plantillatato = cplantilla;
            tthcontratodetalle cond = TthContratoDal.FindContratoFuncionario(funcionarios.cfuncionario);

            if (cond.esjefe==null) {
                cond.esjefe = false;
            }
            if (cond.esjefe.Value) {
                plantillatato = cplantillajefe;
            }

            m["cplantilla"] = (int)plantillatato;
            m["nfuncionario"] = funcionarios.primernombre + " " + funcionarios.primerapellido;
            m["fingresof"] = cond.fvinculacion;
            if (funcionarios.jefecfuncionario != null)
            {
                tthfuncionariodetalle jefe = TthFuncionarioDal.Find((long)funcionarios.jefecfuncionario);
                m["njefefuncionario"]= jefe.primernombre + " " + jefe.primerapellido;
            }
            else {
                m["njefefuncionario"] = null;
            }
            if ((int)plantillatato != 0)
            {
             

            }else
            {
                m["nplantilla"] = null;
            }
   

            return m;
        }

    }
}
