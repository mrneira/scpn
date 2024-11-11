using System;
using System.Linq;
using core.componente;
using modelo;
using util.dto.mantenimiento;
using Newtonsoft.Json;
using util.servicios.ef;
using dal.contabilidad.conciliacionbancaria;
using util;

namespace contabilidad.comp.mantenimiento.conciliacionbancaria.mayor
{
    /// <summary>
    /// Clase que encapsula los procedimientos para el mantenimiento del mayor contable.
    /// </summary>
    public class Grabar : ComponenteMantenimiento
    {

        /// <summary>
        /// Guarda el detalle del mayor contable a conciliar 
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            string lcusuario = ""; //para verificar si cuenta ya ha sido generada
            int fcontable = -100; //para verificar su cuenta ya ha sido generada en esa fecha

            dynamic array = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos.Values.ElementAt(4).ToString());
            long cConciliacionBancariaMayor = TconConciliacionBancariamayorDal.GetcConciliacionBancariaMayor();  //obtiene id

            foreach (var item in array)
            {

                if (fcontable != int.Parse(item.fcontable.Value.ToString()))
                {
                    fcontable = int.Parse(item.fcontable.Value.ToString());
                    lcusuario = TconConciliacionBancariamayorDal.GetcExisteCuentaFecha(fcontable, item.ccuenta.Value);
                    if (lcusuario.Trim().Length > 0)
                    {
                        throw new AtlasException("CONTA-003", "EL MAYOR PARA LA CUENTA CONTABLE {0} CON FECHA {1} YA HA SIDO GENERADO POR {2} ", item.ccuenta.Value, fcontable, lcusuario);
                    }
                }

                tconconciliacionbancariamayor tconConciliacionBancariaMayor = new tconconciliacionbancariamayor();

                tconConciliacionBancariaMayor.cconciliacionbancariamayor = cConciliacionBancariaMayor;
                tconConciliacionBancariaMayor.optlock = 0;
                tconConciliacionBancariaMayor.ccomprobante = item.ccomprobante.Value;
                tconConciliacionBancariaMayor.fcontable = int.Parse(item.fcontable.Value.ToString());
                tconConciliacionBancariaMayor.particion = int.Parse(item.particion.Value.ToString());
                tconConciliacionBancariaMayor.secuencia = int.Parse(item.secuencia.Value.ToString());
                tconConciliacionBancariaMayor.ccompania = int.Parse(item.ccompania.Value.ToString());
                tconConciliacionBancariaMayor.ccuenta = item.ccuenta.Value;
                tconConciliacionBancariaMayor.freal = int.Parse(item.mdatos.nfreal.Value.ToString().Substring(0, 4) + item.mdatos.nfreal.Value.ToString().Substring(4, 2) + item.mdatos.nfreal.Value.ToString().Substring(6, 2));
                tconConciliacionBancariaMayor.debito = item.debito.Value;
                tconConciliacionBancariaMayor.monto = Convert.ToDecimal(item.monto.Value);
                tconConciliacionBancariaMayor.comentario = item.mdatos.ncomentario.Value;
                tconConciliacionBancariaMayor.estadoconciliacionccatalogo = 1020;
                tconConciliacionBancariaMayor.estadoconciliacioncdetalle = "2";
                tconConciliacionBancariaMayor.cusuariocreacion = rqmantenimiento.Cusuario;
                tconConciliacionBancariaMayor.fingreso = DateTime.Now;

                Sessionef.Grabar(tconConciliacionBancariaMayor);
                cConciliacionBancariaMayor++;
            }


        }

    }
}
