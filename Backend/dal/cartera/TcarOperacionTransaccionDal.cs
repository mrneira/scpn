using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionTransaccionDto.
    /// </summary>
    public class TcarOperacionTransaccionDal {

        /// <summary>
        /// Crea un objeto TcarOperacionTransaccionDto, y lo inserta en la base de datos.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="fcontable">Fecha contable en la que se ejecuta la transaccion.</param>
        /// <param name="ftrabajo">Fecha de trabajo en la que se ejecuta la transaccion.</param>
        /// <param name="monto">Monto total con el que se afecta la transaccion.</param>
        public static void Crear(RqMantenimiento rqmantenimiento, string coperacion, int fcontable, int ftrabajo, decimal monto)
        {
            tcaroperaciontransaccion trans = new tcaroperaciontransaccion();
            trans.mensaje = rqmantenimiento.Mensaje;
            trans.coperacion = coperacion;
            trans.particion = Constantes.GetParticion(fcontable);
            trans.fcontable = fcontable;
            trans.ftrabajo = ftrabajo;
            trans.ccompania = rqmantenimiento.Ccompania;
            trans.cmodulo = rqmantenimiento.Cmodulotranoriginal;
            trans.ctransaccion = rqmantenimiento.Ctranoriginal;
            trans.cusuario = rqmantenimiento.Cusuario;
            trans.freal = rqmantenimiento.Freal;
            trans.reverso = "N";
            trans.monto = monto;
            trans.documento = rqmantenimiento.Documento;
            Sessionef.Save(trans);
        }

        /// <summary>
        /// Metodo que entrega una lista de movimientos de recuperacion .
        /// </summary>
        /// <param name="coperacion">Numero de operacion asociado al numero de mensaje a reversar.</param>
        /// <returns></returns>
        public static IList<tcaroperaciontransaccion> FindRecuperacion(string coperacion)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperaciontransaccion> lmovi = contexto.tcaroperaciontransaccion.Where(x => x.reverso.Equals("N") && x.coperacion == coperacion && (x.ctransaccion == 1 || x.ctransaccion == 2)).ToList();
            if (lmovi.Count == 0) {
                throw new AtlasException("CAR-0051", "NO EXSTE REGISTROS DE RECUPERACIÓN EN COPERACION: {0}", coperacion);
            }
            return lmovi;

        }
        /// <summary>
        /// Metodo que entrega una lista de movimientos de recuperacion .
        /// </summary>
        /// <param name="coperacion">Numero de operacion asociado al numero de mensaje a reversar.</param>
        /// <returns></returns>
        public static IList<tcaroperaciontransaccion> FindCancelacion(string coperacion)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcaroperaciontransaccion> lmovi = contexto.tcaroperaciontransaccion.Where(x => x.coperacion == coperacion && x.reverso.Equals("N") && (x.ctransaccion == 3)).ToList();
            if (lmovi.Count == 0) {
                throw new AtlasException("CAR-0052", "NO EXSTE REGISTROS DE CANCELACIÓN EN COPERACION: {0}", coperacion);
            }
            return lmovi;

        }

        /// <summary>
        /// Marca la transaccion como reversada
        /// </summary>
        /// <param name="mensajereverso">Numero de mensaje de reverso.</param>
        public static void Reverso(string mensajereverso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperaciontransaccion obj = contexto.tcaroperaciontransaccion.Where(x => x.mensaje == mensajereverso).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BCAR-0011", "TRANSACCION A REVERSAR NO EXISTE EN :{0} ", typeof(tcaroperaciontransaccion).Name);
            }
            obj.reverso = "Y";
        }

        /// <summary>
        /// Marca la transaccion como reversada
        /// </summary>
        /// <param name="mensajereverso">Numero de mensaje de reverso.</param>
        public static void Reverso(string coperacion, string mensajereverso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperaciontransaccion obj = contexto.tcaroperaciontransaccion.Where(x => x.coperacion == coperacion && x.mensaje == mensajereverso).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BCAR-0011", "TRANSACCION A REVERSAR NO EXISTE EN :{0} ", typeof(tcaroperaciontransaccion).Name);
            }
            obj.reverso = "Y";
        }

        /// <summary>
        /// Consulta el número de documento por operación
        /// </summary>
        /// <param name="coperacion">Número de operación.</param>
        /// <param name="documento">Número de documento de transacción.</param>
        public static tcaroperaciontransaccion FindDocumento(string coperacion, string documento)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperaciontransaccion obj = contexto.tcaroperaciontransaccion.Where(x => x.coperacion == coperacion && x.documento == documento && x.reverso == "N").SingleOrDefault();
            return obj;
        }

        private static String SQL_CAP = "select isnull(sum(r.monto),0) " +
                                        "from   tcaroperaciontransaccion t, tcaroperaciontransaccionrubro r, tmonsaldo s " +
                                        "where  t.mensaje    = r.mensaje " +
                                        "and    t.coperacion = r.coperacion " +
                                        "and    r.csaldo     = s.csaldo " +
                                        "and    s.ctiposaldo = 'CAP' " +
                                        "and    t.reverso    = 'N' " +
                                        "and    t.coperacion = @coperacion";

        /// <summary>
        /// Metodo que retorna el valor pagado de capital de una operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns></returns>
        public static decimal FindCapitalCobrado(string coperacion)
        {
            decimal capitalcobrado = 0;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            capitalcobrado = contexto.Database.SqlQuery<decimal>(SQL_CAP, new SqlParameter("@coperacion", coperacion)).SingleOrDefault(); ;
            return capitalcobrado;
        }
    }

}
