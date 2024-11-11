using core.componente;
using core.servicios.mantenimiento;
using dal.inversiones.parametros;
using dal.inversiones.reajustes;
using inversiones.datos;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace inversiones.comp.mantenimiento.inversiones.pagos
{
    public class recuperaciondefault:ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (rqmantenimiento.Mdatos.ContainsKey("ldatos") && rqmantenimiento.Mdatos.ContainsKey("comentario"))
            {
                
                string comentario = rqmantenimiento.GetString("comentario");


                var ING = JsonConvert.DeserializeObject<List<tinvdefaultdetalle>>(rqmantenimiento.Mdatos["ldatos"].ToString());
                IList<tinvdefaultdetalle> defdetalle = new List<tinvdefaultdetalle>();
                IList<tinvdefault> defa = new List<tinvdefault>();
                IList<Saldo> itm = new List<Saldo>();

                string CENTROCOSTO = TinvParametrosDal.GetValorTexto("ID_DEFAULT_CENTRO_COSTO",rqmantenimiento.Ccompania);

                foreach (tinvdefaultdetalle ingr in ING)
                {
                  tinvdefault def=  TinvDefaultDal.Find(ingr.cdefault);
                    def.fultimopago = ingr.fingreso;
                    def.Esnuevo = false;
                    def.Actualizar = true;
                    ingr.estadocdetalle = "PAG";
                    ingr.Esnuevo = false;
                    ingr.Actualizar = true;
                    Saldo ob = new Saldo();
                    ob.saldo = ingr.rubrocdetalle;
                    ob.valor = ingr.valor.Value;
                    ob.centroCosto = CENTROCOSTO;
                    ob.debito = true;
                    itm.Add(ob);
                    defa.Add(def);
                    defdetalle.Add(ingr);

                }

                decimal PLANTILLA = TinvParametrosDal.GetValorNumerico("ID_PLANTILLA_RECUPDEFAULT", rqmantenimiento.Ccompania);

                Saldo salTotal = new Saldo();
                    salTotal.saldo = "BANCOS";
                    salTotal.valor = Suma(itm);
                    salTotal.centroCosto = CENTROCOSTO;
                    salTotal.debito = false;
                    itm.Add(salTotal);
                
                var json = JsonConvert.SerializeObject(itm);
                rqmantenimiento.Mdatos.Add("Saldos", json);

                
                rqmantenimiento.Mdatos.Add("tipodocumento", "DIAGEN");

                rqmantenimiento.Mdatos.Add("cconcepto", 3);
              
                rqmantenimiento.Mdatos.Add("cplantilla", (int)PLANTILLA);

                rqmantenimiento.Mdatos.Add("generarcomprobante", true);
                rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
                RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                rq.EncerarRubros();
                Mantenimiento.ProcesarAnidado(rq, 11, 430);
             
                rqmantenimiento.AdicionarTabla("tinvdefault", ING, false);
                rqmantenimiento.Response["VALIDADO"] = true;

            }
            else
            {
                return;
            }
        }
        public static decimal Suma(IList<Saldo> sal)
        {
            decimal total = 0;
            foreach (Saldo ingreso in sal)
            {
               


                    total = total +
                        ingreso.valor;


              
            }
            return total;
        }

      
    }
}
