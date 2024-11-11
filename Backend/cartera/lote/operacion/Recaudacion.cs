using cartera.datos;
using cartera.enums;
using dal.cartera;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.lote.operacion {
    /// <summary>
    /// Clase que se encarga de cargar operaciones a ttesrecaudacion.
    /// </summary>
    public class Recaudacion : ITareaOperacion {
        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            long nregistros = 0;
            decimal valorLote = 0;
            Operacion op = OperacionFachada.GetOperacion(rqmantenimiento.Coperacion, true);
            tcaroperacion operacion = TcarOperacionDal.FindWithLock(rqmantenimiento.Coperacion);
            decimal valor = this.Saldo(op, rqmantenimiento.Fconatable);

            ttesrecaudaciondetalle oper = new ttesrecaudaciondetalle();
            oper.tipo = EnumRecaudacion.CodigoOrientacion.CO.ToString();
            oper.coperacion = op.Coperacion;
            oper.moneda = operacion.cmoneda;
            valorLote = valorLote + valor;
            oper.valor = valor;
            oper.formacobro = EnumRecaudacion.FormaPago.REC.ToString();
            oper.cmodulo = rqmantenimiento.Cmodulo;
            oper.referencia = rqmantenimiento.Coperacion;
            tperpersonadetalle persona = TperPersonaDetalleDal.Find((long)operacion.cpersona, (int)operacion.ccompania);
            oper.tipoidentificacioncliente = persona.tipoidentificacdetalle == "E" ? "P" : persona.tipoidentificacdetalle;
            oper.identificacioncliente = persona.identificacion.Trim();
            oper.nombrecliente = persona.nombre.Trim();
            oper.cestado = ((int)EnumRecaudacion.EstadoRecaudacion.Registrado).ToString();
            nregistros = nregistros + 1;
            oper.Esnuevo = true;
            oper.Actualizar = false;
            oper.cusuarioing = rqmantenimiento.Cusuario;
            oper.fingreso = Fecha.GetFecha(rqmantenimiento.Fconatable);
            oper.fcontable = rqmantenimiento.Fconatable;
            //oper.crecaudaciondetalle = Secuencia.GetProximovalor("SRECAULOTE");
            oper.cmodulo = requestoperacion.Cmodulo.Value;
            oper.ctransaccion = 70;
            Sessionef.Grabar(oper);
        }

        /// <summary>
        /// Consulta saldo de la operacion a la fecha determinada
        /// </summary>
        private decimal Saldo(Operacion operacion, int? fcobro)
        {
            saldo.Saldo saldo = new saldo.Saldo(operacion, (int)fcobro);
            saldo.Calculacuotaencurso();
            Decimal saldofuturo = saldo.GetSaldoCuotasfuturas();

            Dictionary<String, Object> m = new Dictionary<String, Object>();
            decimal totaldeuda = saldo.Totalpendientepago;
            if (saldo.Cxp > 0) {
                totaldeuda = totaldeuda - saldo.Cxp;
            }
            totaldeuda = totaldeuda + saldofuturo;
            if (totaldeuda < 0) {
                totaldeuda = 0;
            }
            m["saldo"] = totaldeuda;
            return totaldeuda;
        }
    }
}

