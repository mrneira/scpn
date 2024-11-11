using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using dal.seguros;
using dal.garantias;
using dal.cartera;
using modelo;
using core.componente;
using util.dto.mantenimiento;
using util;

namespace seguros.comp.mantenimiento.modificacionSeguro
{
    class ModificacionSeguro : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            int cpersonaGarantia = int.Parse(rqmantenimiento.Mdatos["cpersona"].ToString());
            string coperacioncartera = rqmantenimiento.Mdatos["coperacioncartera"].ToString();
            string coperaciongrantia = rqmantenimiento.Mdatos["coperaciongarantia"].ToString();
            
            tsgsseguro tsgsseguro = TsgsSeguroDal.FindModificacionSeguro(cpersonaGarantia, coperacioncartera, coperaciongrantia);

            tgaroperacion tgaroperacion = TgarOperacionDal.FindSinBloqueo(coperaciongrantia);

            if (tsgsseguro == null && tgaroperacion.renovacion == true && tgaroperacion.coperacionanterior == null)
            {
                tgaroperacion.Esnuevo = false;
                tgaroperacion.Actualizar = true;
                tgaroperacion.coperacionanterior = rqmantenimiento.Mdatos["coperaciongarantianterior"].ToString();
                //tgaroperacion.renovacion = true;

                //throw new AtlasException("SGS-0007", "LA GARANTIA SE LA REALIZO POR RENOVACIÓN [ {0} ]", rqmantenimiento.Mdatos["coperaciongarantia"].ToString());
            }
            else
            {
                tsgsseguro.Esnuevo = false;
                tsgsseguro.Actualizar = true;
                tsgsseguro.incremento = true;

                
                
                tgaroperacion.Esnuevo = false;
                tgaroperacion.Actualizar = true;
                tgaroperacion.coperacionanterior = rqmantenimiento.Mdatos["coperaciongarantianterior"].ToString();
                tgaroperacion.renovacion = true;
            }

            rqmantenimiento.AdicionarTabla("TSGSSEGURO", tsgsseguro, false);
            rqmantenimiento.AdicionarTabla("TGAROPERACION", tgaroperacion, false);
        }
    }
}
