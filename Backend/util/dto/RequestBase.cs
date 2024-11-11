using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace util.dto {
    public class RequestBase : AbstractDto {
        
        /// <summary>
        /// Numero de mensaje que se asocia a una transaccion.
        /// </summary>
        private string mensaje;
        /// <summary>
        /// Codigo de compania en la cual esta ejecutando transacciones el usuario.
        /// </summary>
        private int ccompania;
        /// <summary>
        /// Codigo de usuario que ejecuta una transaccion.
        /// </summary>
        private string cusuario;
        /// <summary>
        /// Codigo de usuario que ejecuta una transaccion.
        /// </summary>
        private string cusuariobancalinea;
        /// <summary>
        /// Idioma preferido del usuario.
        /// </summary>
        private string cidioma;
        /// <summary>
        /// Perfil del Usuario.
        /// </summary>
        private int crol;
        /// <summary>
        /// Codigo del modulo al que pertenece la transaccion.
        /// </summary>
        private int cmodulo;
        /// <summary>
        /// Codigo de transaccion a ejecutar.
        /// </summary>
        private int ctransaccion;
        /// <summary>
        /// Codigo de terminal asociado al ip de la maquina desde la cual se ejecuta una transaccion.
        /// </summary>
        private string cterminal;
        /// <summary>
        /// Codigo de cterminalremoto asociado al ip publica o privada desde la cual sale la ejecucion de una transaccion.
        /// </summary>
        private string cterminalremoto;
        /// <summary>
        /// Codigo de canal desde el cual se ejecuta una transaccion.
        /// </summary>
        private string ccanal;
        /// <summary>
        /// Codigo de sucursal origen de la transaccion.
        /// </summary>
        private int csucursal;
        /// <summary>
        /// Codigo de agencia origen de la transaccion.
        /// </summary>
        private int cagencia;
        /// <summary>
        /// Fecha contable del movimiento.
        /// </summary>
        private int fconatable;
        /// <summary>
        /// Fecha de trabao del movimiento.
        /// </summary>
        private int? ftrabajo;
        /// <summary>
        /// Fecha de proceso del movimiento, con esta fecha se lleva los saldos de cuentas producto.
        /// </summary>
        private int? fproceso;
        /// <summary>
        /// Fecha valor del movimiento, se utiliza en el calculo de ajuste de interese, los cuales se contabilizan con la fecha de hoy.
        /// </summary>
        private int? fvalor;
        /// <summary>
        /// Fecha real en la cual se ejecuta una transaccion.
        /// </summary>
        private DateTime freal;
        /// <summary>
        /// Indica que la transaccion que se esta ejecutando es el linea.
        /// </summary>
        private bool enlinea = true;
        /// <summary>
        /// Numero de mensaje a reversar.
        /// </summary>
        private string mensajereverso;
        /// <summary>
        /// Codigo del modulo original al que pertenece la transaccion.
        /// </summary>
        private int cmodulotranoriginal;
        /// <summary>
        /// Codigo de transaccion original a ejecutar.
        /// </summary>
        private int ctranoriginal;

        /// <summary>
        /// Map que contiene objetos a insertar, actualizar y modificar en la base de datos.
        /// </summary>
        //private Dictionary<string, TablaDto> mmantenimiento = new Dictionary<string, TablaDto>();


        /// <summary>
        /// Completa datos del request dado un string
        /// ccompania:1,csucursal:1,cagencia:1,usuario:USER1,crol:1,cidioma:ES,ccanal:BRC,cmodulo:1,ctransaccion:4,termnal:1 <br>
        /// </summary>
        /// <param name="pDatos">1^1^1^USER1^1^ES^BRC^1^4^1</param>
        public void LlenarCampos(Object pDatos) {
            if (pDatos == null) {
                return;
            }
            char[] seps = { '^' };
            String[] st = ((string)pDatos).Split(seps);

            int i = 0;

            foreach (string obj in st) {
                i++;
                switch (i) {
                    case 1:
                        this.ccompania = Int32.Parse(obj);
                        break;
                    case 2:
                        this.csucursal = Int32.Parse(obj);
                        break;
                    case 3:
                        this.cagencia = Int32.Parse(obj);
                        break;
                    case 4:
                        this.cusuario = obj;
                        break;
                    case 5:
                        this.crol = Int32.Parse(obj);
                        break;
                    case 6:
                        this.cidioma = obj;
                        break;
                    case 7:
                        this.ccanal = obj;
                        break;
                    case 8:
                        this.cterminal = obj;
                        break;
                    case 9:
                        this.cmodulo = Int32.Parse(obj);
                        break;
                    case 10:
                        this.ctransaccion = Int32.Parse(obj);
                        break;
                    default:
                        this.ctransaccion = this.Ctransaccion;
                        break;
                }
            }
            // Fija datos de la transaccion original.
            this.ctranoriginal = this.ctransaccion;
            this.cmodulotranoriginal = this.cmodulo;

        }
        [Newtonsoft.Json.JsonProperty(PropertyName = "mensaje")]
        public string Mensaje { get => mensaje; set => mensaje = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "ccompania")]
        public int Ccompania { get => ccompania; set => ccompania = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cusuario")]
        public string Cusuario { get => cusuario; set => cusuario = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cusuariobancalinea")]
        public string Cusuariobancalinea { get => cusuariobancalinea; set => cusuariobancalinea = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cidioma")]
        public string Cidioma { get => cidioma; set => cidioma = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "crol")]
        public int Crol { get => crol; set => crol = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cmodulo")]
        public int Cmodulo { get => cmodulo; set => cmodulo = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "ctransaccion")]
        public int Ctransaccion { get => ctransaccion; set => ctransaccion = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cterminal")]
        public string Cterminal { get => cterminal; set => cterminal = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cterminalremoto")]
        public string Cterminalremoto { get => cterminalremoto; set => cterminalremoto = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "ccanal")]
        public string Ccanal { get => ccanal; set => ccanal = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "csucursal")]
        public int Csucursal { get => csucursal; set => csucursal = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cagencia")]
        public int Cagencia { get => cagencia; set => cagencia = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "fconatable")]
        public int Fconatable { get => fconatable; set => fconatable = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "ftrabajo")]
        public int? Ftrabajo { get => ftrabajo; set => ftrabajo = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "fproceso")]
        public int? Fproceso { get => fproceso; set => fproceso = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "fvalor")]
        public int? Fvalor { get => fvalor; set => fvalor = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "freal")]
        public DateTime Freal { get => freal; set => freal = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "enlinea")]
        public bool Enlinea { get => enlinea; set => enlinea = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "mensajereverso")]
        public string Mensajereverso { get => mensajereverso; set => mensajereverso = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cmodulotranoriginal")]
        public int Cmodulotranoriginal { get => cmodulotranoriginal; set => cmodulotranoriginal = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "ctranoriginal")]
        public int Ctranoriginal { get => ctranoriginal; set => ctranoriginal = value; }
       

        public static RequestBase Copiar(RqMantenimiento rqMantenimiento) {
            RequestBase rq = new RequestBase();
            Type tipo = rq.GetType();
            IEnumerable<FieldInfo> lcampos = tipo.GetTypeInfo().DeclaredFields;
            foreach (FieldInfo f in lcampos) {
                Object valor = f.GetValue(rqMantenimiento);
                f.SetValue(rq, valor);
            }
            rq.Mdatos = rqMantenimiento.Mdatos;
            // copiar los mantenimientos y consulta que van a la base 
            foreach(string alias in rqMantenimiento.Mtablas.Keys) {
                Tabla t = rqMantenimiento.Mtablas[alias];
                if((bool)t.EnviarSP) {
                    Dictionary<string, Object> m = new Dictionary<string, object>();
                    m["leliminar"] = t.Lregeliminar;
                    m["lregistros"] = t.Lregistros;
                    rq.Mdatos[alias] = m;
                }
            }
            return rq;
        }
    }
}
