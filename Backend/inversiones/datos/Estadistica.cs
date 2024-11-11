using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace inversiones.datos
{
  public  class Estadistica
    {

        /// <summary>
        /// Data to analyze
        /// </summary>
        private double[] data;
        /// <summary>
        /// Sorted data
        /// </summary>
        private double[] sortedData;

        /// <summary>
        /// Descriptive results
        /// </summary>
        public EstadisticaResultados Result { get; protected set; }

        #region Constructors
        /// <summary>
        /// Descriptive analysis default constructor
        /// </summary>
        public Estadistica()
        {
            Result = new EstadisticaResultados();
        }

        /// <summary>
        /// Descriptive analysis constructor
        /// </summary>
        /// <param name="dataVariable">Data array</param>
        public Estadistica(double[] dataVariable)
        {
            Result = new EstadisticaResultados();
            data = dataVariable;
        }
        #endregion //  Constructors

        /// <summary>
        /// Run the analysis to obtain descriptive information of the data
        /// </summary>
        public void Analyze()
        {

            // initializations
            Result.Count = 0;
            Result.Min = Result.Max = Result.Range = Result.Mean =
            Result.Sum = Result.StdDev = Result.Variance = 0.0d;

            double sumOfSquare = 0.0d;
            double sumOfESquare = 0.0d; // must initialize

            double[] squares = new double[data.Length];
            double cumProduct = 1.0d; // to calculate geometric mean
            double cumReciprocal = 0.0d; // to calculate harmonic mean
            double maxFreq = 0.0d; //to calculate statistical mode

            // First iteration
            for (int i = 0; i < data.Length; i++)
            {
                if (i == 0) // first data point
                {
                    Result.Min = data[i];
                    Result.Max = data[i];
                    Result.Mean = data[i];
                    Result.Range = 0.0d;
                }
                else
                { // not the first data point
                    if (data[i] < Result.Min) Result.Min = data[i];
                    if (data[i] > Result.Max) Result.Max = data[i];
                }
                Result.Sum += data[i];
                squares[i] = Math.Pow(data[i], 2);
                sumOfSquare += squares[i];
                if (Result.Frequency.ContainsKey(data[i]))
                    Result.Frequency[data[i]]++;
                else
                    Result.Frequency.Add(data[i], 1);
                if (Result.Frequency[data[i]] > maxFreq)
                {
                    Result.Mode = data[i];
                    maxFreq = Result.Frequency[data[i]];
                }

                cumProduct *= data[i];
                cumReciprocal += 1.0d / data[i];
            }
            Result.Count = (uint)data.Length;
            double n = (double)Result.Count; // use a shorter variable in double type
            Result.Mean = Result.Sum / n;
            Result.GeometricMean = Math.Pow(cumProduct, 1.0 / n);
            Result.HarmonicMean = 1.0d / (cumReciprocal / n); // see http://mathworld.wolfram.com/HarmonicMean.html
            Result.Range = Result.Max - Result.Min;

            // second loop, calculate Stdev, sum of errors
            //double[] eSquares = new double[data.Length];
            double m1 = 0.0d;
            double m2 = 0.0d;
            double m3 = 0.0d; // for skewness calculation
            double m4 = 0.0d; // for kurtosis calculation
            // for skewness
            for (int i = 0; i < data.Length; i++)
            {
                double m = data[i] - Result.Mean;
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

            Result.SumOfError = m1;
            Result.SumOfErrorSquare = m2; // Added for Excel function DEVSQ
            sumOfESquare = m2;

            // var and standard deviation
            Result.Variance = sumOfESquare / ((double)Result.Count - 1);
            Result.StdDev = Math.Sqrt(Result.Variance);

            // using Excel approach
            double skewCum = 0.0d; // the cum part of SKEW formula
            for (int i = 0; i < data.Length; i++)
            {
                skewCum += Math.Pow((data[i] - Result.Mean) / Result.StdDev, 3);
            }
            Result.Skewness = n / (n - 1) / (n - 2) * skewCum;

            // kurtosis: see http://en.wikipedia.org/wiki/Kurtosis (heading: Sample Kurtosis)
            double m2_2 = Math.Pow(sumOfESquare, 2);
            Result.Kurtosis = ((n + 1) * n * (n - 1)) / ((n - 2) * (n - 3)) *
                (m4 / m2_2) -
                3 * Math.Pow(n - 1, 2) / ((n - 2) * (n - 3)); // second last formula for G2

            // calculate quartiles
            sortedData = new double[data.Length];
            data.CopyTo(sortedData, 0);
            Array.Sort(sortedData);

            // copy the sorted data to result object so that
            // user can calculate percentile easily
            Result.sortedData = new double[data.Length];
            sortedData.CopyTo(Result.sortedData, 0);

            Result.FirstQuartile = Percentile(sortedData, 25);
            Result.ThirdQuartile = Percentile(sortedData, 75);
            Result.Median = Percentile(sortedData, 50);
            Result.IQR = Percentile(sortedData, 75) -
                Percentile(sortedData, 25);

        } // end of method Analyze


        /// <summary>
        /// Calculate percentile of a sorted data set
        /// </summary>
        /// <param name="sortedData">Sorte data</param>
        /// <param name="p">Percentile to calculate</param>
        /// <returns></returns>
        internal static double Percentile(double[] sortedData, double p)
        {
            // algo derived from Aczel pg 15 bottom
            if (p >= 100.0d) return sortedData[sortedData.Length - 1];

            double position = (double)(sortedData.Length + 1) * p / 100.0;
            double leftNumber = 0.0d, rightNumber = 0.0d;

            double n = p / 100.0d * (sortedData.Length - 1) + 1.0d;

            if (position >= 1)
            {
                leftNumber = sortedData[(int)System.Math.Floor(n) - 1];
                rightNumber = sortedData[(int)System.Math.Floor(n)];
            }
            else
            {
                leftNumber = sortedData[0]; // first data
                rightNumber = sortedData[1]; // first data
            }

            if (leftNumber == rightNumber)
                return leftNumber;
            else
            {
                double part = n - System.Math.Floor(n);
                return leftNumber + part * (rightNumber - leftNumber);
            }
        } // end of internal function percentile


        /// <summary>
        /// Phi coefficient
        /// </summary>
        /// <param name="x">Value to calculate phi coefficient</param>
        /// <returns>Thi Phi coefficient for given value</returns>
        public static double Phi(double x)
        {
            // constants
            double a1 = 0.254829592;
            double a2 = -0.284496736;
            double a3 = 1.421413741;
            double a4 = -1.453152027;
            double a5 = 1.061405429;
            double p = 0.3275911;

            // Save the sign of x
            int sign = 1;
            if (x < 0)
                sign = -1;
            x = Math.Abs(x) / Math.Sqrt(2.0);

            // A&S formula 7.1.26
            double t = 1.0 / (1.0 + p * x);
            double y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.Exp(-x * x);

            return 0.5 * (1.0 + sign * y);
        }
        /// <summary>
        /// Phi coefficient Inverse
        /// </summary>
        /// <param name="x">Value to use in calculation</param>
        /// <returns>Phi coefficient for given value</returns>
        public static double PhiInverse(double p)
        {
            if (p <= 0.0 || p >= 1.0)
            {
                string msg = String.Format("Invalid input argument: {0}.", p);
                throw new ArgumentOutOfRangeException(msg);
            }

            // See article above for explanation of this section.
            if (p < 0.5)
            {
                // F^-1(p) = - G^-1(p)
                return -RationalApproximation(Math.Sqrt(-2.0 * Math.Log(p)));
            }
            else
            {
                // F^-1(p) = G^-1(1-p)
                return RationalApproximation(Math.Sqrt(-2.0 * Math.Log(1.0 - p)));
            }
        }

        /// <summary>
        /// Rational aproximation
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        private static double RationalApproximation(double t)
        {
            // Abramowitz and Stegun formula 26.2.2.3
            // The absolute value of the error should be less than 4.5 e-4.
            double[] c = { 2.515517, 0.802853, 0.010328 };
            double[] d = { 1.432788, 0.189269, 0.001308 };
            return t - ((c[2] * t + c[1]) * t + c[0]) /
                        (((d[2] * t + d[1]) * t + d[0]) * t + 1.0);
        }


    } // end of class Descriptive

}
