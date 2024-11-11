using core.componente;
using modelo;
using System;
using util.dto.consulta;
using dal.facturacionelectronica;
//using SevenZip;
using System.Collections.Generic;
using dal.contabilidad;
using general.xml;
using System.Data;
using System.IO;
using System.Text;
using SevenZip;

namespace organismosdecontrol.comp.consulta.contabilidad
{

    public class DescargarAnexo : ComponenteConsulta
    {
        /// <summary>
        /// Metodo que descarga Anexo Transaccional
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            //string codigoconsulta = "ANEXOTRANSACCIONAL";
            string storeprocedure = "sp_OdcConAnexoTransaccional";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            foreach (var pair in rqconsulta.Mdatos)
            {
                if (pair.Key.Contains("parametro_"))
                {
                    parametros[pair.Key.Replace("parametro_", "@")] = pair.Value;
                }
            }

            DataTable tblAnexo = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros);
            rqconsulta.Response["OC_DESCARGAXML"] = tblAnexo;

            DataTable tblAnexoVentas = dal.storeprocedure.StoreProcedureDal.GetDataTable("sp_OdcConAnexoTransaccionalVentas", parametros);
            rqconsulta.Response["OC_DESCARGAXML"] = tblAnexoVentas;

            DataTable tblAnexoVentasEst = dal.storeprocedure.StoreProcedureDal.GetDataTable("sp_OdcConAnexoTransaccionalVentasEst", parametros);
            rqconsulta.Response["OC_DESCARGAXML"] = tblAnexoVentasEst;

            DataTable tblAnexoAnulaciones = dal.storeprocedure.StoreProcedureDal.GetDataTable("sp_OdcConAnexoTransaccionalAnulaciones", parametros);
            rqconsulta.Response["OC_DESCARGAXML"] = tblAnexoAnulaciones;


            tcelinfoempresa informacionEmpresa = new tcelinfoempresa();
            informacionEmpresa = TcelInfoEmpresaDal.GetTcelinfoempresa();
            ivaType iva = new ivaType();
            ventaEstType ventas = new ventaEstType();
            
            iva.compras = new detalleComprasType[tblAnexo.Rows.Count];
            iva.ventas = new detalleVentasType[tblAnexoVentas.Rows.Count];
            iva.anulados = new detalleAnuladosType[tblAnexoAnulaciones.Rows.Count];
            iva.ventasEstablecimiento = new ventaEstType[tblAnexoVentasEst.Rows.Count];

            iva.razonSocial = informacionEmpresa.nombrecomercial;
            iva.IdInformante = informacionEmpresa.ruc;
            iva.Anio = rqconsulta.Mdatos["anioactual"].ToString();
            iva.Mes = tblAnexo.Rows[0]["mes"].ToString();
            iva.numEstabRuc = "001";
            if (tblAnexoVentasEst.Rows.Count > 0)
            {
                iva.totalVentas = decimal.Round(Convert.ToDecimal(tblAnexoVentasEst.Rows[0]["ventasEstab"].ToString()), 2);
            }
            else
            {
                iva.totalVentas = 0;
            }
            iva.codigoOperativo = 0;

            int i = 0;
            int j = 0;
            int x = 0;
            int y = 0;

           
            foreach (DataRow dt in tblAnexo.Rows)
            {
                detalleComprasType detalle = new detalleComprasType();
                string[] PagoCompras = new string[1];         
                PagoCompras[0] = dt["formaPago"].ToString();
                if (dt["estabRetencion1"].ToString() == "" || dt["estabRetencion1"].ToString() == null)
                {
                    iva.compras[i] = new detalleComprasType()
                    {

                        codSustento = dt["codSustento"].ToString(),
                        tpIdProv = dt["tpIdProv"].ToString(),
                        idProv = dt["idProv"].ToString(),
                        tipoComprobante = dt["tipoComprobante"].ToString(),
                        parteRel = parteRelType.NO,
                        fechaRegistro = dt["fechaRegistro"].ToString(),
                        establecimiento = dt["Establecimiento"].ToString(),
                        puntoEmision = dt["puntoEmision"].ToString(),
                        secuencial = dt["secuencial"].ToString(),
                        fechaEmision = dt["fechaEmision"].ToString(),
                        autorizacion = dt["autorizacion"].ToString(),
                        baseNoGraIva = Decimal.Round(Convert.ToDecimal(0.00), 2),                        
                        baseImponible = Decimal.Round(Convert.ToDecimal(dt["baseImponible"].ToString()), 2),
                        baseImpGrav = Decimal.Round(Convert.ToDecimal(dt["baseImpGrav"].ToString()), 2),
                        baseImpExe = Decimal.Round(Convert.ToDecimal(dt["baseImpExe"].ToString()), 2),
                        montoIce = Decimal.Round(Convert.ToDecimal(dt["montoIce"].ToString()), 2),
                        montoIva = Decimal.Round(Convert.ToDecimal(dt["montoIva"].ToString()), 2),
                        valRetBien10 = Decimal.Round(Convert.ToDecimal(dt["valRetBien10"].ToString()), 2),
                        valRetServ20 = Decimal.Round(Convert.ToDecimal(dt["valRetServ20"].ToString()), 2),
                        valorRetBienes = Decimal.Round(Convert.ToDecimal(dt["valorRetBienes"].ToString()), 2),
                        valRetServ50 = Decimal.Round(Convert.ToDecimal(dt["valRetServ50"].ToString()), 2),
                        valorRetServicios = Decimal.Round(Convert.ToDecimal(dt["valorRetServicios"].ToString()), 2),
                        valRetServ100 = Decimal.Round(Convert.ToDecimal(dt["valRetServ100"].ToString()), 2),
                        totbasesImpReemb = Decimal.Round(Convert.ToDecimal(dt["totbasesImpReemb"].ToString()), 2),
                        formasDePago = PagoCompras
                    };
                }
                else
                {
                    iva.compras[i] = new detalleComprasType()
                    {

                        codSustento = dt["codSustento"].ToString(),
                        tpIdProv = dt["tpIdProv"].ToString(),
                        idProv = dt["idProv"].ToString(),
                        tipoComprobante = dt["tipoComprobante"].ToString(),
                        parteRel = parteRelType.NO,
                        fechaRegistro = dt["fechaRegistro"].ToString(),
                        establecimiento = dt["Establecimiento"].ToString(),
                        puntoEmision = dt["puntoEmision"].ToString(),
                        secuencial = dt["secuencial"].ToString(),
                        fechaEmision = dt["fechaEmision"].ToString(),
                        autorizacion = dt["autorizacion"].ToString(),
                        baseNoGraIva = Decimal.Round(Convert.ToDecimal(dt["baseNoGraIva"].ToString()), 2),
                        baseImponible = Decimal.Round(Convert.ToDecimal(dt["baseImponible"].ToString()), 2),
                        baseImpGrav = Decimal.Round(Convert.ToDecimal(dt["baseImpGrav"].ToString()), 2),
                        baseImpExe = Decimal.Round(Convert.ToDecimal(dt["baseImpExe"].ToString()), 2),
                        montoIce = Decimal.Round(Convert.ToDecimal(dt["montoIce"].ToString()), 2),
                        montoIva = Decimal.Round(Convert.ToDecimal(dt["montoIva"].ToString()), 2),
                        valRetBien10 = Decimal.Round(Convert.ToDecimal(dt["valRetBien10"].ToString()), 2),
                        valRetServ20 = Decimal.Round(Convert.ToDecimal(dt["valRetServ20"].ToString()), 2),
                        valorRetBienes = Decimal.Round(Convert.ToDecimal(dt["valorRetBienes"].ToString()), 2),
                        valRetServ50 = Decimal.Round(Convert.ToDecimal(dt["valRetServ50"].ToString()), 2),
                        valorRetServicios = Decimal.Round(Convert.ToDecimal(dt["valorRetServicios"].ToString()), 2),
                        valRetServ100 = Decimal.Round(Convert.ToDecimal(dt["valRetServ100"].ToString()), 2),
                        totbasesImpReemb = Decimal.Round(Convert.ToDecimal(dt["totbasesImpReemb"].ToString()), 2),
                        estabRetencion1 = dt["estabRetencion1"].ToString(),
                        ptoEmiRetencion1 = dt["ptoEmiRetencion1"].ToString(),
                        secRetencion1 = dt["secRetencion1"].ToString(),
                        autRetencion1 = dt["autRetencion1"].ToString(),
                        fechaEmiRet1 = dt["fechaEmiRet1"].ToString(),
                        formasDePago = PagoCompras
                    };

                };

               
                iva.compras[i].pagoExterior = new pagoExteriorType()
                {
                    
                    paisEfecPago = dt["paisEfecPago"].ToString()                                       
                };

                 decimal baseImpAir2;


                if (Decimal.Round(Convert.ToDecimal(dt["baseImponible"].ToString()), 2) == 0)
                {
                    baseImpAir2 = Decimal.Round(Convert.ToDecimal(dt["baseImpGrav"].ToString()), 2);
                }
                else
                {
                    baseImpAir2 = Decimal.Round(Convert.ToDecimal(dt["baseImponible"].ToString()), 2);
                }
                iva.compras[i].air = new detalleAirComprasType[1];
               
                    iva.compras[i].air[0] = new detalleAirComprasType()
                    {
                        
                        codRetAir = dt["codRetAir"].ToString(),
                        baseImpAir = baseImpAir2,
                        porcentajeAir = Decimal.Round(Convert.ToDecimal(dt["porcentajeAir"].ToString()), 2),
                        valRetAir = Decimal.Round(Convert.ToDecimal(dt["valRetAir"].ToString()), 2),
                    };
                              

                i = i + 1;
            }
            
            string[] Pago = new string[1];
            Pago[0] = "01";
            
            foreach (DataRow dtVen in tblAnexoVentas.Rows)
            {
                string tipo;
               
                if (dtVen["idCliente"].ToString() == "9999999999999")
                {
                    tipo = "07";
                }
                else
                {
                    tipo = dtVen["tpIdCliente"].ToString();
                };
                if(dtVen["idCliente"].ToString() == "9999999999999")
                {
                    iva.ventas[j] = new detalleVentasType()
                    {
                        tpIdCliente = tipo,
                        idCliente = dtVen["idCliente"].ToString(),                         
                        parteRelVtasSpecified = false,                        
                        parteRelVtas = parteRelType.NO,
                        tipoComprobante = "18",
                        tipoEmision = tipoEmisionType.F,
                        numeroComprobantes = dtVen["numeroComprobantes"].ToString(),
                        baseNoGraIva = Decimal.Round(Convert.ToDecimal(0.00), 2),
                        baseImponible = Decimal.Round(Convert.ToDecimal(0.00), 2),
                        baseImpGrav = Decimal.Round(Convert.ToDecimal(dtVen["baseImpGrav"].ToString()), 2),
                        montoIva = Decimal.Round(Convert.ToDecimal(dtVen["montoIva"].ToString()), 2),
                        montoIce = Decimal.Round(Convert.ToDecimal(0.00), 2),
                        valorRetIva = Decimal.Round(Convert.ToDecimal(0.00), 2),
                        valorRetRenta = Decimal.Round(Convert.ToDecimal(0.00), 2),
                        formasDePago = Pago
                    };
                   
                }
                else
                {
                    iva.ventas[j] = new detalleVentasType()
                    {
                        tpIdCliente = tipo,
                        idCliente = dtVen["idCliente"].ToString(),
                        parteRelVtasSpecified = true,
                        parteRelVtas = parteRelType.NO,
                        tipoComprobante = dtVen["tipoComprobante"].ToString(),
                        tipoEmision = tipoEmisionType.F, 
                        numeroComprobantes = dtVen["numeroComprobantes"].ToString(),
                        baseNoGraIva = Decimal.Round(Convert.ToDecimal(0.00), 2),
                        baseImponible = Decimal.Round(Convert.ToDecimal(0.00), 2),
                        baseImpGrav = Decimal.Round(Convert.ToDecimal(dtVen["baseImpGrav"].ToString()), 2),
                        montoIva = Decimal.Round(Convert.ToDecimal(dtVen["montoIva"].ToString()), 2),
                        montoIce = Decimal.Round(Convert.ToDecimal(0.00), 2),
                        valorRetIva = Decimal.Round(Convert.ToDecimal(0.00), 2),
                        valorRetRenta = Decimal.Round(Convert.ToDecimal(0.00), 2),
                        formasDePago = Pago
                    };

                }                                
                j = j + 1;
                
            }
            foreach(DataRow dtVes in tblAnexoVentasEst.Rows )
            {
                iva.ventasEstablecimiento[y] = new ventaEstType()
                {
                    codEstab = "002",
                    ventasEstab = Decimal.Round(Convert.ToDecimal(dtVes["ventasEstab"].ToString()), 2),
                    ivaComp = 0
                    
                };
                y = y + 1;
            }
            foreach (DataRow dtAnu in tblAnexoAnulaciones.Rows)
            {
                iva.anulados[x] = new detalleAnuladosType()
                {
                    tipoComprobante = dtAnu["tipoComprobante"].ToString(),
                    establecimiento = dtAnu["establecimiento"].ToString(),
                    puntoEmision = dtAnu["puntoEmision"].ToString(),
                    secuencialInicio = dtAnu["secuencialInicio"].ToString(),
                    secuencialFin = dtAnu["secuencialFin"].ToString(),
                    autorizacion = dtAnu["autorizacion"].ToString()
                };
                x = x + 1;
            }

            iva.SerializeToXml();

            string tipoArchivo = string.Empty;
            tipoArchivo = "xml";
            string xmlAnexo = iva.SerializeToXml();
            File.WriteAllText(@"C:\tmp\1.xml", xmlAnexo);
            File.ReadAllBytes(@"C:\tmp\1.xml");
            byte[] barchivo = File.ReadAllBytes(@"C:\tmp\1.xml");

            if (barchivo != null)
            {
                rqconsulta.Response["archivoDescarga"] = barchivo;
                rqconsulta.Response["nombre"] = string.Format("{0}_{1}.{2}","AT", tblAnexo.Rows[0]["mes"].ToString() + rqconsulta.Mdatos["anioactual"].ToString(), tipoArchivo);
            }
            else
            {
                rqconsulta.Response["archivoDescarga"] = null;
            }
        }
    }
}

