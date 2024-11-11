using contabilidad.datos;
using core.componente;
using dal.contabilidad;
using dal.contabilidad.conciliacionbancaria;
using dal.generales;
using dal.tesoreria;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;

namespace contabilidad.comp.consulta.conciliacionbancaria
{
    class ConciliacionBancariaCP : ComponenteConsulta
    {

        /// <summary>
        /// Obtiene la conciliación bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            if (!rqconsulta.Mdatos.ContainsKey("ccuenta") || !rqconsulta.Mdatos.ContainsKey("finicio") || !rqconsulta.Mdatos.ContainsKey("ffin"))
            {
                return;
            }
            string ccuenta = (string)rqconsulta.Mdatos["ccuenta"];
            tconbanco banco = TconBancoDal.Find(ccuenta);

            if (banco == null)
            {
                throw new AtlasException("CONTA-020", "ERROR: NO EXISTE LA CUENTA BANCARIA: ", ccuenta);
            }

            if (banco.nombre.Equals("Banco Pichincha") || banco.nombre.Contains("BCE"))
            {
                var respuesta = banco.nombre.Equals("Banco Pichincha") ? conciliarPichincha(rqconsulta) : conciliarBCE(rqconsulta);
                rqconsulta.Response["LIBROBANCOS"] = respuesta.llibromodulo;
                rqconsulta.Response["EXTRACTO"] = respuesta.extractoBancarioFiltro;
                rqconsulta.Response["AJUSTEEXTRACTO"] = respuesta.lextractoajuste;
                rqconsulta.Response["AJUSTELIBRO"] = respuesta.llibroajuste;
                rqconsulta.Response["CONCILIACIONRESULTADO"] = respuesta.lconciliacion;
                rqconsulta.Response["CONCILIACIONFINAL"] = respuesta.lconciliacion.Count() > 0 ? calculaResultadoConciliacion(respuesta.lconciliacion) : null;
                rqconsulta.Response["SALDOANTERIOR"] = saldoMesAnterior(rqconsulta, ccuenta);

                //RRO 20230131

            }
            else
            {
                throw new AtlasException("CONTA-020", "ERROR: NO SE PUEDE REALIZAR LA CONCILIACIÓN PARA LA CUENTA BANCARIA: ", ccuenta);
            }
        }

        #region BCO. PICHINCHA

        /// <summary>
        /// Conciliación Banco Pichincha
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// <returns></returns>
        public (List<ConciliacionMayor> llibromodulo, List<tconextractobancario> extractoBancarioFiltro, List<tconextractobancario> lextractoajuste, List<tconlibrobancos> llibroajuste, List<ConciliacionBancariaResultado> lconciliacion) conciliarPichincha(RqConsulta rqconsulta)
        {
            long contador = 1;
            List<ConciliacionBancariaResultado> lconciliacion = new List<ConciliacionBancariaResultado>();
            List<tconextractobancario> lextractoajuste = new List<tconextractobancario>();
            List<tconlibrobancos> llibroajuste = new List<tconlibrobancos>();
            string ccuenta = (string)rqconsulta.Mdatos["ccuenta"];
            tconbanco banco = TconBancoDal.Find(ccuenta);
            int finicio = Fecha.DateToInteger((DateTime)rqconsulta.Mdatos["finicio"]);
            int ffin = Fecha.DateToInteger((DateTime)rqconsulta.Mdatos["ffin"]);

            // Si es diferente de 0 conciliara los valores entre las columnas conciliaaux
            int conciliaEspecial = Convert.ToInt16(rqconsulta.Mdatos["especial"]);

            //-------------------------------------------------
            // TconLibroBancosDal.ActualizarComprobante(banco.ccuentabanco, finicio, ffin);
            //-------------------------------------------------

            List<tconextractobancario> extracto = tconconciliacionbancariaextDal.GetExtractoCP(banco.ccuentabanco, finicio, ffin);

            // ANT ------------------------------------------------------------------------------------

            List<tconlibrobancos> librobanco = TconLibroBancosDal.Find(banco.ccuentabanco, finicio, ffin);

            // Arreglo filtrado
            List<tconlibrobancos>[] arrLibroBanco = filtrarLbRecaudacionComprobante(librobanco, finicio, ffin, ccuenta, banco.ccuentabanco);

            // ANT fin------------------------------------------------------------------------------------


            librobanco = arrLibroBanco[0];


            #region 1. Concilia los registros de libro banco (cumplen filtrado) con extracto bancario - EQUIVALENTE

            var consultaLbExEquivalente = (from li in librobanco
                                           join ex in extracto
                                           on li.documento equals ex.documento
                                           where li.conciliado == false && !string.IsNullOrEmpty(li.documento) && !string.IsNullOrEmpty(ex.documento) && //!string.IsNullOrEmpty(li.ccomprobante) &&
                                           ((li.montocredito == ex.montodebito && li.montocredito > 0 && !string.IsNullOrEmpty(li.montocredito.ToString())) ||
                                           (li.montodebito == ex.montocredito && li.montodebito > 0 && !string.IsNullOrEmpty(li.montodebito.ToString())))
                                           select new { li, ex }).ToList();

            foreach (var item in consultaLbExEquivalente)
            {
                bool validaConcilRepite = false;
                for (int i = 0; i < lconciliacion.Count(); i++)
                {
                    if (lconciliacion[i].rcconconciliacionbancariaextracto == item.ex.cextractobancario)
                    {
                        validaConcilRepite = true;
                        break;
                    }
                }

                if (!validaConcilRepite)
                {

                    ConciliacionBancariaResultado conciliacion = new ConciliacionBancariaResultado();
                    tconlibrobancos nombremodulo = TconLibroBancosDal.FindModulo(item.li.clibrobanco, item.li.documento);
                    tgenmodulo modulo = TgenModuloDal.Find((int)nombremodulo.cmodulo);
                    conciliacion.rconciliacionbancariaid = contador;
                    conciliacion.rfcontable = item.li.fcontable;
                    conciliacion.rccomprobante = item.li.ccomprobante;
                    conciliacion.rclibrobanco = item.li.clibrobanco;
                    conciliacion.rcconconciliacionbancariaextracto = item.ex.cextractobancario;
                    conciliacion.rvalorcredito = item.li.montocredito == decimal.Parse("0.00") ? item.ex.montocredito : item.li.montocredito;
                    conciliacion.rvalordebito = item.li.montodebito == decimal.Parse("0.00") ? item.ex.montodebito : item.li.montodebito;

                    //  RRP 20220516 -------------------------------------------------------------------------------
                    conciliacion.rnumerodocumentobancario = item.ex.documento;
                    //  RRP 20220516 -------------------------------------------------------------------------------

                    conciliacion.rcuentabancaria = item.ex.ccuentabanco;
                    conciliacion.rcodigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
                    conciliacion.rautomatico = true;
                    conciliacion.rconciliado = true;

                    //libro
                    conciliacion.mfcontable = item.li.fcontable;
                    conciliacion.mccomprobante = item.li.ccomprobante;
                    conciliacion.mnumerodocumentobancario = item.li.documento;
                    conciliacion.mvalordebito = (decimal)item.li.montodebito;
                    conciliacion.mvalorcredito = (decimal)item.li.montocredito;
                    conciliacion.mmodulo = modulo.nombre;
                    conciliacion.mmayor = true;
                    // Extracto
                    conciliacion.fecha = item.ex.fmovimiento;
                    conciliacion.numerodocumentobancario = item.ex.documento;
                    conciliacion.valordebito = item.ex.montodebito;
                    conciliacion.valorcredito = item.ex.montocredito;
                    conciliacion.concepto = item.ex.concepto;
                    conciliacion.cuentabancaria = item.ex.ccuentabanco;
                    conciliacion.extracto = true;
                    item.li.conciliado = true;
                    item.ex.conciliado = true;
                    lconciliacion.Add(conciliacion);
                    tconconciliacionbancos conciliacionb = new tconconciliacionbancos();
                    contador = contador + 1;
                }
            }


            #endregion

            #region 2. Elimina valores conciliados 1ra. conciliacion

            List<tconlibrobancos> libroFiltro = librobanco.Where(x => x.conciliado == false && x.ajustelibro == false).ToList();
            List<tconextractobancario> extractoFiltro = extracto.Where(x => x.conciliado == false && x.ajusteextracto == false).ToList();

            #endregion

            #region 3. Concilia los registros de libro banco (restantes de las anteriores conciliaciones) con extracto bancario - AGRUPADO - n libro -a- 1 extracto
            librobanco = libroFiltro.Union(arrLibroBanco[1]).Cast<tconlibrobancos>().ToList();
            extracto = extractoFiltro;

            var consultaAgrupado = librobanco
            .Join(extracto, li => li.documento, ex => ex.documento, (li, ex) => new { li, ex })
            .GroupBy(x => new { x.li.documento })
            .Select(lg =>
                    new
                    {
                        documento = lg.Key,
                        numreg = lg.Count(),
                        lbmontodebito = lg.Sum(w => w.li.montodebito),
                        lbmontocredito = lg.Sum(w => w.li.montocredito),
                        exmontodebito = lg.Max(w => w.ex.montodebito),
                        exmontocredito = lg.Max(w => w.ex.montocredito),
                        equivale1 = lg.Sum(w => w.li.montodebito) == lg.Max(w => w.ex.montocredito),
                        equivale2 = lg.Sum(w => w.li.montocredito) == lg.Max(w => w.ex.montodebito),
                    }).Where(x => x.equivale1 == x.equivale2 && x.equivale1 == true);

            var currentIds2 = consultaAgrupado.Select(x => x.documento);

            consultaLbExEquivalente = (from li in librobanco.Where(r => currentIds2.Any(id => id.documento == r.documento))
                                       join ex in extracto
                                       on li.documento equals ex.documento
                                       where li.conciliado == false && !string.IsNullOrEmpty(li.documento) && !string.IsNullOrEmpty(ex.documento)
                                       select new { li, ex }).ToList();

            foreach (var item in consultaLbExEquivalente)
            {
                ConciliacionBancariaResultado conciliacion = new ConciliacionBancariaResultado();
                tconlibrobancos nombremodulo = TconLibroBancosDal.FindModulo(item.li.clibrobanco, item.li.documento);
                tgenmodulo modulo = TgenModuloDal.Find((int)nombremodulo.cmodulo);
                conciliacion.rconciliacionbancariaid = contador;
                conciliacion.rfcontable = item.li.fcontable;
                conciliacion.rccomprobante = item.li.ccomprobante;
                conciliacion.rclibrobanco = item.li.clibrobanco;
                conciliacion.rcconconciliacionbancariaextracto = item.ex.cextractobancario;
                conciliacion.rvalorcredito = item.li.montocredito == decimal.Parse("0.00") ? item.ex.montocredito : item.li.montocredito;
                conciliacion.rvalordebito = item.li.montodebito == decimal.Parse("0.00") ? item.ex.montodebito : item.li.montodebito;

                //  RRP 20220516 -------------------------------------------------------------------------------
                conciliacion.rnumerodocumentobancario = item.ex.documento;
                //  RRP 20220516 -------------------------------------------------------------------------------

                conciliacion.rcuentabancaria = item.ex.ccuentabanco;
                conciliacion.rcodigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
                conciliacion.rautomatico = true;
                conciliacion.rconciliado = true;

                //libro
                conciliacion.mfcontable = item.li.fcontable;
                conciliacion.mccomprobante = item.li.ccomprobante;
                conciliacion.mnumerodocumentobancario = item.li.documento;
                conciliacion.mvalordebito = (decimal)item.li.montodebito;
                conciliacion.mvalorcredito = (decimal)item.li.montocredito;
                conciliacion.mmodulo = modulo.nombre;
                conciliacion.mmayor = true;
                // Extracto
                conciliacion.fecha = item.ex.fmovimiento;
                conciliacion.numerodocumentobancario = item.ex.documento;
                conciliacion.valordebito = item.ex.montodebito;
                conciliacion.valorcredito = item.ex.montocredito;
                conciliacion.concepto = item.ex.concepto;
                conciliacion.cuentabancaria = item.ex.ccuentabanco;
                conciliacion.extracto = true;
                item.li.conciliado = true;
                item.ex.conciliado = true;
                lconciliacion.Add(conciliacion);
                tconconciliacionbancos conciliacionb = new tconconciliacionbancos();
                contador = contador + 1;
            }

            #endregion

            #region 4. Elimina valores conciliados 2da. conciliacion

            libroFiltro = libroFiltro.Union(librobanco.Where(x => x.conciliado == false && x.ajustelibro == false)).Cast<tconlibrobancos>().ToList();
            extractoFiltro = extracto.Where(x => x.conciliado == false && x.ajusteextracto == false).ToList();

            #endregion

            #region 5.Concilia los registros de libro banco (restantes de las anteriores conciliaciones) con extracto bancario - AGRUPADO - n libro -a- n extracto

            librobanco = libroFiltro;
            extracto = extractoFiltro.Where(x => x.conciliado == false && x.ajusteextracto == false).ToList();




            var libroAgrupado = librobanco
            .GroupBy(x => new { x.documento })
            .Select(lg =>
                    new
                    {
                        documento = lg.Key,
                        numreg = lg.Count(),
                        lbmontodebito = lg.Sum(w => w.montodebito),
                        lbmontocredito = lg.Sum(w => w.montocredito),
                    }).ToList();


            var extractoAgrupado = extracto
            .GroupBy(x => new { x.documento })
            .Select(lg =>
                    new
                    {
                        documento = lg.Key,
                        numreg = lg.Count(),
                        lbmontodebito = lg.Sum(w => w.montodebito),
                        lbmontocredito = lg.Sum(w => w.montocredito),
                    }).ToList();



            var consultaLbExEquivalente2 = libroAgrupado
            .Join(extractoAgrupado, li => li.documento.documento, ex => ex.documento.documento, (li, ex) => new { li, ex })
            .Where(x => (x.li.lbmontodebito == x.ex.lbmontocredito && x.li.lbmontodebito > 0) || (x.li.lbmontocredito == x.ex.lbmontodebito && x.li.lbmontocredito > 0))
            .Select(m => m.li.documento).ToList();


            var consultaLbExEquivalente2_zzz = libroAgrupado
            .Join(extractoAgrupado, li => li.documento.documento, ex => ex.documento.documento, (li, ex) => new { li, ex })
            .Where(x => (x.li.lbmontodebito == x.ex.lbmontocredito && x.li.lbmontodebito > 0) || (x.li.lbmontocredito == x.ex.lbmontodebito && x.li.lbmontocredito > 0))
            .Select(x => new { documento = x.li.documento.documento, combinacion = (x.li.lbmontodebito == x.ex.lbmontocredito) == true ? "lide_excr" : (x.li.lbmontocredito == x.ex.lbmontodebito) ? "licr_exde" : "" }).ToList();


            var documentosEx = extractoAgrupado.Where(x => x.numreg > 1).Select(x => x.documento).ToList();

            List<long> listaPrimerValorExtracto = new List<long>();
            foreach (var dup in documentosEx)
            {
                string combina = consultaLbExEquivalente2_zzz.Where(x => x.documento.ToString() == dup.documento).Select(x => x.combinacion).FirstOrDefault();

                if (combina == "lide_excr")
                {
                    if (extracto.Where(x => x.documento == dup.documento && x.montodebito > 0).Any())
                        listaPrimerValorExtracto.Add(extracto.Where(x => x.documento == dup.documento && x.montodebito > 0).FirstOrDefault().cextractobancario);
                }
                else if (combina == "licr_exde")
                {
                    if (extracto.Where(x => x.documento == dup.documento && x.montocredito > 0).Any())
                        listaPrimerValorExtracto.Add(extracto.Where(x => x.documento == dup.documento && x.montocredito > 0).FirstOrDefault().cextractobancario);
                }
                else
                {
                    if (extracto.Where(x => x.documento == dup.documento).Any())
                        listaPrimerValorExtracto.Add(extracto.Where(x => x.documento == dup.documento).FirstOrDefault().cextractobancario);
                }
                //   listaPrimerValorExtracto.Add(extracto.Where(x => x.documento == dup.documento).FirstOrDefault().cextractobancario);
            }

            consultaLbExEquivalente = (from li in librobanco.Where(r => consultaLbExEquivalente2.Any(id => id.documento == r.documento))
                                       join ex in extracto.Where(x => !listaPrimerValorExtracto.Contains(x.cextractobancario))
                                       on li.documento equals ex.documento
                                       where li.conciliado == false && !string.IsNullOrEmpty(li.documento) && !string.IsNullOrEmpty(ex.documento)
                                       select new { li, ex }).ToList();

            foreach (var item in consultaLbExEquivalente)
            {
                ConciliacionBancariaResultado conciliacion = new ConciliacionBancariaResultado();
                tconlibrobancos nombremodulo = TconLibroBancosDal.FindModulo(item.li.clibrobanco, item.li.documento);
                tgenmodulo modulo = TgenModuloDal.Find((int)nombremodulo.cmodulo);
                conciliacion.rconciliacionbancariaid = contador;
                conciliacion.rfcontable = item.li.fcontable;
                conciliacion.rccomprobante = item.li.ccomprobante;
                conciliacion.rclibrobanco = item.li.clibrobanco;

                conciliacion.rcconconciliacionbancariaextracto = item.ex.cextractobancario;
                conciliacion.rvalorcredito = item.li.montocredito == decimal.Parse("0.00") ? item.ex.montocredito : item.li.montocredito;
                conciliacion.rvalordebito = item.li.montodebito == decimal.Parse("0.00") ? item.ex.montodebito : item.li.montodebito;

                //  RRP 20220516 -------------------------------------------------------------------------------
                conciliacion.rnumerodocumentobancario = item.ex.documento;
                //  RRP 20220516 -------------------------------------------------------------------------------

                conciliacion.rcuentabancaria = item.ex.ccuentabanco;
                conciliacion.rcodigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
                conciliacion.rautomatico = true;
                conciliacion.rconciliado = true;

                //libro
                conciliacion.mfcontable = item.li.fcontable;
                conciliacion.mccomprobante = item.li.ccomprobante;
                conciliacion.mnumerodocumentobancario = item.li.documento;
                conciliacion.mvalordebito = (decimal)item.li.montodebito;
                conciliacion.mvalorcredito = (decimal)item.li.montocredito;
                conciliacion.mmodulo = modulo.nombre;
                conciliacion.mmayor = true;
                // Extracto
                conciliacion.fecha = item.ex.fmovimiento;
                conciliacion.numerodocumentobancario = item.ex.documento;
                conciliacion.valordebito = item.ex.montodebito;
                conciliacion.valorcredito = item.ex.montocredito;
                conciliacion.concepto = item.ex.concepto;
                conciliacion.cuentabancaria = item.ex.ccuentabanco;
                conciliacion.extracto = true;
                item.li.conciliado = true;
                item.ex.conciliado = true;
                lconciliacion.Add(conciliacion);
                tconconciliacionbancos conciliacionb = new tconconciliacionbancos();
                contador = contador + 1;
            }


            #endregion

            #region 6. Elimina valores conciliados 3ra. conciliacion
            List<tconlibrobancos> libroBancoFiltro = libroFiltro.Where(x => x.conciliado == false && x.ajustelibro == false).ToList();
            List<tconextractobancario> extractoBancarioFiltro = extractoFiltro.Where(x => x.conciliado == false && x.ajusteextracto == false).ToList();

            List<ConciliacionMayor> llibromodulo = new List<ConciliacionMayor>();
            foreach (tconlibrobancos libroBanco in libroBancoFiltro)
            {
                tconlibrobancos nombremodulo = TconLibroBancosDal.FindModulo(libroBanco.clibrobanco, libroBanco.documento);
                tgenmodulo modulo = TgenModuloDal.Find((int)nombremodulo.cmodulo);
                ConciliacionMayor li = new ConciliacionMayor();
                li.lclibrobanco = libroBanco.clibrobanco;
                li.ldocumento = libroBanco.documento;
                li.lccomprobante = libroBanco.ccomprobante;
                li.lfcontable = libroBanco.fcontable;
                li.lmontocredito = (decimal)libroBanco.montocredito;
                li.lmontodebito = (decimal)libroBanco.montodebito;
                li.lmodulo = modulo.nombre;
                llibromodulo.Add(li);
            }
            #endregion

            #region 7. excluye los comprobantes nulos de libro banco

            llibromodulo = (string)rqconsulta.Mdatos["nulo"] == "0" ? llibromodulo.Where(x => !string.IsNullOrEmpty(x.lccomprobante)).ToList() : llibromodulo;

            #endregion


            #region 1. Ajuste EX Ajuste por documento, si debito y credito tienen el mismo documento

            extracto = extractoBancarioFiltro;

            foreach (tconextractobancario credito in extracto)
            {
                int cont = 0;
                foreach (tconextractobancario debito in extracto)
                {

                    if ((credito.documento != null && debito.documento != null && credito.documento == debito.documento) && (credito.comprobante != null && debito.comprobante != null && credito.comprobante == debito.comprobante) &&
                    ((credito.montocredito != 0 && debito.montodebito != 0) || (credito.montodebito != 0 && debito.montocredito != 0) && (credito.montocredito == debito.montodebito || credito.montodebito == debito.montocredito) &&
                    credito.ajusteextracto == false && debito.ajusteextracto == false))
                    {
                        cont++;
                        debito.ajusteextracto = true;
                    }
                }
                if (cont > 0)
                {
                    tconextractobancario detalle = new tconextractobancario();
                    detalle.comprobante = credito.comprobante;
                    detalle.documento = credito.documento;
                    detalle.montocredito = credito.montocredito == decimal.Parse("0.00") ? credito.montodebito : credito.montocredito;
                    detalle.montodebito = credito.montodebito == decimal.Parse("0.00") ? credito.montocredito : credito.montodebito;
                    credito.ajusteextracto = true;
                    lextractoajuste.Add(detalle);
                }
                cont = 0;
            }

            IList<string> lbAjustadoEx = lextractoajuste.Select(x => x.documento).Cast<string>().ToList();
            extractoBancarioFiltro = extractoBancarioFiltro.Where(x => !lbAjustadoEx.Contains(x.documento)).ToList();
            extracto = extractoBancarioFiltro;

            #endregion


            #region 2. Ajuste LB, si debito y credito tiene mismo el mismo documento, para valores equivalentes y agrupados

            var listaAjusteLB = llibromodulo.Where(x => !string.IsNullOrEmpty(x.ldocumento)).GroupBy(l => l.ldocumento)
            .Select(lg =>
                 new
                 {
                     documento = lg.Key,
                     summontocredito = lg.Sum(w => w.lmontocredito),
                     summontodebito = lg.Sum(w => w.lmontodebito)
                 }).Where(y => y.summontocredito == y.summontodebito);

            foreach (var debito in listaAjusteLB)
            {
                tconlibrobancos detalle = new tconlibrobancos();
                detalle.ajustelibro = true;
                detalle.documento = debito.documento;
                detalle.montocredito = debito.summontocredito == decimal.Parse("0.00") ? debito.summontodebito : debito.summontocredito;
                detalle.montodebito = debito.summontodebito == decimal.Parse("0.00") ? debito.summontocredito : debito.summontodebito;
                llibroajuste.Add(detalle);
            }

            var filtroAjuste = listaAjusteLB.Select(x => x.documento);
            llibromodulo = llibromodulo.Where(x => !filtroAjuste.Contains(x.ldocumento)).ToList();

            #endregion


            #region 8. excluye los comprobantes nulos de libro banco 2da forma

            var excluyeSinConciliar = (from li in llibromodulo
                                       join con in lconciliacion
                                        on li.ldocumento equals con.numerodocumentobancario
                                       select new { li }).Where(x => x.li.lccomprobante == null)
                                       .Select(x => x.li.lclibrobanco).ToList();

            llibromodulo = llibromodulo.Where(x => !excluyeSinConciliar.Contains(x.lclibrobanco)).ToList();

            #endregion

            #region 9. SOLO CASOS ESPECIALES: concilia valores resagados pero cuyos totales son equivalentes LB = EX

            if (conciliaEspecial == 1)
            {
                decimal? totalLBcredito = 0;
                decimal? totalLBdebito = 0;
                decimal? totalEXcredito = 0;
                decimal? totalEXdebito = 0;
                decimal? totalLB = 0;
                decimal? totalEX = 0;

                string comprobanteLB = string.Empty;

                foreach (var li in llibromodulo)
                {
                    totalLBcredito += li.lmontocredito;
                    totalLBdebito += li.lmontodebito;
                    comprobanteLB += li.lccomprobante + "-";
                }

                comprobanteLB = comprobanteLB.Remove(comprobanteLB.Length - 1);

                foreach (var ex in extractoBancarioFiltro)
                {
                    totalEXcredito += ex.montocredito;
                    totalEXdebito += ex.montodebito;
                }

                if ((totalLBcredito + totalLBdebito) == (totalEXcredito + totalEXdebito))
                {
                    foreach (var li in llibromodulo)
                    {
                        li.conciliaaux = comprobanteLB;
                        li.conciliado = true;

                        foreach (var s in librobanco.Where(w => w.clibrobanco == li.lclibrobanco))
                        {
                            s.conciliaaux = comprobanteLB;
                            s.conciliado = true;
                        }

                        TconLibroBancosDal.ActualizarCampoAxiliar(li.lclibrobanco, comprobanteLB);
                    }

                    foreach (var ex in extractoBancarioFiltro)
                    {
                        ex.conciliaaux = comprobanteLB;
                        ex.conciliado = true;

                        foreach (var s in extracto.Where(w => w.cextractobancario == ex.cextractobancario))
                        {
                            s.conciliaaux = comprobanteLB;
                            s.conciliado = true;
                        }

                        TconExtractoBancarioDal.ActualizarCampoAxiliar(ex.cextractobancario, comprobanteLB);
                    }

                    consultaLbExEquivalente = (from li in librobanco.Where(x => x.conciliaaux == comprobanteLB)
                                               join ex in extracto.Where(x => x.conciliaaux == comprobanteLB)
                                               on li.conciliaaux equals ex.conciliaaux
                                               where li.conciliado == true
                                               select new { li, ex }).ToList();

                    foreach (var item in consultaLbExEquivalente)
                    {
                        ConciliacionBancariaResultado conciliacion = new ConciliacionBancariaResultado();
                        tconlibrobancos nombremodulo = TconLibroBancosDal.FindModulo(item.li.clibrobanco, item.li.documento);
                        tgenmodulo modulo = TgenModuloDal.Find((int)nombremodulo.cmodulo);
                        conciliacion.rconciliacionbancariaid = contador;
                        conciliacion.rfcontable = item.li.fcontable;
                        conciliacion.rccomprobante = item.li.ccomprobante;
                        conciliacion.rclibrobanco = item.li.clibrobanco;
                        conciliacion.rcconconciliacionbancariaextracto = item.ex.cextractobancario;
                        conciliacion.rvalorcredito = item.li.montocredito == decimal.Parse("0.00") ? item.ex.montocredito : item.li.montocredito;
                        conciliacion.rvalordebito = item.li.montodebito == decimal.Parse("0.00") ? item.ex.montodebito : item.li.montodebito;

                        //  RRP 20220516 -------------------------------------------------------------------------------
                        conciliacion.rnumerodocumentobancario = item.ex.documento;
                        //  RRP 20220516 -------------------------------------------------------------------------------

                        conciliacion.rcuentabancaria = item.ex.ccuentabanco;
                        conciliacion.rcodigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
                        conciliacion.rautomatico = true;
                        conciliacion.rconciliado = true;

                        //libro
                        conciliacion.mfcontable = item.li.fcontable;
                        conciliacion.mccomprobante = item.li.ccomprobante;
                        conciliacion.mnumerodocumentobancario = item.li.documento;
                        conciliacion.mvalordebito = (decimal)item.li.montodebito;
                        conciliacion.mvalorcredito = (decimal)item.li.montocredito;
                        conciliacion.mmodulo = modulo.nombre;
                        conciliacion.mmayor = true;
                        // Extracto
                        conciliacion.fecha = item.ex.fmovimiento;
                        conciliacion.numerodocumentobancario = item.ex.documento;
                        conciliacion.valordebito = item.ex.montodebito;
                        conciliacion.valorcredito = item.ex.montocredito;
                        conciliacion.concepto = item.ex.concepto;
                        conciliacion.cuentabancaria = item.ex.ccuentabanco;
                        conciliacion.extracto = true;
                        item.li.conciliado = true;
                        item.ex.conciliado = true;
                        lconciliacion.Add(conciliacion);
                        tconconciliacionbancos conciliacionb = new tconconciliacionbancos();
                        contador = contador + 1;
                    }

                    llibromodulo = llibromodulo.Where(x => x.conciliado == false).Cast<ConciliacionMayor>().ToList(); ;
                    extractoBancarioFiltro = extractoBancarioFiltro.Where(x => x.conciliado == false).Cast<tconextractobancario>().ToList();
                }
            }
            #endregion

            #region 10. excluye los registros de librobanco, a los cuales se les asigno comprobante en el paso: filtrarLbRecaudacionComprobante

            //var lbFiltroComprobante = (from li in llibromodulo
            //                           join li2 in librobanco
            //                            on li.lclibrobanco equals li2.clibrobanco
            //                           select new { li, li2 }).Where(x => x.li2.cambioComprobante == false).Select(x => x.li.lclibrobanco).ToList();

            //llibromodulo = llibromodulo.Where(x => lbFiltroComprobante.Contains(x.lclibrobanco)).ToList();

            #endregion

            return (llibromodulo, extractoBancarioFiltro, lextractoajuste, llibroajuste, lconciliacion);
        }

        #endregion

        #region BANCO CENTRAL

        public (List<ConciliacionMayor> llibromodulo, List<tconextractobancario> extractoBancarioFiltro, List<tconextractobancario> lextractoajuste, List<tconlibrobancos> llibroajuste, List<ConciliacionBancariaResultado> lconciliacion) conciliarBCE(RqConsulta rqconsulta)
        {
            long contador = 1;
            List<long> idConciliados = new List<long>();
            List<ConciliacionBancariaResultado> lconciliacion = new List<ConciliacionBancariaResultado>();
            List<tconextractobancario> lextractoajuste = new List<tconextractobancario>();
            List<tconlibrobancos> llibroajuste = new List<tconlibrobancos>();
            string ccuenta = (string)rqconsulta.Mdatos["ccuenta"];
            tconbanco banco = TconBancoDal.Find(ccuenta);
            int finicio = Fecha.DateToInteger((DateTime)rqconsulta.Mdatos["finicio"]);
            int ffin = Fecha.DateToInteger((DateTime)rqconsulta.Mdatos["ffin"]);

            List<tconlibrobancos> librobanco = TconLibroBancosDal.Find(banco.ccuentabanco, finicio, ffin);

            List<tconextractobancario> extracto = tconconciliacionbancariaextDal.GetExtractoCP(banco.ccuentabanco, finicio, ffin);


            // Arreglo filtrado
            List<tconlibrobancos>[] arrLibroBanco = filtrarLbRecaudacionComprobante(librobanco, finicio, ffin, ccuenta);

            librobanco = arrLibroBanco[0].ToList().Union(arrLibroBanco[1].ToList()).OrderBy(x => x.ccomprobante).Cast<tconlibrobancos>().ToList();

            #region 1. Ajuste EX Ajuste por documento, si debito y credito tienen el mismo documento

            foreach (tconextractobancario credito in extracto)
            {
                if (credito.documento == "18234434")
                {
                    int x = 0;


                }


                int cont = 0;
                foreach (tconextractobancario debito in extracto)
                {
                    if (debito.documento == "18234434")
                    {
                        int x = 0;


                    }






                    if (
                        (credito.documento != null && debito.documento != null && credito.documento == debito.documento) &&
                        (credito.comprobante != null && debito.comprobante != null && credito.comprobante == debito.comprobante) &&
                        ((credito.montocredito == debito.montodebito && credito.montocredito != 0 && debito.montodebito != 0) ||
                        (debito.montocredito == credito.montodebito && debito.montocredito != 0 && credito.montodebito != 0))
                        && (credito.ajusteextracto == false && debito.ajusteextracto == false)
                        )
                    {
                        cont++;
                        debito.ajusteextracto = true;
                    }




                }
                if (cont > 0)
                {
                    tconextractobancario detalle = new tconextractobancario();
                    detalle.cextractobancario = credito.cextractobancario;
                    detalle.comprobante = credito.comprobante;
                    detalle.documento = credito.documento;
                    detalle.montocredito = credito.montocredito == decimal.Parse("0.00") ? credito.montodebito : credito.montocredito;
                    detalle.montodebito = credito.montodebito == decimal.Parse("0.00") ? credito.montocredito : credito.montodebito;
                    credito.ajusteextracto = true;
                    lextractoajuste.Add(detalle);
                }
                cont = 0;
            }

            #endregion

            #region 2. Ajuste LB, si debito y credito tiene mismo el mismo documento, para valores equivalentes y agrupados

            List<long> listaAjusteLBequivalente = new List<long>();
            bool valida;
            foreach (var l1 in librobanco)
            {
                valida = true;
                foreach (var l2 in librobanco)
                {
                    if (valida && l1.documento == l2.documento && !string.IsNullOrEmpty(l1.documento) && (l1.montocredito == l2.montodebito && l1.montocredito > 0))
                    {
                        listaAjusteLBequivalente.Add(l1.clibrobanco);
                        listaAjusteLBequivalente.Add(l2.clibrobanco);
                        valida = false;
                    }
                }
            }

            var listaAjusteLBagrupa = librobanco.Where(x => !listaAjusteLBequivalente.Contains(x.clibrobanco));
            var listaAjusteLibroBanco = listaAjusteLBagrupa.Where(x => !string.IsNullOrEmpty(x.documento)).GroupBy(l => l.documento)
           .Select(lg =>
                 new
                 {
                     documento = lg.Key,
                     registros = lg.Count(),
                     summontocredito = lg.Sum(w => w.montocredito),
                     summontodebito = lg.Sum(w => w.montodebito)
                 }).Where(y => y.summontocredito == y.summontodebito).ToList();

            var listaAjuste1 = librobanco.Where(x => listaAjusteLibroBanco.Any(y => y.documento.Equals(x.documento)));
            var listaAjuste2 = librobanco.Where(x => listaAjusteLBequivalente.Contains(x.clibrobanco));
            var listAjuste = listaAjuste1.Union(listaAjuste2);

            foreach (tconlibrobancos debito in listAjuste)
            {
                tconlibrobancos detalle = new tconlibrobancos();
                debito.ajustelibro = true;
                //---------------------------------
                // 05102022
                detalle.ajustelibro = true;
                //---------------------------------
                detalle.clibrobanco = debito.clibrobanco; //------
                detalle.documento = debito.documento;
                detalle.montocredito = debito.montocredito == decimal.Parse("0.00") ? debito.montodebito : debito.montocredito;
                detalle.montodebito = debito.montodebito == decimal.Parse("0.00") ? debito.montocredito : debito.montodebito;
                llibroajuste.Add(detalle);
            }

            // elimina los repetidos 
            llibroajuste = (from c in llibroajuste
                            group c by new
                            {
                                c.documento,
                                c.montocredito,
                                c.montodebito
                            } into grp
                            select grp.First()).OrderBy(x => x.documento).ToList();

            #endregion

            #region 3. Excluye los ajustes del extracto

            // 05102022 - filtro de ajustes por documento
            IList<string> lbAjustado = llibroajuste.Select(x => x.documento).Cast<string>().ToList();
            librobanco = librobanco.Where(x => !lbAjustado.Contains(x.documento)).ToList();


            //List<tconlibrobancos> lajlibro = llibroajuste.Where(x => x.conciliado == false && x.ajustelibro == false).ToList();
            //List<tconextractobancario> lajextracto = lextractoajuste.Where(x => x.conciliado == false && x.ajusteextracto == false).ToList();

            #endregion

            #region 4. Excluye los valores conciliados 1ra. vez




            List<tconlibrobancos> libroFiltro = librobanco.Where(x => x.conciliado == false && x.ajustelibro == false).ToList();
            List<tconextractobancario> extractoFiltro = extracto.Where(x => x.conciliado == false && x.ajusteextracto == false).ToList();

            #endregion 

            #region 5. Concilia todos los registros excepto Tesoreria

            var consultaLbExEquivalente = (from li in librobanco
                                           join ex in extracto
                                           on li.documento equals ex.comprobante
                                           where li.conciliado == false && !string.IsNullOrEmpty(li.documento) && !string.IsNullOrEmpty(ex.comprobante) && li.cmodulo != 15 &&
                                           ((li.montocredito == ex.montodebito && li.montocredito > 0 && !string.IsNullOrEmpty(li.montocredito.ToString())) || (li.montodebito == ex.montocredito && li.montodebito > 0 && !string.IsNullOrEmpty(li.montodebito.ToString())))
                                           select new { li, ex }).ToList();

            foreach (var item in consultaLbExEquivalente)
            {
                bool validaConcilRepite = false;
                for (int i = 0; i < lconciliacion.Count(); i++)
                {
                    if (lconciliacion[i].rcconconciliacionbancariaextracto == item.ex.cextractobancario)
                    {
                        validaConcilRepite = true;
                        break;
                    }
                }

                if (!validaConcilRepite)
                {
                    ConciliacionBancariaResultado conciliacion = new ConciliacionBancariaResultado();
                    tconlibrobancos nombremodulo = TconLibroBancosDal.FindModulo(item.li.clibrobanco, item.li.documento);
                    tgenmodulo modulo = TgenModuloDal.Find((int)nombremodulo.cmodulo);
                    conciliacion.rconciliacionbancariaid = contador;
                    conciliacion.rfcontable = item.li.fcontable;
                    conciliacion.rccomprobante = item.li.ccomprobante;
                    conciliacion.rclibrobanco = item.li.clibrobanco;
                    conciliacion.rcconconciliacionbancariaextracto = item.ex.cextractobancario;
                    conciliacion.rvalorcredito = item.li.montocredito == decimal.Parse("0.00") ? item.ex.montocredito : item.li.montocredito;
                    conciliacion.rvalordebito = item.li.montodebito == decimal.Parse("0.00") ? item.ex.montodebito : item.li.montodebito;

                    //  RRP 20220516 -------------------------------------------------------------------------------
                    conciliacion.rnumerodocumentobancario = item.ex.documento;
                    //  RRP 20220516 -------------------------------------------------------------------------------

                    conciliacion.rcuentabancaria = item.ex.ccuentabanco;
                    conciliacion.rcodigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
                    conciliacion.rautomatico = true;
                    conciliacion.rconciliado = true;

                    //libro
                    conciliacion.mfcontable = item.li.fcontable;
                    conciliacion.mccomprobante = item.li.ccomprobante;
                    conciliacion.mnumerodocumentobancario = item.li.documento;
                    conciliacion.mvalordebito = (decimal)item.li.montodebito;
                    conciliacion.mvalorcredito = (decimal)item.li.montocredito;
                    conciliacion.mmodulo = modulo.nombre;
                    conciliacion.mmayor = true;
                    // Extracto
                    conciliacion.fecha = item.ex.fmovimiento;
                    conciliacion.numerodocumentobancario = item.ex.documento;
                    conciliacion.valordebito = item.ex.montodebito;
                    conciliacion.valorcredito = item.ex.montocredito;
                    conciliacion.concepto = item.ex.concepto;
                    conciliacion.cuentabancaria = item.ex.ccuentabanco;
                    conciliacion.extracto = true;
                    item.li.conciliado = true;
                    item.ex.conciliado = true;
                    lconciliacion.Add(conciliacion);

                    // RRP 27072022 ------------------------------
                    idConciliados.Add(item.ex.cextractobancario);
                    // RRP 27072022 ------------------------------

                    tconconciliacionbancos conciliacionb = new tconconciliacionbancos();
                    contador = contador + 1;
                }
            }

            #endregion

            #region 6. Excluye los valores conciliados 2da. vez

            List<tconlibrobancos> libroBancoFiltro1 = libroFiltro.Where(x => x.conciliado == false && x.ajustelibro == false).ToList();
            List<tconextractobancario> extractoBancarioFiltro1 = extractoFiltro.Where(x => x.conciliado == false && x.ajusteextracto == false).ToList();

            #endregion

            #region 7. Concilia todos los registros de Tesoreria

            consultaLbExEquivalente = (from li in libroBancoFiltro1
                                       join ex in extractoBancarioFiltro1
                                           on li.documento equals ex.documento
                                       where li.conciliado == false && !string.IsNullOrEmpty(li.documento) && !string.IsNullOrEmpty(ex.documento) && li.cmodulo == 15 &&
                                       ((li.montocredito == ex.montodebito && li.montocredito > 0 && !string.IsNullOrEmpty(li.montocredito.ToString())) || (li.montodebito == ex.montocredito && li.montodebito > 0 && !string.IsNullOrEmpty(li.montodebito.ToString())))
                                       select new { li, ex }).ToList();

            foreach (var item in consultaLbExEquivalente)
            {
                bool validaConcilRepite = false;
                for (int i = 0; i < lconciliacion.Count(); i++)
                {
                    if (lconciliacion[i].rcconconciliacionbancariaextracto == item.ex.cextractobancario)
                    {
                        validaConcilRepite = true;
                        break;
                    }
                }

                if (!validaConcilRepite)
                {
                    ConciliacionBancariaResultado conciliacion = new ConciliacionBancariaResultado();
                    tconlibrobancos nombremodulo = TconLibroBancosDal.FindModulo(item.li.clibrobanco, item.li.documento);
                    tgenmodulo modulo = TgenModuloDal.Find((int)nombremodulo.cmodulo);
                    conciliacion.rconciliacionbancariaid = contador;
                    conciliacion.rfcontable = item.li.fcontable;
                    conciliacion.rccomprobante = item.li.ccomprobante;
                    conciliacion.rclibrobanco = item.li.clibrobanco;
                    conciliacion.rcconconciliacionbancariaextracto = item.ex.cextractobancario;
                    conciliacion.rvalorcredito = item.li.montocredito == decimal.Parse("0.00") ? item.ex.montocredito : item.li.montocredito;
                    conciliacion.rvalordebito = item.li.montodebito == decimal.Parse("0.00") ? item.ex.montodebito : item.li.montodebito;

                    //  RRP 20220516 -------------------------------------------------------------------------------
                    conciliacion.rnumerodocumentobancario = item.ex.documento;
                    //  RRP 20220516 -------------------------------------------------------------------------------

                    conciliacion.rcuentabancaria = item.ex.ccuentabanco;
                    conciliacion.rcodigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
                    conciliacion.rautomatico = true;
                    conciliacion.rconciliado = true;

                    //libro
                    conciliacion.mfcontable = item.li.fcontable;
                    conciliacion.mccomprobante = item.li.ccomprobante;
                    conciliacion.mnumerodocumentobancario = item.li.documento;
                    conciliacion.mvalordebito = (decimal)item.li.montodebito;
                    conciliacion.mvalorcredito = (decimal)item.li.montocredito;
                    conciliacion.mmodulo = modulo.nombre;
                    conciliacion.mmayor = true;
                    // Extracto
                    conciliacion.fecha = item.ex.fmovimiento;
                    conciliacion.numerodocumentobancario = item.ex.documento;
                    conciliacion.valordebito = item.ex.montodebito;
                    conciliacion.valorcredito = item.ex.montocredito;
                    conciliacion.concepto = item.ex.concepto;
                    conciliacion.cuentabancaria = item.ex.ccuentabanco;
                    conciliacion.extracto = true;
                    item.li.conciliado = true;
                    item.ex.conciliado = true;
                    lconciliacion.Add(conciliacion);

                    // RRP 27072022 ------------------------------
                    idConciliados.Add(item.ex.cextractobancario);
                    // RRP 27072022 ------------------------------

                    tconconciliacionbancos conciliacionb = new tconconciliacionbancos();
                    contador = contador + 1;
                }
            }

            #endregion

            #region 8. Elimina los valores conciliados 3ra. vez

            librobanco = libroFiltro.Where(x => x.conciliado == false && x.ajustelibro == false).ToList();
            extracto = extractoFiltro.Where(x => x.conciliado == false && x.ajusteextracto == false).ToList();

            #endregion

            #region 9. Concilia los registros de libro banco (restantes de las anteriores conciliaciones) con extracto bancario - AGRUPADO - n libro -a- n extracto


            var libroAgrupado = librobanco
            .GroupBy(x => new { x.documento })
            .Select(lg =>
                    new
                    {
                        documento = lg.Key,
                        numreg = lg.Count(),
                        lbmontodebito = lg.Sum(w => w.montodebito),
                        lbmontocredito = lg.Sum(w => w.montocredito),
                    }).ToList();


            var extractoAgrupado = extracto
            .GroupBy(x => new { x.documento })
            .Select(lg =>
                    new
                    {
                        documento = lg.Key,
                        numreg = lg.Count(),
                        lbmontodebito = lg.Sum(w => w.montodebito),
                        lbmontocredito = lg.Sum(w => w.montocredito),
                    }).ToList();


            var consultaLbExEquivalente2 = libroAgrupado
            .Join(extractoAgrupado, li => li.documento.documento, ex => ex.documento.documento, (li, ex) => new { li, ex })
            .Where(x => x.li.lbmontodebito - x.li.lbmontocredito == x.ex.lbmontocredito - x.ex.lbmontodebito)
            .Select(m => m.li.documento).ToList();

            consultaLbExEquivalente = (from li in librobanco.Where(r => consultaLbExEquivalente2.Any(id => id.documento == r.documento))
                                       join ex in extracto
                                       on li.documento equals ex.documento
                                       where li.conciliado == false && !string.IsNullOrEmpty(li.documento) && !string.IsNullOrEmpty(ex.documento)
                                       select new { li, ex }).ToList();

            foreach (var item in consultaLbExEquivalente)
            {
                ConciliacionBancariaResultado conciliacion = new ConciliacionBancariaResultado();
                tconlibrobancos nombremodulo = TconLibroBancosDal.FindModulo(item.li.clibrobanco, item.li.documento);
                tgenmodulo modulo = TgenModuloDal.Find((int)nombremodulo.cmodulo);
                conciliacion.rconciliacionbancariaid = contador;
                conciliacion.rfcontable = item.li.fcontable;
                conciliacion.rccomprobante = item.li.ccomprobante;
                conciliacion.rclibrobanco = item.li.clibrobanco;
                conciliacion.rcconconciliacionbancariaextracto = item.ex.cextractobancario;
                conciliacion.rvalorcredito = item.li.montocredito == decimal.Parse("0.00") ? item.ex.montocredito : item.li.montocredito;
                conciliacion.rvalordebito = item.li.montodebito == decimal.Parse("0.00") ? item.ex.montodebito : item.li.montodebito;

                //  RRP 20220516 -------------------------------------------------------------------------------
                conciliacion.rnumerodocumentobancario = item.ex.documento;
                //  RRP 20220516 -------------------------------------------------------------------------------

                conciliacion.rcuentabancaria = item.ex.ccuentabanco;
                conciliacion.rcodigounico = Convert.ToInt64(string.Format("{0}", DateTime.Now.ToString("ddMMyyyyHHmmss"))); ;
                conciliacion.rautomatico = true;
                conciliacion.rconciliado = true;

                //libro
                conciliacion.mfcontable = item.li.fcontable;
                conciliacion.mccomprobante = item.li.ccomprobante;
                conciliacion.mnumerodocumentobancario = item.li.documento;
                conciliacion.mvalordebito = (decimal)item.li.montodebito;
                conciliacion.mvalorcredito = (decimal)item.li.montocredito;
                conciliacion.mmodulo = modulo.nombre;
                conciliacion.mmayor = true;
                // Extracto
                conciliacion.fecha = item.ex.fmovimiento;
                conciliacion.numerodocumentobancario = item.ex.documento;
                conciliacion.valordebito = item.ex.montodebito;
                conciliacion.valorcredito = item.ex.montocredito;
                conciliacion.concepto = item.ex.concepto;
                conciliacion.cuentabancaria = item.ex.ccuentabanco;
                conciliacion.extracto = true;
                item.li.conciliado = true;
                item.ex.conciliado = true;
                lconciliacion.Add(conciliacion);

                // RRP 27072022 ------------------------------
                idConciliados.Add(item.ex.cextractobancario);
                // RRP 27072022 ------------------------------

                tconconciliacionbancos conciliacionb = new tconconciliacionbancos();
                contador = contador + 1;
            }


            #endregion

            #region 10. Elimina valores conciliados 3ra. conciliacion

            List<tconlibrobancos> libroBancoFiltro = libroFiltro.Where(x => x.conciliado == false && x.ajustelibro == false).ToList();
            List<tconextractobancario> extractoBancarioFiltro = extractoFiltro.Where(x => x.conciliado == false && x.ajusteextracto == false).ToList();

            List<ConciliacionMayor> llibromodulo = new List<ConciliacionMayor>();
            foreach (tconlibrobancos libroBanco in libroBancoFiltro)
            {
                tconlibrobancos nombremodulo = TconLibroBancosDal.FindModulo(libroBanco.clibrobanco, libroBanco.documento);
                tgenmodulo modulo = TgenModuloDal.Find((int)nombremodulo.cmodulo);
                ConciliacionMayor li = new ConciliacionMayor();
                li.lclibrobanco = libroBanco.clibrobanco;
                li.ldocumento = libroBanco.documento;
                li.lccomprobante = libroBanco.ccomprobante;
                li.lfcontable = libroBanco.fcontable;
                li.lmontocredito = (decimal)libroBanco.montocredito;
                li.lmontodebito = (decimal)libroBanco.montodebito;
                li.lmodulo = modulo.nombre;
                llibromodulo.Add(li);
            }

            #endregion


            var agrupaDocumento = extracto.GroupBy(l => l.documento)
                         .Select(lg =>
                               new {
                                   documento = lg.Key,
                                   montocredito = lg.Sum(w => w.montocredito),
                                   montodebito = lg.Sum(w => w.montodebito)
                               });

            foreach (var item in agrupaDocumento)
            {
                if (item.montocredito == item.montodebito)
                {
                    foreach (var ex in extractoBancarioFiltro.Where(x => x.documento == item.documento))
                    {

                        ex.ajusteextracto = true;

                    }

                    tconextractobancario detalle = new tconextractobancario();
                    detalle.documento = item.documento;
                    detalle.montocredito = item.montocredito == decimal.Parse("0.00") ? decimal.Parse("0.00") : item.montocredito;
                    detalle.montodebito = item.montodebito == decimal.Parse("0.00") ? decimal.Parse("0.00") : item.montodebito;
                    lextractoajuste.Add(detalle);

                }
            }


            extractoBancarioFiltro = extractoBancarioFiltro.Where(x => !lextractoajuste.Select(z => z.documento).Contains(x.documento)).ToList();


            #region 11. excluye los comprobantes nulos de libro banco

            llibromodulo = (string)rqconsulta.Mdatos["nulo"] == "0" ? llibromodulo.Where(x => !string.IsNullOrEmpty(x.lccomprobante)).ToList() : llibromodulo;

            #endregion

            return (llibromodulo, extractoBancarioFiltro, lextractoajuste, llibroajuste, lconciliacion);
        }

        #endregion


        private decimal saldoMesAnterior(RqConsulta rqconsulta, string ccuenta)
        {
            try
            {
                string storeprocedure = "sp_ConRptLibroMayor";
                Dictionary<string, object> parametros = new Dictionary<string, object>();
                parametros["@cuenta"] = ccuenta;
                parametros["@finicio"] = ((DateTime)rqconsulta.Mdatos["finicio"]);
                parametros["@ffin"] = ((DateTime)rqconsulta.Mdatos["ffin"]);
                DataTable dtLibroMayor = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros, 0);
                decimal valor = 0;
                for (int i = 0; i < dtLibroMayor.Rows.Count; i++)
                {
                    if (dtLibroMayor.Rows[i]["secuencia"].ToString() == "0")
                    {
                        valor = Convert.ToDecimal(dtLibroMayor.Rows[i]["saldo"]);
                    }
                }
                return valor;
            }
            catch
            {
                return 0;
            }
        }


        private List<tconlibrobancos>[] filtrarLibroBanco(string ccuenta, int finicio, int ffin)
        {
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cuentabanco"] = ccuenta;
            parametros["@finicio"] = finicio;
            parametros["@ffin"] = ffin;
            parametros["@cumple"] = "1";
            DataTable dtLibroBanco = dal.storeprocedure.StoreProcedureDal.GetDataTable("sp_conciliacion_filtroinicial", parametros);

            List<tconlibrobancos> librobanco = new List<tconlibrobancos>();

            foreach (DataRow row in dtLibroBanco.Rows)
            {
                tconlibrobancos li = new tconlibrobancos();
                li.clibrobanco = Convert.ToInt32(row["clibrobanco"]);
                li.cuentabanco = row["cuentabanco"].ToString();

                if (!string.IsNullOrEmpty(row["freal"].ToString()))
                    li.freal = Convert.ToDateTime(row["freal"]);

                if (!string.IsNullOrEmpty(row["fcontable"].ToString()))
                    li.fcontable = Convert.ToInt32(row["fcontable"]);

                if (!string.IsNullOrEmpty(row["ccomprobante"].ToString()))
                    li.ccomprobante = row["ccomprobante"].ToString();

                li.cmodulo = Convert.ToInt16(row["cmodulo"]);
                li.ctransaccion = Convert.ToInt16(row["ctransaccion"]);

                if (!string.IsNullOrEmpty(row["montodebito"].ToString()))
                    li.montodebito = Convert.ToDecimal(row["montodebito"]);

                if (!string.IsNullOrEmpty(row["montocredito"].ToString()))
                    li.montocredito = Convert.ToDecimal(row["montocredito"]);

                if (!string.IsNullOrEmpty(row["documento"].ToString()))
                    li.documento = row["documento"].ToString();

                li.conciliado = Convert.ToBoolean(li.conciliado);

                if (!string.IsNullOrEmpty(row["cusuariomod"].ToString()))
                    li.cusuariomod = row["cusuariomod"].ToString();

                if (!string.IsNullOrEmpty(row["fmodificacion"].ToString()))
                    li.fmodificacion = Convert.ToDateTime(row["fmodificacion"]);

                li.ajustelibro = Convert.ToBoolean(li.ajustelibro);

                if (!string.IsNullOrEmpty(row["conciliaaux"].ToString()))
                    li.conciliaaux = row["conciliaaux"].ToString();

                if (!string.IsNullOrEmpty(row["documentohist"].ToString()))
                    li.documentohist = row["documentohist"].ToString();

                li.cambioComprobante = Convert.ToBoolean(li.cambioComprobante);

                librobanco.Add(li);
            }

            List<tconlibrobancos>[] arrListaLb = new List<tconlibrobancos>[3];
            List<tconlibrobancos> librobancoNC = TconLibroBancosDal.Find(ccuenta, finicio, ffin).Where(li => !librobanco.Select(x => x.clibrobanco).ToList().Contains(li.clibrobanco)).Cast<tconlibrobancos>().ToList(); ;
            arrListaLb[0] = librobanco;
            arrListaLb[1] = new List<tconlibrobancos>();
            arrListaLb[2] = librobancoNC;
            return arrListaLb;
        }


        /// <summary>
        /// Obtiene un arreglo de libro banco:
        /// 1. Un filtrado con los que cumplen: filtrado con recaudacion y filtrad por comprobante
        /// 2. Un filtrado con los que NO cumplen con el primero
        /// </summary>
        /// <param name="librobanco"></param>
        /// <param name="finicio"></param>
        /// <param name="ffin"></param>
        /// <returns></returns>
        private List<tconlibrobancos>[] filtrarLbRecaudacionComprobante_ANT(List<tconlibrobancos> librobanco, int finicio, int ffin, string ccuenta, string bancoccuentabanco = "")
        {

            //  librobanco = librobanco.Where(x => x.documento == "79394834").ToList();

            List<tconlibrobancos> librobancoTmp = librobanco.Where(x => !string.IsNullOrEmpty(x.cusuariomod) && string.IsNullOrEmpty(x.documentohist)).Cast<tconlibrobancos>().ToList();

            /*
            select *
from tconlibrobancos li where li.cusuariomod is not null
and li.cuentabanco = '2100163246' and li.fcontable >= '20221001' and li.fcontable <= '20221031'  and documentohist is null
*/


            List<ttesrecaudaciondetalle> filtroRecaudacion = TtesRecaudacionDetalleDal.FindTtesrecaudaciondetalleRango(finicio, ffin);

            //------------------------------------------------------------------

            //   todos los 15 -51 que no este en recaudacion detalle se excluyen

            //------------------------------------------------------------------

            var filtroLibroBancoRecaudacion = (from li in librobanco
                                               join rec in filtroRecaudacion
                                               on li.fcontable equals rec.fcontable
                                               where
                                                 //(li.documento == rec.numerodocumento.ToString() && li.montodebito == rec.valorprocesado && rec.valorprocesado != null)
                                                 ((string.IsNullOrEmpty(li.documentohist) == true ? li.documento : li.documentohist) == rec.numerodocumento.ToString() && li.montodebito == rec.valorprocesado && rec.valorprocesado != null)
                                               select new
                                               {
                                                   clibrobanco = li.clibrobanco,
                                                   cuentabanco = li.cuentabanco,
                                                   freal = li.freal,
                                                   fcontable = li.fcontable,
                                                   ccomprobante = rec.ccomprobante,
                                                   cmodulo = li.cmodulo,
                                                   ctransaccion = li.ctransaccion,
                                                   montodebito = li.montodebito,
                                                   montocredito = li.montocredito,
                                                   documento = li.documento,
                                                   conciliado = li.conciliado,
                                                   cusuariomod = li.cusuariomod,
                                                   fmodificacion = li.fmodificacion,
                                                   ajustelibro = li.ajustelibro
                                               }).ToList();


            foreach (var li in librobanco)
            {
                tconlibrobancos registroLb = new tconlibrobancos();
                registroLb.clibrobanco = li.clibrobanco;
                registroLb.cuentabanco = li.cuentabanco;
                registroLb.freal = li.freal;
                registroLb.fcontable = li.fcontable;

                if (string.IsNullOrEmpty(li.ccomprobante))
                {
                    li.ccomprobante = filtroLibroBancoRecaudacion.Where(x => x.clibrobanco == li.clibrobanco).Select(x => x.ccomprobante).FirstOrDefault();
                    li.cambioComprobante = string.IsNullOrEmpty(li.ccomprobante) == false ? true : false;
                }
                registroLb.ccomprobante = li.ccomprobante;
                registroLb.cmodulo = li.cmodulo;
                registroLb.ctransaccion = li.ctransaccion;
                registroLb.montodebito = li.montodebito;
                registroLb.montocredito = li.montocredito;
                registroLb.documento = li.documento;
                registroLb.conciliado = li.conciliado;
                registroLb.cusuariomod = li.cusuariomod;
                registroLb.fmodificacion = li.fmodificacion;
                registroLb.ajustelibro = li.ajustelibro;
            }


            //---------------------------------------------------------------------

            IList<long> lbLibro = filtroLibroBancoRecaudacion.Select(x => x.clibrobanco).Cast<long>().ToList();

            var filtroLibroBancoRecaudacionSaldo = (from li in librobanco.Where(x => !lbLibro.Contains(x.clibrobanco))
                                                    join rec in filtroRecaudacion
                                                    on li.fcontable equals rec.fcontable
                                                    where li.documento == rec.numerodocumento.ToString() && rec.valorprocesado != null
                                                    select new { clibrobancodeb = li.clibrobanco, li.fcontable, rec.ccomprobante, li.documento, saldo = rec.valorprocesado - li.montodebito }).ToList();

            var lbSaldo = (from li in librobanco
                           join rec in filtroLibroBancoRecaudacionSaldo
                           on li.montodebito equals rec.saldo
                           where li.fcontable == rec.fcontable
                           select new
                           {
                               li.clibrobanco,
                               rec.ccomprobante,
                               rec.clibrobancodeb
                           }).GroupBy(x => x.clibrobanco).Select(group => group.First()).ToList();

            List<long> idlbRecupera = new List<long>();

            foreach (var li in librobanco.Where(x => string.IsNullOrEmpty(x.ccomprobante)))
            {
                foreach (var s in lbSaldo)
                {
                    if (s.clibrobanco == li.clibrobanco)
                    {
                        li.ccomprobante = s.ccomprobante;
                        idlbRecupera.Add(s.clibrobancodeb);
                    }
                }
            }

            foreach (var li in librobanco.Where(x => string.IsNullOrEmpty(x.ccomprobante) && idlbRecupera.Contains(x.clibrobanco)))
            {
                foreach (var s in lbSaldo)
                {
                    if (s.clibrobancodeb == li.clibrobanco)
                        li.ccomprobante = s.ccomprobante;
                }
            }
            //---------------------------------------------------------------------

            #region 1. Para Bco. Pichincha filtra los registros de librobancos que tengan igual documento y fechacontable que Ttesrecaudaciondetalle y valorprocesado != NULL


            List<tconcomprobantedetalle> comprobanteDetalle = TconComprobanteDetalleDal.FindRangoFecha(ccuenta, finicio, ffin);
            //List<tconcomprobante> comprobante = TconComprobanteDal.FindRangoFecha(finicio, ffin);

            // List<tconcomprobantedetalle> comprobanteDetalle = TconComprobanteDetalleDal.FindTodos();
            //List<tconcomprobante> comprobante = TconComprobanteDal.FindTodos();
            //List<tconlibrobancos> lb_cumple = (from li in librobanco
            //                                   join cd in comprobanteDetalle on li.documento equals cd.numerodocumentobancario
            //                                   join com in comprobante on cd.ccomprobante equals com.ccomprobante
            //                                   where com.anulado == false && com.actualizosaldo == true && com.eliminado == false
            //                                   && string.IsNullOrEmpty(li.ccomprobante) == false && string.IsNullOrEmpty(cd.ccomprobante) == false
            //                                   select new { li }).Select(x => (tconlibrobancos)x.li).ToList();

            //  List<tconlibrobancos> lb_cumple = librobanco;


            // COMPROMBANTE SOLO PARA PRUEBAS -------------------------------------------------------------------
            /*
            List<tconlibrobancos> lbMensual = TconLibroBancosDal.ConsultaComprobanteRestante(bancoccuentabanco, ffin);

            var libroAgrupaVerifica = librobanco.Union(lbMensual).Cast<tconlibrobancos>().ToList()
                                    .GroupBy(x => new { x.documento })
                                    .Select(lg =>
                                    new
                                    {
                                        documento = lg.Key,
                                        lbmontodebito = lg.Sum(w => w.montodebito),
                                        lbmontocredito = lg.Sum(w => w.montocredito),
                                    }).Where(x => x.lbmontocredito == x.lbmontodebito).Select(x => x.documento).ToList();

            var libroComprobanteTmp = (from li in librobanco.Where(x => !string.IsNullOrEmpty(x.ccomprobante)).Union(lbMensual)
                                       join rec in libroAgrupaVerifica
                                       on li.documento equals rec.documento
                                       select new { li.documento, li.ccomprobante }).Where(x => !string.IsNullOrEmpty(x.ccomprobante)).ToList();

            foreach (var li in librobanco.Where(x => string.IsNullOrEmpty(x.ccomprobante)))
            {
                foreach (var ct in libroComprobanteTmp)
                {
                    if (li.documento == ct.documento)
                        li.ccomprobante = ct.ccomprobante;
                }
            }
            */
            //-------------------------------------------------------------------

            #endregion

            List<tconcomprobante> comprobante = TconComprobanteDal.FindRangoFecha(finicio, ffin);
            List<tconlibrobancos> lb_cumple = (from li in librobanco
                                               join com in comprobante on li.ccomprobante equals com.ccomprobante
                                               where com.anulado == false && com.actualizosaldo == true && com.eliminado == false
                                               && string.IsNullOrEmpty(li.ccomprobante) == false
                                               select new { li }).Select(x => (tconlibrobancos)x.li).ToList();

            #region registros de libro banco que no cumple con el filtrado


            List<tconlibrobancos> lb_no_cumple = new List<tconlibrobancos>();
            var currentIds = lb_cumple.Select(x => x.clibrobanco).ToList();

            lb_no_cumple = librobanco.Where(x => !currentIds.Contains(x.clibrobanco)).ToList();

            #endregion

            lb_cumple = excluyeRegistros(lb_cumple, comprobanteDetalle);
            lb_no_cumple = excluyeRegistros(lb_no_cumple, comprobanteDetalle);

            //-------------------------------------

            IList<long> lbRepetida = (from li in lb_cumple
                                      join com in librobancoTmp on li.clibrobanco equals com.clibrobanco
                                      select new { li }).Select(x => x.li.clibrobanco).Cast<long>().ToList();

            librobancoTmp = librobancoTmp.Where(x => !lbRepetida.Contains(x.clibrobanco)).ToList();

            lb_cumple = lb_cumple.Union(librobancoTmp).Cast<tconlibrobancos>().ToList();

            //------------------------------------


            // filtra los registros con comprobante <> null
            lb_no_cumple = lb_no_cumple.Where(x => string.IsNullOrEmpty(x.ccomprobante) == false).ToList();



            return new List<tconlibrobancos>[] { lb_cumple, lb_no_cumple };
        }


        /// <summary>
        /// Obtiene un arreglo de libro banco:
        /// 1. Un filtrado con los que cumplen: filtrado con recaudacion y filtrad por comprobante
        /// 2. Un filtrado con los que NO cumplen con el primero
        /// Se incluyen los anulados
        /// </summary>
        /// <param name="librobanco"></param>
        /// <param name="finicio"></param>
        /// <param name="ffin"></param>
        /// <returns></returns>
        private List<tconlibrobancos>[] filtrarLbRecaudacionComprobante(List<tconlibrobancos> librobanco, int finicio, int ffin, string ccuenta, string bancoccuentabanco = "")
        {
            #region 1. Para Bco. Pichincha filtra los registros de librobancos que tengan igual documento y fechacontable que Ttesrecaudaciondetalle y valorprocesado != NULL

            List<ttesrecaudaciondetalle> filtroRecaudacion = TtesRecaudacionDetalleDal.FindTtesrecaudaciondetalleRango(finicio, ffin);

            List<tconcomprobante> comprobante = TconComprobanteDal.FindRangoFecha(finicio, ffin);
            List<tconcomprobantedetalle> comprobanteDetalle = TconComprobanteDetalleDal.FindRangoFecha(ccuenta, finicio, ffin);

            // excluye operacion PARQUEADERO
            librobanco = librobanco.Where(x => x.operacion != "PARQUEADERO").ToList();

            List<tconlibrobancos> lb_con_comprobante = librobanco.Where(x => string.IsNullOrEmpty(x.ccomprobante) == false).ToList();
            List<tconlibrobancos> lb_sin_comprobante = librobanco.Where(x => !string.IsNullOrEmpty(x.ccomprobante) == false).ToList();

            List<tconlibrobancos> lb_sinoperacion = lb_sin_comprobante.Where(x => string.IsNullOrEmpty(x.operacion)).ToList();
            List<tconlibrobancos> lb_operacion = lb_sin_comprobante.Where(x => !string.IsNullOrEmpty(x.operacion)).ToList();

            List<tconlibrobancos> lb_filtro_1 = new List<tconlibrobancos>();

            // *1* OPER -> librobanco - recauda (1:1)
            var lb_operacion_recauda_1_1 = (from li in lb_operacion
                                            join rec in filtroRecaudacion on li.operacion equals rec.coperacion
                                            where li.fcontable == rec.fcontable && li.montodebito == rec.valorprocesado && rec.valorprocesado != null
                                            select new
                                            {
                                                clibrobanco = li.clibrobanco,
                                                cuentabanco = li.cuentabanco,
                                                freal = li.freal,
                                                fcontable = li.fcontable,
                                                ccomprobante = rec.ccomprobante,
                                                cmodulo = li.cmodulo,
                                                ctransaccion = li.ctransaccion,
                                                montodebito = li.montodebito,
                                                montocredito = li.montocredito,
                                                documento = li.documento,
                                                conciliado = li.conciliado,
                                                cusuariomod = li.cusuariomod,
                                                fmodificacion = li.fmodificacion,
                                                ajustelibro = li.ajustelibro,
                                                coperacion = rec.coperacion
                                            }).ToList();

            foreach (var li in lb_operacion_recauda_1_1)
            {
                tconlibrobancos registroLb = new tconlibrobancos();
                registroLb.clibrobanco = li.clibrobanco;
                registroLb.cuentabanco = li.cuentabanco;
                registroLb.freal = li.freal;
                registroLb.fcontable = li.fcontable;
                registroLb.ccomprobante = li.ccomprobante;
                registroLb.cmodulo = li.cmodulo;
                registroLb.ctransaccion = li.ctransaccion;
                registroLb.montodebito = li.montodebito;
                registroLb.montocredito = li.montocredito;
                registroLb.documento = li.documento;
                registroLb.conciliado = li.conciliado;
                registroLb.cusuariomod = li.cusuariomod;
                registroLb.fmodificacion = li.fmodificacion;
                registroLb.ajustelibro = li.ajustelibro;
                lb_filtro_1.Add(registroLb);
            }

            // sobrantes del *1*
            var sobralb_1 = lb_operacion.Where(b => !lb_operacion_recauda_1_1.Select(a => a.clibrobanco).Contains(b.clibrobanco)).ToList();


            // OPER -> librobanco - recauda (1:n)
            var lb_operacion_recauda_agrup = sobralb_1.GroupBy(l => l.operacion)
                          .Select(lg =>
                                new
                                {
                                    operacion = lg.Key,
                                    numreg = lg.Count(),
                                    montocredito = lg.Sum(w => w.montocredito),
                                    montodebito = lg.Sum(w => w.montodebito)
                                }).Where(x => x.numreg > 1).ToList();


            var lb_operacion_recauda_1_n = (from li in lb_operacion_recauda_agrup
                                            join rec in filtroRecaudacion on li.operacion equals rec.coperacion
                                            where li.montodebito == rec.valorprocesado && rec.valorprocesado != null
                                            select new
                                            {
                                                coperacion = rec.coperacion
                                            }).Select(x => x.coperacion).ToList();


            string comprobantex;
            foreach (var li in sobralb_1.Where(x => lb_operacion_recauda_1_n.Contains(x.operacion)).ToList())
            {
                comprobantex = string.Empty;
                comprobantex = filtroRecaudacion.Where(x => x.coperacion == li.operacion).FirstOrDefault().ccomprobante;
                if (!string.IsNullOrEmpty(comprobantex))
                {
                    tconlibrobancos registroLb = new tconlibrobancos();
                    registroLb.clibrobanco = li.clibrobanco;
                    registroLb.cuentabanco = li.cuentabanco;
                    registroLb.freal = li.freal;
                    registroLb.fcontable = li.fcontable;
                    registroLb.ccomprobante = comprobantex;
                    registroLb.cmodulo = li.cmodulo;
                    registroLb.ctransaccion = li.ctransaccion;
                    registroLb.montodebito = li.montodebito;
                    registroLb.montocredito = li.montocredito;
                    registroLb.documento = li.documento;
                    registroLb.conciliado = li.conciliado;
                    registroLb.cusuariomod = li.cusuariomod;
                    registroLb.fmodificacion = li.fmodificacion;
                    registroLb.ajustelibro = li.ajustelibro;
                    lb_filtro_1.Add(registroLb);
                }
            }
            comprobantex = string.Empty;

            List<tconlibrobancos> unionlb_1 = lb_operacion.Where(x => !lb_filtro_1.Select(y => y.clibrobanco).Contains(x.clibrobanco)).Union(lb_sinoperacion).ToList();

            // *2* DOCUMENTO -> librobanco - recauda (1:1)
            var lb_documento_recauda_1_1 = (from li in unionlb_1
                                            join rec in filtroRecaudacion
                                               on li.fcontable equals rec.fcontable
                                            where (string.IsNullOrEmpty(li.documentohist) == true ? li.documento : li.documentohist) == rec.numerodocumento.ToString()
                                            && li.montodebito == rec.valorprocesado && rec.valorprocesado != null
                                            select new
                                            {
                                                clibrobanco = li.clibrobanco,
                                                cuentabanco = li.cuentabanco,
                                                freal = li.freal,
                                                fcontable = li.fcontable,
                                                ccomprobante = rec.ccomprobante,
                                                cmodulo = li.cmodulo,
                                                ctransaccion = li.ctransaccion,
                                                montodebito = li.montodebito,
                                                montocredito = li.montocredito,
                                                documento = li.documento,
                                                conciliado = li.conciliado,
                                                cusuariomod = li.cusuariomod,
                                                fmodificacion = li.fmodificacion,
                                                ajustelibro = li.ajustelibro
                                            }).ToList();


            foreach (var li in lb_documento_recauda_1_1)
            {
                tconlibrobancos registroLb = new tconlibrobancos();
                registroLb.clibrobanco = li.clibrobanco;
                registroLb.cuentabanco = li.cuentabanco;
                registroLb.freal = li.freal;
                registroLb.fcontable = li.fcontable;
                registroLb.ccomprobante = li.ccomprobante;
                registroLb.cmodulo = li.cmodulo;
                registroLb.ctransaccion = li.ctransaccion;
                registroLb.montodebito = li.montodebito;
                registroLb.montocredito = li.montocredito;
                registroLb.documento = li.documento;
                registroLb.conciliado = li.conciliado;
                registroLb.cusuariomod = li.cusuariomod;
                registroLb.fmodificacion = li.fmodificacion;
                registroLb.ajustelibro = li.ajustelibro;
                lb_filtro_1.Add(registroLb);
            }

            // sobrantes del *2*
            var sobralb_2 = unionlb_1.Where(b => !lb_documento_recauda_1_1.Select(a => a.clibrobanco).Contains(b.clibrobanco)).ToList();

            // DOC -> librobanco - recauda (1:n)
            var lb_documento_recauda_agrup = sobralb_2.GroupBy(l => l.documento)
                          .Select(lg =>
                                new
                                {
                                    documento = lg.Key,
                                    numreg = lg.Count(),
                                    montocredito = lg.Sum(w => w.montocredito),
                                    montodebito = lg.Sum(w => w.montodebito)
                                }).Where(x => x.numreg > 1).ToList();

            var lb_documento_recauda_1_n = (from li in lb_documento_recauda_agrup
                                            join rec in filtroRecaudacion on li.documento equals rec.numerodocumento.ToString()
                                            where li.montodebito == rec.valorprocesado && rec.valorprocesado != null
                                            select new
                                            {
                                                coperacion = rec.coperacion
                                            }).Select(x => x.coperacion).ToList();

            foreach (var li in sobralb_2.Where(x => lb_documento_recauda_1_n.Contains(x.documento)).ToList())
            {
                comprobantex = string.Empty;
                comprobantex = filtroRecaudacion.Where(x => x.numerodocumento.ToString() == li.documento).FirstOrDefault().ccomprobante;
                if (!string.IsNullOrEmpty(comprobantex))
                {
                    tconlibrobancos registroLb = new tconlibrobancos();
                    registroLb.clibrobanco = li.clibrobanco;
                    registroLb.cuentabanco = li.cuentabanco;
                    registroLb.freal = li.freal;
                    registroLb.fcontable = li.fcontable;
                    registroLb.ccomprobante = comprobantex;
                    registroLb.cmodulo = li.cmodulo;
                    registroLb.ctransaccion = li.ctransaccion;
                    registroLb.montodebito = li.montodebito;
                    registroLb.montocredito = li.montocredito;
                    registroLb.documento = li.documento;
                    registroLb.conciliado = li.conciliado;
                    registroLb.cusuariomod = li.cusuariomod;
                    registroLb.fmodificacion = li.fmodificacion;
                    registroLb.ajustelibro = li.ajustelibro;
                    lb_filtro_1.Add(registroLb);
                }
            }
            comprobantex = string.Empty;


            List<tconlibrobancos> lb_contabilizado = (from li in lb_filtro_1.Union(lb_con_comprobante)
                                                      join com in comprobante
                                                      on li.ccomprobante equals com.ccomprobante
                                                      where com.actualizosaldo == true && com.eliminado == false
                                                      select new { li, com }).Select(s => (tconlibrobancos)s.li).ToList();

            List<tconlibrobancos> lb_cumple_1 = excluyeRegistros(lb_contabilizado, comprobanteDetalle);

            #endregion

            #region registros de libro banco que no cumple con el filtrado

            List<tconlibrobancos> lb_no_cumple = new List<tconlibrobancos>();

            #endregion

            //  lb_cumple = excluyeRegistros(lb_cumple, comprobanteDetalle);
            lb_no_cumple = excluyeRegistros(lb_no_cumple, comprobanteDetalle);
            // filtra los registros con comprobante <> null
            lb_no_cumple = lb_no_cumple.Where(x => string.IsNullOrEmpty(x.ccomprobante) == false).ToList();
            return new List<tconlibrobancos>[] { lb_cumple_1, lb_no_cumple };
        }


        /// <summary>
        /// Excluye parqueadero
        /// </summary>
        /// <param name="librobanco"></param>
        /// <param name="comprobanteDetalle"></param>
        /// <returns></returns>
        private List<tconlibrobancos> excluyeRegistros(List<tconlibrobancos> librobanco, List<tconcomprobantedetalle> comprobanteDetalle)
        {
            // Parqueadero
            var filtroLibroBancoComprobanteDetalle = (from li in librobanco
                                                      join cd in comprobanteDetalle
                                                      on li.documento equals cd.numerodocumentobancario
                                                      select new { li, cd })
                                                      .Where(x => string.IsNullOrEmpty(x.li.ccomprobante) == true && x.cd.centrocostoscdetalle == "CCPC")
                                                      .Select(x => x.li.clibrobanco);

            List<tconlibrobancos> lb_filtrado = librobanco.Where(x => !filtroLibroBancoComprobanteDetalle.Contains(x.clibrobanco)).ToList();
            return lb_filtrado;
        }

        /// <summary>
        /// Calulca los totales de la conciliacion 
        /// </summary>
        /// <param name="lconciliacion"></param>
        /// <returns></returns>
        private ResultadoConciliacion calculaResultadoConciliacion(List<ConciliacionBancariaResultado> lconciliacion)
        {
            var distinctLB = lconciliacion.GroupBy(x => x.rclibrobanco).Select(x => x.FirstOrDefault()).ToList();

            decimal sumaMontoDebitoLb = 0;
            decimal sumaMontoCreditoLb = 0;
            foreach (var item in distinctLB)
            {
                sumaMontoDebitoLb += item.mvalordebito;
                sumaMontoCreditoLb += item.mvalorcredito;
            }

            var distinctEX = lconciliacion.GroupBy(x => x.rcconconciliacionbancariaextracto).Select(x => x.FirstOrDefault()).ToList();

            decimal? sumaMontoDebitoEx = 0;
            decimal? sumaMontoCreditoEx = 0;
            foreach (var item in distinctEX)
            {
                sumaMontoDebitoEx += item.valordebito;
                sumaMontoCreditoEx += item.valorcredito;
            }

            bool conciliado = (sumaMontoDebitoLb - sumaMontoCreditoLb) == (sumaMontoCreditoEx - sumaMontoDebitoEx);

            return new ResultadoConciliacion()
            {
                numConciliados = lconciliacion.Count(),
                numLibroBanco = distinctLB.Count(),
                numExtracto = distinctEX.Count(),
                estadoConciliacion = ((sumaMontoDebitoLb - sumaMontoCreditoLb) == (sumaMontoCreditoEx - sumaMontoDebitoEx)) ? true : false,
                sumaDebitoLb = sumaMontoDebitoLb,
                sumaCreditoLb = sumaMontoCreditoLb,
                sumaCreditoEx = sumaMontoCreditoEx,
                sumaDebitoEx = sumaMontoDebitoEx
            };
        }

        /// <summary>
        /// Objeto resultado conciliacion
        /// </summary>
        private class ResultadoConciliacion
        {
            public int numConciliados { get; set; }
            public int numLibroBanco { get; set; }
            public int numExtracto { get; set; }
            public bool estadoConciliacion { get; set; }
            public decimal sumaDebitoLb { get; set; }
            public decimal sumaCreditoLb { get; set; }
            public decimal? sumaCreditoEx { get; set; }
            public decimal? sumaDebitoEx { get; set; }
        }


        private List<tconlibrobancos>[] filtrarLbRecaudacionComprobante_mmm(List<tconlibrobancos> librobanco, int finicio, int ffin, string ccuenta)
        {
            #region 1. Para Bco. Pichincha filtra los registros de librobancos que tengan igual documento y fechacontable que Ttesrecaudaciondetalle y valorprocesado != NULL

            List<ttesrecaudaciondetalle> filtroRecaudacion = TtesRecaudacionDetalleDal.FindTtesrecaudaciondetalleRango(finicio, ffin);

            var filtroLibroBancoRecaudacion = (from li in librobanco
                                               join rec in filtroRecaudacion
                                               on li.documento equals rec.numerodocumento.ToString()
                                               where li.fcontable == rec.fcontable && li.montodebito == rec.valorprocesado && rec.valorprocesado != null
                                               select new
                                               {
                                                   clibrobanco = li.clibrobanco,
                                                   cuentabanco = li.cuentabanco,
                                                   freal = li.freal,
                                                   fcontable = li.fcontable,
                                                   ccomprobante = rec.ccomprobante,
                                                   cmodulo = li.cmodulo,
                                                   ctransaccion = li.ctransaccion,
                                                   montodebito = li.montodebito,
                                                   montocredito = li.montocredito,
                                                   documento = li.documento,
                                                   conciliado = li.conciliado,
                                                   cusuariomod = li.cusuariomod,
                                                   fmodificacion = li.fmodificacion,
                                                   ajustelibro = li.ajustelibro
                                               }).ToList();

            //var filtroLibroBancoRecaudacion = (from li in librobanco
            //                                   join rec in filtroRecaudacion
            //                                   on li.documento equals rec.numerodocumento.ToString()
            //                                   where li.fcontable == rec.fcontable && li.montodebito == rec.valorprocesado && rec.valorprocesado != null && rec.ccomprobante != null
            //                                   select new
            //                                   {
            //                                       clibrobanco = li.clibrobanco,
            //                                       cuentabanco = li.cuentabanco,
            //                                       freal = li.freal,
            //                                       fcontable = li.fcontable,
            //                                       ccomprobante = rec.ccomprobante,
            //                                       cmodulo = li.cmodulo,
            //                                       ctransaccion = li.ctransaccion,
            //                                       montodebito = li.montodebito,
            //                                       montocredito = li.montocredito,
            //                                       documento = li.documento,
            //                                       conciliado = li.conciliado,
            //                                       cusuariomod = li.cusuariomod,
            //                                       fmodificacion = li.fmodificacion,
            //                                       ajustelibro = li.ajustelibro
            //                                   }).ToList();


            List<tconlibrobancos> librobanco_1 = new List<tconlibrobancos>();
            foreach (var li in filtroLibroBancoRecaudacion)
            {
                tconlibrobancos registroLb = new tconlibrobancos();
                registroLb.clibrobanco = li.clibrobanco;
                registroLb.cuentabanco = li.cuentabanco;
                registroLb.freal = li.freal;
                registroLb.fcontable = li.fcontable;
                registroLb.ccomprobante = li.ccomprobante;
                registroLb.cmodulo = li.cmodulo;
                registroLb.ctransaccion = li.ctransaccion;
                registroLb.montodebito = li.montodebito;
                registroLb.montocredito = li.montocredito;
                registroLb.documento = li.documento;
                registroLb.conciliado = li.conciliado;
                registroLb.cusuariomod = li.cusuariomod;
                registroLb.fmodificacion = li.fmodificacion;
                registroLb.ajustelibro = li.ajustelibro;
                librobanco_1.Add(registroLb);
            }

            #endregion

            #region 2. filtra librobanco con los registros diferentes del filtrado 1

            IList<long> lbRecaudacion = librobanco_1.Select(x => x.clibrobanco).Cast<long>().ToList();
            List<tconlibrobancos> librobanco_2 = librobanco.Where(x => x.ccomprobante != null && !lbRecaudacion.Contains(x.clibrobanco)).ToList();

            #endregion

            List<tconcomprobantedetalle> comprobanteDetalle = TconComprobanteDetalleDal.FindRangoFecha(ccuenta, finicio, ffin);

            var consultaCD = (from li in librobanco_2
                              join cd in comprobanteDetalle
                              on li.documento equals cd.numerodocumentobancario
                              select new { li, cd })
                        .Where(x => x.li.ccomprobante == x.cd.ccomprobante);


            librobanco_2 = consultaCD.Select(x => x.li).Cast<tconlibrobancos>().ToList();

            #region 3. une las consultas 1 y 2

            List<tconlibrobancos> unionlb1_lb2 = librobanco_1.Union(librobanco_2).Cast<tconlibrobancos>().ToList();

            #endregion

            #region De la consulta 3, filtra los registros sin comprobantes anulados que hayan sido mayorizados

            List<tconcomprobante> comprobante = TconComprobanteDal.FindRangoFecha(finicio, ffin);

            var filtroLibroBancoComprobante = (from li in unionlb1_lb2
                                               join com in comprobante
                                               on li.ccomprobante equals com.ccomprobante
                                               where com.anulado == false && com.actualizosaldo == true && com.eliminado == false
                                               select new { li, com }).ToList();

            List<tconlibrobancos> lb_cumple = filtroLibroBancoComprobante.Select(s => (tconlibrobancos)s.li).ToList();

            #endregion

            #region filtra los registros de librobancos y comprobantedetalle que tengan igual documento 

            var currentIds2 = lb_cumple.Select(x => x.clibrobanco).ToList();
            List<tconlibrobancos> lb_no_cumple2 = librobanco.Where(x => !currentIds2.Contains(x.clibrobanco)).ToList();

            var filtroLibroBancoComprobanteDetalle = (from li in lb_no_cumple2
                                                      join cd in comprobanteDetalle
                                                      on li.documento equals cd.numerodocumentobancario
                                                      select new { li, cd })
                                                      .GroupBy(x => x.li.clibrobanco).Select(x => x.FirstOrDefault()).ToList();

            var filtroLibroBancoComprobante2 = filtroLibroBancoComprobanteDetalle
            .Join(comprobante, li => li.cd.ccomprobante, com => com.ccomprobante, (li, com) => new { li, com })
            .Where(x => x.com.anulado == false && x.com.actualizosaldo == true && x.com.eliminado == false)
            .Select(m => m.li).ToList();


            //var filtroLibroBancoComprobante2 = filtroLibroBancoComprobanteDetalle
            //.Join(comprobante, li => li.cd.ccomprobante, com => com.ccomprobante, (li, com) => new { li, com })
            //.Where(x => x.com.anulado == false && x.com.actualizosaldo == true && x.com.eliminado == false && x.li.li.ccomprobante != null)
            //.Select(m => m.li).ToList();


            List<tconlibrobancos> lb_cumple_comprobantedetalle = filtroLibroBancoComprobante2.Select(s => (tconlibrobancos)s.li).ToList();
            lb_cumple = lb_cumple.Union(lb_cumple_comprobantedetalle).Cast<tconlibrobancos>().ToList();

            #endregion

            #region registros de libro banco que no cumple con el filtrado

            List<tconlibrobancos> lb_no_cumple = new List<tconlibrobancos>();
            var currentIds = lb_cumple.Select(x => x.clibrobanco).ToList();
            lb_no_cumple = librobanco.Where(x => !currentIds.Contains(x.clibrobanco)).ToList();

            #endregion

            lb_cumple = excluyeRegistros(lb_cumple, comprobanteDetalle);
            lb_no_cumple = excluyeRegistros(lb_no_cumple, comprobanteDetalle);
            // filtra los registros con comprobante <> null
            lb_no_cumple = lb_no_cumple.Where(x => string.IsNullOrEmpty(x.ccomprobante) == false).ToList();
            return new List<tconlibrobancos>[] { lb_cumple, lb_no_cumple };
        }


    }
}

