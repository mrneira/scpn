using dal.lote;
using dal.lote.contabilidad;
using modelo;
using System;
using System.Data.SqlClient;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace contabilidad.lote.previo
{
    /// <summary>
    /// Clase que se encarga de obtener registros de contabilidad a generar comprobantes y los inserta en TconRegistroLote.
    /// </summary>
    public class ContabilizacionModulos : ITareaPrevia {
        /// <summary>
        /// ejecuta la tarea previa contabilización de módulos
        /// </summary>
        /// <param name="requestmodulo"></param>
        /// <param name="ctarea"></param>
        /// <param name="orden"></param>
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden) {
            TconRegistroLoteDal.Eliminar(requestmodulo, ctarea); // elimina para la fecha de proceso o sea la contable
            Boolean errores = TloteResultadoPrevioDal.ExisteErrores(requestmodulo.Fconatble, requestmodulo.Numeroejecucion, requestmodulo.Clote, null, null);

            if (errores) {
                return;
            }
            Insertar(requestmodulo, ctarea, orden);
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera a realizar cobros para la fecha contable, el viernes se cobra cuentas cuya
        /// fecha de vencimiento es sabado o domingo.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden) {
            int fcontable = requestmodulo.Fconatble;
            int fcontabledesde = (int)requestmodulo.GetDatos("fcontabledesde");

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_INSERT, new SqlParameter("fproceso", requestmodulo.Fconatble), new SqlParameter("fcontabledesde", fcontabledesde)
                                                           , new SqlParameter("clote", requestmodulo.Clote)
                                                           , new SqlParameter("cmodulo", requestmodulo.Cmodulo), new SqlParameter("ctarea", ctarea)
                                                           , new SqlParameter("orden", orden));
	    }

        /// <summary>
        /// Sentencia que se encarga de insertar registros con los cuales se genera comprobantes contables automaticos.
        /// </summary>
        private static string JPQL_INSERT = "insert into TCONREGISTROLOTE  ( CREGISTRO, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN ) "
			    + "select distinct RIGHT('0'+ CONVERT(VARCHAR,tcp.csucursal),2) + '-' + RIGHT('0'+ CONVERT(VARCHAR,tcp.cagencia),2) + '-' + RIGHT('0'+ CONVERT(VARCHAR,tcp.cmodulo),2) + '-' + RIGHT('0000'+ CONVERT(VARCHAR,tcp.ctransaccion),4) + '-' + RIGHT('0' + CONVERT(VARCHAR,tcp.cmoduloproducto),2) + '-' + RIGHT('0' + CONVERT(VARCHAR,tcp.cproducto),2) + '-' + RIGHT('0' + CONVERT(VARCHAR,tcp.ctipoproducto),2) + '-' + RIGHT('00000000'+ CONVERT(VARCHAR,tcp.fcontable),8), "
                + " @fproceso, @clote, @cmodulo, @ctarea, @orden "
			    + " from TCONCOMPROBANTEPREVIO tcp  "
			    + " where tcp.fcontable > @fcontabledesde "
			    + " and not exists ( select 1 from TCONREGISTROLOTE tcrl "
			    + "        where tcrl.CREGISTRO = RIGHT('0'+ CONVERT(VARCHAR,tcp.csucursal),2) + '-' + RIGHT('0'+ CONVERT(VARCHAR,tcp.cagencia),2) + '-' + RIGHT('0'+ CONVERT(VARCHAR,tcp.cmodulo),2) + '-' + RIGHT('0000'+ CONVERT(VARCHAR,tcp.ctransaccion),4) + '-' + RIGHT('0' + CONVERT(VARCHAR,tcp.cmoduloproducto),2) + '-' + RIGHT('0' + CONVERT(VARCHAR,tcp.cproducto),2) + '-' + RIGHT('0' + CONVERT(VARCHAR,tcp.ctipoproducto),2) + '-' + RIGHT('00000000'+ CONVERT(VARCHAR,tcp.fcontable),8) "
                + "        and tcrl.FPROCESO = @fproceso and tcrl.CLOTE = @clote "
			    + "        and tcrl.CMODULO = @cmodulo and tcrl.CTAREA = @ctarea and tcrl.EJECUTADA = '1' )";

        }


}
