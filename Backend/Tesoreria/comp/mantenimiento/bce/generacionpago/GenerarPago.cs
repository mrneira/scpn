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
using util;

namespace tesoreria.comp.mantenimiento.bce.generacionpago
{
    public class GenerarPago : ComponenteMantenimiento
    {
        /// <summary>
        /// Genera pago spi.
        /// </summary>
        /// Clase usada para generación y reproceso de archivos tanto de spi, spi proveedor, ocp y también permite regresar pagos a su estado de registrado.
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            List<ttestransaccion> lTransaccion = new List<ttestransaccion>();
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (rm.GetDatos("accion") == null || rm.GetDatos("GENERARARCHIVO") == null)
            {
                return;
            }

            if (rm.GetDatos("accion").ToString() == "eliminar")
            {
                List<ttestransaccion> ldatos = JsonConvert.DeserializeObject<List<ttestransaccion>>(@rm.Mdatos["GENERARARCHIVO"].ToString());
                List<ttestransaccion> ldatosEliminar = new List<ttestransaccion>();
                foreach (ttestransaccion obj in ldatos)
                {
                    if ((bool)obj.Mdatos["eliminar"])
                    {
                        ttestransaccion transaccion = TtesTransaccionDal.FindSpiPorCodigo(obj.ctestransaccion);
                        transaccion.cestado = ((int)EnumTesoreria.EstadoPagoBce.Registrado).ToString();
                        ldatosEliminar.Add(transaccion);
                    }
                }
                rm.Mtablas["GENERARARCHIVO"] = null;
                rm.AdicionarTabla("ttestransaccion", ldatosEliminar, false);
                rm.Response["eliminado"] = "OK";
            }

            if (rm.GetDatos("accion").ToString() == "generar" && rm.GetDatos("tipoArchivo").ToString() != "ocp")
            {
                List<ttestransaccion> ldatos = JsonConvert.DeserializeObject<List<ttestransaccion>>(@rm.Mdatos["GENERARARCHIVO"].ToString());
                long cantidadpago = 0;
                decimal valorpago = 0;
                long numeroreferencia = TtesSecuenciaReferenciaDal.ObtenerSecuenciaReferencia("CAB_SPI");
                ttesempresa empresa = TtesEmpresaDal.Find(int.Parse(rm.Mdatos["cempresa"].ToString()));
                long sum_cuenta = 0;
                bool proveedor = rm.GetDatos("tipoArchivo").ToString() == "spi" ? false : true;
                foreach (ttestransaccion obj in ldatos)
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
                        long numeroreferenciapago = TtesSecuenciaReferenciaDal.ObtenerSecuenciaReferencia("PAG_SPI");
                        obj.numeroreferenciapago = numeroreferenciapago;
                    }
                }

                rm.Mtablas["GENERARARCHIVO"] = null;

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
                envioarchivo.esproveedor = proveedor;
                envioarchivo.tipotransaccion = EnumTesoreria.PAGO.Cpago;
                rm.AdicionarTabla("ttestransaccion", ldatos, false);
                rm.AdicionarTabla("envioarchivo", envioarchivo, false);
                rm.Response["spi"] = "OK";
                rm.Response["spigenerado"] = Generar.GenerarArchivoBceScpn(ldatos, envioarchivo, empresa, rm, EnumTesoreria.PAGO.Cpago);
            }
            else if (rm.GetDatos("TRANSACCIONSPI") != null && rm.GetDatos("ENVIOARCHIVO") != null
                && rm.GetDatos("accion").ToString() == "reproceso" && rm.GetDatos("tipoArchivo").ToString() == "spi")
            {
                List<ttestransaccion> ldatos = rm.GetTabla("TRANSACCIONSPI").Lregistros.Cast<ttestransaccion>().ToList();
                ttesenvioarchivo cabecera = JsonConvert.DeserializeObject<ttesenvioarchivo>(rm.Mdatos["ENVIOARCHIVO"].ToString());
                ttesempresa empresa = TtesEmpresaDal.Find(cabecera.cempresa);
                rm.Response["spigenerado"] = Generar.GenerarArchivoBceScpn(ldatos, cabecera, empresa, rm, EnumTesoreria.PAGO.Cpago);
            }
            else if (rm.GetDatos("accion").ToString() == "generar" && rm.GetDatos("tipoArchivo").ToString() == "ocp")
            {
                if (rm.GetDatos("GENERARARCHIVO") == null)
                {
                    return;
                }

                List<ttestransaccion> ldatos = TtesTransaccionDal.FindToRespuestaPendienteBce(((int)EnumTesoreria.EstadoPagoBce.Aprobar).ToString(), EnumTesoreria.COBRO.Cpago);
                if (ldatos.Count == 0)
                {
                    throw new AtlasException("BCE-006", "ERROR EN GENERACIÓN DE ARCHIVO COMPRIMIDO {0}", "NO EXISTE REGISTROS A PROCESAR");
                }
                //List<string> ldatos = JsonConvert.DeserializeObject<List<string>>(@rm.Mdatos["GENERARARCHIVO"].ToString());
                //List<ttestransaccion> ltransaccion = new List<ttestransaccion>();
                long cantidadpago = 0;
                decimal valorpago = 0;
                long numeroreferencia = TtesSecuenciaReferenciaDal.ObtenerSecuenciaReferencia("CAB_OCP");
                ttesempresa empresa = TtesEmpresaDal.Find(int.Parse(rm.Mdatos["cempresa"].ToString()));
                long sum_cuenta = 0;
                IList<tgencatalogodetalle> lcatalogoDetalle = TgenCatalogoDetalleDal.Find(int.Parse("305"));
                foreach (ttestransaccion obj in ldatos)
                {
                    //ttestransaccion tes = TtesTransaccionDal.FindSpiPorCodigo(long.Parse(obj));
                    cantidadpago = cantidadpago + 1;
                    valorpago = valorpago + obj.valorpago;
                    long codigoinstitucion = long.Parse(lcatalogoDetalle.Where(x => x.cdetalle == obj.institucioncdetalle).FirstOrDefault().clegal);
                    //long codigoinstitucion = long.Parse(lcatalogoDetalle.Find(obj.institucionccatalogo, obj.institucioncdetalle).clegal);
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
                    obj.email = string.IsNullOrEmpty(obj.email) ? "NA" : obj.email;
                    obj.telefono = string.IsNullOrEmpty(obj.telefono) ? "0" : obj.telefono;
                    obj.numerosuministro = string.IsNullOrEmpty(obj.numerosuministro) ? "NA" : obj.numerosuministro;
                    //ltransaccion.Add(tes);
                }

                rm.Mtablas["GENERARARCHIVO"] = null;

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
                //envioarchivo.fingreso = Fecha.GetFecha(rm.Fconatable);
                envioarchivo.fingreso = Fecha.GetDataBaseTimestamp();
                envioarchivo.Esnuevo = true;
                envioarchivo.Actualizar = false;
                envioarchivo.cusuarioing = rm.Cusuario;
                envioarchivo.esproveedor = false;
                envioarchivo.tipotransaccion = EnumTesoreria.COBRO.Cpago;
                //rm.AdicionarTabla("ttestransaccion", ldatos, false);
                TtesTransaccionDal.ActualizaGenerarTransaccion(ldatos, rm);
                //rm.AdicionarTabla("envioarchivo", envioarchivo, false);
                TtesTransaccionDal.ActualizaGenerarArchivo(envioarchivo, rm);
                rm.Response["ocp"] = "OK";
                rm.Response["spigenerado"] = Generar.GenerarArchivoBceScpn(ldatos, envioarchivo, empresa, rm, EnumTesoreria.COBRO.Cpago);
            }
            else if (rm.GetDatos("TRANSACCIONOCP") != null && rm.GetDatos("ENVIOARCHIVO") != null
                && rm.GetDatos("accion").ToString() == "reproceso" && rm.GetDatos("tipoArchivo").ToString() == "ocp")
            {
                List<ttestransaccion> ldatos = rm.GetTabla("TRANSACCIONOCP").Lregistros.Cast<ttestransaccion>().ToList();
                ttesenvioarchivo cabecera = JsonConvert.DeserializeObject<ttesenvioarchivo>(rm.Mdatos["ENVIOARCHIVO"].ToString());
                ttesempresa empresa = TtesEmpresaDal.Find(cabecera.cempresa);
                rm.Response["spigenerado"] = Generar.GenerarArchivoBceScpn(ldatos, cabecera, empresa, rm, EnumTesoreria.COBRO.Cpago);
            }
            else
            {
                return;
            }
        }
    }
}
