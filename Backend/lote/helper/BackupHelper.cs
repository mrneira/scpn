using dal.contabilidad;
using dal.lote;
using modelo;
using System;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;

namespace lote.helper
{

    /// <summary>
    /// Clase que ejecuta el backup
    /// </summary>
    public class BackupHelper
    {

        public void Ejecutar(RqMantenimiento rq) {
            TlotePrevioDal.EjecutarBackup(rq);
        }
    }
}
