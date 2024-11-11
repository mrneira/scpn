using core.componente;
using dal.generales;
using dal.seguridades;
using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace seguridad.comp.mantenimiento.horario {
    /// <summary>
    /// Clase que se encarga de generar el horario de acceso automático.
    /// </summary>
    public class HorarioAccesoAutomatico : ComponenteMantenimiento {
        private static string cusuario = "", horaini = "08:00", horafin = "23:00", observacion = string.Empty;
        private static int ccompania = 1;
        /// <summary>
        /// Método para generar horarios de acceso automático
        /// </summary>
        /// <param name="rq">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rq) {
            List<tseghorariousuario> ldata = new List<tseghorariousuario>();
            if (rq.GetTabla("USUARIODETALLE") != null) {
                tsegusuariodetalle objoUsuarioDetalleRq = (tsegusuariodetalle)rq.GetTabla("USUARIODETALLE").Lregistros.ElementAt(0);
                cusuario = objoUsuarioDetalleRq.cusuario;
                ccompania = (int)objoUsuarioDetalleRq.ccompania;
                tgenparametros Horaini = TgenParametrosDal.Find("HORACCAUTINI", rq.Ccompania);
                tgenparametros Horafin = TgenParametrosDal.Find("HORACCAUTFIN", rq.Ccompania);
                horaini = Horaini.texto.ToString();
                horafin = Horafin.texto.ToString();
                observacion = "HORARIO AUTOMÁTICO";
                if (rq.Ctransaccion.Equals(7) & rq.Cmodulo.Equals(2)) {
                    for (int i = 1; i <= 7; i++) {
                        tseghorariousuario objHorarioUsuario = TsegHorarioUsuarioDal.FindInDataBase(ccompania, cusuario, i);
                        //EntityHelper.SetActualizar(objHorarioUsuario);
                        if (objHorarioUsuario != null) {
                            this.Actualizar(objHorarioUsuario, i);
                        } else {
                            tseghorariousuario objHorarioUsuarioNuevo = TsegHorarioUsuarioDal.Crear();
                            this.Crear(objHorarioUsuarioNuevo, i);
                        }


                    }
                }

            }

            if (rq.Cmodulo.Equals(2) && rq.Ctransaccion.Equals(14)) {
                if (rq.Mdatos != null) {
                    bool horario = (bool)rq.Mdatos["horario"];
                    if (horario) {
                        cusuario = (string)rq.Mdatos["cusuario"];
                        ccompania = Convert.ToInt32(rq.Mdatos["ccompania"]);
                        horaini = (string)rq.Mdatos["horaini"];
                        horafin = (string)rq.Mdatos["horafin"];
                        observacion = (string)rq.Mdatos["observacion"];
                        for (int i = 1; i <= 7; i++) {
                            tseghorariousuario objHorarioUsuario = TsegHorarioUsuarioDal.FindInDataBase(ccompania, cusuario, i);

                            if (objHorarioUsuario != null) {
                                this.Actualizar(objHorarioUsuario, i);

                            } else {
                                tseghorariousuario objHorarioUsuarioNuevo = TsegHorarioUsuarioDal.Crear();
                                this.Crear(objHorarioUsuarioNuevo, i);

                            }

                        }
                    }
                }
            }
        }

        private void Actualizar(tseghorariousuario objHorarioUsuario, int dia) {
            objHorarioUsuario.cusuario = cusuario;
            objHorarioUsuario.ccompania = ccompania;
            objHorarioUsuario.verreg = 0;
            objHorarioUsuario.diasemana = dia;
            objHorarioUsuario.horaini = horaini;
            objHorarioUsuario.horafin = horafin;
            objHorarioUsuario.ccatalogodiasemana = 5;
            objHorarioUsuario.cdetallediasemana = Convert.ToString(dia);
            objHorarioUsuario.observacion = observacion;
            bool act = true;
            if (dia > 5) {
                act = false;
            }
            objHorarioUsuario.activo = act;
            Sessionef.Actualizar(objHorarioUsuario);
        }

        private void Crear(tseghorariousuario objHorarioUsuario, int dia) {
            objHorarioUsuario.cusuario = cusuario;
            objHorarioUsuario.ccompania = ccompania;
            objHorarioUsuario.verreg = 0;
            objHorarioUsuario.diasemana = dia;
            objHorarioUsuario.horaini = horaini;
            objHorarioUsuario.horafin = horafin;
            objHorarioUsuario.ccatalogodiasemana = 5;
            objHorarioUsuario.cdetallediasemana = Convert.ToString(dia);
            objHorarioUsuario.observacion = observacion;
            bool act = true;
            if (dia > 5) {
                act = false;
            }
            objHorarioUsuario.activo = act;
            Sessionef.Grabar(objHorarioUsuario);
        }
    }
}
