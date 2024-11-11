using contabilidad.saldo;
using core.componente;
using core.servicios;
using dal.contabilidad;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.comprobante {

    /// <summary>
    /// Reversa la actualizacion de saldos 
    /// </summary>
    public class Anular : ComponenteMantenimiento {

        /// <summary>
        /// Genera un nuevo comprobante con los movimientos en contra del comprobante que se está anulando.
        /// Adicionalmente el nuevo comprobante es mayorizado
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!rqmantenimiento.Mdatos.ContainsKey("anular")) {
                return;
            }

            rqmantenimiento.Mtablas.Remove("CABECERA");

            string ccomprobante = rqmantenimiento.Mdatos["ccomprobante"].ToString();
            int fcontable = int.Parse(rqmantenimiento.Mdatos["fcontable"].ToString());
            int ccompania = int.Parse(rqmantenimiento.Mdatos["ccompania"].ToString());
            tconcomprobante comprobanteOriginal = TconComprobanteDal.FindComprobante(ccomprobante, fcontable, ccompania);
            tconcomprobante comprobanteEspejo =  (tconcomprobante)comprobanteOriginal.Clone();
            

            comprobanteOriginal.anulado = true;
            comprobanteOriginal.fmodificacion = rqmantenimiento.Freal;
            comprobanteOriginal.cusuariomod = rqmantenimiento.Cusuario;
            List<tconcomprobantedetalle> comprobanteDetalleOriginal = TconComprobanteDetalleDal.Find(ccomprobante, fcontable, ccompania);


            string ccomprobanteEspejo = "";
            string numerocomprobantecesantiaEspejo = "";
            string tipodocumentocdetalle = comprobanteOriginal.tipodocumentocdetalle;

            ccomprobanteEspejo = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            numerocomprobantecesantiaEspejo = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, tipodocumentocdetalle);

            string comentarioOriginal = "(Usuario reverso: " + rqmantenimiento.Cusuario + " Fecha: " + rqmantenimiento.Freal + " Comprobante de reverso: " + ccomprobanteEspejo + ")";
            string comentarioEspejo = "(Comprobante original al que reversa: " + comprobanteOriginal.ccomprobante + ")";

            comprobanteEspejo.Esnuevo = true;
            comprobanteEspejo.Actualizar = false;
            comprobanteEspejo.ccomprobante = ccomprobanteEspejo;
            comprobanteEspejo.numerocomprobantecesantia = numerocomprobantecesantiaEspejo;
            comprobanteEspejo.cusuarioing = rqmantenimiento.Cusuario;
            comprobanteEspejo.fingreso = rqmantenimiento.Freal;
            comprobanteEspejo.fmodificacion = null;
            comprobanteEspejo.cusuariomod = null;
            comprobanteEspejo.anulado = false;
            comprobanteEspejo.comentario = comentarioEspejo;
            List<tconcomprobantedetalle> comprobanteDetalleEspejo = TconComprobanteDetalleDal.CrearComprobanteDetalleDeAnulacion(comprobanteDetalleOriginal, comprobanteEspejo.ccomprobante);
            comprobanteOriginal.comentario += comentarioOriginal;
            comprobanteOriginal.ccomprobanteanulacion = ccomprobanteEspejo;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobanteOriginal, false);
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobanteEspejo, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalleEspejo, false);

            SaldoHelper sh = new SaldoHelper();
            sh.Actualizar(rqmantenimiento.Response, comprobanteEspejo, comprobanteDetalleEspejo.ToList<IBean>());
            rqmantenimiento.Response["ccomprobanteEspejo"] = ccomprobanteEspejo;
            rqmantenimiento.Response["numerocomprobantecesantiaEspejo"] = numerocomprobantecesantiaEspejo;
            
            SaldoPresupuesto.ActualizarSaldoPresupuesto(rqmantenimiento, comprobanteEspejo, comprobanteDetalleEspejo.ToList<IBean>());
        }

    }

}

