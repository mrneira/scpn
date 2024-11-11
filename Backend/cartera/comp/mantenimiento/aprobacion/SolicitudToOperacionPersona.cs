using cartera.datos;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using dal.generales;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.enums;
using util.thread;
namespace cartera.comp.mantenimiento.aprobacion {

	/// <summary>
	/// Clase que pasa los datos personas asociadas a una solicitud de credito a personas asociadas a una operacion de cartera.
	/// </summary>
	public class SolicitudToOperacionPersona : ComponenteMantenimiento {

		/// <summary>
		/// Transforma datos de personas solicitud a datos de operacion personas.
		/// </summary>
		/// <param name="rqmantenimiento"></param>
		public override void Ejecutar(RqMantenimiento rqmantenimiento) {
			IList<tcarsolicitudpersona> lsolpersona = TcarSolicitudPersonaDal.Find(long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString()), (int)rqmantenimiento.Ccompania);
			// Transforma a tasas de la operacion.
			List<tcaroperacionpersona> lpersona = TcarSolicitudPersonaDal.ToTcarOperacionPersona(lsolpersona, rqmantenimiento.Coperacion);
			if(lpersona.Count <= 0) {
				return;
			}
			// Adiciona datos a Tabla para que haga el commit de los objetos al final.
			rqmantenimiento.AdicionarTabla("TCAROPERACIONPERSONA", lpersona, false);
	}
}
}
