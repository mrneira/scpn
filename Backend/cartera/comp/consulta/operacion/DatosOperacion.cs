using core.componente;
using dal.cartera;
using dal.generales;
using System;
using System.Collections.Generic;
using util.dto.consulta;
using modelo;
using dal.seguridades;

namespace cartera.comp.consulta.operacion {

    /// <summary>
    /// Clase que se encarga de consultar datos a presentar en consultas de una operacion de cartera.
    /// </summary>
    public class DatosOperacion : ComponenteConsulta {

        /// <summary>
        /// Consulta datos de la operacion.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            String coperacion = rqconsulta.Coperacion;
            tcaroperacion tcaroperacion = TcarOperacionDal.FindSinBloqueo(coperacion);

            Dictionary<string, object> moperacion = new Dictionary<string, object>();
            moperacion.Add("pk", tcaroperacion.coperacion);
            moperacion.Add("tasa", tcaroperacion.tasa);
            moperacion.Add("montooriginal", tcaroperacion.montooriginal);
            moperacion.Add("monto", tcaroperacion.monto);
            moperacion.Add("numerocuotas", tcaroperacion.numerocuotas);
            moperacion.Add("cuotasgracia", tcaroperacion.cuotasgracia);
            moperacion.Add("finiciopagos", tcaroperacion.finiciopagos);
            moperacion.Add("diapago", tcaroperacion.diapago);
            moperacion.Add("valorcuota", tcaroperacion.valorcuota);
            moperacion.Add("plazo", tcaroperacion.plazo);
            moperacion.Add("periodicidadcapital", tcaroperacion.periodicidadcapital);
            moperacion.Add("cusuarioapertura", tcaroperacion.cusuarioapertura);
            moperacion.Add("cusuariocancelacion", tcaroperacion.cusuariocancelacion);
            moperacion.Add("n_producto", TgenProductoDal.Find(tcaroperacion.cmodulo ?? 0, tcaroperacion.cproducto ?? 0).nombre);
            moperacion.Add("n_tipoproducto", TgenTipoProductoDal.Find(tcaroperacion.cmodulo ?? 0, tcaroperacion.cproducto ?? 0, tcaroperacion.ctipoproducto ?? 0).nombre);
            moperacion.Add("n_frecuencia", TgenFrecuenciaDal.Find(tcaroperacion.cfrecuecia ?? 0).nombre);
            moperacion.Add("n_tabla", TcarTipoTablaAmortizacionDal.Find(tcaroperacion.ctabla ?? 0).nombre);
            moperacion.Add("n_basecalculo", TgenBaseCalculoDal.Find(tcaroperacion.cbasecalculo).nombre);
            moperacion.Add("n_estatus", TcarEstatusDal.GetNombre(tcaroperacion.cestatus));
            moperacion.Add("n_sucursal", TgenSucursalDal.Find(tcaroperacion.csucursal ?? 0, rqconsulta.Ccompania).nombre);
            moperacion.Add("n_oficina", TgenAgenciaDal.Find(tcaroperacion.cagencia ?? 0, tcaroperacion.csucursal ?? 0, rqconsulta.Ccompania).nombre);
            moperacion.Add("faprobacion", tcaroperacion.faprobacion);
            moperacion.Add("fapertura", tcaroperacion.fapertura);
            moperacion.Add("fvencimiento", tcaroperacion.fvencimiento);
            moperacion.Add("fcancelacion", tcaroperacion.fcancelacion);
            moperacion.Add("coperacionmigrada", tcaroperacion.coperacionmigrada);
            moperacion.Add("coperacionarreglopago", tcaroperacion.coperacionarreglopago);
            moperacion.Add("n_cestadooperacion", TcarEstadoOperacionDal.Find(tcaroperacion.cestadooperacion).nombre);

            tcaroperacioncalificacion calif = TcarOperacionCalificacionDal.Find(tcaroperacion);
            if (calif.ccalificacion != null) {
                tgencalificacion gencalif = TgenCalificacionDal.Find(calif.ccalificacion);
                moperacion.Add("ncalificacion", gencalif.nombre);
                moperacion.Add("fcalificacion", calif.fcalificacion);
            }

            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            lresp.Add(moperacion);

            // adiciona los datos al response
            // En un form siempre se devuelve como una lista TCAROPERACION=[{campo1:valor,campo2:valor2}]
            rqconsulta.Response.Add("TCAROPERACION", lresp);
        }
    }
}
