using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using dal.socio;
using util;
using util.dto;

namespace socio.comp.consulta.novedades
{
    class Novedades : ComponenteConsulta
    {
        /// <summary>
        /// Consulta si oficio ya exixte en novedades por cpersona.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            if (rqconsulta.Mdatos.ContainsKey("numerooficio"))
            {
                long cpersona = (long)rqconsulta.Mdatos["cpersona"];
                int ccompania = (int)rqconsulta.Ccompania;
                string numeroofi = rqconsulta.Mdatos["numerooficio"].ToString();

                IList<tsocnovedadades> tsocnovedadades = TsocNovedadesDal.FindToNovedades(cpersona, ccompania);

                foreach (tsocnovedadades ofi in tsocnovedadades)
                {

                    if (numeroofi == ofi.numerooficio)
                    {

                        throw new AtlasException("NOV-001", "NUMERO DE OFICIO EXISTENTE: {0} ", ofi.numerooficio);

                    }
                }
            }
        }
    }
}
