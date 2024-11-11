using System;

namespace contabilidad.enums
{
    /// <summary>
    /// Enumeracion que almacena estatus de cartera.
    /// </summary>
    public class EnumContabilidad
    {
        //Conciliacion

        [Serializable]
        public enum EstadoConciliacion
        {
            ING = 1,
            CON = 2
        }

        
    }
}
