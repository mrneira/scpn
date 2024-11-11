using core.componente;
using dal.generales;
using dal.persona;
using dal.prestaciones;
using dal.seguridades;
using dal.socio;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace prestaciones.comp.mantenimiento.expediente {
    class ValidarBaja : ComponenteMantenimiento {
        /// <summary>
        /// Clase que realiza las validaciones al instante de crear un expediente
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("DATOSEXPEDIENTE") == null || rm.GetTabla("DATOSEXPEDIENTE").Lregistros.Count() <= 0) {
                return;
            }

            if (!bool.Parse(rm.GetDatos("validaexp").ToString())) {
                return;
            }
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            long cpersona = long.Parse(rm.Mdatos["cpersona"].ToString());
            string etapa = rm.Mdatos["etapa"].ToString();
            string cdetalletipoexp = rm.Mdatos["cdetalletipoexp"].ToString();
            bool bandeja = (bool)rm.Mdatos["bandeja"];
            DateTime fechabaja = Convert.ToDateTime((rm.Mdatos["fechabaja"]));
            // Consultar el historico de carrera por estado del socio ---- 3 cod BAJA
            tsoccesantiahistorico hisbaja = TsocCesantiaHistoricoDal.Find(cpersona, (int)rm.Ccompania);
            tsoccesantia sociocesantia = TsocCesantiaDal.Find(cpersona, (int)rm.Ccompania);
            if (hisbaja.cestadosocio != 3) {
                throw new AtlasException("PRE-006", "SOCIO NO ESTÁ EN BAJA {0}", cpersona);
            }

            // Valida las bajas antes del 2002
            // if(fechabaja.Year <= 2002) {
            if (Fecha.DateToInteger(fechabaja) < Fecha.DateToInteger(DateTime.Parse("13/09/2002")) && sociocesantia.ccdetalletipoestado.Equals("BAJ")) {
                throw new AtlasException("PRE-021", "SOCIO CON BAJA SIN DERECHO {0}", cpersona);
            }
            //if (fechabaja.Year <= 2002 && fechabaja.Month <= 9 && fechabaja.Day <= 13) {
            //    throw new AtlasException("PRE-021", "SOCIO CON BAJA SIN DERECHO {0}", cpersona);
            //}


            tpreexpediente expediente = null;
            tpreexpediente expedienteEtpapa = null;
            tsoccesantia soc = null;

            if (bandeja) {
                return;
            } else {
                soc = TsocCesantiaDal.Find(cpersona, rm.Ccompania);
                expediente = TpreExpedienteDal.FindToLiquidacion(cpersona, rm.Ccompania, cdetalletipoexp, etapa.Equals("5") ? true : false);
                expedienteEtpapa = TpreExpedienteDal.FindToEtapa(cpersona, rm.Ccompania, etapa, cdetalletipoexp);
            }

            if (soc.ccdetalletipoestado.Equals("BLQ")) {
                expediente = TpreExpedienteDal.FindToLiquidacion(cpersona, rm.Ccompania, cdetalletipoexp, true);
                if (expediente != null) {
                    tperpersonadetalle detalle = TperPersonaDetalleDal.Find(cpersona, rm.Ccompania);
                    tgencatalogodetalle catdetalle = TgenCatalogoDetalleDal.Find(expediente.ccatalogoetapa, expediente.cdetalleetapa);
                    throw new AtlasException("PRE-009", "NO SE PUEDE CREAR EXPEDIENTE, USUARIO CON CÉDULA: {0} TIENE UN EXPEDIENTE EN ETAPA: {1}", detalle.identificacion, catdetalle.nombre);
                }
            }

            if (expediente != null) {
                if (expediente.cdetalletipoexp.Equals(cdetalletipoexp)) {
                    if (expedienteEtpapa != null) {
                        tperpersonadetalle detalle = TperPersonaDetalleDal.Find(cpersona, rm.Ccompania);
                        tgencatalogodetalle catdetalle = TgenCatalogoDetalleDal.Find(expediente.ccatalogoetapa, expediente.cdetalleetapa);
                        throw new AtlasException("PRE-009", "NO SE PUEDE CREAR EXPEDIENTE, USUARIO CON CÉDULA: {0} TIENE UN EXPEDIENTE EN ETAPA: {1}", detalle.identificacion, catdetalle.nombre);
                    }
                }
            }
            IList<Dictionary<string, object>> taportes = new List<Dictionary<string, object>>();
            tpreparametros param = TpreParametrosDal.Find("CAN-MINIMA-APORTES");
            decimal? naportesm = param.numero, naportes = 0;
            taportes = TpreAportesDal.GetTotalAportes(cpersona);
            naportes = decimal.Parse(taportes[0]["naportes"].ToString());
            if (cdetalletipoexp.Equals("CES") || cdetalletipoexp.Equals("ANT")) {
                string msj = "CESANTIA";
                if (cdetalletipoexp.Equals("ANT")) {
                    msj = "ANTICIPO";
                }
                if (naportes < naportesm) {
                    throw new AtlasException("PRE-005", "NO TIENE DERECHO A {0} No de Aportes: {1}", msj, naportes);
                }
            }
            //MRN 20231026
            string cmodulo = "", ctransaccion = "", query = "";
            bool statusAux = false;
            foreach (var dato in rm.Mdatos)
            {
                switch ((dato.Key).ToString())
                {
                    case "AUX_CMODULO": cmodulo = (dato.Value).ToString(); break;
                    case "AUX_CTRANSACCION": ctransaccion = (dato.Value).ToString(); break;
                    case "AUX_QUERY": query = (dato.Value).ToString(); break;
                }
                if (!cmodulo.Equals("") && !ctransaccion.Equals("") && !query.Equals(""))
                {
                    statusAux = true;
                    break;
                }
            }
            if (statusAux)
            {
                //ALTERA SU CURSO NORMAL, PORQUE SE NECESITA HACER PROCESOS ADICIONALES; POR LO GENERAL ES CUANDO SE UTILIZA ESTE PTOCESO UNA TRANSACCION EXTERNA
                string secuenciatransaccion = cmodulo + "-" + ctransaccion;
                bool statusTransaccion = false;
                if (secuenciatransaccion.Equals("28-56"))
                {
                    expediente = TpreExpedienteDal.Find(cpersona, rm.Ccompania);
                    if (expediente != null)
                    {
                        expedienteEtpapa = TpreExpedienteDal.FindToEtapa(cpersona, (int)expediente.ccompania, expediente.cdetalleetapa, expediente.cdetalletipoexp);
                        if (expedienteEtpapa != null)
                        {
                            tperpersonadetalle detalle = TperPersonaDetalleDal.Find(cpersona, rm.Ccompania);
                            tgencatalogodetalle catdetalle = TgenCatalogoDetalleDal.Find(expediente.ccatalogoetapa, expediente.cdetalleetapa);
                            throw new AtlasException("PRE-009", "NO SE PUEDE CREAR LA ASIGNACIÓN DE EXPEDIENTE, USUARIO CON CÉDULA: {0} TIENE UN EXPEDIENTE EN ETAPA: {1}", detalle.identificacion, catdetalle.nombre);
                        }
                        if (soc.ccdetalletipoestado.Equals("BLQ"))
                        {
                            tperpersonadetalle detalle = TperPersonaDetalleDal.Find(cpersona, rm.Ccompania);
                            tgencatalogodetalle catdetalle = TgenCatalogoDetalleDal.Find(expediente.ccatalogoetapa, expediente.cdetalleetapa);
                            throw new Exception("PRE-009 NO SE PUEDE CREAR LA ASIGNACIÓN DE EXPEDIENTE, USUARIO CON CÉDULA: " + detalle.identificacion + "  TIENE UN EXPEDIENTE EN ETAPA: " + catdetalle.nombre);
                        }
                    }
                    Dictionary<String, Object> queryJson = JsonConvert.DeserializeObject<Dictionary<string, object>>(query);
                    string bean = (string)queryJson["bean"];
                    string function = (string)queryJson["function"];
                    string parametros = (string)queryJson["param"];
                    switch (bean + "^" + function)
                    {
                        case "tgensecuencia^FindSecuenceByTypeExpedient":
                            {
                                statusTransaccion = true; // MNE20240910
                                tpreexpedienteasignacion expasig = TpreExpedienteAsignacionDal.FindAsigExpFreeByPerson(cpersona);
                                if (expasig != null)
                                {
                                    if ((expasig.ccatalogoestadoregistro == null || expasig.ccatalogoestadoregistro == 2803) && (expasig.cdetalleestadoregistro == null || expasig.cdetalleestadoregistro == "ACT"))
                                    {
                                        rm.Response["cod"] = "PRE-032";
                                        rm.Response["msgusu"] = "NO SE PUEDE CREAR UNA ASIGNACIÓN DE EXPEDIENTE, EL SOCIO: " + cpersona + " YA TIENE UN EXPEDIENTE ASIGNADO.";
                                        rm.Response["cpersona"] = expasig.cpersona;
                                        rm.Response["cexpediente"] = expasig.cexpediente;
                                        rm.Response["tipoexp"] = expasig.tipoexp;
                                    }
                                    else
                                    {
                                        tgensecuencia secuencia = TgenSecuenciaDal.Find(Sessionef.GetAtlasContexto(), parametros);
                                        if (secuencia == null)
                                        {
                                            throw new AtlasException("PRE-033", "NO SE PUEDE CREAR UNA ASIGNACIÓN DE EXPEDIENTE, NO FUE POSIBLE ENCONTRAR LA SECUENCIA {0}.", parametros);
                                        }
                                        tsegusuariodetalle detus = TsegUsuarioDetalleDal.Find(rm.Cusuario, rm.Ccompania);
                                        Dictionary<String, Object> helpSecuencia = JsonConvert.DeserializeObject<Dictionary<string, object>>("{'valoractual': '" + secuencia.valoractual + "', 'valorincremento': '" + secuencia.valorincremento + "'}");
                                        rm.Response["tgensecuencia"] = helpSecuencia;
                                        rm.Response["cusuario"] = detus.cusuario;
                                        rm.Response["cagencia"] = detus.cagencia;
                                        rm.Response["csucursal"] = detus.csucursal;
                                        rm.Response["ccompania"] = detus.ccompania;
                                    }
                                    /*rm.Response["cod"] = "PRE-032";
                                    rm.Response["msgusu"] = "NO SE PUEDE CREAR UNA ASIGNACIÓN DE EXPEDIENTE, EL SOCIO: "+ cpersona + " YA TIENE UN EXPEDIENTE ASIGNADO.";
                                    rm.Response["cpersona"] = expasig.cpersona;
                                    rm.Response["cexpediente"] = expasig.cexpediente;
                                    rm.Response["tipoexp"] = expasig.tipoexp;*/
                                }
                                else
                                {
                                    tgensecuencia secuencia = TgenSecuenciaDal.Find(Sessionef.GetAtlasContexto(), parametros);
                                    if (secuencia == null)
                                    {
                                        throw new AtlasException("PRE-033", "NO SE PUEDE CREAR UNA ASIGNACIÓN DE EXPEDIENTE, NO FUE POSIBLE ENCONTRAR LA SECUENCIA {0}.", parametros);
                                    }
                                    tsegusuariodetalle detus = TsegUsuarioDetalleDal.Find(rm.Cusuario, rm.Ccompania);
                                    Dictionary<String, Object> helpSecuencia = JsonConvert.DeserializeObject<Dictionary<string, object>>("{'valoractual': '" + secuencia.valoractual + "', 'valorincremento': '" + secuencia.valorincremento + "'}");
                                    rm.Response["tgensecuencia"] = helpSecuencia;
                                    rm.Response["cusuario"] = detus.cusuario;
                                    rm.Response["cagencia"] = detus.cagencia;
                                    rm.Response["csucursal"] = detus.csucursal;
                                    rm.Response["ccompania"] = detus.ccompania;
                                }


                            }
                            break;
                    }
                }
                if (!statusTransaccion)
                {
                    throw new AtlasException("PRE-031", "NO SE PUEDE CREAR UNA ASIGNACIÓN DE EXPEDIENTE, LA TRANSACCIÓN: {0} NO SE ENCUENTRA DEFINIDA, O EL MÓDULO {1} NO EXISTE PARA LA ASIGNACIÓN DE EXPEDIENTES", ctransaccion, cmodulo);
                }
            }
            else
            {
                //Realiza su curso normal
                tpreexpedienteasignacion expasig = TpreExpedienteAsignacionDal.FindAsigExpFreeByPerson(cpersona);
                if (expasig != null)
                {
                    if ((expasig.ccatalogoestadoregistro == null || expasig.ccatalogoestadoregistro == 2803) && (expasig.cdetalleestadoregistro == null || expasig.cdetalleestadoregistro == "ACT"))
                    {
                        rm.Response["asignacionexpediente"] = expasig.cexpediente;
                    }
                    else
                    {
                        throw new AtlasException("PRE-034", "NO SE PUEDE CREAR UN EXPEDIENTE, EL SOCIO: {0} NO TIENE UN EXPEDIENTE ASIGNADO.", cpersona);
                    }
                    //rm.Response["asignacionexpediente"] = expasig.cexpediente;
                }
                else
                {
                    throw new AtlasException("PRE-034", "NO SE PUEDE CREAR UN EXPEDIENTE, EL SOCIO: {0} NO TIENE UN EXPEDIENTE ASIGNADO.", cpersona);
                }
            }

        }
    }
}
