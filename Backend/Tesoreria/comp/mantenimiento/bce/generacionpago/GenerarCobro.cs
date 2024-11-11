using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.mantenimiento;
using System.Threading;
using System.Globalization;
using Newtonsoft.Json;
using dal.generales;
using System.Linq;
using dal.tesoreria;
using tesoreria.enums;
using tesoreria.archivo.generacion;
using modelo.helper;

namespace tesoreria.comp.mantenimiento.bce.generacionpago
{
    public class GenerarCobro : ComponenteMantenimiento
    {
        /// <summary>
        /// Genera ocp.
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            List<ttestransaccion> lTransaccion = new List<ttestransaccion>();
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (rm.GetDatos("generar") == null)
            {
                return;
            }
            if ((bool)rm.GetDatos("generar"))
            {
                if (rm.GetDatos("GENERARCOBROS") == null)
                {
                    return;
                }
                List<ttestransaccion> ldatos = JsonConvert.DeserializeObject<List<ttestransaccion>>(@rm.Mdatos["GENERARCOBROS"].ToString());
                long cantidadpago = 0;
                decimal valorpago = 0;
                long numeroreferencia = TtesSecuenciaReferenciaDal.ObtenerSecuenciaReferencia("CAB_OCP");
                ttesempresa empresa = TtesEmpresaDal.Find(int.Parse(rm.Mdatos["cempresa"].ToString()));
                long sum_cuenta = 0;
                foreach (ttestransaccion obj in ldatos)
                {
                    if ((bool)obj.Mdatos["cobrar"])
                    {
                        cantidadpago = cantidadpago + 1;
                        valorpago = valorpago + obj.valorpago;
                        long codigoinstitucion = long.Parse(TgenCatalogoDetalleDal.Find(obj.institucionccatalogo, obj.institucioncdetalle).clegal);
                        sum_cuenta = sum_cuenta + codigoinstitucion;
                        obj.numeroreferencia = numeroreferencia;
                        obj.subcuenta = empresa.subcuenta;
                        obj.secuenciainterna = obj.secuenciainterna;
                        obj.Actualizar = true;
                        EntityHelper.SetActualizar(obj);
                        obj.cestado = ((int)EnumTesoreria.EstadoPagoBce.Generado).ToString();
                        if (obj.numeroreferenciapago == 0 || !obj.numeroreferenciapago.HasValue)
                        {
                            long numeroreferenciapago = TtesSecuenciaReferenciaDal.ObtenerSecuenciaReferencia("PAG_OCP");
                            obj.numeroreferenciapago = numeroreferenciapago;
                        }
                        obj.email = string.IsNullOrEmpty(obj.email) ? "NA": obj.email;
                        obj.telefono = string.IsNullOrEmpty(obj.telefono) ? "0" : obj.telefono;
                        obj.numerosuministro = string.IsNullOrEmpty(obj.numerosuministro) ? "NA" : obj.numerosuministro;
                    }
                }

                rm.Mtablas["GENERARCOBROS"] = null;

                ttesenvioarchivo envioarchivo = new ttesenvioarchivo();
                envioarchivo.numeroreferencia = numeroreferencia;
                envioarchivo.observacion = "";
                envioarchivo.estado = ((int)EnumTesoreria.EstadoPagoBce.Generado).ToString(); //validar tabla
                envioarchivo.cantidadpago = cantidadpago;
                envioarchivo.valorpago = valorpago;
                envioarchivo.mespago = string.Format("{0}/{1}", DateTime.Now.Month.ToString("00"), DateTime.Now.Year);
                envioarchivo.control = 1;
                long sumcontrol = 0;
                long valorpagocontrol = long.Parse((Math.Truncate(envioarchivo.valorpago.Value * 100)).ToString());
                sumcontrol = valorpagocontrol + long.Parse(empresa.cuentaorigen) * 2 + sum_cuenta + long.Parse(empresa.subcuenta) * 5 + 107;
                envioarchivo.sumcontrol = sumcontrol; 
                envioarchivo.cempresa = empresa.cempresa;
                envioarchivo.localidad = empresa.localidad;
                envioarchivo.cuentaorigen = empresa.cuentaorigen;
                envioarchivo.razonsocial = empresa.nombre;
                envioarchivo.fingreso = DateTime.Now;
                envioarchivo.Esnuevo = true;
                envioarchivo.Actualizar = false;
                envioarchivo.cusuarioing = rm.Cusuario;
                envioarchivo.esproveedor= (bool)rm.Mdatos["proveedor"];
                envioarchivo.tipotransaccion = EnumTesoreria.COBRO.Cpago;
                rm.AdicionarTabla("ttestransaccion", ldatos, false);
                rm.AdicionarTabla("envioarchivo", envioarchivo, false);
                rm.Response["spigenerado"] = Generar.GenerarArchivoBce(ldatos, envioarchivo, empresa, rm, EnumTesoreria.COBRO.Cpago);
            }
            else
            {
                if (rm.GetDatos("TRANSACCIONOCP") == null || rm.GetDatos("ENVIOARCHIVO") == null)
                {
                    return; 
                }
                List<ttestransaccion> ldatos = rm.GetTabla("TRANSACCIONOCP").Lregistros.Cast<ttestransaccion>().ToList();
                ttesenvioarchivo cabecera = JsonConvert.DeserializeObject<ttesenvioarchivo>(rm.Mdatos["ENVIOARCHIVO"].ToString());
                ttesempresa empresa = TtesEmpresaDal.Find(cabecera.cempresa);
                rm.Response["spigenerado"] = Generar.GenerarArchivoBce(ldatos, cabecera, empresa, rm, EnumTesoreria.COBRO.Cpago);
            }
        }
    }
}
