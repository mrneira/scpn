using core.componente;
using dal.talentohumano;
using dal.talentohumano.nomina;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace talentohumano.comp.mantenimiento.nomina.nomina
{
    public class RecalcularImpuestoRenta : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos.ContainsKey("ldatos") && rqmantenimiento.Mdatos.ContainsKey("mescdetalle") && rqmantenimiento.Mdatos.ContainsKey("tipocdetalle"))
            {
                string mes = rqmantenimiento.GetString("mescdetalle");
                string rubro = rqmantenimiento.GetString("tipocdetalle");

                IList<tnomimpuestorenta> imrent =  new List<tnomimpuestorenta>();
                
                var PAGOS = JsonConvert.DeserializeObject<List<tnompagoimpuestorenta>>(rqmantenimiento.Mdatos["ldatos"].ToString());
                foreach (tnompagoimpuestorenta pago in PAGOS) {
                    IList<tnomrol> roles = TnomRolDal.FindRoles(pago.cfuncionario.Value);
                    foreach (tnomrol rol in roles) {
                       tnomimpuestorenta pag= TnomImpuestoRentaDal.FindGastosDeducibles(pago.cfuncionario, pago.anio);
                        tthfuncionariodetalle fun = TthFuncionarioDal.FindFuncionario(pago.cfuncionario);
                        if (pag == null)
                        {
                               throw new AtlasException("TTH-019", "NO SE HA INGRESADO EL FORMULARIO DE GASTOS PERSONALES DEL FUNCIONARIO {0} PARA EL AÑO {0}", (fun.primernombre + " " + fun.primerapellido), pago.anio);

                        }
                        else {

                          decimal totalpagado= TnomIngresosDal.IngresosRetencionesFuente(pag.anio, pag.cfuncionario);
                            pag.cpagado = totalpagado;
                            pag.Esnuevo = false;
                            pag.Actualizar = true;
                            imrent.Add(pag);
                            Sessionef.Eliminar(rol);

                        }

                    }
                }
                rqmantenimiento.AdicionarTabla("tnompagoimpuestorenta", imrent, false);
                rqmantenimiento.Response["RECALCULADO"] = true;

            }
        }
    }
}
