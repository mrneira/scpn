using modelo;
using System;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.lote;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que inserta los saldos de cierre de cartera
    /// </summary>
    public class TcarSaldoCierreDal {
        /// <summary>
        /// Insertar saldos de cierre.
        /// </summary>
        public static void InsertarSaldos(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                var fcierre = new SqlParameter("@i_fcierre", requestmodulo.Fconatble);
                var particion = new SqlParameter("@i_particion", requestmodulo.Fconatble.ToString().Substring(0, 6));
                ((IObjectContextAdapter)contexto).ObjectContext.CommandTimeout = 300;
                contexto.Database.ExecuteSqlCommand("exec sp_CarLoteSaldosCierre @i_fcierre, @i_particion", fcierre, particion);
            }
            catch (InvalidOperationException) {
                throw;
            }
        }

        public static void ActualizarCobranzas(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            string sql = string.Format("UPDATE tcobcobranza SET " +
            "cuotasvencidas = sal.numerocuotasvencidas, " +
            "montovencido = sal.montovencido, " +
            "diasvencidos = sal.diasvencido " +
            "FROM tcobcobranza cob,tcarsaldoscierre sal " +
            "WHERE sal.coperacion = cob.coperacion AND " +
            "sal.fcierre = {0} AND " +
            "cob.cestatus IN('ING','ASI')", requestmodulo.Fconatble);
            contexto.Database.ExecuteSqlCommand(sql);
        }


        public static tcarsaldoscierre Find(string coperacion, int fcierre)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarsaldoscierre obj = contexto.tcarsaldoscierre.Where(x => x.coperacion == coperacion && x.fcierre == fcierre).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BCAR-0001", "OPERACION DE CARTERA: {0} NO EXISTE", coperacion ?? "");
            }
            return obj;
        }

    }
}
