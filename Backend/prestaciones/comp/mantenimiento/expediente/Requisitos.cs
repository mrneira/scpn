using core.componente;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;
using modelo.interfaces;
using modelo;
using dal.prestaciones;
using Newtonsoft.Json;

namespace prestaciones.comp.mantenimiento.expediente {
    class Requisitos :ComponenteMantenimiento {
        List<tpreexpedienterequisitos> tprerequisitoexpediente = new List<tpreexpedienterequisitos>();
        /// <summary>
        /// Registra los requistos del expediente
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            if(!rm.Mdatos.ContainsKey("lregistrosRequisito")) {
                return;
            }
            List<tpretipoexpedienterequisito> listaRequisitosrm = JsonConvert.DeserializeObject<List<tpretipoexpedienterequisito>>(rm.Mdatos["lregistrosRequisito"].ToString());
            List<tpreexpedienterequisitos> listaRequisitos = new List<tpreexpedienterequisitos>();
            if(!rm.Mdatos.ContainsKey("secuencia")) {
                return;
            }
            int secuencia = int.Parse(rm.Mdatos["secuencia"].ToString());
            foreach(IBean o in listaRequisitosrm) {
                tpretipoexpedienterequisito obj = (tpretipoexpedienterequisito)o;
                bool verificada = bool.Parse(obj.Mdatos["verificada"].ToString());
                if(!verificada) {
                    continue;
                }

                tpreexpedienterequisitos req = new tpreexpedienterequisitos();
                req.Esnuevo = true;
                req.secuencia = secuencia;
                req.crequisito = obj.crequisito;
                req.opcional = obj.opcional;
                req.cusuarioverifica = rm.Cusuario;
                req.freal = rm.Freal;
                req.verificada = verificada;
                listaRequisitos.Add(req);
            }

            rm.AdicionarTabla("tpreexpedienterequisitos", listaRequisitos, false);
        }
    }
}
