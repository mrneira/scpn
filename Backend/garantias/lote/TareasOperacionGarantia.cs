﻿using core.util;
using dal.garantias;
using dal.lote;
using garantias.datos;
using lote.helper;
using modelo;
using System;
using System.Collections.Generic;
using System.Threading;
using util;
using util.dto;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;

namespace garantias.lote {
    /// <summary>
    /// Clase que se encarga de ejecutar tareas de un lote asociadas a una operacion de garantias.
    /// </summary>
    public class TareasOperacionGarantia {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Obtiene lista de tareas a ejecutar por operacion, y las ejecuta de acuerdo al orden predefinido de ejecucion.
        /// </summary>
        public static void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion rqoperacion)
        {
            string ctarea = "";
            try {
                TareasOperacionGarantia.FijaDatosDeOperacion(rqmantenimiento);
                // obtiene tareas a ejecutar por operacion.
                IList<string> ltareas = TgarOperacionLoteDal.GetTareas(rqoperacion);
                if (ltareas.Count <= 0) {
                    return;
                }
                foreach (string obj in ltareas) {
                    ctarea = obj;
                    ITareaOperacion toperacion = TloteTareasDal.GetComponenteOperacion(obj, rqoperacion.Cmodulo);
                    if (toperacion == null) {
                        continue;
                    }
                    // ejecuta tarea
                    toperacion.Ejecutar(rqmantenimiento, rqoperacion);
                }
                // Marca las tareas como ejecutadas.
                TgarOperacionLoteDal.MarcaProcesadas(rqoperacion, rqmantenimiento.Mensaje);
            }
            catch (Exception e) {
                Response resp = ManejadorExcepciones.GetMensajeResponse(e);
                ErrorLoteIndividualHilo regerror = new ErrorLoteIndividualHilo(rqmantenimiento.Ccompania, rqoperacion, ctarea, rqmantenimiento.Mensaje, resp.GetCod(), resp.GetMsgusu());
                Thread thread = new Thread(regerror.Procesar);
                thread.Start();
                throw e; // retorna la excepcion para que haga rollback
            }
        }

        private static void FijaDatosDeOperacion(RqMantenimiento rqmantenimiento)
        {
            // SI no EXISTE la operacion no hacer nada, en el cpersona se gurada el codigo de persona ejemplo reporte regulatorio R01
            try {
                Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
                // fija sucursal oficina de la operacion, para no ejecutar intersucursales.
                tgaroperacion tco = operacion.getTgaroperacion();
                rqmantenimiento.Csucursal = tco.csucursal ?? 0;
                rqmantenimiento.Cagencia = tco.cagencia ?? 0;
            }
            catch (AtlasException e) {
                if (!e.Codigo.Equals("BGAR-001")) {
                    throw e;
                }
            }
        }


    }

}
