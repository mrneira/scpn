using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;


namespace dal.bancaenlinea {

    public class TbanUsuarioSessionDal {


        /// <summary>
        /// Entrega un registro asociado a la session del usuario si no existe en la base de datos retorna null.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario a buscar la session.</param>
        /// <returns></returns>
        public static tbanusuariosession Find(string cusuario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tbanusuariosession obj = null;

            obj = contexto.tbanusuariosession.AsNoTracking().Where(x => x.cusuario == cusuario).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Entrega los datos de session de usuario.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario a buscar la session.</param>
        /// <returns></returns>
        public static tbanusuariosession FindTracking(string cusuario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tbanusuariosession obj = null;

            obj = contexto.tbanusuariosession.Where(x => x.cusuario == cusuario).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            return obj;
        }

        public static tbanusuariosession FindActivo(string cusuario) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tbanusuariosession obj = new tbanusuariosession();
            try {
                obj = contexto.tbanusuariosession.Where(x => x.cusuario == cusuario && x.activo.Equals("1")).Single();
            } catch (System.InvalidOperationException) {
                throw new AtlasException("SEG-021", "USUARIO NO HA INICIADO SESSION DE TRABAJO");
            }
            return obj;
        }

        /// <summary>
        /// Crea un objeto de tipo TsegUsuarioSession y lo almacena en la base de datos.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tbanusuariosession Crear(RqMantenimiento rqmantenimiento, string cusuario) {
            tbanusuariosession obj = new tbanusuariosession();
            obj.cusuario = cusuario;
            obj.idsession = rqmantenimiento.GetString("sessionid");
            obj.cterminal = rqmantenimiento.Cterminal;
            obj.cterminalremoto = rqmantenimiento.Cterminalremoto;
            obj.ipwebserver = rqmantenimiento.GetString("ipserver");
            obj.useragent = rqmantenimiento.GetString("useragent");
            obj.activo = "1";
            obj.numerointentos = 0;
            obj.Esnuevo = true;
            obj.finicio = ThreadNegocio.GetDatos().Request.Freal;
            
            return obj;
        }

        /// <summary>
        /// Actualiza el numero de intentos fallidos de login.
        /// </summary>
        /// <param name="tsegusuariosession">Objeto que contiene los datos asociados a la session de un usuario.</param>
        public static void ActualizaIntentos(tbanusuariosession obj) {
            int numeroIntentos = 1;
            if (obj.numerointentos != null) {
                numeroIntentos = numeroIntentos + (int)obj.numerointentos;
            }
            obj.numerointentos = numeroIntentos;
        }

        private static String SQL_UPD_PORHOST = "delete from tsegusuariosession  where ipwebserver = @ipservidorweb ";
        /// <summary>
        /// Marca los usuarios como no activos cuando sube el servidor web.
        /// </summary>
        /// <param name="ipservidorweb">Ip del servidor web.</param>
        public static void MarcaNoActivosPorIpWebxxxxx(String ipservidorweb) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                int registroseliminados = contexto.Database.ExecuteSqlCommand(SQL_UPD_PORHOST, new SqlParameter("@ipservidorweb", ipservidorweb));
            } catch (Exception ex) {
                throw ex;
            }

        }


    }
}
