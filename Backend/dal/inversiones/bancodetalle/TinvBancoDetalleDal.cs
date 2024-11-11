using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;
using dal.inversiones.catalogos;
using modelo.servicios;
using util;
using dal.inversiones.contabilizacion;

namespace dal.inversiones.bancodetalle
{
    /// <summary>
    /// Clase que encapsula los procedimientos para ejecutar las operaciones con las instituciones financieras.
    /// </summary>
    public class TinvBancoDetalleDal
    {

        private static string SQL_BANCO_DETALLE = "SELECT tgendet.* FROM tinvbancodetalle AS tbandet INNER JOIN tgencatalogodetalle AS tgendet ON tbandet.bancoccatalogo = tgendet.ccatalogo AND tbandet.bancocdetalle = tgendet.cdetalle WHERE (tgendet.ccatalogo = 305) and len(rtrim(ltrim(isnull(tbandet.cuentabancariabce,'')))) > 0 ORDER BY tgendet.nombre";
        /// <summary>
        /// Obtiene el catálogo de bancos
        /// </summary>
        /// <returns></returns>
        public static List<tgencatalogodetalle> Find()
        {
            List<tgencatalogodetalle> ldata = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldata = contexto.Database.SqlQuery<tgencatalogodetalle>(SQL_BANCO_DETALLE).ToList();
            return ldata;
        }


        /// <summary>
        /// Elimna los bancos.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAll()
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                "delete from tinvbancodetalle");
        }

        /// <summary>
        /// Busca una entidad financiera por nombre. En el caso de no encontrarla, la inserta.
        /// </summary>
        /// <param name="inombrebanco">Nombre del banco.</param>
        /// <param name="icbancodetalle">Identificador del banco.</param>
        /// <param name="icusuarioing">Identificador del usuario de ingresos.</param>
        /// <param name="inombrescontacto1">Nombres del primer contacto.</param>
        /// <param name="icargocontacto1">Cargo de trabajo del primer contacto.</param>
        /// <param name="idireccioncontacto1">Dirección de trabajo del primer contacto.</param>
        /// <param name="itelefonocontacto1">Teléfono del primer contacto.</param>
        /// <param name="icelularcontacto1">Número de celular del primer contacto.</param>
        /// <param name="icorreocontacto1">Correo del primer contacto.</param>
        /// <param name="ifaxcontacto1">Número de fax del primer contacto.</param>
        /// <param name="inombrescontacto2">Nombres del segundo contacto.</param>
        /// <param name="icargocontacto2">Cargo de trabajo del segundo contacto.</param>
        /// <param name="idireccioncontacto2">Dirección de trabajo del segundo contacto.</param>
        /// <param name="itelefonocontacto2">Teléfono del segundo contacto.</param>
        /// <param name="icelularcontacto2">Número de celular del segundo contacto.</param>
        /// <param name="icorreocontacto2">Correo del segundo contacto.</param>
        /// <param name="ifaxcontacto2">Número de fax del segundo contacto.</param>
        /// <param name="icuentabancariabce">Número cuenta bancaria del Banco Central.</param>
        /// <returns>long</returns>
        public static long FindInsertPorNombreBDD(
            string inombrebanco, 
            ref long icbancodetalle, 
            string icusuarioing,
            string inombrescontacto1 = "",
            string icargocontacto1 = "",
            string idireccioncontacto1 = "",
            string itelefonocontacto1 = "",
            string icelularcontacto1 = "",
            string icorreocontacto1 = "",
            string ifaxcontacto1 = "",
            string inombrescontacto2 = "",
            string icargocontacto2 = "",
            string idireccioncontacto2 = "",
            string itelefonocontacto2 = "",
            string icelularcontacto2 = "",
            string icorreocontacto2 = "",
            string ifaxcontacto2 = "",
            string icuentabancariabce = "")
        {

            inombrebanco = inombrebanco.Trim().ToUpper();

            long lcbancodetalle = FindPorNombresCatalogoDetBDD(inombrebanco);

            if (lcbancodetalle == 0)
            {

                string lstrNombreBanco = inombrebanco;

                switch (inombrebanco)
                {

                    //**'BANCO PRODUBANCO'

                    case "BANCO PRODUBANCO":
                        lstrNombreBanco = "BANCO DE LA PRODUCCION";
                        break;


                    case "BANCO GUAYAQUIL":
                        lstrNombreBanco = "BANCO DE GUAYAQUIL";
                        break;
                            

                    case "BANCO PACIFICO":
                        lstrNombreBanco = "BANCO DEL PACIFICO";
                        break;
                    case "BANCO RUMIÑAHUI":
                        lstrNombreBanco = "BANCO GENERAL RUMINAHUI";
                        break;
                    case "BANCO DINERS CLUB DEL ECUADOR":
                        lstrNombreBanco = "FINANCIERA - DINERS CLUB DEL ECUADOR S A";
                        break;
                    case "BANCO LOJA":
                        lstrNombreBanco = "BANCO DE LOJA";
                        break;
                    case "COOP COOPROGRESO":
                        lstrNombreBanco = "COOPERATIVA DE AHORRO PROGRESO";
                        break;

                }

                string lcdetalle = TinvCatalogoDetalleDal.FindPorNombre(305, lstrNombreBanco);

                if (lcdetalle == "")
                {
                    throw new AtlasException("INV-0010",
                            "ERROR: {0}", "NO EXISTE REGISTRADA LA ENTIDAD FINANCIERA '" +
                            inombrebanco +
                            "' EN EL MÓDULO DE TESORERÍA (CATÁLOGO 305).  PROCESO CANCELADO!!");
                }
                else
                {
                    AtlasContexto contexto = new AtlasContexto();
                    contexto = Sessionef.GetAtlasContexto();

                    contexto.Database.ExecuteSqlCommand(
                        "INSERT INTO tinvbancodetalle (cbancodetalle,bancoccatalogo,bancocdetalle,nombrescontacto1,cargocontacto1,direccioncontacto1,telefonocontacto1,celularcontacto1,correocontacto1,faxcontacto1,nombrescontacto2,cargocontacto2,direccioncontacto2,telefonocontacto2,celularcontacto2,correocontacto2,faxcontacto2,cuentabancariabce,cusuarioing,fingreso) SELECT " +
                        icbancodetalle.ToString() + 
                        ",305,'" + 
                        lcdetalle + 
                        "'," + 
                        TinvContabilizacionDal.strStr(inombrescontacto1) + "," +
                        TinvContabilizacionDal.strStr(icargocontacto1) + "," +
                        TinvContabilizacionDal.strStr(idireccioncontacto1) + "," +
                        TinvContabilizacionDal.strStr(itelefonocontacto1) + "," +
                        TinvContabilizacionDal.strStr(icelularcontacto1) + "," +
                        TinvContabilizacionDal.strStr(icorreocontacto1) + "," +
                        TinvContabilizacionDal.strStr(ifaxcontacto1) + "," +
                        TinvContabilizacionDal.strStr(inombrescontacto2) + "," +
                        TinvContabilizacionDal.strStr(icargocontacto2) + "," +
                        TinvContabilizacionDal.strStr(idireccioncontacto2) + "," +
                        TinvContabilizacionDal.strStr(itelefonocontacto2) + "," +
                        TinvContabilizacionDal.strStr(icelularcontacto2) + "," +
                        TinvContabilizacionDal.strStr(icorreocontacto2) + "," +
                        TinvContabilizacionDal.strStr(ifaxcontacto2) + "," +
                        TinvContabilizacionDal.strStr(icuentabancariabce) + "," +
                        TinvContabilizacionDal.strStr(icusuarioing) + ", GETDATE()");

                    lcbancodetalle = icbancodetalle;

                    icbancodetalle++;

                }

            }

            return lcbancodetalle;
        }

        /// <summary>
        /// Busca una entidad financiera por nombre.
        /// </summary>
        /// <param name="nombre">Nombre del banco.</param>
        /// <returns>long</returns>
        public static long FindPorNombresCatalogoDetBDD(string nombre)
        {

            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string lSQL = "SELECT bandet.cbancodetalle FROM dbo.tinvbancodetalle AS bandet INNER JOIN dbo.tgencatalogodetalle AS catdet ON bandet.bancoccatalogo = catdet.ccatalogo AND bandet.bancocdetalle = catdet.cdetalle WHERE(catdet.nombre = '" + 
                nombre.Trim().ToUpper() + 
                "') AND (catdet.ccatalogo = 305)";

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> lista = ch.GetRegistrosDictionary();

            if (lista != null && lista.Count > 0)
            {
                return long.Parse(lista[0]["cbancodetalle"].ToString());
            }
            else
            {
                return 0;
            }

        }

        /// <summary>
        /// Obtener el identificador de una entidad financiera por nombre.
        /// </summary>
        /// <param name="nombre">Nombre del banco.</param>
        /// <returns>string</returns>
        public static string ObtenerCDetallePorNombresBDD(string nombre)
        {

            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string lSQL = "SELECT bandet.bancocdetalle FROM dbo.tinvbancodetalle AS bandet INNER JOIN dbo.tgencatalogodetalle AS catdet ON bandet.bancoccatalogo = catdet.ccatalogo AND bandet.bancocdetalle = catdet.cdetalle WHERE(catdet.nombre = '" +
                nombre.Trim().ToUpper() +
                "') AND (catdet.ccatalogo = 305)";

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> lista = ch.GetRegistrosDictionary();

            if (lista != null && lista.Count > 0)
            {
                return lista[0]["bancocdetalle"].ToString();
            }
            else
            {
                return "";
            }

        }


    }
}
