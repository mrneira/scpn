using core.servicios;
using dal.talentohumano;
using dal.talentohumano.nomina;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.enums;
using util;
using dal.generales;
using dal.talentohumano.nomina.fondosdereserva;

namespace talentohumano.datos
{
    /// <summary>
    /// Clase que se encarga de generar el rol de pagos 
    /// </summary>
    public class Rol
    {
        public IList<tnomingreso> ing { set; get; }

        public IList<tnomegreso> egr { set; get; }
        public tthcontratodetalle cd { set; get; }
        public tnomparametrodetalle param { set; get; }
        public tnompagoregionesdecimo pdecimo { set; get; }
        public tnomrol Rolpagos { set; get; }
        public tnombeneficioley benley { set; get; }
        public tnomdecimos acum { set; get; }
        public tnomdecimocuarto dcuarto { set; get; }
        public tnomdecimotercero dtercero { set; get; }
        public long cnomina { set; get; }
        public long anio { set; get; }
        public String mes { set; get; }
        public decimal sueldo { set; get; }
        public int ccompania { set; get; }
        public decimal hextra { set; get; }
        public decimal sfondos { set; get; }
        public bool? mdfondos { set; get; }
        public decimal singresos { set; get; }
        public decimal segresos { set; get; }
        public decimal singresosley { set; get; }
        public decimal iessPatronal { set; get; }
        public decimal iessPersonal { set; get; }
        public int diasFondoReserva { get; set; }
        public DateTime finicio { get; set; }
        public DateTime ffin { get; set; }
        public int diasTrabajados { get; set; }
        public int diasReales { get; set; }
        public int diasMes { get; set; }
        public int diasCalculo { get; set; }
        public decimal porcentajeiess { get; set; }
        public decimal fonreserva { get; set; }
        public decimal cccc { get; set; }
        public decimal diasAnioc { get; set; }
        public decimal diasAniocFonres { get; set; }

        public decimal diasMesc { get; set; }
        public bool impuestoRentaGenerar { get; set; }
        public bool fondoReserva { get; set; }
        public bool derechoFondoReserva { get; set; }
        public tnompagoimpuestorenta pagoimprenta { get; set; }
        public string cdetallecentrocosto { get; set; }
        public int ccatalogocentrocosto { get; set; }
        public void setDatosGenerales()
        {

            //NUEVA INSTANCIA DE ROL DE PAGOS
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
                this.diasAniocFonres = TthParametrosDal.GetValorNumerico("DIASANIOFONRES", this.ccompania);
            }
            catch (Exception err)
            {
                throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0}", "DIASANIOFONRES");
            }
            try
            {
                this.diasMesc = TthParametrosDal.GetValorNumerico("DIASMESNOMINA", this.ccompania);

            }
            catch (Exception err)
            {
                throw new AtlasException("TTH-005", "NO SE HA DEFINIDO EL PARAMETRO {0}", "DIASMESNOMINA");
            }



            Rolpagos.cnomina = cnomina;
            //CÁLCULO SUELDO MENSUAL
            this.sueldo = this.setCalculoSueldo();
            //BUSQUEDA DATOS GENERALES
            tthfuncionariodetalle fun = TthFuncionarioDal.FindFuncionario(this.cd.cfuncionario);
            //BUSQUEDA DE ACUMULACIÓN Ó MENSUALIZACIÓN DE DÉCIMOS Y FONDOS DE RESERVA
            acum = TnomDecimosDal.FindAnio(this.anio, fun.cfuncionario);
            if (acum == null)
            {
                throw new AtlasException("TTH-007", "NO SE HA DEFINIDO LA ACUMULACIÓN O MENSUALIZACIÓN DEL FUNCIONARIO {0} EN EL AÑO {1}", fun.documento + " -" + fun.primernombre + " " + fun.primerapellido, this.anio);
            }
            //Mdatos cabecera Rol
            Rolpagos.AddDatos("nfuncionario", fun.primernombre + " " + fun.primerapellido);
            Rolpagos.AddDatos("ncfuncionario", fun.primernombre + " " + fun.segundonombre + " " + fun.primerapellido + " " + fun.segundoapellido);
            Rolpagos.AddDatos("ndocumento", fun.documento);

            //Asignación de codigos

            Rolpagos.ccontrato = this.cd.ccontrato;
            Rolpagos.cfuncionario = fun.cfuncionario;

            Rolpagos.mdcuarto = acum.adecimoc.Value;
            Rolpagos.mdtercero = acum.adecimot.Value;
            Rolpagos.mfondos = acum.afondoreserva.Value;

            //CENTRO COSTOS
            this.ccatalogocentrocosto = fun.centrocostoccatalogo.Value;
            this.cdetallecentrocosto = fun.centrocostocdetalle;
            Rolpagos.AddDatos("ncentrocosto", TgenCatalogoDetalleDal.Find(this.ccatalogocentrocosto, this.cdetallecentrocosto).nombre);

            Rolpagos.centrocostoccatalogo = this.ccatalogocentrocosto;
            Rolpagos.centrocostocdetalle = this.cdetallecentrocosto;

            //SUELDO BASE
            Rolpagos.sueldobase = this.sueldo;
            this.setCalculoIngresos();
            this.setCalculoEgresos();
            Rolpagos.fingreso = DateTime.Now;
            Rolpagos.singresos = this.setSumaIngresosRol();
            Rolpagos.segresos = this.setSumaEgresosRol();

            //SUMA SOLO INGRESOS DE TIPO DÉCIMO
            Rolpagos.sbeneficiosley = this.sueldo + this.hextra + this.setSumaIngresosLeyRol();
            Rolpagos.sdescuentosley = Rolpagos.segresos;
            Rolpagos.diascalculo = this.diasCalculo;
            Rolpagos.diastrabajados = this.diasTrabajados;
            decimal totalley = 0;
            decimal egresos = 0;
            foreach (tnomingreso ins in this.ing)
            {
                totalley += (ins.estado) ? ins.calculado.Value : 0;
            }
            foreach (tnomegreso ins in this.egr)
            {
                egresos += ins.calculado.Value;
            }
            totalley = totalley - egresos;
            Rolpagos.totalley = totalley;
            Rolpagos.total = Rolpagos.singresos - Rolpagos.segresos;
            Rolpagos.saportepatrono = this.getIessPatronalCalculado();
            Rolpagos.acumulacionbeneficiosley = this.benley.decimocuarto.Value + this.benley.decimotercero.Value + ((this.benley.fondoreserva != null) ? this.benley.fondoreserva.Value : 0m);

        }
        public void setDetalles()
        {
            tthcargo carg = TthcargoDal.FindInDataBaseCodigo(cd.ccargo);
            tthdepartamento dep = TthDepartamentoDal.FindDepartamento(long.Parse(carg.cdepartamento.ToString()));
            tthproceso pro = TthProcesoDal.FindPrceso(dep.cproceso);
            tgencatalogodetalle regimn = TgenCatalogoDetalleDal.Find(this.cd.regimenccatalogo.Value, this.cd.regimencdetalle);
            tgencatalogodetalle region = TgenCatalogoDetalleDal.Find(this.cd.regionccatalogo, this.cd.regioncdetalle);

            Rolpagos.AddDatos("ncargo", carg.nombre);
            Rolpagos.AddDatos("ndepartamento", dep.nombre);
            Rolpagos.AddDatos("nproceso", pro.nombre);
            Rolpagos.AddDatos("ndepartamentoAb", dep.abreviatura);
            Rolpagos.AddDatos("nregimen", regimn.nombre);
            Rolpagos.AddDatos("nregion", region.nombre);


            Rolpagos.ccargo = carg.ccargo;
            Rolpagos.cdepartamento = dep.cdepartamento;
            Rolpagos.cproceso = pro.cproceso;
        }

        private decimal setSumaIngresosLeyRol()
        {
            decimal total = 0;

            foreach (tnomingreso ingresos in this.ing)
            {
                if (ingresos.cbeneficio != null)
                {
                    //BUSQUEDA POR BENEFICIOS QUE SEAN APLICADOS PARA INGRESOS EN CÁLCULO DÉCIMOS
                    tnombeneficio tnb = TnomBeneficioDal.Find(ingresos.cbeneficio);
                    if (tnb.ingreso == true)
                    {
                        total = total + ingresos.calculado.Value;
                    }
                }
            }
            return total;
        }

        private decimal setSumaIngresosRol()
        {
            decimal total = 0;

            foreach (tnomingreso ingresos in this.ing)
            {
                total = total + ingresos.calculado.Value;

            }
            return total;
        }
        public decimal setSumaEgresosRol()
        {
            decimal total = 0;

            foreach (tnomegreso egresos in this.egr)
            {
                total = total + egresos.calculado.Value;

            }
            return total;
        }
        public void setCalculoIngresos()
        {
            tnomingreso sueldoMensual = new tnomingreso();
            sueldoMensual = this.getSueldo();
            ing.Add(sueldoMensual);
            //BENEFICIOS GENERALES
            IList<tnomingreso> gen = Ingreso.getBeneficiosGenerales(this.mes, cd.remuneracion);
            foreach (tnomingreso ingGeneral in gen)
            {
                if (ingGeneral.tipocdetalle == null)
                {
                    throw new AtlasException("TTH-008", "NO SE HA DEFINIDO EL CATÁLOGO CONTABLE PARA EL BENEFICIO GENERAL {0}", ingGeneral.nombrebeneficio);
                }
                ing.Add(ingGeneral);
            }

            //BENEFICIOS PERSONALES
            IList<tnomingreso> per = Ingreso.getBeneficiosPersonales(this.anio, cd.cfuncionario, this.mes, cd.remuneracion);
            foreach (tnomingreso ingPersonal in per)
            {
                if (ingPersonal.tipocdetalle == null)
                {
                    throw new AtlasException("TTH-009", "NO SE HA DEFINIDO EL CATÁLOGO CONTABLE PARA EL BENEFICIO PERSONAL {0}", ingPersonal.nombrebeneficio);
                }
                ing.Add(ingPersonal);
            }
            //CÁLCULO HORA EXTRAS DETALLADO
            IList<tnomingreso> HEX = Ingreso.horasExtras(cd.cfuncionario, this.mes, this.anio);
            foreach (tnomingreso HEXTRAS in HEX)
            {
                ing.Add(HEXTRAS);
                this.hextra = this.hextra + HEXTRAS.calculado.Value;
            }

            //BENEFICIOS DE LEY

            tnomingreso fondoReserva = new tnomingreso();

            decimal diasFondo = (this.ffin - this.cd.fvinculacion).Days;

            //FONDO DE RESERVA
            if (this.acum.tienederecho.Value || diasFondo >= this.diasAniocFonres)
            {
                fondoReserva = this.getFondoReserva();
                this.derechoFondoReserva = true;
                if (!this.acum.afondoreserva.Value)
                {

                    if (fondoReserva.calculado > 0)
                    {
                        ing.Add(fondoReserva);
                        this.benley.fondoreserva = fondoReserva.valor;
                    }
                }
                else
                {
                    this.fondoReserva = false;
                    this.benley.fondoreserva = 0;
                }
            }
            else
            {
                this.derechoFondoReserva = false;
            }


            //DÉCIMO CUARTO
            tnomingreso decimoCuarto = new tnomingreso();
            decimoCuarto = this.getDecimoCuarto();
            if (!this.acum.adecimoc.Value)
            {
                ing.Add(decimoCuarto);
                benley.decimocuarto = decimoCuarto.valor;

            }
            else
            {
                this.benley.decimocuarto = 0;
            }

            tnomingreso decimoTercero = new tnomingreso();
            decimoTercero = this.getDecimoTercero();
            if (!this.acum.adecimot.Value)
            {

                //DECIMO TERCERO

                ing.Add(decimoTercero);
                this.benley.decimotercero = decimoTercero.valor;

            }
            else
            {
                this.benley.decimotercero = 0;
            }
        }
        public void setCalculoEgresos()
        {
            tnomegreso IESS = new tnomegreso();
            IESS = getIessPersonal();
            egr.Add(IESS);

            //DESCUENTOS GENERALES
            IList<tnomegreso> gen = Egresos.getDescuentosGenerales(this.mes, cd.remuneracion);
            foreach (tnomegreso egrPersonal in gen)
            {
                if (egrPersonal.tipocdetalle == null)
                {
                    throw new AtlasException("TTH-010", "NO SE HA DEFINIDO EL CATÁLOGO CONTABLE PARA EL DESCUENTO GENERAL {0}", egrPersonal.nombredescuento);
                }
                egr.Add(egrPersonal);
            }

            //DESCUENTOS PERSONALES
            IList<tnomegreso> per = Egresos.getDescuentosPersonales(this.anio, cd.cfuncionario, this.mes, cd.remuneracion);
            foreach (tnomegreso egrPersonal in per)
            {
                if (egrPersonal.tipocdetalle == null)
                {
                    throw new AtlasException("TTH-011", "NO SE HA DEFINIDO EL CATÁLOGO CONTABLE PARA EL DESCUENTO PERSONAL {0}", egrPersonal.nombredescuento);
                }
                egr.Add(egrPersonal);
            }
            //CALCULO IESS

            tnomegreso IMPRENTA = new tnomegreso();
            IMPRENTA = this.getImpuestoRenta();

            if (IMPRENTA.calculado > 0)
            {
                egr.Add(IMPRENTA);
            }

        }
        public Rol()
        {

        }
        public void getDatosRol()
        {
            this.Rolpagos.diascalculo = this.diasCalculo;
            this.Rolpagos.diastrabajados = this.diasReales;
            this.Rolpagos.total = this.singresos + this.segresos;

        }
        public Rol(DateTime finicio, DateTime ffin, int ccompania, long cnomina, long canio, String cmes, tthcontratodetalle ccd, tnomparametrodetalle param, tnompagoregionesdecimo pd, tnomdecimos tnd)
        {
            this.cnomina = cnomina;
            this.anio = canio;
            this.mes = cmes;
            this.cd = ccd;
            this.param = param;
            this.pdecimo = pd;
            this.acum = tnd;
            this.ccompania = ccompania;
            this.finicio = finicio;
            this.ffin = ffin;
            this.ing = new List<tnomingreso>();
            this.egr = new List<tnomegreso>();
            this.pagoimprenta = new tnompagoimpuestorenta();
            this.Rolpagos = new tnomrol();
            this.benley = new tnombeneficioley();
            this.dtercero = new tnomdecimotercero();
            dcuarto = new tnomdecimocuarto();
            this.impuestoRentaGenerar = true;
            this.fondoReserva = true;
        }
        private tnomegreso getIessPersonal()
        {
            decimal iessPersonal = 0;
            this.porcentajeiess = 0;
            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {
                decimal singre = this.setSumaIngresosLeyRol();
                iessPersonal = (this.sueldo + singre) * (this.param.pperiesslosep.Value / 100);
                porcentajeiess = this.param.pperiesslosep.Value;

            }
            else
            {
                decimal singre = this.setSumaIngresosLeyRol();
                iessPersonal = (this.sueldo + this.hextra + singre) * (this.param.pperiesscod.Value / 100);
                porcentajeiess = this.param.pperiesscod.Value;
            }
            iessPersonal = decimal.Round(iessPersonal, 2, MidpointRounding.AwayFromZero);
            porcentajeiess = decimal.Round(porcentajeiess, 2, MidpointRounding.AwayFromZero);
            //ASIGNACIÓN DE UN EGRESO AL ROL DE PAGOS DE TIPO APORTE IESS.
            tnomegreso tni = new tnomegreso();
            tni.cdescuento = null;
            tni.nombredescuento = "APORTE IESS";
            tni.valor = porcentajeiess;
            tni.calculado = iessPersonal;
            this.iessPersonal = iessPersonal;
            tni.porcentual = true;
            tni.tipoccatalogo = 1145;
            tni.tipocdetalle = EnumSaldo.APORTEIESS.Value;
            tni.mesccatalogo = 4;
            tni.mescdetalle = mes;

            tni.fingreso = DateTime.Now;
            tni.descripcion = "APORTE IESS GENERADO POR EL SISTEMA";

            tnompagosaldo pag = TnomPagoSaldoDal.Find(1145, EnumSaldo.APORTEIESS.Value);
            tni.estado = pag.pagado;

            return tni;
        }
        private tnomingreso getSueldo()
        {
            tnomingreso ingr = new tnomingreso();
            ingr.nombrebeneficio = "SUELDO";
            ingr.cbeneficio = null;
            ingr.porcentual = false;
            ingr.mesccatalogo = 4;
            ingr.mescdetalle = this.mes;
            ingr.descripcion = "SUELDO MENSUAL";
            ingr.valor = this.setCalculoSueldo();
            ingr.calculado = this.sueldo;
            ingr.tipoccatalogo = 1145;
            ingr.tipocdetalle = EnumSaldo.SUELDO.Value;
            tnompagosaldo pag = TnomPagoSaldoDal.Find(1145, EnumSaldo.SUELDO.Value);
            ingr.estado = pag.pagado;
            return ingr;
        }
        public static decimal MonthDifference(DateTime FechaFin, DateTime FechaInicio)
        {
            return Math.Abs((FechaFin.Month - FechaInicio.Month) + 12 * (FechaFin.Year - FechaInicio.Year));

        }
        private decimal setCalculoSueldo()
        {


            DateTime f30dias = new DateTime(this.ffin.Year, this.ffin.Month, this.ffin.Day);
            this.diasReales = (f30dias - this.cd.fvinculacion).Days;
            // RRO 20211025 -------------------------------------------------------------------------

            if (this.ffin.Day != 30)
            {
                switch (this.ffin.Day)
                {
                    case 31:
                        this.diasReales -= 1;
                        break;

                    case 28:
                        this.diasReales += 2;
                        break;

                    case 29:
                        this.diasReales += 1;
                        break;
                }
            }

            // RRO 20211025 -------------------------------------------------------------------------

            this.diasMes = (int)this.diasMesc;
            this.diasReales = this.diasReales + 1;


            decimal meses = MonthDifference(this.ffin, this.cd.fvinculacion);

            //this.diasMes = DateTime.DaysInMonth(int.Parse(this.anio.ToString()), int.Parse(this.mes));
            this.diasFondoReserva = 0;
            //this.diasCalculo = 0;
            int diasVinculacion = this.cd.fvinculacion.Day - 1;
            int mesesc = (int)this.diasAnioc / (int)this.diasMesc;
            bool salidapersonal = false;
            int diasSalida = 0;
            if (this.cd.fdesvinculacion != null)
            {
                if (this.finicio.Month == this.cd.fdesvinculacion.Value.Month && this.finicio.Year == this.cd.fdesvinculacion.Value.Year)
                {
                    diasSalida = (this.cd.fdesvinculacion.Value - this.cd.fvinculacion).Days + 1;//CCA 20230223
                    salidapersonal = true;
                    this.diasReales = diasSalida;
                }

            }

            //VALIDACIÓN FONDO DE RESERVA
            //DIAS REALES MAYOR A DIAS AÑO NÓMINA 360

            if (meses >= mesesc)
            {
                // DIAS REALES MAYOR A DIAS AÑO FONDO + DIAS MES VALIDACIÓN QUE YA SE ENCUENTRE TOMANDO FONDO RESERVA

                if (meses > mesesc)
                {

                    if (diasSalida > 0)
                    {
                        this.diasFondoReserva = diasSalida;

                    }
                    else
                    {
                        this.diasFondoReserva = (int)this.diasMesc;
                    }
                }
                else
                {
                    if (meses == mesesc && this.acum.tienederecho.Value)
                    {
                        this.diasFondoReserva = (int)this.diasMesc; //CCA 20230328
                    }
                    else
                    {
                        //VALIDACIÓN SI TIENE PROPORCIONAL AL MES 13 EJM: ENTRO 3 DE ENERO DIAS CÁLCULO = 27
                        this.diasFondoReserva = (int)this.diasMesc - diasVinculacion;
                    }
                }
            }
            else
            {
                this.diasFondoReserva = 0;
            }
            if (this.acum.tienederecho.Value && this.diasFondoReserva < 2)//CCA 20230323
            {
                if (meses < 1 && diasSalida == 0)//CCA 20230223
                {
                    this.diasFondoReserva = (int)this.diasMesc - diasVinculacion;
                }
                else
                {
                    if (diasSalida > 0)
                    {
                        this.diasFondoReserva = diasSalida;
                    }
                    else
                    {
                        this.diasFondoReserva = (int)this.diasMesc; //CCA 20230223
                    }

                }

            }


            decimal sueldoProporcional = 0;
            if (this.diasReales == 0)
            {
                sueldoProporcional = 0;
                this.diasTrabajados = 0;
                this.diasCalculo = 0;
                this.diasReales = 0;
            }
            else if (this.diasReales > 0 && this.diasReales < this.diasMes)
            {
                decimal proporcional = ((decimal)this.diasReales / this.diasMesc);

                sueldoProporcional = this.cd.remuneracion.Value * (proporcional);
                sueldoProporcional = decimal.Round(sueldoProporcional, 2, MidpointRounding.AwayFromZero);
                this.diasTrabajados = this.diasReales;
                this.diasCalculo = this.diasReales;
            }
            else
            {
                sueldoProporcional = this.cd.remuneracion.Value;
                this.diasTrabajados = this.diasMes;
                this.diasReales = this.diasMes;
                this.diasCalculo = (int)this.diasMesc;

            }
            return sueldoProporcional;
        }
        public decimal getIessPatronalCalculado()
        {


            decimal iessPatronalc = 0;
            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {
                decimal singre = this.setSumaIngresosLeyRol();

                iessPatronalc = (this.sueldo + singre) * ((this.param.ppaiesslosep.Value) / 100M);

            }
            else
            {
                decimal singre = this.setSumaIngresosLeyRol();
                decimal ingrol = (this.sueldo + this.hextra + singre);
                decimal porcod = ((this.param.ppaiesscod.Value) / 100M);
                iessPatronalc = ingrol * porcod;
            }
            iessPatronalc = decimal.Round(iessPatronalc, 2, MidpointRounding.AwayFromZero);

            this.iessPatronal = iessPatronalc;
            return iessPatronal;
        }
        public decimal getCcc()
        {
            decimal ccc = 0;
            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {
                decimal singre = this.setSumaIngresosLeyRol();
                ccc = (this.sueldo + singre) * this.param.pcccl.Value / 100;

            }
            else
            {
                decimal singre = this.setSumaIngresosLeyRol();
                decimal ingrol = (this.sueldo + this.hextra + singre);
                ccc = ingrol * this.param.pcccc.Value / 100;
            }
            ccc = decimal.Round(ccc, 2, MidpointRounding.AwayFromZero);

            this.cccc = ccc;
            return ccc;
        }
        public tnomsaldovacaciones getVacaciones()
        {

            tnomsaldovacaciones ob = new tnomsaldovacaciones();

            decimal dias = 0;
            if (cd.regimencdetalle.Equals(EnumRegimen.CODTRABAJO.Value))
            {
                try
                {
                    dias = TthParametrosDal.GetValorNumerico("DIASCOD", this.ccompania);
                }
                catch (Exception eX)
                {

                }
                ob.valor = (this.sueldo + this.hextra + this.setSumaIngresosLeyRol()) / 24m;
                ob.dias = (dias / (this.diasAnioc / (decimal)this.diasCalculo));
            }
            else
            {
                dias = TthParametrosDal.GetValorNumerico("DIASLOSEP", this.ccompania);
                ob.valor = (this.sueldo) / 12m;
                ob.dias = (dias / (this.diasAnioc / (decimal)this.diasCalculo));
            }
            ob.valor = decimal.Round(ob.valor.Value, 2, MidpointRounding.AwayFromZero);
            ob.dias = decimal.Round(ob.dias.Value, 2, MidpointRounding.AwayFromZero);
            ob.mesccatalogo = 4;
            ob.mescdetalle = this.mes;
            ob.anio = (int)this.anio;
            ob.sueldoactual = this.cd.remuneracion.Value;
            ob.cfuncionario = this.cd.cfuncionario;

            return ob;

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
        private tnomegreso getImpuestoRenta()
        {
            decimal impuestoRenta = 0;

            decimal mesgeneracion = TthParametrosDal.GetValorNumerico("MESGIMRENTA", this.ccompania);
            //CÁLCULA EL PAGO YA GENERADO EN EL MES DE GENERACIÓN
            tnompagoimpuestorenta imop = TnomPagoImpuestoRentaDal.Find(this.anio, this.cd.cfuncionario);

            if (!this.mes.Equals(this.completarMes(mesgeneracion)) && imop != null)
            {
                impuestoRenta = imop.valor.Value;
                this.impuestoRentaGenerar = false;
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

            this.pagoimprenta.valor = impuestoRenta;
            this.pagoimprenta.cfuncionario = this.cd.cfuncionario;
            this.pagoimprenta.anio = this.anio;



            tnomegreso tni = new tnomegreso();
            tni.cdescuento = null;
            tni.nombredescuento = "IMPUESTO RENTA ";
            tni.valor = impuestoRenta;
            tni.calculado = impuestoRenta;
            tni.porcentual = true;
            tni.tipoccatalogo = 1145;
            tnompagosaldo pag = TnomPagoSaldoDal.Find(1145, EnumSaldo.IMPUESTORENTA.Value);

            tni.tipocdetalle = EnumSaldo.IMPUESTORENTA.Value;
            tni.mesccatalogo = 4;
            tni.mescdetalle = this.mes;
            tni.estado = pag.pagado;
            tni.fingreso = DateTime.Now;
            tni.descripcion = "IMPUESTO A LA RENTA GENERADO POR EL SISTEMA";
            return tni;
        }
        private decimal mesDescuento(string mesNomina)
        {
            int mes = int.Parse(mesNomina);
            mes = mes - 1;
            mes = 12 - mes;

            return (decimal)mes;
        }
        public tnomingreso getFondoReserva()
        {

            tnomfondoreserva temp = TnomFondosDeReservaDal.FindByFuncionarioMesAnio(this.cd.cfuncionario, this.mes, (int)this.anio);
            decimal totingresos = this.setSumaIngresosLeyRol();
            decimal fondoR = 0;
            Decimal danual = 0;
            decimal porcentajeFondoReserva = TthParametrosDal.GetValorNumerico("FACTOR_FONDOS_RESERVA", this.ccompania);
            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {

                danual = this.cd.remuneracion.Value + totingresos;//this.sueldo // RRO 20211012

            }
            else
            {
                danual = (this.cd.remuneracion.Value + this.hextra + totingresos);// RRO 20211012

            }
            fondoR = danual * (porcentajeFondoReserva / 100);

            if (this.acum.tienederecho == true)
            {
                this.diasFondoReserva = (int)this.diasFondoReserva;// CCA 20221213
            }
            fondoR = fondoR * (this.diasFondoReserva / this.diasMesc);
            fondoR = decimal.Round(fondoR, 2, MidpointRounding.AwayFromZero);
            tnomingreso tni = new tnomingreso();
            tni.cbeneficio = null;
            tni.nombrebeneficio = "PAGO MENSUAL FONDO RESERVA";
            if (temp != null)
            {
                tni.valor = temp.valor;

            }
            else
            {
                tni.valor = porcentajeFondoReserva;

            }
            tni.calculado = fondoR;
            tni.porcentual = true;
            tni.tipoccatalogo = 1145;
            tni.tipocdetalle = EnumSaldo.FONDORESERVA.Value;
            tni.mesccatalogo = 4;
            tni.mescdetalle = this.mes;
            tnompagosaldo pag = TnomPagoSaldoDal.Find(1145, EnumSaldo.FONDORESERVA.Value);
            tni.estado = pag.pagado;
            tni.fingreso = DateTime.Now;
            tni.descripcion = "FONDO RESERVA GENERADO POR EL SISTEMA";
            this.fonreserva = tni.calculado.Value;
            return tni;
        }
        private tnomingreso getDecimoTercero()
        {
            decimal decimoTercero = 0;
            //INGRESOS EXTRAS MES CONSIDERADOS COMO EXTRAS 
            decimal totingresos = this.setSumaIngresosLeyRol();
            Decimal danual = 0;
            dtercero.cfuncionario = this.cd.cfuncionario;
            dtercero.mesccatalogo = 4;
            dtercero.mescdetalle = this.mes;
            dtercero.mensualiza = true;
            dtercero.contabilizado = false;

            dtercero.anio = int.Parse(this.anio.ToString());
            dtercero.sueldoactual = totingresos;

            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {

                danual = this.sueldo + totingresos;

            }
            else
            {
                danual = (this.sueldo + this.hextra + totingresos);

            }
            decimal total = danual;
            dtercero.sueldoactual = danual;
            danual = danual / 12;

            danual = decimal.Round(danual, 2, MidpointRounding.AwayFromZero);

            decimoTercero = danual;
            dtercero.valor = decimoTercero;

            tnomingreso tni = new tnomingreso();
            tni.cbeneficio = null;
            tni.nombrebeneficio = "PAGO MENSUAL DÉCIMO TERCERO";
            tni.valor = decimoTercero;
            tni.calculado = decimoTercero;
            tni.porcentual = false;
            tnompagosaldo pag = TnomPagoSaldoDal.Find(1145, EnumSaldo.DTERCERO.Value);

            tni.tipoccatalogo = 1145;
            tni.tipocdetalle = EnumSaldo.DTERCERO.Value;
            tni.mesccatalogo = 4;
            tni.mescdetalle = this.mes;
            tni.estado = pag.pagado;
            tni.fingreso = DateTime.Now;
            tni.descripcion = "DÉCIMO TERCER SUELDO GENERADO POR EL SISTEMA";
            return tni;

        }
        private tnomingreso getDecimoCuarto()
        {
            //DECIMO TERCER SUELDO DEFECTO 30
            decimal diasMes = TthParametrosDal.GetValorNumerico("DIASMESNOMINA", this.ccompania);
            // CÁLCULO DE DIAS TRABAJADOS MENOS LAS FALTAS
            decimal decimoCuarto = 0;

            decimal sbuActual = this.param.sbu.Value;

            if (this.diasTrabajados >= this.diasMes)
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

            this.dcuarto.valor = decimoCuarto;
            this.dcuarto.mesccatalogo = 4;
            this.dcuarto.mescdetalle = this.mes;
            this.dcuarto.fingreso = Fecha.GetFechaSistema();
            this.dcuarto.fechageneracion = Fecha.GetFechaSistema();
            this.dcuarto.anio = this.anio;
            this.dcuarto.sueldoactual = sbuActual;
            tnomingreso tni = new tnomingreso();
            tni.cbeneficio = null;
            tni.nombrebeneficio = "PAGO MENSUAL DÉCIMO CUARTO";
            tni.valor = decimoCuarto;
            tni.calculado = decimoCuarto;
            tni.porcentual = false;
            tni.tipoccatalogo = 1145;
            tni.tipocdetalle = EnumSaldo.DCUARTO.Value;
            tnompagosaldo pag = TnomPagoSaldoDal.Find(1145, EnumSaldo.DCUARTO.Value);

            tni.mesccatalogo = 4;
            tni.mescdetalle = this.mes;
            tni.estado = pag.pagado;
            tni.fingreso = DateTime.Now;
            tni.descripcion = "DÉCIMO CUARTO SUELDO GENERADO POR EL SISTEMA";
            return tni;



        }
        public tnomingreso getDecimoCuartoAnual()
        {
            decimal total = 0;
            IList<tnomdecimocuarto> dt = TnomDecimoCuartoDal.Find(this.cd.cfuncionario);
            foreach (tnomdecimocuarto dter in dt)
            {
                total = total + dter.valor;
            }
            tnomingreso tni = new tnomingreso();
            tni.cbeneficio = null;
            tni.nombrebeneficio = "DÉCIMO CUARTO SUELDO";
            tni.valor = total;
            tni.calculado = total;
            tni.porcentual = false;
            tni.tipoccatalogo = 1147;
            tni.tipocdetalle = EnumSaldo.DCUARTO.Value;
            tni.mesccatalogo = 4;
            tni.mescdetalle = mes;
            tni.estado = true;
            tni.fingreso = DateTime.Now;
            tni.descripcion = "PAGO DÉCIMO CUARTO GENERADO EN NÓMINA";

            return tni;
        }
        public tnomingreso getDecimoTerceroAnual()
        {
            decimal total = 0;
            IList<tnomdecimotercero> dt = TnomDecimoTerceroDal.Find(this.cd.cfuncionario);
            foreach (tnomdecimotercero dter in dt)
            {
                total = total + dter.valor;
            }
            tnomingreso tni = new tnomingreso();
            tni.cbeneficio = null;
            tni.nombrebeneficio = "DÉCIMO TERCER SUELDO";
            tni.valor = total;
            tni.calculado = total;
            tni.porcentual = false;
            tni.tipoccatalogo = 1147;
            tni.tipocdetalle = EnumSaldo.DTERCERO.Value;
            tni.mesccatalogo = 4;
            tni.mescdetalle = mes;
            tni.estado = true;
            tni.fingreso = DateTime.Now;
            tni.descripcion = "PAGO DÉCIMO TERCERO GENERADO EN NÓMINA";

            return tni;
        }
        public tnomrolprovicion getRolProvision()
        {
            tnomrolprovicion rpro = new tnomrolprovicion();
            rpro.centrocostoccatalogo = this.ccatalogocentrocosto;
            rpro.centrocostocdetalle = this.cdetallecentrocosto;
            rpro.Esnuevo = true;
            rpro.Actualizar = false;
            rpro.ccompania = this.ccompania;
            rpro.ccargo = this.cd.ccargo;
            rpro.cfuncionario = this.cd.cfuncionario;
            rpro.aporteiess = this.iessPersonal;
            rpro.aportepatronal = this.iessPatronal;

            if (this.acum.adecimoc.Value)
            {
                rpro.decimocuarto = this.dcuarto.valor;
                rpro.decimocuartop = 0;
            }
            else
            {
                rpro.decimocuarto = 0;
                rpro.decimocuartop = this.dcuarto.valor;

            }

            if (this.acum.adecimot.Value)
            {
                rpro.decimotercero = this.dtercero.valor;
                rpro.decimotercerop = 0;
            }
            else
            {
                rpro.decimotercero = 0;
                rpro.decimotercerop = this.dtercero.valor;

            }


            if (this.diasFondoReserva > 0)
            {

                if (this.fondoReserva)
                {
                    rpro.fondoreservap = this.fonreserva;
                    rpro.fondosreserva = 0;
                }
                else
                {
                    rpro.fondoreservap = 0;
                    rpro.fondosreserva = this.fonreserva;

                }
            }
            else
            {
                rpro.fondoreservap = 0;
                rpro.fondosreserva = 0;

            }


            decimal totingresos = this.setSumaIngresosLeyRol();
            if (cd.regimencdetalle == EnumRegimen.LOSEP.Value)
            {
                rpro.total = this.sueldo;


            }
            else
            {
                rpro.total = (this.sueldo + this.hextra + totingresos);

            }

            rpro.ccc = this.getCcc();

            rpro.totalpagado = rpro.aportepatronal.Value + rpro.ccc.Value + rpro.aporteiess;
            return rpro;
        }
    }
}
