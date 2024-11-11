using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.garantias {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgarOperacionTransaccion.
    /// </summary>
    public class TgarOperacionTransaccionDal {

        /// <summary>
        /// Crea un objeto TgarOperacionTransaccion, y lo inserta en la base de datos.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="coperacion"></param>
        /// <param name="fcontable"></param>
        /// <param name="ftrabajo"></param>
        /// <param name="monto"></param>
        public static void Crear(RqMantenimiento rqmantenimiento, string coperacion, int fcontable, int ftrabajo, decimal monto)
        {
            tgaroperaciontransaccion trans = new tgaroperaciontransaccion();
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
            Sessionef.Save(trans);
        }

        /// <summary>
        /// Marca la transaccion como reversada
        /// </summary>
        /// <param name="mensajereverso">Numero de mensaje de reverso.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        public static void Reverso(string mensajereverso, string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgaroperaciontransaccion obj = contexto.tgaroperaciontransaccion.Where(x => x.mensaje == mensajereverso && x.coperacion == coperacion).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BCAR-0011", "TRANSACCION A REVERSAR NO EXISTE EN :{0} ", typeof(tgaroperaciontransaccion).Name);
            }
            obj.reverso = "Y";
        }

    }
}
