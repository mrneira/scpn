using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MathNet.Numerics.Statistics;

namespace inversiones.datos
{
    public class Datos
    {


        public Datos()
        {

        }


        public  double[][] CalcularCoeficienteCorelacion(List<double>[] lista) {
            List<double> lresultado = new List<double>();

            int i = 0, j = 1, i_max = lista.Count() - 1;
            double coeficiente = 0;
            double[][] result = MatrixCreate(i_max + 1, i_max + 1);

            while (i != i_max) {
                coeficiente = 0;
                double tmp= MathNet.Numerics.Statistics.Correlation.Pearson(lista[i], lista[j]);
                double val = (double)decimal.Round((decimal)tmp, 8, MidpointRounding.AwayFromZero);

                coeficiente = val;

                result[i][j] = coeficiente;
                result[j][i] = coeficiente;
                result[i][i] = 1;
                j++;
                if (j > i_max) {
                    i++; j = i + 1;
                }
                
            }
            result[i][j-1] = 1;
            return result;
        }
        public double[][] matrizTranspuesta(double[][] matriz)
        {
            int rowLength = matriz.GetLength(0);
            int colLength = matriz.GetLength(0);
            double[][] result = MatrixCreate(colLength, rowLength);

            for (int i = 0; i < rowLength; i++)
            {
                for (int j = 0; j < colLength; j++)
                {
                    result[i][j] = matriz[j][i];
                }
                
            }
            return result;
        }

        public  void imprimirMatriz(double[][] matriz) {
            int rowLength = matriz.GetLength(0);// FILAS 
            int colLength = matriz.GetLength(0);// COLUMNAS

            for (int i = 0; i < rowLength; i++) {
                for (int j = 0; j < colLength; j++) {
                    Debug.WriteLine(string.Format("    {0:0.00000}", Math.Round(matriz[i][j], 5)));
                }
                Debug.WriteLine(Environment.NewLine + Environment.NewLine);
            }
        }

        public  double[][] matrizCorrelacion(double[] desv)
        {
            int tam = desv.Length;

            double[][] result = MatrixCreate(tam, tam); // note indexing
            for (int i = 0; i < tam; ++i)
            {
                for (int j = 0; j < tam; ++j)
                {
                    if (i == j)
                    {
                        result[i][j] = 1;
                    }
                    else
                    {

                        result[i][j] = desv[((i + j) - 1)];
                    }
                }
            }

            return result;
        }
        public  double Correlation(double[] Xs, double[] Ys)
        {
            double sumX = 0;
            double sumX2 = 0;
            double sumY = 0;
            double sumY2 = 0;
            double sumXY = 0;

            int n = Xs.Length < Ys.Length ? Xs.Length : Ys.Length;

            for (int i = 0; i < n; ++i)
            {
                double x = Xs[i];
                double y = Ys[i];

                sumX += x;
                sumX2 += x * x;
                sumY += y;
                sumY2 += y * y;
                sumXY += x * y;
            }

            double stdX = Math.Sqrt(sumX2 / n - sumX * sumX / n / n);
            double stdY = Math.Sqrt(sumY2 / n - sumY * sumY / n / n);
            double covariance = (sumXY / n - sumX * sumY / n / n);

            return covariance / stdX / stdY;
        }

        public double[] rendimiento(double[] valueList)
        {
            double M = 0.0; double S = 0.0; int k = 1;
            int total = valueList.Length;

            double[] dt = new double[total - 1];
            double suma = 0;
            int indicenuevo = 0;

            for (int i = 1; i <= total - 1; i++)
            {
                double nanterior = valueList[i - 1];
                double nsiguiente = valueList[i];
                double vrendimiento = Math.Log(  nsiguiente/ nanterior);
                dt[indicenuevo] = vrendimiento;
                indicenuevo++;
                suma = suma + vrendimiento;
            }
            double t = suma;
            return dt;
        }


        public double desviacionStandar(double[] valueList)
        {
            double m1 = 0.0d;
            double m2 = 0.0d;
            double m3 = 0.0d; // for skewness calculation
            double m4 = 0.0d; // for kurtosis calculation
            // for skewness
            

            double prom = suma(valueList) / valueList.Length;

            for (int i = 0; i < valueList.Length; i++)
            {
                double m = valueList[i] - prom;
                double mPow2 = m * m;
                double mPow3 = mPow2 * m;
                double mPow4 = mPow3 * m;

                m1 += Math.Abs(m);

                m2 += mPow2;

                // calculate skewness
                m3 += mPow3;

                // calculate skewness
                m4 += mPow4;
            }

            double varianza = m2 / ((double)valueList.Length - 1);
            double destandar = Math.Sqrt(varianza);
            return destandar;
        }
        public double suma(double[] valueList)
        {
            double total = 0;
            foreach (double itm in valueList)
            {
                total += itm;
            }
            return total;
        }



        public double[][] MatrixProduct(double[][] matrixA, double[][] matrixB)
        {
            int aRows = matrixA.Length; int aCols = matrixA[0].Length;
            int bRows = matrixB.Length; int bCols = matrixB[0].Length;
            if (aCols != bRows)
                throw new Exception("Matrices no cumplen con columnas y filas iguales");

            double[][] result = MatrixCreate(aRows, bCols);

            for (int i = 0; i < aRows; ++i) // each row of A
                for (int j = 0; j < bCols; ++j) // each col of B
                    for (int k = 0; k < aCols; ++k) // could use k < bRows
                        result[i][j] += matrixA[i][k] * matrixB[k][j];


            return result;
        }
        public double[] MatrixVectorProduct(double[][] matrix, double[] vector)
        {
            // result of multiplying an n x m matrix by a m x 1 column vector (yielding an n x 1 column vector)
            int mRows = matrix.Length; int mCols = matrix[0].Length;
            int vRows = vector.Length;
            if (mCols != vRows)
                throw new Exception("Non-conformable matrix and vector in MatrixVectorProduct");
            double[] result = new double[mRows]; // an n x m matrix times a m x 1 column vector is a n x 1 column vector
            for (int i = 0; i < mRows; ++i)
            {
                double suma = 0;
                for (int j = 0; j < mCols; ++j)
                {
                    double mat = matrix[j][i];
                    double vematc = vector[j];
                    double mul = mat * vematc;
                    suma += mul;

                }
                result[i] = suma;

            }
            return result;
        }
        public double vectorPorVector(double[] m1, double[] m2)
        {

            int mRows = m1.Length;
            int vRows = m2.Length;
            if (mRows != vRows)
                throw new Exception("Non-conformable matrix and vector in MatrixVectorProduct");

            double total = 0;
            for (int i = 0; i < mRows; i++)
            {
                total += m1[i] * m2[i];
            }
            return total;

        }


        static double[][] MatrixCreate(int rows, int cols)
        {
            // allocates/creates a matrix initialized to all 0.0
            // do error checking here
            double[][] result = new double[rows][];
            for (int i = 0; i < rows; ++i)
                result[i] = new double[cols];
            return result;
        }

    }
}
