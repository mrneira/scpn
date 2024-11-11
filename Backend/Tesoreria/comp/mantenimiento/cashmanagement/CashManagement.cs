using core.componente;
using System.Collections.Generic;
using util.dto.mantenimiento;
using modelo;
using System;
using System.Threading;
using System.Globalization;
using util;
using dal.tesoreria;
using tesoreria.enums;
using tesoreria.archivo.generacion;
using System.Linq;

namespace tesoreria.comp.mantenimiento.cashmanagement
{
    /// <summary>
    /// Clase que se encarga de completar información de la capacidad de pago s
    /// </summary>
    public class CashManagement : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (rm.GetTabla("GENERACASH") == null)
            {
                return;
            }
            List<ttesrecaudacion> ldatos = rm.GetTabla("GENERACASH").Lregistros.Cast<ttesrecaudacion>().ToList();

            switch (rm.Mdatos["cargaarchivo"].ToString())
            {
                case "insertar":
                    if (TtesRecaudacionDal.ValidarLoteCobroGenerado(ldatos[0].fcontable))
                    {
                        throw new AtlasException("CAR-0063", "NO SE PUEDE GENERAR ARCHIVO DE COBRO, YA EXISTE UN ARCHIVO PARA LA FECHA ACTUAL");
                    }
                    break;

                case "generar":

                    List<ttesrecaudaciondetalle> ltotal = new List<ttesrecaudaciondetalle>();
                    foreach (ttesrecaudacion recaudacion in ldatos)
                    {
                        List<ttesrecaudaciondetalle> lcobrospendientes = TtesRecaudacionDetalleDal.FindByCodigoCabecera(recaudacion.crecaudacion);
                        foreach (ttesrecaudaciondetalle item in lcobrospendientes)
                        {
                            ltotal.Add(item);
                        }
                        TtesRecaudacionDetalleDal.AutorizarPagosMasivoPk(((int)EnumTesoreria.EstadoRecaudacionCash.Generado).ToString(), recaudacion.crecaudacion);
                    }
                    rm.Response["archivogenerado"] = EnvioCashManagement.GenerarArchivoCashManagement(ltotal, rm);
                    List<ttesrecaudacion> recuada = new List<ttesrecaudacion>();
                    foreach (ttesrecaudacion recaudacion in ldatos)
                    {
                        recaudacion.cestado = ((int)EnumTesoreria.EstadoRecaudacionCash.Generado).ToString();
                        recaudacion.cusuariogenera = rm.Cusuario;
                        recaudacion.fgenera = rm.Freal;
                        recaudacion.Esnuevo = false;
                        recaudacion.Actualizar = true;
                        recaudacion.fgeneracion = rm.Fproceso;
                        recuada.Add(recaudacion);
                    }
                    
                    rm.AdicionarTabla("ttesrecaudacion", recuada, false);
                    rm.Response["cargaarchivo"] = "descargar";
                    break;
            }
        }
    }
}
