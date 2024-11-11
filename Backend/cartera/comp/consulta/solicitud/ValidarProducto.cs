using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using dal.cartera;

namespace cartera.comp.consulta.solicitud
{
    public class ValidarProducto : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            bool operacion = false;
            bool.TryParse(rqconsulta.Mdatos["operacion"].ToString(), out operacion);
            int cmodulo=0, cproducto=0, ctipoproducto=0;


            if (operacion)
            {
                string coperacion = rqconsulta.Mdatos["coperacion"].ToString();

                tcaroperacion op = TcarOperacionDal.FindSinBloqueo(coperacion);
                cmodulo = op.cmodulo.Value;
                cproducto = op.cproducto.Value;
                ctipoproducto = op.ctipoproducto.Value;
            }
            else {
                string csolicitud = rqconsulta.Mdatos["csolicitud"].ToString();

                tcarsolicitud sol = TcarSolicitudDal.Find(long.Parse(csolicitud));
                cmodulo = sol.cmodulo.Value;
                cproducto = sol.cproducto.Value;
                ctipoproducto = sol.ctipoproducto.Value;
            }
            

            tcarproducto p = TcarProductoDal.Find(cmodulo,cproducto,ctipoproducto);
            rqconsulta.Response["consolidado"] = (p.consolidado==null || p.consolidado==false)?false:true;
            tcarparametros param = TcarParametrosDal.Find("DESEMBOLSO-CUENTA-POR-PAGAR", rqconsulta.Ccompania);
            rqconsulta.Response["saldo"] = (p.consolidado == null || p.consolidado == false) ? "SPI" : param.texto;

        }
    }
}
