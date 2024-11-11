using core.componente;
using dal.generales;
using dal.persona;
using dal.prestaciones;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;

namespace prestaciones.comp.consulta.expediente {
    class ValidacionLiquidacion :ComponenteConsulta {
        /// <summary>
        /// Clase que realiza las validacione del socio contra las parametrizacione realizadas
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            int ctipobaja = int.Parse(rqconsulta.Mdatos["ctipobaja"].ToString());
            string cdetalletipoexp = rqconsulta.Mdatos["cdetalletipoexp"].ToString();
            List<tpreliquidacionbaja> ldatos = TpreLiquidacionBajaDal.FindToBaja(ctipobaja);
            IList<tgencatalogodetalle> lcat = new List<tgencatalogodetalle>();
            if(ctipobaja != 0) {
                if(ldatos.Count <= 0) {
                    tsoctipobaja datos = TsocTipoBajaDal.Find(ctipobaja);
                    throw new AtlasException("PRE-010", "PARA EL TIPO DE BAJA {0} NO SE ENCUENTRA PARAMETRIZADO NINGÚN TIPO DE LIQUIDACIÓN", datos.nombre);
                } else {
                    if(ldatos.Find(x => x.cdetalletipoexp == cdetalletipoexp) == null) {
                        tsoctipobaja datos = TsocTipoBajaDal.Find(ctipobaja);
                        tgencatalogodetalle caterror = TgenCatalogoDetalleDal.FindInDataBase(2802, cdetalletipoexp);
                        throw new AtlasException("PRE-011", "SOCIO TIENE DERECHO A: {0} , LA CUAL NO ESTÁ PARAMETRIZADA PARA EL TIPO DE BAJA: {1}", caterror.nombre, datos.nombre);
                    }

                    foreach(tpreliquidacionbaja obj in ldatos) {
                        tgencatalogodetalle cat = TgenCatalogoDetalleDal.FindInDataBase(obj.ccatalogotipoexp, obj.cdetalletipoexp);
                        cat.AddDatos("beneficiariosocio", obj.beneficiariosocio);
                        lcat.Add(cat);
                    }
                }
            }
            rqconsulta.Response["TIPLIQUID"] = lcat;
        }
    }
}
