using core.componente;
using dal.monetario;
using modelo;
using System.Collections.Generic;
using util.dto.consulta;
using util.dto.mantenimiento;

namespace monetario.comp.consulta {

    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar los rubros asociados a un modulo transaccion.
    /// Los rubros entrega en una List<Map<Integer, String>> con el codigo de rubro y el nombre.
    /// </summary>
    public class RubrosTransaccion : ComponenteConsulta {

        private IList<tmonrubro> lrubros = null;

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            int? cconcepto = rqconsulta.GetInt("cconcepto");
            if (cconcepto != null) {
                tgentransaccion tgentransaction = (tgentransaccion)rqconsulta.Tgentransaccion;
                lrubros = TmonRubroDal.FindPorConcepto(tgentransaction.cmodulo, tgentransaction.ctransaccion, (int)cconcepto.Value);
            } else {
                lrubros = TmonRubroDal.Find((tgentransaccion)rqconsulta.Tgentransaccion);
            }

            List<DtoRubro> ldatos = new List<DtoRubro>();
            if (lrubros != null) {
                foreach (tmonrubro obj in lrubros) {
                    if (!obj.ingreso.Value) {
                        continue;
                    }
                    DtoRubro r = new DtoRubro();
                    r.Rubro = obj.crubro;
                    r.Nombre = TmonSaldoDal.Find(obj.csaldo).nombre;
                    r.Desabilitar = obj.desabilitarpagina == null ? 0 : obj.desabilitarpagina.Value ? 1 : 0;
                    r.Csaldo = obj.csaldo;
                    ldatos.Add(r);
                }
            }

            // fija los datos en el response.
            rqconsulta.Response["_RUBROS"] = ldatos;
            //throw new NotImplementedException();
        }
    }
}


