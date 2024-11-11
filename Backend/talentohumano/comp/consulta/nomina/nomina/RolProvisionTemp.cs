using core.componente;
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
using util.dto.consulta;

namespace talentohumano.comp.consulta.nomina.nomina
{
    class RolProvisionTemp : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rm)
        {
            try
            {

                IList<tnomingreso> ING = new List<tnomingreso>();
                IList<tnomegreso> EGRE = new List<tnomegreso>();
                IList<tnomdecimocuarto> DEC = new List<tnomdecimocuarto>();
                IList<tnomdecimotercero> DET = new List<tnomdecimotercero>();
                IList<tnomsaldovacaciones> SVAC = new List<tnomsaldovacaciones>();
                IList<tnompagoimpuestorenta> IMPR = new List<tnompagoimpuestorenta>();
                IList<tnomrolprovicion> ROLPROV = new List<tnomrolprovicion>();
                IList<tnomnomina> NOM = new List<tnomnomina>();
                IList<RubroNomina> ingresos = new List<RubroNomina>();
                IList<RubroNomina> egresos = new List<RubroNomina>();
                int crolprov = 0;

                string tipoarchivo = rm.Mdatos["tipo"].ToString();
                string tipo = rm.Mdatos["tiporeporte"].ToString();

                var ldtados = JsonConvert.DeserializeObject<List<tnomrol>>(@rm.Mdatos["lregistros"].ToString());
                var dlnomina = JsonConvert.DeserializeObject<tnomnomina>(@rm.Mdatos["nomina"].ToString());
                if (dlnomina.estadicdetalle.Equals("CON")) {

                    if (tipo.Equals("ROLP"))
                    {
                        byte[] archivo = null;
                        Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();
                       
                        parametrosPdf.Add("i_cnomina", dlnomina.cnomina);
                        
                        general.reporte.GenerarArchivo.generarArchivo(tipoarchivo, "/CesantiaReportes/TalentoHumano/", "rptTthRolPagosGeneralFin", "c:\\tmp\\", "RolPagosTemporal", parametrosPdf, true, out archivo);
                        rm.Response["ROLPROVISIONTEMP"] = archivo;
                    }
                    else
                    {
                        byte[] archivo = null;
                        Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();
                        
                        parametrosPdf.Add("i_cnomina", dlnomina.cnomina);
                        general.reporte.GenerarArchivo.generarArchivo(tipoarchivo, "/CesantiaReportes/TalentoHumano/", "rptTthRolProvision", "c:\\tmp\\", "RolProvision", parametrosPdf, true, out archivo);
                        rm.Response["ROLPROVISIONTEMP"] = archivo;

                    }
                    return;
                }
                //consulta datos nómina
                tnomparametrodetalle param = TnomparametroDal.Find((long)dlnomina.anio);
                foreach (tnomrol rolPagos in ldtados)
                {
                    Rol rol = new Rol();

                    tthcontratodetalle cd = TthContratoDal.FindContratoFuncionario(rolPagos.cfuncionario.Value);
                    tnomdecimos tnd = TnomDecimosDal.FindAnio((long)dlnomina.anio, cd.cfuncionario);
                    tnompagoregionesdecimo pdecimo = TnomPagoRegionesDecimoDal.FindRegion(dlnomina.anio, cd.regioncdetalle);


                    rol = new Rol(dlnomina.finicio.Value, dlnomina.ffin.Value, rm.Ccompania, dlnomina.cnomina, (long)dlnomina.anio, dlnomina.mescdetalle, cd, param, pdecimo, tnd);
                    //CALCULOS GENERALES
                    rol.setDatosGenerales();


                    foreach (tnomingreso tni in rol.ing)
                    {
                        tnomingreso tning = tni;
                        tning.fingreso = DateTime.Now;
                        tning.Esnuevo = true;
                        tning.Actualizar = false;
                        tning.crol = rolPagos.crol;
                        tning.fingreso = Fecha.GetFechaSistema();
                        tning.cusuarioing = rm.Cusuario;

                        ING.Add(tning);
                        RubroNomina ing = new RubroNomina();
                        ing.crol = tning.crol.Value;
                        ing.tipocdetalle = tning.tipocdetalle;
                        ing.calculado = tning.calculado.Value;
                        ingresos.Add(ing);

                    }
                    foreach (tnomegreso tne in rol.egr)
                    {
                        tnomegreso tneg = tne;

                        tneg.Esnuevo = true;
                        tneg.Actualizar = false;
                        tneg.crol = rolPagos.crol;
                        tneg.fingreso = Fecha.GetFechaSistema();
                        tneg.cusuarioing = rm.Cusuario;
                        EGRE.Add(tneg);
                        RubroNomina egr = new RubroNomina();
                        egr.crol = tneg.crol.Value;
                        egr.tipocdetalle = tneg.tipocdetalle;
                        egr.calculado = tneg.calculado.Value;
                        egresos.Add(egr);
                    }

                    //CALCULO MENSUAL DECIMO CUARTO
                    tnomdecimocuarto dcuarto = new tnomdecimocuarto();
                    dcuarto = rol.dcuarto;
                    dcuarto.crol = rolPagos.crol;
                    dcuarto.Esnuevo = true;
                    dcuarto.Actualizar = false;
                    dcuarto.cfuncionario = rolPagos.cfuncionario;
                    dcuarto.contabilizado = !rol.acum.adecimoc;
                    dcuarto.mensualiza = !rol.acum.adecimoc;
                    DEC.Add(dcuarto);
                    //DECIMO TERCERO
                    tnomdecimotercero dtercero = new tnomdecimotercero();
                    dtercero = rol.dtercero;
                    dtercero.crol = rolPagos.crol;
                    dtercero.contabilizado = !rol.acum.adecimot;
                    dtercero.mensualiza = !rol.acum.adecimot;
                    dtercero.Esnuevo = true;
                    dtercero.fingreso = Fecha.GetFechaSistema();
                    dtercero.cusuarioing = rm.Cusuario;
                    dtercero.fechageneracion = Fecha.GetFechaSistema();
                    dtercero.Actualizar = false;
                    DET.Add(dtercero);
                    //SALDO VACACIÓN
                    tnomsaldovacaciones svacaciones = rol.getVacaciones();
                    svacaciones.Esnuevo = true;
                    svacaciones.Actualizar = false;
                    svacaciones.cusuarioing = rm.Cusuario;
                    svacaciones.fingreso = Fecha.GetFechaSistema();
                    SVAC.Add(svacaciones);

                    //IMPUESTO A LA RENTA SI EL VALOR ES MAYOR A 0
                    tnompagoimpuestorenta impr = rol.pagoimprenta;
                    if (impr.valor > 0)
                    {
                        impr.fingreso = Fecha.GetFechaSistema();
                        impr.cusuarioing = rm.Cusuario;
                        impr.Esnuevo = true;
                        impr.Actualizar = false;
                        IMPR.Add(impr);
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
                    rolProv.Mdatos = rolPagos.Mdatos;
                    rolProv.crolprovicion = crolprov++;
                    rolProv.crol = rolPagos.crol;
                    rolProv.cnomina = dlnomina.cnomina;
                    ROLPROV.Add(rolProv);
                }

                IList<roltem> itm = new List<roltem>();
                foreach (tnomrolprovicion r in ROLPROV)
                {
                    roltem rol = new roltem();

                    rol.crolprovicion = r.crolprovicion;
                    rol.cfuncionario = r.cfuncionario;

                    tthfuncionariodetalle fun = TthFuncionarioDal.Find(r.cfuncionario);
                    rol.documento = fun.documento;
                    rol.nombre = fun.primernombre + " " + fun.primerapellido;
                    rol.cargo = r.Mdatos["ncargo"].ToString();
                    rol.dtercero = r.decimotercero.Value;
                    rol.dtercerop = r.decimotercerop.Value;
                    rol.dcuarto = r.decimocuarto.Value;
                    rol.dcuartop = r.decimocuartop.Value;
                    rol.iessper = r.aporteiess.Value;
                    rol.iesspat = r.aportepatronal.Value;
                    rol.fondoreserva = r.fondosreserva.Value;
                    rol.fondoreservap = r.fondoreservap.Value;
                    rol.ccc = r.ccc.Value;
                    rol.vacaciones = r.vacaciones.Value;
                    rol.total = r.totalpagado.Value;
                    rol.sueldo = r.total.Value;
                    itm.Add(rol);

                }

                if (tipo.Equals("ROLP"))
                {
                    byte[] archivo = null;
                    Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();
                    var ingres = JsonConvert.SerializeObject(ingresos);
                    var egrs = JsonConvert.SerializeObject(egresos);
                    parametrosPdf.Add("i_cnomina", dlnomina.cnomina);
                    parametrosPdf.Add("i_lingresos", ingres);
                    parametrosPdf.Add("i_legresos", egrs);
                    general.reporte.GenerarArchivo.generarArchivo(tipoarchivo, "/CesantiaReportes/TalentoHumano/", "rptTthRolPagosGeneralTemp", "c:\\tmp\\", "RolPagosTemporal", parametrosPdf, true, out archivo);
                    rm.Response["ROLPROVISIONTEMP"] = archivo;
                }
                else
                {
                    byte[] archivo = null;
                    Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();
                    var json = JsonConvert.SerializeObject(itm);
                    parametrosPdf.Add("i_ldatos", json);
                    general.reporte.GenerarArchivo.generarArchivo(tipoarchivo, "/CesantiaReportes/TalentoHumano/", "rptTthRolProvisionTemp", "c:\\tmp\\", "RolProvisionTemporal", parametrosPdf, true, out archivo);
                    rm.Response["ROLPROVISIONTEMP"] = archivo;

                }

            }
            catch (Exception ex)
            {
                rm.Response["cerrada"] = false;
            }
        }

    }
    public class RubroNomina
    {
        public long crol { get; set; }
        public string tipocdetalle { get; set; }

        public decimal calculado { get; set; }
    }
    public class roltem
    {
        public long crolprovicion { get; set; }
        public long cfuncionario { get; set; }

        public string documento { get; set; }
        public string nombre { get; set; }
        public string cargo { get; set; }
        public decimal dtercero { get; set; }
        public decimal dtercerop { get; set; }
        public decimal dcuarto { get; set; }
        public decimal dcuartop { get; set; }
        public decimal fondoreserva { get; set; }
        public decimal fondoreservap { get; set; }

        public decimal vacaciones { get; set; }
        public decimal iessper { get; set; }
        public decimal iesspat { get; set; }
        public decimal ccc { get; set; }
        public decimal sueldo { get; set; }
        public decimal total { get; set; }





    }
}

