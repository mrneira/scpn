using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;

namespace util
{
    public sealed class Fecha
    {
        public static int Adicionadias(BaseDeCalculo basecalculo, int fecha, int dias, int? diapago) {
            if (basecalculo.GetDiasmes() == 360 || diapago != null) {
                return Fecha.AdicionaDias360(fecha, dias, diapago);
            }
            return Fecha.AdicionaDias365(fecha, dias);
        }

        /**
         * Metodo que Adiciona un numero de dias calendario a una fecha y mantien el dia fijo de pago en la fecha.
         * @param fecha Fecha a Adicionar dias.
         * @param dias Numero de dias a Adicionar a una fecha.
         * @param diapago Dia fijo de pago.
         * @return Integer
         */
        public static int AdicionaDias360(int fecha, int dias, int? diapago) {
            DateTime gc = GetFecha(fecha);

            if (Math.Abs(dias) >= 30) {
                int diff = 0;
                if (gc.Month == 2) {
                    if ((gc.Day >= 28) && (diapago != null) && (UltimoDiaMes(gc) < diapago)) {
                        diff = (int)diapago - UltimoDiaMes(gc);
                    }
                }
                int month = (int)Math.Floor((double)dias / 30);
                gc = gc.AddMonths(month);
                int d = dias % 30;
                gc = gc.AddDays(d);
                if (diff > 0) {
                    gc = gc.AddDays(diff);
                }
                if (diapago != null && diapago == 31) {
                    int dia = Fecha.GetDia(Fecha.GetFechaDesde(gc));
                    int diaaux = UltimoDiaMes(gc);//cca cambios tabla --- = 1
                    if (diaaux - dia > 0) {
                        gc = new DateTime(gc.Year, gc.Month, diaaux);
                    }
                }
            } else {
                gc = gc.AddDays(dias);
            }
            return Fecha.GetFechaDesde(gc);
        }

        /**
         * Metodo que Adiciona un numero de dias calendario a una fecha.
         * @param fecha Fecha a Adicionar dias.
         * @param dias Numero de dias a Adicionar a una fecha.
         * @return Integer
         * @throws Exception
         */
        public static int AdicionaDias365(int fecha, int dias) {
            DateTime gc = Fecha.GetFecha(fecha);
            gc = gc.AddDays(dias);
            return Fecha.GetFechaDesde(gc);
        }


        /**
         * Adiciona dias calendario una fecha.
         * @param fecha Fecha a la cual se Adiciona dias.
         * @param dias Numero de dias a Adicionar.
         * @return Date
         * @throws Exception
         */
        public static DateTime AdicionaDiasCalendario(DateTime fecha, int dias) {
            return fecha.AddDays(dias);
        }

        /**
         * Metodo que Adiciona un numero de meses calendario a una fecha.
         * @param fecha Fecha a Adicionar dias.
         * @param meses Numero de meses a Adicionar a una fecha.
         * @return Integer
         * @throws Exception
         */
        public static int AdicionaMes365(int fecha, int meses) {
            DateTime gc = Fecha.GetFecha(fecha);
            gc = gc.AddMonths(meses);
            return Fecha.GetFechaDesde(gc);
        }

        /**
         * Metodo que Adiciona un numero de meses calendario a una fecha.
         * @param fecha Fecha a Adicionar dias.
         * @param meses Numero de meses a Adicionar a una fecha.
         * @return Integer
         * @throws Exception
         */
        public static int AdicionaMes365(int fecha, int meses, int diafijo) {
            DateTime gc = Fecha.GetFecha(fecha);
            gc = gc.AddMonths(meses);

            // si es fin de mes en la nueva fecha pone el ultimo dia del mes.
            if (diafijo == 31) {
                // fija el maximo dia del nuevo mes
                gc = new DateTime(gc.Year, gc.Month, UltimoDiaMes(gc));
            }
            return Fecha.GetFechaDesde(gc);
        }


        /**
         * Metodo que Adiciona un numero de dias calendario a una fecha.
         * @param fecha Fecha a Adicionar dias.
         * @param dias Numero de dias a Adicionar a una fecha.
         * @return Integer
         * @throws Exception
         */
        public static int UltimoDiaMes(DateTime fecha) {
            //DateTime gc = new DateTime(fecha.Year, fecha.Month + 1, 1);
            DateTime gc = new DateTime();
            if (fecha.Month == 12) {
                gc = new DateTime(fecha.Year, 1, 1);
            } else {
                gc = new DateTime(fecha.Year, fecha.Month + 1, 1);
            }

            gc = gc.AddDays(-1);
            return gc.Day;
        }

        /**
         * Metodo que Adiciona un numero de meses calendario a una fecha.
         * @param fecha Fecha a Adicionar dias.
         * @param meses Numero de meses a Adicionar a una fecha.
         * @return Integer
         * @throws Exception
         */
        public static int RestaMes365(int fecha, int meses, int diafijo) {
            DateTime gc = Fecha.GetFecha(fecha);
            gc = gc.AddMonths(-meses);

            // si es fin de mes en la nueva fecha pone el ultimo dia del mes.
            if (diafijo == 31) {
                // fija el maximo dia del nuevo mes
                gc = new DateTime(gc.Year, gc.Month, UltimoDiaMes(gc));
            }
            return Fecha.GetFechaDesde(gc);
        }


        /**
         * Entrega fecha en formato YYYYMMDD, dado un GregorianCalendar.
         * @param gc Fecha en un gc.
         * @return Integer
         * @throws Exception
         */
        public static int GetFechaDesde(DateTime gc) {
            String anio = gc.Year.ToString();
            String mes = gc.Month.ToString();
            String dia = gc.Day.ToString();
            return int.Parse(anio + ((mes.Length == 1) ? +0 + mes : mes) + ((dia.Length == 1) ? +0 + dia : dia));
        }

        /// <summary>
        /// Entrega HORA en formato HH:mm
        /// </summary>
        /// <param name="fecha"></param>
        /// <returns></returns>
        public static string GetHoraString(DateTime fecha) {
            string horas = fecha.Hour.ToString();
            string minutos = fecha.Minute.ToString();

            return string.Join(":", (horas.Length == 1) ? $"0{horas}" : horas, (minutos.Length == 1) ? $"0{minutos}" : minutos);
        }


        /**
         * Entrega un GregorianCalendar, dada la fecha.
         * @param fecha YYYYMMDD entrega el dia de una fecha.
         * @return GregorianCalendar
         * @throws Exception
         */
        public static DateTime GetFecha(int fecha) {
            // En el mes Resta 1 en java 0 es enero, 1 febrero etc...
            return new DateTime(Fecha.GetAnio(fecha), Fecha.GetMes(fecha), Fecha.GetDia(fecha));
        }

        /**
         * Entrega el anio de una fecha.
         * @param fecha YYYYMMDD entrega el anio de una fecha.
         * @return Integer
         * @throws Exception
         */
        public static int GetAnio(int fecha) {
            return int.Parse(fecha.ToString().Substring(0, 4));
        }

        /**
         * Enterga el timestamp de la base de datos.
         * @return Date
         * @throws Exception
         */
        public static DateTime GetDataBaseDate() {
            return DateTime.Now;
            // cambiar entity
            //IQuery qry = Sessionhb.GetSession().CreateSQLQuery("select convert(varchar,getdate(), 112)");

            //return qry.UniqueResult<DateTime>();
        }

        /**
         * Enterga el timestamp de la base de datos.
         * @return Timestamp
         * @throws Exception
         */
        public static DateTime GetDataBaseTimestamp() {
            return DateTime.Now;
            // cambiar entity
            //IQuery qry = Sessionhb.GetSession().CreateSQLQuery("select getdate()");

            //return qry.UniqueResult<DateTime>();
        }

        /**
         * Entrega el dia de meses comerciales dada una fecha.<br>
         * Si es febreo, anio biciesto y el dia es 29 retorna 30 dias.<br>
         * Si es febreo, no es anio biciesto y el dia es 28 retorna 30 dias.<br>
         * @param fecha YYYYMMDD entrega el dia de una fecha.
         * @return Integer
         * @throws Exception
         */
        public static int GetDia360(int fecha) {
            int dia = Fecha.GetDia(fecha);
            if (dia > 30) {
                dia = 30;
            }
            int mes = Fecha.GetMes(fecha);
            int mod = Fecha.GetAnio(fecha) % 4;
            // Si es febrero y no es biciesto devuelve 30 dias.
            // si es febrero y es biciesto devuelve 30 dias.
            if (mes == 2) { // 1 enero, 2 febrero etc no es lo mismo que en java.
                if ((mod == 0) && (dia == 29)) {
                    dia = 30;
                }
                if ((mod != 0) && (dia == 28)) {
                    dia = 30;
                }
            }
            return dia;
        }

        /**
         * Entrega el mes de una fecha.
         * @param fecha YYYYMMDD entrega el mes de una fecha.
         * @return Integer
         * @throws Exception
         */
        public static int GetMes(int fecha) {
            String mes = fecha.ToString().Substring(4, 2);
            if (mes.Substring(0, 1).Equals("0")) {
                mes = mes.Substring(1, 1);
            }
            return int.Parse(mes);
        }

        /**
         * Entrega el dia de una fecha.
         * @param fecha YYYYMMDD entrega el dia de una fecha.
         * @return Integer
         * @throws Exception
         */
        public static int GetDia(int fecha) {
            return int.Parse(fecha.ToString().Substring(6, 2));
        }


        /**
         * Metodo que resta fechas considerando dias comerciales, o dias del anio 360.
         * @param fechafinal Fecha a restar una fecha inicial.
         * @param fechainicial Fecha a restar de una de una fecha final.
         * @return int
         * @throws Exception
         */

        public static void main(String[] args) {
            int dias30 = Fecha.Resta360(20160329, 20160229);
            int dias426 = Fecha.Resta360(20150131, 20131201);
            Console.WriteLine(dias30);
            Console.WriteLine(dias426);
        }

        /**
         * Metodo que Resta fechas considerando dias comerciales, o dias del anio 360.
         * @param fechafinal Fecha a Restar una fecha inicial.
         * @param fechainicial Fecha a Restar de una de una fecha final.
         * @return int
         * @throws Exception
         */
        public static int Resta360(int fechafinal, int fechainicial) {
            if (fechafinal == fechainicial) {
                return 0;
            }
            if (fechafinal < fechainicial) {
                throw new AtlasException("SER-003", "FECHA A RESTAR: {0} NO PUEDE SER MAYOR A: {1}", fechainicial, fechafinal);
            }
            int anios = Fecha.GetAnio(fechafinal) - Fecha.GetAnio(fechainicial);
            int meses = Fecha.GetMes(fechafinal) - Fecha.GetMes(fechainicial);
            // evalua el dia de la fecha final
            int diafinal = Fecha.GetDia360(fechafinal);
            int diainicial = Fecha.GetDia360(fechainicial);
            // calcula el numero de dias.
            int dias = diafinal - diainicial;
            if (diafinal >= 28 && diainicial >= 28) {
                // en Restas 29-feb - 31-enero es 30
                // en Restas 29-mar - 29-febero da 30
                dias = 0;
            }
            anios = anios * 12 * 30; // dias de los anios.
            meses = meses * 30; // dias de los meses, este valor puede ser negativo por que los dias se incluyen en los anios.
                                // dias de la Resta.
            dias = anios + meses + dias;
            return dias;
        }
        public static int Resta360Inv(int fechafinal, int fechainicial) {
            if (fechafinal == fechainicial) {
                return 0;
            }
            if (fechafinal < fechainicial) {
                throw new AtlasException("SER-003", "FECHA A RESTAR: {0} NO PUEDE SER MAYOR A: {1}", fechainicial, fechafinal);
            }
            int anios = Fecha.GetAnio(fechafinal) - Fecha.GetAnio(fechainicial);
            int meses = Fecha.GetMes(fechafinal) - Fecha.GetMes(fechainicial);
            // evalua el dia de la fecha final
            int diafinal = Fecha.GetDia360(fechafinal);
            int diainicial = Fecha.GetDia360(fechainicial);
            // calcula el numero de dias.
            int dias = diafinal - diainicial;
            if (Fecha.GetMes(fechafinal) == 2) {
                if (diafinal >= 28 && diainicial >= 28) {
                    // en Restas 29-feb - 31-enero es 30
                    // en Restas 29-mar - 29-febero da 30
                    dias = 0;
                }
            }
            anios = anios * 12 * 30; // dias de los anios.
            meses = meses * 30; // dias de los meses, este valor puede ser negativo por que los dias se incluyen en los anios.
                                // dias de la Resta.
            dias = anios + meses + dias;
            return dias;
        }

        /**
         * Metodo que Resta fechas considerando dias calendario, o dias del anio 365.
         * @param ffinal Fecha a Restar una fecha inicial.
         * @param finicial Fecha a Restar de una de una fecha final.
         * @return Integer
         */
        public static int Resta365(DateTime ffinal, DateTime finicial) {
            int anios = ffinal.Year - finicial.Year;
            if (anios == 0) {
                return ffinal.DayOfYear - finicial.DayOfYear;
            }
            DateTime fechatemporal = finicial;
            int dias = 0;
            for (int i = 0; i <= anios; i++) {
                int diasAnio = (DateTime.IsLeapYear(fechatemporal.Year)) ? 366 : 365;
                if (i == 0) {
                    dias = dias + (diasAnio - finicial.DayOfYear);
                } else if (i == anios) {
                    dias = dias + ffinal.DayOfYear;
                } else {
                    dias = dias + diasAnio;
                }
                fechatemporal = fechatemporal.AddYears(1);
            }
            return dias;
        }

        /**
         * Metodo que Resta fechas considerando dias calendario, o dias del anio 365.
         * @param fechafinal Fecha a Restar una fecha inicial.
         * @param fechainicial Fecha a Restar de una de una fecha final.
         * @return int
         * @throws Exception
         */
        public static int Resta365(int fechafinal, int fechainicial) {
            if (fechafinal < fechainicial) {
                throw new AtlasException("SER-003", "FECHA A RESTAR: {0} NO PUEDE SER MAYOR A: {1}", fechainicial, fechafinal);
            }
            DateTime ffinal = Fecha.GetFecha(fechafinal);
            DateTime finicial = Fecha.GetFecha(fechainicial);
            return Fecha.Resta365(ffinal, finicial);
        }


        /**
         * Metodo que Resta dos fechas, dado la base de calculo. La Resta puede ser en dias calendario o dias comerciales.
         * @param basecalculo Base de calculo de la cual se obtiene los dias anio, para Restar fechas con dias comerciales base 360, o dias
         *            calendario base 365.
         * @param fechafinal Fecha a Restar una fecha inicial.
         * @param fechainicial Fecha a Restar de una de una fecha final.
         * @return int
         * @throws Exception
         */
        public static int Restar(BaseDeCalculo basecalculo, int fechafinal, int fechainicial) {
            if (basecalculo.GetDiasmes() == 360) {
                return Fecha.Resta360(fechafinal, fechainicial);
            }
            return Fecha.Resta365(fechafinal, fechainicial);
        }

        /**
         * Fija el dia del mes a la fecha.
         * @param fecha Fecha a fija el dia del mes.
         * @param dia Dia a fijar en el mes.
         * @return INteger.
         * @throws Exception
         */
        public static int SetDiadelMes(int fecha, int dia) {
            DateTime cal = Fecha.GetFecha(fecha);
            int diaaux = UltimoDiaMes(cal);
            if (dia - diaaux >= 0) {
                dia = diaaux;
            }
            cal = new DateTime(cal.Year, cal.Month, dia);//CCA cambios tabla .AddDays(1);
            return Fecha.GetFechaDesde(cal);
        }

        /**
         * Transforma una fecha que esta en formato yyyyyMMdd como entero a un java.sql.Date
         * @param fecha
         * @return
         */
        public static DateTime ToDate(int fecha) {
            DateTime sqlDate = GetFecha(fecha);
            return sqlDate;
        }

        /**
         * Transforma una fecha que esta como entero, a un string formato dd-MM-yyyy
         * @param fecha Fecha en formato entero yyyymmdd
         * @return String
         */
        public static String GetFechaPresentacion(int fecha) {
            //DateTime fechaRetorno =  GetFecha(fecha);
            return Fecha.GetMes(fecha).ToString() + "-" + Fecha.GetDia(fecha).ToString() + "-" + Fecha.GetAnio(fecha).ToString();
        }

        /**
         * Transforma una fecha que esta como entero, a un string formato yyyy-MM-dd
         * @param fecha Fecha en formato entero yyyymmdd
         * @return String
         */
        public static String GetFechaPresentacionAnioMesDia(int fecha) {
            //DateTime fechaRetorno =  GetFecha(fecha);
            return Fecha.GetAnio(fecha).ToString() + "-" + Fecha.GetMes(fecha).ToString("D2") + "-" + Fecha.GetDia(fecha).ToString("D2");
        }

        /**
         * Transforma un timestamp a Integer en formato yyyyMMdd
         * @param fecha Tiemstamp que contiene una fecha
         * @return
         */
        public static int TimestampToInteger(DateTime fecha) {
            return (fecha.Year * 10000) + (fecha.Month * 100) + fecha.Day;
        }

        /**
         * Transforma un java.sql.Date a Integer en formato yyyyMMdd
         * @param fecha Tiemstamp que contiene una fecha
         * @return
         */
        public static int DateToInteger(DateTime fecha) {
            return Fecha.GetFechaDesde(fecha);
        }

        /**
         * Crea una instancia por defecto.
         */
        private Fecha() {
        }

        /**
         * Transforma segundos a horas.
         * @param segundos Numero de segundos.
         * @return BigDecimal
         */
        public static decimal SegundosToHoras(Object valSegundos) {
            decimal segundos = 0;
            if (valSegundos.GetType() == typeof(decimal)) {
                segundos = (decimal)valSegundos;
            } else if (valSegundos.GetType() == typeof(Int64)) {
                segundos = new decimal((Int64)valSegundos);
            }

            decimal horas = 0;
            horas = Math.Round(segundos / 3600, 0);
            return horas;
        }

        /**
         * Transforma segundos a horas.
         * @param segundos Numero de segundos.
         * @return BigDecimal
         */
        public static decimal MilesimasDeSegundoToHoras(Object valorMilesimasSegudo) {
            decimal milesimassegundo = 0;
            if (valorMilesimasSegudo.GetType() == typeof(decimal)) {
                milesimassegundo = (decimal)valorMilesimasSegudo;
            } else if (valorMilesimasSegudo.GetType() == typeof(Int64)) {
                milesimassegundo = new decimal((Int64)valorMilesimasSegudo);
            }
            decimal horas = 0;
            horas = Math.Round(milesimassegundo / 3600000, 0);
            return horas;
        }

        /**
         * Obtiene la fecha del sistema y sumna un numero de dias, sin considerar sabados y domingos.
         * @param dias Numero de dias a sumar a la fehca del sistema.
         * @return Date
         * @throws Exception
         */
        public static DateTime SumarDiasFechaSistema(int dias) {
            DateTime c = new DateTime();
            c = DateTime.Now;
            int d = 0;
            while (d < dias) {
                c = c.AddDays(1);
                if (c.DayOfWeek != DayOfWeek.Saturday && c.DayOfWeek != DayOfWeek.Sunday) {
                    // Sabados y domingos no suma.
                    d++;
                }
            }
            return c;
        }

        /**
         * Entrega la fecha del sistema.
         * @return Date
         * @throws Exception
         */
        public static DateTime GetFechaSistema() {
            DateTime c = new DateTime();
            c = DateTime.Now;
            return c;
        }

        /**
         * Entrega la fecha del sistema en formato yyyyMMdd
         * @return Integer
         * @throws Exception
         */
        public static int GetFechaSistemaIntger() {
            DateTime c = new DateTime();
            c = DateTime.Now;
            return GetFechaDesde(c);
        }

        /**
         * Entrega el timestamp del sistema.
         * @return Timestamp
         * @throws Exception
         */
        public static DateTime GetTimestampSistema() {
            //return (Int32)(DateTime.UtcNow.Subtract(DateTime.Now)).TotalSeconds;
            return DateTime.Now;
        }

        public static int GetDiferenciaEntreFechasMeses(DateTime fechaInicio, DateTime fechaFin) {
            int resultado = 0;
            //if(fechaInicio.Year <= fechaFin.Year && fechaInicio.Month <= fechaFin.Month) {
            resultado = (fechaFin.Year - fechaInicio.Year) * 12 + fechaFin.Month - fechaInicio.Month;
            //} else {
            //  resultado = fechaInicio.Month - fechaFin.Month;
            //}
            return resultado;
        }


        /**
         * Cantidad de años, meses y dias transcurridos entre dos fechas 
         * @return array int valores anio, mes, dia 
         * @throws Exception
         */
        public static int[] GetDiferenciaEntreFechas(DateTime fechaInicio, DateTime fechaFin) {
            int[] resultado = new int[3];
            DateTime d1 = fechaInicio;
            DateTime d2 = fechaFin;
            TimeSpan ts = d2 - d1;
            DateTime d = DateTime.MinValue + ts;
            int dias = d.Day - 1;
            int meses = d.Month - 1;
            int años = d.Year - 1;

            resultado[0] = años;
            resultado[1] = meses;
            resultado[2] = dias;

            return resultado;
        }

        /**
              * Trasforma en meses un valor de años meses y dias
              * Consideraciones: utilizado para calculo de la bonificacion en la liquidaciòn, si existe dias se los toma como que fuese un mes más
              * @return int
              * @throws Exception
              */
        public static int GetMesesB(int años, int meses, int dias) {
            int resultado = 0;
            resultado = (años * 12) + meses;
            if (dias > 0)
                resultado += 1;
            return resultado;
        }

        public static String diff(DateTime newdt, DateTime olddt) {
            int a;
            int m;
            int d;
            TimeSpan dif = (newdt - olddt);
            string s = "";
            if (newdt < olddt) {
                throw new AtlasException("SER-003", "FECHA A RESTAR: {0} NO PUEDE SER MAYOR A: {1}", newdt, olddt);
            }
            a = (newdt.Year - olddt.Year);
            m = (newdt.Month - olddt.Month);
            d = (newdt.Day - olddt.Day);

            if (m <= 0) {
                a -= 1;
                m += 12;
            }

            if (d < 0) {
                m -= 1;
                int DiasAno = newdt.Year;
                int DiasMes = newdt.Month;

                if ((newdt.Month - 1) == 0) {
                    DiasAno = DiasAno - 1;
                    DiasMes = 12;
                } else {
                    DiasMes = DiasMes - 1;
                }

                d += DateTime.DaysInMonth(DiasAno, DiasMes);
            }

            if (m == 12) {
                a++;
                m = 0;
            }

            if (a > 0) {
                if (a == 1)
                    s = s + a.ToString() + " año ";
                else
                    s = s + a.ToString() + " años ";

                if (m == 1)
                    s = s + m.ToString() + " mes y ";
                else
                    s = s + m.ToString() + " meses y ";

                if (d == 1)
                    s = s + d.ToString() + " día ";
                else
                    s = s + d.ToString() + " días ";
            } else {
                if (m == 1)
                    s = s + m.ToString() + " mes y ";
                else
                    s = s + m.ToString() + " meses y ";

                if (d == 1)
                    s = s + d.ToString() + " día ";
                else
                    s = s + d.ToString() + " días ";
            }
            return s;
        }

        /**
         * Entrega la fecha de fin de mes
         * @return datetime
         * @throws Exception
         */
        public static DateTime GetFinMes(DateTime fecha) {
            DateTime firstDayOfTheMonth = new DateTime(fecha.Year, fecha.Month, 1);
            return firstDayOfTheMonth.AddMonths(1).AddDays(-1);
        }

        /**
         * Entrega la fecha para documentos electrónicos
         * @return string
         * @throws Exception
         */
        public static string GetFechaSri(DateTime fecha) {
            int day = fecha.Day;
            int month = fecha.Month;
            int year = fecha.Year;
            return (day.ToString("00") + "/" + month.ToString("00") + "/" + year.ToString());
        }

        public static DateTime IntToDate(int fecha) {
            int year = int.Parse(fecha.ToString().Substring(0, 4));
            int month = int.Parse(fecha.ToString().Substring(4, 2));
            int day = int.Parse(fecha.ToString().Substring(6, 2));
            return new DateTime(year, month, day);
        }

        public static DateTime StringToFecha(string fecha) {
            int anio = int.Parse(fecha.Substring(0, 4));
            int mes = int.Parse(fecha.Substring(5, 2));
            int dia = int.Parse(fecha.Substring(8, 2));

            return new DateTime(anio, mes, dia);
        }
    }
}
