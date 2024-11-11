using core.componente;
using dal.prestaciones;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;


namespace prestaciones.comp.mantenimiento.expediente {
    class Liquidacion :ComponenteMantenimiento {
        /// <summary>
        /// Crea el detalle de la liquidacion
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            if(rm.GetTabla("DATOSEXPEDIENTE") == null || rm.GetTabla("DATOSEXPEDIENTE").Lregistros.Count() <= 0) {
                return;
            }
            tpreexpediente obj = (tpreexpediente)rm.GetTabla("DATOSEXPEDIENTE").Lregistros.ElementAt(0);
            int secuencia = int.Parse(rm.Mdatos["secuencia"].ToString());
            tpreliquidacion objliq = TpreLiquidacionDal.Find(secuencia);

            int coeficiente = int.Parse((rm.Mdatos["coeficiente"]).ToString());
            decimal valorbonificacion = decimal.Parse(rm.Mdatos["valorbonificacion"].ToString());
            decimal vcuantiabasica = decimal.Parse(rm.Mdatos["vcuantiabasica"].ToString());
            decimal tprestamos = decimal.Parse(rm.Mdatos["tprestamos"].ToString());
            decimal tretenciones = decimal.Parse(rm.Mdatos["tretenciones"].ToString());
            decimal tnovedades = decimal.Parse(rm.Mdatos["tnovedades"].ToString());
            decimal daportes = decimal.Parse(rm.Mdatos["daportes"].ToString());
            decimal taportes = decimal.Parse(rm.Mdatos["taportes"].ToString());
            decimal totalegresos = decimal.Parse(rm.Mdatos["totalegresos"].ToString());
            decimal interes = decimal.Parse(rm.Mdatos["interes"].ToString());
            decimal porcentaje = decimal.Parse(rm.Mdatos["porcentaje"].ToString());

            if(objliq == null) {
                objliq = TpreLiquidacionDal.Crear();
                objliq.Esnuevo = true;
            }
            //registra la fecha actual para creacion del registro
            objliq.coeficiente = coeficiente;
            objliq.vbonificacion = Math.Round(valorbonificacion, 2, MidpointRounding.AwayFromZero);
            objliq.vcuantiabasica = Math.Round(vcuantiabasica, 2, MidpointRounding.AwayFromZero);
            objliq.vinteres = interes;
            objliq.verreg = 0;
            objliq.secuencia = secuencia;
            objliq.dprestamos = Math.Round(tprestamos, 2, MidpointRounding.AwayFromZero);
            objliq.dretencion = Math.Round(tretenciones, 2, MidpointRounding.AwayFromZero);
            objliq.dnovedades = Math.Round(tnovedades, 2, MidpointRounding.AwayFromZero);
            objliq.daportes = Math.Round(daportes, 2, MidpointRounding.AwayFromZero);
            objliq.taportes = Math.Round(taportes, 2, MidpointRounding.AwayFromZero);
            objliq.tdescuento = Math.Round(totalegresos, 2, MidpointRounding.AwayFromZero);
            objliq.porcentajeanticipo = porcentaje;
            rm.AdicionarTabla("tpreliquidacion", objliq, false);
        }
    }
}
