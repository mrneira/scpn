using dal.garantias.parametros;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.garantias {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgarOperacion.
    /// </summary>
    public class TgarOperacionDal {

        /// <summary>
        /// Codigo de estatus de cartera vigente.
        /// </summary>
        private static string VIGENTE = "VIG";
        /// <summary>
        /// Codigo de estatus de cartera cancelada.
        /// </summary>
        private static string CANCELADA = "CAN";


        /// <summary>
        /// Consulta en la base de datos la definicion de una operacion de garantia, y bloquea el registro en la base de datos.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>TcarOperacionDto</returns>
        public static tgaroperacion FindWithLock(string coperacion) { 
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgaroperacion obj = null;
            if (coperacion != null) {
                obj = contexto.tgaroperacion.Where(x => x.coperacion.Equals(coperacion)).SingleOrDefault();
            }
            if (obj == null) {
                throw new AtlasException("BGAR-001", "GARANTIA: {0} NO EXISTE", coperacion == null ? "" : coperacion);
            }                
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una operacion de garantia.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>TcarOperacionDto</returns>

        public static tgaroperacion FindSinBloqueo(string coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgaroperacion obj = null;
            if (coperacion != null) {
                obj = contexto.tgaroperacion.Where(x => x.coperacion == coperacion).SingleOrDefault();
            }
            if (obj == null) {
                throw new AtlasException("BGAR-001", "GARANTIA: {0} NO EXISTE", coperacion == null ? "" : coperacion);
            }
            return obj;
        }

        /// <summary>
        /// Metodo que elimina el registro actual de TgarOperacion y recupera uno de la tabla de historia.
        /// </summary>
        /// <param name="tcaroperacion">Registro original con el cual se obtiene la historia.</param>
        /// <param name="rqmantenimiento">Numero de mensaje con el que se crea historia del registro.</param>
        /// <param name="fcobro">Fecha de cobro de la operacion.</param>
        public static void MarcaOperacionCancelada(tgaroperacion tgaroperacion, RqMantenimiento rqmantenimiento, int fcobro) {
            TgarOperacionHistoriaDal.CreaHistoria(tgaroperacion, rqmantenimiento.Mensaje, fcobro);
            tgaroperacion.cestatus = TgarOperacionDal.CANCELADA;
            tgaroperacion.fcancelacion = fcobro;
            tgaroperacion.cusuariocancelacion = rqmantenimiento.Cusuario;
        }

        /// <summary>
        /// Metodo que elimina el registro actual de TgarOperacion y recupera uno de la tabla de historia.
        /// </summary>
        /// <param name="tgaroperacion"></param>
        public static void Reversar(tgaroperacion tgaroperacion) {
            tgaroperacionhistoria historia = null;
            try {
                historia = TgarOperacionHistoriaDal.Find(tgaroperacion.coperacion, tgaroperacion.mensajeanterior);
            } catch (AtlasException e) {
                if (!e.Codigo.Equals("BGAR-002")) {
                    throw e;
                }
            }
            if (historia != null) {
                RecuperaHistoria(tgaroperacion, historia);
                //Sessionef.Grabar(tgaroperacion);
                Sessionef.Eliminar(historia);
            }
        }

        /// <summary>
        /// Metodo que fija los valores de un registro de historia en un registro vigente de TgarOperacion.
        /// </summary>
        /// <param name="tcaroperacion">Objeto a fijar los datos de historia.</param>
        /// <param name="historia">Objeto desde el cual se copia los datos de historia al registro vigente.</param>
        private static void RecuperaHistoria(tgaroperacion tgaroperacion, tgaroperacionhistoria historia) {
            List<string> lcampos = DtoUtil.GetCamposSinPK(tgaroperacion);
            tgaroperacion.mensaje = historia.mensaje;
            foreach (String campo in lcampos) {
                try {
                    if (campo.Equals("mensaje")) {
                        continue;
                    }
                    Object valor = DtoUtil.GetValorCampo(historia, campo);
                    DtoUtil.SetValorCampo(tgaroperacion, campo, valor);
                } catch (Exception) {
                    throw new AtlasException("BGAR-003", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE HISTORIA: {1} ", campo, historia.GetType().Name);
                }
            }
        }

        /// <summary>
        /// Valida que la operacion este vigente.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene datos de la operacion de cartera.</param>
        public static void ValidaOperacionVigente(tgaroperacion tgaroperacion) {
            TgarOperacionDal.ValidaOperacion(tgaroperacion, TgarOperacionDal.VIGENTE);
        }

        /// <summary>
        /// Valida que la operacio se encuentre en un estatus especifico.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene datos de la operacion de cartera.</param>
        /// <param name="estatus">Codigo de estatus a valida, si el estatus de la operacion es diferente al parametro retorna una excepcion.</param>
        public static void ValidaOperacion(tgaroperacion tgaroperacion, string estatus) {
            if (tgaroperacion.cestatus.CompareTo(estatus) != 0) {
                tgarestatus tcarEstatus = TgarEstatusDal.Find(tgaroperacion.cestatus);
                throw new AtlasException("BGAR-004", "TRANSACCION NO PERMITIDA PARA OPERACIONES: {0} ", tcarEstatus.nombre);
            }
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una operacion de garantia.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns>TcarOperacionDto</returns>

        public static tgaroperacion FindOperacionAnterior(string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgaroperacion obj = null;
            if (coperacion != null)
            {
                obj = contexto.tgaroperacion.Where(x => x.coperacionanterior == coperacion).SingleOrDefault();
            }
            return obj;
        }
    }
}
