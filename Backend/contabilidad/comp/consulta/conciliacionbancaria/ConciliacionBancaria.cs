using core.componente;
using dal.contabilidad.conciliacionbancaria;
using util.dto.consulta;
using System.Collections.Generic;
using modelo;
using System.Data;
using contabilidad.datos;
using System.Reflection;
using System;
using System.Linq;
using util;
using Newtonsoft.Json;
using contabilidad.enums;
using dal.tesoreria;
using tesoreria.enums;

namespace contabilidad.comp.consulta.conciliacionbancaria
{
    /// <summary>
    /// Clase que encapsula los procedimientos de consulta del módulo de conciliación bancaria.
    /// </summary>
    class ConciliacionBancaria : ComponenteConsulta
    {
        /// <summary>
        /// Obtiene la conciliación bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            List<tConciliacion> lresp = new List<tConciliacion>();

            lresp = TconConciliacionBancariaDal.GetConciliacion(rqconsulta);
            rqconsulta.Response["CONCILIACION"] = lresp;

        }
    }

    class ObtenerSaldoCuenta : ComponenteConsulta
    {
        /// <summary>
        /// Obtiene el saldo de la cuenta bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            if (!rqconsulta.Mdatos.ContainsKey("ffin") || !rqconsulta.Mdatos.ContainsKey("ccuenta"))
            {
                return;
            }
            int fcontable =int.Parse(rqconsulta.Mdatos["ffin"].ToString());
            string ccuenta = (string)rqconsulta.Mdatos["ccuenta"];         
            decimal? saldo = 0;
            tconlibrobancosaldo saldoconciliacion = TconLibroBancoSaldoDal.GetSaldoBanco(fcontable, ccuenta);
            if (saldoconciliacion != null)
            {
                saldo = saldoconciliacion.saldo.Value;
            }
            rqconsulta.Response["SALDO"] = saldo;
        }
    }

    class ConciliacionReverso : ComponenteConsulta
    {
        /// <summary>
        /// Elimina la conciliación bancaria dados la cuenta contable, fecha inicial y fecha final.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            TconConciliacionBancariaDal.Delete(rqconsulta.Mdatos["ccuenta"].ToString(),
                int.Parse(rqconsulta.Mdatos["fechainicial"].ToString()),
                int.Parse(rqconsulta.Mdatos["fechafinal"].ToString()));
            string lresp = "OK";
            rqconsulta.Response["CONCILIACIONREVERSO"] = lresp;
        }
    }

    class ActualizarEstadoMayor : ComponenteConsulta
    {
        /// <summary>
        /// Actualiza el mayor de la cuenta bancos a conciliar.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            TconConciliacionBancariamayorDal.ActualizarEstado(rqconsulta.Mdatos["ccuenta"].ToString(),
                int.Parse(rqconsulta.Mdatos["fechainicial"].ToString()),
                int.Parse(rqconsulta.Mdatos["fechafinal"].ToString()));
            string lresp = "OK";
            rqconsulta.Response["ACTUALIZAESTADOMAYOR"] = lresp;
        }
    }

    class ActualizarEstadoExtracto : ComponenteConsulta
    {
        /// <summary>
        /// Actualiza el estado del extracto bancario.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            tconconciliacionbancariaextDal.ActualizarEstado(rqconsulta.Mdatos["ccuenta"].ToString(),
                int.Parse(rqconsulta.Mdatos["fechainicial"].ToString()),
                int.Parse(rqconsulta.Mdatos["fechafinal"].ToString()));
            string lresp = "OK";
            rqconsulta.Response["ACTUALIZAESTADOEXTRACTO"] = lresp;
        }
    }

    class ConciliacionParametros : ComponenteConsulta
    {
        /// <summary>
        /// Obtiene los parámetros de la conciliación bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            IList<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            lresp = TconConciliacionBancariaDal.GetParametros(rqconsulta);
            rqconsulta.Response["CONCILIACIONPARAMETROS"] = lresp;

        }
    }

    class ActualizaSaldo : ComponenteConsulta
    {
        /// <summary>
        /// Actualiza el saldo de la cuenta bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            string lresp;
            int particion = int.Parse(rqconsulta.Mdatos["fecha"].ToString());
            string ccuenta = rqconsulta.Mdatos["ccuenta"].ToString();
            tconlibrobancosaldo saldo = TconLibroBancoSaldoDal.GetSaldoBanco(particion, ccuenta);
            tconbanco banco = TconBancoDal.Find(ccuenta);
            
            if (saldo==null)
            {
                TconLibroBancoSaldoDal.InsertarSaldo(int.Parse(rqconsulta.Mdatos["fecha"].ToString().Trim()),
                    banco.ccuentabanco,
                    rqconsulta.Mdatos["ccuenta"].ToString().Trim(),                   
                    decimal.Parse(rqconsulta.Mdatos["saldoparaconciliacion"].ToString().Trim()),
                    rqconsulta.Cusuario.Trim());

            }
            else
            {
                TconLibroBancoSaldoDal.ActualizarSaldo(
                    int.Parse(rqconsulta.Mdatos["fecha"].ToString().Trim()),
                    rqconsulta.Mdatos["ccuenta"].ToString().Trim(),                    
                    decimal.Parse(rqconsulta.Mdatos["saldoparaconciliacion"].ToString().Trim()),
                    rqconsulta.Cusuario.Trim());

            }
        }
    }

    class ConciliacionObtenerMayor : ComponenteConsulta
    {
        /// <summary>
        /// Obtiene el mayor de loa cuenta contable a conciliar.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns>string</returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            IList<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();

            lresp = TconConciliacionBancariamayorDal.GetMayor(rqconsulta);
            rqconsulta.Response["CONCILIACIONMAYOR"] = lresp;

        }
    }

    //class ConciliacionBancariaGlobal : ComponenteConsulta
    //{
    //    /// <summary>
    //    /// Obtiene la conciliación bancaria.
    //    /// </summary>
    //    /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
    //    /// <returns></returns>
    //    public override void Ejecutar(RqConsulta rqconsulta)
    //    {
    //        if (!rqconsulta.Mdatos.ContainsKey("ccuenta") || !rqconsulta.Mdatos.ContainsKey("estadoconciliacioncdetalle") || !rqconsulta.Mdatos.ContainsKey("finicio") || !rqconsulta.Mdatos.ContainsKey("ffin"))
    //        {
    //            return;
    //        }
    //        string ccuenta = (string)rqconsulta.Mdatos["ccuenta"];
    //        string estadoconciliacioncdetalle = (string)rqconsulta.Mdatos["estadoconciliacioncdetalle"];
    //        int finicio = Fecha.DateToInteger((DateTime)rqconsulta.Mdatos["finicio"]);
    //        int ffin = Fecha.DateToInteger((DateTime)rqconsulta.Mdatos["ffin"]);
    //        List<tconconciliacionbancariaeb> extracto = tconconciliacionbancariaextDal.GetExtracto(ccuenta, estadoconciliacioncdetalle, finicio, ffin);
    //        string ext = JsonConvert.SerializeObject(extracto);
    //        List<ExtractoBancario> extractoFinal = JsonConvert.DeserializeObject<List<ExtractoBancario>>(ext);
    //        if (extractoFinal.Count == 0)
    //        {
    //            //throw new AtlasException("CONTA-016", "NOERROR: NO EXISTEN REGISTROS DE EXTRACTO BANCARIO PENDIENTES DE CONCILIACIÓN");
    //        }
    //        DataTable mayorTable = TconConciliacionBancariamayorDal.GetMayor(ccuenta, finicio, ffin);
            

    //        if (mayorTable == null)
    //        {
    //            //throw new AtlasException("CONTA-017", "ERROR: NO EXISTEN REGISTROS DE LIBRO MAYOR PENDIENTES DE CONCILIACIÓN");
    //        }

    //        List<ConciliacionMayor> mayor = new List<ConciliacionMayor>();

    //        foreach (DataRow rw in mayorTable.Rows)
    //        {
    //            ConciliacionMayor m = new ConciliacionMayor();
    //            m.mccomprobante = Convert.ToString(rw["ccomprobante"]);
    //            m.mdoccabecera = Convert.ToString(rw["doccabecera"]);
    //            m.mfcontable = Convert.ToInt32(rw["fcontable"]);
    //            m.mdebito = Convert.ToBoolean(rw["debito"]);
    //            m.mmonto = Convert.ToDecimal(rw["monto"]);
    //            m.mcomentario = Convert.ToString(rw["comentario"]);
    //            m.msecuencia = Convert.ToInt32(rw["secuencia"]);
    //            m.mmodulo = Convert.ToString(rw["Modulo"]);
    //            m.mdocdetalle = Convert.ToString(rw["docdetalle"]);
    //            m.mprocesado = false;
    //            if (m.mdebito)
    //            {
    //                m.mvalordebito = m.mmonto;
    //            }
    //            else
    //            {
    //                m.mvalorcredito = m.mmonto;
    //            }
    //            m.mmayor = true;
    //            mayor.Add(m);
    //        }

    //        List<ConciliacionBancariaResultado> lconciliacion = new List<ConciliacionBancariaResultado>();
    //        long contador = 1;
    //        foreach (ConciliacionMayor ma in mayor)
    //        {
    //            foreach (ExtractoBancario eb in extractoFinal)
    //            {
    //                eb.extracto = true;
    //                if (!ma.mprocesado)
    //                {
    //                    if (ma.mdocdetalle.Contains(eb.numerodocumentobancario) && (ma.mmonto == eb.valorcredito || ma.mmonto == eb.valordebito))
    //                    {
    //                        ConciliacionBancariaResultado conciliacion = new ConciliacionBancariaResultado();

    //                        conciliacion.rconciliacionbancariaid = contador;
    //                        conciliacion.rfcontable = ma.mfcontable;
    //                        conciliacion.rccomprobante = ma.mccomprobante;
    //                        conciliacion.rsecuencia = ma.msecuencia;
    //                        conciliacion.rcconconciliacionbancariaextracto = eb.cconconciliacionbancariaextracto;
    //                        conciliacion.rvalorcredito = ma.mmonto;
    //                        conciliacion.rvalordebito = ma.mmonto;
    //                        conciliacion.rnumerodocumentobancario = eb.numerodocumentobancario;
    //                        conciliacion.rcuentabancaria = eb.cuentabancaria;
    //                        conciliacion.rcodigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
    //                        conciliacion.rautomatico = true;
    //                        conciliacion.rconciliado = true;
    //                        // Mayor
    //                        conciliacion.mfcontable = ma.mfcontable;
    //                        conciliacion.mccomprobante = ma.mccomprobante;
    //                        conciliacion.mnumerodocumentobancario = ma.mdocdetalle;
    //                        conciliacion.mvalordebito = ma.mvalordebito;
    //                        conciliacion.mvalorcredito = ma.mvalorcredito;
    //                        conciliacion.mmodulo = ma.mmodulo;
    //                        conciliacion.mcomentario = ma.mcomentario;
    //                        conciliacion.msecuencia = ma.msecuencia;
    //                        conciliacion.mmayor = true;
    //                        // Extracto
    //                        conciliacion.fecha = eb.fecha;
    //                        conciliacion.numerodocumentobancario = eb.numerodocumentobancario;
    //                        conciliacion.valordebito = eb.valordebito;
    //                        conciliacion.valorcredito = eb.valorcredito;
    //                        conciliacion.concepto = eb.concepto;
    //                        conciliacion.cuentabancaria = eb.cuentabancaria;
    //                        conciliacion.extracto = true;

    //                        ma.mprocesado = true;
    //                        ma.mconciliado = true;
    //                        eb.conciliado = true;
    //                        lconciliacion.Add(conciliacion);
    //                        contador = contador + 1;
    //                    }
    //                }
    //            }
    //        }
    //        // Quitar valores conciliados
    //        List<ConciliacionMayor> mayorFiltro = mayor.Where(x => x.mconciliado == false).ToList();
    //        List<ExtractoBancario> extractoFiltro = extractoFinal.Where(x => x.conciliado == false).ToList();
    //        //List<tconconciliacionbancaria> conciliacionPendiente = TconConciliacionBancariaDal.GetExtractoPorEstado(((int)EnumContabilidad.EstadoConciliacion.ING).ToString());

    //        rqconsulta.Response["MAYOR"] = mayorFiltro;
    //        rqconsulta.Response["EXTRACTO"] = extractoFiltro;
    //        rqconsulta.Response["CONCILIACIONRESULTADO"] = lconciliacion;
    //        //rqconsulta.Response["CONCILIACIONPENDIENTE"] = conciliacionPendiente; 
    //    }
    //}

    //class ConciliacionBancariaPichicha : ComponenteConsulta
    //{
    //    /// <summary>
    //    /// Obtiene la conciliación bancaria Pichincha.
    //    /// </summary>
    //    /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
    //    /// <returns></returns>
    //    public override void Ejecutar(RqConsulta rqconsulta)
    //    {
    //        if (!rqconsulta.Mdatos.ContainsKey("ccuenta") || !rqconsulta.Mdatos.ContainsKey("estadoconciliacioncdetalle") || !rqconsulta.Mdatos.ContainsKey("finicio") || !rqconsulta.Mdatos.ContainsKey("ffin"))
    //        {
    //            return;
    //        }
    //        string ccuenta = (string)rqconsulta.Mdatos["ccuenta"];
    //        string estadoconciliacioncdetalle = (string)rqconsulta.Mdatos["estadoconciliacioncdetalle"];
    //        int finicio = Fecha.DateToInteger((DateTime)rqconsulta.Mdatos["finicio"]);
    //        int ffin = Fecha.DateToInteger((DateTime)rqconsulta.Mdatos["ffin"]);
    //        // Armar extracto
    //        List<tconconciliacionbancariaeb> extracto = tconconciliacionbancariaextDal.GetExtracto(ccuenta, estadoconciliacioncdetalle, finicio, ffin);
    //        string ext = JsonConvert.SerializeObject(extracto);
    //        List<ExtractoBancario> extractoFinal = JsonConvert.DeserializeObject<List<ExtractoBancario>>(ext);
    //        //List<ExtractoBancario> extractoFinal = ValidarDebitoCredito(extractoEntidad.OrderBy(x => x.numerodocumentobancario).ToList());
            
    //        if (extractoFinal.Count == 0)
    //        {
    //            //throw new AtlasException("CONTA-016", "NOERROR: NO EXISTEN REGISTROS DE EXTRACTO BANCARIO PENDIENTES DE CONCILIACIÓN");
    //        }
    //        // Consulta Mayor
    //        DataTable mayorTable = TconConciliacionBancariamayorDal.GetMayor(ccuenta, finicio, ffin);
    //        if (mayorTable == null)
    //        {
    //            //throw new AtlasException("CONTA-017", "ERROR: NO EXISTEN REGISTROS DE LIBRO MAYOR PENDIENTES DE CONCILIACIÓN");
    //        }
    //        List<ConciliacionMayor> mayor = new List<ConciliacionMayor>();
    //        foreach (DataRow rw in mayorTable.Rows)
    //        {
    //            ConciliacionMayor m = new ConciliacionMayor();
    //            m.mccomprobante = Convert.ToString(rw["ccomprobante"]);
    //            m.mdoccabecera = Convert.ToString(rw["doccabecera"]);
    //            m.mfcontable = Convert.ToInt32(rw["fcontable"]);
    //            m.mdebito = Convert.ToBoolean(rw["debito"]);
    //            m.mmonto = Convert.ToDecimal(rw["monto"]);
    //            m.mcomentario = Convert.ToString(rw["comentario"]);
    //            m.msecuencia = Convert.ToInt32(rw["secuencia"]);
    //            m.mmodulo = Convert.ToString(rw["Modulo"]);
    //            m.mdocdetalle = Convert.ToString(rw["docdetalle"]);
    //            m.mprocesado = false;
    //            if (m.mdebito)
    //            {
    //                m.mvalordebito = m.mmonto;
    //            }
    //            else
    //            {
    //                m.mvalorcredito = m.mmonto;
    //            }
    //            m.mmayor = true;
    //            mayor.Add(m);
    //        }

    //        // Arma consulta cash
    //        List<ttesrecaudaciondetalle> lrecaudacionDetalledal = TtesRecaudacionDetalleDal.FindConciliacion(finicio, ffin, ((int)EnumTesoreria.EstadoRecaudacionCash.Cobrado).ToString());
    //        string cash = JsonConvert.SerializeObject(lrecaudacionDetalledal);
    //        List<RecaudacionDetalle> lrecaudacionDetalle = JsonConvert.DeserializeObject<List<RecaudacionDetalle>>(cash);

    //        //lista de procesados por referencia
    //        List<ExtractoBancario> procesadosref = new List<ExtractoBancario>();
    //        // Match entre extracto y cash
    //        List<ConciliacionBancariaPichinchaResultado> lconciliacion = new List<ConciliacionBancariaPichinchaResultado>();
    //        foreach (ExtractoBancario eb in extractoFinal)
    //        {
    //            //eb.encash = "NO";
    //           // eb.extracto = true;
    //            foreach (RecaudacionDetalle rec in lrecaudacionDetalle )
    //            {
                   

    //                if (!eb.procesado)
    //                {
    //                    string numerodocumento = string.Empty;
    //                    if (rec.numerodocumento.HasValue)
    //                    {
    //                        numerodocumento = rec.numerodocumento.Value.ToString();
    //                    }
    //                    //rec.enextracto = "NO";
    //                    if (eb.numerodocumentobancario == numerodocumento && (rec.valorprocesado == eb.valorcredito))
    //                    {
                            
    //                        ConciliacionBancariaPichinchaResultado conciliacion = new ConciliacionBancariaPichinchaResultado();

    //                        conciliacion.cconconciliacionbancariaextracto = eb.cconconciliacionbancariaextracto;
    //                        conciliacion.fcontablecash = rec.fcontable;
                            
    //                        conciliacion.ccomprobantecash = rec.ccomprobante;
    //                        conciliacion.valorcredito = eb.valorcredito.Value;
    //                        conciliacion.valordebito = eb.valordebito.Value;
    //                        conciliacion.concepto = eb.concepto;
    //                        conciliacion.cuentabancaria = eb.cuentabancaria;
    //                        conciliacion.numerodocumentobancariocash = eb.numerodocumentobancario;
    //                        conciliacion.numerodocumentobancarioextracto = eb.numerodocumentobancario;
    //                        conciliacion.codigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
    //                        conciliacion.automatico = true;
    //                        conciliacion.procesado = true;
                           
    //                        conciliacion.crecaudaciondetalle = rec.crecaudaciondetalle;
    //                        eb.procesado = true;
    //                        eb.extracto = true;
    //                        conciliacion.conciliado = false;
    //                        rec.conciliado =false;
    //                        eb.encash = "SI";
    //                        rec.enextracto = "SI";
    //                        eb.ccomprobante = rec.ccomprobante;
    //                        lconciliacion.Add(conciliacion);
    //                    }
                       

    //                    }
                        
                        
                        

    //                }

                
    //        }
    //        foreach (RecaudacionDetalle rec in lrecaudacionDetalle)
    //        {
    //            if (!rec.conciliado)
    //            {
    //                IList<ExtractoBancario> lsaux = extractoFinal.Where(x => x.concepto.Contains(rec.referencia) && x.procesado== false).ToList();
    //                decimal sum = lsaux.Sum(x => x.valorcredito).Value;
    //                if (rec.valorprocesado == sum)
    //                {
    //                    foreach (ExtractoBancario extb in lsaux)
    //                    {
    //                        ConciliacionBancariaPichinchaResultado conciliacion = new ConciliacionBancariaPichinchaResultado();

    //                        conciliacion.cconconciliacionbancariaextracto = extb.cconconciliacionbancariaextracto;
    //                        conciliacion.fcontablecash = rec.fcontable;
                          
    //                        conciliacion.ccomprobantecash = rec.ccomprobante;
    //                        conciliacion.valorcredito = extb.valorcredito.Value;
    //                        conciliacion.valordebito = extb.valordebito.Value;
    //                        conciliacion.concepto = extb.concepto;
    //                        conciliacion.cuentabancaria = extb.cuentabancaria;
    //                        conciliacion.numerodocumentobancariocash = extb.numerodocumentobancario;
    //                        conciliacion.numerodocumentobancarioextracto = extb.numerodocumentobancario;
    //                        conciliacion.codigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
    //                        conciliacion.automatico = true;
    //                        conciliacion.procesado = true;
                          
    //                        conciliacion.crecaudaciondetalle = rec.crecaudaciondetalle;
    //                        extb.procesado = true;
    //                        rec.conciliado = false;
    //                        conciliacion.conciliado = false;
    //                        extb.encash = "SI";
    //                        rec.enextracto = "SI";
    //                        extb.ccomprobante = rec.ccomprobante;
    //                        lconciliacion.Add(conciliacion);
    //                        procesadosref.Add(extb);
    //                    }
    //                }
    //            }
    //        }
    //        foreach (ExtractoBancario rec in procesadosref) {
    //            foreach (ExtractoBancario extb in extractoFinal)
    //                if (rec.cconconciliacionbancariaextracto == extb.cconconciliacionbancariaextracto) {
    //                    extb.procesado = true;
    //                    extb.conciliado = true;
    //                    extb.encash = "SI";
    //                    extb.ccomprobante = rec.ccomprobante;
    //                }
    //        }
    //        // Match entre Extracto y Cash VS Libro Mayor, validar total 

    //        List<ConciliacionBancariaPichincha> lconciliautomatico = new List<ConciliacionBancariaPichincha>();
    //        long contador = 1;
    //        foreach (ConciliacionMayor may in mayor)
    //        {
    //            List<ConciliacionBancariaPichinchaResultado> conciliado = lconciliacion.Where(x => x.ccomprobantecash == may.mccomprobante).ToList();
    //            decimal totalContable = conciliado.Sum(x => x.valorcredito);
    //            if (may.mvalordebito == totalContable)
    //            {
    //                foreach (ConciliacionBancariaPichinchaResultado congrupo in conciliado)
    //                {
    //                    ConciliacionBancariaPichincha conciliacion = new ConciliacionBancariaPichincha();
    //                    conciliacion.rconciliacionbancariaid = contador;
    //                    conciliacion.rcodigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
    //                    conciliacion.rautomatico = true;
    //                    conciliacion.rconciliado = true;
    //                    conciliacion.crecaudaciondetalle = congrupo.crecaudaciondetalle;
    //                    // Mayor
    //                    conciliacion.mfcontable = may.mfcontable;
    //                    conciliacion.mccomprobante = may.mccomprobante;
    //                    conciliacion.mnumerodocumentobancario = may.mdocdetalle;
    //                    conciliacion.mvalordebito = may.mvalordebito;
    //                    conciliacion.mvalorcredito = may.mvalorcredito;
    //                    conciliacion.mmodulo = may.mmodulo;
    //                    conciliacion.mcomentario = may.mcomentario;
    //                    conciliacion.msecuencia = may.msecuencia;
    //                    conciliacion.mmayor = true;
    //                    // Extracto
    //                    conciliacion.fecha = congrupo.fcontablecash;
    //                    conciliacion.numerodocumentobancario = congrupo.numerodocumentobancariocash;
    //                    conciliacion.valordebito = congrupo.valordebito;
    //                    conciliacion.valorcredito = congrupo.valorcredito;
    //                    conciliacion.concepto = congrupo.concepto;
    //                    conciliacion.cuentabancaria = congrupo.cuentabancaria;
    //                    conciliacion.extracto = true;
    //                    conciliacion.conconciliacionbancariaextracto = congrupo.cconconciliacionbancariaextracto;
    //                    lconciliautomatico.Add(conciliacion);
    //                    contador = contador + 1;
    //                    may.mconciliado = true;
    //                }
    //            }
    //        }

    //        // Quitar match de cash y extracto por no coincidir con el total en el mayor
    //        var unicoConciliado = lconciliautomatico
    //        .GroupBy(x => x.mccomprobante)
    //        .ToDictionary(g => g.Key);

    //        if (unicoConciliado.Count > 0)
    //        {
    //            foreach (var grupo in unicoConciliado)
    //            {
    //                foreach (RecaudacionDetalle rec in lrecaudacionDetalle)
    //                {
    //                    if (rec.ccomprobante != grupo.Key)
    //                    {
    //                        if (rec.numerodocumento.HasValue)
    //                        {
    //                            rec.conciliado = false;
    //                            ExtractoBancario eb = extractoFinal.Find(x => x.numerodocumentobancario == rec.numerodocumento.Value.ToString());
    //                            if (eb != null)
    //                            {
    //                                eb.conciliado = false;
    //                            }
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //        else
    //        {
    //            foreach (RecaudacionDetalle rec in lrecaudacionDetalle)
    //            {
    //                rec.conciliado = false;
    //                if (rec.numerodocumento.HasValue)
    //                {
    //                    ExtractoBancario eb = extractoFinal.Find(x => x.numerodocumentobancario == rec.numerodocumento.Value.ToString());
    //                    if (eb != null)
    //                    {
    //                        eb.conciliado = false;
    //                    }
    //                }
    //            }
    //        }
    //        // Quitar valores conciliados
    //        List<ConciliacionMayor> mayorFiltro = mayor.Where(x => x.mconciliado == false).ToList();
    //        List<ExtractoBancario> extractoFiltro = extractoFinal.Where(x => x.conciliado == false).ToList();
    //        List<RecaudacionDetalle> lrecaudacionDetalleFiltro = lrecaudacionDetalle.Where(x => x.conciliado == false).ToList();

    //        //List<ConciliacionMayor> mayorFiltro = mayor;
    //        //List<ExtractoBancario> extractoFiltro = extractoFinal;
    //        //List<RecaudacionDetalle> lrecaudacionDetalleFiltro = lrecaudacionDetalle;

    //        rqconsulta.Response["MAYOR"] = mayorFiltro;
    //        rqconsulta.Response["EXTRACTO"] = extractoFiltro;
    //        rqconsulta.Response["CASH"] = lrecaudacionDetalleFiltro;
    //        rqconsulta.Response["CONCILIACIONRESULTADO"] = lconciliautomatico;
    //    }

    //    private static List<ExtractoBancario> ValidarDebitoCredito(List<ExtractoBancario> extracto)
    //    {
    //        var unicoNumeroDocumento = extracto
    //        .GroupBy(x => x.numerodocumentobancario)
    //        .ToDictionary(g => g.Key);
    //        List<ExtractoBancario> extractoFinal = new List<ExtractoBancario>();
    //        if (unicoNumeroDocumento.Count > 0)
    //        {
    //            foreach (var grupo in unicoNumeroDocumento)
    //            {
    //                List<ExtractoBancario> filtroExtracto = extracto.Where(x => x.numerodocumentobancario == grupo.Key).ToList();
    //                var rows = (from row in filtroExtracto.AsEnumerable()
    //                            let valorDebito = row.valordebito
    //                            let valorCredito = row.valorcredito
    //                            let numeroDocumentoBancario = row.numerodocumentobancario
    //                            group row by new
    //                            {
    //                                numeroDocumentoBancario
    //                            }
    //                            into grp
    //                            select new
    //                            {
    //                                NumeroDocumentoBancario = grp.Key.numeroDocumentoBancario,
    //                                ValorDebito = grp.Sum(x => x.valordebito),
    //                                ValorCredito = grp.Sum(x => x.valorcredito),
    //                            }).ToList();
    //                if (rows[0].ValorCredito == rows[0].ValorDebito)
    //                {
    //                    ExtractoBancario filtroExtractoCredito = extracto.Where(x => x.numerodocumentobancario == grupo.Key && x.valorcredito != 0).SingleOrDefault();
    //                    extractoFinal.Add(filtroExtractoCredito);
    //                }
    //            }
    //        }
    //        return extractoFinal;
    //    }
    //}
}
