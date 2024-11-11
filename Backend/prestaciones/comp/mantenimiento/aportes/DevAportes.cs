using bce.util;
using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.contabilidad;
using dal.monetario;
using dal.persona;
using dal.prestaciones;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.aportes {
    class DevAportes : ComponenteMantenimiento {
        /// <summary>
        /// Clase que realiza devolución de aportes y contabiliza
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("DEVAPORTE") == null || rm.GetTabla("DEVAPORTE").Lregistros.Count() <= 0) {
                return;
            }

            tpredevaporte devaporte = (tpredevaporte)rm.GetTabla("DEVAPORTE").Lregistros.ElementAt(0);
            Contabilizar(rm,devaporte);

        }

        public static void Contabilizar(RqMantenimiento rm, tpredevaporte devaporte) {

            tconparametros parametro_comandancia = TconParametrosDal.FindXCodigo("CPERSONA_COMANDANCIA", rm.Ccompania);
            if (parametro_comandancia == null) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CPERSONA_COMANDANCIA");
            }
            long cpersona_comandancia = Convert.ToInt32(parametro_comandancia.numero);

            tconparametros parametro_centrocostos_default = TconParametrosDal.FindXCodigo("CENTROCOSTOS_DEFAULT", rm.Ccompania);
            if (parametro_centrocostos_default == null) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CENTROCOSTOS_DEFAULT");
            }
            string centrocostos_default = parametro_centrocostos_default.texto;

            tconparametros parametro_cuenta_aportespatronales = TconParametrosDal.FindXCodigo("CUENTA_FA_APORTEPATRON", rm.Ccompania);
            if (parametro_cuenta_aportespatronales == null) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CUENTA_FA_APORTEPATRON");
            }
            string cuenta_aportespatronales = parametro_cuenta_aportespatronales.texto;

            tconparametros parametro_cuenta_aportespersonales = TconParametrosDal.FindXCodigo("CUENTA_FA_APORTEPERSON", rm.Ccompania);
            if (parametro_cuenta_aportespersonales == null) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CUENTA_FA_APORTEPERSON");
            }
            string cuenta_aportespersonales = parametro_cuenta_aportespersonales.texto;

            tconparametros parametro_cuenta_spi_fondos = TconParametrosDal.FindXCodigo("CUENTA_FA_SPI", rm.Ccompania);
            if (parametro_cuenta_aportespersonales == null) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CUENTA_FA_SPI");
            }
            string cuenta_spi = parametro_cuenta_spi_fondos.texto;

            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rm, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rm.Fconatable, Constantes.GetParticion((int)rm.Fconatable),
                rm.Ccompania, 0, "PE", devaporte.cpersona, null, rm.Freal, rm.Fproceso, devaporte.comentario, true, true, false, false, false, false, false,
                null, 3, 1, 1, 44, 28, 1003, "DIAGEN", 1, 1, 0, numerocomprobantecesantia,
                null, null, null, null, null, null, rm.Cusuario, rm.Freal, null, null);
            comprobante.Esnuevo = true;
            devaporte.ccomprobante = ccomprobante;
            devaporte.cpersonabeneficiario = cpersona_comandancia;
            comprobante.actualizosaldo = true;
            decimal monto = 0;
            List<tconcomprobantedetalle> ldetalle = new List<tconcomprobantedetalle>();
            if (devaporte.vaportepatronal != 0) {
                tconcomprobantedetalle cd1 = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, cuenta_aportespatronales, true, null,
                    "USD", "USD", 0, 0, null, null, 1002, parametro_centrocostos_default.texto, null, null);
                cd1.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd1.ccuenta).cclase;
                cd1.suma = TmonClaseDal.Suma(cd1.cclase, cd1.debito);
                cd1.monto = devaporte.vaportepatronal;
                cd1.montooficial = devaporte.vaportepatronal;
                monto += cd1.monto.Value;
                ldetalle.Add(cd1);
            }

            if (devaporte.vaportepersonal != 0) {
                tconcomprobantedetalle cd2 = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, cuenta_aportespersonales, true, null,
                    "USD", "USD", 0, 0, null, null, 1002, parametro_centrocostos_default.texto, null, null);
                cd2.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd2.ccuenta).cclase;
                cd2.suma = TmonClaseDal.Suma(cd2.cclase, cd2.debito);
                cd2.monto = devaporte.vaportepersonal;
                cd2.montooficial = devaporte.vaportepersonal;
                monto += cd2.monto.Value;
                ldetalle.Add(cd2);
            }

            tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, cuenta_spi, false, null,
            "USD", "USD", 0, 0, null, null, 1002, parametro_centrocostos_default.texto, null, null);
            cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
            cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
            cd.monto = monto;
            cd.montooficial = monto;
            ldetalle.Add(cd);

            tperproveedor prove = TperProveedorDal.Find(cpersona_comandancia, 1);
            //tperpersonadetalle persona;
            tperreferenciabancaria referenciabancaria;

            //persona = TperPersonaDetalleDal.FindByIdentification(prove.identificacion);
            referenciabancaria = TperReferenciaBancariaDal.Find(cpersona_comandancia, 1);


            ttestransaccion ttestransaccion = new ttestransaccion();
            ttestransaccion.identificacionbeneficiario = prove.identificacion;
            ttestransaccion.nombrebeneficiario = prove.nombre;
            ttestransaccion.numerocuentabeneficiario = referenciabancaria.numero;
            ttestransaccion.tipocuentaccatalogo = referenciabancaria.tipocuentaccatalogo.Value;
            ttestransaccion.tipocuentacdetalle = referenciabancaria.tipocuentacdetalle;
            ttestransaccion.institucionccatalogo = referenciabancaria.tipoinstitucionccatalogo.Value;
            ttestransaccion.institucioncdetalle = referenciabancaria.tipoinstitucioncdetalle;
            ttestransaccion.valorpago = Math.Abs(Convert.ToDecimal(monto));

            // Registro SPI
            GenerarBce.InsertarPagoBce(rm, prove.identificacion, prove.nombre, referenciabancaria.numero, prove.cpersona, referenciabancaria.tipocuentaccatalogo.Value,
                referenciabancaria.tipocuentacdetalle, referenciabancaria.tipoinstitucionccatalogo.Value, referenciabancaria.tipoinstitucioncdetalle,
                Math.Abs(ttestransaccion.valorpago), devaporte.cdevaporte.ToString(), null, comprobante.ccomprobante);

            rm.AdicionarTabla("TCONCOMPROBANTE", comprobante, false);
            rm.AdicionarTabla("TCONCOMPROBANTEDETALLE", ldetalle, false);
            rm.Mdatos.Add("actualizarsaldosenlinea", true);
        }

    }
}
