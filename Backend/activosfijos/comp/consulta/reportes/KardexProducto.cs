using core.componente;
using dal.activosfijos;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using util.dto.consulta;

namespace activosfijos.comp.consulta.reportes {

    public class KardexProducto : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega el historial del kardex por producto.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {


            int cproducto = int.Parse(rqconsulta.Mdatos["cproducto"].ToString());
            DateTime finicio = DateTime.Parse(rqconsulta.Mdatos["finicio"].ToString());
            DateTime ffin = DateTime.Parse(rqconsulta.Mdatos["ffin"].ToString());

            IList<Dictionary<string, object>> lkardex = TacfKardexDal.FindXcproductoXfechas(cproducto, finicio, ffin);
            List<tacfkardex> ldetalle = ProcesarDetalle(lkardex);
            rqconsulta.Response["KARDEXPRODUCTO"] = ldetalle;
        }

        public List<tacfkardex> ProcesarDetalle(IList<Dictionary<string, object>> listaQuery)
        {
            List<tacfkardex> ldetalle = new List<tacfkardex>();
            foreach (Dictionary<string, object> obj in listaQuery)
            {
                tacfkardex d = new tacfkardex();
                foreach (var pair in obj)
                {
                    d.AddDatos(pair.Key, pair.Value);
                }
                ldetalle.Add(d);
            }
            return ldetalle;
        }

    }
}
