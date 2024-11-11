using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.generales;
using dal.monetario;
using dal.talentohumano;
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

namespace prestaciones.comp.mantenimiento.contabilidad
{
    public class contabilizar : ComponenteMantenimiento
    {
        public static tconcomprobante comprobante;
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"])
            {
                return;
            }
            //VALIDAR MDATOS
            Contabilizar(rqmantenimiento);

        }

        public static void Contabilizar(RqMantenimiento rqmantenimiento)
        {
            int cplantilla = int.Parse(rqmantenimiento.GetDatos("cplantilla").ToString());
            var dlSaldo = JsonConvert.DeserializeObject<List<Saldo>>(rqmantenimiento.Mdatos["Saldos"].ToString());
            buscarSaldosPlantilla(cplantilla, rqmantenimiento, dlSaldo);
            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);

            if (plantillaDetalle == null)
            {

                throw new AtlasException("TTH-018", "NO SE HA DEFINIDO LA PLANTILLA CONTABLE {0} PARA GENERAR EL COMPROBANTE", cplantilla);
            }

            comprobante = CompletarComprobante(rqmantenimiento);

            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, dlSaldo, comprobante, plantillaDetalle);

            rqmantenimiento.Mdatos.Add("ccomprobante", comprobante.ccomprobante);
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("TCONCOMPROBANTE", comprobante, false);
            rqmantenimiento.AdicionarTabla("TCONCOMPROBANTEDETALLE", comprobanteDetalle, false);

        }
        private static void buscarSaldosPlantilla(int cplantilla, RqMantenimiento rm, IList<Saldo> itm)
        {
            List<tconplantilladetalle> pl = TconPlantillaDetalleDal.Find(cplantilla, rm.Ccompania);
            var result = itm.GroupBy(Saldo => Saldo.saldo)
                     .Select(Saldogby => Saldogby.First())
                     .ToList();

            foreach (Saldo saldo in result)
            {

                if (pl.Find(x => x.campotablacdetalle == saldo.saldo) == null)
                {
                    throw new AtlasException("TTH-013", "NO SE HA DEFINIDO EL PARÁMETRO CONTABLE {0} EN LA PLANTILLA: {1}", saldo.saldo, cplantilla);
                }
            }
        }
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento)
        {
            string comentario = rqmantenimiento.GetDatos("comentario").ToString();
            string tipodocumento = rqmantenimiento.GetDatos("tipodocumento").ToString();
            int cconcepto = int.Parse(rqmantenimiento.GetDatos("cconcepto").ToString());
            string TIPO = rqmantenimiento.GetString("cdetallejerarquia");
            int cplantilla = int.Parse(rqmantenimiento.GetDatos("cplantilla").ToString());
            long cpersona = long.Parse(rqmantenimiento.Mdatos["cpersona"].ToString());
            bool ruteopresupuesto = true;
            bool aprobadopresupuesto = false;


            int intBaja = 0;

            if (rqmantenimiento.Mdatos.ContainsKey("intBaja"))
            {
                intBaja = int.Parse(rqmantenimiento.GetDatos("intBaja").ToString());
                if (intBaja >= 2019) //CCA 20230323 atar compromisos desde 2019 no solo año vigente
                {
                    aprobadopresupuesto = false; // cambio para no pasar a presupesto
                }
                else
                {
                    if (TIPO.Equals("DEV") || TIPO.Equals("DEH"))
                    {
                        aprobadopresupuesto = false; // cambio para no pasar a presupesto
                    }
                    else
                    {
                        ruteopresupuesto = false;
                        aprobadopresupuesto = true; // cambio para no pasar a presupesto
                    }
                }
            }
            else
            {
                ruteopresupuesto = false;
                aprobadopresupuesto = true;
            }

            if (rqmantenimiento.Mdatos.ContainsKey("cdetalletipoexp") && rqmantenimiento.GetDatos("cdetalletipoexp").ToString() == "ANT")
            {
                ruteopresupuesto = false;
                aprobadopresupuesto = true;
            }




            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(Secuencia.GetProximovalor("COMPROBANTE").ToString()
                                                                             , rqmantenimiento.Fconatable
                                                                             , Constantes.GetParticion((int)rqmantenimiento.Fconatable)
                                                                             , rqmantenimiento.Ccompania
                                                                             , 0
                                                                             , "PE"
                                                                             , cpersona
                                                                             , null
                                                                             , rqmantenimiento.Freal
                                                                             , rqmantenimiento.Fproceso
                                                                             , comentario
                                                                             , true
                                                                             , true
                                                                             , false
                                                                             , false
                                                                             , false
                                                                             , ruteopresupuesto
                                                                             , aprobadopresupuesto
                                                                             , cplantilla
                                                                             , cconcepto
                                                                             , int.Parse(rqmantenimiento.Cagencia.ToString())
                                                                             , rqmantenimiento.Csucursal
                                                                             , rqmantenimiento.Ctranoriginal
                                                                             , rqmantenimiento.Cmodulo
                                                                             , 1003
                                                                             , tipodocumento
                                                                             , int.Parse(rqmantenimiento.Cagencia.ToString())
                                                                             , rqmantenimiento.Csucursal
                                                                             , null
                                                                             , SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, tipodocumento)
                                                                             , null
                                                                             , null
                                                                             , null
                                                                             , null
                                                                             , null
                                                                             , null
                                                                             , null
                                                                             , rqmantenimiento.Freal
                                                                             , rqmantenimiento.Cusuario
                                                                             , rqmantenimiento.Freal);
            //comprobante.anulado = false;
            //comprobante.automatico = true;
            // comprobante.cagencia = int.Parse(rqmantenimiento.Cagencia.ToString());
            // comprobante.cagenciaingreso = comprobante.cagencia;
            // comprobante.csucursal = rqmantenimiento.Csucursal;
            // comprobante.ccompania = rqmantenimiento.Ccompania;
            //MAYORIZADO
            //comprobante.actualizosaldo = false;
            // comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            //comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, tipodocumento);
            // comprobante.freal = rqmantenimiento.Freal;
            // comprobante.fproceso = rqmantenimiento.Fproceso;
            // comprobante.cmodulo = rqmantenimiento.Cmodulo;
            //comprobante.cconcepto = cconcepto;


            //comprobante.comentario = comentario;
            //int cplantilla = int.Parse(rqmantenimiento.GetDatos("cplantilla").ToString());
            //comprobante.cplantilla = cplantilla;
            // comprobante.csucursalingreso = comprobante.csucursal;
            //comprobante.cuadrado = true;

            comprobante.cusuarioing = TconParametrosDal.FindXCodigo("CUSUARIOPRESTACIONES", rqmantenimiento.Ccompania).texto;
            //comprobante.eliminado = false;
            if (rqmantenimiento.Mdatos.ContainsKey("mayorizaraporte"))
            {
                comprobante.cuadrado = true;
                comprobante.actualizosaldo = true;
            }
            // comprobante.fcontable = rqmantenimiento.Fconatable;
            // comprobante.fingreso = rqmantenimiento.Freal;
            // comprobante.optlock = 0;
            //  comprobante.particion = Constantes.GetParticion((int)rqmantenimiento.Fconatable);
            //comprobante.tipodocumentoccatalogo = 1003;
            // comprobante.tipodocumentocdetalle = tipodocumento;
            // comprobante.ctransaccion = rqmantenimiento.Ctranoriginal;
            if (rqmantenimiento.Mdatos.ContainsKey("numerodocumentobancario"))
            {
                comprobante.numerodocumentobancario = rqmantenimiento.GetDatos("numerodocumentobancario").ToString();
            }
            comprobante.Esnuevo = true;
            return comprobante;
        }

        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, IList<Saldo> saldos,
            tconcomprobante comprobante, List<tconplantilladetalle> plantillaDetalle)
        {

            decimal valorCampo = 0, sumatorioDebitos = 0, sumatorioCreditos = 0;

            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

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
                cd.cpartida = pde.cpartida;

                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.centrocostosccatalogo = pde.centrocostosccatalogo;
                cd.centrocostoscdetalle = pde.centrocostoscdetalle;
                valorCampo = Suma(saldos, pde.campotablacdetalle);
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                if (cd.monto > 0) comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }
            if ((sumatorioCreditos) != sumatorioDebitos)
            {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            comprobante.montocomprobante = decimal.Round(sumatorioCreditos, 2);
            return comprobanteDetalle;


        }
        public static decimal Suma(IList<Saldo> sal, string cdetallecontable)
        {
            decimal total = 0;
            foreach (Saldo ingreso in sal)
            {
                if (ingreso.saldo.Equals(cdetallecontable))
                {
                    total = total + ingreso.valor;
                }
            }
            return total;
        }
    }
}
