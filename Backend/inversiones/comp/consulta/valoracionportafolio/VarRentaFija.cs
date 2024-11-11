using core.componente;
using dal.inversiones.parametros;
using dal.inversiones.var;
using inversiones.datos;
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
using util.dto.consulta;

namespace inversiones.comp.consulta.valoracionportafolio
{
    public class VarRentaFija : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            CultureInfo usCulture = new CultureInfo("es-PE");
            string tipovar = "FIJA";
            int finiciotmp = rqconsulta.GetInt("finicio").Value;
            int ffintmp = rqconsulta.GetInt("ffin").Value;
            string tipoarchivo = rqconsulta.GetString("tipo");
            DateTime finicio = Fecha.IntToDate(finiciotmp);
            DateTime ffin = Fecha.IntToDate(ffintmp);

            //PROVABILIDAD DE NO PERDIDA
            decimal prnper = TinvParametrosDal.GetValorNumerico("PROBABILIDADNPERDIDA-FIJA", rqconsulta.Ccompania);

            //DISTRIBUCIÓN NORMAL
            decimal dis = TinvParametrosDal.GetValorNumerico("DISTRIBUCIONNORMALIND-FIJA", rqconsulta.Ccompania);

            var Emisores = JsonConvert.DeserializeObject<IList<tgencatalogodetalle>>(rqconsulta.Mdatos["lregistros"].ToString());
            IList<TablaCalculo> emisoresrpt = new List<TablaCalculo>();
            IList<Emisor> em = new List<Emisor>();
            //VALORES DE PRECIOS PARA EMISORES
            IList<TablaCalculo> precios = new List<TablaCalculo>();
            //VALORES DE RENDIMIENTO PARA EMISORES
            IList<TablaCalculo> rendimiento = new List<TablaCalculo>();
            //VALORES DE DESVIACIÓN ESTANDAR DE RENDIMIENTOS
            IList<TablaCalculo> destandar = new List<TablaCalculo>();
            //VALORES VAR 1 DIA
            IList<TablaCalculo> vardia = new List<TablaCalculo>();
            //MATRIZ DE CORRELACIÓN
            IList<TablaCalculo> matriz = new List<TablaCalculo>();
            //DIFERENCIA DE DIAS ENTRE FECHAS
            System.TimeSpan dif = Fecha.IntToDate(ffintmp)- Fecha.IntToDate(finiciotmp) ;
            

            int contemi = 0;
            //double[] var = new double[dif.Days + 1];

            double[] desvestandar = new double[Emisores.Count];

            double[] vardiatemp = new double[Emisores.Count];
            //LISTA PARA MATRIZ DE CORRELACION
            List<double>[] listamatriz = new List<double>[Emisores.Count];

            foreach (tgencatalogodetalle emi in Emisores)
            {
                //VALOR NOMINAL POR INVERSION

                decimal VAL = varDal.ValorNominal(emi.cdetalle, tipovar);
                Emisor EM = new Emisor();
                EM.cdetalle = emi.cdetalle;
                EM.valornominal = VAL;
                string nombre = emi.cdetalle + " - " + emi.Mdatos["nemisor"].ToString();
                EM.nombre = nombre;
                TablaCalculo emisor = new TablaCalculo();
                emisor.id = 0;
                emisor.fecha = contemi;
                emisor.secuencia = nombre;
                emisor.valor = (double)VAL;
                emisoresrpt.Add(emisor);


                double[] pr = new double[dif.Days + 1];
                DateTime FecSec;
                DateTime finicioTmp;
                IList<TablaCalculo> tbl = new List<TablaCalculo>();
                for (int n = 0; n <= dif.Days; n++)
                {
                    FecSec = finicio.AddDays(n);
                    string fecha = FecSec.ToString("yyyyMMdd");
                    int fvaloracion = int.Parse(fecha);
                    double precio = varDal.precioCierreFijaValoracion(emi.cdetalle, fvaloracion);
                    //pr[n] = precio;
                    TablaCalculo tb = new TablaCalculo();
                    tb.fecha = fvaloracion;
                    tb.id = n + 1;
                    tb.secuencia = emi.cdetalle;
                    tb.valor = precio;
                    //PRECIOS A CADA EMISOR
                    tbl.Add(tb);
                    //AÑADIR AL GENERAL PARA REPORTE
                    precios.Add(tb);
                    pr[n] = precio;

                }
                EM.valores = tbl;
                em.Add(EM);

                //TABLA DE RENDIMIENTO
                Datos gen = new Datos();
                //VARIABLE DE LISTA PARA MATRIZ DE CORRELACIÓN
                List<double> listamatrizdetalle = new List<double>();
                double[] rend = gen.rendimiento(pr);
                for (int i = 0; i < rend.Length; i++)
                {
                    TablaCalculo p1 = new TablaCalculo();
                    p1.id = i;
                    p1.secuencia = emi.cdetalle;
                    p1.fecha = i;
                    p1.valor = rend[i];
                    rendimiento.Add(p1);
                    listamatrizdetalle.Add(p1.valor);
                }
                listamatriz[contemi] = listamatrizdetalle;
                //TABLA DE MATRIZ DE CORRELACIÓN
                // listadestardar[contemi]=rend;

                //CALCULO DE DESVIACIÓN ESTANDAR PARA CADA EMISOR
                TablaCalculo desv = new TablaCalculo();
                desv.id = 0;
                desv.secuencia = emi.cdetalle;
                desv.fecha = 0;
                desv.valor = gen.desviacionStandar(rend);
                destandar.Add(desv);
                desvestandar[contemi] = desv.valor;

                TablaCalculo var1 = new TablaCalculo();
                var1.id = 0;
                var1.secuencia = emi.cdetalle;
                var1.fecha = 0;
                double desvestun = 0;
                //VAR 1 DIA == DISTRIBUCIÓN NORMAL ESTANDAR * VALOR NOMINAL* DESVIACIÓN ESTANDAR
                try
                {
                     desvestun = (double)decimal.Round((decimal)desv.valor, 16, MidpointRounding.AwayFromZero);
                }
                catch (Exception ex) {
                     desvestun = 0;
                }
                var1.valor = (double)VAL * (double)dis * desvestun;
                // listadestardar[contemi] = pr;
                vardia.Add(var1);
                vardiatemp[contemi] = var1.valor;
                contemi++;
            }
            Datos dt = new Datos();

            double[][] mcorr = dt.CalcularCoeficienteCorelacion(listamatriz);
            double[][] mcorrtrans = dt.matrizTranspuesta(mcorr);
            int rowLength = mcorr.GetLength(0);
            int colLength = mcorr.GetLength(0);
            IList<TablaCalculo> matrizCorrelacion = new List<TablaCalculo>();
            for (int i = 0; i < rowLength; i++)
            {
                for (int j = 0; j < colLength; j++)
                {
                    TablaCalculo tb = new TablaCalculo();
                    tb.id = j;
                    tb.fecha = i;
                    tb.secuencia = i.ToString();
                    tb.valor = mcorr[i][j];
                    matrizCorrelacion.Add(tb);
                }

            }



            double[] mmul = dt.MatrixVectorProduct(mcorr, vardiatemp);
            double vargeneral = dt.vectorPorVector(mmul, vardiatemp);
            double vardiageneral = Math.Sqrt(vargeneral);

            double varportsncorr = dt.suma(vardiatemp);
            //PARÁMETROS AL REPORTE POR CADA EMISOR


            var dEmisores = Newtonsoft.Json.JsonConvert.SerializeObject(emisoresrpt);
            var dPrecios = Newtonsoft.Json.JsonConvert.SerializeObject(precios);
            var drendimiento = JsonConvert.SerializeObject(rendimiento);
            var ddestandar = JsonConvert.SerializeObject(destandar);
            var dmatriz = JsonConvert.SerializeObject(matrizCorrelacion);
            var dvar = JsonConvert.SerializeObject(vardia);
            // var dvarsincorrelacion = JsonConvert.SerializeObject(varportsncorr);



            Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();

            parametrosPdf.Add("i_finicio", finicio);
            parametrosPdf.Add("i_ffin", ffin);
            decimal vnper = decimal.Round(prnper, 2, MidpointRounding.AwayFromZero);
            decimal vnodis = decimal.Round(dis, 2, MidpointRounding.AwayFromZero);

            parametrosPdf.Add("i_valnoperdida", vnper.ToString());
            parametrosPdf.Add("i_valdnormal", vnodis.ToString());


            parametrosPdf.Add("i_emisor", dEmisores);
            parametrosPdf.Add("i_precios", dPrecios);
            parametrosPdf.Add("i_rendimiento", drendimiento);
            parametrosPdf.Add("i_destandar", ddestandar);
            parametrosPdf.Add("i_var", dvar);
            decimal varportsncorrtmp = decimal.Round((decimal)varportsncorr, 2, MidpointRounding.AwayFromZero);
            parametrosPdf.Add("i_varportsncorr", varportsncorrtmp.ToString());
            parametrosPdf.Add("i_matriz", dmatriz);

            decimal vardiageneraltmp = decimal.Round((decimal)vardiageneral, 2, MidpointRounding.AwayFromZero);
            parametrosPdf.Add("i_vardia", vardiageneraltmp);
            byte[] archivo = null;
            double beneficio = varportsncorr - vardiageneral;
            decimal beneficiotmp = decimal.Round((decimal)beneficio, 2, MidpointRounding.AwayFromZero);
            parametrosPdf.Add("i_beneficio", beneficiotmp);
            general.reporte.GenerarArchivo.generarArchivo(tipoarchivo, "/CesantiaReportes/Inversiones/", "rptInvVarRentaFija", "c:\\tmp\\", "rptInvVarRentaFija", parametrosPdf, true, out archivo);

        }
    }
}
