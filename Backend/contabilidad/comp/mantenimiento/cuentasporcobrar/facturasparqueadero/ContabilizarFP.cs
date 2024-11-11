using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.facturacionelectronica;
using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace contabilidad.comp.mantenimiento.cuentasporcobrar.facturasparqueadero {

    public class ContabilizarFP : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            tconcuentaporcobrar cxc = new tconcuentaporcobrar();
            String ffactura = "";
            List<tconfacturaparqueadero> lista = new List<tconfacturaparqueadero>();
            try
            {
                ffactura = rqmantenimiento.Mdatos["ffactura"].ToString();
                string tipofactura = (string)rqmantenimiento.Mdatos["tipofactura"];
                string estado = (string)rqmantenimiento.Mdatos["estado"];
                string cctacajaparqueadero = rqmantenimiento.Mdatos.ContainsKey("cctacajaparqueadero") ? (string)rqmantenimiento.Mdatos["cctacajaparqueadero"] : "";
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                lista = TconCargaMasivaFacturasParqueaderoDal.FindXFecha(ffactura,tipofactura,estado,cctacajaparqueadero);
                tconparametros plantilla_fp = TconParametrosDal.FindXCodigo("PLANTILLA_CONTABLE_FAC_PARQ", rqmantenimiento.Ccompania);
                if (plantilla_fp == null) {
                    throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "PLANTILLA_CONTABLE_FAC_PARQ");
                }

                tconcomprobante comprobante = new tconcomprobante();
                comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
                cxc.ccompcontable = comprobante.ccomprobante;
                cxc.cpersona = 9999999999999;
                cxc.ccompania = rqmantenimiento.Ccompania;
                cxc.cplantilla = Convert.ToInt32(plantilla_fp.numero);
                cxc.concepto = "CONTABILIZACIÓN AUTOMÁTICA DE FACTURAS PARQUEADERO DE FECHA " + ffactura;
                cxc.estadoccatalogo = 1012;
                cxc.estadocdetalle = "INGRE";
                cxc.porcentajeiceccatalogo = 1014;
                cxc.porcentajeicecdetalle = "ICE0";
                cxc.porcentajeivaccatalogo = 1015;
                cxc.porcentajeivacdetalle = "IVA12";
                cxc.tipodocumentoccatalogo = 1016;
                cxc.tipodocumentocdetalle = "FACTUR";
                cxc.formapagoccatalogo = 1013;
                cxc.formapagocdetalle = "DINERO";
                cxc.cagenciaingreso = 1;
                cxc.csucursalingreso = 1;
                cxc.baseimponible = 0;
                cxc.montoiva = 0;
                cxc.total = 0;
                cxc.montoice = 0;
                cxc.fdocumento = DateTime.Parse(ffactura, System.Globalization.CultureInfo.InvariantCulture);
                cxc.fcaducidad = cxc.fdocumento;
                cxc.oficina = rqmantenimiento.Cagencia.ToString();


                foreach (var item in lista)
                {
                    cxc.baseimponible += Convert.ToDecimal(item.subtotal);
                    cxc.montoiva += Convert.ToDecimal(item.montoiva);
                    cxc.total += Convert.ToDecimal(item.total);

                    item.Esnuevo = false;
                    item.Actualizar = true;
                    item.estadocdetalle = "CONTAB";
                    item.ccomprobante = cxc.ccompcontable;
                }
                cxc.subtotalsinimpuestos = cxc.baseimponible;

                var ltotalporcaja = lista                   
                    .GroupBy(x => x.cctacajaparqueadero)                       
                    .ToDictionary(g => g.Key, g => g.Sum(v => v.total));
                Comprobante.CompletarAutorizacion(rqmantenimiento, cxc, "DIAGEN", comprobante, ltotalporcaja);

            }
            catch (Exception e)
            {
                throw e;
            }
            rqmantenimiento.AdicionarTabla("tconfacturaparqueadero", lista, false);
        }
    }
}
