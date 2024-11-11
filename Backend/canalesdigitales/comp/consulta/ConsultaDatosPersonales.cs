using canalesdigitales.enums;
using canalesdigitales.models;
using core.componente;
using dal.canalesdigitales;
using dal.generales;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.consulta;

namespace canalesdigitales.comp.consulta {

    public class ConsultaDatosPersonales : ComponenteConsulta {

        /// <summary>
        /// Métoto principal que ejecuta la Consulta de Datos Personales
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            ConsultarPaises(rqconsulta);
            ConsultarProvincias(rqconsulta);
            ConsultarCiudades(rqconsulta);
            ConsultarCantones(rqconsulta);
            ConsultarParroquias(rqconsulta);
            ConsultarDireccion(rqconsulta);
        }


        /// <summary>
        /// Metódo que consulta todos los países
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ConsultarPaises(RqConsulta rqconsulta) {
            IList<tgenpais> paises = TgenPaisDal.FindAll();
            rqconsulta.Response.Add(nameof(paises), paises);
        }

        /// <summary>
        /// Metódo que consulta todas las provincias
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ConsultarProvincias(RqConsulta rqconsulta) {
            IList<tgenprovincia> provincias = TgenProvinciaDal.FindAll();
            rqconsulta.Response.Add(nameof(provincias), provincias);
        }

        /// <summary>
        /// Método que consulta todas las ciudades
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ConsultarCiudades(RqConsulta rqconsulta) {
            IList<tgenciudad> ciudades = TgenCiudadDal.FindAll();
            rqconsulta.Response.Add(nameof(ciudades), ciudades);
        }

        /// <summary>
        /// Método que consulta todos los cantones
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ConsultarCantones(RqConsulta rqconsulta) {
            IList<tgencanton> cantones = TgenCantonDal.FindAll();
            rqconsulta.Response.Add(nameof(cantones), cantones);
        }

        /// <summary>
        /// Método que consulta todas las Parroquias
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ConsultarParroquias(RqConsulta rqconsulta) {
            IList<tgenparroquia> parroquias = TgenParroquiaDal.FindAll();
            rqconsulta.Response.Add(nameof(parroquias), parroquias);
        }

        /// <summary>
        /// Método que valida la dirección del usuario
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ConsultarDireccion(RqConsulta rqconsulta) {
            DireccionModel direccionModel = new DireccionModel();
            tcanusuario usuario = TcanUsuarioDal.Find(rqconsulta.Cusuariobancalinea, rqconsulta.Ccanal);
            tperpersonadireccion personaDireccion = TperPersonaDireccionDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            if (personaDireccion != null) {
                direccionModel.cpais = personaDireccion.cpais;
                direccionModel.cpprovincia = personaDireccion.cpprovincia;
                direccionModel.cciudad = personaDireccion.cciudad;
                direccionModel.ccanton = personaDireccion.ccanton;
                direccionModel.cparroquia = personaDireccion.cparroquia;
                direccionModel.direccion = personaDireccion.direccion;
            }

            rqconsulta.Response.Add(nameof(direccionModel.direccion), direccionModel);
        }

    }

}
