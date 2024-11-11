using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using dal.talentohumano;
using dal.talentohumano.nomina;
using talentohumano.enums;
using dal.generales;
using util;

namespace talentohumano.datos
{
    public class Decimos
    {
        public IList<tnomingreso> ing;
        public IList<tnomegreso> egr { set; get; }
        public tthcontratodetalle cd;
        public string mes;
        public tnomnomina nom;
        public decimal sueldo;
        public tnomdecimos acum;
        public tnomrol Rolpagos { set; get; }
        public long cnomina { get; set; }
        public long anio { get; set; }
        public tnomparametrodetalle param { set; get; }
        public tnompagoregionesdecimo pdecimo { set; get; }
        public int ccompania { get; set; }
        public DateTime finicio { get; set; }
        public DateTime ffin { get; set; }
        public int diasTrabajados { get; set; }
        public int diasReales { get; set; }
        public string cdetallecentrocosto { get; set; }
        public int ccatalogocentrocosto { get; set; }
        decimal diasAnioc { get; set; }
        decimal diasMesc { get; set; }
        string tipo { get; set; }
        public decimal totalrolgeneral { get; set; }
        public Decimos()
        {

        }
        public Decimos(DateTime finicio, DateTime ffin, int ccompania, long cnomina, long canio, String cmes, tthcontratodetalle ccd, tnomparametrodetalle param, tnompagoregionesdecimo pd, tnomdecimos tnd, string tipo)
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
            this.tipo = tipo;
            this.Rolpagos = new tnomrol();
            // this.nom = TnomNominaDal.Find(cnomina);

        }
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
                this.diasMesc = TthParametrosDal.GetValorNumerico("DIASMESNOMINA", this.ccompania);

            }
            catch (Exception err)
            {
                throw new AtlasException("TTH-005", "NO SE HA DEFINIDO EL PARAMETRO {0}", "DIASMESNOMINA");
            }



            Rolpagos.cnomina = cnomina;
            //CÁLCULO SUELDO MENSUAL
            this.sueldo = 0;
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
            Rolpagos.sbeneficiosley = this.sueldo + this.setSumaIngresosLeyRol();
            Rolpagos.sdescuentosley = Rolpagos.segresos;
            Rolpagos.diascalculo = 0;
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
            this.totalrolgeneral = Rolpagos.total.Value;
            Rolpagos.saportepatrono = 0;
            Rolpagos.acumulacionbeneficiosley = 0;

        }
        public void setCalculoEgresos()
        {


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

        public decimal setSumaEgresosRol()
        {
            decimal total = 0;

            foreach (tnomegreso egresos in this.egr)
            {
                total = total + egresos.calculado.Value;

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
        public void setCalculoIngresos()
        {
            tnomingreso sueldoMensual = new tnomingreso();

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


            if (this.tipo.Equals("DTER"))
            {
                //DÉCIMO TERCERO
                tnomingreso decimoTercero = new tnomingreso();
                decimoTercero = this.getDecimoTercero();
                if (decimoTercero.calculado > 0)
                    ing.Add(decimoTercero);
                tnomingreso ajustedecimoTercero = new tnomingreso();
                ajustedecimoTercero = this.getAjusteDecimoTercero();
                if (ajustedecimoTercero.calculado == 0)
                {
                    //NO AGREGAR VALOR DE AJUSTE
                }
                else if (ajustedecimoTercero.calculado > 0)
                {
                    ajustedecimoTercero.tipocdetalle = EnumSaldo.OTRING.Value;
                    ing.Add(ajustedecimoTercero);
                }
                else
                {
                    tnomegreso ajustededescuento = new tnomegreso();
                    ajustededescuento.mesccatalogo = ajustedecimoTercero.mesccatalogo;
                    ajustededescuento.mescdetalle = ajustedecimoTercero.mescdetalle;
                    ajustededescuento.calculado = ajustedecimoTercero.calculado * -1;
                    ajustededescuento.fingreso = ajustedecimoTercero.fingreso;
                    ajustededescuento.nombredescuento = ajustedecimoTercero.nombrebeneficio;
                    ajustededescuento.tipoccatalogo = ajustedecimoTercero.tipoccatalogo;
                    ajustededescuento.tipocdetalle = EnumSaldo.OTRDES.Value;
                    ajustededescuento.valor = ajustedecimoTercero.calculado * -1;
                    egr.Add(ajustededescuento);

                }

            }
            else
            {
                //DÉCIMO CUARTO
                tnomingreso decimoCuarto = new tnomingreso();
                decimoCuarto = this.getDecimoCuarto();
                if (decimoCuarto.calculado > 0)
                    ing.Add(decimoCuarto);
                tnomingreso ajustedecimoCuarto = new tnomingreso();
                ajustedecimoCuarto = this.getAjusteDecimoCuarto();
                if (ajustedecimoCuarto.calculado == 0)
                {
                    //NO AGREGAR VALOR DE AJUSTE
                }
                else if (ajustedecimoCuarto.calculado > 0)
                {
                    ajustedecimoCuarto.tipocdetalle = EnumSaldo.OTRING.Value;
                    ing.Add(ajustedecimoCuarto);
                }
                else
                {
                    tnomegreso ajustededescuento = new tnomegreso();
                    ajustededescuento.mesccatalogo = ajustedecimoCuarto.mesccatalogo;
                    ajustededescuento.mescdetalle = ajustedecimoCuarto.mescdetalle;
                    ajustededescuento.calculado = ajustedecimoCuarto.calculado * -1;
                    ajustededescuento.fingreso = ajustedecimoCuarto.fingreso;
                    ajustededescuento.nombredescuento = ajustedecimoCuarto.nombrebeneficio;
                    ajustededescuento.tipoccatalogo = ajustedecimoCuarto.tipoccatalogo;
                    ajustededescuento.tipocdetalle = EnumSaldo.OTRDES.Value;
                    ajustededescuento.valor = ajustedecimoCuarto.calculado * -1;
                    ajustededescuento.descripcion = ajustedecimoCuarto.descripcion;
                    egr.Add(ajustededescuento);

                }
            }




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

        public Decimos(tthcontratodetalle cd, tnomnomina nom)
        {
            this.cd = cd;
            this.nom = nom;
        }
        public tnomrol getRol()
        {
            //NUEVA INSTANCIA DE ROL DE PAGOS
            tnomrol nr = new tnomrol();
            nr.cnomina = this.nom.cnomina;
            //CÁLCULO SUELDO MENSUAL
            this.sueldo = this.cd.remuneracion.Value;
            //BUSQUEDA DATOS GENERALES
            tthfuncionariodetalle fun = TthFuncionarioDal.FindFuncionario(this.cd.cfuncionario);
            tthcargo carg = TthcargoDal.FindInDataBaseCodigo(cd.ccargo);
            tthdepartamento dep = TthDepartamentoDal.FindDepartamento(long.Parse(carg.cdepartamento.ToString()));
            tthproceso pro = TthProcesoDal.FindPrceso(dep.cproceso);
            //BUSQUEDA DE ACUMULACIÓN Ó MENSUALIZACIÓN DE DÉCIMOS Y FONDOS DE RESERVA
            acum = TnomDecimosDal.FindAnio(this.nom.anio.Value, fun.cfuncionario);

            //Mdatos cabecera Rol
            nr.AddDatos("nfuncionario", fun.primernombre + " " + fun.primerapellido);
            nr.AddDatos("ncfuncionario", fun.primernombre + " " + fun.segundonombre + " " + fun.primerapellido + " " + fun.segundoapellido);
            nr.AddDatos("ncargo", carg.nombre);
            nr.AddDatos("ndepartamento", dep.nombre);
            nr.AddDatos("nproceso", pro.nombre);
            nr.AddDatos("ndepartamentoAb", dep.abreviatura);
            //Asignación de codigos
            nr.ccargo = carg.ccargo;
            nr.ccontrato = this.cd.ccontrato;
            nr.cdepartamento = dep.cdepartamento;
            nr.cfuncionario = fun.cfuncionario;
            nr.cproceso = pro.cproceso;
            nr.mdcuarto = acum.adecimoc.Value;
            nr.mdtercero = acum.adecimot.Value;
            nr.mfondos = acum.afondoreserva.Value;

            //SUELDO BASE
            nr.sueldobase = this.sueldo;

            nr.fingreso = DateTime.Now;
            nr.singresos = 0;
            nr.segresos = 0;

            //SUMA SOLO INGRESOS DE TIPO DÉCIMO
            nr.sbeneficiosley = 0;
            nr.sdescuentosley = nr.segresos;
            nr.diascalculo = 0;
            nr.diastrabajados = 0;
            nr.totalley = nr.sbeneficiosley - nr.sdescuentosley;
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
            nr.saportepatrono = 0;
            nr.acumulacionbeneficiosley = 0;
            return nr;
        }
        public tnomingreso getDecimoTercero()
        {
            decimal total = 0;
            decimal mens = 0;
            decimal acum = 0;
            IList<tnomdecimotercero> dt = TnomDecimoTerceroDal.Find(this.cd.cfuncionario);
            foreach (tnomdecimotercero dter in dt)
            {
                if (dter.mensualiza.Value)
                {
                    mens = mens + 0;
                }
                else
                {
                    acum = acum + dter.valor;
                }

            }

            total = acum - mens;
            tnomingreso tni = new tnomingreso();
            tni.cbeneficio = null;
            tni.nombrebeneficio = "DÉCIMO TERCER SUELDO";
            tni.valor = total;
            tni.calculado = total;
            tni.porcentual = false;
            tni.tipoccatalogo = 1145;
            tni.tipocdetalle = EnumSaldo.DTERCERO.Value;
            tni.mesccatalogo = 4;
            tni.mescdetalle = mes;
            tni.estado = true;
            tni.fingreso = DateTime.Now;
            tni.descripcion = "PAGO DÉCIMO TERCERO GENERADO EN NÓMINA";

            return tni;
        }
        public tnomingreso getAjusteDecimoTercero()
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

                pagado = decimal.Round(pagado, 4, MidpointRounding.AwayFromZero);
                total = total + pagado;
            }
            tnomingreso tni = new tnomingreso();
            tni.cbeneficio = null;
            tni.nombrebeneficio = "AJUSTE DÉCIMO TERCER SUELDO";
            total = decimal.Round(total, 2, MidpointRounding.AwayFromZero);
            tni.valor = total;

            tni.calculado = total;
            tni.porcentual = false;
            tni.tipoccatalogo = 1145;
            tni.tipocdetalle = EnumSaldo.DTERCERO.Value;
            tni.mesccatalogo = 4;
            tni.mescdetalle = mes;
            tni.estado = true;
            tni.fingreso = DateTime.Now;
            tni.descripcion = "AJUSTE ANUAL PAGO DÉCIMO TERCERO GENERADO EN NÓMINA";

            return tni;
        }
        public tnomingreso getDecimoCuarto()
        {
            decimal total = 0;
            IList<tnomdecimocuarto> dt = TnomDecimoCuartoDal.Find(this.cd.cfuncionario);
            foreach (tnomdecimocuarto dter in dt)
            {
                if (dter.contabilizado != true) //CCA 20220810
                    total = total + dter.valor;
            }
            tnomingreso tni = new tnomingreso();
            tni.cbeneficio = null;
            tni.nombrebeneficio = "DÉCIMO CUARTO SUELDO";
            tni.valor = total;
            tni.calculado = total;
            tni.porcentual = false;
            tni.tipoccatalogo = 1145;
            tni.tipocdetalle = EnumSaldo.DCUARTO.Value;
            tni.mesccatalogo = 4;
            tni.mescdetalle = mes;
            tni.estado = true;
            tni.fingreso = DateTime.Now;
            tni.descripcion = "PAGO DÉCIMO CUARTO GENERADO EN NÓMINA";

            return tni;
        }
        public tnomingreso getAjusteDecimoCuarto()
        {
            decimal total = 0;
            IList<tnomdecimocuarto> dt = TnomDecimoCuartoDal.Find(this.cd.cfuncionario);
            //this.finicio
            if (dt == null)
            {
                dt = new List<tnomdecimocuarto>();
            }
            IList<tnomdecimocuarto> dctmp = TnomDecimoCuartoDal.Find(this.cd.cfuncionario, this.finicio, this.ffin);
            foreach (tnomdecimocuarto dct in dctmp)
            {
                dt.Add(dct);
            }
            decimal proporcional = 0;
            proporcional = (param.sbu.Value / 12) * (dt.Count);
            foreach (tnomdecimocuarto dcuar in dt)
            {
                decimal ajuste = 0;
                decimal totalpen = 0;
                tnomrol r = TnomRolDal.Find(dcuar.crol);
                ajuste = ((this.param.sbu.Value / 12) * (r.diascalculo.Value / this.diasMesc));
                decimal pagado = 0;
                pagado = ajuste - dcuar.valor;

                pagado = decimal.Round(pagado, 4, MidpointRounding.AwayFromZero);
                total = total + pagado;
            }
            tnomingreso tni = new tnomingreso();
            tni.cbeneficio = null;
            tni.nombrebeneficio = "AJUSTE DÉCIMO CUARTO SUELDO";
            total = decimal.Round(total, 2, MidpointRounding.AwayFromZero);
            tni.valor = total;

            tni.calculado = total;
            tni.porcentual = false;
            tni.tipoccatalogo = 1145;
            tni.tipocdetalle = EnumSaldo.DCUARTO.Value;
            tni.mesccatalogo = 4;
            tni.mescdetalle = mes;
            tni.estado = true;
            tni.fingreso = DateTime.Now;
            tni.descripcion = "AJUSTE ANUAL PAGO DÉCIMO TERCERO GENERADO EN NÓMINA";

            return tni;
        }
    }
}
