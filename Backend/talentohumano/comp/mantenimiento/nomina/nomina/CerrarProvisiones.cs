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
using util;
using util.dto.mantenimiento;

namespace talentohumano.comp.mantenimiento.nomina.nomina
{
    public class CerrarProvisiones : ComponenteMantenimiento
    {
        /// <summary>
        /// Se encarga de generar las proviciones de talento humano
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            IList<tnomdecimocuarto> DEC = new List<tnomdecimocuarto>();
            IList<tnomdecimotercero> DET = new List<tnomdecimotercero>();
            IList<tnomsaldovacaciones> SVAC = new List<tnomsaldovacaciones>();
            IList<tnompagoimpuestorenta> IMPR = new List<tnompagoimpuestorenta>();
            IList<tnomrolprovicion> ROLPROV = new List<tnomrolprovicion>();
            IList<tnomnomina> NOM = new List<tnomnomina>();
           
            if (rm.Mdatos.ContainsKey("aprobada"))
            {
                if (!bool.Parse(rm.Mdatos["aprobada"].ToString()))
                {
                    return;
                }

                var nomina = JsonConvert.DeserializeObject<IList<tnomnomina>>(@rm.Mdatos["nomina"].ToString());

                foreach (tnomnomina dlnomina in nomina)
                {
                    IList<tnomrol> ldatos = TnomRolDal.FindNomina(dlnomina.cnomina);
                    IList<Saldo> itm = new List<Saldo>();

                    tnomparametrodetalle param = TnomparametroDal.Find((long)dlnomina.anio);
                    foreach (tnomrol rolPagos in ldatos)
                    {
                        Rol rol = new Rol();

                        tthcontratodetalle cd = TthContratoDal.FindContratoFuncionario(rolPagos.cfuncionario.Value);
                        tnomdecimos tnd = TnomDecimosDal.FindAnio((long)dlnomina.anio, cd.cfuncionario);
                        tnompagoregionesdecimo pdecimo = TnomPagoRegionesDecimoDal.FindRegion(dlnomina.anio, cd.regioncdetalle);


                        rol = new Rol(dlnomina.finicio.Value, dlnomina.ffin.Value, rm.Ccompania, dlnomina.cnomina, (long)dlnomina.anio, dlnomina.mescdetalle, cd, param, pdecimo, tnd);
                        //CALCULOS GENERALES
                        rol.setDatosGenerales();
                        //CALCULO MENSUAL DECIMO CUARTO
                        tnomdecimocuarto dcuarto = new tnomdecimocuarto();
                        dcuarto = rol.dcuarto;
                        dcuarto.crol = rolPagos.crol;
                        dcuarto.Esnuevo = true;
                        dcuarto.Actualizar = false;
                        dcuarto.cfuncionario = rolPagos.cfuncionario;
                        dcuarto.contabilizado = !rol.acum.adecimoc;
                       // dcuarto.contabilizado = false;
                        dcuarto.mensualiza = !rol.acum.adecimoc;
                        long cdecimocuarto = Secuencia.GetProximovalor("SDECIMOC");
                        dcuarto.cdecimocuarto = cdecimocuarto;
                        DEC.Add(dcuarto);

                        //DECIMO TERCERO
                        tnomdecimotercero dtercero = new tnomdecimotercero();
                        dtercero = rol.dtercero;
                        dtercero.crol = rolPagos.crol;
                       dtercero.mensualiza = !rol.acum.adecimot;
                        dtercero.contabilizado = !rol.acum.adecimot;
                        // dtercero.contabilizado = false;

                        dtercero.Esnuevo = true;
                        dtercero.fingreso = Fecha.GetFechaSistema();
                        dtercero.cusuarioing = rm.Cusuario;
                        dtercero.fechageneracion = Fecha.GetFechaSistema();
                        dtercero.Actualizar = false;
                        long cdecimotercero = Secuencia.GetProximovalor("SDECIMOT");
                        dtercero.cdecimotercero = cdecimotercero;
                        DET.Add(dtercero);

                        //SALDO VACACIÓN
                        tnomsaldovacaciones svacaciones = rol.getVacaciones();
                        svacaciones.Esnuevo = true;
                        svacaciones.Actualizar = false;
                        long cvacacion = Secuencia.GetProximovalor("SVACACION");
                        svacaciones.csaldovacaciones = cvacacion;
                        svacaciones.cusuarioing = rm.Cusuario;
                        svacaciones.fingreso = Fecha.GetFechaSistema();
  tgentransaccion trans = TgentransaccionDal.Find(rm.Cmodulo, rm.Ctranoriginal);
                        tgencatalogodetalle CAT = TgenCatalogoDetalleDal.Find(dlnomina.mesccatalogo.Value, dlnomina.mescdetalle);
                        tgencatalogodetalle REG = TgenCatalogoDetalleDal.Find(cd.regimenccatalogo.Value,cd.regimencdetalle);
                        svacaciones.tipoccatalogo = 1162;
                        svacaciones.tipocdetalle = "AAUT";
                        svacaciones.comentario = "SALDO GENERADO EN " + trans.nombre + ", MES " + CAT.nombre + ", RÉGIMEN " + REG.nombre;
                        SVAC.Add(svacaciones);

                        //IMPUESTO A LA RENTA SI EL VALOR ES MAYOR A 0
                        tnompagoimpuestorenta impr = rol.pagoimprenta;
                        if (impr.valor > 0)
                        {
                            impr.fingreso = Fecha.GetFechaSistema();
                            impr.cusuarioing = rm.Cusuario;

                            long cimpuesto = Secuencia.GetProximovalor("SIMPUESTOR");
                            impr.cimpuesto = cimpuesto;
                            impr.Esnuevo = true;
                            impr.Actualizar = false;
                       if(TnomPagoImpuestoRentaDal.Find(impr.anio, impr.cfuncionario) == null)
                            {
                                IMPR.Add(impr);

                            }
                        }

                        //ROL DE PROVISION
                        tnomrolprovicion rolProv = rol.getRolProvision();
                        rolProv.Esnuevo = true;
                        rolProv.Actualizar = false;
                        rolProv.cusuarioing = rm.Cusuario;
                        rolProv.fingreso = Fecha.GetFechaSistema();
                        rolProv.vacaciones = svacaciones.valor;
                        rolProv.estado = true;
                        rolProv.ccontrato = rolPagos.ccontrato;
                        rolProv.cdepartamento = rolPagos.cdepartamento;
                        long crolprovicion = Secuencia.GetProximovalor("SROLPROV");
                        rolProv.crolprovicion = crolprovicion;
                        rolProv.crol = rolPagos.crol;
                        rolProv.cnomina = dlnomina.cnomina;
                        ROLPROV.Add(rolProv);
                    }
                    foreach (tnomrolprovicion rprov in ROLPROV)
                    {
                        Saldo aportePatronal = new Saldo(rprov.aportepatronal.Value, "APOPAT",rprov.centrocostocdetalle,true);
                        itm.Add(aportePatronal);
                        Saldo dtercero = new Saldo((rprov.decimotercero.Value+ rprov.decimotercerop.Value), "DECTER", rprov.centrocostocdetalle, true);
                        itm.Add(dtercero);
                        Saldo dcuarto = new Saldo((rprov.decimocuarto.Value+ rprov.decimocuartop.Value), "DECCUA", rprov.centrocostocdetalle, true);
                        itm.Add(dcuarto);
                        Saldo fores = new Saldo(rprov.fondosreserva.Value, "FONRES", rprov.centrocostocdetalle, true);
                        itm.Add(fores);
                        Saldo ccc = new Saldo(rprov.ccc.Value, "CCC", rprov.centrocostocdetalle,true);

                        itm.Add(ccc);
                        //Saldo vac = new Saldo(rprov.vacaciones.Value, "VAC", rprov.centrocostocdetalle, true);
                        //itm.Add(vac);

                    }
                    //ELIMINAR LAS CLAVES PARA ENVIAR NUEVAS PARA CREAR UN DIARIO CON DIFERENTES SALDOS Y DIFERENTE PLANTILLA
                    rm.Mdatos.Remove("cplantilla");
                    rm.Mdatos.Remove("Saldos");
                    rm.Mdatos.Remove("comentario");
                    rm.Mdatos.Remove("tipodocumento");
                    rm.Mdatos.Remove("cconcepto");
                    tthparametros paramt = TthParametrosDal.Find("CONROLPROV", rm.Ccompania);
                    if (paramt == null)
                    {

                        throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0}", "CONROLPROV");
                    }
                    
                    rm.Mdatos.Add("cplantilla", (int)paramt.numero);
                    rm.Mdatos.Add("tipodocumento", paramt.texto);
                    rm.Mdatos.Add("comentario", "PROVISIONES GENERADAS DESDE EL MÓDULO DE TALENTO HUMANO");
                   
                    rm.Mdatos.Add("cconcepto", 3);//FINANCIERO
                    var json = JsonConvert.SerializeObject(itm);
                    rm.Mdatos.Add("Saldos", json);

                    RqMantenimiento rq = (RqMantenimiento)rm.Clone();
                    rq.EncerarRubros();
                    Mantenimiento.ProcesarAnidado(rq, 11, 430);
                }
                //GENERA COMPROBANTE CONTABLE DE PROVISIONES


                rm.Response["FINALIZADA"] = true;
                rm.AdicionarTabla("tnomdecimocuarto", DEC, false);
                rm.AdicionarTabla("tnomdecimotercero", DET, false);
                rm.AdicionarTabla("tnomsaldovacaciones", SVAC, false);
                rm.AdicionarTabla("tnompagoimpuestorenta", IMPR, false);
                rm.AdicionarTabla("tnomrolprovicion", ROLPROV, false);
            }
        }
    }
}
