using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.generales;
using dal.talentohumano;
using dal.talentohumano.nomina;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.datos;
using talentohumano.enums;
using util;
using util.dto.mantenimiento;

namespace talentohumano.comp.mantenimiento.nomina.nomina
{
    public class CerrarDecimos : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {

            if (!rm.Mdatos.ContainsKey("nomina") || !rm.Mdatos.ContainsKey("lregistros"))
            {
                return;
            }
         
            try
            {
                IList<Saldo> itm = new List<Saldo>();
                IList<tnomingreso> ING = new List<tnomingreso>();
                IList<tnomegreso> EGRE = new List<tnomegreso>();
                IList<tnomnomina> NOM = new List<tnomnomina>();
                var dlnomina = JsonConvert.DeserializeObject<tnomnomina>(@rm.Mdatos["nomina"].ToString());
                var ldtados = JsonConvert.DeserializeObject<List<tnomrol>>(@rm.Mdatos["lregistros"].ToString());
                rm.Mdatos.Add("tipodocumento", "DIAGEN");

                rm.Mdatos.Add("cconcepto", 3);//FINANCIERO

                if (rm.Mdatos.ContainsKey("cerrada"))
                {
                    if (!bool.Parse(rm.Mdatos["cerrada"].ToString()))
                    {
                        return;
                    }


                    //consulta datos nómina
                    tnomparametrodetalle param = TnomparametroDal.Find((long)dlnomina.anio);
                    foreach (tnomrol rolPagos in ldtados)
                    {
                        Decimos rol = new Decimos();

                        tthcontratodetalle cd = TthContratoDal.FindContratoFuncionario(rolPagos.cfuncionario.Value);
                        tnomdecimos tnd = TnomDecimosDal.FindAnio((long)dlnomina.anio, cd.cfuncionario);
                        tnompagoregionesdecimo pdecimo = TnomPagoRegionesDecimoDal.FindRegion(dlnomina.anio, cd.regioncdetalle);


                        rol = new Decimos(dlnomina.finicio.Value, dlnomina.ffin.Value, rm.Ccompania, dlnomina.cnomina, (long)dlnomina.anio, dlnomina.mescdetalle, cd, param, pdecimo, tnd, dlnomina.tipocdetalle);
                        //CALCULOS GENERALES
                        rol.setDatosGenerales();
                        
                        foreach (tnomingreso tni in rol.ing)
                        {
                            tnomingreso tning = tni;
                            long cingreso = Secuencia.GetProximovalor("SINGRESO");
                            tning.fingreso = DateTime.Now;
                            tning.cingreso = cingreso;
                            tning.Esnuevo = true;
                            tning.Actualizar = false;
                            tning.crol = rolPagos.crol;
                            tning.fingreso = Fecha.GetFechaSistema();
                            tning.cusuarioing = rm.Cusuario;

                            ING.Add(tning);

                            Saldo ob = new Saldo();
                            ob.saldo = tni.tipocdetalle;
                            ob.valor = tni.calculado.Value;
                            ob.centroCosto = TnomRolDal.Find(tni.crol.Value).centrocostocdetalle;
                            ob.debito = false;
                            ob.ingreso = !tni.estado;
                            itm.Add(ob);


                        }
                        foreach (tnomegreso tne in rol.egr)
                        {
                            tnomegreso tneg = tne;

                            long cegreso = Secuencia.GetProximovalor("SEGRESO");
                            tneg.Esnuevo = true;
                            tneg.Actualizar = false;
                            tneg.crol = rolPagos.crol;
                            tneg.cegreso = cegreso;
                            tneg.fingreso = Fecha.GetFechaSistema();
                            tneg.cusuarioing = rm.Cusuario;
                            EGRE.Add(tneg);

                            Saldo ob = new Saldo();
                            ob.saldo = tne.tipocdetalle;
                            ob.valor = tne.calculado.Value;
                            ob.centroCosto = TnomRolDal.Find(tne.crol.Value).centrocostocdetalle;
                            ob.debito = true;
                            ob.ingreso = !tne.estado;
                            itm.Add(ob);

                        }
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
                            salTotal.valor = TnomRolDal.FindRol(dlnomina.cnomina, cc.cdetalle);
                            salTotal.centroCosto = cc.cdetalle;
                            salTotal.debito = true;
                            itm.Add(salTotal);
                        }
                        var json = JsonConvert.SerializeObject(itm);
                        rm.Mdatos.Add("Saldos", json);
                    int plant = 0;
                    if (dlnomina.tipocdetalle.Equals("DTER"))
                    {
                         plant = TthParametrosDal.GetInteger("CPLANTILLADECIMOS", rm.Ccompania);

                    }
                    else {
                         plant = TthParametrosDal.GetInteger("CPLANTILLADECIMOSCUARTO", rm.Ccompania);

                    }


                    rm.Mdatos.Add("comentario", dlnomina.descripcion);
                        rm.Mdatos.Add("cplantilla", plant);
                        rm.Mdatos.Add("generarcomprobante", true);
                        //SOLO GENERAR EL COMPROBANTE SIN MAYORIZAR
                       // rm.Mdatos.Add("actualizarsaldosenlinea", true);

                        RqMantenimiento rq = (RqMantenimiento)rm.Clone();
                        rq.EncerarRubros();
                        Mantenimiento.ProcesarAnidado(rq, 11, 430);
                        //AÑADO AL BEAN PARA ACTUALIZAR CON EL NUEVO ESTADO DE CONTABILIZADA

                        tconcomprobante ldatos = (tconcomprobante)rm.GetTabla("TCONCOMPROBANTE").Registro;
                        IList<tconcomprobantedetalle> ldatosd = rq.GetTabla("TCONCOMPROBANTEDETALLE").Lregistros.Cast<tconcomprobantedetalle>().ToList();
                        ldatos.automatico = true;
                        ldatos.cuadrado = true;
                        ldatos.actualizosaldo = false;
                        ldatos.ruteopresupuesto = true;
                        dlnomina.ccomprobante = ldatos.ccomprobante;
                        dlnomina.direjecutiva = true;
                        dlnomina.estadicdetalle = "APR";





                }
                rm.AdicionarTabla("tnomingreso", ING, false);
                rm.AdicionarTabla("tnomegreso", EGRE, false);
                if (dlnomina.cnomina != 0)
                {
                    tnomnomina nom = dlnomina;
                    nom.Esnuevo = false;
                    nom.Actualizar = true;
                    nom.cerrada = true;
                    nom.estadicdetalle = EnumEstatus.APROBADA.Cestatus;
                    nom.cusuariorevicion = rm.Cusuario;
                    nom.direjecutiva = null;
                    rm.AdicionarTabla("tnomnomina", dlnomina, false);
                }

                rm.Response["cerrada"] = true;

            }
            catch (Exception ex)
            {
                rm.Response["cerrada"] = false;
                rm.Response["mensaje"] = ex.Message;
            }
        }


    }
}

