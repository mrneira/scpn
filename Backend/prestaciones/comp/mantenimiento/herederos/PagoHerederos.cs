using bce.util;
using core.componente;
using dal.prestaciones;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.herederos {
    class PagoHerederos : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("HEREDEROS") == null || rm.GetTabla("HEREDEROS").Lregistros.Count() <= 0) {
                return;
            }
            int secuencia = int.Parse(rm.Mdatos["secuencia"].ToString());
            //IList<tprebeneficiario> tpb = TpreBeneficiarioDal.FindBeneficiarios(secuencia);
            tprebeneficiario ben = (tprebeneficiario)rm.GetTabla("HEREDEROS").Lregistros.ElementAt(0);
            tpreexpediente exp = TpreExpedienteDal.FindToExpediente(secuencia);
            int cont = 1;
            decimal? sumvalor = 0;
            string Nombre = ben.primernombre + " " + ben.primerapellido;


            if (ben.valorliquidacion.Value > 0) {
                if (!(bool)ben.pagoexterno)
                    sumvalor = sumvalor + ben.valorliquidacion;
                if (ben.curador.Value) {
                    if ((bool)ben.estado) {
                        GenerarBce.InsertarPagoBce(rm, ben.identificacion, Nombre, ben.numerocuenta,
                                                                null, ben.curtipoinstitucionccatalogo.Value, ben.curtipocuentacdetalle, ben.curtipoinstitucionccatalogo.Value,
                                                                ben.curtipoinstitucioncdetalle, (ben.valorliquidacion.Value / 2), ben.identificacion, ((cont++) + secuencia), exp.comprobantecontable);

                        GenerarBce.InsertarPagoBce(rm, ben.identificacion, Nombre, ben.numerocuenta,
                                               null, ben.tipocuentaccatalogo.Value, ben.tipocuentacdetalle, ben.tipoinstitucionccatalogo.Value,
                                               ben.tipoinstitucioncdetalle, (ben.valorliquidacion.Value / 2), ben.identificacion, ((cont++) + secuencia), exp.comprobantecontable);
                    }
                } else {
                    if ((bool)ben.estado) {
                        GenerarBce.InsertarPagoBce(rm, ben.identificacion, Nombre, ben.numerocuenta,
                                            null, ben.tipocuentaccatalogo.Value, ben.tipocuentacdetalle, ben.tipoinstitucionccatalogo.Value,
                                            ben.tipoinstitucioncdetalle, ben.valorliquidacion.Value, ben.identificacion, ((cont++) + secuencia), exp.comprobantecontable);
                    }
                }
            }
        }
    }
}
