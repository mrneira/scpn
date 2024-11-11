using canalesdigitales.enums;
using cartera.saldo;
using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.cartera;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using util.thread;

namespace canalesdigitales.comp.mantenimiento.cartera {
    public class DesembolsoSolicitudCredito : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            tcaroperacion operacion = TcarOperacionDal.FindToSolicitud(csolicitud);

            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            rq.Ccanal = "OFI";
            rq.Cmodulo = EnumGeneral.MODULO_PRESTAMOS;
            rq.Cmodulotranoriginal = EnumGeneral.MODULO_PRESTAMOS;
            rq.Ctransaccion = 130;
            rq.Ctranoriginal = 130;
            rq.Mbce = new List<modelo.interfaces.IBean>();

            List<tcaroperacion> loperaciones = new List<tcaroperacion>();
            operacion.cestatus = "APR";
            operacion.cagencia = 2;
            operacion.cmodulo = EnumGeneral.MODULO_PRESTAMOS;
            operacion.Mdatos.Add("nproducto", "QUIROGRAFARIO");
            operacion.Mdatos.Add("ntipoproducto", "EMERGENTE");
            operacion.Mdatos.Add("nestadooperacion", "ORIGINAL");

            loperaciones.Add(operacion);

            rq.Mdatos.Add("OPERACIONESDESEMBOLSOMASIVO", JsonConvert.SerializeObject(loperaciones));

            Mantenimiento.ProcesarAnidado(rq, EnumGeneral.MODULO_PRESTAMOS, 130);
            rqmantenimiento.Mbce = rq.Mbce;
        }
    }
}
