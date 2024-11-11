using core.componente;
using core.servicios.mantenimiento;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.datos;
using util.dto.mantenimiento;
using dal.talentohumano.nomina;
using util.servicios.ef;
using System.Data.SqlClient;
using dal.persona;
using dal.talentohumano;
using util;
using talentohumano.enums;
using bce.util;
using System.Collections;
using modelo.interfaces;
using dal.generales;

namespace talentohumano.comp.mantenimiento.nomina.contabilidad
{
    public class NominaCon : ComponenteMantenimiento
    {
        /// <summary>
        /// Clase que se encarga de crear los saldos de nómina para enviar al componente de contabilizar
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            //GENERACIÓN DE DATOS PARA RQMANTENIMIENTO EN CONTABILIDAD

            if (rm.Mdatos.ContainsKey("provisiones"))
            {
                return;
            }
         
            rm.Mdatos.Add("tipodocumento", "DIAGEN");
         
            rm.Mdatos.Add("cconcepto", 3);//FINANCIERO
            bool aprobada = (bool)rm.Mdatos["aprobada"];
            IList<tnomnomina> NOMI = new List<tnomnomina>();
            //GENERACIÓN DE DATOS PARA PLANTILLA
            IList<tconcomprobante> comp = new List<tconcomprobante>();
            IList<tconcomprobantedetalle> compd = new List<tconcomprobantedetalle>();

            var dlnomina = JsonConvert.DeserializeObject<IList<tnomnomina>>(@rm.Mdatos["nomina"].ToString());
           
            foreach (tnomnomina nomina in dlnomina)
            {
                if (aprobada)
                {
                    IList<tnomingreso> ING = TnomIngresosDal.FindNomina(nomina.cnomina);
                    IList<tnomegreso> EGR = TnomEgresoDal.FindNomina(nomina.cnomina);
                    IList<Saldo> itm = new List<Saldo>();
                    decimal suepp = 0;
                    
                    foreach (tnomingreso ingr in ING)
                    {
                        Saldo ob = new Saldo();
                        ob.saldo = ingr.tipocdetalle;
                        ob.valor = ingr.calculado.Value;
                        ob.centroCosto = TnomRolDal.Find(ingr.crol.Value).centrocostocdetalle;
                        ob.debito = false;
                        ob.ingreso = !ingr.estado;
                        itm.Add(ob);
                       
                    }
                    foreach (tnomegreso egr in EGR)
                    {
                        Saldo ob = new Saldo();
                        ob.saldo = egr.tipocdetalle;
                        ob.valor = egr.calculado.Value;
                        ob.centroCosto = TnomRolDal.Find(egr.crol.Value).centrocostocdetalle;
                        ob.debito = true;
                        ob.ingreso = !egr.estado;
                        itm.Add(ob);
                      
                       
                    }

                   

                    tthparametros ccatalogo = TthParametrosDal.Find("CATALOGOCCOSTO", rm.Ccompania);

                    if (ccatalogo == null || ccatalogo.numero == null)
                    {
                        throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");

                    }
                    int ccatalogocentrocosto = 0;
                    try
                    {
                        ccatalogocentrocosto = (int)ccatalogo.numero;
                        if (ccatalogocentrocosto == 0)
                        {
                            throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");
                    }

                    IList<tgencatalogodetalle> centrocosto = TgenCatalogoDetalleDal.FindInDataBase(ccatalogocentrocosto);
                    foreach (tgencatalogodetalle cc in centrocosto)
                    {
                        Saldo salTotal = new Saldo();
                        salTotal.saldo = "SUEPAG";
                        salTotal.valor = TnomRolDal.FindRol(nomina.cnomina, cc.cdetalle);
                        salTotal.centroCosto = cc.cdetalle;
                        salTotal.debito = true;    
                        itm.Add(salTotal);
                    }

                        //OBJETO TIPO JSON DE SALDOS CON SU IDENTIFICADOR
                    var json = JsonConvert.SerializeObject(itm);
                    rm.Mdatos.Add("Saldos", json);
                    tthparametros param = TthParametrosDal.Find("CONROLGEN", rm.Ccompania);
                    if (param == null) {

                        throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0}", "CONROLGEN");
                    }
                    rm.Mdatos.Add("ccompromiso", nomina.ccompromiso);
                    rm.Mdatos.Add("comentario", nomina.descripcion);
                    rm.Mdatos.Add("cplantilla", (int)param.numero);
                    rm.Mdatos.Add("generarcomprobante", true);
                    rm.Mdatos.Add("actualizarsaldosenlinea", true);
                    //IMPLEMENTA

                    //GENERAR SPI
                   

                    RqMantenimiento rq = (RqMantenimiento)rm.Clone();
                    rq.EncerarRubros();
                    Mantenimiento.ProcesarAnidado(rq, 11, 430);
                    //AÑADO AL BEAN PARA ACTUALIZAR CON EL NUEVO ESTADO DE CONTABILIZADA
                    string ccomprobante = "";
                    tconcomprobante ldatos = (tconcomprobante)rm.GetTabla("TCONCOMPROBANTE").Registro;
                    ccomprobante = ldatos.ccomprobante;
                    IList<tconcomprobantedetalle> ldatosd = rq.GetTabla("TCONCOMPROBANTEDETALLE").Lregistros.Cast<tconcomprobantedetalle>().ToList();
                    comp.Add(ldatos);
                    foreach (tconcomprobantedetalle cd in ldatosd) {
                        compd.Add(cd);
                    }
                    IList<tnomrol> rolpagos = TnomRolDal.FindNomina(nomina.cnomina);

                    foreach (tnomrol rol in rolpagos)
                    {


                        tthfuncionariodetalle fun = TthFuncionarioDal.Find(rol.cfuncionario.Value);
                        String nombre = ((fun.primernombre != null) ? fun.primernombre : "") + " " +
                                ((fun.primerapellido != null) ? fun.primerapellido : "");
                        if (rol.totalley.Value > 0)
                        {
                            GenerarBce.InsertarPagoBce(rm, fun.documento, nombre, fun.ncuenta,
                                                 fun.cpersona, fun.tipocuentaccatalogo.Value, fun.tipocuentacdetalle, fun.bancoccatalago.Value,
                                                 fun.bancocdetalle, rol.totalley.Value, fun.documento, (int)rol.crol, ccomprobante); 
                        }
                        else if (rol.totalley.Value == 0)
                        {
                            // NO HACER NADA VÁLIDO
                        }
                        else
                        {
                            throw new AtlasException("TTH-029", "NO SE PUEDE GENERAR LA NÓMINA CON VALORES NEGATIVOS.", "CATALOGOCCOSTO");

                        }
                    }

                    SaldoPresupuestoNomina.ActualizarSaldoPresupuesto(rq, ldatos, rolpagos.ToList<IBean>(),nomina);

                    RqMantenimiento rprov = (RqMantenimiento)rm.Clone();
                    rprov.EncerarRubros();
                    Mantenimiento.ProcesarAnidado(rprov, 11, 432);

                    tconcomprobante ldatosprov = (tconcomprobante)rm.GetTabla("TCONCOMPROBANTE").Registro;
                    IList<tconcomprobantedetalle> ldatosdprov = rq.GetTabla("TCONCOMPROBANTEDETALLE").Lregistros.Cast<tconcomprobantedetalle>().ToList();
                    comp.Add(ldatosprov);
                    foreach (tconcomprobantedetalle cd in ldatosdprov)
                    {
                        compd.Add(cd);
                    }

                    nomina.Actualizar = true;
                    nomina.Esnuevo = false;
                    nomina.estadicdetalle = EnumEstatus.CONTABILIZADA.Cestatus;
                    nomina.cusuarioaprobacion = rm.Cusuario;
                    nomina.ccomprobante = rq.Response["ccomprobante"].ToString();
                    NOMI.Add(nomina);

                }
                else
                {
                    nomina.Actualizar = true;
                    nomina.Esnuevo = false;
                    nomina.direjecutiva = null;
                    nomina.cusuariomod = rm.Cusuario;
                    nomina.estadicdetalle = EnumEstatus.APROBADA.Cestatus;
                    NOMI.Add(nomina);

                }
            }
            rm.AdicionarTabla("tnomnomina", NOMI, false);
            rm.AdicionarTabla("TCONCOMPROBANTE", comp, false);
            rm.AdicionarTabla("TCONCOMPROBANTEDETALLE", compd, false);
           

            rm.Response["GENERADO"] = true;
        }
        public static decimal Suma(IList<Saldo> sal ,string centrocostocdetalle)
        {
            decimal total = 0;
            foreach (Saldo ingreso in sal)
            {
                if (ingreso.centroCosto.Equals(centrocostocdetalle)  )
                {

                    if (!ingreso.debito && !ingreso.ingreso)
                    {
                        total = total + ingreso.valor;
                    }
                    else
                    if (ingreso.debito && !ingreso.ingreso) {
                        total = total -
                            ingreso.valor;
                    }
                    else if(!ingreso.debito && ingreso.ingreso)
                    {
                        continue;
                    }
                    
                }
            }
            return total;
        }
    }


}
