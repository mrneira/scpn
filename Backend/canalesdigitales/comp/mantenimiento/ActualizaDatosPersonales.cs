using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using dal.generales;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento {
    public class ActualizaDatosPersonales : ComponenteMantenimiento {

        private readonly OtpHelper otpHelper = new OtpHelper();
        private readonly Validar validar = new Validar();

        /// <summary>
        /// Método principal que ejecuta la actualización de los Datos Personales
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            bool esemergente = Convert.ToBoolean(rqmantenimiento.GetDatos(nameof(esemergente)));

            ActualizarDireccion(rqmantenimiento);
            if (esemergente == true) {
                validar.DisponibilidaCreditoEmergentes();
                ConsultarReferenciaBancaria(rqmantenimiento);
                GenerarOtp(rqmantenimiento);
            }
        }

        /// <summary>
        /// Metodo que actualiza la dirección del Usuario
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        private void ActualizarDireccion(RqMantenimiento rqmantenimiento) {
            string cpais = rqmantenimiento.GetString(nameof(cpais));
            string cpprovincia = rqmantenimiento.GetString(nameof(cpprovincia));
            string cciudad = rqmantenimiento.GetString(nameof(cciudad));
            string ccanton = rqmantenimiento.GetString(nameof(ccanton));
            string cparroquia = rqmantenimiento.GetString(nameof(cparroquia));
            string direccion = rqmantenimiento.GetString(nameof(direccion));
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tperpersonadireccion personaDireccion = TperPersonaDireccionDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            if (personaDireccion == null) {
                personaDireccion = new tperpersonadireccion();
                personaDireccion.cpersona = Convert.ToInt64(usuario.cpersona);
                personaDireccion.ccompania = EnumGeneral.COMPANIA_COD;
                personaDireccion.cusuarioing = rqmantenimiento.Cusuario;
                personaDireccion.fingreso = Fecha.GetFechaSistema();
                personaDireccion.tipodireccionccatalogo = 304;
                personaDireccion.tipodireccioncdetalle = "2";
                personaDireccion.Actualizar = false;
                personaDireccion.Esnuevo = true;
            } else {
                personaDireccion.Actualizar = true;
                personaDireccion.Esnuevo = false;
            }

            personaDireccion.cpais = cpais;
            personaDireccion.cpprovincia = cpprovincia;
            personaDireccion.cciudad = cciudad;
            personaDireccion.ccanton = ccanton;
            personaDireccion.cparroquia = cparroquia;
            personaDireccion.direccion = direccion;

            List<tperpersonadireccion> lpersonasDirecciones = new List<tperpersonadireccion> { personaDireccion };
            rqmantenimiento.AdicionarTabla("DIRECCION", lpersonasDirecciones, false);
        }

        /// <summary>
        /// Método que valida si el usuario tiene una referecia bancaria
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        private void ConsultarReferenciaBancaria(RqMantenimiento rqmantenimiento) {
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tperreferenciabancaria referenciaBancaria = TperReferenciaBancariaDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            if (referenciaBancaria == null || !referenciaBancaria.estado.Equals(EnumEstadosReferenciaBancaria.REFERENCIA_ACTIVA)) {
                throw new AtlasException("CAN-034", "REFERENCIA BANCARIA NO EXISTE PARA USUARIO: {0}", rqmantenimiento.Cusuariobancalinea);
            }

            tgencatalogodetalle detalleBanco = TgenCatalogoDetalleDal.Find(Convert.ToInt32(referenciaBancaria.tipoinstitucionccatalogo), referenciaBancaria.tipoinstitucioncdetalle);
            tgencatalogodetalle detalleCuenta = TgenCatalogoDetalleDal.Find(Convert.ToInt32(referenciaBancaria.tipocuentaccatalogo), referenciaBancaria.tipocuentacdetalle);

            rqmantenimiento.Response.Add("institucion", detalleBanco.nombre);
            rqmantenimiento.Response.Add("tipocuenta", detalleCuenta.nombre);
            rqmantenimiento.Response.Add("cuenta", referenciaBancaria.numero);
        }

        /// <summary>
        /// Método que genera un codigo OTP
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        private void GenerarOtp(RqMantenimiento rqmantenimiento) {
            tcanusuariootp tcanusuariootp = otpHelper.GenerarOtp(rqmantenimiento);

            rqmantenimiento.Response.Add("tokenotp", tcanusuariootp.token);
            rqmantenimiento.Response.Add(nameof(tcanusuariootp.cotp), tcanusuariootp.cotp);
        }
    }
}
