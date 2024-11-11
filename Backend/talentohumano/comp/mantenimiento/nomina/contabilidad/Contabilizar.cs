using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.generales;
using dal.monetario;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;
using dal.talentohumano.nomina;
using talentohumano.datos;
using Newtonsoft.Json;
using dal.talentohumano;
using core.servicios.mantenimiento;

namespace talentohumano.comp.mantenimiento.nomina.contabilidad {


    public class Contabilizar : ComponenteMantenimiento {
        /// <summary>
        /// Clase genérica que se encarga de generar el comprobante contable de talento humano, nómina hacia el módulo de contabilidad
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }
            string mensaje = Mantenimiento.GetMensaje(rqmantenimiento.Cusuario);
            //VALIDAR MDATOS
            ContabilizarNomina(rqmantenimiento,mensaje);

        }

        public static void ContabilizarNomina(RqMantenimiento rqmantenimiento,string mensaje)
        {
           
            int cplantilla = int.Parse(rqmantenimiento.GetDatos("cplantilla").ToString());
            var dlSaldo = JsonConvert.DeserializeObject<List<Saldo>>(rqmantenimiento.Mdatos["Saldos"].ToString());
            buscarSaldosPlantilla(cplantilla, rqmantenimiento, dlSaldo);
            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);

            if (plantillaDetalle == null) {

                throw new AtlasException("TTH-018", "NO SE HA DEFINIDO LA PLANTILLA CONTABLE {0} PARA GENERAR EL COMPROBANTE", cplantilla);
            }

            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, dlSaldo, comprobante, plantillaDetalle);
            decimal total= comprobanteDetalle.Where(x=> x.debito== true).Sum(x => x.monto).Value;
            comprobante.montocomprobante = total;
            
            int sec = 1;
            tthparametros ccatalogo = TthParametrosDal.Find("CATALOGOCCOSTO", rqmantenimiento.Ccompania);

            if (ccatalogo == null || ccatalogo.numero == null)
            {
                throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");

            }
            int ccatalogocentrocosto = 0;
            try
            {
                ccatalogocentrocosto = (int)ccatalogo.numero;
                if (ccatalogocentrocosto == 0)
                {
                    throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");
                }
            }
            catch (Exception ex)
            {
                throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");
            }

            tconplantilla pl = TconPlantillaDal.Find(cplantilla, rqmantenimiento.Ccompania);
            List<tgencatalogodetalle> centrocosto = TgenCatalogoDetalleDal.FindInDataBase(ccatalogocentrocosto).ToList();
            //GENERAR TRANSACIONES DE MOVIMIENTO EN EL MÓDULO
            if (rqmantenimiento.Cmodulotranoriginal==11) {
           
                IList<tnommovimiento> MOVG  = new List<tnommovimiento>();
                foreach (Saldo ccd in dlSaldo) {
                    tnommovimiento mov = new tnommovimiento();
                    mov.Esnuevo = true;
                    mov.Actualizar = false;
                    mov.mensaje = mensaje;
                    mov.particion = Constantes.GetParticion((int)rqmantenimiento.Fconatable);
                    mov.secmensaje = sec++;
                    mov.saldoccatalogo = int.Parse(pl.tipomovimientocdetalle);
                    mov.saldocdetalle = ccd.saldo;
                    mov.centrocostoccatalogo = centrocosto.Find(x => x.cdetalle.Equals(ccd.centroCosto)).ccatalogo;
                    mov.centrocostocdetalle = ccd.centroCosto;
                    mov.ccuenta = plantillaDetalle.Find(x => x.campotablacdetalle.Equals(ccd.saldo)).ccuenta;
                    mov.cclase = TconCatalogoDal.Find(rqmantenimiento.Ccompania, mov.ccuenta).cclase;
                    mov.fcontable = rqmantenimiento.Fconatable;
                    mov.ftrabajo = rqmantenimiento.Ftrabajo.Value;
                    mov.fproceso = rqmantenimiento.Fproceso.Value;
                    mov.fvalor = rqmantenimiento.Freal;
                    mov.ctransaccion = rqmantenimiento.Ctransaccion;
                    mov.ctransaccionorigen = rqmantenimiento.Ctranoriginal;
                    mov.cmoduloorigen = rqmantenimiento.Cmodulotranoriginal;
                    mov.cmodulo = rqmantenimiento.Cmodulo;
                    mov.cmoneda = rqmantenimiento.Cmoneda;
                    mov.montomonedalocal = ccd.valor;
                    mov.monto = ccd.valor;
                    mov.debito = plantillaDetalle.Find(x => x.campotablacdetalle.Equals(ccd.saldo)).debito.Value;
                    mov.csucursal = rqmantenimiento.Csucursal;
                    mov.cagencia = rqmantenimiento.Cagencia;
                    mov.ccompania = rqmantenimiento.Ccompania;
                    mov.cmodulotransaccion = rqmantenimiento.Cmodulotranoriginal;
                    mov.cmonedalocal = rqmantenimiento.Cmoneda;
                    mov.csucursalorigen = rqmantenimiento.Csucursal;
                    mov.cusuario = rqmantenimiento.Cusuario;
                    if(mov.monto>0)
                    MOVG.Add(mov);
                }
                Random rnd = new Random();
                int aleatorio = rnd.Next(1, 99999);
                //rqmantenimiento.AdicionarTabla("tnommovimiento", MOVG, false);
                rqmantenimiento.AdicionarTablaExistente("tnommovimiento", MOVG, false);
            }
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);

        }

        private static void buscarSaldosPlantilla(int cplantilla, RqMantenimiento rm, IList<Saldo> itm)
        {
            List<tconplantilladetalle> pl = TconPlantillaDetalleDal.Find(cplantilla, rm.Ccompania);
            var result = itm.GroupBy(Saldo => Saldo.saldo)
                     .Select(Saldogby => Saldogby.First())
                     .ToList();
            tconplantilla p = TconPlantillaDal.Find(cplantilla, rm.Ccompania);
            int ccatalogo = 0;
            int.TryParse(p.tipomovimientocdetalle, out ccatalogo);

            foreach (Saldo saldo in result) {

                if (pl.Find(x => x.campotablacdetalle == saldo.saldo) == null) {
                    string nombre = TgenCatalogoDetalleDal.Find(ccatalogo,saldo.saldo).nombre;

                    throw new AtlasException("TTH-013", "NO SE HA DEFINIDO EL PARÁMETRO CONTABLE {0} EN LA PLANTILLA: {1}", nombre, cplantilla);
                }
            }
        }
     /*   public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tconcuentaporpagar cxp)
        {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                cxp.ccompania.Value, 0, null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, cxp.comentario, true, true, false, false, false, cxp.ruteopresupuesto, false,
                cxp.cplantilla, 3, 1, 1, 21, 10, 1003, "DIAGEN", 1, 1, 0, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }*/

        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento)
        {
            string comentario = rqmantenimiento.GetDatos("comentario").ToString();
            string tipodocumento = rqmantenimiento.GetDatos("tipodocumento").ToString();
            int cconcepto = int.Parse(rqmantenimiento.GetDatos("cconcepto").ToString());
            int cplantilla = int.Parse(rqmantenimiento.GetDatos("cplantilla").ToString());
            long cpersona = 0;
            if (rqmantenimiento.Mdatos.ContainsKey("cpersona")) {
                cpersona = long.Parse(rqmantenimiento.GetDatos("cpersona").ToString());
            }


            tconplantilla plantilla = TconPlantillaDal.Find(cplantilla, rqmantenimiento.Ccompania);

            tconcomprobante comprobante = new tconcomprobante();
            comprobante.anulado = false;
            comprobante.automatico = true;
            comprobante.cagencia = int.Parse(rqmantenimiento.Cagencia.ToString());
            comprobante.cagenciaingreso = comprobante.cagencia;
            comprobante.csucursal = rqmantenimiento.Csucursal;
            comprobante.ccompania = rqmantenimiento.Ccompania;
            comprobante.actualizosaldo = true;
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, tipodocumento);
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.cmodulo = rqmantenimiento.Cmodulotranoriginal;
            comprobante.cconcepto = plantilla.cconcepto;
            comprobante.cplantilla = plantilla.cplantilla;
            comprobante.comentario = comentario;
            comprobante.csucursalingreso = comprobante.csucursal;
            comprobante.cuadrado = true;
            comprobante.cusuarioing = rqmantenimiento.Cusuario;
            comprobante.eliminado = false;
            comprobante.fcontable = rqmantenimiento.Fconatable;
            comprobante.fingreso = rqmantenimiento.Freal;
            comprobante.optlock = 0;
            comprobante.particion = Constantes.GetParticion((int)rqmantenimiento.Fconatable);
            comprobante.tipodocumentoccatalogo = 1003;
            comprobante.tipodocumentocdetalle = tipodocumento;
            comprobante.ctransaccion = rqmantenimiento.Ctranoriginal;
            comprobante.Esnuevo = true;
            comprobante.ctransaccion = rqmantenimiento.Ctranoriginal;
            if (cpersona > 0) {
                comprobante.tipopersona = "PE";
                comprobante.cpersonarecibido = cpersona;
            }
            return comprobante;
        }

        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, IList<Saldo> saldos,
            tconcomprobante comprobante, List<tconplantilladetalle> plantillaDetalle)
        {
            string ccompromiso="";
            if (rqmantenimiento.Mdatos.ContainsKey("ccompromiso"))
            {
                 ccompromiso = rqmantenimiento.GetDatos("ccompromiso").ToString();
            }
            


            tthparametros ccatalogo = TthParametrosDal.Find("CATALOGOCCOSTO", rqmantenimiento.Ccompania);

            if (ccatalogo == null || ccatalogo.numero==null) {
                throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");

            }
            int ccatalogocentrocosto = 0;
            try
            {
                 ccatalogocentrocosto = (int)ccatalogo.numero;
                if (ccatalogocentrocosto == 0) {
                    throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");
                }
            }
            catch(Exception ex)
            {
                throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "CATALOGOCCOSTO");
            }
           

            decimal valorCampo = 0, sumatorioDebitos = 0, sumatorioCreditos = 0;

            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();
            IList<tgencatalogodetalle> centrocosto = TgenCatalogoDetalleDal.FindInDataBase(ccatalogocentrocosto);
            foreach (tgencatalogodetalle cc in centrocosto)
            {



                //Detalle para base imponible
                foreach (tconplantilladetalle pde in plantillaDetalle)
                {
                    tconcomprobantedetalle cd = new tconcomprobantedetalle();
                    cd.Esnuevo = true;
                    cd.ccomprobante = comprobante.ccomprobante;
                    cd.fcontable = comprobante.fcontable;
                    cd.particion = comprobante.particion;
                    cd.ccompania = comprobante.ccompania;
                    cd.optlock = 0;
                    cd.cagencia = comprobante.cagencia;
                    cd.csucursal = comprobante.csucursal;
                    cd.ccuenta = pde.ccuenta;
                    cd.debito = pde.debito;

                    if (!string.IsNullOrEmpty(pde.cpartida))
                    {
                        if (!pde.cpartida.Trim().Equals(""))
                        {
                            cd.cpartida = pde.cpartida;
                            if (ccompromiso.Equals(""))
                            {
                                throw new AtlasException("TTH-004", "NO SE HA DEFINIDO EL PARAMETRO {0} ", "COMPROMISO NÓMINA AL CONTABILIZAR, REVISE LA PLANTILLA CONTABLE:"+ pde.cplantilla.ToString());
                            }
                            cd.ccompromiso = ccompromiso;
                        }
                    }

                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                    cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                    cd.cusuario = comprobante.cusuarioing;
                    cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    cd.centrocostosccatalogo = cc.ccatalogo;
                    cd.centrocostoscdetalle = cc.cdetalle;
                    valorCampo = Suma(saldos, pde.campotablacdetalle,cc.cdetalle);
                    cd.monto = valorCampo;
                    cd.montooficial = valorCampo;
                    if (cd.monto > 0) comprobanteDetalle.Add(cd);
                    if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                    else sumatorioCreditos += cd.monto.Value;
                }
            }
            if ((sumatorioCreditos) != sumatorioDebitos)
            {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            return comprobanteDetalle;


        }
        public static decimal Suma(IList<Saldo> sal, string cdetallecontable, string centrocostocdetalle)
        {
            decimal total = 0;
            foreach (Saldo ingreso in sal) {
                if (ingreso.saldo.Equals(cdetallecontable) && ingreso.centroCosto.Equals(centrocostocdetalle)) {
                    total = total + ingreso.valor;
                }
            }
            return total;
        }
    }




}

