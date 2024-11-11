using core.componente;
using System;
using System.Collections.Generic;
using util.dto.mantenimiento;
using modelo;
using dal.prestaciones;
using util;
using prestaciones.dto;
using dal.socio;
using core.servicios;
using bce.util;
using dal.contabilidad;
using modelo.helper;
using System.Linq;
using dal.presupuesto;

namespace prestaciones.comp.mantenimiento.expediente {
    public class GenerarComprobantes : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {

            if (!(bool)rm.Mdatos["generarcomprobante"]) {
                return;
            }

            tpreexpediente obj = (tpreexpediente)rm.GetTabla("DATOSEXPEDIENTE").Lregistros.ElementAt(0);
            string cdetalletipoexp = rm.GetString("cdetalletipoexp");

            IList<Saldo> itm = new List<Saldo>();
            decimal sum = 0;

            long cpersona = long.Parse(rm.Mdatos["cpersona"].ToString());
            int secuencia = int.Parse(rm.Mdatos["secuencia"].ToString());
            tpreliquidacion ldatos = TpreLiquidacionDal.Find(secuencia);
            //INTERES
            string TIPO = rm.GetString("cdetallejerarquia");
            string cexpediente = rm.GetString("cexpediente");
            tpreexpediente exp = TpreExpedienteDal.FindToExpediente(secuencia);
            tsoccesantiahistorico hisbaja = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, (int)rm.Ccompania, 3);
            tprepago tprepago = new tprepago();
            List<tconcomprobante> lcomp = new List<tconcomprobante>();

            tconcomprobante comp = TconComprobanteDal.FindComprobante(exp.comprobantecontable);
            //ACTUALIZO A MAYORIZADO

            List<tconcomprobantedetalle> compd = TconComprobanteDetalleDal.Find(exp.comprobantecontable, rm.Ccompania);
            IList<tconcomprobantedetalle> compdt = new List<tconcomprobantedetalle>();
            IList<tpreexpedientedetalle> TPED = new List<tpreexpedientedetalle>();
            foreach (tconcomprobantedetalle cd in compd) {
                EntityHelper.SetActualizar(cd);
                cd.Actualizar = true;
                compdt.Add(cd);
            }
            /*
             ACTUALIZACIÓN DE SALDOS RECALCULO PARA ENVIAR A SALDOS OPERATIVOS
             */
            cdetalletipoexp = exp.cdetalletipoexp;
            if (!cdetalletipoexp.Equals("ANT")) {

                if (cdetalletipoexp.Equals("CEF") || cdetalletipoexp.Equals("CES")) {
                    if (DateTime.Parse(hisbaja.festado.ToString()).Year == rm.Freal.Year) {
                        tpreexpedientedetalle cb = completarExpediente(rm, ldatos.secuencia);
                        cb.nombre = "CUANTIA BÁSICA";
                        cb.descripcion = "VALOR POR CUANTIA BÁSICA";
                        cb.rubrocdetalle = (TIPO.Equals("CLA")) ? "CBCLAS" : "CBOFIC";
                        cb.monto = ldatos.vcuantiabasica.Value;
                        cb.ingreso = true;
                        if (cb.monto > 0)
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
                    dap.rubrocdetalle = (TIPO.Equals("CLA")) ? "APXCLA" : "APXOFI";
                    dap.monto = exp.totalliquidacion;
                    dap.ingreso = true;
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
            int sec = 1;

            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(comp.cplantilla.Value, rm.Ccompania);
            tconplantilla pl = TconPlantillaDal.Find(comp.cplantilla.Value, rm.Ccompania);
            IList<tpremovimiento> MOVG = new List<tpremovimiento>();

            foreach (Saldo ccd in itm) {
                tpremovimiento mov = new tpremovimiento();
                mov.Esnuevo = true;
                mov.Actualizar = false;
                mov.mensaje = rm.Mensaje;
                mov.particion = Constantes.GetParticion((int)rm.Fconatable);
                mov.secmensaje = sec++;
                mov.saldoccatalogo = int.Parse(pl.tipomovimientocdetalle);
                mov.saldocdetalle = ccd.saldo;
                mov.centrocostoccatalogo = plantillaDetalle.Find(x => x.campotablacdetalle.Equals(ccd.saldo)).centrocostosccatalogo;
                mov.centrocostocdetalle = plantillaDetalle.Find(x => x.campotablacdetalle.Equals(ccd.saldo)).centrocostoscdetalle;
                mov.ccuenta = plantillaDetalle.Find(x => x.campotablacdetalle.Equals(ccd.saldo)).ccuenta;
                mov.cclase = TconCatalogoDal.Find(rm.Ccompania, mov.ccuenta).cclase;
                mov.fcontable = rm.Fconatable;
                mov.ftrabajo = rm.Ftrabajo.Value;
                mov.fproceso = rm.Fproceso.Value;
                mov.fvalor = rm.Freal;
                mov.ctransaccion = rm.Ctransaccion;
                mov.ctransaccionorigen = rm.Ctranoriginal;
                mov.cmoduloorigen = rm.Cmodulotranoriginal;
                mov.cmodulo = rm.Cmodulo;
                mov.cmoneda = rm.Cmoneda;
                mov.montomonedalocal = ccd.valor;
                mov.monto = ccd.valor;
                mov.debito = plantillaDetalle.Find(x => x.campotablacdetalle.Equals(ccd.saldo)).debito.Value;
                mov.csucursal = rm.Csucursal;
                mov.cagencia = rm.Cagencia;
                mov.ccompania = rm.Ccompania;
                mov.cmodulotransaccion = rm.Cmodulotranoriginal;
                mov.cmonedalocal = rm.Cmoneda;
                mov.csucursalorigen = rm.Csucursal;
                mov.cusuario = rm.Cusuario;
                if (mov.monto > 0)
                    MOVG.Add(mov);
            }

            //si son movimientos del mismo día entonces uso el comprobante ya guardado

            if (Constantes.GetParticion(comp.fcontable) != Constantes.GetParticion(rm.Fconatable)) {
                if (comp.cuadrado.Value) {

                    comp.automatico = true;
                    comp.Actualizar = false;
                    comp.actualizosaldo = true;
                    comp.Esnuevo = true;

                    foreach (tconcomprobantedetalle obj1 in compd) {
                        obj1.Actualizar = false;
                        obj1.Esnuevo = true;
                    }

                    string nuevoccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
                    obj.comprobantecontable = nuevoccomprobante;
                    tconcomprobante nuevocomprobante = TconComprobanteDal.DuplicarComprobanteConFContableActual(comp, nuevoccomprobante, rm);
                    List<tconcomprobantedetalle> lnuevocomprobantedetalle = TconComprobanteDetalleDal.DuplicarComprobanteDetalleConFContableActual(compd, nuevoccomprobante, rm);

                    nuevocomprobante.automatico = true;
                    nuevocomprobante.Actualizar = false;
                    nuevocomprobante.actualizosaldo = true;
                    nuevocomprobante.eliminado = false;

                    comp.Actualizar = true;
                    comp.actualizosaldo = false;
                    comp.eliminado = true;

                    lcomp.Add(nuevocomprobante);
                    lcomp.Add(comp);

                    List<tppthistorialpartidagasto> lhisPatrimonioGastoActualizar = new List<tppthistorialpartidagasto>();

                    List<tppthistorialpartidagasto> lhisPatrimonioGasto;
                    lhisPatrimonioGasto = TpptHistorialPartidaGastoDal.BuscarListaHistorialPorComprobante(comp.ccomprobante);

                    foreach (tppthistorialpartidagasto obj2 in lhisPatrimonioGasto) {
                        obj2.Actualizar = true;
                        obj2.ccomprobante = nuevoccomprobante;
                    }

                    rm.AdicionarTabla("tppthistorialpartidagasto", lhisPatrimonioGasto, false);
                    rm.AdicionarTabla("tconcomprobantedetalle", lnuevocomprobantedetalle, false);
                }
            } else {
                comp.automatico = true;
                comp.Actualizar = true;
                comp.actualizosaldo = true;
                lcomp.Add(comp);
                // rm.AdicionarTabla("tconcomprobante", comp, false);
                rm.AdicionarTabla("tconcomprobantedetalle", compdt, false);
            }

            rm.AdicionarTabla("TCONCOMPROBANTE", lcomp, false);
            rm.AdicionarTabla("tpremovimiento", MOVG, false);
            rm.AdicionarTabla("tpreexpedientedetalle", TPED, false);
            rm.Mdatos.Add("actualizarsaldosenlinea", true);
            rm.Mdatos.Add("noactualizarsaldopresupuesto", true);

            IList<tprebeneficiario> tpb = TpreBeneficiarioDal.FindBeneficiarios((int)ldatos.secuencia);
            int cont = 1;
            decimal? sumvalor = 0;
            foreach (tprebeneficiario ben in tpb) {
                string Nombre = ben.primernombre + " " + ben.primerapellido;


                if (ben.valorliquidacion.Value > 0) {
                    if (!(bool)ben.pagoexterno)
                        sumvalor = sumvalor + ben.valorliquidacion;
                    if (ben.curador.Value) {
                        if ((bool)ben.estado) {
                            decimal valor1=0, valor2=0;
                            decimal curador = ben.valorliquidacion.Value;
                            curador = decimal.Round(curador, 2, MidpointRounding.AwayFromZero);
                            if (curador % 2 == 0)
                            {
                                valor1 = curador / 2;
                                valor2 = curador / 2;

                            }
                            else {
                                decimal mitad = curador / 2;
                                 mitad= decimal.Round(mitad, 2, MidpointRounding.AwayFromZero);
                                //VALOR MAYOR A BENEFICIARIO
                                valor1 = mitad;
                                valor2 = curador - mitad;
                            }

                            GenerarBce.InsertarPagoBce(rm, ben.identificacion, Nombre, ben.numerocuenta,
                                                                    null, ben.curtipocuentaccatalogo.Value, ben.curtipocuentacdetalle, ben.tipoinstitucionccatalogo.Value,
                                                                    ben.curtipoinstitucioncdetalle, valor1, ben.identificacion, ((cont++) + (int)ldatos.secuencia), comp.ccomprobante);

                            GenerarBce.InsertarPagoBce(rm, ben.identificacion, Nombre, ben.numerocuenta,
                                                   null, ben.tipocuentaccatalogo.Value, ben.tipocuentacdetalle, ben.tipoinstitucionccatalogo.Value,
                                                   ben.tipoinstitucioncdetalle, valor2, ben.identificacion, ((cont++) + (int)ldatos.secuencia), comp.ccomprobante);
                        }
                    } else {
                        if ((bool)ben.estado) {
                            GenerarBce.InsertarPagoBce(rm, ben.identificacion, Nombre, ben.numerocuenta,
                                                null, ben.tipocuentaccatalogo.Value, ben.tipocuentacdetalle, ben.tipoinstitucionccatalogo.Value,
                                                ben.tipoinstitucioncdetalle, ben.valorliquidacion.Value, ben.identificacion, ((cont++) + (int)ldatos.secuencia), comp.ccomprobante);
                        }
                    }
                }
            }

            if (decimal.Round(exp.totalsolicitado > 0 ? (decimal)exp.totalsolicitado : exp.totalliquidacion, 2) != decimal.Round((decimal)sumvalor, 2)) {
                throw new AtlasException("PRE-027", "VALOR DE LA LIQUIDACIÓN {0}, DIFIERE DE CANTIDAD DE LOS BENEFICIARIOS {1}", decimal.Round(exp.totalsolicitado > 0 ? (decimal)exp.totalsolicitado : exp.totalliquidacion, 2), decimal.Round((decimal)sumvalor, 2));
            }

            rm.Response["ccomprobante"] = obj.comprobantecontable;
            rm.Response["GENERADO"] = true;
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
