using core.servicios;
using dal.seguridades;
using modelo;
using modelo.helper;
using seguridad.comp.login.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace seguridad.comp.mantenimiento.login {

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
            tsegusuariodetalle detalle = (tsegusuariodetalle)rqmantenimiento.GetDatos("TSEGUSUARIODETALLE");
            tsegusuariosession session = TsegUsuarioSessionDal.Find(detalle.cusuario, (int)detalle.ccompania);
                   tsegpolitica pol = TsegPoliticaDal.FindInDataBase((int)detalle.ccompania, rqmantenimiento.Ccanal);

            if (pol.tiemposesion == null) {
                throw new AtlasException("SEG-023", "TIEMPO DE SESIÓN NO DEFINIDO EN LA POLÍTICA DE SEGURIDAD");
            }

            rqmantenimiento.Response["tiemposession"] = pol.tiemposesion;
            rqmantenimiento.AddDatos("TSEGUSUARIOSESSION", session);

            if (session == null) {
                // Crea un registro de TsegUsuarioSession como activo y lo almacena en la base de datos.
                session = TsegUsuarioSessionDal.Crear(rqmantenimiento, detalle.cusuario, (int)detalle.ccompania);
                InsertAnidadoThread.Grabar((int)session.ccompania, session);
                session.tiemposesion = pol.tiemposesion;
                rqmantenimiento.AddDatos("TSEGUSUARIOSESSION", session);
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
   

                if (cfultimaaccion.CompareTo(cfreal) >= 0 && (session.cterminal.CompareTo(rqmantenimiento.Cterminal)!=0
                        //|| session.idsession.CompareTo((string)rqmantenimiento.GetDatos("sessionid")) != 0
                                || session.useragent.CompareTo((string)rqmantenimiento.GetDatos("useragent")) != 0)) {
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
            //EntityHelper.SetActualizar(session);
            //Sessionef.Actualizar(session);
            rqmantenimiento.Response["ipsessionactiva"] = session.cterminal;
        }
    }

}
