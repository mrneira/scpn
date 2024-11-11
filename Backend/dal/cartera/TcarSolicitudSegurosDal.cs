using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarSolicitudSeguroDto.
    /// </summary>
    public class TcarSolicitudSegurosDal {

        /// <summary>
        /// Consulta el seguro asociado a una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>List TcarSolicitudSeguroDto</returns>
        public static List<tcarsolicitudseguros> Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudseguros.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
        }

        /// <summary>
        /// Consulta el seguro asociado a una solicitud de credito por garantia.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="coperaciongarantia">Numero de garantia.</param>
        /// <returns>List TcarSolicitudSeguroDto</returns>
        public static tcarsolicitudseguros Find(long csolicitud, string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudseguros.AsNoTracking().Where(x => x.csolicitud == csolicitud && x.coperaciongarantia == coperaciongarantia).SingleOrDefault();
        }

        /// <summary>
        /// Elimina registros de seguros asociados a una solicitud.
        /// </summary>
        /// <param name="csolicitud">Numero de solicituud.</param>
        private static String JPQL_DELETE = "delete from TcarSolicitudSeguros where csolicitud = @csolicitud";
        public static void Delete(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("csolicitud", csolicitud));
        }

        /// <summary>
        /// Elimina registros de seguros asociados a una solicitud por codigo de garantia.
        /// </summary>
        /// <param name="csolicitud">Numero de solicituud.</param>
        /// <param name="coperaciongarantia">Numero de garantia.</param>
        private static String HPQL_DELETE = "delete from TcarSolicitudSeguros where csolicitud = @csolicitud and coperaciongarantia = @coperaciongarantia";
        public static void Delete(long csolicitud, string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(HPQL_DELETE, new SqlParameter("csolicitud", csolicitud), new SqlParameter("coperaciongarantia", coperaciongarantia));
        }

        /// <summary>
        /// Consulta el seguro asociado a una solicitud de credito por garantia.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="coperaciongarantia">Numero de garantia.</param>
        /// <returns>List TcarSolicitudSeguroDto</returns>
        public static decimal ValorPrima(long csolicitud, string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarsolicitudseguros solseg = contexto.tcarsolicitudseguros.AsNoTracking().Where(x => x.csolicitud == csolicitud && x.coperaciongarantia == coperaciongarantia).SingleOrDefault();
            return (solseg != null) ? (decimal)solseg.montoseguro : 0;
        }

        /// <summary>
        /// Consulta el seguro asociado a una solicitud de credito por garantia.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>valor</returns>
        public static decimal ValorAnticipo(long csolicitud, bool incluyeseguro)
        {
            decimal valor = Constantes.CERO;
            List<tcarsolicitudseguros> lseguros = TcarSolicitudSegurosDal.Find(csolicitud);
            foreach (tcarsolicitudseguros obj in lseguros) {
                if (!obj.formapago.Equals("A")) {
                    continue;
                }
                if (incluyeseguro) {
                    valor = decimal.Add(valor, decimal.Add((decimal)obj.montoanticipo, (decimal)obj.ajusteanticipo));
                } else {
                    valor = decimal.Add(valor, decimal.Subtract(decimal.Add((decimal)obj.montoanticipo, (decimal)obj.ajusteanticipo), (decimal)obj.montoseguro));
                }
            }
            return valor;
        }
    }
}
