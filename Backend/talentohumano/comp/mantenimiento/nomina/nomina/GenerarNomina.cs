using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using talentohumano.comp.consulta;
using Newtonsoft.Json;
using talentohumano.datos;
using modelo;
using dal.talentohumano.nomina;
using dal.talentohumano;
using core.servicios;
using util.servicios.ef;
using util;
using talentohumano.enums;

namespace talentohumano.comp.mantenimiento.nomina.nomina
{
    /// <summary>
    /// Clase que se encarga de generar nómina
    /// </summary>
    class GenerarNomina : ComponenteMantenimiento

    {

        /// <summary>
        /// Genera nómina
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetTabla("NOMINA") == null || !rm.GetTabla("NOMINA").Lregistros.Any())
            {
                return;
            }

             
            tnomnomina lnom = rm.GetTabla("NOMINA").Lregistros.Cast<tnomnomina>().Single();
            if (!lnom.tipocdetalle.Equals("GEN")) {
                return;
            }
           



            //DATOS INICIALES NÓMINA
            if (rm.Mdatos.ContainsKey("nuevo"))
            {
                if (!bool.Parse(rm.Mdatos["nuevo"].ToString()))
                {
                    return;
                }
                if (lnom.Esnuevo)
                {
                    long cnomina = Secuencia.GetProximovalor("SNOMINA");
                    lnom.cnomina = cnomina;
                    lnom.estadicdetalle = EnumEstatus.GENERADA.Cestatus;
                    rm.AdicionarTabla("tnomnomina", lnom, false);

                }
                else {
                    rm.AdicionarTabla("tnomnomina", lnom, false);
                    return;
                }

            }
            tnomnomina dlnomina = lnom;
            
            //LISTA DE FUNCIONARIOS EN NÓMINA
            var dlregistros = JsonConvert.DeserializeObject<List<ListadoNomina>>(@rm.Mdatos["ldatos"].ToString());
            //consulta datos nómina
            tnomparametrodetalle param = TnomparametroDal.Find((long)dlnomina.anio);
            IList<Rol> rolPagos = new List<Rol>();

            foreach (ListadoNomina ls in dlregistros)
            {
                if (ls.avisoentrada == 1)
                {
                    Rol rolPago = new Rol();
                    tthfuncionariodetalle fun = TthFuncionarioDal.FindFuncionario(ls.cfuncionario);

                    tthcontratodetalle cd = TthContratoDal.FindContratoFuncionario(ls.cfuncionario.Value);
                    if (cd == null)
                    {
                        throw new AtlasException("TTH-019", "NO SE HA DEFINIDO UN CONTRATO PARA EL FUNCIONARIO {0}", (fun.primernombre + " " + fun.primerapellido));

                    }

                    tnomdecimos tnd = TnomDecimosDal.FindAnio((long)dlnomina.anio, cd.cfuncionario);

                    if (tnd == null)
                    {
                        throw new AtlasException("TTH-020", "NO SE HA PARAMETRIZADO LA ACUMULACIÓN O MENSUALIZACIÓN DE DÉCIMOS, FONDOS DE RESERVA DEL FUNCIONARIO: {0}", (fun.primernombre + " " + fun.primerapellido));

                    }

                    tnompagoregionesdecimo pdecimo = TnomPagoRegionesDecimoDal.FindRegion(dlnomina.anio, cd.regioncdetalle);
                    if (pdecimo == null)
                    {
                        throw new AtlasException("TTH-021", "NO SE HA PARAMETRIZADO LAS FECHAS DE PAGO DE LOS DÉCIMOS EN EL SISTEMA");

                    }
                    rolPago = new Rol(dlnomina.finicio.Value,dlnomina.ffin.Value,rm.Ccompania, dlnomina.cnomina, (long)dlnomina.anio, dlnomina.mescdetalle, cd, param, pdecimo, tnd);
                    //DATOS
                    rolPago.setDetalles();
                    //CALCULOS GENERALES
                    rolPago.setDatosGenerales();
                    
                    rolPagos.Add(rolPago);
                }
            }
            IList<tnomrol> ltnr = new List<tnomrol>();

            foreach (Rol rol in rolPagos)
            {
                tnomrol tnr = rol.Rolpagos;
                tnr.Esnuevo = true;
                tnr.Actualizar = false;
                long crol = Secuencia.GetProximovalor("SROLPAGOS");
                tnr.crol = crol;
                tnr.cnomina = dlnomina.cnomina;
                tnr.cusuarioing = rm.Cusuario;
                tnr.fingreso = Fecha.GetFechaSistema();
                ltnr.Add(tnr);
               
                

            }
            rm.AdicionarTabla("tnomrol", ltnr, false);
            rm.Response["ROLPAGO"] = ltnr;
            rm.Response["NOMINA"] = lnom.cnomina;
            rm.Response["DATOS"] = "OK";
        }





       
    }
}
