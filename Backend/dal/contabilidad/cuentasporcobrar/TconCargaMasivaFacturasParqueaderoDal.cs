using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.contabilidad
{

    public class TconCargaMasivaFacturasParqueaderoDal
    {
        public static bool VerificarSecuencial(string secuencial)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return (contexto.tconfacturaparqueadero.Where(x => x.secuencial.Equals(secuencial) 
                && (!x.estadocdetalle.Equals("ELIMIN"))).Count() > 0);
        }

        public static List<tconfacturaparqueadero> FindXFechas(string fingreso, string ffactura)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconfacturaparqueadero> lista = new List<tconfacturaparqueadero>();
            DateTime datefingreso;
            DateTime dateffactura;

            if (!fingreso.Equals("") && ffactura.Equals(""))
            {
                datefingreso = DateTime.ParseExact(fingreso, "yyyy-M-d h:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
                lista = contexto.tconfacturaparqueadero.Where(x => DbFunctions.TruncateTime(x.fingreso) == datefingreso.Date
                && x.estadocdetalle.Equals("INGRES")).ToList();
            }
            if (fingreso.Equals("") && !ffactura.Equals(""))
            {
                dateffactura = DateTime.ParseExact(ffactura, "yyyy-M-d h:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
                lista = contexto.tconfacturaparqueadero.Where(x => DbFunctions.TruncateTime(x.ffactura) == dateffactura.Date
                && x.estadocdetalle.Equals("INGRES")).ToList();
            }
            if (!fingreso.Equals("") && !ffactura.Equals(""))
            {
                datefingreso = DateTime.ParseExact(fingreso, "yyyy-M-d h:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
                dateffactura = DateTime.ParseExact(ffactura, "yyyy-M-d h:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
                lista = contexto.tconfacturaparqueadero.Where(x => (DbFunctions.TruncateTime(x.fingreso) == datefingreso.Date
                && (DbFunctions.TruncateTime(x.ffactura) == dateffactura.Date))
                && x.estadocdetalle.Equals("INGRES")).ToList();
            }
            return lista;
        }

        public static object FindXFechaORUsuario(string ffactura, string cusuarioing)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconfacturaparqueadero> lista = new List<tconfacturaparqueadero>();
            DateTime dateffactura;

            if (ffactura.Equals("") && !cusuarioing.Equals(""))
            {
                lista = contexto.tconfacturaparqueadero.Where(x => x.cusuarioing == cusuarioing
                && x.estadocdetalle.Equals("INGRES")).ToList();
            }
            if (!ffactura.Equals("") && cusuarioing.Equals(""))
            {
                dateffactura = DateTime.ParseExact(ffactura, "yyyy-M-d h:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
                lista = contexto.tconfacturaparqueadero.Where(x => (DbFunctions.TruncateTime(x.ffactura) == dateffactura.Date
                && x.estadocdetalle.Equals("INGRES"))).ToList();
            }
            if (!ffactura.Equals("") && !cusuarioing.Equals(""))
            {
                dateffactura = DateTime.ParseExact(ffactura, "yyyy-M-d h:mm:ss", System.Globalization.CultureInfo.InvariantCulture);
                lista = contexto.tconfacturaparqueadero.Where(x => (DbFunctions.TruncateTime(x.ffactura) == dateffactura.Date
                && x.cusuarioing == cusuarioing
                && x.estadocdetalle.Equals("INGRES"))).ToList();
            }
            return lista;
        }

        public static void DeleteByCxC(string cctaporcobrar)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconfacturaparqueadero> lista = new List<tconfacturaparqueadero>();
            lista = contexto.tconfacturaparqueadero.Where(x => x.cctaporcobrar.Equals(cctaporcobrar)).ToList();

            foreach(var item in lista)
            {

                item.estadocdetalle = "ELIMIN";
                Sessionef.Actualizar(item);
            }
        }

        public static List<tconfacturaparqueadero> FindXFecha(string ffactura,string tipofactura, string estado, string cctacajaparqueadero)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconfacturaparqueadero> lista = new List<tconfacturaparqueadero>();
            DateTime dateffactura;
            if (!ffactura.Equals(""))
            {
                dateffactura = DateTime.Parse(ffactura, System.Globalization.CultureInfo.InvariantCulture);
                if (tipofactura.Equals("D")) {
                    lista = contexto.tconfacturaparqueadero.Where(x => DbFunctions.TruncateTime(x.ffactura) == dateffactura.Date
                    && x.estadocdetalle.Equals(estado) && x.tipofactura.Equals(tipofactura)).ToList();
                } else {
                    lista = contexto.tconfacturaparqueadero.Where(x => x.ffactura.Value.Month == dateffactura.Month && x.ffactura.Value.Year == dateffactura.Year
                    && x.estadocdetalle.Equals(estado) && x.tipofactura.Equals(tipofactura)).ToList();
                }
            }
            return lista;
        }

        public static List<decimal?> FindTotalesXFecha(string ffactura, string tipofactura, string estado, string cctacajaparqueadero)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<decimal?> lista = new List<decimal?>();
            DateTime dateffactura;
            if (!ffactura.Equals(""))
            {
                dateffactura = DateTime.Parse(ffactura, System.Globalization.CultureInfo.InvariantCulture);
                if (tipofactura.Equals("D")) {
                    var x = from a in contexto.tconfacturaparqueadero
                            where DbFunctions.TruncateTime(a.ffactura) == dateffactura.Date
                                && a.estadocdetalle.Equals(estado) && a.tipofactura.Equals(tipofactura)
                            select a;

                    lista.Add(x.Sum(y => y.subtotal));
                    lista.Add(x.Sum(y => y.montoiva));
                    lista.Add(x.Sum(y => y.total));
                } else {
                    var x = from a in contexto.tconfacturaparqueadero
                            where a.ffactura.Value.Month == dateffactura.Month && a.ffactura.Value.Year == dateffactura.Year
                                && a.estadocdetalle.Equals(estado) && a.tipofactura.Equals(tipofactura)
                            select a;
                    lista.Add(x.Sum(y => y.subtotal));
                    lista.Add(x.Sum(y => y.montoiva));
                    lista.Add(x.Sum(y => y.total));
                }
            }
            return lista;
        }

        public static List<tconfacturaparqueadero> FindFacturasContratoPorIdentificacion(string tipofactura, string estado, string identificacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconfacturaparqueadero> lista = new List<tconfacturaparqueadero>();
            lista = contexto.tconfacturaparqueadero.Where(x => x.estadocdetalle.Equals(estado) && x.tipofactura.Equals(tipofactura) && x.identificacion.Equals(identificacion)).ToList();
            List<tconfacturaparqueadero> listanc = new List<tconfacturaparqueadero>();
            listanc = contexto.tconfacturaparqueadero.Where(x => x.cfpnotacredito!=null && x.identificacion.Equals(identificacion) && x.estadocdetalle.Equals(estado)).ToList();
            List<tconfacturaparqueadero> listasn = new List<tconfacturaparqueadero>();
            foreach (tconfacturaparqueadero ls in lista) {
                int encontrado = 0;
                foreach (tconfacturaparqueadero lst in listanc) {
                    if (ls.cfacturaparqueadero == lst.cfpnotacredito) {
                        encontrado++;
                    }
                }
                if (encontrado==0)
                listasn.Add(ls);
            }
            return listasn;
        }

        public static tconfacturaparqueadero FindFactura(string cfacturaparqueadero) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconfacturaparqueadero obj;
            obj = contexto.tconfacturaparqueadero.Where(x => x.cfacturaparqueadero.Equals(cfacturaparqueadero)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static List<decimal?> FindTotalFacturasContratoPorIdentificacion(string tipofactura, string estado, string identificacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<decimal?> listan = new List<decimal?>();

          
            List<tconfacturaparqueadero> lista = new List<tconfacturaparqueadero>();
            lista = contexto.tconfacturaparqueadero.Where(x => x.estadocdetalle.Equals(estado) && x.tipofactura.Equals(tipofactura) && x.identificacion.Equals(identificacion)).ToList();
            List<tconfacturaparqueadero> listanc = new List<tconfacturaparqueadero>();
            listanc = contexto.tconfacturaparqueadero.Where(x => x.cfpnotacredito != null && x.identificacion.Equals(identificacion) && x.estadocdetalle.Equals(estado)).ToList();
            List<tconfacturaparqueadero> listasn = new List<tconfacturaparqueadero>();
            foreach (tconfacturaparqueadero ls in lista)
            {
                int encontrado = 0;
                foreach (tconfacturaparqueadero lst in listanc)
                {
                    if (ls.cfacturaparqueadero == lst.cfpnotacredito)
                    {
                        encontrado++;
                    }
                }
                if (encontrado == 0)
                    listasn.Add(ls);
            }


            listan.Add(listasn.Sum(y => y.subtotal));
            listan.Add(listasn.Sum(y => y.montoiva));
            listan.Add(listasn.Sum(y => y.total));

            return listan;
        }

    }
}
