using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;
using util.thread;

namespace dal.seguridades {

    public class TsegUsuarioSessionHistoriaDal {

        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TsegUsuarioSession y lo envia a la base de datos.
        /// </summary>
        /// <param name="tsegusuariosession">Objeto que contiene los datos a generar historia.</param>
        public static void Crearhistoria(tsegusuariosession tsegusuariosession) {
            tsegusuariosessionhistoria obj = TsegUsuarioSessionHistoriaDal.Historia(tsegusuariosession);
            Sessionef.Save(obj);
        }

        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TsegUsuarioSession y lo envia a la base de datos  en un hilo diferente, por ende en una session de base de datos independiente.
        /// </summary>
        /// <param name="tsegusuariosession">Objeto que contiene los datos a generar historia.</param>
        /// <returns></returns>
        public static tsegusuariosessionhistoria Crearhistoriaerror(tsegusuariosession tsegusuariosession) {
            tsegusuariosessionhistoria obj = TsegUsuarioSessionHistoriaDal.Historia(tsegusuariosession);
            return obj;
        }

        /// <summary>
        /// Metodo que genera un registro de historia teniendo como base un registro de la tabla TsegUsuarioSession.
        /// </summary>
        /// <param name="tsegusuariosession">Objeto que contiene los datos a generar historia.</param>
        /// <returns></returns>
        private static tsegusuariosessionhistoria Historia(tsegusuariosession tsegusuariosession) {
            tsegusuariosessionhistoria obj = new tsegusuariosessionhistoria();
            obj.cusuario = tsegusuariosession.cusuario;
            obj.ccompania = tsegusuariosession.ccompania;
            obj.fcreacion = ThreadNegocio.GetDatos().Request.Freal;
            obj.cterminal = tsegusuariosession.cterminal;
            obj.finicio = tsegusuariosession.finicio;
            obj.fsalida = tsegusuariosession.fsalida;
            obj.idsession = tsegusuariosession.idsession;
            obj.ipwebserver = tsegusuariosession.ipwebserver;
            obj.useragent = tsegusuariosession.useragent;
            obj.numerointentos = tsegusuariosession.numerointentos;
            obj.cestado = tsegusuariosession.cestado;
            return obj;
        }

    }

}
