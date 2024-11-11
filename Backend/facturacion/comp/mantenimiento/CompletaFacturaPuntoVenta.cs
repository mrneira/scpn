using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using System.Threading;
using core.componente;
using util.dto.mantenimiento;
using util;
using dal.facturacionelectronica;
using dal.contabilidad;
using System;
using modelo;
using core.servicios;

namespace facturacion.comp.mantenimiento
{
    /// <summary>
    /// Clase que se encarga de completar los datos faltantes de una direccion
    /// </summary>
    public class CompletaFactutaPuntoVenta : ComponenteMantenimiento
    {
        /// <summary>
        /// Metodo que se encarga de completar los datos faltantes
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            this.Validaciones(rm);

            tfacfactura factura = (tfacfactura)rm.GetTabla("TFACFACTURA").Lregistros.ElementAt(0);
            long cfactura = Secuencia.GetProximovalor("PUNTOVENTA");
            factura.cfactura = cfactura;
            string csecuenciaSRI = Math.Truncate(double.Parse(TconParametrosDal.FindXCodigo("SEC_SRI_FAC_PARQ", rm.Ccompania).numero.ToString())).ToString();
            factura.numfactura = TcelSecuenciaSriDal.ObtenerSecuenciaDocumentoElectronico(csecuenciaSRI);
            factura.ccompania = rm.Ccompania;
            factura.csucursal = rm.Csucursal;
            factura.cagencia = rm.Cagencia;

            factura.estadoccat = 9369;
            factura.estadocdet = "EMI";
            factura.cmoduloorg = rm.Cmodulo;
            factura.ctransaccionorg = rm.Ctranoriginal;
            factura.ffactura = rm.Fproceso;
            factura.freal = rm.Freal;
            factura.cusuario = rm.Cusuario;


            List<tfacfacturadetalle> ldetalle = rm.GetTabla("TFACFACTURADETALLE").Lregistros.Cast<tfacfacturadetalle>().ToList();
            List<tfacfacturaformapago> lfpago = rm.GetTabla("TFACFACTURAFORMAPAGO").Lregistros.Cast<tfacfacturaformapago>().ToList();

            this.CompletaDetalle(factura, ldetalle, cfactura);
            Decimal totalFormaPago = this.CompletaFormaPago(lfpago, cfactura);
            if (!factura.total.Equals(totalFormaPago))
            {
                throw new AtlasException("FAC-003", "EL TOTAL DE LA FORMA DE PAGO NO COINCIDE CON EL TOTAL DE LA FACTURA");
            }
        }


        private void Validaciones(RqMantenimiento rq)
        {
		    if (rq.GetTabla("TFACFACTURADETALLE") == null || !rq.GetTabla("TFACFACTURADETALLE").Lregistros.Any()) {
			        throw new AtlasException("FAC-001", "FACTURA NO TIENE RUBROS");
            }

		    if (rq.GetTabla("TFACFACTURAFORMAPAGO") == null || !rq.GetTabla("TFACFACTURAFORMAPAGO").Lregistros.Any()) {
			        throw new AtlasException("FAC-002", "FORMA DE PAGO REQUERIDA");
            }
	    }

	    private void CompletaDetalle(tfacfactura factura, List<tfacfacturadetalle> ldetalle, long cfactura)
        {
            foreach (tfacfacturadetalle item in ldetalle)
            {
                item.cfactura = cfactura;
            }
        }

        private decimal CompletaFormaPago(List<tfacfacturaformapago> lfpago, long cfactura)
        {
            decimal totalFormaPago = Decimal.Zero;
            foreach (tfacfacturaformapago item in lfpago)
            {
                item.cfactura = cfactura;
                totalFormaPago = Decimal.Add(totalFormaPago, item.monto??0);
            }
            return totalFormaPago;
        }
    }
}
