using amortizacion.dto;
using amortizacion.helper;
using cartera.enums;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using dal.generales;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.consulta;
using util.dto.mantenimiento;

namespace cartera.datos {

    public class OperacionFachada {

        /// <summary>
        /// Entrega un objeto con los datos de una operacion de cartera dado el numero de operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <returns>Operacion</returns>
        public static Operacion GetOperacion(RqMantenimiento rqmantenimiento) {
            return OperacionFachada.GetOperacion(rqmantenimiento.Coperacion, false);
        }


        /// <summary>
        /// Entrega un objeto con los datos de una operacion de cartera dado el numero de operacion.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns>Operacion</returns>
        public static Operacion GetOperacion(RqConsulta rqconsulta) {
            return OperacionFachada.GetOperacion(rqconsulta.Coperacion, true);
        }

        /// <summary>
        /// Clase utilitaria que maneja datos de una operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion con el que se entrega una Operacion.</param>
        /// <param name="consulta">true consuulta datos sin bloqueo, false consulta datos con bloqueo de datos.</param>
        /// <returns>Operacion</returns>
        public static Operacion GetOperacion(string coperacion, bool consulta) {
            DatosCartera dc = DatosCartera.GetDatosCartera();
            return dc.GetOperacion(coperacion, consulta);
        }

        /// <summary>
        /// Adiciona una operacion al map de operaciones de cartera.
        /// </summary>
        /// <param name="tcarOperacion">Objeto que contiene informacion de una operacion de cartera.</param>
        /// <returns></returns>
        public static Operacion AddOperacion(tcaroperacion tcarOperacion) {
            DatosCartera dc = DatosCartera.GetDatosCartera();
            return dc.AddOperacion(tcarOperacion.coperacion, tcarOperacion);
        }

    }
}
