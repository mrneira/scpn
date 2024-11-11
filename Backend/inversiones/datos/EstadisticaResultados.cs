using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace inversiones.datos
{
   public class EstadisticaResultados
    {
        // sortedData is used to calculate percentiles
        internal double[] sortedData;

        /// <summary>
        /// DescriptiveResult default constructor
        /// </summary>
        public EstadisticaResultados()
        {
            Frequency = new Dictionary<double, int>();
        }

        /// <summary>
        /// Count
        /// </summary>
        public uint Count { get; set; }
        /// <summary>
        /// Sum
        /// </summary>
        public double Sum { get; set; }
        /// <summary>
        /// Arithmatic mean
        /// </summary>
        public double Mean { get; set; }
        /// <summary>
        /// Geometric mean
        /// </summary>
        public double GeometricMean { get; set; }
        /// <summary>
        /// Harmonic mean
        /// </summary>
        public double HarmonicMean { get; set; }
        /// <summary>
        /// Minimum value
        /// </summary>
        public double Min { get; set; }
        /// <summary>
        /// Maximum value
        /// </summary>
        public double Max { get; set; }
        /// <summary>
        /// The range of the values
        /// </summary>
        public double Range { get; set; }
        /// <summary>
        /// Sample variance
        /// </summary>
        public double Variance { get; set; }
        /// <summary>
        /// Sample standard deviation
        /// </summary>
        public double StdDev { get; set; }
        /// <summary>
        /// Skewness of the data distribution - asimetría
        /// </summary>
        public double Skewness { get; set; }
        /// <summary>
        /// Kurtosis of the data distribution - Curtois
        /// </summary>
        public double Kurtosis { get; set; }
        /// <summary>
        /// Frequencies
        /// </summary>
        public Dictionary<double, int> Frequency { get; set; }

        /// <summary>
        /// Statistical Mode
        /// </summary>
        public double Mode { get; set; }
        /// <summary>
        /// Interquartile range
        /// </summary>
        public double IQR { get; set; }

        /// <summary>
        /// Median, or second quartile, or at 50 percentile
        /// </summary>
        public double Median { get; set; }
        /// <summary>
        /// First quartile, at 25 percentile
        /// </summary>
        public double FirstQuartile { get; set; }
        /// <summary>
        /// Third quartile, at 75 percentile
        /// </summary>
        public double ThirdQuartile { get; set; }

        /// <summary>
        /// Sum of Error
        /// </summary>
        internal double SumOfError { get; set; }

        /// <summary>
        /// The sum of the squares of errors
        /// </summary>
        internal double SumOfErrorSquare { get; set; }

        /// <summary>
        /// Calculates the confidence interval of a given percentage
        /// </summary>
        /// <param name="percent">Percentage to calculate de cofidence interval</param>
        /// <returns></returns>
        public double ConfidenceInterval(double percent)
        {
            double z;
            double alpha = 1d - percent / 100.0d;
            double phi = 1 - alpha / 2.0d;

            z = Estadistica.PhiInverse(phi) * StdDev / Math.Sqrt(Count);

            return z;
        }

        /// <summary>
        /// Percentile
        /// </summary>
        /// <param name="percent">Pecentile, between 0 to 100</param>
        /// <returns>Percentile</returns>
        public double Percentile(double percent)
        {
            return Estadistica.Percentile(sortedData, percent);
        }
    }
}
