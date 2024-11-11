using core.componente;
using dal.contabilidad.flujocaja;
using dal.contabilidad.flujocajahistorial;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace contabilidad.comp.mantenimiento.flujocaja
{
    /// <summary>
    /// CLase que se encarga de leer saldos contable sy poblarlos en la tabla tconflujoefectivo.
    /// </summary>
    public class CrearFlujoCaja : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            int fcontable = int.Parse(rqmantenimiento.Mdatos["fcontable"].ToString());
            string tipoplancdetalle = rqmantenimiento.Mdatos["tipoplancdetalle"].ToString();
            string tipoflujocdetalle = rqmantenimiento.Mdatos["tipoflujocdetalle"].ToString();
            /*//CCA 20220627*/
            List<IBean> lmantenimientoinser = new List<IBean>();
            lmantenimientoinser = rqmantenimiento.GetTabla("FLUJOCAJA").Lregistros;
            List<IBean> ldetalle = lmantenimientoinser;
            string tipooperacioncdetalle = "";
            string descripcion = "";
            foreach (IBean o in ldetalle)
            {
                tconflujocaja obj = (tconflujocaja)o;
                tipooperacioncdetalle = obj.tipooperacioncdetalle;
                descripcion = obj.descripcion;
                TconFlujoCajaDal.Eliminar(fcontable, tipoplancdetalle, tipoflujocdetalle, tipooperacioncdetalle, descripcion);
            }
            /*//CCA 20220627*/
            //TconFlujoCajaHistorialDal.Eliminar(fcontable, tipoplancdetalle, tipoflujocdetalle);
            this.CrearFlujoCajaBloque(fcontable, tipoplancdetalle, tipoflujocdetalle, rqmantenimiento);
        }

        /// <summary>
        /// Llena tabla tconflujoefectivo con saldos contables a nivel 3 de activo, pasivo, patrimonio, ingresos y gastos.
        /// </summary>
        /// <param name="aniofin"></param>
        private void CrearFlujoCajaBloque(int fcontable, string tipoplancdetalle, string tipoflujocdetalle, RqMantenimiento rqmantenimiento)
        {
            List<IBean> lmantenimiento = new List<IBean>();
            if (rqmantenimiento.GetTabla("FLUJOCAJA") != null)
            {
                if (rqmantenimiento.GetTabla("FLUJOCAJA").Lregistros.Count > 0)
                {
                    lmantenimiento = rqmantenimiento.GetTabla("FLUJOCAJA").Lregistros;
                }
            }
            /*List<tconflujocaja> lista = TconFlujoCajaDal.Find(tipoplancdetalle, tipoflujocdetalle);
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, null);*/
            List<IBean> ldetalle = lmantenimiento;//CCA 20220627
            foreach (IBean o in ldetalle)
            {
                tconflujocaja obj = (tconflujocaja)o;
                if (obj.activo)
                {
                    tconflujocajahistorial flujocajahistoria = new tconflujocajahistorial();
                    flujocajahistoria.ccuenta = obj.ccuenta;
                    flujocajahistoria.fcontable = fcontable;
                    flujocajahistoria.fproceso = fcontable;//Fecha.DateToInteger(DateTime.Now);//CCA 20220627
                    flujocajahistoria.descripcion = obj.descripcion;
                    flujocajahistoria.valor = obj.valor;
                    if (tipoflujocdetalle == "PRO" && obj.descripcion == "Prestaciones")
                    {
                        flujocajahistoria.valor = TconFlujoCajaDal.valorReal(fcontable, 28, "P", "3").Value;
                    }
                    if (tipoflujocdetalle == "PRO" && obj.descripcion == "Inversiones")
                    {
                        flujocajahistoria.valor = TconFlujoCajaDal.valorReal(fcontable, 12, "P", "3").Value;
                    }
                    if (tipoflujocdetalle == "PRO" && obj.descripcion == "Seguros")
                    {
                        flujocajahistoria.valor = TconFlujoCajaDal.valorReal(fcontable, 6, "P", "3").Value;
                    }
                    if (tipoflujocdetalle == "PRO" && obj.descripcion == "Préstamos")
                    {
                        flujocajahistoria.valor = TconFlujoCajaDal.valorReal(fcontable, 7, "P", "3").Value;
                    }
                    flujocajahistoria.saldocuenta = 0;
                    flujocajahistoria.tipoflujoccatalogo = 1033;
                    flujocajahistoria.tipoflujocdetalle = obj.tipoflujocdetalle;
                    flujocajahistoria.tipooperacionccatalogo = 1034;
                    flujocajahistoria.tipooperacioncdetalle = obj.tipooperacioncdetalle;
                    flujocajahistoria.tipoplanccatalogo = 1001;
                    flujocajahistoria.tipoplancdetalle = obj.tipoplancdetalle;
                    Sessionef.Grabar(flujocajahistoria);
                }
            }
        }
    }
}