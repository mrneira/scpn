using cartera.enums;
using dal.cartera;
using dal.generales;
using modelo;
using System.Collections.Generic;
using System.Data.SqlClient;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace cartera.lote.previo {
    // <summary>
    /// Clase que se encarga de obtener operaciones de cartera que se encuentran activas para generar descuentos
    /// </summary>
    public class Descuentos : ITareaPrevia {
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            // Valida fecha de ejecucion
            tcardescuentoscalendario calendario = TcarDescuentosCalendarioDal.FindEjecucion(requestmodulo.Fconatble);
            if (calendario != null) {

                // Control de archivos
                int particion = Constantes.GetParticion((int)requestmodulo.Ftrabajo);
                IList<tcardescuentosarchivo> larchivos = TcarDescuentosArchivoDal.Find(particion);
                foreach (tcardescuentosarchivo archivo in larchivos) {
                    if (!archivo.cdetalleestado.Equals(EnumEstatus.INGRESADA.Cestatus)) {
                        throw new AtlasException("BCAR-0032", "ARCHIVO {0} SE ENCUENTRA EN ESTADO {1}, NO PERMITE REPROCESAR",
                                                 TgenCatalogoDetalleDal.Find(archivo.archivoinstitucioncodigo, archivo.archivoinstituciondetalle).nombre,
                                                 TgenCatalogoDetalleDal.Find(archivo.ccatalogoestado, archivo.cdetalleestado).nombre);
                    }
                }

                // Registros de descuentos
                TcarOperacionLoteDal.Eliminar(requestmodulo, ctarea);
                Insertar(requestmodulo, ctarea, orden);
            }
        }

        /// <summary>
        /// Metodo que se encarga de insertar operaciones de cartera activas para descuentos.
        /// </summary>
        private void Insertar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_INSERT, new SqlParameter("fproceso", requestmodulo.Fconatble)
                                                           , new SqlParameter("clote", requestmodulo.Clote)
                                                           , new SqlParameter("cmodulo", requestmodulo.Cmodulo)
                                                           , new SqlParameter("ctarea", ctarea)
                                                           , new SqlParameter("orden", orden)
                                                           , new SqlParameter("numeroejecucion", requestmodulo.Numeroejecucion));
        }

        /// <summary>
        /// Sentencia que se encarga de insertar operaciones de cartera para descuentos.
        /// </summary>
        private static string JPQL_INSERT = "insert into TCAROPERACIONLOTE(COPERACION, FPROCESO, CLOTE, CMODULO, CTAREA, ORDEN, NUMEROEJECUCION ) "
                              + "select op.coperacion, @fproceso, @clote, @cmodulo, @ctarea, @orden, @numeroejecucion from tcaroperacion op "
                              + "where cestatus in (select cestatus from tcarestatus where esdescuento = 1)"
                              + "and not exists(select 1 from TCAROPERACIONLOTE tlos "
                              + "where tlos.COPERACION = op.COPERACION and tlos.FPROCESO = @fproceso and tlos.CLOTE = @clote "
                              + "and tlos.CMODULO = @cmodulo and tlos.CTAREA = @ctarea and tlos.EJECUTADA = '1')";
    }
}
