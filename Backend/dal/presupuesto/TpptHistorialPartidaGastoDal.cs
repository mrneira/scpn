using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.presupuesto {

    public class TpptHistorialPartidaGastoDal {

        public static tppthistorialpartidagasto Crear(tpptpartidagasto pgfuente, string ccompromiso, string cafectacion, string cliberacion, string creforma , 
            string ccomprobante, string concepto, string infoadicional, RqMantenimiento rq, decimal vcompromiso, decimal vtransaccion) {
            tppthistorialpartidagasto historialpg = new tppthistorialpartidagasto();
            historialpg.Esnuevo = true;
            historialpg.cpartidagasto = pgfuente.cpartidagasto;
            historialpg.fingreso = rq.Freal;
            historialpg.aniofiscal = rq.Freal.Year;
            historialpg.ccompromiso = ccompromiso;
            historialpg.cafectacion = cafectacion;
            historialpg.cliberacion = cliberacion;
            historialpg.creforma = creforma;
            historialpg.ccomprobante = ccomprobante;
            historialpg.concepto =  concepto.PadRight(20).Substring(0,19);
            historialpg.infoadicional = infoadicional;
            historialpg.vasignacioninicial = pgfuente.vasignacioninicial;
            historialpg.vmodificado = creforma == null ? 0: pgfuente.vmodificado;
            historialpg.vcodificado = pgfuente.vcodificado;
            historialpg.vcompromiso = vcompromiso;
            historialpg.vcomprometido = pgfuente.vcomprometido;
            historialpg.vdevengado = pgfuente.vdevengado;
            historialpg.vpagado = pgfuente.vpagado;
            historialpg.vsaldoporcomprometer = pgfuente.vsaldoporcomprometer;
            historialpg.vsaldopordevengar = pgfuente.vsaldopordevengar;
            historialpg.vsaldoporpagar = pgfuente.vsaldoporpagar;
            historialpg.porcenejecucion = pgfuente.porcenejecucion;
            historialpg.porcenparticipacion = pgfuente.porcenparticipacion;
            historialpg.cusuarioing = rq.Cusuario;
            historialpg.vtransaccion = vtransaccion;
            return historialpg;
        }

        public static List<tppthistorialpartidagasto> BuscarListaHistorialPorComprobante(string ccomprobante) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tppthistorialpartidagasto> lista = new List<tppthistorialpartidagasto>();
            lista = contexto.tppthistorialpartidagasto.AsNoTracking().Where(x => x.ccomprobante.Equals(ccomprobante)).OrderBy(x => x.chpartidagasto).ToList();
            return lista;
        }
    }

}
