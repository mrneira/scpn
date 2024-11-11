using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using dal.seguros;
using util.dto;
using dal.generales;

namespace seguros.comp.consulta.consultaSeguros
{
    class ConsultaPolizas : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            string coperacioncartera = rqconsulta.Mdatos["coperacioncartera"].ToString();
            string coperaciongarantia = rqconsulta.Mdatos["coperaciongarantia"].ToString();
            long cpersona = Int32.Parse(rqconsulta.Mdatos["cpersona"].ToString());

            tsgsseguro tsgsseguro = TsgsSeguroDal.Find(coperacioncartera, coperaciongarantia);
            List<tsgsseguro> lseguros = TsgsSeguroDal.FindPolizasCan(cpersona);
            List<tsgspoliza> lpolizas = new List<tsgspoliza>();
            tsgspoliza obj = new tsgspoliza();

            if (tsgsseguro.incremento)
            {

                

                foreach (tsgsseguro lseg in lseguros) {

                    if (lseg.secuenciapoliza == null)
                    {
                        return;
                    }
                    
                        obj = TsgsPolizaDal.FindPolizaCan(lseg.coperacioncartera, lseg.coperaciongarantia, (int)lseg.secuenciapoliza);
                  
                    if (obj.cdetalleestado != null)
                    {
                        tgencatalogodetalle catalogodetallep = TgenCatalogoDetalleDal.Find((int)obj.ccatalogoestado, obj.cdetalleestado);
                        obj.AddDatos("nestado", catalogodetallep.nombre);
                    }
                    if (obj.ctiposeguro != null)
                    {
                        tsgstiposegurodetalle tsgstiposegurodetalle = TsgsTipoSeguroDetalleDal.Find((int)obj.ctiposeguro);
                        obj.AddDatos("ntiposeguro", tsgstiposegurodetalle.nombre);
                    }
                    
                    lpolizas.Add(obj);
                }
                resp["TABLA"] = lpolizas;


            }
            else
            {
                List<tsgspoliza> lpoli = TsgsPolizaDal.Find(tsgsseguro.coperacioncartera, tsgsseguro.coperaciongarantia);
                foreach (tsgspoliza lpol in lpoli)
                {
                    obj = TsgsPolizaDal.FindPolizaCan(lpol.coperacioncartera, lpol.coperaciongarantia, (int)lpol.secuencia);
                    if (obj.cdetalleestado != null)
                    {
                        tgencatalogodetalle catalogodetallep = TgenCatalogoDetalleDal.Find((int)obj.ccatalogoestado, obj.cdetalleestado);
                        obj.AddDatos("nestado", catalogodetallep.nombre);
                    }
                    if (obj.ctiposeguro != null)
                    {
                        tsgstiposegurodetalle tsgstiposegurodetalle = TsgsTipoSeguroDetalleDal.Find((int)obj.ctiposeguro);
                        obj.AddDatos("ntiposeguro", tsgstiposegurodetalle.nombre);
                    }

                    lpolizas.Add(obj);
                }

                resp["TABLA"] = lpolizas;
            }


        }
    }
}
