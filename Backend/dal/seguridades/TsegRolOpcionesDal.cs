using modelo;
using modelo.interfaces;
using modelo.servicios;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using util.servicios.ef;
using modelo.helper;
using System.Linq;
using System.Data.SqlClient;

namespace dal.seguridades {

    public class TsegRolOpcionesDal {

        private static String SQL = "select tsgo.copcion, tsgo.nombre, tsgo.copcionpadre, tsgo.cmodulo, "
            + " tsgo.ctransaccion, tsgo.orden, tsgo.mostrarenmenu, tsgo.crear, tsgo.editar, tsgo.eliminar, "
            + " (select tgt.nombre from TgenTransaccion tgt "
            + "  where tgt.ctransaccion = tsgo.ctransaccion and tgt.cmodulo = tsgo.cmodulo) as nombretran, "
            + " (select tgt.pagina from TgenTransaccion tgt where tgt.ctransaccion = tsgo.ctransaccion "
            + "  and tgt.cmodulo = tsgo.cmodulo) as pagina, "
            + " (select tgt.autoconsulta from TgenTransaccion tgt "
            + "  where tgt.ctransaccion = tsgo.ctransaccion and tgt.cmodulo = tsgo.cmodulo) as autoconsulta "
            + " from TsegRolOpciones tsgo "
            + " where tsgo.crol = @crol and tsgo.ccompania = @ccompania "
            + " and tsgo.activo = 1 order by tsgo.orden ";


        private static String SQLMODULO = "SELECT distinct o.cmodulo, m.nombre, m.rutaayuda"
                + " FROM tsegrolopciones o, tsegusuariorol ts, tgenmodulo m"
                + " WHERE m.cmodulo=o.cmodulo AND o.crol = ts.crol"
                + " AND ts.verreg = 0"
                + " AND o.ccompania = ts.ccompania"
                + " AND o.ccompania= @ccompania"
                + " AND ts.cusuario = @cusuario";
        /// <summary>
        /// Entrega una lista de opciones de menu.
        /// </summary>
        /// <param name="crol">Codigo de rol.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> Find(int crol, int ccompania) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@crol"] = crol;
            parametros["@ccompania"] = ccompania;
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL);
            ch.registrosporpagina = 1000;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        /// <summary>
        /// Entrega una lista de módulos que contiene un menú.
        /// </summary>
        /// <param name="crol">Codigo de rol.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindModulos(string cusuario, int ccompania)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cusuario"] = cusuario;
            parametros["@ccompania"] = ccompania;
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQLMODULO);
            ch.registrosporpagina = 1000;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }


        /// <summary>
        /// Entrega una lista de opciones del menu, dado su identificador.
        /// </summary>
        /// <param name="icopcion">Codigo de la opción.</param>
        /// <returns>tsegrolopciones</returns>
        private static tsegrolopciones FindXCopcion(String icopcion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsegrolopciones obj = contexto.tsegrolopciones.AsNoTracking().Where(x => x.copcion.Equals(icopcion)).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }

            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Activa o inactiva los campos mostrarmenu y activo, de una opción dada.
        /// </summary>
        /// <param name="icopcion">Codigo de la opción.</param>
        /// <param name="imostrarmenu">Bandera para mostrar en el menú.</param>
        /// <param name="iactivo">Bandera para activar o desactivar la opción.</param>
        /// <returns></returns>
        public static void ActivarXCopcion(string icopcion, bool imostrarmenu, bool iactivo, string cusuario)
        {

            tsegrolopciones tSegRolOpciones = FindXCopcion(icopcion);
            if (tSegRolOpciones != null)
            {
                tSegRolOpciones.mostrarenmenu = imostrarmenu;
                tSegRolOpciones.activo = iactivo;
                tSegRolOpciones.fmodificacion = DateTime.Now;
                tSegRolOpciones.cusuariomod = cusuario;
                Sessionef.Actualizar(tSegRolOpciones);
            }
        }

        private static String UPDATEActivacion = "update tsegrolopciones set mostrarenmenu = @mostrarenmenu, activo = @activo, fmodificacion = getdate(), cusuariomod = @cusuariomod where copcionpadre = @copcionpadre ";

        /// <summary>
        /// Activa o inactiva los campos mostrarmenu y activo, de una opción padre dada.
        /// </summary>
        /// <param name="icopcionPadre">Codigo de la opción padre.</param>
        /// <param name="imostrarmenu">Bandera para mostrar en el menú.</param>
        /// <param name="iactivo">Bandera para activar o desactivar la opción.</param>
        /// <returns></returns>
        public static void ActivarXCopcionPadre(string icopcionPadre, int imostrarmenu, int iactivo, string cusuario)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(UPDATEActivacion, 
                new SqlParameter("@mostrarenmenu", imostrarmenu), 
                new SqlParameter("@activo", iactivo),
                new SqlParameter("@cusuariomod", cusuario),
                new SqlParameter("@copcionpadre", icopcionPadre));
        }

    }
}
