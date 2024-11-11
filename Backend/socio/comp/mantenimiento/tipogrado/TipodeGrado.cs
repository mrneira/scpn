using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using core.componente;
using util.dto.mantenimiento;

namespace socio.comp.mantenimiento.tipogrado
{
    public class TipodeGrado : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetTabla("TSOCTIPOGRADO") != null)
            {
                tsoctipogrado  grado = (tsoctipogrado)rm.GetTabla("TSOCTIPOGRADO").Lregistros.ElementAt(0);
                if (TsocTipoGradoDal.FindExistOrden((int)grado.orden) == 1)
                    throw new AtlasException("GEN-019", "YA EXISTE UN REGISTRO CON ORDEN {0}", grado.orden);
            }
        }
    }
}