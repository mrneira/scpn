using util.servicios.ef;
using modelo;
using System.Collections.Generic;
using modelo.servicios;
using dal.inversiones.contabilizacion;

namespace dal.inversiones.agentebolsa
{
    /// <summary>
    /// Clase que encapsula los procedimientos para ejecutar las operaciones con los operadores de bolsa.
    /// </summary>
    public class TinvAgenteBolsaDal
    {

        private static string DELE = "delete from tinvagentebolsa";

        /// <summary>
        /// Elimna tabla tinvagentebolsa.
        /// </summary>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }

        /// <summary>
        /// Busca agente de bolsa por nombres. En el caso de no encontrarlo, lo inserta.
        /// </summary>
        /// <param name="inombrescontacto">Nombres del contacto.</param>
        /// <param name="iidentificacion">RUC o número de cédula del contacto.</param>
        /// <param name="idireccion">Dirección de trabajo del contacto.</param>
        /// <param name="itelefono01">Teléfono del contacto.</param>
        /// <param name="direccionelectronica01">Correo del contacto.</param>
        /// <param name="icasavalorescdetalle">Identificador de la casa de valores.</param>
        /// <param name="ilngcinvagentebolsa">Identificador del agente del bolsa.</param>
        /// <param name="iccatalogo">Identificador del catálogo para la casa de valores.</param>
        /// <param name="icusuarioing">Identificador del usuario.</param>
        /// <returns>long</returns>
        public static long FindInsertaAgenteBolsaPornombres(
            string inombrescontacto
            , string iidentificacion
            , string idireccion
            , string itelefono01
            , string direccionelectronica01
            , string icasavalorescdetalle
            , ref long ilngcinvagentebolsa
            , int iccatalogo = 1217
            , string icusuarioing = "")
        {

            if (icasavalorescdetalle == "") return 0;

            inombrescontacto = inombrescontacto.ToUpper().Trim();

            long llngcinvagentebolsa = 0;

            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string lSQL = "select cinvagentebolsa from tinvagentebolsa where casavaloresccatalogo = " +
                iccatalogo.ToString() +
                " and casavalorescdetalle = '" + 
                icasavalorescdetalle +
                "' and nombrescontacto = '" +
                inombrescontacto +
                "' ";

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> lista = ch.GetRegistrosDictionary();

            if (lista != null && lista.Count > 0)
            {
                llngcinvagentebolsa = long.Parse(lista[0]["cinvagentebolsa"].ToString());
            }
            else
            {
                llngcinvagentebolsa = ilngcinvagentebolsa;

                contexto.Database.ExecuteSqlCommand(
                    "INSERT INTO dbo.tinvagentebolsa (cinvagentebolsa,identificacion,direccion,telefono01,direccionelectronica01,cusuarioing,fingreso,nombrescontacto,casavaloresccatalogo,casavalorescdetalle) SELECT " + 
                    llngcinvagentebolsa.ToString() + 
                    ", " + TinvContabilizacionDal.strStr(iidentificacion) +
                    ", " + TinvContabilizacionDal.strStr(idireccion) +
                    ", " + TinvContabilizacionDal.strStr(itelefono01) +
                    ", " + TinvContabilizacionDal.strStr(direccionelectronica01) +
                    ", '" + icusuarioing.Trim() + 
                    "', GETDATE(), '" + 
                    inombrescontacto + "', " + 
                    iccatalogo.ToString() + ", '" +
                    icasavalorescdetalle.Trim() +
                    "'");

                ilngcinvagentebolsa++;

            }

            return llngcinvagentebolsa;

        }



    }
}
