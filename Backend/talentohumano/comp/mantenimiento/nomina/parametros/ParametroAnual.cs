
using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using modelo;
using Newtonsoft.Json;
using util.servicios.ef;
using core.servicios;
using dal.talentohumano;
namespace talentohumano.comp.mantenimiento.nomina.parametros
{
    /// <summary>
    /// Clase que genera la cabecera de parámetro anual
    /// </summary>
    public class ParametroAnual : ComponenteMantenimiento
    {

        /// <summary>
        /// Crea el registro de parámetro anual de nómina
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (!rm.Mdatos.ContainsKey("anio") )
            {
                return;
            }
            long anio = long.Parse(rm.Mdatos["anio"].ToString());
            bool nuevo = bool.Parse(rm.Mdatos["nuevo"].ToString());

            if (nuevo)
            {
                tnomparametro obj = TnomparametroDal.FindCabecera(anio);
                if (obj == null)
                {
                    try
                    {
                        tnomparametro param = new tnomparametro();
                        param.anio = anio;
                        param.ccompania = rm.Ccompania;
                        param.Esnuevo = true;
                        Sessionef.Save(param);

                        rm.Response["FINALIZADA"] = anio;
                    }
                    catch (Exception ex)
                    {
                        rm.Response["mensaje"] = ex.Message;
                    }

                }
            }
            else
            {
                return;
            } 
        }


    }

}
