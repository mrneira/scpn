﻿using cartera.datos;
using core.servicios;
using core.util;
using dal.cartera;
using dal.lote;
using dal.lote.contabilidad;
using lote.helper;
using modelo;
using System;
using System.Collections.Generic;
using System.Threading;
using util;
using util.dto;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;

namespace inversiones.lote
{
    /// <summary>
    /// Clase que obtiene lista de tareas a ejecutar por operacion, y las ejecuta de acuerdo al orden predefinido de ejecucion.
    /// </summary>
    public class TareasOperacionInversion
    {

        /// <summary>
        /// Obtiene lista de tareas a ejecutar por operacion, y las ejecuta de acuerdo al orden predefinido de ejecucion.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="rqoperacion">Request de operación con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public static void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion rqoperacion)
        {
            string ctarea = "";
            try
            {
                // obtiene tareas a ejecutar por operacion.
                IList<string> ltareas = TinvInversionLoteDal.GetTareas(rqoperacion);
                if (ltareas.Count <= 0)
                {
                    return;
                }
                foreach (string obj in ltareas)
                {
                    ctarea = obj;
                    ITareaOperacion toperacion = TloteTareasDal.GetComponenteOperacion(obj, rqoperacion.Cmodulo);
                    if (toperacion == null)
                    {
                        continue;
                    }
                    // ejecuta tarea
                    toperacion.Ejecutar(rqmantenimiento, rqoperacion);
                }
                // Marca las tareas como ejecutadas.
                TinvInversionLoteDal.MarcaProcesadas(rqoperacion, rqmantenimiento.Mensaje);
            }
            catch (Exception e)
            {
                Response resp = ManejadorExcepciones.GetMensajeResponse(e);
                ErrorLoteIndividualHilo regerror = new ErrorLoteIndividualHilo(rqmantenimiento.Ccompania, rqoperacion, ctarea, rqmantenimiento.Mensaje, resp.GetCod(), resp.GetMsgusu());
                Thread thread = new Thread(regerror.Procesar);
                thread.Start();
                throw e; // retorna la excepcion para que haga rollback
            }
        }
    }
}