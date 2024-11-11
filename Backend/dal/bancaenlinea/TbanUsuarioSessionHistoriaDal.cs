using modelo;
using util.servicios.ef;
using util.thread;

namespace dal.seguridades {

    public class TbanUsuarioSessionHistoriaDal {

        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TbanUsuarioSession y lo envia a la base de datos.
        /// </summary>
        /// <param name="tbanusuariosession">Objeto que contiene los datos a generar historia.</param>
        public static void Crearhistoria(tbanusuariosession tbanusuariosession) {
            tbanusuariosessionhistoria obj = TbanUsuarioSessionHistoriaDal.Historia(tbanusuariosession);
            Sessionef.Save(obj);
        }

        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TbanUsuarioSession y lo envia a la base de datos  en un hilo diferente, por ende en una session de base de datos independiente.
        /// </summary>
        /// <param name="tbanusuariosession">Objeto que contiene los datos a generar historia.</param>
        /// <returns></returns>
        public static tbanusuariosessionhistoria Crearhistoriaerror(tbanusuariosession tbanusuariosession) {
            tbanusuariosessionhistoria obj = TbanUsuarioSessionHistoriaDal.Historia(tbanusuariosession);
            return obj;
        }

        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TbanUsuarioSession.
        /// </summary>
        /// <param name="tbanusuariosession">Objeto que contiene los datos a generar historia.</param>
        /// <returns></returns>
        private static tbanusuariosessionhistoria Historia(tbanusuariosession tbanusuariosession) {
            tbanusuariosessionhistoria obj = new tbanusuariosessionhistoria();
            obj.cusuario = tbanusuariosession.cusuario;
            obj.fcreacion = ThreadNegocio.GetDatos().Request.Freal;
            obj.cterminal = tbanusuariosession.cterminal;
            obj.cterminalremoto = tbanusuariosession.cterminalremoto;
            obj.finicio = tbanusuariosession.finicio;
            obj.fsalida = tbanusuariosession.fsalida;
            obj.idsession = tbanusuariosession.idsession;
            obj.ipwebserver = tbanusuariosession.ipwebserver;
            obj.useragent = tbanusuariosession.useragent;
            obj.numerointentos = int.Parse(tbanusuariosession.numerointentos.ToString());
            obj.cestado = tbanusuariosession.cestado;
            return obj;
        }

    }

}
