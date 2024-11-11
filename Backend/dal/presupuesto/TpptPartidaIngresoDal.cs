using dal.generales;
using dal.monetario;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.presupuesto
{

    public class TpptPartidaIngresoDal {

        /// <summary>
        /// Entrega datos de una partida de ingreso
        /// </summary>
        /// <param name="cpartidaingreso">Codigo de partida de ingreso.</param>
        /// <returns></returns>
        public static tpptpartidaingreso Find(string cpartidaingreso, int aniofiscal)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpptpartidaingreso obj = null;
            obj = contexto.tpptpartidaingreso.Where(x => x.cpartidaingreso.Equals(cpartidaingreso) && x.aniofiscal == aniofiscal).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static int DevolverMaximoNivel(int aniofiscal)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int maxNivel = 0;
            maxNivel = contexto.tpptpartidaingreso.Where(x => x.aniofiscal == aniofiscal).Max(x => x.nivel);
            return maxNivel;
        }

        public static void CalcularPartidasIngreso(int aniofiscal)
        {
            //actualizacion de partidas de movimiento
            string SQL_UPD_PARTIDAS_MOVIMIENTO = " UPDATE 	t " +
                " SET t.porcenparticipacion = t2.porcen " +
                " FROM tpptpartidaingreso t " +
                " INNER JOIN(SELECT cpartidaingreso, (montototal / sum(montototal) OVER()) * 100 AS PORCEN " +
                "           FROM tpptpartidaingreso t2 " +
                "           where t2.movimiento = 1 AND t2.aniofiscal = @aniofiscal) t2 " +
                " ON t.cpartidaingreso = t2.cpartidaingreso " +
                " WHERE t.aniofiscal = @aniofiscal ";

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                contexto.Database.ExecuteSqlCommand(SQL_UPD_PARTIDAS_MOVIMIENTO, new SqlParameter("@aniofiscal", aniofiscal));
            }
            catch (System.InvalidOperationException)
            {
                return;
            }


            //RollUp de partidas
            string SQL_UPD_ROLL_UP = " UPDATE 	t  " +
                            " SET 	t.porcenparticipacion = t2.porcen, t.montototal = t2.summonto, t.valordevengado = t2.sumdevengado " +
                            " FROM 	tpptpartidaingreso t " +
                            " INNER JOIN (SELECT t2.padre, sum(t2.porcenparticipacion) AS PORCEN , sum(t2.montototal) as summonto, sum(t2.valordevengado) as sumdevengado" +
                            "			FROM tpptpartidaingreso t2 " +
                            "			where t2.nivel = @nivel and t2.aniofiscal = @aniofiscal " +
                            "			GROUP BY t2.padre) t2 " +
                            " ON t.cpartidaingreso = t2.padre " +
                            " WHERE t.aniofiscal = @aniofiscal ";
            int maxNivel = DevolverMaximoNivel(aniofiscal);
            for (int nivel = maxNivel; nivel >= 0; nivel--)
            {
                try
                {
                    contexto.Database.ExecuteSqlCommand(SQL_UPD_ROLL_UP, new SqlParameter("@aniofiscal", aniofiscal),
                                                                        new SqlParameter("@nivel", nivel));
                }
                catch (System.InvalidOperationException)
                {
                    return;
                }
            }

            ActualizarPorcentajesEjecucionPartidaIngreso(aniofiscal);
        }


        public static void ActualizarPorcentajesEjecucionPartidaIngreso(int aniofiscal)
        {
            //actualizacion de partidas de movimiento
            string SQL_UPD_PARTIDAS = " UPDATE tpptpartidaingreso " +
                " SET porcenejecucion = (valordevengado / montototal) * 100 " +
                " WHERE aniofiscal = @aniofiscal ";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                contexto.Database.ExecuteSqlCommand(SQL_UPD_PARTIDAS, new SqlParameter("@aniofiscal", aniofiscal));
            }
            catch (System.InvalidOperationException)
            {
                return;
            }
        }

        public static tpptclasificador FindClasificador(string cclasificador) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpptclasificador obj = null;
            obj = contexto.tpptclasificador.Where(x => x.cclasificador.Equals(cclasificador)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static List<tpptpartidaingreso> FindListaAniofiscal(int aniofiscal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tpptpartidaingreso> lista = new List<tpptpartidaingreso>();
            lista = contexto.tpptpartidaingreso.AsNoTracking().Where(x => x.aniofiscal == aniofiscal).ToList();
            return lista;
        }

        /// <summary>
        /// Metodo que se encarga de eliminar registros de la tabla de saldos cierre de presupuesto INGRESO para la fcierre enviada
        /// </summary>
        /// <param name="fcierre">Fecha de cierre (INTEGER)</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        public static void Eliminar(int fcierre, int ccompania) {
            string SQL_DELETE = "delete from TpptSaldosCierrepi  where fcierre = @fcierre and ccompania = @ccompania ";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_DELETE, new SqlParameter("@fcierre", fcierre),
                                                    new SqlParameter("@ccompania", ccompania));
            } catch (System.InvalidOperationException) {
                return;
            }
        }

        /// <summary>
        /// Metodo que se encarga de insertar registros de saldos de presupuesto de ingreso al cierre de mes.
        /// </summary>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario</param>
        /// <param name="fcierre">Fecha con la cual se inserta los saldos en TCONSALDOSCIERRE</param>
        public static void InsertarSaldosMensuales(int ccompania, int fcierre) {
            string SQL_INSERT_TCONSALDOSCIERREPRESUPUESTO = "INSERT INTO tpptsaldoscierrepi " +
                " SELECT @fcierre,pi.cpartidaingreso,@particion, pi.aniofiscal,pi.cclasificador,pi.ccompania,  " +
                " pi.padre,pi.nivel,pi.movimiento,pi.nombre,pi.valormensual,pi.numeromeses,pi.montototal, " +
                " pi.valordevengado,pi.porcenparticipacion,pi.porcenejecucion " +
                " FROM tpptpartidaingreso pi " +
                " WHERE pi.aniofiscal = @aniofiscal";

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int particion = Constantes.GetParticion(fcierre);
            int aniofiscal = Fecha.GetAnio(fcierre);
            try {
                contexto.Database.ExecuteSqlCommand(SQL_INSERT_TCONSALDOSCIERREPRESUPUESTO, new SqlParameter("@fcierre", fcierre),
                                                                new SqlParameter("@particion", particion),
                                                                new SqlParameter("@aniofiscal", aniofiscal));
            } catch (System.InvalidOperationException) {
                return;
            }

        }

    }

}
