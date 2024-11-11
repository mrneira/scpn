using System;

namespace util.dto.mantenimiento {

    /// <summary>
    /// Clase de transporte de rubros de transacciones monetarias utilizadas en el cliente.
    /// </summary>
    public class DtoRubro {

        /// <summary>
        /// Codigo de rubro asociado a una transaccion monetaria.
        /// </summary>
        private int rubro;
        /// <summary>
        /// Nombre del rubro a presentar en la pagina.
        /// </summary>
        private String nombre;
        /// <summary>
        /// Valor asociado al rubro.
        /// </summary>
        private decimal monto;
        /// <summary>
        /// 1 Indica que se desabilita el rubro en pantalla, 0 o null no se desabilita.
        /// </summary>
        private int desabilitar = 1;
        /// <summary>
        /// Codigo de saldo
        /// </summary>
        private string csaldo;

        /// <summary>
        /// Crea una instancia de DtoRubro.
        /// </summary>
        public DtoRubro()
        {
        }


        public virtual object Clone()
        {
            DtoRubro obj = (DtoRubro)this.MemberwiseClone();
            return obj;
        }

        [Newtonsoft.Json.JsonProperty(PropertyName = "rubro")]
        public int Rubro { get => rubro; set => rubro = value; }

        [Newtonsoft.Json.JsonProperty(PropertyName = "nombre")]
        public string Nombre { get => nombre; set => nombre = value; }

        [Newtonsoft.Json.JsonProperty(PropertyName = "monto")]
        public decimal Monto { get => monto; set => monto = value; }

        [Newtonsoft.Json.JsonProperty(PropertyName = "desabilitar")]
        public int Desabilitar { get => desabilitar; set => desabilitar = value; }

        [Newtonsoft.Json.JsonProperty(PropertyName = "csaldo")]
        public string Csaldo { get => csaldo; set => csaldo = value; }

    }
}
