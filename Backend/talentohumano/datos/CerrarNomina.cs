using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using dal.talentohumano;
using talentohumano.enums;
using dal.talentohumano.nomina;

namespace talentohumano.datos
{

    public class CerrarNomina
    {
        public tnomnomina nom { get; set; }
        public tnomrol rol { get; set; }
        public String Cusuario { get; set; }
        public DateTime Freal { get; set; }
        public tthcontratodetalle cd { set; get; }
        public tnomdecimos dec { get; set; }
        public int Ccompania { get; set; }
        public int diasTrabajados { get; set; }
        public decimal sueldoActual { get; set; }
        public IList<tnomingreso> ing { set; get; }
        public IList<tnomegreso> egr { set; get; }
        public long anio { set; get; }
        public String mes { set; get; }
        public tnomrolprovicion rolProvision { get; set; }
        public tnombeneficioley benley { get; set; }
        public decimal dtercero { get; set; }
        public decimal dcuarto { get; set; }
        public decimal fondoreserva { get; set; }
        public decimal hextra { get; set; }
        public tnomdecimos acum { get; set; }


        public CerrarNomina()
        {

        }
        public tnomrolprovicion getRolProvision() {
            tnomrolprovicion rpro = new tnomrolprovicion();
            rpro.Esnuevo = true;
            rpro.Actualizar = false;
            rpro.ccompania = this.Ccompania;
            rpro.crol = this.rol.crol;
            rpro.ccargo = this.rol.ccargo.Value;
            rpro.cfuncionario = this.rol.cfuncionario.Value;
            rpro.aporteiess = 0;
            rpro.aportepatronal = 0;
            rpro.decimotercero = this.dtercero;
            rpro.decimocuarto = this.dcuarto;
            rpro.fondosreserva = this.fondoreserva;
            return rpro;
        }
        public CerrarNomina(tnomnomina nom, tnomrol rol, String usuario)
        {
            this.nom = nom;
            this.rol = rol;
            this.Freal = Fecha.GetFechaSistema();
            this.Cusuario = usuario;
            this.cd = TthContratoDal.FindContratoFuncionario(rol.cfuncionario.Value);
            this.dec = TnomDecimosDal.FindAnio((long)this.nom.anio, rol.cfuncionario.Value);
            this.rolProvision = new tnomrolprovicion();
            this.benley = new tnombeneficioley();

        }
        public tnomdecimocuarto getDecimoCuarto()
        {

            tnomdecimocuarto ob = new tnomdecimocuarto();
            ob.Esnuevo = true;
            ob.Actualizar = false;
            ob.cusuarioing = this.Cusuario;
            ob.fingreso = this.Freal;
            ob.fechageneracion = this.Freal;
            tnomparametrodetalle paramd = TnomparametroDal.Find((long)this.nom.anio);
            ob.valor = (((decimal)this.diasTrabajados * 12) / 360) * paramd.sbu.Value;
            this.dcuarto = ob.valor;
            ob.mesccatalogo = 4;
            ob.mescdetalle = nom.mescdetalle;
            ob.anio = this.nom.anio;
            ob.crol = this.rol.crol;
            if (this.dec.adecimoc.Value)
            {
                ob.mensualiza = true;
                ob.contabilizado = true;
              

            }
            else {
                ob.mensualiza = false;
                ob.contabilizado = false;
               
            }
            ob.sueldoactual = this.cd.remuneracion.Value;
            ob.cfuncionario = this.cd.cfuncionario;

            return ob;

        }
        public void getDiasTrabajados() {
            int diasReales = (this.nom.ffin.Value - this.cd.fvinculacion).Days;
            int diasMes = DateTime.DaysInMonth(this.nom.ffin.Value.Year, this.nom.ffin.Value.Month);
            decimal sueldoProporcional = 0;

            if (diasReales == 0)
            {
                this.sueldoActual = 0;
                this.diasTrabajados = 0;
            }
            else if (diasReales > 0 && diasReales < diasMes)
            {
                this.sueldoActual = this.cd.remuneracion.Value * ((decimal)diasReales / 30);
                this.sueldoActual = decimal.Round(sueldoProporcional, 4, MidpointRounding.AwayFromZero);
                this.diasTrabajados = diasReales;
            }
            else
            {
                this.sueldoActual = this.cd.remuneracion.Value;
                this.diasTrabajados = 30;
            }

        }
        public tnomingreso getSueldo()
        {
            tnomingreso ingr = new tnomingreso();
            ingr.nombrebeneficio = "SUELDO";
            ingr.cbeneficio = null;
            ingr.porcentual = false;
            ingr.mesccatalogo = 4;
            ingr.mescdetalle = this.mes;
            ingr.valor = this.sueldoActual;
            ingr.calculado = this.sueldoActual;
            ingr.tipoccatalogo = 1145;
            ingr.tipocdetalle = EnumSaldo.SUELDO.Value;

            return ingr;
        }
        private void calculoIngresos()
        {

            //BENEFICIOS GENERALES
            IList<tnomingreso> gen = Ingreso.getBeneficiosGenerales(this.mes, cd.remuneracion);
            foreach (tnomingreso ingGeneral in gen)
            {
                ing.Add(ingGeneral);
            }

            //BENEFICIOS PERSONALES
            IList<tnomingreso> per = Ingreso.getBeneficiosPersonales(this.anio,cd.cfuncionario, this.mes, cd.remuneracion);
            decimal total = 0;
            foreach (tnomingreso ingPersonal in per)
            {
                total = total + ingPersonal.calculado.Value;
                ing.Add(ingPersonal);
            }

            //SUELDO
            tnomingreso sueldoMensual = new tnomingreso();
            sueldoMensual = this.getSueldo();
            ing.Add(sueldoMensual);

            //HORAS EXTRAS
            IList<tnomingreso> HEX = Ingreso.horasExtras(cd.cfuncionario, this.mes,this.anio);
            foreach (tnomingreso HEXTRAS in HEX)
            {
                ing.Add(HEXTRAS);
            }
            //BENEFICIOS DE LEY


            //FONDO DE RESERVA
            if (!this.acum.afondoreserva.Value)
            {
                tnomingreso _fondoReserva = new tnomingreso();
                this.fondoreserva = _fondoReserva.valor.Value;
                    
                    ing.Add(_fondoReserva);
                benley.fondoreserva = _fondoReserva.valor;
            }
            else {
                benley.fondoreserva = 0;
                this.fondoreserva = 0;
            }
            //DÉCIMO CUARTO
            if (!this.acum.adecimoc.Value)
            {
                tnomingreso decimoCuarto = new tnomingreso();
               //decimoCuarto = this.decimoCuartoC();
                ing.Add(decimoCuarto);
                benley.decimocuarto = decimoCuarto.valor;

            }
            else {
                benley.decimocuarto = 0;
            }



            if (!this.acum.adecimot.Value)
            {

                //DECIMO TERCERO
                tnomingreso decimoTercero = new tnomingreso();

                //decimoTercero = this.decimoTerceroC();
                ing.Add(decimoTercero);
                benley.decimotercero = decimoTercero.valor;

            }
            else {
                benley.decimotercero = 0;
            }
        }
        private decimal sumaIngresosLeyRol()
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

        public tnomsaldovacaciones getVacaciones()
        {

            tnomsaldovacaciones ob = new tnomsaldovacaciones();
                ob.Esnuevo = true;
                ob.Actualizar = false;
                ob.cusuarioing = this.Cusuario;
                ob.fingreso = this.Freal;
                ob.fechageneracion = this.Freal;
                decimal dias = 0;
                if (cd.regimencdetalle.Equals(EnumRegimen.CODTRABAJO.Value))
                {
                    dias = TthParametrosDal.GetValorNumerico("DIASCOD", this.Ccompania);
                    ob.valor= (dias/(360/ (decimal)this.diasTrabajados)) * (this.cd.remuneracion.Value/360 );
                    ob.dias = (dias / (360 / (decimal)this.diasTrabajados));

            }
            else {
                    dias = TthParametrosDal.GetValorNumerico("DIASLOSEP", this.Ccompania);
                    ob.valor = (dias / (360/ (decimal)this.diasTrabajados)) * (this.cd.remuneracion.Value/360);
                ob.dias = (dias / (360 / (decimal)this.diasTrabajados));

            }
            ob.mesccatalogo = 4;
                ob.mescdetalle = nom.mescdetalle;
                ob.anio = (int)this.nom.anio;
                ob.sueldoactual = this.cd.remuneracion.Value;
                ob.cfuncionario = this.cd.cfuncionario;
  
            return ob;

        }
    }
}
