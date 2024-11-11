using core.componente;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace persona.comp.mantenimiento.natural
{
    public class Trabajo : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetTabla("TRABAJO") == null || rm.GetTabla("TRABAJO").Lregistros.Count() <= 0)
            {
                return;
            }
            long? cpersona = rm.GetLong("c_pk_cpersona");
            List<IBean> ldatos = rm.GetTabla("TRABAJO").Lregistros;
            foreach (IBean o in ldatos)
            {
                tpertrabajo obj = (tpertrabajo)o;
             
                if (obj.cpersona == 0)
                {
                    obj.ccompania = rm.Ccompania;
                    obj.cpersona = (long)cpersona;
                }

                FUtil.ValidaFechas(obj.fingresotrabjo != null ? obj.fingresotrabjo.GetValueOrDefault() : obj.fingresotrabjo, "FECHA DE INGRESO TRABAJO", obj.fsalidatrabajo != null ? obj.fsalidatrabajo.GetValueOrDefault() : obj.fsalidatrabajo, "FECHA DE SALIDA TRABAJO");
            }
        }
    }
}