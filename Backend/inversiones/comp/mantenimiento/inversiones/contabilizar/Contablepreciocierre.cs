using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.contabilidad;
using dal.generales;
using dal.monetario;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace inversiones.comp.mantenimiento.inversiones.contabilizar
{
    public class Contablepreciocierre : ComponenteMantenimiento

    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"])
            {
                return;
            }
            string mensaje = Mantenimiento.GetMensaje(rqmantenimiento.Cusuario);
            //VALIDAR MDATOS
            ContabilizarCierre(rqmantenimiento, mensaje);

        }

        public static void ContabilizarCierre(RqMantenimiento rqmantenimiento, string mensaje)
        {

            var dlSaldo = JsonConvert.DeserializeObject<IList<tinvcontabilizacion>>(rqmantenimiento.Mdatos["saldos"].ToString());
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, dlSaldo, comprobante);
            decimal total = comprobanteDetalle.Where(x => x.debito == true).Sum(x => x.monto).Value;
            comprobante.montocomprobante = total;

           

            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);

        }
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, IList<tinvcontabilizacion> saldos,
            tconcomprobante comprobante)
        {

            //GENERACIÓN DE DATOS A CONTABILIZAR
            tconparametros pr = TconParametrosDal.FindXCodigo("CENTROCOSTOS_DEFAULT", rqmantenimiento.Ccompania);
            if (pr == null ) {
                
                throw new AtlasException("INV-001", "NO SE HA PARAMETRIZADO EL CENTRO DE COSTOS POR DEFECTO: {0}", "CENTROCOSTOS_DEFAULT");

            }
            string centrocosto = pr.texto;
            decimal valorCampo = 0, sumatorioDebitos = 0, sumatorioCreditos = 0;

            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            foreach (tinvcontabilizacion tivc in saldos)
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
                cd.ccuenta = tivc.ccuenta;
                cd.debito = tivc.debito;


                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.centrocostosccatalogo = 1002;


                cd.centrocostoscdetalle = centrocosto;
                valorCampo = tivc.valor.Value;
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                if (cd.monto > 0) comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }
                
            ///--VALIDACIÓN MONTO
            if ((sumatorioCreditos) != sumatorioDebitos)
            {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            return comprobanteDetalle;


        }
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento)
        {
            string comentario = rqmantenimiento.GetDatos("comentario").ToString();
            string tipodocumento = rqmantenimiento.GetDatos("tipodocumento").ToString();
            int cconcepto = int.Parse(rqmantenimiento.GetDatos("cconcepto").ToString());
            //tconplantilla plantilla = TconPlantillaDal.Find(cplantilla, rqmantenimiento.Ccompania);

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
            comprobante.cmodulo = rqmantenimiento.Cmodulo;
            comprobante.cconcepto = cconcepto;
          //  comprobante.cplantilla = plantilla.cplantilla;
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
            return comprobante;
        }

    }
}
