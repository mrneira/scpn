using core.componente;
using System.Collections.Generic;
using util.dto.mantenimiento;
using System.Threading;
using System.Globalization;
using inversiones.comp.mantenimiento.archivo.generacion;

namespace inversiones.comp.mantenimiento.estructurasg
{
    /// <summary>
    /// Clase que se encarga de completar información de la capacidad de pago s
    /// </summary>
    public class EstructurasGenerar : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (!rm.Mdatos.ContainsKey("tipoEstructura"))
            {
                return;
            }
            string tipoEstructura = rm.Mdatos["tipoEstructura"].ToString();
            string[] storesConsulta = new string[2];
            storesConsulta[0] = rm.Mdatos["spcabecera"].ToString();
            storesConsulta[1] = rm.Mdatos["spdetalle"].ToString();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            switch (rm.Mdatos["tipoEstructura"].ToString())
            {
                case "g01":
                    rm.Response["archivogenerado"] = EstructuraG.GenerarEstructurasInversion(storesConsulta, parametros, tipoEstructura, rm);
                    rm.Response["cargaarchivo"] = "descargar";
                    break;

                case "g02":
                    int fcorte = int.Parse(rm.Mdatos["fcorte"].ToString());
                    parametros["@fcorte"] = fcorte;
                    rm.Response["archivogenerado"] = EstructuraG.GenerarEstructurasInversion(storesConsulta, parametros, tipoEstructura, rm);
                    rm.Response["cargaarchivo"] = "descargar";
                    break;
            }
        }
    }
}
