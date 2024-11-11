using dal.talentohumano.nomina;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.enums;

namespace talentohumano.datos
{
    public  class Egresos
    {
        public static IList<tnomegreso> getDescuentosGenerales( String mes, decimal? sueldo)
        {
            IList<tnomdescuento> tnb = TnomDescuentoDal.descuentoPatronalMensual(mes);
            IList<tnomegreso> ltni = new List<tnomegreso>();
            foreach (tnomdescuento tb in tnb)
            {
                tnomegreso tni = new tnomegreso();
                tni.cdescuento = tb.cdescuento;
                tni.nombredescuento = tb.nombre;
                tni.valor = tb.valor;
                tni.porcentual = tb.porcentual.Value;
                tnompagosaldo pag = TnomPagoSaldoDal.Find(tb.egresoccatalogo.Value, tb.egresocdetalle);

                tni.tipoccatalogo = (int)tb.egresoccatalogo;
                tni.tipocdetalle = tb.egresocdetalle;
                tni.mesccatalogo = 4;
                tni.mescdetalle = mes;
                tni.estado = pag.pagado;
                tni.fingreso = DateTime.Now;
                tni.descripcion = "DESCUENTO GENERAL GENERADO POR EL SISTEMA EN NOMINA";
                if (tb.porcentual.Value)
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
        public static IList<tnomegreso> getDescuentosPersonales(long anio,long? cfuncionario, String mes, decimal? sueldo)
        {
            IList<tnomdescuentopersona> tnb = TnomDescuentoPersonalDal.descuentoMensual(mes, cfuncionario,anio);

            IList<tnomegreso> ltne = new List<tnomegreso>();
            foreach (tnomdescuentopersona tb in tnb)
            {
                tnomdescuento ben = TnomDescuentoDal.Find(tb.cdescuento);
                tnomegreso tne = new tnomegreso();
                tne.cdescuento = tb.cdescuento;
                tne.nombredescuento = ben.nombre;
                tne.valor = tb.valor;
                tne.porcentual = ben.porcentual.Value;
                tnompagosaldo pag = TnomPagoSaldoDal.Find(ben.egresoccatalogo.Value, ben.egresocdetalle);

                tne.tipoccatalogo = (int)ben.egresoccatalogo;
                tne.tipocdetalle = ben.egresocdetalle;
                tne.mesccatalogo = 4;
                tne.mescdetalle = tb.mescdetalle;
                tne.estado = pag.pagado;
                tne.fingreso = DateTime.Now;
                tne.descripcion = tb.descripcion;
                //Verificacion CCA para ver lo pagado
                if (ben.porcentual.Value)
                {
                    tne.calculado = sueldo * (tb.valor.Value);
                }
                else
                {
                    tne.calculado = tb.valor;
                }
                ltne.Add(tne);

            }

            return ltne;
        }
        //CCA 20240117
        public static IList<tnomegreso> getDescuentosLiquidacionPersonales(long anio, long? cfuncionario, String mes, decimal? sueldo)
        {
            IList<tnomdescuentopersona> tnb = TnomDescuentoPersonalDal.descuentoLiquidacionMensual(mes, cfuncionario, anio);

            IList<tnomegreso> ltne = new List<tnomegreso>();
            foreach (tnomdescuentopersona tb in tnb)
            {
                tnomdescuento ben = TnomDescuentoDal.Find(tb.cdescuento);
                tnomegreso tne = new tnomegreso();
                tne.cdescuento = tb.cdescuento;
                tne.nombredescuento = ben.nombre;
                tne.valor = tb.valor;
                tne.porcentual = ben.porcentual.Value;
                tnompagosaldo pag = TnomPagoSaldoDal.Find(ben.egresoccatalogo.Value, ben.egresocdetalle);

                tne.tipoccatalogo = (int)ben.egresoccatalogo;
                tne.tipocdetalle = ben.egresocdetalle;
                tne.mesccatalogo = 4;
                tne.mescdetalle = tb.mescdetalle;
                tne.estado = pag.pagado;
                tne.fingreso = DateTime.Now;
                tne.descripcion = tb.descripcion;
                //Verificacion CCA para ver lo pagado
                if (ben.porcentual.Value)
                {
                    tne.calculado = sueldo * (tb.valor.Value);
                }
                else
                {
                    tne.calculado = tb.valor;
                }
                ltne.Add(tne);

            }

            return ltne;
        }

    }
}
