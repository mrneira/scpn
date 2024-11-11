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


namespace dal.seguridades {

    public class TsegUsuarioSessionDal {

        /// <summary>
        /// Entrega los datos de session de usuario.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario a buscar la session.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static tsegusuariosession Find(string cusuario, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsegusuariosession obj = null;

            obj = contexto.tsegusuariosession.AsNoTracking().Where(x => x.cusuario == cusuario && x.ccompania == ccompania).SingleOrDefault();
            if(obj == null) {
                return null;
            }
            return obj;
        }

        /// <summary>
        /// Entrega los datos de session de usuario.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario a buscar la session.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static tsegusuariosession FindTracking(string cusuario, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsegusuariosession obj = null;

            obj = contexto.tsegusuariosession.Where(x => x.cusuario == cusuario && x.ccompania == ccompania).SingleOrDefault();
            if(obj == null) {
                return null;
            }
            return obj;
        }

        /// <summary>
        /// Entrega los datos de session de usuario activo.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario a buscar la session.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static tsegusuariosession FindActivo(string cusuario, int ccompania) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsegusuariosession obj = new tsegusuariosession();
            try {
                obj = contexto.tsegusuariosession.Where(x => x.cusuario == cusuario && x.ccompania == ccompania && x.activo.Equals("1")).Single();
            } catch(System.InvalidOperationException) {
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
        public static tsegusuariosession Crear(RqMantenimiento rqmantenimiento, String cusuario, int ccompania) {
            tsegusuariosession obj = new tsegusuariosession();
            obj.cusuario = cusuario;
            obj.ccompania = ccompania;
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
        public static void ActualizaIntentos(tsegusuariosession obj) {
            int numeroIntentos = 1;
            if(obj.numerointentos != null) {
                numeroIntentos = numeroIntentos + (int)obj.numerointentos;
            }
            obj.numerointentos = numeroIntentos;
        }

        private static String SQL_UPD_PORHOST = "delete from tsegusuariosession  where ipwebserver = @ipservidorweb ";
        /// <summary>
        /// Marca los usuarios como no activos cuando sube el servidor web.
        /// </summary>
        /// <param name="ipservidorweb">Ip del servidor web.</param>
        public static void MarcaNoActivosPorIpWeb(String ipservidorweb) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                int registroseliminados = contexto.Database.ExecuteSqlCommand(SQL_UPD_PORHOST, new SqlParameter("@ipservidorweb", ipservidorweb));
            } catch(Exception ex) {
                throw ex;
            }
        }
    }
}
