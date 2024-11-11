using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {
    [Serializable]
    public class BaseDeCalculo {
        private int diasanio;
        /** Numerador de la base de calculo. */
        private int diasmes;
        /** Numero de dias por mes de la base de calculo, si es 1 indica que son meses calendario. */
        private int dias;
        /** Codigo de base de calculo. */
        private String codigo = "";



        public static readonly BaseDeCalculo B360360 = new BaseDeCalculo(360, 360, 30, "360/360");
        public static readonly BaseDeCalculo B360365 = new BaseDeCalculo(360, 365, 30, "360/365");
        public static readonly BaseDeCalculo B365360 = new BaseDeCalculo(365, 360, 1, "365/360");
        public static readonly BaseDeCalculo B365365 = new BaseDeCalculo(365, 365, 1, "365/365");


        public static IEnumerable<BaseDeCalculo> Values {
            get {
                yield return B360360;
                yield return B360365;
                yield return B365360;
                yield return B365365;
            }
        }
        [Newtonsoft.Json.JsonProperty(PropertyName = "diasanio")]
        public int Diasanio { get => diasanio; set => diasanio = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "diasmes")]
        public int Diasmes { get => diasmes; set => diasmes = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "dias")]
        public int Dias { get => dias; set => dias = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "codigo")]
        public string Codigo { get => codigo; set => codigo = value; }

        /**
         * Crea una enumeracion de la base de calculo.
         * @param pDiasmes Numerador de la base de calculo.
         * @param pDiasanio Denominador de la base de calculo.
         * @param pDias Dias de la base de calculo, si es 1 son dias calendario.
         * @param pCodigo Codigo de la base de calculo 360/360, 365/360 .
         */
        private BaseDeCalculo(int pDiasmes, int pDiasanio, int pDias, String pCodigo) {
            this.diasanio = pDiasanio;
            this.diasmes = pDiasmes;
            this.dias = pDias;
            this.codigo = pCodigo;
        }

        public int GetDiasAnio() {
            return this.diasanio;
        }


        /**
         * Entrega el numero de dias de un mes y anio dado los dias mes del numerador de la base de calculo.
         * @param pMes Mes a obtener el numero de dias.
         * @param pAnio Anio a obtener el numero de dias.
         * @return
         */
        public int GetDiasMes(int pMes, int pAnio) {
            if (this.dias == 1) {
                DateTime myDT = new DateTime(pAnio, pMes + 1, 1, new GregorianCalendar());
                myDT = myDT.AddDays(-1);
                return myDT.Day;
            }
            return this.dias;
        }

        /**
         * Entrega el numero de dias de una anio.
         * @param pYear
         * @return int
         * @throws Exception
         */
        public int GetDiasDelAnio(int pAnio) {
            if (this.dias == -1) {
                DateTime myDT = new DateTime(pAnio, 12, 31, new GregorianCalendar());
                return myDT.DayOfYear; ;
            }
            return this.dias;
        }

        /**
         * Entrega el codigo de la base de calculo.
         * @return String
         * @throws Exception
         */
        public String GetCodigo() {
            return this.codigo;
        }

        /**
         * Entrega los dias mes de la base de calculo.
         * @return int
         * @throws Exception
         */
        public int GetDiasmes() {
            return this.diasmes;
        }

        /**
         * Entrega el numero de dias de la base de calculo. Si la base mes es 365 entrega 1.
         * @return this.days
         * @throws Exception
         */
        public int GetDias() {
            return this.dias;
        }

        /**
         * Entrega BaseDeCalculo dada la base de calculo.
         * @param pCodigo Base de calculo 360/360, 360/365, 365/360, 365/365.
         * @return BaseDeCalculo
         * @throws Exception
         */
        public static BaseDeCalculo GetBaseDeCalculo(String pCodigo) {
            BaseDeCalculo obj = null;
            foreach (BaseDeCalculo e in BaseDeCalculo.Values) {
                if (e.codigo.Equals(pCodigo)) {
                    obj = e;
                }
            }
            return obj;
        }
    }
}
