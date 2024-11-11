using bce.util;
using core.componente;
using core.servicios;
using dal.tesoreria;
using modelo;
using System.Collections.Generic;
using System.Linq;
using tesoreria.enums;
using util.dto;
using util.dto.mantenimiento;

namespace tesoreria.comp.mantenimiento.cashmanagement
{
    /// <summary>
    /// Permite autorizar el cash
    /// </summary>
    /// <param name="rm"></param>
    class AutorizarCash : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            Response resp = rm.Response;
            if (rm.GetTabla("AUTORIZARECAUDACION") == null)
            {
                return;
            }
            List<ttesrecaudacion> ldatos = rm.GetTabla("AUTORIZARECAUDACION").Lregistros.Cast<ttesrecaudacion>().ToList();
            List<ttesrecaudacion> recauda = new List<ttesrecaudacion>();
            foreach (ttesrecaudacion obj in ldatos)
            {
                if ((bool)obj.Mdatos["autorizar"])
                {
                    ttesrecaudacion recaudacion = TtesRecaudacionDal.Find(obj.crecaudacion);
                    recaudacion.cestado = ((int)EnumTesoreria.EstadoRecaudacionCash.Autorizado).ToString();
                    recaudacion.cusuarioautoriza = rm.Cusuario;
                    recaudacion.fautoriza = rm.Freal;
                    recaudacion.Esnuevo = false;
                    recaudacion.Actualizar = true;
                    recauda.Add(recaudacion);
                    TtesRecaudacionDetalleDal.AutorizarPagosMasivoPk(((int)EnumTesoreria.EstadoRecaudacionCash.Autorizado).ToString(), recaudacion.crecaudacion);
                }
            }
            rm.AdicionarTabla("ttesrecaudacion", recauda, false);
            rm.Mtablas["AUTORIZARECAUDACION"] = null;
        }
    }
}
