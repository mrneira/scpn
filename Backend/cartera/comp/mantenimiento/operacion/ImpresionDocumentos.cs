using core.componente;
using dal.cartera;
using modelo;
using System;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.operacion
{

    public class ImpresionDocumentos : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            // Actualiza registros impresos.
            tcaroperaciondocumentos obj = TcarOperacionDocumentosDal.find(rqmantenimiento.Mdatos["coperacion"].ToString(), Int32.Parse(rqmantenimiento.Mdatos["cdocumento"].ToString()));
            if (obj == null)
            {
                return;
            }
            obj.numeroimpresion = obj.numeroimpresion + 1;
            obj.fultimaimpresion = rqmantenimiento.Freal;
            obj.cusuarioultimp = rqmantenimiento.Cusuario;
            Sessionef.Actualizar(obj);
        }
    }
}
