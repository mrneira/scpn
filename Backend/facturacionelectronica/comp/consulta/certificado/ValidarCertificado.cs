using core.componente;
using dal.generales;
using modelo;
using System;
using util.dto.consulta;
using File = System.IO.File;
using System.Security.Cryptography.X509Certificates;
using System.Globalization;
using dal.facturacionelectronica;
using System.IO;

namespace facturacionelectronica.comp.consulta.certificado
{

    public class ValidarCertificado : ComponenteConsulta {

        /// <summary>
        /// Metodo que valida la clave del certificado
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string valida = "OK";
            string fechaInicio = string.Empty;
            string fechaFin = string.Empty;
            tcelinfoempresa informacionEmpresa = new tcelinfoempresa();
            informacionEmpresa = TcelInfoEmpresaDal.GetTcelinfoempresa();
            string path = "";
            string narchivo = "";
            string archivo = "";
            string extension = "";
            tgenparametros param = TgenParametrosDal.Find("UBICACION_FIRMA", rqconsulta.Ccompania);
            path = param.texto;
            narchivo = (string)rqconsulta.Mdatos["nombrecertificado"];
            archivo = (string)rqconsulta.Mdatos["firma"];
            extension = (string)rqconsulta.Mdatos["extension"];
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            path = path + narchivo+extension;

            try
            {
                File.WriteAllBytes(path, Convert.FromBase64String(archivo));
                X509Certificate2 x509 = new X509Certificate2();
                byte[] rawData = File.ReadAllBytes(path);

                x509.Import(rawData, rqconsulta.Mdatos["clave"].ToString(), X509KeyStorageFlags.PersistKeySet);

                fechaInicio = x509.NotBefore.ToString("yyyy/MM/dd HH:mm:ss", CultureInfo.CreateSpecificCulture("es-PE"));
                fechaFin = x509.NotAfter.ToString("yyyy/MM/dd HH:mm:ss", CultureInfo.CreateSpecificCulture("es-PE"));
            }
            catch (Exception ex)
            {
                valida = "KO";
            }
            if (File.Exists(path))
            {
                File.Delete(path);
            }
            rqconsulta.Response["esvalida"] = valida;
            rqconsulta.Response["fechaInicio"] = fechaInicio;
            rqconsulta.Response["fechaFin"] = fechaFin;
        }

    }
}
