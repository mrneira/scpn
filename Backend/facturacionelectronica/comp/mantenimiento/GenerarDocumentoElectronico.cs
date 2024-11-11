using System;
using System.Collections.Generic;
using core.componente;
using core.servicios;
using dal.contabilidad;
using modelo;
using util.dto.mantenimiento;
using util;
using dal.monetario;
using facturacionelectronica.comp.consulta.componentegeneracion;
using facturacionelectronica.comp.consulta.entidades;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;
using System.Threading;

namespace facturacionelectronica.comp.mantenimiento
{
    /// <summary>
    /// Permite generar documento electrónico de manera asincrónica
    /// </summary>
    public static class GenerarDocumentoElectronico 
    {
        public static void GenerarDocumento(EntidadComprobante entidad) {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            GeneraComprobante.GenerarEntidadDocumento(entidad);
        }
    }
}
