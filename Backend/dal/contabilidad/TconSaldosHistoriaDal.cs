using modelo;
using System;
using System.Collections.Generic;
using System.Reflection;
using util;
using util.servicios.ef;

namespace dal.contabilidad {

    /// <summary>
    /// Clase que implemeta, dml manuales de la tabla TconSaldosHistoria.
    /// </summary>
    public class TconSaldosHistoriaDal {

        /// <summary>
        /// Metodo que crea y entraga un registro de historia de saldos contables.
        /// </summary>
        /// <param name="tconsaldos">Objeto que contiene los saldos contables vigentes.</param>
        /// <param name="fcontable">Fecha de contable con la cual se caduca el registro de historia.</param>
        /// <returns>TconSaldosHistoriaDto</returns>
        public static tconsaldoshistoria CrearHistoria(tconsaldos tconsaldos, int fcontable) {
            // En capitalizacion la fecha de la historia es la fecha de capitalizacion.
            int fcaducidad = Fecha.AdicionaDias365(fcontable, -1);
            tconsaldoshistoria obj = new tconsaldoshistoria();
            obj.fcaducidad = fcaducidad;
            obj.ccuenta = tconsaldos.ccuenta;
            obj.cagencia = (int)tconsaldos.cagencia;
            obj.csucursal = (int)tconsaldos.csucursal;
            obj.particion = Constantes.GetParticion(fcaducidad);
            obj.ccompania = (int)tconsaldos.ccompania;
            obj.cmoneda = tconsaldos.cmoneda;
            obj.fvigencia = tconsaldos.fvigencia;

            IEnumerable<FieldInfo> lcampos = DtoUtil.GetCampos(tconsaldos);
            foreach (FieldInfo fi in lcampos) {
                if (fi.Name.Equals("pk")) {
                    continue;
                }
                if (fi.Name.IndexOf("<") >= 0 && fi.Name.IndexOf(">") >= 0) {
                    string campo = fi.Name.Substring(fi.Name.IndexOf("<") + 1, fi.Name.LastIndexOf(">") - 1);
                    try {
                        Object valor = DtoUtil.GetValorCampo(tconsaldos, campo);
                        DtoUtil.SetValorCampoSinCambiarTipo(obj, campo, valor);
                    } catch (Exception) {
                        throw new AtlasException("BCONTA-001", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE HISTORIA: {1} ", campo, obj.GetType().Name);
                    }
                }
            }
            Sessionef.Save(obj); 
            return obj;
        }

    }
}


