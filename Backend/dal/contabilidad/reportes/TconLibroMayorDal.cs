using util.dto.consulta;
using System.Collections.Generic;
using modelo;
using modelo.servicios;
using util.servicios.ef;

namespace dal.contabilidad.reportes
{
    public class TconLibroMayorDal
    {
        /// <summary>
        /// ejecuta la consulta de libro mayor
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetLibroMayor(RqConsulta rqconsulta)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            //

            string lstrConComSalAgencia;

            string lstrConComAgencia;

            if (int.Parse(rqconsulta.Mdatos["oficina"].ToString()) != -1)
            {
                lstrConComSalAgencia = "' and tconcomsal.cagencia = " +
                    rqconsulta.Mdatos["oficina"];

                lstrConComAgencia = "' and tconcom.cagencia = " +
                    rqconsulta.Mdatos["oficina"];
            }
            else
            {
                lstrConComSalAgencia = "'";

                lstrConComAgencia = "'";
            }

            string lstrConComDetSalCentroCosto;

            string lstrConComDetCentroCosto;

            if (rqconsulta.Mdatos["centrocosto"].ToString() == "||")
            {
                lstrConComDetSalCentroCosto = "";
                lstrConComDetCentroCosto = "";
            }
            else
            {
                lstrConComDetSalCentroCosto = " and tconcomdetsal.centrocostoscdetalle = '" +
                    rqconsulta.Mdatos["centrocosto"] + "'";

                lstrConComDetCentroCosto = " and tconcomdet.centrocostoscdetalle = '" +
                    rqconsulta.Mdatos["centrocosto"] + "'"; 
            }

            string lSQL = "select a.RowNumber, a.oficina, a.centrodecosto, a.fecha, a.comprobante, a.numerocomprobantecesantia, a.asiento, a.debito, a.credito,(select SUM(c.saldo) from (select b.RowNumber, b.saldo from (select 0 RowNumber, ISNULL(SUM(case when tconcomdetsal.debito = 0 then tconcomdetsal.monto else 0 end),0) - ISNULL(SUM(case when tconcomdetsal.debito = 1 then tconcomdetsal.monto else 0 end),0) saldo from tconcomprobante tconcomsal inner join tconcomprobantedetalle tconcomdetsal on tconcomsal.ccomprobante = tconcomdetsal.ccomprobante and tconcomsal.fcontable = tconcomdetsal.fcontable and tconcomsal.particion = tconcomdetsal.particion and tconcomsal.ccompania = tconcomdetsal.ccompania  where tconcomdetsal.ccuenta = '" + 
                rqconsulta.Mdatos["ccuenta"] +
                lstrConComSalAgencia +
                lstrConComDetSalCentroCosto +
                " and tconcomsal.fcontable < " +
                rqconsulta.Mdatos["finicio"] +
                " and tconcomsal.eliminado = 0 and tconcomsal.actualizosaldo = 1 union select ROW_NUMBER() OVER(ORDER BY tconcomsal.fcontable, tconcomsal.ccomprobante, tconcomsal.particion, tconcomsal.ccompania, tconcomdetsal.secuencia ASC) AS RowNumber, isnull(case when tconcomdetsal.debito = 0 then tconcomdetsal.monto else 0 end,0) - isnull(case when tconcomdetsal.debito = 1 then tconcomdetsal.monto else 0 end,0) saldo from tconcomprobante tconcomsal inner join tconcomprobantedetalle tconcomdetsal on tconcomsal.ccomprobante = tconcomdetsal.ccomprobante and tconcomsal.fcontable = tconcomdetsal.fcontable and tconcomsal.particion = tconcomdetsal.particion and tconcomsal.ccompania = tconcomdetsal.ccompania where tconcomdetsal.ccuenta = '" + 
                rqconsulta.Mdatos["ccuenta"] +
                lstrConComSalAgencia +
                lstrConComDetSalCentroCosto + 
                " and tconcomsal.fcontable between " + 
                rqconsulta.Mdatos["finicio"]+
                " and " + 
                rqconsulta.Mdatos["ffin"] +
                " and tconcomsal.eliminado = 0 and tconcomsal.actualizosaldo = 1) b) c where c.RowNumber <= a.RowNumber) saldo, a.descripcion, a.cuentacodigo, a.cuentanombre, a.digitador from (select 0 RowNumber, " + 
                rqconsulta.Mdatos["oficina"] + 
                " oficina, '" + 
                rqconsulta.Mdatos["centrocosto"] + 
                "' centrodecosto, (year(DATEADD(DD,-1, cast(str(" + 
                rqconsulta.Mdatos["finicio"] + 
                ") as date))) * 10000) + (month(DATEADD(DD,-1, cast(str(" + 
                rqconsulta.Mdatos["finicio"]+ 
                ") as date))) * 100) + day(DATEADD(DD,-1, cast(str(" + 
                rqconsulta.Mdatos["finicio"]+ 
                ") as date))) fecha, '' comprobante, '' numerocomprobantecesantia, 0 asiento, 0 debito, 0 credito, '' descripcion, '" + 
                rqconsulta.Mdatos["ccuenta"] + 
                "' cuentacodigo, '' cuentanombre, NULL digitador, left(ltrim(str(" + 
                rqconsulta.Mdatos["finicio"]+ 
                ")),4) + '/' + right(left(ltrim(str(" + 
                rqconsulta.Mdatos["finicio"]+ 
                ")),6),2)  + '/' + right(left(ltrim(str(" + 
                rqconsulta.Mdatos["finicio"]+ 
                ")),8),2) fechainicial, left(ltrim(str(" + 
                rqconsulta.Mdatos["ffin"]+ ")),4) + '/' + right(left(ltrim(str(" + 
                rqconsulta.Mdatos["ffin"]+ ")),6),2)  + '/' + right(left(ltrim(str(" + 
                rqconsulta.Mdatos["ffin"]+ ")),8),2) fechafinal, ISNULL(SUM(case when tconcomdet.debito = 0 then tconcomdet.monto else 0 end),0) - ISNULL(SUM(case when tconcomdet.debito = 1 then tconcomdet.monto else 0 end),0) saldo from tconcomprobante tconcom inner join tconcomprobantedetalle tconcomdet on tconcom.ccomprobante = tconcomdet.ccomprobante and tconcom.fcontable = tconcomdet.fcontable and tconcom.particion = tconcomdet.particion and tconcom.ccompania = tconcomdet.ccompania where tconcomdet.ccuenta = '" + 
                rqconsulta.Mdatos["ccuenta"] +
                lstrConComAgencia +
                lstrConComDetCentroCosto + 
                " and tconcom.fcontable < " + 
                rqconsulta.Mdatos["finicio"]+
                " and tconcom.eliminado = 0 and tconcom.actualizosaldo = 1 union select ROW_NUMBER() OVER(ORDER BY tconcom.fcontable, tconcom.ccomprobante, tconcom.particion, tconcom.ccompania, tconcomdet.secuencia ASC) AS RowNumber, tconcom.cagencia oficina, tconcomdet.centrocostoscdetalle centrodecosto, tconcom.fcontable fecha, tconcom.ccomprobante comprobante, tconcom.numerocomprobantecesantia numerocomprobantecesantia, tconcomdet.secuencia asiento, case when tconcomdet.debito = 1 then tconcomdet.monto else 0 end debito, case when tconcomdet.debito = 0 then tconcomdet.monto else 0 end credito, isnull(tconcon.nombre + '.  ','') + isnull(tconcom.comentario,'') descripcion, tconcomdet.ccuenta cuentacodigo, tconcat.nombre cuentanombre, case when tconcom.cusuariomod is null then tconcom.cusuarioing else tconcom.cusuariomod end digitador, left(ltrim(str(" + 
                rqconsulta.Mdatos["finicio"]+ 
                ")),4) + '/' + right(left(ltrim(str(" + 
                rqconsulta.Mdatos["finicio"]+ 
                ")),6),2)  + '/' + right(left(ltrim(str(" + 
                rqconsulta.Mdatos["finicio"]+ 
                ")),8),2) fechainicial, left(ltrim(str(" + 
                rqconsulta.Mdatos["ffin"]+ 
                ")),4) + '/' + right(left(ltrim(str(" + 
                rqconsulta.Mdatos["ffin"]+ 
                ")),6),2)  + '/' + right(left(ltrim(str(" + 
                rqconsulta.Mdatos["ffin"]+ 
                ")),8),2) fechafinal, 0 saldo from tconcomprobante tconcom inner join tconcomprobantedetalle tconcomdet on tconcom.ccomprobante = tconcomdet.ccomprobante and tconcom.fcontable = tconcomdet.fcontable and tconcom.particion = tconcomdet.particion and tconcom.ccompania = tconcomdet.ccompania left outer join tconcatalogo tconcat on tconcat.cclase = tconcomdet.cclase and tconcat.ccompania = tconcomdet.ccompania  and tconcat.ccuenta  = tconcomdet.ccuenta left outer join tconconcepto tconcon on tconcom.cconcepto = tconcon.cconcepto and tconcom.ccompania = tconcon.ccompania where tconcomdet.ccuenta = '" + 
                rqconsulta.Mdatos["ccuenta"] +
                lstrConComAgencia +
                lstrConComDetCentroCosto + 
                " and tconcom.fcontable between " + 
                rqconsulta.Mdatos["finicio"]+ 
                " and " + 
                rqconsulta.Mdatos["ffin"]+
                " and tconcom.eliminado = 0 and tconcom.actualizosaldo = 1 ) a order by a.RowNumber";

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);
            ch.registrosporpagina = 1000;
            IList<Dictionary<string, object>> listaLibroMayor = ch.GetRegistrosDictionary();
            return listaLibroMayor;

        }

    }
}
