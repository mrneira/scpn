using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.contabilidad.conciliacionbancaria
{

    /// <summary>
    /// Clase que de manejar la tabla tconlibrobancos.
    /// </summary>
    public class TconLibroBancosDal
    {

        /// <summary>
        /// Crea y almacena en la base de datos un registro de libro bancos.
        /// </summary>
        /// <param name="cuentabanco">Numero de cuenta corriente que la institucion mantiene en el sistema financiero.</param>
        /// <param name="fcontable">Fecha contable.</param>
        /// <param name="ccomprobante">Numero de comprobante contable, si tiene permite nulos.</param>
        /// <param name="cmodulo">Modulo del cual se origina la creacion del registro.</param>
        /// <param name="ctransaccion">Codigo de transaccion.</param>
        /// <param name="montodebito">Monto debitos.</param>
        /// <param name="montocredito">Monto creditos.</param>
        /// <param name="documento">Numero de documento, del banco origen.</param>
        public static tconlibrobancos Crear(string cuentabanco, int fcontable, string ccomprobante, int cmodulo, int ctransaccion, decimal montodebito, decimal montocredito, string documento, string operacion = "", string formapago = "")
        {
            tconlibrobancos lb = new tconlibrobancos
            {
                cuentabanco = cuentabanco,
                fcontable = fcontable,
                ccomprobante = ccomprobante,
                cmodulo = cmodulo,
                ctransaccion = ctransaccion,
                montodebito = montodebito,
                montocredito = montocredito,
                documento = documento,
                conciliado = false,
                freal = DateTime.Now,
                operacion = operacion, //RRO 20230130
                formapago = formapago
            };
            Sessionef.Save(lb);

            return lb;
        }


        //public static tconlibrobancos Crear(string cuentabanco, int fcontable, string ccomprobante, int cmodulo, int ctransaccion, decimal montodebito, decimal montocredito, string documento, string operacion = "") {
        //    tconlibrobancos lb = new tconlibrobancos {
        //        cuentabanco = cuentabanco,
        //        fcontable = fcontable,
        //        ccomprobante = ccomprobante,
        //        cmodulo = cmodulo,
        //        ctransaccion = ctransaccion,
        //        montodebito = montodebito,
        //        montocredito = montocredito,
        //        documento = documento,
        //        conciliado = false,
        //        freal = DateTime.Now ,
        //        operacion = operacion
        //    };
        //    Sessionef.Save(lb);

        //    return lb;
        //}

        /// <summary>
        /// Consulta la no existencia de registros en el libro Bancos.
        /// </summary>
        /// <param name="cuentabanco">Numero de cuenta corriente que la institucion mantiene en el sistema financiero.</param>
        /// <param name="ccomprobante">Numero de comprobante contable, si tiene permite nulos.</param>
        /// <param name="cmodulo">Modulo del cual se origina la creacion del registro.</param>
        /// <param name="ctransaccion">Codigo de transaccion.</param>
        /// <param name="documento">Numero de documento, del banco origen.</param>
        public static tconlibrobancos FindByParameters(string cuentabanco, int cmodulo, int ctransaccion, string documento)
        {


            tconlibrobancos obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancos.Where(x => x.cuentabanco == cuentabanco
                                                            && x.cmodulo == cmodulo
                                                            && x.ctransaccion == ctransaccion
                                                            && x.documento == documento).SingleOrDefault();
            return obj;
        }


        /// <summary>
        /// Consulta la no existencia de registros en el libro Bancos.
        /// </summary>
        /// <param name="clibrobanco">Numero de cuenta corriente que la institucion mantiene en el sistema financiero.</param>
        /// <param name="documento">Numero de documento, del banco origen.</param>
        public static tconlibrobancos FindLibro(long clibrobanco, string documento)
        {

            tconlibrobancos obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancos.Where(x => x.clibrobanco == clibrobanco && x.documento == documento).SingleOrDefault();
            return obj;
        }

        public static tconlibrobancos FindLibroComprobante(long clibrobanco, string comprobante)
        {

            tconlibrobancos obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            //  obj = contexto.tconlibrobancos.Where(x => x.clibrobanco == clibrobanco).SingleOrDefault();


            /*
              var studentName = ctx.Students.SqlQuery("Select studentid, studentname, standardId from Student where studentname='Bill'").FirstOrDefault<Student>();
}   
             */

            obj = contexto.tconlibrobancos.SqlQuery("select * from tconlibrobancos where clibrobanco = " + clibrobanco + " and ccomprobante = '" + comprobante + "'").SingleOrDefault();
            return obj;
        }


        /// <summary>
        /// Consulta la existencia de registros en la libro bancos entre un rango de fechas que no esten conciliados.
        /// </summary>
        /// <param name="ccuentabanco">Numero de cuenta corriente que la institucion mantiene en el sistema financiero.</param>
        /// <param name="finicio">fecha inicio.</param>
        /// <param name="ffin">fecha fin.</param>
        public static List<tconlibrobancos> Find(string ccuentabanco, int finicio, int ffin)
        {
            List<tconlibrobancos> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancos.Where(x => x.cuentabanco == ccuentabanco
                                                            && x.fcontable >= finicio
                                                            && x.fcontable <= ffin
                                                            && x.conciliado != true).ToList();

            return obj;
        }



        public static List<tconlibrobancos> ConsultaComprobanteRestante(string ccuentabanco, int ffin)
        {
            List<tconlibrobancos> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            DateTime oPrimerDiaDelMes = new DateTime(Convert.ToInt16(ffin.ToString().Substring(0, 4)), Convert.ToInt16(ffin.ToString().Substring(4, 2)), 1);
            DateTime oUltimoDiaDelMes = (oPrimerDiaDelMes.AddMonths(1).AddDays(-1));
            long longUltimodiames = Convert.ToInt32(oUltimoDiaDelMes.ToString("yyyyMMdd"));
            obj = contexto.tconlibrobancos.Where(x => x.cuentabanco == ccuentabanco
                                                            && x.fcontable > ffin
                                                            && x.fcontable <= longUltimodiames
                                                            // && string.IsNullOrEmpty(x.ccomprobante) == false
                                                            && x.conciliado != true).ToList();
            return obj;
        }

        public static List<tconlibrobancos> Find2(string ccuentabanco, int finicio, int ffin)
        {
            List<tconlibrobancos> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancos.Where(x => x.cuentabanco == ccuentabanco
                                                            && x.fcontable >= finicio
                                                            && x.fcontable <= ffin
                                                            && x.conciliado != true
                                                            && x.ccomprobante != null).ToList();
            return obj;
        }

        /// <summary>
        /// Consulta los saldos de la libro bancos, mayor a una fecha y por cuenta.
        /// </summary>
        /// <param name="ccuentabanco">Numero de cuenta corriente que la institucion mantiene en el sistema financiero.</param>
        /// <param name="finicio">fecha inicio.</param>
        public static List<tconlibrobancos> libroSaldo(string ccuentabanco, int finicio)
        {
            List<tconlibrobancos> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancos.Where(x => x.cuentabanco == ccuentabanco && x.fcontable > finicio).ToList();
            return obj;
        }

        /// <summary>
        /// Consulta la existencia de registros en la libro bancos entre un rango de fechas que no esten conciliados.
        /// </summary>
        /// <param name="ccuentabanco">Numero de cuenta corriente que la institucion mantiene en el sistema financiero.</param>
        public static List<tconlibrobancos> FindAjuste(string documento)
        {
            List<tconlibrobancos> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancos.Where(x => x.documento == documento
                                                      && x.ajustelibro == false
                                                      && x.conciliado == false).ToList();
            return obj;
        }

        /// <summary>
        /// Consulta la existencia de registros para extraer el modulo.
        /// </summary>
        /// <param name="ccuentabanco">Numero de cuenta corriente que la institucion mantiene en el sistema financiero.</param>
        public static tconlibrobancos FindModulo(long clibro, string documento)
        {
            tconlibrobancos obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancos.Where(x => x.clibrobanco == clibro && x.documento == documento
                                                      && x.ajustelibro == false
                                                      && x.conciliado == false).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Consulta por id libro banco
        /// </summary>
        /// <param name="clibro"></param>
        /// <param name="documento"></param>
        /// <returns></returns>
        public static tconlibrobancos FindLibroBanco(long clibro)
        {
            tconlibrobancos obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancos.Where(x => x.clibrobanco == clibro).SingleOrDefault();
            return obj;
        }


        /// <summary>
        /// Actualiza el comprobante en librobanco desde ttesrecaudaciondetalle
        /// </summary>
        /// <param name="cuentabanco"></param>
        /// <param name="finicio"></param>
        /// <param name="fffin"></param>
        /// <returns></returns>
        public static int ActualizarComprobante(string cuentabanco, int finicio, int fffin)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = "UPDATE li SET li.ccomprobante = rec.ccomprobante " +
                            "FROM tconlibrobancos AS li " +
                            "INNER JOIN ttesrecaudaciondetalle AS rec ON li.documento = convert(varchar(30), rec.numerodocumento) " +
                            "WHERE li.fcontable = rec.fcontable and li.montodebito = rec.valorprocesado and rec.valorprocesado " +
                            "is not null and rec.ccomprobante is not null and li.ccomprobante is null and li.documento is not null " +
                            "and li.cuentabanco = '" + cuentabanco + "' and li.fcontable >= '" + finicio.ToString() + "' and li.fcontable <= '" + fffin.ToString() + "' " +
                            "and li.clibrobanco not in ( " +
                            "select distinct(li2.clibrobanco) " +
                            "from tconlibrobancos li2 " +
                            "inner join tconcomprobantedetalle cd on cd.numerodocumentobancario = li2.documento " +
                            "where li2.cuentabanco = '" + cuentabanco + "' and li2.fcontable >= '" + finicio.ToString() + "' and li2.fcontable <= '" + fffin.ToString() + "' " +
                            "and li2.ccomprobante is null and cd.centrocostoscdetalle = 'CCPC')";

                return contexto.Database.ExecuteSqlCommand(lSQL);
            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }
        }


        public static int ActualizarCampoAxiliar(long clibrobanco, string documentoAux)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = "update tconlibrobancos SET conciliaaux = '" + documentoAux + "' where clibrobanco = " + clibrobanco.ToString() + ";";
                return contexto.Database.ExecuteSqlCommand(lSQL);
            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }
        }

        public static int ActualizarConciliacionLibroBanco(long clibrobanco)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = "UPDATE tconlibrobancos SET conciliado = 1 where clibrobanco = " + clibrobanco.ToString() + " and conciliado = 0;";
                return contexto.Database.ExecuteSqlCommand(lSQL);
            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }
        }

        public static int ActualizarAjusteLibroBanco(long clibrobanco)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = "UPDATE tconlibrobancos SET ajustelibro = 1 where clibrobanco = " + clibrobanco.ToString() + " and ajustelibro = 0;";
                return contexto.Database.ExecuteSqlCommand(lSQL);
            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }
        }


        /// <summary>
        /// Consulta por: cuentabanco, fcontable, documento, montodebito
        /// </summary>
        /// <param name="cuentabanco"></param>
        /// <param name="fcontable"></param>
        /// <param name="documento"></param>
        /// <param name="montodebito"></param>
        /// <returns></returns>
        public static tconlibrobancos FindLibroBancoParametros(string cuentabanco, int fcontable, string documento, decimal montodebito)
        {
            tconlibrobancos obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancos.Where(x => x.cuentabanco == cuentabanco && x.fcontable == fcontable && x.montodebito == montodebito && (x.documento == documento || x.documentohist == documento)).SingleOrDefault();
            return obj;
        }

    }

}
