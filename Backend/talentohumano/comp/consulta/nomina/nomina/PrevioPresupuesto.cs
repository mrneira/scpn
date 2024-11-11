using core.componente;
using dal.presupuesto;
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
   public class PrevioPresupuesto : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rm)
        {
            
                string comentario = "";
              
                IList<tnomrolprovicion> ROLPROV = new List<tnomrolprovicion>();
               
                IList<RubroNomina> ingresos = new List<RubroNomina>();
                IList<RubroNomina> egresos = new List<RubroNomina>();
                int crolprov = 0;
                var dlnomina = JsonConvert.DeserializeObject<tnomnomina>(@rm.Mdatos["nomina"].ToString());
                if (dlnomina.ccompromiso==null  || dlnomina.ccompromiso.Length==0) {
                    throw new AtlasException("TTH-028", "NO SE HA INGRESADO EL COMPROMISO EN LA NÓMINA: {0}", dlnomina.cnomina);

                }
                tpptcompromiso con = TpptCompromisoDal.FindCompromiso(dlnomina.ccompromiso);
                if (con == null)
                {
                    throw new AtlasException("TTH-028", "NO SE HA INGRESADO EL COMPROMISO EN LA NÓMINA: {0}", dlnomina.cnomina);

                }
                comentario = con.infoadicional;
                IList<tnomrol> ldtados = TnomRolDal.FindNomina(dlnomina.cnomina);
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

                   

                    //ROL DE PROVISION
                    tnomrolprovicion rolProv = rol.getRolProvision();
                    rolProv.Esnuevo = true;
                    rolProv.Actualizar = false;
                    rolProv.cusuarioing = rm.Cusuario;
                    rolProv.fingreso = Fecha.GetFechaSistema();
                    rolProv.vacaciones = 0;
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
                    rol.cargo = "";
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
 
                    byte[] archivo = null;
                    Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();
                    var json = JsonConvert.SerializeObject(itm);
                    parametrosPdf.Add("i_ldatos", json);
                    parametrosPdf.Add("i_cnomina", dlnomina.cnomina);
                    parametrosPdf.Add("i_ccompromiso", dlnomina.ccompromiso);
                    parametrosPdf.Add("i_cusuario", rm.Cusuario);
                    parametrosPdf.Add("i_comentario", comentario);
                    general.reporte.GenerarArchivo.generarArchivo("PDF", "/CesantiaReportes/TalentoHumano/", "rptTthPrevioAfectacion", "c:\\tmp\\", "PRESUPUESTOPREVIO", parametrosPdf, true, out archivo);
                    rm.Response["REPORTE"] = archivo;

                

            
            
        }

    }
   
}

