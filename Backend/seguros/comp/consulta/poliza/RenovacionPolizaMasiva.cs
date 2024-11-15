using core.componente;
using core.servicios.consulta;
using LinqToExcel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using util.dto;
using util.dto.consulta;

namespace seguros.comp.consulta.poliza
{
    class RenovacionPolizaMasiva : ComponenteConsulta
    {
        /// <summary>
        /// Clase que entrega los datos de las polizas masivas
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string pathTemporal = null;
            try
            {
                Random rnd = new Random();
                string archivo = (string)rqconsulta.GetDatos("SOCIOS");
                string narchivo = (string)rqconsulta.GetDatos("narchivo");
                pathTemporal = Path.GetTempPath() + narchivo;
                if (archivo != null && narchivo != null)
                {
                    archivo = archivo.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "");
                    archivo = archivo.Replace("data:application/vnd.ms-excel;base64,", "");
                    File.WriteAllBytes(pathTemporal, Convert.FromBase64String(archivo));
                    var excelFile = new ExcelQueryFactory(pathTemporal);
                    var cargatabla = from a in excelFile.Worksheet("data") select a;
                    string auxc = "'" + rqconsulta.Ccompania + "^" + rqconsulta.Csucursal + "^" + rqconsulta.Cagencia + "^" + rqconsulta.Cusuario + "^" + rqconsulta.Crol + "^" + rqconsulta.Cidioma + "^" + rqconsulta.Ccanal + "^ ^" + rqconsulta.Cmodulo + "^" + rqconsulta.Ctransaccion + "'";
                    Consulta consulta = new Consulta();
                    Response response = null;
                    JArray sociosProcesadosInsert = new JArray();
                    JArray sociosProcesadosDetail = new JArray();
                    bool statusData = true;
                    foreach (var registro in cargatabla)
                    {
                        if (registro.Count == 11)
                        {

                            string sql = "";
                            if (
                                (registro["IDENTIFICACION"] != null && registro["IDENTIFICACION"].ToString().Length == 10 && int.TryParse(registro["IDENTIFICACION"].ToString(), out _)) && //VALIDA IDENTIDAD
                                (registro["VAL_ASEGURADO"] != null && (int.TryParse(registro["VAL_ASEGURADO"].ToString(), out _) || double.TryParse(registro["VAL_ASEGURADO"].ToString(), out _))) && //VALIDA VALOR ASEGURADO
                                (registro["NRO_POLIZA"] != null && registro["NRO_POLIZA"].ToString().Length > 0) && //VALIDA NUNERO DE POLIZA
                                (registro["FECHA_INICIO"] != null && DateTime.TryParse(registro["FECHA_INICIO"].ToString(), out _)) && //VALIDA FECHA DE INICIO
                                (registro["FECHA_VENCIMIENTO"] != null && DateTime.TryParse(registro["FECHA_VENCIMIENTO"].ToString(), out _)) && //VALIDA FECHA DE VENCIMIENTO
                                (registro["NRO_FACTURA"] != null && int.TryParse(registro["NRO_FACTURA"].ToString(), out _)) && //VALIDA NUMERO DE FACTURA
                                (registro["FECHA_EMISION_FACTURA"] != null && DateTime.TryParse(registro["FECHA_EMISION_FACTURA"].ToString(), out _)) && //VALIDA FECHA DE EMICIÓN DE FACTURA
                                (registro["MONTO_FACTURA"] != null && (int.TryParse(registro["MONTO_FACTURA"].ToString(), out _) || double.TryParse(registro["MONTO_FACTURA"].ToString(), out _))) && //VALIDA MONTO DE FACTURA
                                (registro["TIPO_SEGURO"] != null && registro["TIPO_SEGURO"].ToString().Length > 0) && //VALIDA TIPO DE SEGURO
                                (registro["COMENTARIO"] != null && registro["COMENTARIO"].ToString().Length > 0) && //VALIDA COMENTARIO
                                (registro["MES_CUOTA"] != null && DateTime.TryParse(registro["MES_CUOTA"].ToString(), out _)) //VALIDA MES CUOTA
                            )
                            {
                                //CONSULTAR SOCIO
                                sql = sql + "{'mdatos': {}, 'grabarlog': '0',";
                                sql = sql + "'LOVPERSONADETALLE': {";
                                sql = sql + "'pagina': 0, 'cantidad': 1,";
                                sql = sql + "'filtro': [";
                                sql = sql + "{'campo': 'csocio','valor': 1},";
                                sql = sql + "{'campo': 'identificacion','valor': '" + registro["IDENTIFICACION"] + "'},";
                                sql = sql + "{'campo': 'ccompania','valor': " + rqconsulta.Ccompania + "},";
                                sql = sql + "{'campo': 'verreg','valor': 0}";
                                sql = sql + "],";
                                sql = sql + "'filtroEspecial': [],";
                                sql = sql + "'subquery': [";
                                sql = sql + "{'bean': 'tpernatural','campo': 'profesioncdetalle','alias': 'nprofesion','filtro': 'i.cpersona = t.cpersona and i.verreg = t.verreg and i.ccompania = t.ccompania'},";
                                sql = sql + "{'bean': 'tpernatural','campo': 'estadocivilcdetalle','alias': 'estadocivil','filtro': 'i.cpersona = t.cpersona and i.verreg = t.verreg and i.ccompania = t.ccompania'},";
                                sql = sql + "{'bean': 'tsegusuariodetalle','campo': 'cusuario','alias': 'cusuario','filtro': 'i.cpersona = t.cpersona and i.verreg = t.verreg and i.ccompania = t.ccompania'},";
                                sql = sql + "{'bean': 'tsoccesantia','campo': 'ccdetalletipoestado','alias': 'tipoestado','filtro': 'i.cpersona = t.cpersona and i.verreg = t.verreg and i.ccompania = t.ccompania'},";
                                sql = sql + "{'bean': '','campo': '','alias': 'ngrado','filtro': '','sentencia': 'select nombre from tsoctipogrado where cgrado = ((select cgradoactual from tsoccesantiahistorico h where h.secuencia = (select secuenciahistorico from tsoccesantia s where s.verreg = t.verreg and s.ccompania = t.ccompania and s.cpersona = t.cpersona) and h.verreg = t.verreg and h.ccompania = t.ccompania and h.cpersona = t.cpersona))'},";
                                sql = sql + "{'bean': '','campo': '','alias': 'cjerarquia','filtro': '','sentencia': 'select g.cdetallejerarquia from tsoccesantia c, tsoccesantiahistorico h, tsoctipogrado g where c.cpersona = h.cpersona and c.secuenciahistorico = h.secuencia and c.verreg = h.verreg and h.cgradoactual = g.cgrado and c.verreg = 0 and c.cpersona = t.cpersona'},";
                                sql = sql + "{'bean': '','campo': '','alias': 'cestadosocio','filtro': '','sentencia': 'select h.cestadosocio from tsoccesantia c, tsoccesantiahistorico h where c.cpersona = h.cpersona and c.secuenciahistorico = h.secuencia and c.verreg = h.verreg and c.verreg = 0 and c.cpersona = t.cpersona'}";
                                sql = sql + "],";
                                sql = sql + "'bean': 'tperpersonadetalle',";
                                sql = sql + "'lista': 'Y',";
                                sql = sql + "'orderby': 't.nombre'";
                                sql = sql + "},";
                                sql = sql + "'c': " + auxc;
                                sql = sql + "}";
                                response = consulta.Ejecutar(sql);
                                sql = "";
                                if (response.GetCod().Equals("OK") && response.ContainsKey("LOVPERSONADETALLE"))
                                {
                                    JArray ResponseLov = (JArray)JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(response))["LOVPERSONADETALLE"];
                                    if (ResponseLov != null && ResponseLov.Count == 1)
                                    {
                                        JObject person = (JObject)ResponseLov[0];
                                        if (person["cpersona"] != null)
                                        {
                                            //CONSULTAR SEGUROS
                                            sql = sql + "{";
                                            sql = sql + "'mdatos': {},";
                                            sql = sql + "'grabarlog': '0',";
                                            sql = sql + "'LOVSEGUROS': {";
                                            sql = sql + "'pagina': 0,";
                                            sql = sql + "'cantidad': 15,";
                                            sql = sql + "'filtro': [{'campo': 'cpersona','valor': " + person["cpersona"] + "}],";
                                            sql = sql + "'filtroEspecial': [";
                                            sql = sql + "{'campo': 'secuenciapoliza','condicion': 'is not null'},";
                                            sql = sql + "{'campo': 'coperacioncartera','condicion': \"in (select coperacion from tcaroperacion where cestatus != 'CAN')\"}";
                                            sql = sql + "],";
                                            sql = sql + "'subquery': [";
                                            sql = sql + "{'bean': 'tsgstiposegurodetalle','campo': 'nombre','alias': 'ntiposeguro','filtro': 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0'},";
                                            sql = sql + "{'bean': 'tsgstiposegurodetalle','campo': 'csaldo','alias': 'csaldo','filtro': 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0'},";
                                            sql = sql + "{'bean': 'tsgstiposegurodetalle','campo': 'csaldocxc','alias': 'csaldocxc','filtro': 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0'},";
                                            sql = sql + "{'bean': '','campo': '','alias': 'nproducto','filtro': '','sentencia': 'select p.nombre from tgenproducto p, tcaroperacion o where p.cmodulo = o.cmodulo and t.coperacioncartera = o.coperacion and p.cproducto = o.cproducto and o.cmodulo = 7'},";
                                            sql = sql + "{'bean': '','campo': '','alias': 'ntipoproducto','filtro': '','sentencia': 'select tp.nombre from tgentipoproducto tp, tcaroperacion o where tp.cmodulo = o.cmodulo and t.coperacioncartera = o.coperacion and tp.cproducto = o.cproducto and tp.ctipoproducto = o.ctipoproducto and o.cmodulo = 7'}";
                                            sql = sql + "],";
                                            sql = sql + "'bean': 'tsgsseguro',";
                                            sql = sql + "'lista': 'Y',";
                                            sql = sql + "'orderby': 't.coperacioncartera'";
                                            sql = sql + "},";
                                            sql = sql + "'c': " + auxc;
                                            sql = sql + "}";
                                            response = consulta.Ejecutar(sql);
                                            sql = "";
                                            if (response.GetCod().Equals("OK") && response.ContainsKey("LOVSEGUROS"))
                                            {
                                                ResponseLov = (JArray)JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(response))["LOVSEGUROS"];
                                                if (ResponseLov != null && ResponseLov.Count > 0)
                                                {
                                                    if (ResponseLov.Count == 1)
                                                    {
                                                        JObject seguro = (JObject)ResponseLov[0];
                                                        if (seguro["coperacioncartera"] != null && seguro["coperaciongarantia"] != null)
                                                        {
                                                            sql = sql + "{'mdatos': { 'CODIGOCONSULTA': 'CONSULTATABLAPAGOSCARTERA'},";
                                                            sql = sql + "'coperacion': " + seguro["coperacioncartera"] + ",";
                                                            sql = sql + "'c': " + auxc + "}";
                                                            response = consulta.Ejecutar(sql);
                                                            if (response.GetCod().Equals("OK") && response.ContainsKey("TABLA") && response.ContainsKey("TOTALES"))
                                                            {
                                                                ResponseLov = (JArray)JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(response))["TABLA"];
                                                                JArray tabla = ResponseLov.ToObject<JArray>();
                                                                if (tabla != null && tabla.Count > 1)
                                                                {
                                                                    ResponseLov = (JArray)JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(response))["TOTALES"];
                                                                    if (ResponseLov != null && ResponseLov.Count == 1)
                                                                    {
                                                                        JObject total = (JObject)ResponseLov[0];
                                                                        sql = "{'CODIGOCONSULTA': 'ALERTASEGUROS' ,'mdatos': { 'coperacioncartera': " + seguro["coperacioncartera"] + ", 'coperaciongarantia': " + seguro["coperaciongarantia"] + "}, 'c': " + auxc + "}";
                                                                        response = consulta.Ejecutar(sql);
                                                                        sql = "";
                                                                        if (response.GetCod().Equals("OK"))
                                                                        {
                                                                            string primeraCuota = null;
                                                                            foreach (JObject t in tabla)
                                                                            {
                                                                                DateTime DatePolizaVen = DateTime.Parse((string)t["fvencimiento"]);
                                                                                DateTime fechaVencimiento = DateTime.Parse((string)registro["MES_CUOTA"]);
                                                                                if (DatePolizaVen.Year == fechaVencimiento.Year && DatePolizaVen.Month == fechaVencimiento.Month && DatePolizaVen.Day == fechaVencimiento.Day)
                                                                                {
                                                                                    primeraCuota = (string)t["num"];
                                                                                    break;
                                                                                }
                                                                            }
                                                                            if (primeraCuota == null)
                                                                            {
                                                                                statusData = false;
                                                                                sociosProcesadosDetail.Add(new JObject {
                                                                                    { "nro", (sociosProcesadosDetail.Count + 1) },
                                                                                    { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                                                    { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                                                    { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                                                    { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                                                    { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                                                    { "estado", "NO FUE POSIBLE ENCONTRAR EL NÚMERO DE CUOTA DEL SEGURO DE POLIZA DEL SOCIO"}
                                                                                });
                                                                            }
                                                                            else
                                                                            {
                                                                                DateTime DateObjectFI = DateTime.Parse((string)registro["FECHA_INICIO"]);
                                                                                DateTime DateObjectFV = DateTime.Parse((string)registro["FECHA_VENCIMIENTO"]);
                                                                                DateTime DateObjectFE = DateTime.Parse((string)registro["FECHA_EMISION_FACTURA"]);
                                                                                string fechaIni = "", fechaVen = "", fechaEmi = "";
                                                                                if (DateObjectFI.Month > 9)
                                                                                {
                                                                                    if (DateObjectFI.Day > 9)
                                                                                    {
                                                                                        fechaIni = DateObjectFI.Year + "" + DateObjectFI.Month + "" + DateObjectFI.Day;
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        fechaIni = DateObjectFI.Year + "" + DateObjectFI.Month + "0" + DateObjectFI.Day;
                                                                                    }
                                                                                }
                                                                                else
                                                                                {
                                                                                    if (DateObjectFI.Day > 9)
                                                                                    {
                                                                                        fechaIni = DateObjectFI.Year + "0" + DateObjectFI.Month + "" + DateObjectFI.Day;
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        fechaIni = DateObjectFI.Year + "0" + DateObjectFI.Month + "0" + DateObjectFI.Day;
                                                                                    }
                                                                                }
                                                                                if (DateObjectFV.Month > 9)
                                                                                {
                                                                                    if (DateObjectFV.Day > 9)
                                                                                    {
                                                                                        fechaVen = DateObjectFV.Year + "" + DateObjectFV.Month + "" + DateObjectFV.Day;
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        fechaVen = DateObjectFV.Year + "" + DateObjectFV.Month + "0" + DateObjectFV.Day;
                                                                                    }
                                                                                }
                                                                                else
                                                                                {
                                                                                    if (DateObjectFV.Day > 9)
                                                                                    {
                                                                                        fechaVen = DateObjectFV.Year + "0" + DateObjectFV.Month + "" + DateObjectFV.Day;
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        fechaVen = DateObjectFV.Year + "0" + DateObjectFV.Month + "0" + DateObjectFV.Day;
                                                                                    }
                                                                                }
                                                                                if (DateObjectFE.Month > 9)
                                                                                {
                                                                                    if (DateObjectFE.Day > 9)
                                                                                    {
                                                                                        fechaEmi = DateObjectFE.Year + "" + DateObjectFE.Month + "" + DateObjectFE.Day;
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        fechaEmi = DateObjectFE.Year + "" + DateObjectFE.Month + "0" + DateObjectFE.Day;
                                                                                    }
                                                                                }
                                                                                else
                                                                                {
                                                                                    if (DateObjectFE.Day > 9)
                                                                                    {
                                                                                        fechaEmi = DateObjectFE.Year + "0" + DateObjectFE.Month + "" + DateObjectFE.Day;
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        fechaEmi = DateObjectFE.Year + "0" + DateObjectFE.Month + "0" + DateObjectFE.Day;
                                                                                    }
                                                                                }
                                                                                JObject newObj = new JObject {
                                                                                    { "mdatos", new JObject {
                                                                                            { "ntiposeguro", (string)seguro["mdatos"]["ntiposeguro"] },
                                                                                            { "csaldocxc", (string)seguro["mdatos"]["csaldocxc"] }
                                                                                        }
                                                                                    },
                                                                                    { "actualizar", false },
                                                                                    { "idreg", Math.Floor((rnd.NextDouble() * 100000) + 1) },
                                                                                    { "esnuevo", true },
                                                                                    { "renovacion", true },
                                                                                    { "coperacioncartera", (string)seguro["coperacioncartera"] },
                                                                                    { "coperaciongarantia", (string)seguro["coperaciongarantia"] },
                                                                                    { "ctiposeguro", (int)seguro["ctiposeguro"] },
                                                                                    { "valorasegurado", decimal.Parse(registro["VAL_ASEGURADO"].ToString()) },
                                                                                    { "numeropoliza", registro["NRO_POLIZA"].ToString() },
                                                                                    { "numerofactura", registro["NRO_FACTURA"].ToString() },
                                                                                    { "valorfactura", decimal.Parse(registro["MONTO_FACTURA"].ToString()) },
                                                                                    { "valorprima", decimal.Parse(registro["MONTO_FACTURA"].ToString()) },
                                                                                    { "comentario", registro["COMENTARIO"].ToString() },
                                                                                    { "cuotainicio", primeraCuota },
                                                                                    { "numerocuotas", "1" },
                                                                                    { "finicio", Int64.Parse(fechaIni) },
                                                                                    { "fvencimiento", Int64.Parse(fechaVen) },
                                                                                    { "femision", Int64.Parse(fechaEmi)}
                                                                                };
                                                                                sociosProcesadosInsert.Add(newObj);
                                                                                sociosProcesadosDetail.Add(new JObject {
                                                                                    { "nro", (sociosProcesadosDetail.Count + 1) },
                                                                                    { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                                                    { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                                                    { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                                                    { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                                                    { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                                                    { "estado", "CORRECTO"}
                                                                                });
                                                                            }
                                                                        }
                                                                        else
                                                                        {
                                                                            statusData = false;
                                                                            sociosProcesadosDetail.Add(new JObject {
                                                                                { "nro", (sociosProcesadosDetail.Count + 1) },
                                                                                { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                                                { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                                                { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                                                { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                                                { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                                                { "estado", "EL SOCIO NO POSEE SEGUROS EN ALERTA"}
                                                                            });
                                                                        }
                                                                    }
                                                                    else{
                                                                        statusData = false;
                                                                        sociosProcesadosDetail.Add(new JObject {
                                                                            { "nro", (sociosProcesadosDetail.Count + 1) },
                                                                            { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                                            { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                                            { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                                            { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                                            { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                                            { "estado", "EL SEGURO DEL SOCIO NO POSEE TOTALES O POSEE MÁS DE UN TOTAL"}
                                                                        });
                                                                    }
                                                                }
                                                                else
                                                                {
                                                                    statusData = false;
                                                                    sociosProcesadosDetail.Add(new JObject {
                                                                        { "nro", (sociosProcesadosDetail.Count + 1) },
                                                                        { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                                        { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                                        { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                                        { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                                        { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                                        { "estado", "EL SEGURO DEL SOCIO POSEE UNA TABLA DE AMORTIZACIÓN SIN REGISTROS"}
                                                                    });
                                                                }
                                                            }
                                                            else
                                                            {
                                                                statusData = false;
                                                                sociosProcesadosDetail.Add(new JObject {
                                                                    { "nro", (sociosProcesadosDetail.Count + 1) },
                                                                    { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                                    { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                                    { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                                    { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                                    { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                                    { "estado", "EL SEGURO DEL SOCIO NO POSEE UNA TABLA DE AMORTIZACIÓN NI TOTALES"}
                                                                });
                                                            }
                                                        }
                                                        else
                                                        {
                                                            statusData = false;
                                                            sociosProcesadosDetail.Add(new JObject {
                                                                { "nro", (sociosProcesadosDetail.Count + 1) },
                                                                { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                                { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                                { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                                { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                                { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                                { "estado", "EL SEGURO DEL SOCIO NO POSEE UNA OPERACIÓN DE CARTERA"}
                                                            });
                                                        }
                                                    }
                                                    else
                                                    {
                                                        statusData = false;
                                                        sociosProcesadosDetail.Add(new JObject {
                                                            { "nro", (sociosProcesadosDetail.Count + 1) },
                                                            { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                            { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                            { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                            { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                            { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                            { "estado", "EL SOCIO POSEE MÁS DE UN SEGURO"}
                                                        });
                                                    }
                                                }
                                                else
                                                {
                                                    statusData = false;
                                                    sociosProcesadosDetail.Add(new JObject {
                                                        { "nro", (sociosProcesadosDetail.Count + 1) },
                                                        { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                        { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                        { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                        { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                        { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                        { "estado", "EL SOCIO NO POSEE SEGUROS"}
                                                    });
                                                }
                                            }
                                            else
                                            {
                                                statusData = false;
                                                sociosProcesadosDetail.Add(new JObject {
                                                    { "nro", (sociosProcesadosDetail.Count + 1) },
                                                    { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                    { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                    { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                    { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                    { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                    { "estado", "EL SOCIO NO POSEE SEGUROS"}
                                                });
                                            }
                                        }
                                        else
                                        {
                                            statusData = false;
                                            sociosProcesadosDetail.Add(new JObject {
                                                { "nro", (sociosProcesadosDetail.Count + 1) },
                                                { "identificacion", registro["IDENTIFICACION"].ToString() },
                                                { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                                { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                                { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                                { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                                { "estado", "EL SOCIO NO POSEE UN cpersona"}
                                            });
                                        }
                                    }
                                    else
                                    {
                                        statusData = false;
                                        sociosProcesadosDetail.Add(new JObject {
                                            { "nro", (sociosProcesadosDetail.Count + 1) },
                                            { "identificacion", registro["IDENTIFICACION"].ToString() },
                                            { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                            { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                            { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                            { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                            { "estado", "EL SOCIO SE ENCUENTRA DUPLICADO"}
                                        });
                                    }
                                }
                                else
                                {
                                    statusData = false;
                                    sociosProcesadosDetail.Add(new JObject {
                                        { "nro", (sociosProcesadosDetail.Count + 1) },
                                        { "identificacion", registro["IDENTIFICACION"].ToString() },
                                        { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                        { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                        { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                        { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                        { "estado", "NO FUE POSIBLE LOCALIZAR EL SOCIO"}
                                    });
                                }
                            }
                            else
                            {
                                statusData = false;
                                sociosProcesadosDetail.Add(new JObject {
                                    { "nro", (sociosProcesadosDetail.Count + 1) },
                                    { "identificacion", registro["IDENTIFICACION"].ToString() },
                                    { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                    { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                    { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                    { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                    { "estado", "LOS DATOS DEL REGISTRO DEL SOCIO SE ENCUENTRAN INCORRECTOS"}
                                });
                            }
                        }
                        else
                        {
                            statusData = false;
                            sociosProcesadosDetail.Add(new JObject {
                                { "nro", (sociosProcesadosDetail.Count + 1) },
                                { "identificacion", registro["IDENTIFICACION"].ToString() },
                                { "valor_asegurado", registro["VAL_ASEGURADO"].ToString() },
                                { "nro_poliza", registro["NRO_POLIZA"].ToString() },
                                { "nro_factura", registro["NRO_FACTURA"].ToString() },
                                { "monto_factura", registro["MONTO_FACTURA"].ToString() },
                                { "estado", "EL REGISTRO DEL SOCIO CONTIENE EXCESO DE DATOS, O DATOS INCOMPLETOS"}
                            });
                        }
                    }
                    if (statusData)
                    {
                        rqconsulta.Response["message"] = "SE TERMINO DE CONSTRUIR LOS REGISTROS. POR FAVOR, PROCEDA A GRABAR LOS REGISTROS";
                        rqconsulta.Response["INSPOLIZA"] = sociosProcesadosInsert;
                        rqconsulta.Response["FILE_TMP"] = pathTemporal;
                        rqconsulta.Response["DATA_PROCCESS"] = sociosProcesadosDetail;
                    }
                    else
                    {
                        rqconsulta.Response["cod"] = "SEG-0777";
                        if (sociosProcesadosInsert != null && sociosProcesadosInsert.Count > 0)
                        {
                            rqconsulta.Response["message"] = "EXISTEN ERRORES. POR FAVOR, REVISE QUE REGTISTROS SE ENCUENTRAN CON ERROR Y PROCEDA A COOREGIR PARA VOLVER A CARGAR DE NUEVO.\nTAMBIEN PUEDE CONTINUAR CON LA CARGA Y OMITIR LOS REGISTROS QUE POSEEN ERRORES.";
                            rqconsulta.Response["INSPOLIZA"] = sociosProcesadosInsert;
                            rqconsulta.Response["FILE_TMP"] = pathTemporal;
                            rqconsulta.Response["DATA_PROCCESS"] = sociosProcesadosDetail;
                        }
                        else
                        {
                            rqconsulta.Response["message"] = "TODOS LOS REGISTROS SE ENCUENTRAN CON ERRORES. POR FAVOR, REVISE SU ARCHIVO Y PROCEDA A VOLVER A CARGAR DE NUEVO.";
                            rqconsulta.Response["INSPOLIZA"] = null;
                            rqconsulta.Response["FILE_TMP"] = null;
                            rqconsulta.Response["DATA_PROCCESS"] = sociosProcesadosDetail;
                        }
                    }
                }
                else
                {
                    rqconsulta.Response["cod"] = "SEG-0777";
                    rqconsulta.Response["message"] = "NO SE HA ENVIADO UN ARCHIVO DE SOCIOS, O UN NOMBRE DE ARCHIVO.";
                    rqconsulta.Response["INSPOLIZA"] = null;
                    rqconsulta.Response["FILE_TMP"] = null;
                    rqconsulta.Response["DATA_PROCCESS"] = null;
                }
            }
            catch (Exception e)
            {
                rqconsulta.Response["cod"] = "SEG-8786";
                rqconsulta.Response["message"] = e.Message;
                rqconsulta.Response["INSPOLIZA"] = null;
                rqconsulta.Response["FILE_TMP"] = null;
                rqconsulta.Response["DATA_PROCCESS"] = null;
            }
        }
    }
}
