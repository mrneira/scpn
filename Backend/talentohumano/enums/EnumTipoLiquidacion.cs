using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.enums
{
    public class EnumTipoLiquidacion
    {

        //EN CÓDIGO LEGAL 0
        public static readonly EnumTipoLiquidacion IPDESHAUCIO = new EnumTipoLiquidacion("IDE");
        public static readonly EnumTipoLiquidacion IPDESPIDOINTEMPESTIVO = new EnumTipoLiquidacion("IDI");
        public static readonly EnumTipoLiquidacion MUJEREMBARAZADA = new EnumTipoLiquidacion("IME");
        public static readonly EnumTipoLiquidacion ENFERMEDADNOPROFESIONAL = new EnumTipoLiquidacion("IENP");
        public static readonly EnumTipoLiquidacion ENFERMEDADPROFESIONAL = new EnumTipoLiquidacion("IEP");
        public static readonly EnumTipoLiquidacion INCAPACIDADPERMANENTE = new EnumTipoLiquidacion("IIP");
        public static readonly EnumTipoLiquidacion DISMINUCIONPERMANENTE = new EnumTipoLiquidacion("IDP");
        public static readonly EnumTipoLiquidacion MUERTEACCIDENTETRABAJO = new EnumTipoLiquidacion("IMA");
        public static readonly EnumTipoLiquidacion DIRIGENTESINDICAL = new EnumTipoLiquidacion("IDS");
        
       
        


        /// <summary>
        /// Codigo de tipo de liquidación en nomina.
        /// </summary>
        private String valor;

        /// <summary>
        /// Entrega o fija el valor de: tipo de liquidación
        /// </summary>
        public string Value { get => valor; set => valor = value; }

        /// <summary>
        /// Crea una instancia de tipo de liquidación.
        /// </summary>
        /// <param name="valor">Codigo de tipo de liquidación en nomina.</param>
        private EnumTipoLiquidacion(String valor)
        {
            this.Value = valor;
        }
    }
}
