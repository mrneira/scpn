using core.componente;
using dal.cartera;
using dal.generales;
using modelo;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using util.enums;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.aprobacion {

    /// <summary>
    /// Clase que pasa los datos de garantias asociadas a una solicitud de credito a garantias asociadas a una operacion de cartera.
    /// </summary>
    public class SolicitudToOperacionGarantias : ComponenteMantenimiento {

        /// <summary>
        /// Transforma datos de personas solicitud a datos de operacion personas.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            long csolicitud = long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString());
            tcarsolicitud tcarsolicitud = TcarSolicitudDal.Find(csolicitud);
            List<tcaroperaciongarantias> loperaciongarantias = new List<tcaroperaciongarantias>();

            List<tcarsolicitudgarantias> lsolgarantias = (List<tcarsolicitudgarantias>)rqmantenimiento.GetDatos("SOLGARANTIASVALIDADAS");
            if (lsolgarantias == null) {
                lsolgarantias = TcarSolicitudGarantiasDal.FindSolicitudGarantias(csolicitud);
            }

            // Transforma a garantias de la operacion.
            loperaciongarantias = TcarSolicitudGarantiasDal.ToTcarOperacionGarantias(lsolgarantias, rqmantenimiento.Coperacion);
            loperaciongarantias = CrearOperacionPagare(rqmantenimiento, loperaciongarantias, tcarsolicitud);
            if (loperaciongarantias.Count <= 0) {
                return;
            }
            // Adiciona datos a Tabla para que haga el commit de los objetos al final.
            rqmantenimiento.AdicionarTabla("TCAROPERACIONGARANTIAS", loperaciongarantias, false);
        }


        /// <summary>
        /// Metodo que adiciona la garantia de tipo pagare a la operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="loperaciongarantias">Lista de garantias de operacion.</param>
        /// <param name="tcarsolicitud">Instancia de solicitud.</param>
        /// <returns></returns>
        public static List<tcaroperaciongarantias> CrearOperacionPagare(RqMantenimiento rqmantenimiento, List<tcaroperaciongarantias> loperaciongarantias, tcarsolicitud tcarsolicitud)
        {
            // Operacion garantias para pagare
            tcaroperaciongarantias g = new tcaroperaciongarantias();
            g.coperacion = rqmantenimiento.Coperacion;
            g.secuencia = Constantes.UNO;
            g.coperaciongarantia = CrearPagare(rqmantenimiento, tcarsolicitud);

            // Adiciona en lista de retorno
            loperaciongarantias.Add(g);
            return loperaciongarantias;
        }

        /// <summary>
        /// Creacion de garantia tipo pagare.
        /// </summary>
        /// <param name="rq">Request de mantenimiento.</param>
        /// <param name="tcarsolicitud">Instancia de solicitud.</param>
        public static string CrearPagare(RqMantenimiento rq, tcarsolicitud tcarsolicitud)
        {
            // Numero de operacion de garantia
            int cproducto = Constantes.UNO;
            int ctipoproducto = Constantes.UNO;
            string coperaciongarantia = TgenOperacionNumeroDal.GetNumeroOperacion(EnumModulos.GARANTIAS.Cmodulo, cproducto, ctipoproducto, 1, 1, 1);

            // Garantia
            tgaroperacion gar = new tgaroperacion();
            gar.coperacion = coperaciongarantia;
            gar.ctipogarantia = "A17";
            gar.ctipobien = "1";
            gar.cclasificacion = "A";
            gar.fvigencia = rq.Fconatable;
            gar.cpersona = tcarsolicitud.cpersona;
            gar.cmodulo = EnumModulos.GARANTIAS.Cmodulo;
            gar.cproducto = cproducto;
            gar.ctipoproducto = ctipoproducto;
            gar.ccompania = rq.Ccompania;
            gar.cmoneda = rq.Cmoneda;
            gar.cagencia = rq.Cagencia;
            gar.csucursal = rq.Csucursal;
            gar.cusuarioapertura = rq.Cusuario;
            gar.cestatus = "ING";
            gar.renovacion = false;
            gar.mensaje = rq.Mensaje;
            Sessionef.Grabar(gar);

            // Avaluo de Garantia
            tgaroperacionavaluo ava = new tgaroperacionavaluo();
            ava.coperacion = coperaciongarantia;
            ava.verreg = Constantes.CERO;
            ava.ccompania = rq.Ccompania;
            ava.optlock = Constantes.CERO;
            ava.cusuarioing = rq.Cusuario;
            ava.fingreso = rq.Freal;
            ava.valoravaluo = decimal.Add((decimal)tcarsolicitud.montooriginal, TcarSolicitudSegurosDal.ValorAnticipo(tcarsolicitud.csolicitud, false));
            Sessionef.Grabar(ava);

            return coperaciongarantia;
        }

    }
}
