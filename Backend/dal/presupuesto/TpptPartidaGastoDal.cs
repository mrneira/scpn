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

    public class TpptPartidaGastoDal
    {

        /// <summary>
        /// Entrega datos de una partida de gasto
        /// </summary>
        /// <param name="cpartidagasto">Codigo de partida de gasto.</param>
        /// <returns></returns>
        public static tpptpartidagasto Find(string cpartidagasto, int aniofiscal)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpptpartidagasto obj = null;
            obj = contexto.tpptpartidagasto.Where(x => x.cpartidagasto.Equals(cpartidagasto) && x.aniofiscal == aniofiscal).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static List<tpptpartidagasto> ListarPartidas(int aniofiscal)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tpptpartidagasto> lpartidagasto = new List<tpptpartidagasto>();
            lpartidagasto = contexto.tpptpartidagasto.AsNoTracking().Where(x => x.aniofiscal == aniofiscal).ToList();
            return lpartidagasto;
        }

        public static int DevolverMaximoNivel(int aniofiscal)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int maxNivel = 0;
            maxNivel = contexto.tpptpartidagasto.Where(x => x.aniofiscal == aniofiscal).Max(x => x.nivel);
            return maxNivel;
        }

        public static void CalcularPartidasGasto(int aniofiscal)
        {
            //actualizacion de partidas de movimiento
            string SQL_UPD_PARTIDAS_MOVIMIENTO = " UPDATE 	t " +
                " SET t.porcenparticipacion = t2.porcen " +
                " FROM tpptpartidagasto t " +
                " INNER JOIN(SELECT cpartidagasto, (vcodificado / sum(vcodificado) OVER()) * 100 AS PORCEN " +
                "           FROM tpptpartidagasto t2 " +
                "           where t2.movimiento = 1 AND t2.aniofiscal = @aniofiscal) t2 " +
                " ON t.cpartidagasto = t2.cpartidagasto " +
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

            string SQL_UPD_ROLL_UP = " UPDATE 	t  " +
                            " SET 	t.porcenparticipacion = t2.porcen, t.vcodificado = t2.codifi, t.vpagado = t2.pagado " +
                            " FROM 	tpptpartidagasto t " +
                            " INNER JOIN (SELECT t2.padre, sum(t2.porcenparticipacion) AS PORCEN, sum(t2.vcodificado) as codifi, sum(t2.vpagado) as pagado " +
                            "			FROM tpptpartidagasto t2 " +
                            "			where t2.nivel = @nivel and t2.aniofiscal = @aniofiscal " +
                            "			GROUP BY t2.padre) t2 " +
                            " ON t.cpartidagasto = t2.padre " +
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

            ActualizarPorcentajesEjecucionPartidasGasto(aniofiscal);
        }


        public static void ActualizarPorcentajesEjecucionPartidasGasto(int aniofiscal)
        {
            //actualizacion de partidas de movimiento
            string SQL_UPD_PARTIDAS = " UPDATE tpptpartidagasto " +
                " SET porcenejecucion = (vpagado / vcodificado) * 100 " +
                " WHERE aniofiscal = @aniofiscal and vcodificado <> 0 ";
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

        public static tpptclasificador FindClasificador(string cclasificador)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpptclasificador obj = null;
            obj = contexto.tpptclasificador.Where(x => x.cclasificador.Equals(cclasificador)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static List<tpptpartidagasto> FindListaAniofiscal(int aniofiscal)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tpptpartidagasto> lista = new List<tpptpartidagasto>();
            lista = contexto.tpptpartidagasto.AsNoTracking().Where(x => x.aniofiscal == aniofiscal).ToList();
            return lista;
        }

        /// <summary>
        /// Metodo que se encarga de eliminar registros de la tabla de saldos cierre de presupuesto GASTO para la fcierre enviada
        /// </summary>
        /// <param name="fcierre">Fecha de cierre (INTEGER)</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        public static void Eliminar(int fcierre, int ccompania)
        {
            string SQL_DELETE = "delete from TpptSaldosCierrepg  where fcierre = @fcierre and ccompania = @ccompania ";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                contexto.Database.ExecuteSqlCommand(SQL_DELETE, new SqlParameter("@fcierre", fcierre),
                                                    new SqlParameter("@ccompania", ccompania));
            }
            catch (System.InvalidOperationException)
            {
                return;
            }
        }

        /// <summary>
        /// Metodo que se encarga de insertar registros de saldos de presupuesto de gasto al cierre de mes.
        /// </summary>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario</param>
        /// <param name="fcierre">Fecha con la cual se inserta los saldos en TCONSALDOSCIERRE</param>
        public static void InsertarSaldosMensuales(int ccompania, int fcierre)
        {
            string SQL_INSERT_TCONSALDOSCIERREPRESUPUESTO = " INSERT INTO tpptsaldoscierrepg " +
                " SELECT @fcierre, pg.cpartidagasto,@particion,pg.aniofiscal,pg.cclasificador,pg.ccompania, " +
                " pg.padre,pg.nivel,pg.movimiento,pg.nombre,pg.vasignacioninicial,pg.vmodificado,pg.vcodificado, " +
                " pg.vcomprometido,pg.vdevengado,pg.vpagado,pg.vsaldoporcomprometer,pg.vsaldopordevengar, " +
                " pg.vsaldoporpagar, pg.porcenejecucion, pg.porcenparticipacion " +
                " FROM tpptpartidagasto pg " +
                " WHERE pg.aniofiscal = @aniofiscal";

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int particion = Constantes.GetParticion(fcierre);
            int aniofiscal = Fecha.GetAnio(fcierre);
            try
            {
                contexto.Database.ExecuteSqlCommand(SQL_INSERT_TCONSALDOSCIERREPRESUPUESTO, new SqlParameter("@fcierre", fcierre),
                                                                new SqlParameter("@particion", particion),
                                                                new SqlParameter("@aniofiscal", aniofiscal));
            }
            catch (System.InvalidOperationException)
            {
                return;
            }

        }

        public static void ActulizarAfectaCertificacion(RqMantenimiento rqmantenimiento, tpptpartidagasto pg, tpptcertificaciondetalle certificaciondetalle)
        {
            TpptPartidaGastoHistoriaDal.CreaHistoria(pg, rqmantenimiento.Fconatable);
            decimal valor = certificaciondetalle.valor;
            pg.vcertificado = pg.vcertificado.GetValueOrDefault() + valor;
            //pg.vsaldoporcomprometer = pg.vsaldoporcomprometer.GetValueOrDefault() - valor; //CCA 20230111 duplica certificado
            pg.vsaldoporcertificar = pg.vsaldoporcertificar - valor;
            if (pg.vcertificado.GetValueOrDefault() > pg.vcodificado.GetValueOrDefault())
            {
                throw new AtlasException("PPTO-006", "VALOR CERTIFICADO: {0} NO PUEDE SER MAYOR AL VALOR CODIFICADO: {0} ", pg.vcertificado, pg.vcodificado);
            }
        }

        public static void ActulizarAfectaEliminarCertificacion(RqMantenimiento rqmantenimiento, tpptpartidagasto pg, tpptcertificaciondetalle certificaciondetalle)
        {
            TpptPartidaGastoHistoriaDal.CreaHistoria(pg, rqmantenimiento.Fconatable);
            decimal valor = certificaciondetalle.valor;
            pg.vcertificado = pg.vcertificado.GetValueOrDefault() - valor;
            pg.vsaldoporcomprometer = pg.vsaldoporcomprometer.GetValueOrDefault() + valor;
            pg.vsaldoporcertificar = pg.vsaldoporcertificar + valor;
            if (pg.vcertificado.GetValueOrDefault() > pg.vcodificado.GetValueOrDefault())
            {
                throw new AtlasException("PPTO-006", "VALOR CERTIFICADO: {0} NO PUEDE SER MAYOR AL VALOR CODIFICADO: {0} ", pg.vcertificado, pg.vcodificado);
            }
        }

    }
}