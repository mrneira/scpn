using core.servicios;
using dal.bancaenlinea;
using dal.seguridades;
using modelo;
using seguridad.comp.login.helper;
using System;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.blinea.login {

    /// <summary>
    /// Clase que se encarga de verificar si el usuario tieneuna sesion activa.
    /// </summary>
    public class VerificaSesion : GrabaSession {

        /// <summary>
        /// Metodo que busca si el usuario existe
        /// </summary>
        /// <param name="rqmantenimiento">Request de login.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string sdf = "yyyy-MM-dd hh:mm:ss";

            tbanusuarios detalle = (tbanusuarios)rqmantenimiento.GetDatos("TBANUSUARIOS");
            tbanusuariosession session = TbanUsuarioSessionDal.Find(detalle.cusuario);

            tsegpolitica pol = TsegPoliticaDal.FindInDataBase((int)rqmantenimiento.Ccompania, rqmantenimiento.Ccanal);

            if (pol.tiemposesion == null) {
                throw new AtlasException("SEG-023", "TIEMPO DE SESIÓN NO DEFINIDO EN LA POLÍTICA DE SEGURIDAD");
            }

            rqmantenimiento.Response["tiemposession"] = pol.tiemposesion;
            rqmantenimiento.AddDatos("TBANUSUARIOSESSION", session);

            if (session == null) {
                // Crea un registro de TsegUsuarioSession como activo y lo almacena en la base de datos.
                session = TbanUsuarioSessionDal.Crear(rqmantenimiento, detalle.cusuario);
                InsertAnidadoThread.Grabar((int)rqmantenimiento.Ccompania, session);
                session.tiemposesion = pol.tiemposesion;
                rqmantenimiento.AddDatos("TBANUSUARIOSESSION", session);
                return;
            }

            if (session.fultimaaccion != null) {
                DateTime fultimaaccion = (DateTime)session.fultimaaccion;
                DateTime freal = rqmantenimiento.Freal;

                DateTime cfultimaaccion = fultimaaccion;
                DateTime cfreal = freal;
                if (session.tiemposesion != null) {
                    cfultimaaccion = cfultimaaccion.AddMinutes((int)session.tiemposesion);
                }
   

                if (cfultimaaccion.CompareTo(cfreal) >= 0 && (!session.cterminal.Equals(rqmantenimiento.Cterminal)
                        || session.idsession.CompareTo((string)rqmantenimiento.GetDatos("sessionid")) != 0
                                && session.useragent.CompareTo((string)rqmantenimiento.GetDatos("useragent")) != 0)) {
                    long tultimaaccion = (long)(cfultimaaccion - new DateTime(1970, 1, 1)).TotalMilliseconds;
                    long treal = (long)(cfreal - new DateTime(1970, 1, 1)).TotalMilliseconds;

                    long restante = tultimaaccion - treal;
                    long minutosrestantes = restante / (60 * 1000);

                    throw new AtlasException("SEG-028",
                            "EL USUARIO {0} YA TIENE UNA SESIÓN ACTIVA: \nIP ORIGEN: {1} \nFECHA DE INGRESO: {2} \nFECHA DE ÚLTIMA ACCIÓN: {3} \nTIEMPO RESTANTE: {4}",
                            session.cusuario, session.cterminal, ((DateTime)session.finicio).ToString(sdf),
                            ((DateTime)session.fultimaaccion).ToString(sdf),  minutosrestantes);
                }
            }

            session.finicio = rqmantenimiento.Freal;
            session.idsession = ((string)rqmantenimiento.GetDatos("sessionid"));
            session.useragent = ((string)rqmantenimiento.GetDatos("useragent"));
            rqmantenimiento.Response["ipsessionactiva"] = session.cterminal;
        }
    }

}
