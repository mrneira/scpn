using core.servicios.consulta;
using dal.seguridades;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;
using core.componente;

namespace seguridad.comp.consulta.audit {

    /// <summary>
    /// Clase que se encarga de consultar la auditoria.
    /// </summary>
    public class Auditoria : ComponenteConsulta {

        private static String JPQL_AUDIT_INSDEL = " select t.freal, t.tabla, t.pkregistro, t.cusuario, t.cterminal, "
			+ "(select a.nombre from tgentransaccion a where a.cmodulo=t.cmodulo and a.ctransaccion=t.ctransaccion) ntran, "
			+ "(select a.nombre from tgenagencia a where a.csucursal=t.csucursal and a.cagencia=t.cagencia) nage, "
			+ "t.valorregistro, t.valoretiqueta, (case t.creado_eliminado when 1 THEN 'CREADO' ELSE 'ELIMINADO' END) tipo from tsegauditoriainsdel t ";

	    private static String JPQL_AUDIT = " select t.freal, t.tabla, t.pkregistro, t.cusuario, t.cterminal, "
            + "(select a.nombre from tgentransaccion a where a.cmodulo=t.cmodulo and a.ctransaccion=t.ctransaccion) ntran, "
			+ "(select a.nombre from tgenagencia a where a.csucursal=t.csucursal and a.cagencia=t.cagencia) nage, "
			+ "t.valorregistro, t.valoretiqueta, 'MODIFICADO' tipo from tsegauditoria t ";



        private static String JPQL_AUDIT_ROL_INSDEL = " select t.freal, t.tabla, t.pkregistro, t.cusuario, t.cterminal, "
            + "(select a.nombre from tgentransaccion a where a.cmodulo=t.cmodulo and a.ctransaccion=t.ctransaccion) ntran, "
			+ "(select a.nombre from tgenagencia a where a.csucursal=t.csucursal and a.cagencia=t.cagencia) nage, "
			+ "t.valorregistro, t.valoretiqueta, (case t.creado_eliminado when 1 THEN 'CREADO' ELSE 'ELIMINADO' END) tipo, "
            + "JSON_VALUE(t.valoretiqueta, '$.nrol') as nrol, "
            + "(CASE WHEN t.tabla='TSEGROLOPCIONES' THEN "
			+ " JSON_VALUE(t.valoretiqueta, '$.ntransaccion')"
            + "ELSE '' END) ntranaf "
			+ "from tsegauditoriainsdel t ";

	private static String JPQL_AUDIT_ROL = " select t.freal, t.tabla, t.pkregistro, t.cusuario, t.cterminal, "
            + "(select a.nombre from tgentransaccion a where a.cmodulo=t.cmodulo and a.ctransaccion=t.ctransaccion) ntran, "
			+ "(select a.nombre from tgenagencia a where a.csucursal=t.csucursal and a.cagencia=t.cagencia) nage, "
			+ "t.valorregistro, t.valoretiqueta, 'MODIFICADO' tipo, "
            + "JSON_VALUE(t.valoretiqueta, '$.nrol') as nrol,"
            + "(CASE WHEN t.tabla='TSEGROLOPCIONES' THEN "
			+ " JSON_VALUE(t.valoretiqueta, '$.ntransaccion') "
            + "ELSE '' END) ntranaf "
			+ "from tsegauditoria t ";



	private static String JPQL_AUDIT_USU_INSDEL = " select t.freal, t.tabla, t.pkregistro, t.cusuario, t.cterminal, "
            + "(select a.nombre from tgentransaccion a where a.cmodulo=t.cmodulo and a.ctransaccion=t.ctransaccion) ntran, "
			+ "(select a.nombre from tgenagencia a where a.csucursal=t.csucursal and a.cagencia=t.cagencia) nage, "
			+ "t.valorregistro, t.valoretiqueta, (case t.creado_eliminado when 1 THEN 'CREADO' ELSE 'ELIMINADO' END) tipo, "
            + "(CASE WHEN t.tabla='TSEGUSUARIOROL' THEN (JSON_VALUE(t.valoretiqueta, '$.nrol')) ELSE '' END) nrol,"
            + "JSON_VALUE(t.pkregistro, '$.f[0].v') as cusuarioaf  "
            + "from tsegauditoriainsdel t ";

	private static String JPQL_AUDIT_USU = " select t.freal, t.tabla, t.pkregistro, t.cusuario, t.cterminal, "
            + "(select a.nombre from tgentransaccion a where a.cmodulo=t.cmodulo and a.ctransaccion=t.ctransaccion) ntran, "
			+ "(select a.nombre from tgenagencia a where a.csucursal=t.csucursal and a.cagencia=t.cagencia) nage, "
			+ "t.valorregistro, t.valoretiqueta, 'MODIFICADO' tipo, "
            + "(CASE WHEN t.tabla='TSEGUSUARIOROL' THEN (JSON_VALUE(t.valoretiqueta, '$.nrol')) ELSE '' END) nrol, "
            + "JSON_VALUE(t.pkregistro, '$.f[0].v') as cusuarioaf "
            + "from tsegauditoria t ";

	private static String JPQL_AUDIT_ORDER = " order by freal";

        /// <summary>
        /// Arma y entrega el menu.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            DtoConsulta dtoconsulta = rqconsulta.Mconsulta["AUDIT"];
 
            MotorConsulta m = new MotorConsulta();
            String JOIN_JSON = "";
            if (dtoconsulta.Lfiltroesp.Count>0) {
                JOIN_JSON = " CROSS APPLY OPENJSON(t.pkregistro, '$.f') AS pk CROSS APPLY OPENJSON(t.valorregistro, '$.f') AS f ";
            }
            m.ArmaRestriccionesNativo(dtoconsulta, true);

            String sql = Auditoria.JPQL_AUDIT_INSDEL + " where " + m.Where + " UNION " + Auditoria.JPQL_AUDIT + " where " + m.Where + Auditoria.JPQL_AUDIT_ORDER;
            if (rqconsulta.Ctransaccion.CompareTo(101) == 0) {
                sql = Auditoria.JPQL_AUDIT_ROL_INSDEL + JOIN_JSON + " where " + m.Where + " UNION " + Auditoria.JPQL_AUDIT_ROL + JOIN_JSON + " where " + m.Where + Auditoria.JPQL_AUDIT_ORDER;
            } else if (rqconsulta.Ctransaccion.CompareTo(103) == 0) {
                sql = Auditoria.JPQL_AUDIT_USU_INSDEL + JOIN_JSON + " where " + m.Where + " UNION " + Auditoria.JPQL_AUDIT_USU + JOIN_JSON + " where " + m.Where + Auditoria.JPQL_AUDIT_ORDER;
            }

            IList<Dictionary<string, object>> l = m.EjecutarConsultaNativa(dtoconsulta, sql);

            rqconsulta.Response.Add("AUDIT", l);
        }


    }
}
