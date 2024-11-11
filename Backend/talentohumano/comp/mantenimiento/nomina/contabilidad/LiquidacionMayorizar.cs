using bce.util;
using core.componente;
using dal.contabilidad;
using dal.talentohumano;
using modelo;
using modelo.helper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace talentohumano.comp.mantenimiento.nomina.contabilidad
{
    public class LiquidacionMayorizar : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (!rm.Mdatos.ContainsKey("registro")) {
                return;
            }
            var LIQ = JsonConvert.DeserializeObject<tnomliquidacion>(@rm.Mdatos["registro"].ToString());

            decimal suepp = LIQ.totalingresos.Value - LIQ.totalegresos.Value;

            tconcomprobante comp = TconComprobanteDal.FindComprobante(LIQ.ccomprobante);
            //ACTUALIZO A MAYORIZADO
            comp.automatico = true;
            comp.Actualizar = true;
            comp.actualizosaldo = true;
            IList<tconcomprobantedetalle> compd = TconComprobanteDetalleDal.Find(LIQ.ccomprobante, rm.Ccompania);
            IList<tconcomprobantedetalle> compdt = new List<tconcomprobantedetalle>();
            IList<tpreexpedientedetalle> TPED = new List<tpreexpedientedetalle>();
            foreach (tconcomprobantedetalle cd in compd)
            {
                EntityHelper.SetActualizar(cd);
                cd.Actualizar = true;
                compdt.Add(cd);
            }
            tthfuncionariodetalle fun = TthFuncionarioDal.Find(LIQ.cfuncionario.Value);
            String nombre = ((fun.primernombre != null) ? fun.primernombre : "") + " " +
                            ((fun.primerapellido != null) ? fun.primerapellido : "");
            if (suepp > 0)
            {
                GenerarBce.InsertarPagoBce(rm, fun.documento, nombre, fun.ncuenta,
                                     fun.cpersona, fun.tipocuentaccatalogo.Value, fun.tipocuentacdetalle, fun.bancoccatalago.Value,
                                     fun.bancocdetalle, suepp, fun.documento, 1, comp.ccomprobante);
            }
            else {

            }

            tthcontratodetalle con = TthContratoDal.Find(LIQ.ccontrato.Value);
            con.fdesvinculacion = LIQ.fdesvinculacion.Value;
            con.Actualizar = true;
            con.Esnuevo = false;
            EntityHelper.SetActualizar(con);
            con.estadocontratocdetalle = "INC";
            rm.AdicionarTabla("tthcontratodetalle", con, false);
            rm.AdicionarTabla("tconcomprobante", comp, false);
            rm.AdicionarTabla("tconcomprobantedetalle", compdt, false);
            rm.Mdatos.Add("actualizarsaldosenlinea", true);
            rm.Response["VALIDADO"] = true;

        }
    }
}
