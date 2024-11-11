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
    public class RolDecimosTemp : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rm)
        {
            IList<tnomingreso> ING = new List<tnomingreso>();
            IList<tnomegreso> EGRE = new List<tnomegreso>();

            IList<tnomnomina> NOM = new List<tnomnomina>();
            IList<RubroNomina> ingresos = new List<RubroNomina>();
            IList<RubroNomina> egresos = new List<RubroNomina>();
            int crolprov = 0;

            var ldtados = JsonConvert.DeserializeObject<List<tnomrol>>(@rm.Mdatos["lregistros"].ToString());
            var dlnomina = JsonConvert.DeserializeObject<tnomnomina>(@rm.Mdatos["nomina"].ToString());
            string tipoarchivo = rm.Mdatos["tipo"].ToString();
            string tipo = rm.Mdatos["tiporeporte"].ToString();
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
            }
                byte[] archivo = null;
            Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();
            var ingres = JsonConvert.SerializeObject(ingresos);
            var egrs = JsonConvert.SerializeObject(egresos);
            parametrosPdf.Add("i_cnomina", dlnomina.cnomina);
            parametrosPdf.Add("i_lingresos", ingres);
            parametrosPdf.Add("i_legresos", egrs);
            general.reporte.GenerarArchivo.generarArchivo(tipoarchivo, "/CesantiaReportes/TalentoHumano/", "rptTthRolDecimosGeneralTemp", "c:\\tmp\\", "RolDecimosTemporal", parametrosPdf, true, out archivo);
            rm.Response["DECIMOSTMP"] = archivo;
        }
    }
}
