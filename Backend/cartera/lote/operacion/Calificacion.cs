using cartera.datos;
using cartera.enums;
using cartera.saldo;
using dal.cartera;
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.lote.operacion
{
    /// <summary>
    /// Clase que se encarga de ejecutar calificacion de operaciones de cartera.
    /// </summary>
    public class Calificacion : ITareaOperacion
    {

        /// <summary>
        /// Fecha en la que se ejecuta la calificacion.
        /// </summary>
        private int? fcalificacion = null;

        private tcaroperacion tcarOperacion;

        private tcaroperacioncalificacion tcarOperacionCalificacion;

        private Boolean cambiarCalificacion = true;

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            this.fcalificacion = requestoperacion.Fconatble;
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tcarOperacion = operacion.tcaroperacion;
            tcarOperacionCalificacion = TcarOperacionCalificacionDal.Find(tcarOperacion);
            Saldo saldo = new Saldo(operacion, fcalificacion ?? 0);
            this.ValidaRestructurado(saldo);
            // calcula la nueva provision.
            this.CompletaCalificacion(operacion, saldo);
        }


        /// <summary>
        /// Crea historia de calificacion ejecuta el nuevo calculo de acuerdo al porcentaje.
        /// </summary>
        private void CompletaCalificacion(Operacion operacion, Saldo saldo)
        {
            // Boolean persist = false;
            // genera historia de la calificacion de operaciones
            TcarOperacionCalificaHistoriaDal.CreaHistoria(tcarOperacionCalificacion, fcalificacion ?? 0);

            this.FijaDatosAnteriores();

            Decimal monto = Constantes.CERO;
            Decimal saldooperacion = saldo.Capitalporvencer + saldo.Capitalvencido;
            int diasmorosidad = saldo.GetDiasMorosidad();//GetDiasMorosidad360(); // cca homologacion 20210701
            
            bool modDiasMorosidadRestructurado = false;
            if (tcarOperacion.cestadooperacion.Equals("E"))
            {
                int dias_mor_restructurado_ope_negociada = 0;
                //VERIFICA SI UNA OPERACIÓN RESTRUCTURADA A UN NO LLEGA A LA CALIFICACIÓN A-1; SI YA EXISTE UNA CALIFICACIÓN A-1, LA OPERACIÓN SE EMPIEZA A CALIFICAR COMO UNA OPERACIÓN NORMAL 
                if (TcarOperacionCalificacionDal.FindCalA1OpeRest(tcarOperacion) == null)
                {
                    modDiasMorosidadRestructurado = true;
                    //VERIFICAR SI SI LA OPERACIÓN YA FUE CALIFICADA O SE ESTA CREANDO EN ESTE MOMENTO PARA OBTENER LOS DÍAS DE MOROSIDAD CONJ LA QUE SE VA ACREAR ON SE CREO
                    tcaroperacioncalificahistoria calhis = TcarOperacionCalificaHistoriaDal.GetPrimeCalificacion(Int32.Parse(tcarOperacion.coperacion));
                    if (calhis != null)
                    {
                        dias_mor_restructurado_ope_negociada = (int)calhis.diasmorosidad;
                    }
                    else
                    {
                        //Se va a registra por primera vez en tcarOperacionCalificacion de una operación restructurada
                        IList<tcarsolicitudabsorcion> solicitudesabs = TcarSolicitudAbsorcionDal.Find((long)tcarOperacion.csolicitud);
                        //OBTENGO EL TOTAL DE DIAS CON LA QUE SE APERTURÓ UNA OPERACIÓN RESTRUCTURADA
                        foreach (tcarsolicitudabsorcion solab in solicitudesabs)
                        {
                            tcaroperacion opantigua = TcarOperacionDal.FindSinBloqueoAndSinfinalizarProceso(solab.coperacion);
                            if (opantigua != null)
                            {
                                tcaroperacioncalificacion calantigua = TcarOperacionCalificacionDal.FindFromDatabase(opantigua);
                                if (calantigua != null)
                                {
                                    dias_mor_restructurado_ope_negociada = dias_mor_restructurado_ope_negociada + (int)calantigua.diasmorosidad;
                                }
                            }
                        }
                    }
                    //VERIFICAR QUE AYA PAGADO TODOS LOS RUBROS DE 3 CUOTAS CONSECUTIVAS PARA PODER MEJORAR SU CALIFICACIÓN
                    IList<tcaroperacioncuota> cuotas = TcarOperacionCuotaDal.FindCuotasHastaFecha(tcarOperacion.coperacion, (int)this.fcalificacion);
                    int consecutivas = 0;
                    int totalCalificarestar = 0;
                    foreach (tcaroperacioncuota cuo in cuotas)
                    {
                        if (cuo.fpago != null && cuo.fpago >= cuo.finicio && cuo.fpago <= cuo.fvencimiento)
                        {
                            consecutivas = consecutivas + 1;
                            if (consecutivas == 3)
                            {
                                totalCalificarestar = totalCalificarestar + 1;
                                consecutivas = 0;
                            }
                        }
                        else
                        {
                            consecutivas = 0;
                        }
                    }
                    if (totalCalificarestar > 0)
                    {
                        //MEJORAR LA CALIFICCION
                        // SE OBTIENE LA CALIFICACIÓN CON LA QUE FUE O SE VA A CREAR LA OPERAQCIÓN RESTRUCTURADA
                        string auxCal = null;
                        if (tcarOperacion.cmodulo == 7 && tcarOperacion.cproducto == 1 && (tcarOperacion.ctipoproducto == 4 || tcarOperacion.ctipoproducto == 14 || tcarOperacion.ctipoproducto == 23))
                        {
                            auxCal = TcarCalificacionRangosDal.GetCcalificacion("12", dias_mor_restructurado_ope_negociada);
                        }
                        else
                        {
                            auxCal = TcarCalificacionRangosDal.GetCcalificacion(tcarOperacion.csegmento, dias_mor_restructurado_ope_negociada);
                        }
                        //BUSCAR EN QUE POSICIÓN SE ENUENTRA LA CALIFICACIÓN CON LA QUE SE APERTURÓ UNA OPERACIÓN RESTRUCTURADA, PARA POSTERIORMENTE RESTARLE EL totalCalificarestar
                        IList<tcarcalificacionrangos> calrangos = TcarCalificacionRangosDal.Find(tcarOperacion.csegmento);
                        int posnuevacal = 0;
                        for (int i = 0; i < calrangos.Count; i++)
                        {
                            if (calrangos[i].ccalificacion.Equals(auxCal))
                            {
                                posnuevacal = i - totalCalificarestar;
                                if (posnuevacal < 0)
                                {
                                    posnuevacal = 0;
                                }
                                break;
                            }
                        }
                        //ACTUALIZO LOS DÍAS DE MOROSIDAD UNICAMNETE CUANDO EL VALOR DESDE SEA MAYOR A CERO
                        if (calrangos[posnuevacal].diasdesde > 0)
                        {
                            dias_mor_restructurado_ope_negociada = (int)calrangos[posnuevacal].diasdesde;
                        }
                        else
                        {
                            dias_mor_restructurado_ope_negociada = 0;
                        }
                    }
                }
                if (modDiasMorosidadRestructurado)
                {
                    diasmorosidad = diasmorosidad + dias_mor_restructurado_ope_negociada;
                }
            }
            
            string segmentonew = "";
            String ccalificacion;
            if (tcarOperacion.cmodulo == 7 && tcarOperacion.cproducto == 1 && (tcarOperacion.ctipoproducto == 4 || tcarOperacion.ctipoproducto == 14 || tcarOperacion.ctipoproducto == 23))//cca hipotec 20220504
            {
                segmentonew = "12";
                ccalificacion = TcarCalificacionRangosDal.GetCcalificacion(segmentonew, diasmorosidad);
            }
            else
            {
                ccalificacion = TcarCalificacionRangosDal.GetCcalificacion(tcarOperacion.csegmento, diasmorosidad);
            }
            // obtiene la nueva calificacion de acuerdo a los dias de morosidad.
            //String ccalificacion = TcarCalificacionRangosDal.GetCcalificacion(tcarOperacion.csegmento, diasmorosidad);
            tgencalificacion tgenCalificacion = TgenCalificacionDal.Find(ccalificacion);

            if (cambiarCalificacion || tcarOperacionCalificacion.ccalificacion.CompareTo(tgenCalificacion.ccalificacion) < 0 || modDiasMorosidadRestructurado)
            {
                tcarOperacionCalificacion.ccalificacion = tgenCalificacion.ccalificacion;
                tcarOperacionCalificacion.ccalificacionlegal = tgenCalificacion.ccalificacionlegal;
                tcarOperacionCalificacion.porcentajeprovisionreq = tgenCalificacion.provisionminima;
                tcarOperacionCalificacion.porcentajeprovconstituida = tgenCalificacion.provisionconstituida;
                tcarOperacionCalificacion.diasmorosidad = diasmorosidad;
            }

            // Control de calificacion por tipo hipotecario
            tcarproducto producto = TcarProductoDal.Find((int)operacion.tcaroperacion.cmodulo, (int)operacion.tcaroperacion.cproducto, (int)operacion.tcaroperacion.ctipoproducto);
            bool consolidadohipotecario = false;
            if (producto.cmodulo == 7 && producto.cproducto == 1 && (producto.ctipoproducto == 4 || producto.ctipoproducto == 14 || producto.ctipoproducto == 23))
            { //cca homologacion 20210701
                consolidadohipotecario = true;
            }
            if (producto.cproducto.Equals(EnumTipoOperacion.HIPOTECARIO.Cproducto) || (consolidadohipotecario))
            {
                if (tcarOperacionCalificacion.ccalificacion.Equals(EnumCalificacion.A_1.Ccalificacion) ||
                    tcarOperacionCalificacion.ccalificacion.Equals(EnumCalificacion.A_2.Ccalificacion) ||
                    tcarOperacionCalificacion.ccalificacion.Equals(EnumCalificacion.A_3.Ccalificacion) ||
                    tcarOperacionCalificacion.ccalificacion.Equals(EnumCalificacion.B_1.Ccalificacion) ||
                    tcarOperacionCalificacion.ccalificacion.Equals(EnumCalificacion.B_2.Ccalificacion) ||
                    tcarOperacionCalificacion.ccalificacion.Equals(EnumCalificacion.C_1.Ccalificacion))
                {
                    monto = Math.Round(decimal.Divide(saldooperacion, 2), 2, MidpointRounding.AwayFromZero);
                }
            }
            tcarOperacionCalificacion.saldo = saldooperacion;
            tcarOperacionCalificacion.monto = monto;

            // calcula la provison
            this.calcularProvision();
            //if (tcarOperacionCalificacion.fcalificacion == null) {
            //    persist = true;
            //}
            // la fecha de calificacion tiqne que ir aqui ya que la fecha anterior se necesita para validaciones
            if (tcarOperacionCalificacion.fcalificacion != 0)
            {
                TcarOperacionCalificacionDal.Delete(tcarOperacionCalificacion.coperacion);
            }
            tcarOperacionCalificacion.fcalificacion = this.fcalificacion ?? 0;
            //if (persist) {
            Sessionef.Grabar(tcarOperacionCalificacion);
            //}
        }

        /// <summary>
        /// Fija datos de la provision anterior.
        /// </summary>
        private void FijaDatosAnteriores()
        {
            // fija datos anteriores
            if (tcarOperacionCalificacion.fcalificacion == 0 || tcarOperacionCalificacion.fcalificacion.CompareTo(fcalificacion) == 0)
            {
                // para poder ejecutar el proceso n veces en el dia
                return;
            }
            tcarOperacionCalificacion.ccalificacionlegalanterior = tcarOperacionCalificacion.ccalificacionlegal;
            tcarOperacionCalificacion.ccalificacionanterior = tcarOperacionCalificacion.ccalificacion;
            tcarOperacionCalificacion.porcentajeprovisionreqant = tcarOperacionCalificacion.porcentajeprovisionreq;
            tcarOperacionCalificacion.porcentajeprovconstituidaant = tcarOperacionCalificacion.porcentajeprovconstituida;
            tcarOperacionCalificacion.provisionrequeridaant = tcarOperacionCalificacion.provisionrequerida;
            tcarOperacionCalificacion.provisionconstituidaant = tcarOperacionCalificacion.provisionconstituida;
        }

        /// <summary>
        /// Calcula el valor de la nueva provision.
        /// </summary>
        private void calcularProvision()
        {
            Decimal provisionreq = Decimal.Zero;
            Decimal provisionconstituida = Decimal.Zero;
            if (tcarOperacionCalificacion.porcentajeprovisionreq > Decimal.Zero)
            {
                decimal montorequerida = tcarOperacionCalificacion.monto.Value == Constantes.CERO ? tcarOperacionCalificacion.saldo.Value : tcarOperacionCalificacion.monto.Value;
                provisionreq = Decimal.Multiply(montorequerida, tcarOperacionCalificacion.porcentajeprovisionreq ?? 0);
                provisionreq = Math.Round(Decimal.Divide(provisionreq, Constantes.CIEN), TgenMonedaDal.GetDecimales(tcarOperacion.cmoneda), MidpointRounding.AwayFromZero);
            }
            if (tcarOperacionCalificacion.porcentajeprovconstituida > Decimal.Zero)
            {
                decimal montoconstituida = tcarOperacionCalificacion.monto.Value == Constantes.CERO ? tcarOperacionCalificacion.saldo.Value : tcarOperacionCalificacion.monto.Value;
                provisionconstituida = Decimal.Multiply(montoconstituida, tcarOperacionCalificacion.porcentajeprovconstituida ?? 0);
                provisionconstituida = Math.Round(Decimal.Divide(provisionconstituida, Constantes.CIEN), TgenMonedaDal.GetDecimales(tcarOperacion.cmoneda), MidpointRounding.AwayFromZero);
            }
            tcarOperacionCalificacion.provisionconstituida = provisionconstituida;
            tcarOperacionCalificacion.provisionrequerida = provisionreq;
            tcarOperacionCalificacion.contabilizaprovision = false;
            tcarOperacionCalificacion.reversoprovanterior = false;
        }

        /// <summary>
        /// Metodo que valida si un credito restructurado puede retornar a una calificacion menor.
        /// </summary>
        private void ValidaRestructurado(Saldo saldo)
        {
            // si no es una operacion restructurada retorna true
            if (!tcarOperacion.cestadooperacion.Equals("E"))
            {
                return;
            }
            if (saldo.GetPrimracuotaFutura().numcuota <= 0)
            {
                cambiarCalificacion = false;
            }
        }
    }
}
