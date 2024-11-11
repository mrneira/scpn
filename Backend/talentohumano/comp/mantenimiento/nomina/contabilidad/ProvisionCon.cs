using core.componente;
using core.servicios.mantenimiento;
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

namespace talentohumano.comp.mantenimiento.nomina.contabilidad
{
    /// <summary>
    /// Clase que se encarga de generar los salos para enviar a contabilizar
    /// </summary>
    class ProvisionCon : ComponenteMantenimiento
    {
        /// <summary>
        ///  Crear los saldos de proviciones para enviar al componente de contabilizar
        /// </summary>
        /// <param name="rm">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rm)
        {


            tthparametros param = TthParametrosDal.Find("CONROLPROV", rm.Ccompania);
            if (param == null)
            {

                throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0}", "CONROLPROV");
            }

            rm.Mdatos.Add("cplantilla", (int)param.numero);
            rm.Mdatos.Add("comentario", "GENERADO DESDE EL MÓDULO DE TALENTO HUMANO");
            rm.Mdatos.Add("tipodocumento", "DIAGEN");
            rm.Mdatos.Add("actualizarsaldosenlinea", true);
            rm.Mdatos.Add("cconcepto", 3);//FINANCIERO

            //GENERACIÓN DE DATOS PARA PLANTILLA

            var dlnomina = JsonConvert.DeserializeObject<IList<tnomnomina>>(@rm.Mdatos["nomina"].ToString());
            foreach (tnomnomina nomina in dlnomina)
            {
                IList<tnomingreso> ING = TnomIngresosDal.FindNomina(nomina.cnomina);
                IList<tnomegreso> EGR = TnomEgresoDal.FindNomina(nomina.cnomina);
                IList<Saldo> itm = new List<Saldo>();
                
              


                //OBJETO TIPO JSON DE SALDOS CON SU IDENTIFICADOR
                var json = JsonConvert.SerializeObject(itm);
                rm.Mdatos.Add("Saldos", json);
                //IMPLEMENTA
                RqMantenimiento rq = (RqMantenimiento)rm.Clone();
                Mantenimiento.ProcesarAnidado(rq, 11, 430);
            }
        }
    }
}
