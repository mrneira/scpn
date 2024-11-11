using core.componente;
using dal.generales;
using dal.prestaciones;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.consulta;

namespace prestaciones.comp.consulta.expediente {
    class Requisitos :ComponenteConsulta {
        /// <summary>
        /// Clase que entrega los datos de los requistitos
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];
            string cdetalletipoexp = rqconsulta.Mdatos["cdetalletipoexp"].ToString();
            IList<tpretipoexpedienterequisito> ldatos = new List<tpretipoexpedienterequisito>();
            ldatos = TpreTipoExpedienteRequisitoDal.Find(cdetalletipoexp);
           
            if(ldatos.Count <= 0) {
                tgencatalogodetalle tipoexpediente = TgenCatalogoDetalleDal.Find(2502, cdetalletipoexp);
                throw new AtlasException("PRE-029", "NO EXISTE REQUISITOS PARA EL TIPO DE LIQUIDACIÓN {0}", tipoexpediente.nombre);
            }
            foreach(tpretipoexpedienterequisito obj in ldatos) {
                tprerequisitos requisito = TpreRequisitosDAL.Find(obj.crequisito);
                obj.AddDatos("nnombre",requisito.nombre);
                obj.AddDatos("verificada", false);
            }
            resp["DATOSREQUISITO"] = ldatos;
        }

    }
}