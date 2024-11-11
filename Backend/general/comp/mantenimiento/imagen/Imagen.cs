using core.componente;
using core.servicios;
using dal.generales;
using dal.persona;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using Newtonsoft.Json;

namespace general.comp.mantenimiento.imagen {
	/// <summary>
	/// Clase que se encarga de grabar en la base de datos la imagen de un archivo.
	/// </summary>
	/// <author>amerchan</author>
	public class Imagen : ComponenteMantenimiento {

		/// <summary>
		/// Metodo que registra archivos y devuelve los codigos generados
		/// </summary>
		/// <param name="rqmantenimiento"></param>
		public override void Ejecutar(RqMantenimiento rqmantenimiento) {
			if (rqmantenimiento.GetDatos("MARCHIVOS") == null && rqmantenimiento.GetDatos("MARCHIVOSNG") == null) {
				return;
			}
			Dictionary<string, long?> mrespuesta = new Dictionary<string, long?>();

			if (rqmantenimiento.GetDatos("MARCHIVOS") != null) {
				mrespuesta = this.ProcesaMarchivos(rqmantenimiento);
			} else if (rqmantenimiento.GetDatos("MARCHIVOSNG") != null) {
				mrespuesta = this.ProcesaMarchivosNg(rqmantenimiento);
			}
			rqmantenimiento.AddDatos("MARCHIVOSCODE", mrespuesta);
			rqmantenimiento.Response["MARCHIVOSCODE"] = mrespuesta;
		}

		private Dictionary<string, long?> ProcesaMarchivos(RqMantenimiento rqmantenimiento) {
			Dictionary<string, long?> mrespuesta = new Dictionary<string, long?>();
			Dictionary<string, Archivo> marchivo = (Dictionary<string, Archivo>)rqmantenimiento.GetDatos("MARCHIVOS");
			foreach (String codigo in marchivo.Keys) {
				Archivo a = marchivo[codigo];
				if (a.Archivobytes == null) {
					continue;
				}
				if (a.Codigo == null) {
					// inserta una imagen.
					long carchivo = Secuencia.GetProximovalor("ARCHIVO");
					a.Codigo = carchivo;
					TgenArchivoDal.Crear(a, carchivo);
				} else {
					TgenArchivoDal.Actualizar(a);
				}
				mrespuesta[codigo] = a.Codigo;
			}
			return mrespuesta;
		}

		private Dictionary<string, long?> ProcesaMarchivosNg(RqMantenimiento rqmantenimiento) {
			Dictionary<string, long?> mrespuesta = new Dictionary<string, long?>();
			Dictionary<string, object> marchivo = JsonConvert.DeserializeObject<Dictionary<string, object>>(JsonConvert.SerializeObject(rqmantenimiento.GetDatos("MARCHIVOSNG")));

			//Dictionary<string, object> marchivo = (Dictionary<string, object>)rqmantenimiento.GetDatos("MARCHIVOSNG");
			foreach (String codigo in marchivo.Keys) {
				Archivo a = JsonConvert.DeserializeObject<Archivo>(JsonConvert.SerializeObject(marchivo[codigo]));
				if (a.Archivobytes == null) {
					continue;
				}
				if (a.Codigo == null) {
					// inserta una imagen.
					long carchivo = Secuencia.GetProximovalor("ARCHIVO");
					a.Codigo = carchivo;
					TgenArchivoDal.Crear(a, carchivo);
				} else {
					TgenArchivoDal.Actualizar(a);
				}
				mrespuesta[codigo] = a.Codigo;
			}
			return mrespuesta;
		}

	}
}
