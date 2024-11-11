using core.componente;
using dal.persona;
using dal.prestaciones;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;
using socio.datos;
using System;
using util;
using System.Threading;
using System.Globalization;

namespace prestaciones.comp.consulta.socio {
    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar datos del socio. 
    /// DatosSocio entrega en una List<Dictionary<String, Object>>
    /// </summary>
    class DatosSocio : ComponenteConsulta {
        public override void Ejecutar(RqConsulta rqconsulta) {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];
            bool bandeja = rqconsulta.Mdatos.ContainsKey("bandeja") ? (bool)rqconsulta.Mdatos["bandeja"] : false;
            Socios socio = new Socios(cpersona, rqconsulta);
            List<Dictionary<string, object>> ldatos = new List<Dictionary<string, object>>();
            Dictionary<string, object> m = new Dictionary<string, object>();
            tsocestadosocio estado; tsoctipogrado tsoctipogrado; tsoctipobaja tsoctipobaja;
            tperreferenciabancaria refBancaria = TperReferenciaBancariaDal.Find(cpersona, rqconsulta.Ccompania);
            tgencatalogodetalle genero, jerarquia, estatus, estadosocio; tperpersonadetalle personadetalle;
            tpreparametros param; tpernatural natural; tsoccesantiahistorico hisbaja, hisalta, hisactual, hisreincorporado;
            tsoccesantia sociocesantia; tpreexpediente exp, expliquidado; IList<tpreactosservicio> actoservicio = null;
            string tservicio = string.Empty, reincorporado = string.Empty, cdetalletipoexp = "CES", edad, mensaje = string.Empty;
            int totalaportes = 0; decimal acumuladoaportes = 0; decimal? naportesm, dprestamos = 0;
            bool devolucion = false, cesantia, restriccion;
            tservicio = socio.GetTservicio();
            estadosocio = socio.GetEstadoSocio();
            estado = socio.GetEstado();
            tsoctipogrado = socio.GetTipoGrado();
            tsoctipobaja = socio.GetTipoBaja();
            natural = socio.GetPersonaNatural();
            genero = socio.GetGenero();
            jerarquia = socio.GetJerarquia();
            personadetalle = socio.GetPersona();
            totalaportes = socio.GetTotalAportes();
            hisbaja = socio.GetHistoricoSocioBaja();
            hisalta = socio.GetHistoricoSocioAlta();
            hisactual = socio.GetHistoricoSocioActual();
            restriccion = socio.GetNovedadRestriccion();

            if (personadetalle.csocio != 1 || personadetalle.regimen) // MNR 20231226
            {
                throw new Exception("PRE-777 EL SOCIO CON IDENTIFICACIÓN " + personadetalle.identificacion + ", SE ENCUENTRA EN EL NUEVO REGIMEN DE SEGURIDAD SOCIAL");
            }
            // Valida las bajas antes del 2002
            hisreincorporado = socio.GetHistoricoSocioBaja(8);
            if (tsoctipobaja != null) {
                actoservicio = TpreActosServicioDal.Find(tsoctipobaja.ctipobaja);
            } else {
                actoservicio = TpreActosServicioDal.Find(0);
            }

            if (hisreincorporado != null) {
                reincorporado = "(REINCORPORADO)";
            }
            estatus = socio.GetEstatusSocio();
            sociocesantia = socio.GetSocioCesantiaActual();
            exp = socio.GetSocioExpediente();

            if (hisbaja != null) {
                if (Fecha.DateToInteger(hisbaja.festado.Value) < Fecha.DateToInteger(DateTime.Parse("13/09/2002")) && sociocesantia.ccdetalletipoestado.Equals("BAJ"))  {
                    mensaje = "SOCIO CON BAJA SIN DERECHO";
                }
                //if (Convert.ToDateTime(hisbaja.festado).Year <= 2002 && Convert.ToDateTime(hisbaja.festado).Month <= 9 && Convert.ToDateTime(hisbaja.festado).Day <= 13 && exp == null) {
                //    mensaje = "SOCIO CON BAJA SIN DERECHO";
                //}
            }

            expliquidado = socio.GetSocioExpedienteLiquidado();
            param = TpreParametrosDal.Find("CAN-MINIMA-APORTES");
            naportesm = param.numero;
            if (totalaportes < naportesm) {
                devolucion = true;
                cdetalletipoexp = "DEV";
            }
            if (totalaportes == 0) {
                mensaje = "SOCIO SIN APORTES";
            }
            // default para restaciones
            if (tsoctipobaja != null && (actoservicio.Count > 0)) {
                if (cdetalletipoexp.Equals("CES")) {
                    cdetalletipoexp = "CEF";
                }

                if (actoservicio.Count > 0 && cdetalletipoexp.Equals("DEV")) {
                    cdetalletipoexp = "CEF";
                    devolucion = false;
                }
            }

            if (tsoctipobaja != null) {
                if (cdetalletipoexp.Equals("DEV") && tsoctipobaja.ctipobaja == 2) {
                    cdetalletipoexp = "DEH";
                }
            }


            // default para restaciones

            cesantia = devolucion == false ? true : false;
            acumuladoaportes = socio.GetAcumAportes();
            //acumuladoaportes = decimal.Parse(TpreAportesDal.GetTotalAportes(cpersona, hisbaja != null ? "N":"S")[0]["TAPORTE"].ToString());
            edad = socio.GetEdad();
            if (hisbaja != null) {
                if (hisactual.secuencia != hisbaja.secuencia) {
                    hisbaja = null;
                    tsoctipobaja = null;
                }
            }

            rqconsulta.AddDatos("ctipobaja", tsoctipobaja != null ? tsoctipobaja.ctipobaja : 0);
            if (bandeja) {
                string Rqcdetalletipoexp = rqconsulta.Mdatos["cdetalletipoexp"].ToString();
            } else {
                if (!rqconsulta.Mdatos.ContainsKey("cdetalletipoexp")) {
                    rqconsulta.AddDatos("cdetalletipoexp", cdetalletipoexp);
                }
            }


            m["identificacion"] = personadetalle.identificacion;
            m["fingreso"] = sociocesantia.fingreso;
            m["falta"] = hisalta.festado;
            m["fbaja"] = hisbaja != null ? hisbaja.festado : rqconsulta.Freal;
            m["festadoactual"] = hisactual.festado;
            m["esbaja"] = hisbaja != null ? true : false;
            m["jerarquia"] = jerarquia.nombre;
            m["cjerarquia"] = jerarquia.cdetalle;
            m["grado"] = tsoctipogrado.nombre;
            m["fnacimiento"] = natural.fnacimiento;
            m["tiemposervico"] = tservicio;
            m["edad"] = edad;
            m["coeficiente"] = tsoctipogrado.coeficiente;
            m["tipobaja"] = tsoctipobaja != null ? tsoctipobaja.nombre : string.Empty;
            m["ctipobaja"] = tsoctipobaja != null ? tsoctipobaja.ctipobaja : 0;
            m["genero"] = genero.nombre;
            m["totalaportes"] = totalaportes;
            m["acumuladoaportes"] = acumuladoaportes;
            m["estadosocio"] = estadosocio.nombre + " " + reincorporado;
            //m["estadosocio"] = estatus.nombre + " " + reincorporado;
            m["estatus"] = estatus.nombre;
            m["devolucion"] = devolucion;
            m["cesantia"] = cesantia;
            m["cdetalletipoexp"] = cdetalletipoexp;
            m["primernombre"] = natural.primernombre;
            m["segundonombre"] = natural.segundonombre;
            m["apellidopaterno"] = natural.apellidopaterno;
            m["apellidomaterno"] = natural.apellidomaterno;
            m["tipoinstitucioncdetalle"] = refBancaria != null ? refBancaria.tipoinstitucioncdetalle : null;
            m["tipocuentacdetalle"] = refBancaria != null ? refBancaria.tipocuentacdetalle : null;
            m["numero"] = refBancaria != null ? refBancaria.numero : null;
            m["secuencia"] = exp != null ? exp.secuencia : -1;
            m["liquidado"] = hisreincorporado != null ? true : false;
            m["dprestamos"] = dprestamos;
            m["mensaje"] = mensaje;
            m["restriccion"] = restriccion;
            m["sueldoactual"] = sociocesantia.sueldoactual;
            m["ccomprobante"] = exp != null ? exp.comprobantecontable : string.Empty;
            
            ldatos.Add(m);
            resp["DATOSSOCIO"] = ldatos;
            //respuesta consulta datos prestamos
            resp["p_falta"]= hisalta.festado;
            resp["p_fbaja"] = hisbaja != null ? hisbaja.festado : rqconsulta.Freal;
            resp["p_cdetalletipoexp"]  = cdetalletipoexp;
            resp["p_cdetallejerarquia"]= jerarquia.cdetalle;
            resp["p_coeficiente"]= tsoctipogrado.coeficiente;
            resp["p_totalaportes"] = totalaportes;

        }

    }
}
