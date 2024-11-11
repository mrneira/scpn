using core.componente;
using dal.activosfijos;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using util.dto.consulta;

namespace activosfijos.comp.consulta.reportes {

    public class KardexCodificado : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega el historial del kardex.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            string serial= rqconsulta.Mdatos["serial"].ToString();
            string cbarras = rqconsulta.Mdatos["cbarras"].ToString();
            DateTime finicio = DateTime.Parse(rqconsulta.Mdatos["finicio"].ToString());
            DateTime ffin = DateTime.Parse(rqconsulta.Mdatos["ffin"].ToString());

            IList<Dictionary<string, object>> lkardex = TacfKardexDal.FindKardexCodificado(serial, cbarras, finicio, ffin);
            List<tacfkardexprodcodi> ldetalle = ProcesarDetalle(lkardex);
            rqconsulta.Response["KARDEXCODIFICADO"] = ldetalle;
        }

        public List<tacfkardexprodcodi> ProcesarDetalle(IList<Dictionary<string, object>> listaQuery)
        {
            List<tacfkardexprodcodi> ldetalle = new List<tacfkardexprodcodi>();
            foreach (Dictionary<string, object> obj in listaQuery)
            {
                tacfkardexprodcodi d = new tacfkardexprodcodi();
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
