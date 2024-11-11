
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.enums;
using dal.talentohumano;
using modelo;
using talentohumano.helper;
using dal.talentohumano.liquidacion;
using util;
using dal.talentohumano.nomina;
using dal.generales;

namespace talentohumano.datos
{
    /// <summary>
    /// Clase que se encarga de generar la liquidación
    /// </summary>
    public class Liquidacion
    {
        private decimal diasAnioc;
        private decimal diasMesc;
        private int ccompania;

        public IList<tnomliquidaciondetalle> lidetalle { set; get; }
        public tnomliquidacion datosGenerales { set; get; }
        public IList<TiposLiquidacion> ltipos { set; get; }
        public decimal diasTrabajados { get; set; }
        public DateTime finicio { set; get; }
        public DateTime ffin { set; get; }
        public tthcontratodetalle cd { set; get; }
        public long anio { set; get; }
        public string mes { set; get; }
        public decimal sueldo { set; get; }
        public decimal ultimaRemuneracion { set; get; }
        public tnomparametrodetalle param { get; set; }
        public decimal hextra { get; set; }
        public tnomdecimos acum { set; get; }
        public decimal diasFondoReserva { set; get; }
        public decimal porcentajeiess { get; set; }
        public bool pagoimprenta { get; set; }

        public Liquidacion()
        {

        }
        public static decimal diferenciaMeses(DateTime FechaFin, DateTime FechaInicio)
        {
            return Math.Abs((FechaFin.Month - FechaInicio.Month) + 12 * (FechaFin.Year - FechaInicio.Year));

        }
        private decimal getSueldoMensual()
        {
            DateTime pdia = new DateTime((int)this.anio, this.ffin.Month, 1);
            int diasReales = (this.ffin - pdia).Days;
            diasReales = diasReales + 1;
            int diasMes = (int)this.diasMesc;
            decimal sueldoProporcional = 0;
            this.diasFondoReserva = 0;
            //this.diasCalculo = 0;
            int diasVinculacion = this.cd.fvinculacion.Day - 1;
            int mesesc = (int)this.diasAnioc / (int)this.diasMesc;
            //VALIDACIÓN FONDO DE RESERVA
            //DIAS REALES MAYOR A DIAS AÑO NÓMINA 360
            decimal meses = diferenciaMeses(this.ffin, this.cd.fvinculacion);

            if (meses >= mesesc)
            {
                // DIAS REALES MAYOR A DIAS AÑO FONDO + DIAS MES VALIDACIÓN QUE YA SE ENCUENTRE TOMANDO FONDO RESERVA

                if (meses > mesesc)
                {
                    this.diasFondoReserva = (int)this.diasMesc;
                }
                else
                {
                    //VALIDACIÓN SI TIENE PROPORCIONAL AL MES 13 EJM: ENTRO 3 DE ENERO DIAS CÁLCULO = 27
                    this.diasFondoReserva = (int)this.diasMesc - diasVinculacion;
                }
            }
            else
            {
                this.diasFondoReserva = 0;
            }
            if (this.acum.tienederecho.Value && this.diasFondoReserva == 0)
            {
                this.diasFondoReserva = (int)this.diasMesc - diasVinculacion;
            }


            if (diasReales == 0)
            {
                sueldoProporcional = 0;
                this.diasTrabajados = 0;
            }
            else if (diasReales > 0 && diasReales < diasMes)
            {
                //Aumento CCA 
                tnomrol rol;
                rol = TnomRolDal.BusquedaUltimoRol(this.cd.cfuncionario, this.mes, this.anio);
                if (rol != null)
                {
                    sueldoProporcional = 0;
                }
                else
                {
                    ///Solo esto va CCA
                    sueldoProporcional = this.sueldo * ((decimal)diasReales / 30);
                    sueldoProporcional = decimal.Round(sueldoProporcional, 2, MidpointRounding.AwayFromZero);
                    this.diasTrabajados = diasReales;
                }
            }
            else
            {
                tnomrol rol;
                this.sueldo = cd.remuneracion.Value;
                long anionuevo = 0;
                int mescca = 0;
                if (this.mes.Equals("01"))
                {
                    string mesnuevo = this.mes;/// Se elimina la resta CCA
                    anionuevo = this.anio; /// Se elimina la resta CCA 
                    rol = TnomRolDal.BusquedaUltimoRol(this.cd.cfuncionario, mesnuevo, anionuevo);

                }
                else
                {

                    string mesnuevo = this.restaMeses(this.mes, 1);
                    anionuevo = this.anio;
                    mescca = Int32.Parse(mesnuevo) + 1;
                    mesnuevo = mescca.ToString();
                    int longitudmes = mesnuevo.Length;
                    if (longitudmes == 1)
                    {
                        mesnuevo = "0" + mesnuevo;
                    }
                    rol = TnomRolDal.BusquedaUltimoRol(this.cd.cfuncionario, mesnuevo, anionuevo);

                }

                if (this.cd.regioncdetalle.Equals(EnumRegimen.LOSEP))
                {
                    this.ultimaRemuneracion = this.cd.remuneracion.Value;
                }
                else
                {
                    if (rol != null)
                    {
                        sueldoProporcional = 0;
                    }
                    else
                    {
                        sueldoProporcional = this.cd.remuneracion.Value;
                        this.diasTrabajados = diasMes;
                    }
                }
            }
            this.sueldo = sueldoProporcional;
            return sueldoProporcional;
        }
        public void datosGeneralesLiquidacion()
        {
            try
            {
                this.diasAnioc = TthParametrosDal.GetValorNumerico("DIASANIONOMINA", this.ccompania);
            }
            catch (Exception err)
            {
                throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0}", "DIASANIONOMINA");
            }
            try
            {
                this.diasMesc = TthParametrosDal.GetValorNumerico("DIASMESNOMINA", this.ccompania);

            }
            catch (Exception err)
            {
                throw new AtlasException("TTH-005", "NO SE HA DEFINIDO EL PARAMETRO {0}", "DIASMESNOMINA");
            }

            this.param = TnomparametroDal.Find(this.anio);
            if (this.param == null)
            {
                throw new AtlasException("TTH-006", "NO SE HA DEFINIDO LA PARAMETRIZACIÓN PARA EL AÑO {0}", this.anio);

            }
            this.cd = TthContratoDal.FindContratoFuncionario(this.datosGenerales.cfuncionario.Value);

            if (this.cd == null)
            {
                throw new AtlasException("TTH-024", "EL CONTRATO NO SE HA ENCONTRADO O YA SE HA INGRESADO LA FECHA DE DESVINCULACIÓN");

            }
            tthfuncionariodetalle fun = TthFuncionarioDal.FindFuncionario(this.cd.cfuncionario);
            tthcargo carg = TthcargoDal.FindInDataBaseCodigo(cd.ccargo);
            tthdepartamento dep = TthDepartamentoDal.FindDepartamento(long.Parse(carg.cdepartamento.ToString()));
            tthproceso pro = TthProcesoDal.FindPrceso(dep.cproceso);
            //ASIGNACIÓN POR DEFECTO SUELDO
            tnomrol rol;
            this.sueldo = cd.remuneracion.Value;
            long anionuevo = 0;
            int mescca = 0; //CCA 20220324
            if (this.mes.Equals("01"))
            {
                string mesnuevo = this.mes; // Se cambia CCA
                anionuevo = this.anio;
                rol = TnomRolDal.BusquedaUltimoRol(this.cd.cfuncionario, mesnuevo, anionuevo);
            }
            else
            {
                string mesnuevo = this.restaMeses(this.mes, 1);
                anionuevo = this.anio;
                mescca = Int32.Parse(mesnuevo) + 1;//CCA 20220324
                mesnuevo = mescca.ToString();
                int longitudmes = mesnuevo.Length;
                if (longitudmes == 1)
                {
                    mesnuevo = "0" + mesnuevo;
                }
                rol = TnomRolDal.BusquedaUltimoRol(this.cd.cfuncionario, mesnuevo, anionuevo);
            }

            if (this.cd.regioncdetalle.Equals(EnumRegimen.LOSEP))
            {
                this.ultimaRemuneracion = this.cd.remuneracion.Value;
            }
            else
            {

                if (rol != null)
                {
                    this.ultimaRemuneracion = rol.singresos;
                }
                else
                {
                    throw new AtlasException("TTH-014", "NO SE HA ECONTRADO EL ULTIMO SALARIO CON LA FECHA DE DESVINCULACIÓN {0}", this.ffin.ToString("yyyy/MM/dd"));
                }
            }
            acum = TnomDecimosDal.FindAnio(this.anio, fun.cfuncionario);
            if (acum == null)
            {
                throw new AtlasException("TTH-007", "NO SE HA DEFINIDO LA ACUMULACIÓN O MENSUALIZACIÓN DEL FUNCIONARIO {0} EN EL AÑO {1}", fun.documento + " -" + fun.primernombre + " " + fun.primerapellido, this.anio);
            }

        }
        private string restaMeses(string mes, int meses)
        {
            int mesActal = int.Parse(mes);

            mesActal = mesActal - meses;
            return this.completarMes((decimal)mesActal);
        }
        public IList<tnomhoraextranomina> hextras()
        {
            IList<tnomhoraextranomina> tnb = dal.talentohumano.nomina.TnomHoraExtraDal.Find(this.mes, this.cd.cfuncionario, this.anio);
            return tnb;
        }

        public void IngresosDefecto()
        {

            //CALCULO SUELDO
            tnomliquidaciondetalle SUELDO = new tnomliquidaciondetalle();
            SUELDO.descripcion = "SUELDO PROPORCIONAL A LA FECHA";
            SUELDO.nombre = "SUELDO";
            SUELDO.parametro = "PORCENTAJE";
            SUELDO.ctipocdetalle = "IDE";
            SUELDO.valor = this.getSueldoMensual();
            SUELDO.calculado = SUELDO.valor;
            SUELDO.porcentual = false;
            SUELDO.ingreso = true;
            SUELDO.tipoccatalogo = 1145;
            SUELDO.tipocdetalle = "SUELDO";
            this.lidetalle.Add(SUELDO);

            //HORAS EXTRAS EN LIQUIDACIÓN
            IList<tnomhoraextranomina> HEX = hextras();
            foreach (tnomhoraextranomina HEXTRAS in HEX)
            {
                tnomliquidaciondetalle liq = new tnomliquidaciondetalle();
                tgencatalogodetalle hx = TgenCatalogoDetalleDal.Find(HEXTRAS.tipoccatalogo.Value, HEXTRAS.tipocdetalle);
                liq.ctipocdetalle = HEXTRAS.tipocdetalle;
                liq.valor = HEXTRAS.vtotal;
                liq.calculado = HEXTRAS.vtotal;
                liq.parametro = "HORAEXTRA";
                liq.nombre = hx.nombre;
                liq.porcentual = false;
                liq.ingreso = true;
                this.hextra = this.hextra + liq.calculado.Value;
                liq.tipoccatalogo = 1145;
                liq.tipocdetalle = "HOREXT";
                this.lidetalle.Add(liq);
            }
            //Vacaciones
            tnomliquidaciondetalle vac = this.getVacaciones();
            this.lidetalle.Add(vac);
            tnomliquidaciondetalle dtercero = this.getDecimoTercero();
            this.lidetalle.Add(dtercero);
            tnomliquidaciondetalle dcuarto = this.getDecimoCuarto();
            this.lidetalle.Add(dcuarto);

            tnomliquidaciondetalle dterceroajust = this.getAjusteDecimoTercero();
            if (dterceroajust.calculado > 0)
            {
                this.lidetalle.Add(dterceroajust);
            }
            //CCA 20241014
            tnomliquidaciondetalle dcuartoajust = this.getAjusteDecimoCuarto();
            if (dcuartoajust.calculado > 0)
            {
                this.lidetalle.Add(dcuartoajust);
            }


            IList<tnomingreso> per = Ingreso.getBeneficiosPersonales(this.anio, cd.cfuncionario, this.mes, cd.remuneracion);
            foreach (tnomingreso ingPersonal in per)
            {
                tnomliquidaciondetalle INGR = new tnomliquidaciondetalle();
                INGR.porcentual = ingPersonal.porcentual;
                INGR.valor = ingPersonal.calculado.Value;
                INGR.calculado = ingPersonal.calculado.Value;
                INGR.nombre = ingPersonal.nombrebeneficio;
                INGR.tipoccatalogo = 1145;
                INGR.tipocdetalle = ingPersonal.tipocdetalle;
                INGR.ingreso = true;
                this.lidetalle.Add(INGR);

            }
            if (!this.acum.afondoreserva.Value)
            {
                tnomliquidaciondetalle freserva = this.getFondoReservaMensual();
                if (freserva.calculado.Value > 0)
                    this.lidetalle.Add(freserva);
            }

        }
        private tnomliquidaciondetalle getDecimoTercero()
        {
            IList<tnomdecimotercero> salvacaciones = TnomDecimoTerceroDal.Find(this.cd.cfuncionario);
            decimal dtercero = 0;
            foreach (tnomdecimotercero sva in salvacaciones)
            {
                dtercero = dtercero + sva.valor;
            }

            if (TnomPagoLiquidacionDal.Find("DECTER", true))
                dtercero = dtercero + this.getDecimoTerceroProporcional();

            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();
            INGRESO.descripcion = "VALOR POR DÉCIMO TERCERO PENDIENTES";
            INGRESO.nombre = "DÉCIMO TERCERO";
            INGRESO.valor = dtercero;
            INGRESO.parametro = null;
            INGRESO.porcentual = true;
            INGRESO.ctipocdetalle = null;
            INGRESO.calculado = dtercero;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = "DECTER";
            return INGRESO;
        }
        private decimal getDecimoTerceroProporcional()
        {
            decimal decimoTercero = 0;
            //INGRESOS EXTRAS MES CONSIDERADOS COMO EXTRAS 
            decimal totingresos = 0;
            //totingresos = this.setSumaIngresosLeyRol();
            Decimal danual = 0;



            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {

                danual = this.sueldo;

            }
            else
            {
                danual = (this.sueldo + this.hextra + totingresos);

            }

            danual = danual / 12;

            danual = decimal.Round(danual, 2, MidpointRounding.AwayFromZero);
            decimoTercero = danual;
            return decimoTercero;
        }
        private decimal setSumaIngresosLeyRol()
        {

            //NO SE CONSIDERAN INGRESOS EN ROL
            decimal total = 0;

            return total;
        }
        private tnomliquidaciondetalle getImpuestoRenta()
        {
            decimal impuestoRenta = 0;

            decimal mesgeneracion = TthParametrosDal.GetValorNumerico("MESGIMRENTA", this.ccompania);
            //CÁLCULA EL PAGO YA GENERADO EN EL MES DE GENERACIÓN
            tnompagoimpuestorenta imop = TnomPagoImpuestoRentaDal.Find(this.anio, this.cd.cfuncionario);

            if (!this.mes.Equals(this.completarMes(mesgeneracion)) && imop != null)
            {
                impuestoRenta = imop.valor.Value;
                // this.impuestoRentaGenerar = false;
            }
            else
            {
                // SI NO ES EL MES DE GENERACIÓN GENERA EL PAGO DE IMPUESTO A LA RENTA.
                List<tnomtablaimrenta> imprenta = TnomImpuestoRentaDal.Find(this.anio);
                tnomimpuestorenta gastosDeducibles = TnomImpuestoRentaDal.FindGastosDeducibles(this.cd.cfuncionario, this.anio);
                decimal gastosDeduciblesTotales = 1;
                decimal baseImponible = 0;
                decimal pagado = 0;
                if (gastosDeducibles != null)
                {
                    gastosDeduciblesTotales = gastosDeducibles.vtotal.Value;

                    pagado = gastosDeducibles.cpagado.Value;

                    decimal ingporcentual = this.cd.remuneracion.Value * (this.porcentajeiess / 100);

                    decimal ingNeto = this.cd.remuneracion.Value - ingporcentual;

                    decimal ingAnual = ingNeto * 12;
                    //decimal ingAnual = ingNeto *this.mesDescuento(this.mes);

                    baseImponible = (ingAnual + gastosDeducibles.totingresoexternos.Value) - gastosDeduciblesTotales;

                }
                tnomtablaimrenta cimpuesto = new tnomtablaimrenta();
                foreach (tnomtablaimrenta iren in imprenta)
                {
                    if ((baseImponible >= iren.fbasica) && (baseImponible < iren.exceso))
                    {
                        cimpuesto = iren;
                    }

                }

                //variable
                decimal calculo = baseImponible - cimpuesto.fbasica.Value;

                decimal total = calculo * (cimpuesto.impfraccion.Value / 100);

                decimal totalimpuestoRenta = total + cimpuesto.fbasicap.Value - pagado;
                decimal mesd = this.mesDescuento(this.mes);
                impuestoRenta = totalimpuestoRenta / mesd;
                // impuestoRenta = totalimpuestoRenta / 5;

            }
            impuestoRenta = decimal.Round(impuestoRenta, 2, MidpointRounding.AwayFromZero);
            this.pagoimprenta = (impuestoRenta > 0) ? true : false;
            tnomliquidaciondetalle tni = new tnomliquidaciondetalle();

            tni.nombre = "IMPUESTO A LA RENTA";
            tni.valor = impuestoRenta;
            tni.calculado = impuestoRenta;

            tni.porcentual = true;
            tni.ingreso = false;

            tni.fingreso = DateTime.Now;
            tni.descripcion = "IMPUESTO A LA RENTA";
            tni.tipoccatalogo = 1145;
            tni.tipocdetalle = "RETIRE";

            return tni;


        }
        private decimal mesDescuento(string mesNomina)
        {
            int mes = int.Parse(mesNomina);
            mes = mes - 1;
            mes = 12 - mes;

            return (decimal)mes;
        }
        public decimal getFondoReserva()
        {

            decimal totingresos = this.setSumaIngresosLeyRol();
            decimal fondoR = 0;
            Decimal danual = 0;
            decimal porcentajeFondoReserva = TthParametrosDal.GetValorNumerico("FACTOR_FONDOS_RESERVA", this.ccompania);
            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {

                danual = this.sueldo;

            }
            else
            {
                danual = (this.sueldo + this.hextra + totingresos);

            }
            fondoR = danual * (porcentajeFondoReserva / 100);

            if (this.acum.tienederecho == true)
            {
                this.diasFondoReserva = (int)this.diasMesc;
            }
            fondoR = fondoR * (this.diasFondoReserva / this.diasMesc);
            fondoR = decimal.Round(fondoR, 2, MidpointRounding.AwayFromZero);

            return fondoR;
        }
        public decimal getIessPatronalCalculado()
        {


            decimal iessPatronalc = 0;
            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {

                iessPatronalc = this.sueldo * ((this.param.ppaiesslosep.Value) / 100M);

            }
            else
            {
                decimal singre = 0;
                decimal ingrol = (this.sueldo + this.hextra + singre);
                decimal porcod = ((this.param.ppaiesscod.Value) / 100M);
                iessPatronalc = ingrol * porcod;
            }
            iessPatronalc = decimal.Round(iessPatronalc, 2, MidpointRounding.AwayFromZero);

            //this.iessPatronal = iessPatronalc;
            return iessPatronalc;
        }
        public decimal getCcc()
        {
            decimal ccc = 0;
            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {

                ccc = this.sueldo * this.param.pcccl.Value / 100;

            }
            else
            {
                decimal singre = 0;// this.setSumaIngresosLeyRol();
                decimal ingrol = (this.sueldo + this.hextra + singre);
                ccc = ingrol * this.param.pcccc.Value / 100;
            }
            ccc = decimal.Round(ccc, 2, MidpointRounding.AwayFromZero);


            return ccc;
        }
        //CCA 20240808
        public tnomliquidaciondetalle getAjusteDecimoTercero()
        {
            decimal total = 0;
            IList<tnomdecimotercero> dt = TnomDecimoTerceroDal.Find(this.cd.cfuncionario);
            foreach (tnomdecimotercero dter in dt)
            {
                decimal ajuste = 0;
                decimal totalpen = 0;
                ajuste = (dter.sueldoactual / (this.diasAnioc / this.diasMesc));
                decimal pagado = 0;
                pagado = ajuste - dter.valor;

                pagado = decimal.Round(pagado, 2, MidpointRounding.AwayFromZero);
                total = total + pagado;
            }
            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();
            total = decimal.Round(total, 2, MidpointRounding.AwayFromZero);
            INGRESO.descripcion = "VALOR POR DÉCIMO TERCERO PENDIENTES";
            INGRESO.nombre = "AJUSTE POR DÉCIMO TERCERO";
            INGRESO.valor = total;
            INGRESO.parametro = null;
            INGRESO.porcentual = true;
            INGRESO.ctipocdetalle = null;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = "DECTER";

            return INGRESO;
        }
        public tnomliquidaciondetalle getAjusteDecimoCuarto()
        {
            decimal total = 0;
            IList<tnomdecimocuarto> dt = TnomDecimoCuartoDal.Find(this.cd.cfuncionario);
            foreach (tnomdecimocuarto dcuar in dt)
            {
                decimal ajuste = 0;
                decimal totalpen = 0;
                tnomrol rol = TnomRolDal.Find(dcuar.crol);

                ajuste = (param.sbu.Value / (this.diasAnioc / this.diasMesc)) * rol.diascalculo.Value / 30;

                ajuste = decimal.Round(ajuste, 2, MidpointRounding.AwayFromZero);
                decimal pagado = 0;
                pagado = ajuste - dcuar.valor;

                total = total + pagado;
            }
            if (TnomPagoLiquidacionDal.Find("DECCUA", true))
                total = total;
            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();
            total = decimal.Round(total, 2, MidpointRounding.AwayFromZero);
            INGRESO.descripcion = "VALOR POR DÉCIMO CUARTO PENDIENTES";
            INGRESO.nombre = "AJUSTE POR DÉCIMO CUARTO";
            INGRESO.valor = total;
            INGRESO.parametro = null;
            INGRESO.porcentual = true;
            INGRESO.ctipocdetalle = null;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = "DECCUA";

            return INGRESO;
        }

        private tnomliquidaciondetalle getDecimoCuarto()
        {
            IList<tnomdecimocuarto> salvacaciones = TnomDecimoCuartoDal.Find(this.cd.cfuncionario);
            decimal dcuarto = 0;
            foreach (tnomdecimocuarto sva in salvacaciones)
            {
                if (sva.contabilizado != true) //CCA 20221121
                    dcuarto = dcuarto + sva.valor;
            }

            IList<tnomdecimocuarto> dt = TnomDecimoCuartoDal.Find(this.cd.cfuncionario, this.cd.regioncdetalle); //CCA 20240709
            decimal total = 0;
            int dias = 0;
            // CCA 20241014
            if (salvacaciones.Count() == 0)
            {
                foreach (tnomdecimocuarto dcuar in dt)
                {
                    decimal ajuste = 0;
                    decimal totalpen = 0;
                    tnomrol rol = TnomRolDal.Find(dcuar.crol);

                    ajuste = (param.sbu.Value / (this.diasAnioc / this.diasMesc)) * rol.diascalculo.Value / 30;
                    dias = dias + rol.diascalculo.Value;
                    ajuste = decimal.Round(ajuste, 2, MidpointRounding.AwayFromZero);
                    decimal pagado = 0;
                    pagado = ajuste - dcuar.valor;

                    total = total + pagado;
                }
            }


            dcuarto = dcuarto + total;
            if (dias > this.diasAnioc && dt.Count == 12) //CCA 20221121 dias >=
            {
                dcuarto = param.sbu.Value;
            }
            if (TnomPagoLiquidacionDal.Find("DECCUA", true))
                dcuarto = dcuarto + getDecimoCuartoProporcional();
            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();
            INGRESO.descripcion = "VALOR POR DÉCIMO CUARTO PENDIENTES";
            INGRESO.nombre = "DÉCIMO CUARTO";
            INGRESO.valor = dcuarto;
            INGRESO.parametro = null;
            INGRESO.porcentual = true;
            INGRESO.ctipocdetalle = null;
            INGRESO.calculado = dcuarto;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = "DECCUA";
            return INGRESO;
        }
        private tnomliquidaciondetalle getFondoReservaMensual()
        {
            decimal freserva = 0;
            freserva = this.getFondoReserva();
            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();
            INGRESO.descripcion = "VALOR POR FONDO RESERVA MENSUALIZADO";
            INGRESO.nombre = "FONDO RESERVA MENSUALIZADO";
            INGRESO.valor = freserva;
            INGRESO.parametro = null;
            INGRESO.porcentual = true;
            INGRESO.ctipocdetalle = null;
            INGRESO.calculado = freserva;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = "FONRES";
            return INGRESO;
        }
        private decimal getDecimoCuartoProporcional()
        {
            decimal diasMes = TthParametrosDal.GetValorNumerico("DIASMESNOMINA", this.ccompania);
            // CÁLCULO DE DIAS TRABAJADOS MENOS LAS FALTAS
            decimal decimoCuarto = 0;

            decimal sbuActual = this.param.sbu.Value;

            if (this.diasTrabajados >= (int)diasMesc)
            {
                decimoCuarto = sbuActual / 12;
            }
            else
            {
                decimal proporcional = sbuActual / this.diasAnioc;

                decimoCuarto = proporcional * this.diasTrabajados;

            }
            decimoCuarto = decimal.Round(decimoCuarto, 2, MidpointRounding.AwayFromZero);
            //ASIGNACIÓN DE VALORES EN DECIMO CUARTO
            return decimoCuarto;
        }
        public void EgresosDefecto()
        {
            this.lidetalle.Add(getIess());
            IList<tnomegreso> per = Egresos.getDescuentosPersonales(this.anio, cd.cfuncionario, this.mes, cd.remuneracion);
            foreach (tnomegreso ingPersonal in per)
            {
                tnomliquidaciondetalle EGRS = new tnomliquidaciondetalle();
                EGRS.porcentual = ingPersonal.porcentual;
                EGRS.valor = ingPersonal.calculado.Value;
                EGRS.calculado = ingPersonal.calculado.Value;
                EGRS.tipoccatalogo = 1145;
                EGRS.nombre = ingPersonal.nombredescuento;
                EGRS.tipocdetalle = ingPersonal.tipocdetalle;
                EGRS.ingreso = false;
                this.lidetalle.Add(EGRS);

            }
            if (this.pagoimprenta)
                this.lidetalle.Add(getImpuestoRenta());

        }
        public decimal singresosLeyRol()
        {
            decimal total = 0;
            //NO CONSIDERAR BONOS
            return total;
        }
        public tnomliquidaciondetalle getIess()
        {

            decimal iessPersonal = 0;
            //decimal porcentajeiess = 0;
            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {
                iessPersonal = this.sueldo * (this.param.pperiesslosep.Value / 100);
                porcentajeiess = this.param.pperiesslosep.Value;
            }
            else
            {
                decimal singre = this.singresosLeyRol();
                iessPersonal = (this.sueldo + this.hextra + singre) * (this.param.pperiesscod.Value / 100);
                porcentajeiess = this.param.pperiesscod.Value;
            }
            iessPersonal = decimal.Round(iessPersonal, 2, MidpointRounding.AwayFromZero);
            porcentajeiess = decimal.Round(porcentajeiess, 2, MidpointRounding.AwayFromZero);
            //ASIGNACIÓN DE UN EGRESO AL ROL DE PAGOS DE TIPO APORTE IESS.
            tnomliquidaciondetalle tni = new tnomliquidaciondetalle();

            tni.nombre = "APORTE IESS";
            tni.valor = porcentajeiess;
            tni.calculado = iessPersonal;

            tni.porcentual = true;
            tni.ingreso = false;

            tni.fingreso = DateTime.Now;
            tni.descripcion = "APORTE IESS GENERADO POR EL SISTEMA";
            tni.tipoccatalogo = 1145;
            tni.tipocdetalle = "APOIES";
            return tni;
        }


        public void calcularTiposLiquidacion(TiposLiquidacion ltip)
        {

            if (ltip.tipoliquidacion.Equals(EnumTipoLiquidacion.IPDESHAUCIO.Value))
            {
                this.lidetalle.Add(this.getCalculoDeshaucio(EnumTipoLiquidacion.IPDESHAUCIO.Value));
            }
            if (ltip.tipoliquidacion.Equals(EnumTipoLiquidacion.IPDESPIDOINTEMPESTIVO.Value))
            {
                this.lidetalle.Add(this.getcalculoDespidoIntempestivo(EnumTipoLiquidacion.IPDESPIDOINTEMPESTIVO.Value));
            }
            if (ltip.tipoliquidacion.Equals(EnumTipoLiquidacion.MUJEREMBARAZADA.Value))
            {
                this.lidetalle.Add(this.getCalculoMujerEmbarazada(EnumTipoLiquidacion.MUJEREMBARAZADA.Value));
            }
            if (ltip.tipoliquidacion.Equals(EnumTipoLiquidacion.ENFERMEDADNOPROFESIONAL.Value))
            {
                this.lidetalle.Add(this.getCalculoEnfermedadNoProfesional(EnumTipoLiquidacion.ENFERMEDADNOPROFESIONAL.Value, ltip.honorarios));
            }
            if (ltip.tipoliquidacion.Equals(EnumTipoLiquidacion.ENFERMEDADPROFESIONAL.Value))
            {
                this.lidetalle.Add(this.getCalculoEnfermedadProfesional(EnumTipoLiquidacion.ENFERMEDADPROFESIONAL.Value));
            }
            if (ltip.tipoliquidacion.Equals(EnumTipoLiquidacion.INCAPACIDADPERMANENTE.Value))
            {
                this.lidetalle.Add(this.getCalculoIncapacidadPermanente(EnumTipoLiquidacion.INCAPACIDADPERMANENTE.Value));
            }
            if (ltip.tipoliquidacion.Equals(EnumTipoLiquidacion.MUERTEACCIDENTETRABAJO.Value))
            {
                this.lidetalle.Add(this.getCalculoMuerteAccidenteTrabajo(EnumTipoLiquidacion.MUERTEACCIDENTETRABAJO.Value));
            }
            if (ltip.tipoliquidacion.Equals(EnumTipoLiquidacion.DIRIGENTESINDICAL.Value))
            {
                this.lidetalle.Add(this.getCalculoDespidoDirigenteSindical(EnumTipoLiquidacion.DIRIGENTESINDICAL.Value));
            }


        }
        private tnomliquidaciondetalle getcalculoDespidoIntempestivo(string ctipo)
        {

            //CONSULTA PARAMETROS
            List<tnomparametroliquidacion> pl = TnomparametroLiquidacionDal.Find(ctipo);

            decimal total = 0;
            decimal anio = pl.Find(x => x.parametro.Equals("ANIOS")).valor.Value;
            decimal aniosmaximo = pl.Find(x => x.parametro.Equals("ANIOSMAX")).valor.Value;

            int aniosServicio = (this.ffin.Year - this.cd.fvinculacion.Year);

            if (aniosServicio <= anio)
            {
                total = this.ultimaRemuneracion * anio;
            }

            else if (anio <= 25)
            {
                total = this.ultimaRemuneracion * aniosServicio;

            }
            else
            {
                total = this.cd.remuneracion.Value * aniosmaximo;
            }

            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();

            INGRESO.descripcion = "VALOR POR DESPIDO INTEMPESTIVO";
            INGRESO.nombre = "BONO POR DESPIDO INTEMPESTIVO";
            INGRESO.valor = total;
            INGRESO.parametro = "ANIOS";
            INGRESO.ctipocdetalle = ctipo;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = ctipo;
            return INGRESO;

        }
        private tnomliquidaciondetalle getCalculoMujerEmbarazada(string ctipo)
        {

            //CONSULTA PARAMETROS
            List<tnomparametroliquidacion> pl = TnomparametroLiquidacionDal.Find(ctipo);

            decimal meses = pl.Find(x => x.parametro.Equals("MESES")).valor.Value;
            decimal total = this.ultimaRemuneracion * meses;
            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();

            INGRESO.descripcion = "VALOR POR DESPIDO MUJER EMBARAZADA";
            INGRESO.nombre = "BONO POR DESPIDO EMBARAZO";
            INGRESO.valor = total;
            INGRESO.parametro = "MESES";
            INGRESO.ctipocdetalle = ctipo;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = ctipo;
            return INGRESO;

        }
        private tnomliquidaciondetalle getCalculoDeshaucio(string ctipo)
        {

            //CONSULTA PARAMETROS
            List<tnomparametroliquidacion> pl = TnomparametroLiquidacionDal.Find(ctipo);

            decimal porcentaje = pl.Find(x => x.parametro.Equals("PORCENTAJE")).valor.Value;

            int aniosServicio = (this.ffin.Year - this.cd.fvinculacion.Year);

            decimal total = this.ultimaRemuneracion * (porcentaje / 100) * aniosServicio;


            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();

            INGRESO.descripcion = "VALOR POR DESHAUCIO";
            INGRESO.nombre = "BONO POR DESHAUCIO";
            INGRESO.valor = total;
            INGRESO.parametro = "PORCENTAJE";
            INGRESO.ctipocdetalle = ctipo;
            INGRESO.porcentual = true;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = ctipo;
            return INGRESO;

        }
        private tnomliquidaciondetalle getCalculoEnfermedadNoProfesional(string ctipo, decimal honorarios)
        {

            //CONSULTA PARAMETROS
            List<tnomparametroliquidacion> pl = TnomparametroLiquidacionDal.Find(ctipo);

            decimal meses = pl.Find(x => x.parametro.Equals("MESES")).valor.Value;


            decimal total = (this.ultimaRemuneracion * meses) + honorarios;


            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();

            INGRESO.descripcion = "VALOR POR ENFERMEDAD NO PROFESIONAL";
            INGRESO.nombre = "BONO POR ENFERMEDAD NO PROFESIONAL";
            INGRESO.valor = total;
            INGRESO.parametro = "MESES";
            INGRESO.ctipocdetalle = ctipo;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = ctipo;
            return INGRESO;

        }

        private tnomliquidaciondetalle getCalculoEnfermedadProfesional(string ctipo, decimal SBU)
        {
            //VERIFICAR CALCULO POR NUMERO DE SBU
            decimal total = 0;
            //CONSULTA PARAMETROS
            List<tnomparametroliquidacion> pl = TnomparametroLiquidacionDal.Find(ctipo);
            tnomparametrodetalle param = TnomparametroDal.Find(anio);

            int aniosServicio = (this.ffin.Year - this.cd.fvinculacion.Year);
            decimal anios = pl.Find(x => x.parametro.Equals("ANIOS")).valor.Value;

            if (aniosServicio >= anios)
            {
                SBU = decimal.Parse((param.sbu).ToString());
                total = SBU * aniosServicio;
            }

            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();

            INGRESO.descripcion = "VALOR POR ENFERMEDAD PROFESIONAL";
            INGRESO.nombre = "BONO POR ENFERMEDAD PROFESIONAL";
            INGRESO.valor = total;
            INGRESO.parametro = "ANIOS";
            INGRESO.ctipocdetalle = ctipo;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = ctipo;
            return INGRESO;

        }

        private tnomliquidaciondetalle getCalculoDespidoDirigenteSindical(string ctipo)
        {

            //CONSULTA PARAMETROS
            List<tnomparametroliquidacion> pl = TnomparametroLiquidacionDal.Find(ctipo);

            decimal meses = pl.Find(x => x.parametro.Equals("MESES")).valor.Value;

            decimal total = (this.cd.remuneracion.Value * meses);
            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();

            INGRESO.descripcion = "VALOR POR DESPIDO DIRIGENTE SINDICAL";
            INGRESO.nombre = "BONO POR DESPIDO DIRIGENTE SINDICAL";
            INGRESO.valor = total;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = ctipo;
            return INGRESO;
        }
        private tnomliquidaciondetalle getCalculoIncapacidadTemporal(string ctipo)
        {

            //CONSULTA PARAMETROS
            List<tnomparametroliquidacion> pl = TnomparametroLiquidacionDal.Find(ctipo);

            decimal porcentaje = pl.Find(x => x.parametro.Equals("PORCENTAJE")).valor.Value;
            decimal meses = pl.Find(x => x.parametro.Equals("MESES")).valor.Value;

            decimal total = (this.ultimaRemuneracion * (porcentaje / 100)) * meses;
            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();

            INGRESO.descripcion = "VALOR POR INCAPACIDAD TEMPORAL";
            INGRESO.nombre = "BONO POR INCAPACIDAD TEMPORAL";
            INGRESO.valor = porcentaje;
            INGRESO.parametro = "PORCENTAJE";
            INGRESO.porcentual = true;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = ctipo;
            return INGRESO;

        }
        private tnomliquidaciondetalle getCalculoEnfermedadProfesional(string ctipo)
        {

            //CONSULTA PARAMETROS
            List<tnomparametroliquidacion> pl = TnomparametroLiquidacionDal.Find(ctipo);

            decimal porcentaje = pl.Find(x => x.parametro.Equals("PORCENTAJE")).valor.Value;
            decimal meses = pl.Find(x => x.parametro.Equals("MESES")).valor.Value;

            decimal total = (this.ultimaRemuneracion * (porcentaje / 100)) * meses;
            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();

            INGRESO.descripcion = "VALOR POR ENFERMEDAD PROFESIONAL";
            INGRESO.nombre = "BONO POR ENFERMEDAD PROFESIONAL";
            INGRESO.valor = porcentaje;
            INGRESO.parametro = "PORCENTAJE";
            INGRESO.porcentual = true;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = ctipo;
            return INGRESO;

        }

        private tnomliquidaciondetalle getCalculoIncapacidadPermanente(string ctipo)
        {
            //CONSULTAR RENTA VITALICIA

            //CONSULTA PARAMETROS
            List<tnomparametroliquidacion> pl = TnomparametroLiquidacionDal.Find(ctipo);

            decimal total = 0;
            decimal meses = pl.Find(x => x.parametro.Equals("MESES")).valor.Value;

            int aniosServicio = (this.ffin.Year - this.cd.fvinculacion.Year);

            total = this.ultimaRemuneracion * meses;

            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();

            INGRESO.descripcion = "VALOR POR INCAPACIDAD PERMANENTE";
            INGRESO.nombre = "BONO POR INCAPACIDAD PERMANENTE";
            INGRESO.valor = total;
            INGRESO.parametro = "MESES";
            INGRESO.ctipocdetalle = ctipo;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = ctipo;

            return INGRESO;
        }

        private tnomliquidaciondetalle getCalculoMuerteAccidenteTrabajo(string ctipo)
        {
            //CONSULTAR RENTA VITALICIA

            //CONSULTA PARAMETROS
            List<tnomparametroliquidacion> pl = TnomparametroLiquidacionDal.Find(ctipo);

            decimal total = 0;
            decimal meses = pl.Find(x => x.parametro.Equals("MESES")).valor.Value;

            int aniosServicio = (this.ffin.Year - this.cd.fvinculacion.Year);

            total = this.ultimaRemuneracion * meses;

            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();

            INGRESO.descripcion = "VALOR POR MUERTE,ACCIDENTE DE TRABAJO";
            INGRESO.nombre = "BONO POR MUERTE,ACCIDENTE DE TRABAJO";
            INGRESO.valor = total;
            INGRESO.parametro = "MESES";
            INGRESO.ctipocdetalle = ctipo;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = ctipo;
            return INGRESO;
        }
        public Liquidacion(tnomliquidacion param, IList<TiposLiquidacion> listaLiquidacion, int ccompania)
        {
            this.datosGenerales = param;
            this.ltipos = listaLiquidacion;
            this.lidetalle = new List<tnomliquidaciondetalle>();
            this.ffin = param.fdesvinculacion.Value;
            this.ccompania = ccompania;
            this.mes = this.completarMes(this.ffin.Month);
        }
        private string completarMes(decimal mesg)
        {
            string mesgenerado = "";
            if (mesg < 10)
            {
                mesgenerado = "0";
            }
            return mesgenerado + mesg.ToString();
        }
        public Liquidacion(tnomliquidacion liquidacion, long anio, int ccompania)
        {
            this.datosGenerales = liquidacion;
            this.anio = anio;
            this.lidetalle = new List<tnomliquidaciondetalle>();
            this.ffin = liquidacion.fdesvinculacion.Value;
            this.ccompania = ccompania;
            this.mes = this.completarMes(this.ffin.Month);
        }
        public tnomliquidaciondetalle getVacaciones()
        {
            IList<tnomsaldovacaciones> salvacaciones = TthnomVacacionDal.FindFuncionario(this.cd.cfuncionario);
            decimal vvacaciones = 0;
            foreach (tnomsaldovacaciones sva in salvacaciones)
            {
                vvacaciones = vvacaciones + sva.dias.Value;
            }
            decimal total = (this.cd.remuneracion.Value / this.diasMesc) * vvacaciones;
            tnomliquidaciondetalle INGRESO = new tnomliquidaciondetalle();
            INGRESO.descripcion = "VALOR POR VACACIONES PENDIENTES";
            INGRESO.nombre = "VACACIONES";
            INGRESO.valor = total;
            INGRESO.parametro = null;
            INGRESO.ctipocdetalle = null;
            INGRESO.calculado = total;
            INGRESO.ingreso = true;
            INGRESO.tipoccatalogo = 1145;
            INGRESO.tipocdetalle = "VAC";
            return INGRESO;
        }

    }
}
