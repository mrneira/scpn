using bce.util;
using core.componente;
using core.servicios.mantenimiento;
using dal.cartera;
using dal.persona;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.desembolso {

    /// <summary>
    /// Clase que se encarga que validar los datos de desembolso.
    /// </summary>
    public class ValidaDesembolso : ComponenteMantenimiento {
        int secuencia = 0;
        decimal montoOperacion = 0;

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            ValidaDesembolsoTransferencia(rqmantenimiento);
            ValidaDesembolsoOtros(rqmantenimiento);

            if (montoOperacion != rqmantenimiento.Monto) {
                throw new AtlasException("CAR-0019", "MONTO TOTAL DE LA TRANSACCION NO ENVIADO");
            }

            Mantenimiento.ProcesarAnidado(rqmantenimiento, 7, 133);
        }

        /// <summary>
        /// Valida informacion de desembolso con transferencia SPI.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del requet con los que se ejecuta la transaccion.</param>
        private void ValidaDesembolsoTransferencia(RqMantenimiento rqmantenimiento)
        {
            List<IBean> ltransferencia = null;
            List<IBean> ltrandb = null;
            List<IBean> ltranmod = null;
            List<IBean> ltraneli = null;

            // Merge listas de registros
            ltrandb = TcarOperacionDesembolsoDal.FindToTipo(rqmantenimiento.Coperacion, "T").Cast<IBean>().ToList(); ;
            if (rqmantenimiento.GetTabla("TRANSFERENCIA") != null && rqmantenimiento.GetTabla("TRANSFERENCIA").Lregistros.Count() > 0) {
                ltranmod = rqmantenimiento.GetTabla("TRANSFERENCIA").Lregistros;
            }
            if (rqmantenimiento.GetTabla("TRANSFERENCIA") != null && rqmantenimiento.GetTabla("TRANSFERENCIA").Lregeliminar.Count() > 0) {
                ltraneli = rqmantenimiento.GetTabla("TRANSFERENCIA").Lregeliminar.Cast<IBean>().ToList();
            }
            ltransferencia = DtoUtil.GetMergedList(ltrandb.Cast<IBean>().ToList(), ltranmod, ltraneli).Cast<IBean>().ToList();
            if (ltransferencia == null || ltransferencia.Count == 0) {
                return;
            }

            foreach (tcaroperaciondesembolso spi in ltransferencia) {
                if (spi.Esnuevo)
                {
                    if (secuencia == 0)
                    {
                        secuencia = TcarOperacionDesembolsoDal.FindMaxSecuencia(spi.coperacion) + 1 ;
                    }
                    else
                    {
                        secuencia += 1;
                    }
                    spi.secuencia = secuencia;
                }
                               
                //spi.secuencia = secuencia;
                spi.identificacionbeneficiario = spi.identificacionbeneficiario ?? TperPersonaDetalleDal.Find(rqmantenimiento.Cpersona, rqmantenimiento.Ccompania).identificacion;
                if (spi.nombrebeneficiario == null) {
                    tpernatural persona = TperNaturalDal.Find(rqmantenimiento.Cpersona, rqmantenimiento.Ccompania);
                    string nombre = persona.primernombre + " " + persona.segundonombre;
                    spi.nombrebeneficiario = spi.nombrebeneficiario ?? nombre;
                }

                if ((spi.tipoinstitucioncdetalle == null) || (spi.tipocuentacdetalle == null) || (spi.numerocuentabancaria == null) || (spi.valor == null) ||
                    (spi.identificacionbeneficiario == null) || (spi.nombrebeneficiario == null)) {
                    throw new AtlasException("CAR-0046", "DATOS DE TRANSFERENCIA INCOMPLETOS");
                }

                //Sessionef.Actualizar(spi);

                // Registro SPI si es transferencia y no esta enviada o pagada.
                if (spi.transferencia.Value && !spi.pagado.Value) {
                    spi.mensaje = rqmantenimiento.Mensaje;
                    spi.pagado = true;
                    spi.fpago = rqmantenimiento.Fconatable;
                    GenerarBce.InsertarPagoBce(rqmantenimiento, spi.identificacionbeneficiario,
                                           spi.nombrebeneficiario, spi.numerocuentabancaria,
                                           (int)rqmantenimiento.Cpersona, (int)spi.tipocuentaccatalogo, spi.tipocuentacdetalle, (int)spi.tipoinstitucionccatalogo,
                                           spi.tipoinstitucioncdetalle, (decimal)spi.valor, spi.coperacion, spi.secuencia, null);

                }
                if (!spi.Esnuevo) {
                    spi.Actualizar = true;
                }
                montoOperacion = decimal.Add(montoOperacion, (decimal)spi.valor);
            }
            // Es necesario para el monetario.
            rqmantenimiento.Mtablas["TRANSFERENCIA"] = null;
            rqmantenimiento.AdicionarTabla("TRANSFERENCIA", ltransferencia, false);
        }

        /// <summary>
        /// Valida informacion de desembolso por otros conceptos
        /// </summary>
        /// <param name="rqmantenimiento">Datos del requet con los que se ejecuta la transaccion.</param>
        private void ValidaDesembolsoOtros(RqMantenimiento rqmantenimiento)
        {
            List<IBean> lotros = null;
            List<IBean> lotrodb = null;
            List<IBean> lotromod = null;
            List<IBean> lotroeli = null;

            // Merge listas de registros
            lotrodb = TcarOperacionDesembolsoDal.FindToTipo(rqmantenimiento.Coperacion, "C").Cast<IBean>().ToList(); ;
            if (rqmantenimiento.GetTabla("OTROS") != null && rqmantenimiento.GetTabla("OTROS").Lregistros.Count() > 0) {
                lotromod = rqmantenimiento.GetTabla("OTROS").Lregistros;
            }
            if (rqmantenimiento.GetTabla("OTROS") != null && rqmantenimiento.GetTabla("OTROS").Lregeliminar.Count() > 0) {
                lotroeli = rqmantenimiento.GetTabla("OTROS").Lregeliminar.Cast<IBean>().ToList();
            }
            lotros = DtoUtil.GetMergedList(lotrodb.Cast<IBean>().ToList(), lotromod, lotroeli).Cast<IBean>().ToList();
            if (lotros == null || lotros.Count == 0) {
                return;
            }

            foreach (tcaroperaciondesembolso otr in lotros) {
                if (otr.Esnuevo)
                {
                    if (secuencia == 0)
                    {
                        secuencia = TcarOperacionDesembolsoDal.FindMaxSecuencia(otr.coperacion) + 1;
                    }
                    else
                    {
                        secuencia += 1;
                    }
                    otr.secuencia = secuencia;
                }
                if (otr.ccuenta == null) {
                    throw new AtlasException("CAR-0016", "NUMERO DE CUENTA CONTABLE REQUERIDO PARA EJECUTAR EL DESEMBOLSO");
                }
                //secuencia += 1;
                otr.mensaje = rqmantenimiento.Mensaje;
                //otr.secuencia = secuencia;
                //Sessionef.Actualizar(otr);

                montoOperacion = decimal.Add(montoOperacion, (decimal)otr.valor);
            }
            //rqmantenimiento.Mtablas["TRANSFERENCIA"] = null;
            //rqmantenimiento.AdicionarTabla("tcaroperaciondesembolso", lotros, false);
        }

    }
}
