using bce.util;
using core.componente;
using core.util.entidad;
using Newtonsoft.Json;
using System.Collections.Generic;
using tesoreria.enums;
using util;
using util.dto.mantenimiento;

namespace tesoreria.comp.mantenimiento.bce.ingresoinformacion
{
    /// <summary>
    /// Metodo que se encarga de completar informacion faltante de clientes. 
    /// </summary>
    /// <author>mjimenez</author>
    public class RegistroPago : ComponenteMantenimiento
    {
        /// <summary>
        /// Registra la transaccion de pago BCE
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm)
        {
            List<EntidadBce> bce = JsonConvert.DeserializeObject<List<EntidadBce>>(rm.Mdatos["GENERARBCE"].ToString());
            foreach (EntidadBce entidad in bce)
            {
                if (entidad.tipotransaccion == EnumTesoreria.PAGO.Cpago)
                {
                    GenerarBce.InsertarPagoBce(rm, entidad.identificacionbeneficiario, entidad.nombrebeneficiario, entidad.numerocuentabeneficiario, entidad.codigobeneficiario, entidad.tipocuentaccatalogo, entidad.tipocuentacdetalle, entidad.institucionccatalogo, entidad.institucioncdetalle, entidad.valorpago, entidad.referenciainterna, entidad.secuenciainterna, null);
                }
                if (entidad.tipotransaccion == EnumTesoreria.COBRO.Cpago)
                {
                    GenerarBce.InsertarCobroBce(rm, entidad.identificacionbeneficiario, entidad.nombrebeneficiario, entidad.numerocuentabeneficiario, entidad.codigobeneficiario, entidad.tipocuentaccatalogo, entidad.tipocuentacdetalle, entidad.institucionccatalogo, entidad.institucioncdetalle, entidad.valorpago, entidad.referenciainterna, entidad.secuenciainterna, entidad.email, entidad.telefono, entidad.numerosuministro);
                }
            }
        }
    }
}
