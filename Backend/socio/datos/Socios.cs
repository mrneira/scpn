using dal.cartera;
using dal.generales;
using dal.persona;
using dal.prestaciones;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.consulta;
using util.dto.mantenimiento;

namespace socio.datos {
    /// <summary>
    /// Clase que se encarga de manejar un socio en prestaciones.<br>
    /// </summary>
    public class Socios {
        /// <summary>
        /// Tiempo de servicio del socio.
        /// </summary>
        private string tservicio;
        /// Tiempo de servicio del socio separado por anio, mes, dia.
        /// </summary>
        private int[] tservicioarray;
        /// <summary>
        /// Edad del socio.
        /// </summary>
        private string edad;
        /// <summary>
        /// Cod. persona del socio.
        /// </summary>
        private long cpersona;
        /// <summary>
        /// Cod. compania del socio.
        /// </summary>
        private int ccompania;
        /// <summary>
        /// Fecha Real del sistema.
        /// </summary>
        private DateTime freal;
        /// <summary>
        /// Fecha final, calculo tiempo de servicio.
        /// </summary>
        private DateTime ffinal;
        /// <summary>
        /// Cod del estado del socio.
        /// </summary>
        private int cestadosocio;
        /// <summary>
        /// Cod del subestado del socio.
        /// </summary>
        private int? csubestado;
        /// <summary>
        /// Cod Grado actual.
        /// </summary>
        private long cgradoactual;
        /// <summary>
        /// Total aportes del socio.
        /// </summary>
        private int taportes;
        /// <summary>
        /// Acumaldo de aportes
        /// </summary>
        decimal acumaportes;
        /// <summary>
        /// Lista con datos de Aportes del socio
        /// </summary>
        IList<Dictionary<string, object>> laportes;
        /// <summary>
        /// Objeto que almacena informacion de un socio historico.
        /// </summary>
        internal tsoccesantiahistorico hisactual, hisalta, hisbaja, hisreincorporado;

        internal tsoccesantia sociocesantia;

        internal List<tsocnovedadades> lnovedades;

        internal tsocestadosocio estado;

        internal tsoctipobaja tsoctipobaja;

        internal tsoctipogrado tsoctipogrado;

        internal tgencatalogodetalle genero, jerarquia, estatus, estadosocio;

        internal tpreexpediente exp;

        internal tpernatural natural;

        internal tperpersonadetalle personadetalle;

        internal tpreparametros param;

        public Socios(long cpersona, RqConsulta rq) {
            this.cpersona = cpersona;
            this.ccompania = rq.Ccompania;
            this.freal = rq.Freal;
        }

        public Socios(long cpersona, RqMantenimiento rq) {
            this.cpersona = cpersona;
            this.ccompania = rq.Ccompania;
            this.freal = rq.Freal;
        }

        //public long Cpersona { get => cpersona; set => cpersona = value; }

        //public int Ccompania { get => ccompania; set => ccompania = value; }

        //public DateTime Freal { get => freal; set => freal = value; }


        public tsoccesantia GetSocioCesantiaActual() {
            sociocesantia = TsocCesantiaDal.Find(cpersona, ccompania);
            return sociocesantia;
        }
        // Consultar el historico de carrera por estado del socio ---- 1 cod ALTA
        public tsoccesantiahistorico GetHistoricoSocioAlta() {
            hisalta = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, ccompania, 1);
            return hisalta;
        }

        // Consultar el historico de carrera por estado del socio ---- 3 cod BAJA
        public tsoccesantiahistorico GetHistoricoSocioBaja(int cestadosocio = 3) {
            hisbaja = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, ccompania, cestadosocio);
            return hisbaja;
        }

        // Consultar el historico de carrera por estado del socio ---- 8 cod REINCORPORADO
        public tsoccesantiahistorico GetHistoricoSocioReincorporado(int cestadosocio = 8) {
            hisreincorporado = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, ccompania, cestadosocio);
            return hisreincorporado;
        }

        // Consultar el historico actual del socio
        public tsoccesantiahistorico GetHistoricoSocioActual() {
            hisactual = TsocCesantiaHistoricoDal.Find(cpersona, ccompania);
            return hisactual;
        }

        public string GetTservicio() {
            bool reincorporado = false;
            hisbaja = this.GetHistoricoSocioBaja();
            hisactual = this.GetHistoricoSocioActual();
            sociocesantia = this.GetSocioCesantiaActual();
            hisalta = this.GetHistoricoSocioAlta();
            reincorporado = GetReincorporado();
            if (reincorporado && GetSocioExpediente() != null) {
                hisalta.festado = hisalta.festado < sociocesantia.fingreso ? sociocesantia.fingreso : hisalta.festado;
            } else {
                hisalta.festado = hisalta.festado > sociocesantia.fingreso ? sociocesantia.fingreso : hisalta.festado;
            }

            if (hisbaja != null) {
                if (hisbaja.secuencia != hisactual.secuencia) {
                    hisbaja = null;
                }
            }


            ffinal = hisbaja == null ? freal : (DateTime)hisbaja.festado;
            this.tservicio = util.Fecha.diff(ffinal, (DateTime)hisalta.festado);
            return this.tservicio;
        }

        public int[] GetTservicioArray() {
            bool reincorporado = false;
            hisbaja = this.GetHistoricoSocioBaja();
            hisactual = this.GetHistoricoSocioActual();
            sociocesantia = this.GetSocioCesantiaActual();
            hisalta = this.GetHistoricoSocioAlta();
            reincorporado = GetReincorporado();
            if (reincorporado) {
                hisalta.festado = hisalta.festado < sociocesantia.fingreso ? sociocesantia.fingreso : hisalta.festado;
            } else {
                hisalta.festado = hisalta.festado > sociocesantia.fingreso ? sociocesantia.fingreso : hisalta.festado;
            }

            if (hisbaja != null) {
                if (hisbaja.secuencia != hisactual.secuencia) {
                    hisbaja = null;
                }
            }

            ffinal = hisbaja == null ? freal : (DateTime)hisbaja.festado;
            this.tservicioarray = util.Fecha.GetDiferenciaEntreFechas((DateTime)hisalta.festado, ffinal);
            return this.tservicioarray;
        }

        public tsocestadosocio GetEstado() {
            hisbaja = this.GetHistoricoSocioBaja();
            hisactual = this.GetHistoricoSocioActual();
            cestadosocio = hisbaja == null ? (int)hisactual.cestadosocio : (int)hisbaja.cestadosocio;
            estado = TsocEstadoSocioDal.Find(cestadosocio);
            return estado;
        }

        public tgencatalogodetalle GetEstadoSocio() {
            sociocesantia = GetSocioCesantiaActual();
            estadosocio = TgenCatalogoDetalleDal.Find((int)sociocesantia.ccatalogotipoestado, sociocesantia.ccdetalletipoestado);
            return estadosocio;
        }

        public tgencatalogodetalle GetEstatusSocio() {
            estado = GetEstado();
            estatus = TgenCatalogoDetalleDal.Find((int)estado.ccatalogoestatus, estado.cdetalleestatus);
            return estatus;
        }

        public tsoctipobaja GetTipoBaja() {
            hisbaja = this.GetHistoricoSocioBaja();
            hisalta = this.GetHistoricoSocioAlta();
            csubestado = hisbaja == null ? -1 : (int)hisbaja.csubestado;
            tsoctipobaja = TsocTipoBajaDal.Find((long)csubestado);
            return tsoctipobaja;
        }

        public tsoctipogrado GetTipoGrado() {
            hisbaja = this.GetHistoricoSocioBaja();
            hisactual = this.GetHistoricoSocioActual();
            if (hisbaja != null) {
                cgradoactual = hisbaja.secuencia != hisactual.secuencia ? (int)hisactual.cgradoactual : (int)hisbaja.cgradoactual;
            } else {
                cgradoactual = (int)hisactual.cgradoactual;
            }

            tsoctipogrado = TsocTipoGradoDal.Find(cgradoactual);
            return tsoctipogrado;
        }

        public tperpersonadetalle GetPersona() {
            personadetalle = TperPersonaDetalleDal.Find(cpersona, ccompania);
            return personadetalle;
        }

        public tgencatalogodetalle GetGenero() {
            natural = TperNaturalDal.Find(cpersona, ccompania);
            genero = TgenCatalogoDetalleDal.Find(302, natural.genero);
            return genero;
        }

        public tgencatalogodetalle GetJerarquia() {
            tsoctipogrado = GetTipoGrado();
            jerarquia = TgenCatalogoDetalleDal.Find((int)tsoctipogrado.ccatalogojerarquia, tsoctipogrado.cdetallejerarquia);
            return jerarquia;
        }

        public IList<Dictionary<string, object>> GetAportes() {
            laportes = TpreAportesDal.GetTotalAportes(cpersona);
            return laportes;
        }

        public int GetTotalAportes() {
            laportes = GetAportes();
            param = TpreParametrosDal.Find("CAN-MAXIMA-APORTES");
            taportes = int.Parse(laportes[0]["naportes"].ToString());
            if (taportes > param.numero) {
                taportes = (int)param.numero;
            }
            return taportes;
        }

        public decimal GetAcumAportes() {
            laportes = GetAportes();
            bool reincorporado = false;
            reincorporado = GetReincorporado();
            if (reincorporado) {
                acumaportes = decimal.Parse(TpreAportesDal.GetTotalAportes(cpersona, hisbaja != null ? "S" : "N")[0]["TAPORTE"].ToString());
            } else {
                acumaportes = decimal.Parse(TpreAportesDal.GetTotalAportes(cpersona, hisbaja != null ? "N" : "S")[0]["TAPORTE"].ToString());
            }
            return acumaportes;
        }

        public string GetEdad() {
            natural = TperNaturalDal.Find(cpersona, ccompania);
            edad = util.Fecha.diff(freal, natural.fnacimiento == null ? freal : (DateTime)natural.fnacimiento);
            return edad;
        }

        public bool GetAutorizacionDebito(string coperacion) {
            tcaroperaciondescuentos tcaroperaciondescuentos = TcarOperacionDescuentosDal.Find(coperacion);
            return ((bool)tcaroperaciondescuentos.autorizacion) ? true : false;
        }

        public tpernatural GetPersonaNatural() {
            return natural = TperNaturalDal.Find(cpersona, ccompania);
        }

        public tpreexpediente GetSocioExpediente() {
            return exp = TpreExpedienteDal.FindBanca(cpersona, ccompania);
        }

        public tpreexpediente GetSocioExpedienteLiquidado() {
            return exp = TpreExpedienteDal.FinToExpedienteLiquidado(cpersona, ccompania);
        }

        public bool GetReincorporado() {
            bool reincorporado = false;
            hisreincorporado = this.GetHistoricoSocioReincorporado();
            if (hisreincorporado != null) {
                reincorporado = true;
            }
            return reincorporado;
        }

        public decimal GetValorReincorporado() {
            decimal valor = 0;
            valor = TsocNovedadesDal.GetToPrestamos(cpersona, ccompania);
            return valor;
        }

        public bool GetNovedadRestriccion() {
            bool restriccion = false;
            int valor = TpreParametrosDal.GetInteger("TIPONOVNOPRESTAMO");
            lnovedades = TsocNovedadesDal.FindToTipoNovedadACT(cpersona, ccompania, valor.ToString());
            if (lnovedades.Count > 0) {
                restriccion = true;
            }
            return restriccion;
        }

        public decimal GetSueldoSocio() {
            sociocesantia = TsocCesantiaDal.Find(cpersona, ccompania);
            return (decimal)sociocesantia.sueldoactual;
        }

        /// <summary>
        /// RRO 20211104
        /// Consulta las novedades por persona, compañia, estado y tipo novedad
        /// </summary>
        /// <param name="estado"></param>
        /// <param name="tiponovedad"></param>
        /// <returns></returns>
        public tsocnovedadades GetSocioNovedades(string estado, string[] tiponovedad)
        {
            var listaNovedades = TsocNovedadesDal.FindToSocioNovedad(cpersona, ccompania, estado, tiponovedad);
            return listaNovedades.Count > 0 ? listaNovedades[0] : null;
        }
    }
}
