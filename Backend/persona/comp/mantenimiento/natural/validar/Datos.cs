using core.componente;
using dal.generales;
using dal.persona;
using modelo;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace persona.comp.mantenimiento.natural.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones de datos de persona.
    /// </summary>
    public class Datos : ComponenteMantenimiento {
        /// <summary>
        /// Validación de datos
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("DETALLE") != null) {
                tperpersonadetalle tperPersonaDetalle = (tperpersonadetalle)rqmantenimiento.GetTabla("DETALLE").Lregistros.ElementAt(0);
                if (tperPersonaDetalle != null) {
                    if (tperPersonaDetalle.Esnuevo) {
                        this.VerificaPersona(tperPersonaDetalle);
                    }
                    this.ValidarIdentificacion(tperPersonaDetalle.identificacion, tperPersonaDetalle.tipoidentificacdetalle);
                    this.ValidaCelular(tperPersonaDetalle);
                    this.ValidaEmail(tperPersonaDetalle);
                }
            }
            tpernatural tperNatural;
            if (rqmantenimiento.GetTabla("NATURAL") != null) {
                tperNatural = (tpernatural)rqmantenimiento.GetTabla("NATURAL").Lregistros.ElementAt(0);
                tgenparametros parametros = TgenParametrosDal.Find("EDAD_MINIMA_SOCIO", rqmantenimiento.Ccompania);
                this.ValidaFechaNacimiento(tperNatural, parametros);
                FUtil.ValidaFechas(tperNatural.fnacimiento, "FECHA DE NACIMIENTO", null, null);
            }
        }

        /// <summary>
        /// Verifica numero de identificacion.
        /// </summary>
        /// <param name="identificacion"></param
        /// <param name="ctipoidentificacion"></param
        private void ValidarIdentificacion(string identificacion, string ctipoidentificacion)
        {
            if (ctipoidentificacion.Equals("C")) {
                if (!Cedula.Validar(identificacion)) {
                    throw new AtlasException("BPER-005", "IDENTIFICACION NO VALIDA {0}", identificacion);
                }
            } else if (ctipoidentificacion.Equals("R")) {
                if (!Ruc.Validar(identificacion)) {
                    throw new AtlasException("BPER-005", "IDENTIFICACION NO VALIDA {0}", identificacion);
                }
            }
        }

        /// <summary>
        /// Verifica que no exista una persona creada con la identificacion que se desea crear un registro.
        /// </summary>
        /// <param name="tperPersonaDetalle"></param>
        private void VerificaPersona(tperpersonadetalle tperPersonaDetalle)
        {
            try {
                tperpersonadetalle p = TperPersonaDetalleDal.Find(tperPersonaDetalle.identificacion);

                if (p != null) {
                    throw new AtlasException("BPER-008", "YA EXISTE UNA PERSONA CON IDENITICACION {0}", tperPersonaDetalle.identificacion);
                }
            }
            catch (AtlasException e) {
                if (!e.Codigo.Equals("BPER-007")) { // si no existe la persona no se hacer nada.
                    throw e;
                }
            }
        }

        /// <summary>
        /// Verifica que numero celular este correcto.
        /// </summary>
        /// <param name="tperPersonaDetalle"></param>
        private void ValidaCelular(tperpersonadetalle tperPersonaDetalle)
        {
            if (!String.IsNullOrEmpty(tperPersonaDetalle.celular)) {
                //if (!tperPersonaDetalle.celular.Split('(')[1].Split(')')[0].Equals("09")) {
                //    throw new AtlasException("BPER-018", "TELÉFONO CELULAR PERSONAL NO TIENE EL FORMATO CORRECTO {0}", tperPersonaDetalle.celular);
                //}
            }
        }

        /// <summary>
        /// Verifica que direccion de correo tenga estructura correcta.
        /// </summary>
        /// <param name="tperPersonaDetalle"></param>
        private void ValidaEmail(tperpersonadetalle tperPersonaDetalle)
        {
            if (!String.IsNullOrEmpty(tperPersonaDetalle.email)) {
                String expresion;
                expresion = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
                if (Regex.IsMatch(tperPersonaDetalle.email, expresion)) {
                    if (Regex.Replace(tperPersonaDetalle.email, expresion, String.Empty).Length != 0) {
                        throw new AtlasException("BPER-010", "EMAIL PERSONAL NO TIENE EL FORMATO CORRECTO {0}", tperPersonaDetalle.email);
                    }
                } else {
                    throw new AtlasException("BPER-010", "EMAIL PERSONAL NO TIENE EL FORMATO CORRECTO {0}", tperPersonaDetalle.email);
                }
            }
        }

        /// <summary>
        /// Verifica que fecha de nacimiento cumpla las condiciones.
        /// </summary>
        /// <param name="tperNatural"></param>
        /// <param name="parametros"></param>
        private void ValidaFechaNacimiento(tpernatural tperNat, tgenparametros parametros)
        {
            if (tperNat.fnacimiento != null) {
                var fsistema = Fecha.GetFechaSistema();
                DateTime fnacimiento = tperNat.fnacimiento.Value;
                var finit = (fsistema.Year * 100 + fsistema.Month) * 100 + fsistema.Day;
                var ffin = (fnacimiento.Year * 100 + fnacimiento.Month) * 100 + fnacimiento.Day;
                var fres = (finit - ffin) / 10000;
                var edad = (int)parametros.numero;
                if (fres <= edad) {
                    throw new AtlasException("FPER-003", "FECHA DE NACIMIENTO {0} DEBE SER MAYOR A {1} AÑOS", fnacimiento.Month + "/" + fnacimiento.Day + "/" + fnacimiento.Year, edad);
                }
            }
        }

    }

}
