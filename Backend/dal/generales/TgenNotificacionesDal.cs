using modelo;
using modelo.helper;
using System;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales
{

	/// <summary>
	/// Clase que ejecuta dml manuales de la tabla TbpmTareas.
	/// </summary>
	public class TgenNotificacionDal
	{

		/// <summary>
		/// Entrega la definicion de una notificacion bpm, dado un codigo de mensaje.
		/// </summary>
		/// <param name="cmensaje">Codigo de notificacion.</param>
		/// <returns></returns>
		public static tgennotificacion Find(int cmensaje)
		{

			AtlasContexto contexto = Sessionef.GetAtlasContexto();
			tgennotificacion obj = null;

            obj = contexto.tgennotificacion.AsNoTracking().Where(x => x.cmensaje.Equals(cmensaje)).SingleOrDefault();
            if (obj == null)
            {
                throw new AtlasException("BGEN-022", "MENSAJE DE NOTIFICACIÓN NO DEFINIDO EN TGENNOTIFICACIONES CMENSAJE: {0}", cmensaje);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
		}

	}
}
