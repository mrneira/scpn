using bce.util;
using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.contabilidad;
using dal.prestaciones;
using dal.socio;
using modelo;
using Newtonsoft.Json;
using prestaciones.dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.expediente {
    public class GenerarComprobantesMovimiento : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {


            if (!(bool)rm.Mdatos["generarcomprobante"]) {
                return;
            }

            string cdetalletipoexp = rm.GetString("cdetalletipoexp"), paramplantilla = string.Empty;
            IList<Saldo> itm = new List<Saldo>();
            IList<tpreexpedientedetalle> TPED = new List<tpreexpedientedetalle>();
            rm.Mdatos.Add("cconcepto", 3);
            long cpersona = long.Parse(rm.Mdatos["cpersona"].ToString());
            int secuencia = int.Parse(rm.Mdatos["secuencia"].ToString());
            tpreliquidacion ldatos = TpreLiquidacionDal.Find(secuencia);

            tsoccesantiahistorico hisbaja = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, (int)rm.Ccompania, 3);
            tprepago tprepago  = new tprepago();

            string TIPO = rm.GetString("cdetallejerarquia");
            rm.AddDatos("intBaja", DateTime.Parse(hisbaja.festado.ToString()).Year);
            //VARIABLE CONTRA APORTES O CESANTIA
            decimal sum = 0;
            bool cuantiafallecimiento = false;
            tpreexpediente exp = (tpreexpediente)rm.GetTabla("DATOSEXPEDIENTE").Lregistros.ElementAt(0);
            cdetalletipoexp = exp.cdetalletipoexp;
            string fechaServicio = exp.tiemposervicio;
            string añosTotales = fechaServicio.Substring(0, 2);
            if (!cdetalletipoexp.Equals("ANT")) {

                if (cdetalletipoexp.Equals("CEF") || cdetalletipoexp.Equals("CES")) {
                    if (DateTime.Parse(hisbaja.festado.ToString()).Year >= 2019) { /// CCA cambios expediente
                        tpreexpedientedetalle cb = completarExpediente(rm, ldatos.secuencia);
                        cb.nombre = "CUANTIA BÁSICA";
                        cb.descripcion = "VALOR POR CUANTIA BÁSICA";
                        cb.rubrocdetalle = (TIPO.Equals("CLA")) ? "CBCLAS" : "CBOFIC";
                        cb.monto = ldatos.vcuantiabasica.Value;
                        cuantiafallecimiento = true;
                        cb.ingreso = true;
                        if (cb.monto > 0 && (cdetalletipoexp.Equals("CES") /*|| cdetalletipoexp.Equals("CEF")*/)) // CCA cambios comprobante
                            TPED.Add(cb);
                        if (cb.monto > 0 && cdetalletipoexp.Equals("CEF") && Int32.Parse(añosTotales) >= 20)
                            TPED.Add(cb);

                        tpreexpedientedetalle bc = completarExpediente(rm, ldatos.secuencia);
                        bc.nombre = "BONIFICACIÓN CLASES";
                        bc.descripcion = "VALOR POR BONIFICACIÓN CLASES";
                        bc.rubrocdetalle = (TIPO.Equals("CLA")) ? "MBCLAS" : "MBOFIC";
                        bc.monto = ldatos.vbonificacion.Value;
                        bc.ingreso = true;

                        if (bc.monto > 0)
                            TPED.Add(bc);
                    } else {
                        tpreexpedientedetalle ces = completarExpediente(rm, ldatos.secuencia);
                        ces.nombre = "CESANTIA AÑOS ANTERIORES";
                        ces.descripcion = "CESANTIA AÑOS ANTERIORES";
                        ces.rubrocdetalle = (TIPO.Equals("CLA")) ? "CEACLA" : "CEAOFI";
                        cuantiafallecimiento = true;
                        ces.monto = exp.subtotal;
                        ces.ingreso = true;
                        if (ces.monto > 0)
                            TPED.Add(ces);
                    }

                }

                if (cdetalletipoexp.Equals("CEF") && ldatos.vbonificacion.Value == 0) {
                    tpreexpedientedetalle dap = completarExpediente(rm, ldatos.secuencia);
                    dap.nombre = "DEVOLUCIÓN APORTES";
                    dap.descripcion = "DEVOLUCIÓN APORTES";
                    if (DateTime.Parse(hisbaja.festado.ToString()).Year >= 2019) //CCA cambios FallecidosActosServicio 20210224
                    {
                        dap.rubrocdetalle = (TIPO.Equals("CLA")) ? "CBCLAS" : "CBOFIC";
                    }
                    else
                    {

                        dap.rubrocdetalle = (TIPO.Equals("CLA")) ? "APXCLA" : "APXOFI";
                    }
                    dap.monto = exp.totalliquidacion;
                    dap.ingreso = true;
                    if (cuantiafallecimiento == true && exp.subtotal == TPED.Sum(x => x.monto)) { // CCA cambios comprobante
                        dap.monto = 0;
                    }
                    if (dap.monto > 0)
                        TPED.Add(dap);
                }

                tpreexpedientedetalle ret = completarExpediente(rm, ldatos.secuencia);
                ret.nombre = "RETENCIONES";
                ret.descripcion = "VALOR POR RETENCIONES";
                ret.rubrocdetalle = "2";
                ret.monto = ldatos.dretencion.Value;
                ret.ingreso = false;

                if (ret.monto > 0)
                    TPED.Add(ret);




                IList<tsocnovedadades> sn = TsocNovedadesDal.FindToNovedadesACT(cpersona, rm.Ccompania);
                foreach (tsocnovedadades snov in sn) {
                    tpreexpedientedetalle tp = completarExpediente(rm, ldatos.secuencia);
                    tp.nombre = snov.novedad;
                    tp.descripcion = snov.novedad;
                    tp.rubrocdetalle = snov.cdetallenovedad;
                    tp.monto = snov.valor.Value;
                    tp.ingreso = false;
                    TPED.Add(tp);
                    

                    tprepago = TprePagoDal.Find(snov.cdetallenovedad);

                    if (tprepago != null) {
                        // 75054 comandancia , 74420 isspol
                        tpreexpedientedetalle tp1 = completarExpediente(rm, ldatos.secuencia);
                        tp1.nombre = snov.novedad;
                        tp1.descripcion = snov.novedad;
                        tp1.rubrocdetalle = tprepago.rubrovalorcdetalle;
                        tp1.monto = snov.valor.Value;
                        tp1.ingreso = true;
                        TPED.Add(tp1);

                        tpreexpedientedetalle tp2 = completarExpediente(rm, ldatos.secuencia);
                        tperproveedor pr = TperProveedorDal.Find(tprepago.cpersona.Value, rm.Ccompania);
                        tp2.nombre = pr.nombre;
                        tp2.descripcion = pr.nombrecomercial;
                        tp2.rubrocdetalle = tprepago.rubropagocdetalle;
                        tp2.monto = snov.valor.Value;
                        tp2.ingreso = false;
                        TPED.Add(tp2);
                    }
                   

                }

                tpreexpedientedetalle intr = completarExpediente(rm, ldatos.secuencia);
                intr.nombre = "INTERÉS";
                intr.descripcion = "VALOR POR INTERÉS";
                intr.monto = ldatos.vinteres.Value;
                intr.rubrocdetalle = (TIPO.Equals("CLA")) ? "INTCLA" : "INTOFI";
                intr.ingreso = true;
                if (intr.monto > 0)
                    TPED.Add(intr);



                if (cdetalletipoexp.Equals("DEV") || cdetalletipoexp.Equals("DEH")) {
                    tpreexpedientedetalle dap = completarExpediente(rm, ldatos.secuencia);
                    dap.nombre = "DEVOLUCIÓN APORTES";
                    dap.descripcion = "DEVOLUCIÓN APORTES";
                    dap.rubrocdetalle = (TIPO.Equals("CLA")) ? "APXCLA" : "APXOFI";
                    //if (DateTime.Parse(hisbaja.festado.ToString()).Year == rm.Freal.Year) {
                    dap.monto = ldatos.taportes.Value;
                    //} else {
                    //dap.monto = exp.totalliquidacion;
                    //  }

                    dap.ingreso = true;
                    if (dap.monto > 0)
                        TPED.Add(dap);
                }


                tpreexpedientedetalle dapd = completarExpediente(rm, ldatos.secuencia);
                dapd.nombre = "DEVOLUCIÓN APORTES PORCENTAJE";
                dapd.descripcion = "DEVOLUCIÓN APORTES PORCENTAJE";
                dapd.rubrocdetalle = (TIPO.Equals("CLA")) ? "D20CLA" : "D20OFI";
                dapd.monto = ldatos.daportes.Value;
                dapd.ingreso = false;
                if (dapd.monto > 0)
                    TPED.Add(dapd);


            } else {


                tpreexpedientedetalle anti = completarExpediente(rm, ldatos.secuencia);
                anti.nombre = "ANTICIPOS CESANTIA";
                anti.descripcion = "ANTICIPOS CESANTIA";
                anti.rubrocdetalle = (TIPO.Equals("CLA")) ? "ANTCLA" : "ANTOFI";
                anti.monto = (exp.totalsolicitado.Value > 0) ? exp.totalsolicitado.Value : exp.totalliquidacion;
                anti.ingreso = true;
                if (anti.monto > 0)
                    TPED.Add(anti);
            }

            foreach (tpreexpedientedetalle TPX in TPED) {
                Saldo s = new Saldo();
                s.saldo = TPX.rubrocdetalle;
                s.valor = TPX.monto;
                itm.Add(s);
                if (TPX.ingreso)
                    sum = sum + TPX.monto;
                else
                    sum = sum - TPX.monto;
            }

            /************PAGO************/


            /************************/

            Saldo LIQTOTAL = new Saldo();

            switch (cdetalletipoexp) {
                case "DEV":
                    LIQTOTAL.saldo = (TIPO.Equals("CLA")) ? "DAPCLA" : "DAPOFI";

                    break;
                case "DEH":
                    LIQTOTAL.saldo = (TIPO.Equals("CLA")) ? "DAPCLA" : "DAPOFI";

                    break;
                case "CEF":
                    if (DateTime.Parse(hisbaja.festado.ToString()).Year >= rm.Freal.Year) {

                        LIQTOTAL.saldo = (TIPO.Equals("CLA")) ? "CEPCLA" : "CEPOFI";
                    } else {
                        LIQTOTAL.saldo = (TIPO.Equals("CEF")) ? "CEFCLA" : "CEFOFI";
                    }
                    break;

                default:
                    LIQTOTAL.saldo = (TIPO.Equals("CLA")) ? "CEPCLA" : "CEPOFI";
                    break;
            }

            
            LIQTOTAL.valor = sum;
            itm.Add(LIQTOTAL);
            var json = JsonConvert.SerializeObject(itm);
            rm.Mdatos.Add("Saldos", json);
            if (DateTime.Parse(hisbaja.festado.ToString()).Year >= 2019) { /// CCA cambios expediente
                paramplantilla = "CONLIQ";
            } else {
                paramplantilla = "CONLIQANT";
            }
            tpreparametros param = TpreParametrosDal.Find(paramplantilla);

            if (param == null) {

                throw new AtlasException("PRE-012", "NO SE HA DEFINIDO EL PARAMETRO {0}", "CONLIQ");
            }
            if (param.numero == null) {

                throw new AtlasException("PRE-013", "NO SE HA DEFINIDO EL CÓDIGO DE PLANTILLA EN EL PARÁMETRO {0}", "CONLIQ");
            }

            if (param.texto == null) {

                throw new AtlasException("PRE-014", "NO SE HA DEFINIDO EL TIPO DE DIARIO EN EL PARÁMETRO {0}", "CONLIQ");
            }


            rm.Mdatos.Add("cplantilla", (int)param.numero);
            rm.Mdatos.Add("tipodocumento", param.texto);
            RqMantenimiento rq = (RqMantenimiento)rm.Clone();
            rq.EncerarRubros();
            Mantenimiento.ProcesarAnidado(rq, 28, 34);
            exp.comprobantecontable = rm.GetString("ccomprobante");
            //rm.AdicionarTabla("tpreexpedientedetalle", TPED, false);

            // DateTime? fbaja = hisbaja.festado;

            //VALIDACIÓN DE CUPOS Y ACTUALIZACIÓN
            //if (DateTime.Parse(hisbaja.festado.ToString()).Year == rm.Freal.Year) {
            //    tprecuposliquidacion cliq = TpreCupoLiquidacionDal.FindPorAnio(rm.Freal.Year, TIPO, cdetalletipoexp);

            //    if (cliq == null) {
            //        throw new AtlasException("PRE-018", "NO SE HA DEFINIDO EL CUPO PARA EL TIPO DE EXPEDIENTE  {0} Y JERARQUIA {1}", cdetalletipoexp, TIPO);

            //    }

            //    cliq.cuposusado = cliq.cuposusado + 1;
            //    if (cliq.cuposusado > cliq.cupostotal) {
            //        throw new AtlasException("PRE-019", "HA EXCEDIDO EL CUPO PARA EL TIPO DE EXPEDIENTE  {0} Y JERARQUIA {1}", cdetalletipoexp, TIPO);

            //    }
            //}
        }
        private static tpreexpedientedetalle completarExpediente(RqMantenimiento rm, long secuencia) {
            tpreexpedientedetalle tpx = new tpreexpedientedetalle();
            tpx.fcontable = rm.Fconatable;
            tpx.fingreso = rm.Freal;
            tpx.secuencia = secuencia;
            tpx.cusuarioing = rm.Cusuario;
            tpx.Esnuevo = true;
            tpx.Actualizar = false;
            tpx.cexpedienterubro = Secuencia.GetProximovalor("CEXDETALLE");
            tpx.rubroccatalogo = 220;
            return tpx;
        }
    }
}


