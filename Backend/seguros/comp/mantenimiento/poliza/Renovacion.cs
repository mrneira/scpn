using core.componente;
using core.servicios.mantenimiento;
using dal.persona;
using dal.seguros;
using LinqToExcel;
using modelo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using util.dto.mantenimiento;

namespace seguros.comp.mantenimiento.poliza {
    class Renovacion : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que ejecuta la devolucion de valores mediante pago normal de cartera.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<tsgsseguro> lseguro = new List<tsgsseguro>();
            decimal sumValor1 = 0; // MNR 202405205
            for (int i = 0; i < rqmantenimiento.GetTabla("POLIZA").Lregistros.Count; i++)
            {
                // Datos poliza
                tsgspoliza poliza = (tsgspoliza)rqmantenimiento.GetTabla("POLIZA").Lregistros.ElementAt(i);
                int secuencia = TsgsPolizaDal.GetSecuencia(poliza.coperacioncartera, poliza.coperaciongarantia);
                poliza.secuencia = secuencia;
                poliza.cusuarioing = rqmantenimiento.Cusuario;
                poliza.fingreso = rqmantenimiento.Fconatable;
                poliza.ccatalogoestado = 600;
                poliza.cdetalleestado = "PEN";
                sumValor1 = (decimal)sumValor1 + (decimal)poliza.valorfactura;

                // Datos seguro
                tsgsseguro seguro = TsgsSeguroDal.Find(poliza.coperacioncartera, poliza.coperaciongarantia);
                seguro.Actualizar = true;
                seguro.secuenciapoliza = secuencia;
                lseguro.Add(seguro);
            }
            if (rqmantenimiento.Mdatos.ContainsKey("nameFile"))
            {
                try
                {
                    bool statusFileExcel = true;
                    string nameFile = (string)rqmantenimiento.GetDatos("nameFile");
                    var excelFile = new ExcelQueryFactory(nameFile);
                    var cargatabla = from a in excelFile.Worksheet("data") select a;
                    FileInfo fileInfo = new FileInfo(nameFile);
                    string newName = Path.GetFileNameWithoutExtension(fileInfo.Name) + "_" + DateTimeOffset.Now.ToUnixTimeMilliseconds() + ".csv";
                    StreamWriter csvfile = new StreamWriter("C:\\CESANTIA_APP_HOME\\SUBIRARCHIVOS\\" + newName);
                    csvfile.Write("IDENTIFICACION;VAL_ASEGURADO;NRO_POLIZA;FECHA_INICIO;FECHA_VENCIMIENTO;NRO_FACTURA;FECHA_EMISION_FACTURA;MONTO_FACTURA;TIPO_SEGURO;COMENTARIO;MES_CUOTA;");
                    csvfile.WriteLine();
                    foreach (var registro in cargatabla)
                    {
                        tperpersonadetalle per = TperPersonaDetalleDal.Find((string)registro["IDENTIFICACION"]);
                        if (per != null)
                        {
                            csvfile.Write(registro["IDENTIFICACION"] + ";");
                            csvfile.Write(registro["VAL_ASEGURADO"] + ";");
                            csvfile.Write(registro["NRO_POLIZA"] + ";");
                            csvfile.Write(registro["FECHA_INICIO"] + ";");
                            csvfile.Write(registro["FECHA_VENCIMIENTO"] + ";");
                            csvfile.Write(registro["NRO_FACTURA"] + ";");
                            csvfile.Write(registro["FECHA_EMISION_FACTURA"] + ";");
                            csvfile.Write(registro["MONTO_FACTURA"] + ";");
                            csvfile.Write(registro["TIPO_SEGURO"] + ";");
                            if (lseguro.Exists(s => s.cpersona == per.cpersona))
                            {
                                //Agregar el estado "CORRECTO"
                                csvfile.Write("CORRECTO;");
                            }
                            else
                            {
                                //Agregar el estado "ERROR"
                                csvfile.Write("ERROR;");
                            }
                            csvfile.Write(registro["MES_CUOTA"] + ";");
                            csvfile.WriteLine();
                        }
                        else
                        {
                            statusFileExcel = false;
                            break;
                        }
                    }
                    csvfile.Close();
                    if (statusFileExcel)
                    {
                        List<tgencargaarchivolog> lLogs = new List<tgencargaarchivolog>();
                        tgencargaarchivolog newLog = new tgencargaarchivolog();
                        newLog.cmodulo = rqmantenimiento.Cmodulotranoriginal;
                        newLog.ctransaccion = rqmantenimiento.Ctranoriginal;
                        newLog.tipoarchivo = "CARGA RENOVACIÓN DE POLIZA";
                        newLog.nombre = newName;
                        newLog.fcarga = DateTime.UtcNow;
                        newLog.freal = DateTime.Now;
                        newLog.estado = "F";
                        newLog.registrosok = lseguro.Count;
                        newLog.registroserror = 0;
                        newLog.registrostotal = newLog.registrosok + newLog.registroserror;
                        newLog.valor1 = sumValor1;
                        newLog.valor2 = 0;
                        newLog.valor3 = 0;
                        newLog.comentario = "";
                        newLog.fingreso = newLog.freal;
                        newLog.cusuarioing = rqmantenimiento.Cusuario;
                        newLog.fmodificacion = null;
                        newLog.cusuariomod = null;
                        lLogs.Add(newLog);
                        rqmantenimiento.AdicionarTabla(typeof(tgencargaarchivolog).Name.ToUpper(), lLogs, false);
                    }
                    else
                    {
                        throw new util.AtlasException("SEG-002", "MODULE: {0} TRANS: {1}. SUCEDIO UN ERROR AL INTENTAR REGISTRAR EL LOG DE LA CARGA MASIVA", rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion);
                    }
                }
                catch (Exception e)
                {
                    throw new util.AtlasException("SEG-002", "PROCESO {0} A EJECUTAR MODULE: {1} TRANS: {2} SUCEDIO UNA EXCEPCIÓN", e, rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion);
                }
            }
            rqmantenimiento.AdicionarTabla(typeof(tsgsseguro).Name.ToUpper(), lseguro, false);
            //// Cuenta por Cobrar
            //if ((decimal)rqmantenimiento.Monto > 0) {
            //    EjecutaCuentaPorCobrar(rqmantenimiento);
            //}
        }

        ///// <summary>
        ///// Ejecuta transaccion de cuenta por Cobrar de cartera
        ///// </summary>
        ///// <param name="rqmantenimiento">Request de mantenimiento.</param>
        //public void EjecutaCuentaPorCobrar(RqMantenimiento rqmantenimiento)
        //{
        //    // Ejecuta cuenta por cobrar
        //    RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
        //    Mantenimiento.ProcesarAnidado(rq, 7, 140);
        //}
    }
}
