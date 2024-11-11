using core.componente;
using inversiones.datos;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using util.dto.mantenimiento;
using modelo;
using modelo.helper;
using dal.inversiones.var;

namespace inversiones.comp.consulta.valoracionportafolio
{
    public class Var : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string tipo = rqconsulta.GetString("tipo");

            string tipoarchivo = rqconsulta.GetString("tipoarchivo");

           
            double[] items2 = { 100000, 20000, 5000 };


            double[] lst1 = { 41.8125, 42.9375, 43, 43.75, 43, 44.125, 43.875, 44.5625, 44.4375, 44, 45.125, 45.875, 46.0625, 47 };
            double[] lst2 = { 41.8125, 77.125, 77.75, 77.125, 78, 79.375, 79.0625, 80.125, 79, 80.625, 81.5625, 82.125, 80.8125, 78.875 };
            double[] lst3 = { 41.8125, 42.9375, 43, 43.75, 43, 44.125, 43.875, 44.5625, 44.4375, 44, 45.125, 45.875, 46.0625, 47 };
            //LISTA DE PRECIOS
            IList<TablaCalculo> precios = new List<TablaCalculo>();
            IList<TablaCalculo> rendimiento = new List<TablaCalculo>();

            IList<TablaCalculo> destandar = new List<TablaCalculo>();
            IList<TablaCalculo> vardia = new List<TablaCalculo>();
            IList<TablaCalculo> matriz = new List<TablaCalculo>();

            for (int i = 0; i < lst1.Length; i++)
            {
                TablaCalculo p1 = new TablaCalculo();
                p1.id = i;
                p1.secuencia = "BCPICHINCHA";
                p1.fecha = i;
                p1.valor = lst1[i];
                precios.Add(p1);
            }
            for (int i = 0; i < lst2.Length; i++)
            {
                TablaCalculo p1 = new TablaCalculo();
                p1.id = i;
                p1.secuencia = "BGUAYAQUIL";
                p1.fecha = i;
                p1.valor = lst2[i];
                precios.Add(p1);
            }
            for (int i = 0; i < lst3.Length; i++)
            {
                TablaCalculo p1 = new TablaCalculo();
                p1.id = i;
                p1.secuencia = "BPRODUBANCO";
                p1.fecha = i;
                p1.valor = lst3[i];
                precios.Add(p1);
            }


            Datos gen = new Datos();
            double[] rend = gen.rendimiento(lst1);
            double des = gen.desviacionStandar(rend);

            double[] rend2 = gen.rendimiento(lst2);
            double des2 = gen.desviacionStandar(rend2);

            double[] rend3 = gen.rendimiento(lst3);
            double des3 = gen.desviacionStandar(rend3);

            for (int i = 0; i < rend.Length; i++)
            {
                TablaCalculo p1 = new TablaCalculo();
                p1.id = i;
                p1.secuencia = "BCPICHINCHA";
                p1.fecha = i;
                p1.valor = rend[i];
                rendimiento.Add(p1);
            }
            for (int i = 0; i < rend2.Length; i++)
            {
                TablaCalculo p1 = new TablaCalculo();
                p1.id = i;
                p1.secuencia = "BGUAYAQUIL";
                p1.fecha = i;
                p1.valor = rend2[i];
                rendimiento.Add(p1);
            }
            for (int i = 0; i < rend3.Length; i++)
            {
                TablaCalculo p1 = new TablaCalculo();
                p1.id = i;
                p1.secuencia = "BPRODUBANCO";
                p1.fecha = i;
                p1.valor = rend3[i];
                rendimiento.Add(p1);
            }

            double[] desv = { 243.5738198, 5588.015557, 171.9599656 };

            for (int i = 0; i < desv.Length; i++)
            {
                TablaCalculo p1 = new TablaCalculo();
                p1.id = 0;
                p1.secuencia = i.ToString();
                p1.fecha = 0;
                p1.valor = desv[i];
                destandar.Add(p1);
            }



            //VAR 1 DIA
            double[] var = { 0.350919953249236000000, -0.247233000129004000000, 0.001039605353848000000 };

            for (int i = 0; i < var.Length; i++)
            {
                TablaCalculo p1 = new TablaCalculo();
                p1.id = 0;
                p1.secuencia = i.ToString();
                p1.fecha = 0;
                p1.valor = var[i];
                vardia.Add(p1);
            }
            //MATRIZ DE CORRELACIÓN
            double[][] mcorr = gen.matrizCorrelacion(var);
            // double[][] mcorr = gen.matrizCorrelacion(var);
           // double[][] mcorr = gen.(var);

            int aRows = mcorr.Length; int aCols = mcorr[0].Length;

            for (int i = 0; i < aRows; i++)
            {
                for (int j = 0; j < aCols; j++)
                {
                    TablaCalculo p1 = new TablaCalculo();
                    p1.id = i;
                    p1.secuencia = j.ToString();
                    p1.fecha = j;
                    p1.valor = mcorr[i][j];
                    matriz.Add(p1);
                }
            }



            double[] mmul = gen.MatrixVectorProduct(mcorr, desv);
            double vargeneral = gen.vectorPorVector(mmul, desv);
            double vardiageneral = Math.Sqrt(vargeneral);



            var dPrecios = Newtonsoft.Json.JsonConvert.SerializeObject(precios);
            var drendimiento = JsonConvert.SerializeObject(rendimiento);
            var ddestandar = JsonConvert.SerializeObject(destandar);
            var dvar = JsonConvert.SerializeObject(vardia);
            var dmatriz = JsonConvert.SerializeObject(matriz);
            byte[] archivo = null;
            Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();


            parametrosPdf.Add("i_precios", dPrecios);
            parametrosPdf.Add("i_rendimiento", drendimiento);
            parametrosPdf.Add("i_destandar", ddestandar);

            parametrosPdf.Add("i_var", dvar);
            parametrosPdf.Add("i_matriz", dmatriz);


            general.reporte.GenerarArchivo.generarArchivo(tipoarchivo, "/CesantiaReportes/Inversiones/", "rptTthRolPagosGeneralTemp", "c:\\tmp\\", "RolPagosTemporal", parametrosPdf, true, out archivo);
            rqconsulta.Response["ROLPROVISIONTEMP"] = archivo;



        }
    }
    public class TablaCalculo
    {
        public long id { get; set; }
        public string secuencia { get; set; }
        public int fecha { get; set; }
        public double valor { get; set; }

    }

    public class Emisor:AbstractDto
    {
        public string cdetalle { get; set; }
        public string nombre  { get; set; }
        public decimal valornominal { get; set; }
        public IList<TablaCalculo> valores { get; set; }
        


    }
}
