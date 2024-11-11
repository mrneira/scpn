using dal.generales;
using dal.persona;
using general.archivos;
using modelo;
using modelo.helper;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.interfaces.archivo;
using util.servicios.ef;

namespace socio.archivo.carga {
    class CuentasBancarias : ICargaRegistro {

        public static List<tperreferenciabancaria> referenciaBancariaAcumulado = new List<tperreferenciabancaria>();
        /// <summary>
        /// Objeto que contiene los datos de Socios de Cesantia
        /// </summary>
        tperreferenciabancaria tperReferenciaBancaria = new tperreferenciabancaria();
        /// <summary>
        /// Objeto con la Informacion de Persona Detalle 
        /// </summary>
        tperpersonadetalle tperDetalle = new tperpersonadetalle();
        /// <summary>
        /// procesa la logica de necogio para subir un registro a la base de datos 
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="registro"></param>
        /// <param name="numerolinea"></param>
        public void Procesar(RqMantenimiento rqmantenimiento, string registro, int numerolinea, int cmodulo, int ctipoarchivo) {
            RegistroHelper rh = new RegistroHelper(rqmantenimiento, numerolinea, registro, cmodulo, ctipoarchivo);
            IList<tgencargacampos> lTgenCargaCampos = rh.CompletarValorCampo();
            this.CompletarCuentaSocio(lTgenCargaCampos, rqmantenimiento);
        }

        public void CompletarCuentaSocio(IList<tgencargacampos> lTgenCargaCampos, RqMantenimiento rqmantenimiento) {
            string Errores = string.Empty;
            List<tgencargacampos> camposBuscar = lTgenCargaCampos.ToList<tgencargacampos>();
            if (camposBuscar.Find(x => x.atributo == "IDENTIFICACION").Mdatos["IDENTIFICACION"] != null) {
                tperDetalle.identificacion = camposBuscar.Find(x => x.atributo == "IDENTIFICACION").Mdatos["IDENTIFICACION"].ToString();

                tperpersonadetalle tperDetalleB = TperPersonaDetalleDal.Find(tperDetalle.identificacion);
                if (tperDetalleB != null) {
                    if (camposBuscar.Find(x => x.atributo == "CODIGO BANCO").Mdatos["CODIGO BANCO"] != null) {
                        tperReferenciaBancaria.tipoinstitucioncdetalle = camposBuscar.Find(x => x.atributo == "CODIGO BANCO").Mdatos["CODIGO BANCO"].ToString();
                        tgencatalogodetalle institucion = TgenCatalogoDetalleDal.FindActivo(305, tperReferenciaBancaria.tipoinstitucioncdetalle);
                        Errores = institucion == null ? Errores + string.Format("CODIGO DE INSTITUCION INVALIDO: {0}, ", tperReferenciaBancaria.tipoinstitucioncdetalle) : Errores + String.Empty;
                    }
                    if (camposBuscar.Find(x => x.atributo == "CODIGO TIPO CUENTA").Mdatos["CODIGO TIPO CUENTA"] != null) {
                        tperReferenciaBancaria.tipocuentacdetalle = camposBuscar.Find(x => x.atributo == "CODIGO TIPO CUENTA").Mdatos["CODIGO TIPO CUENTA"].ToString();
                        tgencatalogodetalle cuenta = TgenCatalogoDetalleDal.Find(306, tperReferenciaBancaria.tipocuentacdetalle);
                        Errores = cuenta == null ? Errores + string.Format("CODIGO DE TIPO DE CUENTA INVALIDO: {0}, ", tperReferenciaBancaria.tipocuentacdetalle) : Errores + String.Empty;
                    }
                    if (camposBuscar.Find(x => x.atributo == "NUMERO CUENTA BANCO").Mdatos["NUMERO CUENTA BANCO"] != null) {
                        tperReferenciaBancaria.numero = camposBuscar.Find(x => x.atributo == "NUMERO CUENTA BANCO").Mdatos["NUMERO CUENTA BANCO"].ToString();
                    }

                    tperreferenciabancaria tperreferenciabancariaUpdate = TperReferenciaBancariaDal.Find(tperDetalleB.cpersona, tperDetalleB.ccompania);

                    Errores += LlenarCuentasBancarias(tperDetalleB);
                    bool fin;
                    if (rqmantenimiento.GetDatos("procesoaportefin") != null) {
                        fin = (bool)rqmantenimiento.GetDatos("procesoaportefin");
                        if (fin) {
                            referenciaBancariaAcumulado = new List<tperreferenciabancaria>();
                        }
                    }
                    if (!String.IsNullOrEmpty(Errores)) {
                        Errores += "PARA LA CÉDULA: " + tperDetalle.identificacion;
                        throw new AtlasException("CA-0011", Errores);
                    }

                    if (tperreferenciabancariaUpdate != null && tperreferenciabancariaUpdate.tipocuentacdetalle.Equals(tperReferenciaBancaria.tipocuentacdetalle)
                        && tperreferenciabancariaUpdate.tipoinstitucioncdetalle.Equals(tperReferenciaBancaria.tipoinstitucioncdetalle)
                        && tperreferenciabancariaUpdate.numero.Equals(tperReferenciaBancaria.numero))
                    {
                        //ERROR
                        int a = 0;
                        a = 1;
                    }
                    else {
                        if (tperreferenciabancariaUpdate != null)
                        {
                            int secuencia = TperReferenciaBancariaDal.FindSecuencia(tperDetalleB.cpersona, tperDetalleB.ccompania);
                            tperReferenciaBancaria.secuencia = secuencia;
                            tperReferenciaBancaria.cuentaprincipal = true;
                            tperreferenciabancariaUpdate.cuentaprincipal = false;
                            tperreferenciabancariaUpdate.estado = "INC";
                            tperReferenciaBancaria.estado = "ACT";
                            tperReferenciaBancaria.Esnuevo = true;
                            tperReferenciaBancaria.Actualizar = false;

                            //EntityHelper.SetActualizar(tperReferenciaBancaria); 
                            Sessionef.Actualizar(tperreferenciabancariaUpdate);                                 
                            Sessionef.Grabar(tperReferenciaBancaria);

                        }
                        else
                        {
                          int secuencia=  TperReferenciaBancariaDal.FindSecuencia(tperDetalleB.cpersona, tperDetalleB.ccompania);
                            tperReferenciaBancaria.secuencia = secuencia;
                            tperReferenciaBancaria.cuentaprincipal = true;
                            tperReferenciaBancaria.estado = "ACT";
                            tperReferenciaBancaria.Esnuevo = true;
                            tperReferenciaBancaria.Actualizar = false;

                            Sessionef.Grabar(tperReferenciaBancaria);
                        }
                    }
                   

                } else
                    throw new AtlasException("CA-003", "NO EXISTE PERSONA PARA LA IDENTIFICACION: "+ tperDetalle.identificacion);
            } else
                throw new AtlasException("CA-002", "EL CAMPO IDENTIFICACION NO PUEDE ESTAR VACIO");

            tperReferenciaBancaria = null;
        }

        private string LlenarCuentasBancarias(tperpersonadetalle tperDetalle) {
            string Errores = "";
            tperReferenciaBancaria.Actualizar = false;
            tperReferenciaBancaria.cpersona = tperDetalle.cpersona;
            tperReferenciaBancaria.ccompania = tperDetalle.ccompania;
            tperReferenciaBancaria.verreg = 0;
            tperReferenciaBancaria.veractual = 0;
            tperReferenciaBancaria.tipoinstitucionccatalogo = 305;
            tperReferenciaBancaria.tipocuentaccatalogo = 306;
            referenciaBancariaAcumulado.Add(tperReferenciaBancaria);

            if (referenciaBancariaAcumulado.Count > 1) {
                foreach (var refBanc in referenciaBancariaAcumulado.GroupBy(t => t.cpersona).Where(t => t.Count() != 1).ToList())
                    if (refBanc.Key == tperReferenciaBancaria.cpersona) {
                        return Errores = "DATOS DUPLICADOS ";
                    }
            }
            return Errores;
        }

        private void ActualizarCuentasBancarias(tperreferenciabancaria tperreferenciabancaria, tperreferenciabancaria tperreferenciabancariaaux) {
            tperreferenciabancaria.Actualizar = true;
            tperreferenciabancaria.tipoinstitucioncdetalle = tperreferenciabancariaaux.tipoinstitucioncdetalle;
            tperreferenciabancaria.tipocuentacdetalle = tperreferenciabancariaaux.tipocuentacdetalle;
            tperreferenciabancaria.numero = tperreferenciabancariaaux.numero;
            tperReferenciaBancaria.cuentaprincipal = true;
            // tperreferenciabancaria.verreg = 0; // JVC probar   se comenta esta linea

        }
    }
}


