using bce.util;
using core.componente;
using core.servicios.mantenimiento;
using dal.generales;
using dal.prestaciones;
using dal.socio;
using modelo;
using modelo.helper;
using Newtonsoft.Json;
using prestaciones.dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.novedades
{
    public class PagoRetenciones : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos.ContainsKey("ldatos") && rqmantenimiento.Mdatos.ContainsKey("cpersona")  && rqmantenimiento.Mdatos.ContainsKey("comentario"))
            {

                long cpersona = rqmantenimiento.GetLong("cpersona").Value;
                var ING = JsonConvert.DeserializeObject<List<tsocnovedadades>>(rqmantenimiento.Mdatos["ldatos"].ToString());
                if (rqmantenimiento.Mtablas.ContainsKey("TNFONDO")) {
                    rqmantenimiento.Mtablas["TNFONDO"] = null;
                }
                IList<tsocnovedadades> socnovedades = new List<tsocnovedadades>();
                tsoccesantia SOC = TsocCesantiaDal.Find(cpersona, rqmantenimiento.Ccompania);
                IList<Saldo> itm = new List<Saldo>();
                foreach (tsocnovedadades ret in ING)
                {
                    EntityHelper.SetActualizar(ret);
                    ret.Esnuevo = false;
                    ret.Actualizar = true;
                    ret.pagado = true;
                    Saldo ob = new Saldo();
                    ob.saldo = ret.cdetallenovedad;
                    ob.valor = ret.valor.Value;
                    //INCLUIR EN CLASE SALDOS SI SE NECESITA CENTRO DE COSTOS
                   // ob.centroCosto = r.centrocostocdetalle;
                    ob.ingreso = true;
                    itm.Add(ob);

                }
             

                    Saldo salTotal = new Saldo();
                    salTotal.saldo = "SPI";
                    salTotal.valor = Suma(itm);
                    //salTotal.centroCosto = cc.cdetalle;
                    salTotal.ingreso = false;
                    itm.Add(salTotal);
                
                var json = JsonConvert.SerializeObject(itm);
                rqmantenimiento.Mdatos.Add("Saldos", json);
                int plantillaretenciones = TpreParametrosDal.GetInteger("COD-PLANTILLA-PAGO-RETENCIONES");

               // rqmantenimiento.Mdatos.Add("", SOC.cde)
                rqmantenimiento.Mdatos.Add("tipodocumento", "DIAGEN");
                rqmantenimiento.Mdatos.Add("cconcepto", 3);//FINANCIERO
                rqmantenimiento.Mdatos.Add("cplantilla", plantillaretenciones);
                rqmantenimiento.Mdatos.Add("generarcomprobante", true);
                rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
                RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                rq.EncerarRubros();
                Mantenimiento.ProcesarAnidado(rq, 28, 48);
                foreach (tsocnovedadades nov in ING)
                {
                    
                    if (nov.valor > 0)
                    {

                        // tthfuncionariodetalle fun = TthFuncionarioDal.Find(rol.cfuncionario.Value);
                        //String nombre = nov.nombrebeneficiario;
                        //String documento = nov.documentobeneficiario;

                        string nombre = nov.novedad;
                        string documento = nov.identificacion;

                      decimal  totalspi = decimal.Round(nov.valor.Value, 2, MidpointRounding.AwayFromZero);

                        GenerarBce.InsertarPagoBce(rqmantenimiento, documento, nombre, nov.cuenta,
                                         nov.cpersona, nov.ccatalogotipocuenta.Value, nov.cdetalletipocuenta, nov.ccatalogobanco.Value,
                                         nov.cdetallebanco, totalspi, documento, (int)nov.cnovedad, rq.GetString("ccomprobante")); //validar juanito
                    }

                }
                rqmantenimiento.Mtablas["RETENCIONES"] = null;
                rqmantenimiento.AdicionarTabla("tsocnovedadades", ING, false);
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
                    total +=ingreso.valor;
               
            }
            return total;
        }
    }
}
