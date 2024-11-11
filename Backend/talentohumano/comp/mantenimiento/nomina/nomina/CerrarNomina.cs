using core.componente;
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
using dal.talentohumano;
using core.servicios;

using util;
using talentohumano.enums;

namespace talentohumano.comp.mantenimiento.nomina.nomina
{
    /// <summary>
    /// Clase que cierra nómina
    /// </summary>
    public class CerrarNomina : ComponenteMantenimiento
    {
        
    /// <summary>
    /// Se encarga de cerrar nómina generando los salos de ingresos y egresos 
    /// </summary>
    /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {

            if (!rm.Mdatos.ContainsKey("nomina") || !rm.Mdatos.ContainsKey("lregistros")) {
                return;
            }
            try
            {
                IList<tnomingreso> ING = new List<tnomingreso>();
                IList<tnomegreso> EGRE = new List<tnomegreso>();
                IList<tnomnomina> NOM = new List<tnomnomina>();
                var dlnomina = JsonConvert.DeserializeObject<tnomnomina>(@rm.Mdatos["nomina"].ToString());
                var ldtados = JsonConvert.DeserializeObject<List<tnomrol>>(@rm.Mdatos["lregistros"].ToString());

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
                            long cingreso = Secuencia.GetProximovalor("SINGRESO");
                            tning.fingreso = DateTime.Now;
                            tning.cingreso = cingreso;
                            tning.Esnuevo = true;
                            tning.Actualizar = false;
                            tning.crol = rolPagos.crol;
                            tning.fingreso = Fecha.GetFechaSistema();
                            tning.cusuarioing = rm.Cusuario;

                            ING.Add(tning);


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
                        }

                       
                    }

                   
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
            catch (Exception ex) {
                rm.Response["cerrada"] = false;
                rm.Response["mensaje"] = ex.Message;
            }
            }

       
        
    }
}
