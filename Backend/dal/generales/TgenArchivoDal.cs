using modelo;
using modelo.helper;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales
{
	/// <summary>
	/// Clase que implementa dml's manuales contra la base de datos del dto TgenArchivoDto.
	/// </summary>
	public class TgenArchivoDal {

		/// <summary>
		/// Crea un registro de TgenArchivo, con la imagen de un archivo.
		/// </summary>
		/// <param name="archivo">Objeto on informacion del archivo.</param>
		/// <param name="carchivo">Codigo de archivo generado.</param>
		/// <returns></returns>
		public static void Crear(Archivo archivo, long carchivo) {
			//tgenarchivo ta = new tgenarchivo();
			//ta.carchivo = carchivo;

			//Sessionef.Save(ta);
			//TgenArchivoDetalleDtoKey key = new TgenArchivoDetalleDtoKey();
			//key.Verreg = 0;
			//key.Carchivo = carchivo;

			tgenarchivo tad = new tgenarchivo();
			tad.verreg = 0;
			tad.carchivo = carchivo;
			tad.archivo = archivo.Archivobytes;
			tad.extension = archivo.Extension;
			tad.tamanio = archivo.Tamanio;
			tad.nombrearchivo = archivo.Nombre;
			tad.tipodecontenido = archivo.TipoContenido;

			Sessionef.Save(tad);
			
		}

		/// <summary>
		/// Actualiza un registro de TgenArchivo, con la imagen de un archivo.
		/// </summary>
		/// <param name="archivo">Objeto que contiene informacion del archivo a actualizar.</param>
		/// <returns></returns>
		public static void Actualizar(Archivo archivo)
		{
			tgenarchivo tad = TgenArchivoDal.FindInDataBase(archivo.Codigo, 0);
			if (tad==null)
			{
				return;
			}
			// para el manejo del versionamiento del registro.
			//IBean boriginal = (IBean)tad.Clone();
			//((AbstractDto) tad).AddDatos("BEANORIGINAL", boriginal);

			tad.archivo = archivo.Archivobytes;
			tad.extension = archivo.Extension;
			tad.tamanio = archivo.Tamanio;
			tad.nombrearchivo = archivo.Nombre;
			tad.tipodecontenido = archivo.TipoContenido;
            tad.cmodulo = null;
			Sessionef.Actualizar(tad);
		}

        /// <summary>
        /// Consulta en la base de datos un objeto de tipo TgenArchivoDto.
        /// </summary>
        /// <param name="carchivo">Codigo de archivo</param>
        /// <returns></returns>
        public static tgenarchivo FindInDataBase(long? carchivo, long verreg)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenarchivo obj = null;

            obj = contexto.tgenarchivo.AsNoTracking().Where(x => x.carchivo == carchivo && x.verreg == verreg).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }


    }
}
