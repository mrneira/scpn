using dal.storeprocedure;
using modelo;
using modelo.servicios;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.TMarcacion;
using util.servicios.ef;

namespace dal.talentohumano
{
  public  class TthMarcacionesDal
    {
        public static void Insert(TMarcacion dt) {
            

            TMarcacion dto = dt;
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros.Add("@cusuario", dto.cusuario);
            parametros.Add("@fmarcacion", dto.fmarcacion);
            parametros.Add("@marcacion", dto.marcacion);
            DateTime ob = DateTime.Parse(dto.fmarcacion);
            string marcacionint = ob.ToString("yyyMMdd");
            parametros.Add("@fmarcacionint", marcacionint);
            string tmarcacionint = ob.ToString("HHmmss");
            parametros.Add("@tmarcacionint", tmarcacionint);
            StoreProcedureDal.GetDataTable("sp_TthManMarcacionInsert", parametros);

        }
        public static void Delete(TMarcacion dto) {
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros.Add("@cusuario", dto.cusuario);
            parametros.Add("@fmarcacion", dto.fmarcacion);
            parametros.Add("@fecha", dto.fmarcacion);

            StoreProcedureDal.GetDataTable("sp_TthManMarcacionDelete", parametros);

        }
        public static void Update(TMarcacion dt) {
            

            TMarcacion dto = dt;
            Dictionary<string, object> parametros = new Dictionary<string, object>();

            parametros.Add("@cusuario", dto.cusuario);
            parametros.Add("@fmarcacion", dto.fmarcacion);
            parametros.Add("@fecha", dto.fecha);
            parametros.Add("@marcacion", dto.marcacion);
            DateTime ob = DateTime.Parse(dto.fmarcacion);

            string tmarcacionint = ob.ToString("HHmm");
            parametros.Add("@marcacionint", tmarcacionint);

            StoreProcedureDal.GetDataTable("sp_TthManMarcacionUpdate", parametros);

        }

      
    }
   
}
