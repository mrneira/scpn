using core.componente;
using dal.generales;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;

namespace general.comp.consulta
{
    public class Archivo : ComponenteConsulta
    {

        /// <summary>
        /// Metodo que consulta una imagen y la devuelve en Base64
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            if (rqconsulta.GetDatos("carchivo") == null && rqconsulta.GetDatos("carchivos") == null)
            {
                return;
            }
            Boolean inbytes = (Boolean)rqconsulta.GetDatos("inbytes");
            if (rqconsulta.GetDatos("carchivo") != null)
            {
                long? carchivo = rqconsulta.GetLong("carchivo");
                byte[] barchivo = this.ConsultarArchivo(carchivo);
                if (barchivo != null)
                {
                    if (inbytes)
                    {
                        rqconsulta.Response["imagen"] = barchivo;
                    }
                    else
                    {
                        rqconsulta.Response["imagen"] = System.Convert.ToBase64String(barchivo);
                    }
                }
                else
                {
                    rqconsulta.Response["imagen"] = null;
                }
            }
            else if (rqconsulta.GetDatos("carchivos") != null)
            {
                Dictionary<string, object> marchivos = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(rqconsulta.GetDatos("carchivos")));

                string[] keys = new string[marchivos.Keys.Count];
                marchivos.Keys.CopyTo(keys, 0);
                foreach (string key in keys)
                {
                    if (marchivos[key] == null)
                    {
                        continue;
                    }
                    byte[] barchivo = this.ConsultarArchivo((long)marchivos[key]);
                    if (barchivo != null)
                    {
                        if (inbytes)
                        {
                            marchivos[key] = barchivo;
                        }
                        else
                        {
                            marchivos[key] = System.Convert.ToBase64String(barchivo);
                        }
                    }
                    else
                    {
                        marchivos[key] = null;
                    }
                }
                rqconsulta.Response["imagenes"] = marchivos;
            }
        }

        private byte[] ConsultarArchivo(long? carchivo)
        {
            if (carchivo == null)
            {
                return null;
            }
            tgenarchivo  tgenArchivoDetalle = TgenArchivoDal.FindInDataBase(carchivo, 0);

            byte[] barchivo = tgenArchivoDetalle.archivo;
            return barchivo;
        }
    }

}
