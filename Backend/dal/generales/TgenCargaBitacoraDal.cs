using modelo;
using modelo.helper;
using System;
using System.Linq;
using util.servicios.ef;

namespace dal.generales
{
    public  class TgenCargaBitacoraDal
    {
        //mgeneral.TgenCargaBitacoraDto

        /// <summary>
        /// Busca en la base y entrega un registro de tipo TgenCargaBitacora 
        /// </summary>
        /// <param name="fproceso"></param>
        /// <param name="ctipoarchivo"></param>
        /// <param name="numeroejecucion"></param>
        /// <returns></returns>
        public static tgencargabitacora Find(int fproceso, int cmodulo, int ctipoarchivo, int numeroejecucion, int idproceso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencargabitacora bitacora = null;

            bitacora = contexto.tgencargabitacora.AsNoTracking().Where(x =>  x.ctipoarchivo == ctipoarchivo
                                                                         && x.cmodulo == cmodulo
                                                                         && x.numeroejecucion == numeroejecucion 
                                                                         && x.idproceso==idproceso).SingleOrDefault();
            if (bitacora == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(bitacora);
            return bitacora;
        }

        /// <summary>
        /// Metodo para crear la clase botacora
        /// </summary>
        /// <param name="fproceso">Fecha en la que se realizó el proceso</param>
        /// <param name="ctipoarchivo">Tipo de Archivo Procesado </param>
        /// <param name="numeroejecucion">Número de Ejecución, para esa fecha y ese tipo de archivo</param>
        /// <returns></returns>
        public static tgencargabitacora Crear(int fproceso, int cmodulo, int ctipoarchivo, int numeroejecucion,int idproceso)
        {
            tgencargabitacora obj = new tgencargabitacora();
            obj.idproceso = idproceso;
            obj.fproceso = fproceso;
            obj.cmodulo = cmodulo;
            obj.ctipoarchivo = ctipoarchivo;
            obj.numeroejecucion = numeroejecucion;
            obj.finicio =  DateTime.Now;
            obj.totalerror = 0;
            obj.totalexisto = 0;
            obj.totalregistros = 0;
            return obj;
        }
      
    }
}