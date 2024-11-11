using dal.talentohumano.nomina;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.enums;
using util.servicios.ef;
using dal.generales;

namespace talentohumano.datos
{
    public static class Ingreso
    {
        public static IList<tnomingreso> getBeneficiosGenerales(String mes, decimal? sueldo)
        {
            IList<tnombeneficio> tnb = TnomBeneficioDal.beneficioPatronalMensual(mes);
            IList<tnomingreso> ltni = new List<tnomingreso>();
            foreach (tnombeneficio tb in tnb)
            {
                tnomingreso tni = new tnomingreso();
                tni.cbeneficio = tb.cbeneficio;
                tni.nombrebeneficio = tb.nombre;
                tni.valor = tb.valor;
                tni.porcentual = tb.porcentual;
                tni.tipoccatalogo = (int)tb.ingresoccatalogo;
                tnompagosaldo pag = TnomPagoSaldoDal.Find(tb.ingresoccatalogo.Value,tb.ingresocdetalle);
                tni.tipocdetalle = tb.ingresocdetalle;
                tni.mesccatalogo = 4;
                tni.mescdetalle = mes;
                tni.estado = pag.pagado;
                tni.fingreso = DateTime.Now;
                tni.descripcion = "BENEFICIO GENERAL GENERADO POR EL SISTEMA EN NOMINA";
                if (tb.porcentual)
                {
                    tni.calculado = sueldo * tb.valor;
                }
                else
                {
                    tni.calculado = tni.valor;
                }
                ltni.Add(tni);

            }
            return ltni;

        }
        public static IList<tnomingreso> getBeneficiosPersonales(long anio,long? cfuncionario, String mes, decimal? sueldo)
        {
            IList<tnombeneficiopersona> tnb = TnomBeneficioPersonalDal.beneficioMensual(mes, cfuncionario,anio);
            IList<tnomingreso> ltni = new List<tnomingreso>();
            foreach (tnombeneficiopersona tb in tnb)
            {
                tnombeneficio ben = TnomBeneficioDal.Find(tb.cbeneficio);
                tnomingreso tni = new tnomingreso();
                tni.cbeneficio = tb.cbeneficio;
                tni.nombrebeneficio = ben.nombre;
                tni.valor = tb.valor;
                tni.porcentual = ben.porcentual;

                tni.tipoccatalogo = (int)ben.ingresoccatalogo;
                tni.tipocdetalle = ben.ingresocdetalle;
                tnompagosaldo pag = TnomPagoSaldoDal.Find(ben.ingresoccatalogo.Value, ben.ingresocdetalle);

                tni.mesccatalogo = 4;
                tni.mescdetalle = tb.mescdetalle;
                tni.estado = pag.pagado;
                tni.fingreso = DateTime.Now;
                tni.descripcion = tb.descripcion;
                if (ben.porcentual)
                {
                    tni.calculado = sueldo * tb.valor;
                }
                else
                {
                    tni.calculado = tb.valor;
                }
                ltni.Add(tni);

            }

            return ltni;
        }
        public static IList<tnomingreso> horasExtras(long? cfuncionario, String mes, long anio)
        {
            IList<tnomhoraextranomina> tnb = TnomHoraExtraDal.Find(mes, cfuncionario,anio);
            IList<tnomingreso> hextra = new List<tnomingreso>();

            decimal totalHoras=0;
            foreach (tnomhoraextranomina tb in tnb)
            {
                tgencatalogodetalle nom = TgenCatalogoDetalleDal.Find(tb.tipoccatalogo.Value, tb.tipocdetalle);
                tnomingreso tni = new tnomingreso();
                tni.cbeneficio = null;
                tni.nombrebeneficio = nom.nombre;
                tni.valor = tb.vtotal;
                tni.porcentual = false;
                tni.tipoccatalogo = 1145;
                tni.tipocdetalle = EnumSaldo.HORAEXTRA.Value;
                tnompagosaldo pag = TnomPagoSaldoDal.Find(1145, EnumSaldo.HORAEXTRA.Value);

                tni.mesccatalogo = 4;
                tni.mescdetalle = mes;
                tni.estado = pag.pagado;
                tni.fingreso = DateTime.Now;
                tni.descripcion = "HORA EXTRA GENERADO POR EL SISTEMA EN NOMINA";
                tni.calculado = tb.vtotal;
                hextra.Add(tni);
                totalHoras =  tb.vtotal.Value;
              

            }

            return hextra;
        }

    }
}
