using core.componente;
using lote.helper;
using System;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.dto.mantenimiento;

namespace lote.comp.mantenimiento
{
    /// <summary>
    /// Clase que se encarga de obtener registros de contabilidad a generar comprobantes y los inserta en TconRegistroLote.
    /// </summary>
    public class BackupBaseDeDatos : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rq) {

            BackupHelper bh = new BackupHelper();
            bh.Ejecutar(rq);
     
        }
    }
}