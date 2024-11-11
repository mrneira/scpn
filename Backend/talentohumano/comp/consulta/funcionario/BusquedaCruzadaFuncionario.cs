using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using core.componente;
using util.dto.consulta;
using util.dto;
using modelo.servicios;
using util.servicios.ef;
using dal.persona;
using modelo;
namespace talentohumano.comp.consulta.funcionario
{
    /// <summary>
    /// Entrega una lista de funcionarios de la aplicacion.
    /// </summary>
    /// <author>jcuenca</author>

    class BusquedaCruzadaFuncionario : ComponenteConsulta
    {
        /// <summary>
        /// Map con el orden campos a aplicar a la consulta
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string documento = rqconsulta.Mdatos["documento"].ToString();
            tperpersonadetalle tperpersonadetalle = TperPersonaDetalleDal.FindByIdentification(documento);
            rqconsulta.Response["BUSQUEDACRUZADAFUNCIONARIOS"] = tperpersonadetalle;
            
        }      
    }
}
