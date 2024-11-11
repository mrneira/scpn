using util.servicios.ef;
using modelo;
using System.Collections.Generic;
using modelo.servicios;
using dal.inversiones.contabilizacion;

namespace dal.inversiones.operadorinstitucional
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales de los operadores institucionales.
    /// </summary>
    public class TinvOperadorInstitucionalDal
    {

        private static string DELE = "delete from tinvoperadorinstitucional";

        /// <summary>
        /// Elimina la tabla tinvoperadorinstitucional.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }

        /// <summary>
        /// Busca el operador institucional por institución financiera y nombres del contacto.  En el caso de que no encuentre, inserta un nuevo operador institucional.
        /// </summary>
        /// <param name="inombrescontacto">Nombres del contacto del operador institucional.</param>
        /// <param name="iidentificacion">RUC o número de cédula del contacto.</param>
        /// <param name="idireccion">Dirección del contacto del operador institucional.</param>
        /// <param name="itelefono">Teléfono del contacto del operador institucional.</param>
        /// <param name="icelular">Celular del contacto del operador institucional..</param>
        /// <param name="idireccionelectronica">Correo del contacto del operador institucional..</param>
        /// <param name="ibancoscpncdetalle">Identificador de la institución financiera del operador institucional.</param>
        /// <param name="ilngcinvoperadorinstitucional">Identificador numérico del contacto del operador institucional..</param>
        /// <param name="ibancoscpnccatalogo">Identificador del catálogo del operador institucional.</param>
        /// <param name="icusuarioing">Identificador del usuario que busca o inserta el operador institucional.</param>
        /// <returns>long</returns>
        public static long FindInsertaPornombre(
            string inombrescontacto
            , string iidentificacion
            , string idireccion
            , string itelefono
            , string icelular
            , string idireccionelectronica
            , string ibancoscpncdetalle
            , ref long ilngcinvoperadorinstitucional
            , int ibancoscpnccatalogo = 1224
            , string icusuarioing = "")
        {

            if (ibancoscpncdetalle == "") return 0;
            if (inombrescontacto == "") return 0;

            inombrescontacto = inombrescontacto.ToUpper().Trim();

            long llngcinvoperadorinstitucional = 0;

            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string lSQL = "select cinvoperadorinstitucional from tinvoperadorinstitucional where bancoscpnccatalogo = " +
                ibancoscpnccatalogo.ToString() +
                " and bancoscpncdetalle = '" +
                ibancoscpncdetalle +
                "' and nombrescontacto = '" +
                inombrescontacto +
                "' ";

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);

            IList<Dictionary<string, object>> lista = ch.GetRegistrosDictionary();

            if (lista != null && lista.Count > 0)
            {
                llngcinvoperadorinstitucional = long.Parse(lista[0]["cinvoperadorinstitucional"].ToString());
            }
            else
            {
                llngcinvoperadorinstitucional = ilngcinvoperadorinstitucional;

                contexto.Database.ExecuteSqlCommand(
                    "INSERT INTO tinvoperadorinstitucional (cinvoperadorinstitucional,identificacion,direccion,telefono,celular,direccionelectronica,cusuarioing,fingreso,nombrescontacto,bancoscpnccatalogo,bancoscpncdetalle) SELECT " +
                    llngcinvoperadorinstitucional.ToString() +
                    ", " + TinvContabilizacionDal.strStr(iidentificacion) +
                    ", " + TinvContabilizacionDal.strStr(idireccion) +
                    ", " + TinvContabilizacionDal.strStr(itelefono) +
                    ", " + TinvContabilizacionDal.strStr(icelular) +
                    ", " + TinvContabilizacionDal.strStr(idireccionelectronica) +
                    ", '" + icusuarioing.Trim() +
                    "', GETDATE(), '" +
                    inombrescontacto + "', " +
                    ibancoscpnccatalogo.ToString() + ", '" +
                    ibancoscpncdetalle.Trim() +
                    "'");

                ilngcinvoperadorinstitucional++;

            }

            return llngcinvoperadorinstitucional;

        }



    }
}
