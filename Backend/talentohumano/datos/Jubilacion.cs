using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using dal.talentohumano;
using modelo;
using util;

namespace talentohumano.datos
{
    public class Jubilacion
    {
        public IList<tnomjubilaciontotal> ing { get; set; }
        public tthcontratodetalle cd { get; set; }
        public IList<tnomjubilaciontotal> egr { get; set; }

        public IList<tnomjubilaciondetalle> det { get; set; }
        int aniosdesde { get; set; }
        int naniosmaximos { get; set; }

        int cantidadsbu { get; set; }
        int ccompania { get; set; }
        decimal sbu { get; set; }
        decimal segresos { get; set; }
        long anio { get; set; }
        long cfuncionario { get; set; }
        DateTime fproceso { get; set; }
        string mes { get; set; }



        decimal singresos { get; set; }
        public Jubilacion(int ccompania,List<tnomjubilaciondetalle> detalle ,decimal sbu, long anio,long cfuncionario, DateTime fproceso) {
            this.ing = new List<tnomjubilaciontotal>();
            this.egr = new List<tnomjubilaciontotal>();

            this.det = detalle;
            this.ccompania = ccompania;
            this.sbu = sbu;
            this.anio = anio;
            this.cfuncionario = cfuncionario;
            this.cd = new tthcontratodetalle();
            this.fproceso = fproceso;
            this.mes = fproceso.ToString("MM");
        }
      
        public void getDatosGenerales() {
            this.aniosdesde = TthParametrosDal.GetInteger("JUB_ANIOVALIDACION", this.ccompania);
            this.naniosmaximos = TthParametrosDal.GetInteger("JUB_SALARIOSMAX", this.ccompania);
            this.cantidadsbu = TthParametrosDal.GetInteger("JUB_CANTIDADSALARIOS", this.ccompania);
            this.cd = TthContratoDal.FindContratoFuncionario(this.cfuncionario);
            tthfuncionariodetalle fun = TthFuncionarioDal.Find(this.cfuncionario);
            if (cd == null)
            {
                throw new AtlasException("TTH-019", "NO SE HA DEFINIDO UN CONTRATO PARA EL FUNCIONARIO {0}", (fun.primernombre + " " + fun.primerapellido));

            }
            this.getIngresos();
            this.getEgresos();
        }
        public void getIngresos() {
            tnomjubilaciontotal jub = new tnomjubilaciontotal();
            jub = getJubilacion();
            if (jub.calculado > 0) {
                this.ing.Add(jub);
            }
            
        }
        private tnomjubilaciontotal getJubilacion() {

            decimal totalTiempo = 0;
            foreach (tnomjubilaciondetalle de in this.det)
            {
                totalTiempo = totalTiempo + de.tiempo.Value;

            }
            totalTiempo = totalTiempo - this.aniosdesde;

            decimal total = (this.sbu * this.cantidadsbu) * ((totalTiempo > 0)?totalTiempo:0);
            total = decimal.Round(total, 2, MidpointRounding.AwayFromZero);
            tnomjubilaciontotal ingd = new tnomjubilaciontotal();
            ingd.tipoccatalogo = 1145;
            ingd.tipocdetalle = "JUB";
            ingd.porcentual = false;
            ingd.ingreso = true;
            ingd.nombre = "BENEFICIO JUBILACIÓN";
            ingd.descripcion = "RUBRO CALCULADO POR EL BENEFICIO DE JUBILACIÓN";
            //validación maximos salarios parametrizados a pagar
            decimal maximo = this.naniosmaximos * this.sbu;
            if ( total> maximo ) {
                total = maximo;
            }
            ingd.calculado = total;
            return ingd;
        }
        //validar que se pida egresos en el cálculo
        public void getEgresos() {
            IList<tnomegreso> per = Egresos.getDescuentosPersonales(this.anio, this.cfuncionario, this.mes, cd.remuneracion);
            foreach (tnomegreso egrpersonal in per)
            {
                tnomjubilaciontotal EGRS = new tnomjubilaciontotal();
                EGRS.porcentual = egrpersonal.porcentual;
                EGRS.calculado = egrpersonal.calculado.Value;
           
                EGRS.tipoccatalogo = 1145;
                EGRS.nombre = egrpersonal.nombredescuento;
                EGRS.descripcion = egrpersonal.descripcion;
                EGRS.tipocdetalle = egrpersonal.tipocdetalle;
                EGRS.ingreso = false;
                this.egr.Add(EGRS);
            }
        }
        public decimal getSumaIngresos()
        {
            decimal total = 0;

            foreach (tnomjubilaciontotal ingresos in this.ing)
            {
                    if (ingresos.ingreso == true)
                    {
                        total = total + ingresos.calculado.Value;
                    }
                
            }
            this.singresos = total;
            return total;
        }
        public decimal getSumaEgresos()
        {
            decimal total = 0;

            foreach (tnomjubilaciontotal egresos in this.egr)
            {
                if (egresos.ingreso == false)
                {
                    total = total + egresos.calculado.Value;
                }

            }
            this.singresos = total;
            return total;
        }
    }
}
