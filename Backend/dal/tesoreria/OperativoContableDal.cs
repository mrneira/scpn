using modelo;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.tesoreria
{
    /// <summary>
    /// Dal para manejo de empresa
    /// </summary>
    /// <param name="cempresa"></param>
    public class OperativoContableDal
    {
        public static DataTable FindCabeceraOperativo(int cempresa, int fecha, string tipotransaccion)
        {
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@i_cempresa"] = cempresa;
            parametros["@i_fecha"] = fecha;
            parametros["@i_tipotransaccion"] = tipotransaccion;
            DataTable dt = storeprocedure.StoreProcedureDal.GetDataTable("sp_TesConAuxiliarContable", parametros);
            return dt;
        }

        public static DataTable FindDetalleMovimientos(int cempresa, int fecha, string tipotransaccion)
        {
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@i_cempresa"] = cempresa;
            parametros["@i_fecha"] = fecha;
            parametros["@i_tipotransaccion"] = tipotransaccion;
            DataTable dt = storeprocedure.StoreProcedureDal.GetDataTable("sp_TesConAuxiliarContableDetalle", parametros);
            return dt;
        }
    }
}

