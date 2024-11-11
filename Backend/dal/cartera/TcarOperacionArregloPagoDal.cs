using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.cartera {

    public class TcarOperacionArregloPagoDal {

        /// <summary>
        /// Entrega la defincion de un arreglo de pagos para la opoeracion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="cestatus">Codigo de estatus del arreglo de pagos.</param>
        /// <returns></returns>
        public static tcaroperacionarreglopago Find(string coperacion, string cestatus)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacionarreglopago obj = null;
            obj = contexto.tcaroperacionarreglopago.Where(x => x.coperacion == coperacion && x.cestatus == cestatus).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Entrega la definicion de un arreglo de pagos de una operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static List<tcaroperacionarreglopago> Find(string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcaroperacionarreglopago.Where(x => x.coperacion == coperacion && x.cestatus != "ANU").ToList();
        }

        /// <summary>
        /// Entrega la definicion de un arreglo de pagos de una solicitud de cartera.
        /// </summary>
        /// <param name="csolicitud">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static List<tcaroperacionarreglopago> Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcaroperacionarreglopago.Where(x => x.csolicitud == csolicitud).ToList();
        }

        /// <summary>
        /// Entrega la definicion de un arreglo de pagos de una solicitud de cartera pendientes de pago.
        /// </summary>
        /// <param name="csolicitud">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static List<tcaroperacionarreglopago> FindPendientePago(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcaroperacionarreglopago.Where(x => x.csolicitud == csolicitud && x.cestatus == "ING").ToList();
        }

        /// <summary>
        /// Reversa el cobro en caja o debito a cuenta vista.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        public static void ReversarPago(String coperacion)
        {
            tcaroperacionarreglopago ap = TcarOperacionArregloPagoDal.Find(coperacion, "PAG");
            ap.cestatus = "ING";
            ap.fpago = null;
        }

        /// <summary>
        /// Reversa aprobacion del arreglo de pagos.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        public static void ReversarAutorizacion(String coperacion)
        {
            tcaroperacionarreglopago ap = TcarOperacionArregloPagoDal.Find(coperacion, "APR");
            ap.cestatus = "PAG";
            ap.faprueba = null;
            ap.cusuarioaprueba = null;
        }

        /// <summary>
        /// Consulta de arreglo de pago por cestatus
        /// </summary>
        /// <param name="cestatussolicitud">estado de solicitud.</param>
        public static List<tcaroperacionarreglopago> FindBycestatus(string cestatus)
        {
            List<tcaroperacionarreglopago> obj = new List<tcaroperacionarreglopago>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcaroperacionarreglopago.AsNoTracking().Where(x => x.cestatus != cestatus).ToList();
            return obj;
        }
        /// <summary>
        /// Eliminar arreglos de pago.
        /// </summary>
        /// <param name="cestatussolicitud">Código de estatus solicitud.</param>
        public static void EliminarArregloPagos(Dictionary<string, string> entidades, string tablaMaestra, string campoTablaMaestra, string cestatus)
        {
            List<tcaroperacionarreglopago> arreglopagos = FindBycestatus(cestatus);
            foreach (tcaroperacionarreglopago pagos in arreglopagos) {
                string JPQL = "delete from {0} where {1} = {2}";
                foreach (KeyValuePair<string, string> entidad in entidades) {
                    string sql = string.Format(JPQL, entidad.Key, entidad.Value, pagos.coperacion);
                    AtlasContexto contexto = Sessionef.GetAtlasContexto();
                    contexto.Database.ExecuteSqlCommand(sql);
                }
                string JPQLMAESTRA = string.Format("delete from {0} where {1} = @coperacion", tablaMaestra, campoTablaMaestra);
                AtlasContexto contextoMaster = Sessionef.GetAtlasContexto();
                contextoMaster.Database.ExecuteSqlCommand(JPQLMAESTRA, new SqlParameter("@coperacion", pagos.coperacion));
            }
        }

        //RRO 20210315 Se aumenta el metodo para buscar y actualizar por el idSolucitud el estado 
        public static tcaroperacionarreglopago FindBySolicitud(long idSolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperacionarreglopago obj = null;
            obj = contexto.tcaroperacionarreglopago.Where(x => x.csolicitud == idSolicitud).Single();
            return obj;
        }
        /// <summary>
        /// Verifica si existe el registro en tcaroperacionarreglopago por operacion y solicitud
        /// En tcaroperacionarreglopago solo tiene RENOVACION
        /// RRO anulacion 20210414
        /// </summary>
        /// <param name="operacion"></param>
        /// <param name="idSolicitud"></param>
        /// <returns></returns>
        public static bool ExisteOperacion(long idSolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcaroperacionarreglopago.Count(x => x.csolicitud == idSolicitud) > 0;//RRO anulacion 20210421
        }
    }
}
