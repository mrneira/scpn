using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.presupuesto
{
   public class TpptCertificacionDal
    {
        public static void Completar(RqMantenimiento rqmantenimiento, tpptcertificacion cabecera)
        {
            if (cabecera.cusuarioing.Equals(""))
            {
                cabecera.cusuarioing = (string)rqmantenimiento.Cusuario;
                cabecera.fingreso = (DateTime)rqmantenimiento.Freal;
            }
            else
            {
                cabecera.cusuariomod = (string)rqmantenimiento.Cusuario;
                cabecera.fmodificacion = (DateTime)rqmantenimiento.Freal;
            }
        }

        public static void Eliminar(RqMantenimiento rqmantenimiento, tpptcertificacion compromiso)
        {
            compromiso = FindCertificacion(compromiso.ccertificacion);
            compromiso.eliminado = true;
            compromiso.cusuariomod = rqmantenimiento.Cusuario;
            compromiso.fmodificacion = rqmantenimiento.Freal;
            rqmantenimiento.Actualizar = true;
            rqmantenimiento.Mtablas["CABECERA"] = null;
            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tpptcertificacion", compromiso, false);
        }
        /// <summary>
        /// Entrega cabecera de un compromiso.
        /// </summary>
        /// <param name="ccertificacion">Numero de certificación.</param>
        /// <returns>tpptcertificacion</returns>
        public static tpptcertificacion FindCertificacion(string ccertificacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpptcertificacion obj = null;
            obj = contexto.tpptcertificacion.Where(x => x.ccertificacion == ccertificacion).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

    }
}
