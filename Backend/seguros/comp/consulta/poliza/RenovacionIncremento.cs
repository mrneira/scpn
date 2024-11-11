using core.componente;
using dal.garantias;
using dal.seguros;
using modelo;
using util;
using util.dto;
using util.dto.consulta;

namespace seguros.comp.consulta.poliza {
    class RenovacionIncremento : ComponenteConsulta {
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            string coperacioncartera = rqconsulta.Mdatos["coperacioncartera"].ToString();
            string coperaciongarantia = rqconsulta.Mdatos["coperaciongarantia"].ToString();

            // Valida garantia
            tgaroperacion gar = TgarOperacionDal.FindSinBloqueo(coperaciongarantia);
            if (gar == null || gar.coperacionanterior == null) {
                throw new AtlasException("SGS-0005", "NO EXISTE GARANTIA ORIGINAL [ {0} ]", coperaciongarantia);
            }

            // Datos seguro original
            tsgsseguro segurooriginal = TsgsSeguroDal.FindToGarantia(gar.coperacionanterior);
            if (segurooriginal == null) {
                throw new AtlasException("SGS-0006", "NO EXISTE SEGURO ORIGINAL PARA GARANTIA [ {0} ]", gar.coperacionanterior);
            }
            tsgspoliza polizaoriginal = TsgsPolizaDal.FindPoliza(segurooriginal);


            // Datos seguro renovacion
            tsgspoliza pol = new tsgspoliza();
            pol.coperacioncartera = coperacioncartera;
            pol.coperaciongarantia = coperaciongarantia;
            pol.finicio = polizaoriginal.finicio;
            pol.fvencimiento = polizaoriginal.fvencimiento;
            pol.valorasegurado = polizaoriginal.valorasegurado;
            pol.numeropoliza = polizaoriginal.numeropoliza;

            resp["POLIZAINCREMENTO"] = pol;
        }
    }
}
