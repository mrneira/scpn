using core.componente;
using dal.garantias;
using dal.garantias.parametros;
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.consulta;

namespace garantias.comp.consulta.param
{
    public class CamposDinamicos : ComponenteConsulta
    {

        /// <summary>
        /// Clase que se encarga de consultar los productos de cartera no vencidos.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string ctipogarantia = (string)rqconsulta.GetDatos("ctipogarantia");
            string ctipobien = (string)rqconsulta.GetDatos("ctipobien");

            IList<tgartipobiencampo> lcampos = TgarTipoBienCampoDal.ObtenerCampos(ctipogarantia, ctipobien);
            rqconsulta.Response.Add("lcampos", lcampos);

        }

    }

}
