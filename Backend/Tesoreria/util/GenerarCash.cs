using core.servicios;
using dal.persona;
using modelo;
using tesoreria.enums;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace bce.util
{
    /// <summary>
    /// Generar Archivo Cash
    /// </summary>
    /// <param name="rq"></param>
    /// <param name="contrapartida"></param>
    /// <param name="referencia"></param>
    /// <param name="cpersona"></param>
    /// <param name="valor"></param>
    /// <param name="fechaInicio"></param>
    /// <param name="fechaFin"></param>
    /// <param name="autorizado"></param>
    public class GenerarCash
    {
        public static RqMantenimiento InsertarCash(RqMantenimiento rq, string contrapartida, string referencia, long cpersona, decimal valor, int fechaInicio, int fechaFin, bool autorizado)
        {
            try
            {
                long nregistros = 0;
                decimal valorLote = 0;
                ttesrecaudaciondetalle detalle = new ttesrecaudaciondetalle();
                detalle.tipo = EnumTesoreria.CodigoOrientacionCash.CO.ToString();
                detalle.coperacion = contrapartida;
                detalle.moneda = rq.Cmoneda;
                valorLote = valorLote + valor;
                detalle.valor = valor;
                detalle.formacobro = EnumTesoreria.FormaPagoCash.REC.ToString();
                detalle.referencia = referencia;
                tperpersonadetalle persona = TperPersonaDetalleDal.Find(cpersona, rq.Ccompania);
                detalle.tipoidentificacioncliente = persona.tipoidentificacdetalle == "E" ? "P" : persona.tipoidentificacdetalle;
                detalle.identificacioncliente = persona.identificacion.Trim();
                detalle.nombrecliente = persona.nombre.Trim();
                detalle.cestado = ((int)EnumTesoreria.EstadoRecaudacionCash.Registrado).ToString();
                nregistros = nregistros + 1;
                detalle.Esnuevo = true;
                detalle.cusuarioing = rq.Cusuario;
                detalle.fingreso = Fecha.GetFecha(rq.Fconatable);
                detalle.fcontable = rq.Fconatable;
                detalle.cmodulo = rq.Cmodulo;
                detalle.ctransaccion = rq.Ctransaccion;

                ttesrecaudacion recaudacion = new ttesrecaudacion();
                recaudacion.totalcobro = valorLote;
                recaudacion.registrosenviado = nregistros;
                recaudacion.cusuarioing = rq.Cusuario;
                recaudacion.fingreso = rq.Freal;
                recaudacion.fcontable = rq.Fconatable;
                recaudacion.cmodulo = rq.Cmodulo;
                recaudacion.ctransaccion = rq.Ctransaccion;
                recaudacion.cestado = ((int)EnumTesoreria.EstadoRecaudacionCash.Registrado).ToString();
                if (autorizado)
                {
                    recaudacion.cestado = ((int)EnumTesoreria.EstadoRecaudacionCash.Autorizado).ToString();
                    detalle.cestado = ((int)EnumTesoreria.EstadoRecaudacionCash.Autorizado).ToString();
                    recaudacion.cusuarioautoriza = rq.Cusuario;
                    recaudacion.fautoriza = rq.Freal;
                }
                recaudacion.crecaudacion = Secuencia.GetProximovalor("SRECAUDET");
                recaudacion.finicio = fechaInicio;
                recaudacion.ffin = fechaFin;
                recaudacion.Esnuevo = true;
                detalle.crecaudacion = recaudacion.crecaudacion;
                Sessionef.Grabar(recaudacion);
                Sessionef.Grabar(detalle);
                return rq;
            }
            catch (System.Exception)
            {
                throw;
            }
        }

        public static void EliminarCash(RqMantenimiento rq, string referenciaInterna, int? secuenciaInterna)
        {
            //ttestransaccion tran = TtesRecaudaciondDal.FindToReferenciaAnular(referenciaInterna, secuenciaInterna, ((int)EnumTesoreria.EstadoPagoBce.Anulado).ToString(), EnumTesoreria.PAGO.Cpago);
        }
    }
}
