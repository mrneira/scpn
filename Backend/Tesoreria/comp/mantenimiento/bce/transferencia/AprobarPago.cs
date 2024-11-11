using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.mantenimiento;
using System.Threading;
using System.Globalization;
using dal.generales;
using System.Linq;
using dal.tesoreria;
using tesoreria.enums;

namespace tesoreria.comp.mantenimiento.bce.transferencia
{
    public class AprobarPago : ComponenteMantenimiento
    {
        /// <summary>
        /// Genera pago spi.
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            List<ttestransaccion> lTransaccion = new List<ttestransaccion>();
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");

            if (rm.GetDatos("GENERARPAGOSINV") == null)
            {
                return;
            }
            List<ttestransaccion> ldatos = rm.GetTabla("GENERARPAGOSINV").Lregistros.Cast<ttestransaccion>().ToList();
            ttesempresa empresa = TtesEmpresaDal.Find(int.Parse(rm.Mdatos["cempresa"].ToString()));

            List<ttestransaccion> ldetalle = new List<ttestransaccion>();
            List<ttesenvioarchivo> lcabecera = new List<ttesenvioarchivo>();


            foreach (ttestransaccion obj in ldatos)
            {
                if ((bool)obj.Mdatos["pagar"])
                {
                    long sum_cuenta = 0;
                    long cantidadpago = 0;
                    decimal valorpago = 0;
                    long numeroreferencia = TtesSecuenciaReferenciaDal.ObtenerSecuenciaReferencia("CAB_TRA");
                    cantidadpago = cantidadpago + 1;
                    valorpago = valorpago + obj.valorpago;
                    long codigoinstitucion = long.Parse(TgenCatalogoDetalleDal.Find(obj.institucionccatalogo, obj.institucioncdetalle).clegal);
                    sum_cuenta = sum_cuenta + codigoinstitucion;
                    obj.numeroreferencia = numeroreferencia;
                    obj.secuenciainterna = obj.secuenciainterna;
                    obj.cestado = ((int)EnumTesoreria.EstadoPagoBce.Autorizacion).ToString();
                    long numeroreferenciapago = TtesSecuenciaReferenciaDal.ObtenerSecuenciaReferencia("PAG_TRA");
                    obj.numeroreferenciapago = numeroreferenciapago;
                    ldetalle.Add(obj);

                    ttesenvioarchivo envioarchivo = new ttesenvioarchivo();
                    envioarchivo.numeroreferencia = numeroreferencia;
                    envioarchivo.observacion = "";
                    envioarchivo.estado = ((int)EnumTesoreria.EstadoPagoBce.Autorizacion).ToString();
                    envioarchivo.cantidadpago = cantidadpago;
                    envioarchivo.valorpago = valorpago;
                    envioarchivo.mespago = string.Format("{0}/{1}", DateTime.Now.Month.ToString("00"), DateTime.Now.Year);
                    envioarchivo.control = 1;
                    long sumcontrol = 0;
                    long valorpagocontrol = long.Parse((Math.Truncate(envioarchivo.valorpago.Value * 100)).ToString());
                    sumcontrol = valorpagocontrol + long.Parse(empresa.cuentaorigen) * 2 + sum_cuenta + long.Parse(empresa.subcuenta) * 5 + 107;
                    envioarchivo.sumcontrol = sumcontrol; //algoritmo control
                    envioarchivo.cempresa = empresa.cempresa;
                    envioarchivo.localidad = empresa.localidad;
                    envioarchivo.cuentaorigen = empresa.cuentaorigen;
                    envioarchivo.razonsocial = empresa.nombre;
                    envioarchivo.fingreso = DateTime.Now;
                    envioarchivo.Esnuevo = true;
                    envioarchivo.Actualizar = false;
                    envioarchivo.cusuarioing = rm.Cusuario;
                    envioarchivo.esproveedor = (bool)rm.Mdatos["proveedor"];
                    envioarchivo.tipotransaccion = EnumTesoreria.TRANSFERENCIA.Cpago;
                    lcabecera.Add(envioarchivo);
                    
                }
            }
            rm.AdicionarTabla("envioarchivo", lcabecera, false);
            rm.AdicionarTabla("ttestransaccion", ldetalle, false);
            rm.Mtablas["GENERARPAGOSINV"] = null;
        }
    }
}
