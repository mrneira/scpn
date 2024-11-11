using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.socio {
    public class TsocCesantiaDal {
        /// <summary>
        /// Entrega datos vigentes de una persona.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tsoccesantia Find(long cpersona, int ccompania) {
            tsoccesantia obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoccesantia.Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.verreg == 0).Single();
            if (obj == null) {
                throw new AtlasException("BPER-001", "PERSONA NO DEFINIDA EN TSOCCESANTIA CPERSONA: {0} COMPANIA: {1}", cpersona, ccompania);
            }
            EntityHelper.SetActualizar(obj);

            return obj;
        }

        /// <summary>
        /// Entrega datos vigentes de una persona.
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="credencial"></param>
        /// <returns></returns>
        public static tsoccesantia FindByCredencial(long cpersona, int ccompania, string credencial) {
            tsoccesantia obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoccesantia.Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.credencial == credencial && x.verreg == 0).Single();
            if (obj == null) {
                throw new AtlasException("BPER-001", "PERSONA NO DEFINIDA EN TSOCCESANTIA CPERSONA: {0} COMPANIA: {1}", cpersona, ccompania);
            }
            EntityHelper.SetActualizar(obj);

            return obj;
        }

        public static List<tsoccesantia> FindToBaja(int ccompania) {
            List<tsoccesantia> obj = new List<tsoccesantia>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoccesantia.AsNoTracking().Where(x => x.ccompania == ccompania && x.ccatalogotipoestado == 2703 && x.ccdetalletipoestado == "BAJ" && x.verreg == 0).ToList();
            return obj;
        }

        public static tsoccesantia FindToCarga(long cpersona, int ccompania) {
            tsoccesantia obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoccesantia.AsNoTracking().Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.verreg == 0).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);

            return obj;
        }

        /// <summary>
        /// Crea y entrega una lista de documentos de informacion a verificar por solicitud.
        /// </summary>
        /// <param name="laportes">Lista de aportes por fecha de aporte.</param>

        /// <returns> List tsoccesantia </returns>
        public static void UpdateTsocCesantia(int fechaaporte) {
            List<tsoccesantia> lsocio = new List<tsoccesantia>();

            string connectionString = ConfigurationManager.ConnectionStrings["AtlasContexto"].ConnectionString.Replace("metadata=res://*/ModeloEF.csdl|res://*/ModeloEF.ssdl|res://*/ModeloEF.msl;provider=System.Data.SqlClient;provider connection string", "");
            connectionString = connectionString.Substring(connectionString.IndexOf("data source"));
            connectionString = connectionString.Substring(0, connectionString.Length - 1);

            string SQL = "update tsoccesantia set sueldoactual = a.sueldo " +
                         "from tpreaporte a where a.fechaaporte = @fechaaporte " +
                         "and a.cpersona = tsoccesantia.cpersona " +
                         "and a.ccompania = tsoccesantia.ccompania " +
                         "and tsoccesantia.verreg = 0 ";

            SqlConnection cnx = new SqlConnection(connectionString);
            cnx.Open();
            SqlCommand cmd = new SqlCommand(SQL, cnx);
            cmd.Parameters.AddWithValue("@fechaaporte", fechaaporte);
            cmd.ExecuteNonQuery();
            //try {
            //cnx.BeginTransaction();
            //foreach (tpreaporte obj in laportes) {
            //    cmd = new SqlCommand(SQL, cnx);
            //    cmd.Parameters.AddWithValue("@VALOR", obj.sueldo);
            //    cmd.Parameters.AddWithValue("@CPERSONA", obj.cpersona);
            //    cmd.Parameters.AddWithValue("@CCOMPANIA", obj.ccompania);
            //    cmd.ExecuteNonQuery();
            //}
            //cnx.Database.
            cnx.Close();

            //} catch (Exception) {

            //    throw;
            //}
            //    tsoccesantia soc = FindToAporte(obj.cpersona, obj.ccompania);
            //    soc.Actualizar = true;
            //    soc.cpersona = obj.cpersona;
            //    soc.ccompania = obj.ccompania;
            //    soc.sueldoactual = obj.sueldo;
            //    if(!obj.GetDatos("ubicacion").ToString().Equals("")) {
            //        soc.ubicacionarchivo = obj.GetDatos("ubicacion").ToString();
            //    }
            //    soc.verreg = 0;
            //    soc.optlock = 0;
            //    lsocio.Add(soc);
            //}
            //return lsocio;
        }

        public static tsoccesantia FindToAporte(long cpersona, int ccompania) {
            tsoccesantia obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoccesantia.AsNoTracking().Where(x => x.ccompania == ccompania && x.cpersona == cpersona && x.verreg == 0).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }
    }
}

