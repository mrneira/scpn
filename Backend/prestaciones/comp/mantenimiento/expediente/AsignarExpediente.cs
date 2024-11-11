using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.expediente
{
    class AsignarExpediente : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm)
        {
            if(rm.GetTabla("INGRESOASIGNACIONEXPEDIENTE") != null)
            {
                Tabla tabla = rm.GetTabla("INGRESOASIGNACIONEXPEDIENTE");//MNE 20240910
                if (tabla.Lregistros.Count == 1)
                {
                    tpreexpedienteasignacion expasig = (tpreexpedienteasignacion)tabla.Lregistros[0];
                    expasig.fingreso = rm.Freal;
                    expasig.ccatalogoestadoregistro = 2803;
                    expasig.cdetalleestadoregistro = "ACT";
                    tabla.Lregistros[0] = expasig;
                    rm.AdicionarTablaExistente("INGRESOASIGNACIONEXPEDIENTE", tabla, true);
                }
                else
                {
                    throw new Exception("PRE-777, DEBE ENVIAR UN REGISTRO DE ASIGNACIÓN DE EXPEDIENTE");
                }
            }
            else if (rm.GetTabla("DATOSEXPEDIENTEASIGNACION") != null)
            {
                Tabla tabla = rm.GetTabla("DATOSEXPEDIENTEASIGNACION");
                if (tabla.Lregistros.Count == 1)
                {
                    tpreexpedienteasignacion expasig = (tpreexpedienteasignacion)tabla.Lregistros[0];
                    expasig.fechamodificacionregistro = rm.Freal;
                    expasig.cusuariomodificacionregistro = rm.Cusuario;
                    tabla.Lregistros[0] = expasig;
                    rm.AdicionarTablaExistente("DATOSEXPEDIENTEASIGNACION", tabla, true);
                }
                else
                {
                    throw new Exception("PRE-777, DEBE ENVIAR UN REGISTRO DE ASIGNACIÓN DE EXPEDIENTE");
                }
            }
            else
            {
                throw new Exception("PRE-777, NO A ENVIADO UN REGISTRO PARA LA ASIGNACIÓN DE EXPEDIENTE");
            }
        }
    }
}
