using canalesdigitales.enums;
using core.componente;
using core.servicios.mantenimiento;
using dal.canalesdigitales;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.cartera {
    public class Simulacion : ComponenteMantenimiento {
        /// <summary>
        /// Método principal que ejecuta la Simulación de un crédito
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            //Armar data de tcarsolicitud
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);

            tcarsolicitud solicitud = new tcarsolicitud {
                csolicitud = 0,
                cproducto = rqmantenimiento.GetInt("cproducto"),
                ctipoproducto = rqmantenimiento.GetInt("ctipoproducto"),
                ctabla = rqmantenimiento.GetInt("ctabla"),
                cpersona = usuario.cpersona,
                cmodulo = EnumGeneral.MODULO_PRESTAMOS,
                cmoneda = EnumGeneral.USD,
                monto = rqmantenimiento.GetDecimal("montooriginal"),
                montooriginal = rqmantenimiento.GetDecimal("montooriginal"),
                numerocuotas = rqmantenimiento.GetInt("numerocuotas")
            };

            List<tcarproductorangos> lrangos = TcarProductoRangosDal.findInDataBase(EnumGeneral.MODULO_PRESTAMOS, Convert.ToInt32(solicitud.cproducto), Convert.ToInt32(solicitud.ctipoproducto), Convert.ToDecimal(solicitud.monto));

            if (lrangos is null || lrangos.Count != 1) {
                throw new AtlasException("CAR-0031", $"MONTO NO SE ENCUENTRA PARAMETRIZADO: {solicitud.monto}");
            }

            if (lrangos[0].plazomaximo < solicitud.numerocuotas) {
                throw new AtlasException("CAR-0032", $"PLAZO MAXIMO: {solicitud.numerocuotas}" + "{0}", lrangos[0].plazomaximo);
            }

            List<tcarsolicitud> lsolicitudes = new List<tcarsolicitud> { solicitud };

            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            rq.Ccanal = "OFI";
            rq.AddDatos("essimulacion", true);
            rq.AdicionarTabla("tcarsolicitud", lsolicitudes, 1, false);

            // Ejecuta transaccion de simulacion de cartera
            Mantenimiento.ProcesarAnidado(rq, 7, 97);
        }
    }
}
