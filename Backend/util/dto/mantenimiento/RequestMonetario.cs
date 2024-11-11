using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.dto.mantenimiento {

    /// <summary>
    /// Clase que define atributos de un request monetario.
    /// </summary>
    public class RequestMonetario : Request {
        /// <summary>
        /// Numero de operacion asociada al rubro. Si el valor del atributo esta vacio se toma la cuenta que llega en el request financiero, dependiendo de la definicion del rubro si es debito o credito.
        /// </summary>
        private string coperacion;
        /// <summary>
        /// Modo en el que se ejecuta la transaccion N (Normal) I (Imperativo o Forzado).
        /// </summary>
        private string imperativo = "N";
        /// <summary>
        /// True indica que se esta ejecutando un comprobante contable.
        /// </summary>
        private bool comprobantecontable = false;
        /// <summary>
        /// Numero de documento, papeleta o numero de cheque.
        /// </summary>
        private string documento;
        /// <summary>
        /// Numero de documento final, o numero de cheque final, se utiliza en la anulacion de un rango de cheques.
        /// </summary>
        private string documentofinal;
        /// <summary>
        /// Glosa de la transaccion,texto libre.
        /// </summary>
        private string area;
        /// <summary>
        /// Indica que el request va a ejecutar un reverso de una transaccion.
        /// </summary>
        private string reverso = "N";
        /// <summary>
        /// Lista de rubros enviados desde un canal para ejecutar una transacion.
        /// </summary>
        private List<RqRubro> rubros = new List<RqRubro>();
        /// <summary>
        /// Indica si se cambia el debito por credito, Ejemplo reverso contable del registro de una CXC en el cobro de la misma.
        /// </summary>
        private bool cambiaDxC = false;
        /// <summary>
        /// Indica que al ejecutar una transaccion calcula provisiones o no.
        /// </summary>
        private bool calculaccrual = true;
        /// <summary>
        /// Codigo de tipos de identificacion, CED Cedula, Ruc, Pas Pasaporte.
        /// </summary>
        private string cdetalle;
        /// <summary>
        /// Codigo de catalogo de tipo de identificacion.
        /// </summary>
        private int ccatalogo = 303;
        /// <summary>
        /// Numero de identificacion del cliente cedula, ruc, pasaporte.
        /// </summary>
        private string identificacion;
        /// <summary>
        /// Codigo de persona beneficiaria.
        /// </summary>
        private long cpersona;
        /// <summary>
        /// Nombre del beneficiario.
        /// </summary>
        private string nombre;
        /// <summary>
        /// Numero de transaccion de caja multiple, asociado a la fecha de trabajo usuario.
        /// </summary>
        private int idcajamultiple;
        /// <summary>
        /// Indica que la transaccion es de contabilizacion del accrual diario de intereses.
        /// </summary>
        private bool accrualdaily = false;
        /// <summary>
        /// Objeto que contiene la definicion de una transaccion que se esta ejecutando.
        /// </summary>
        private object tgentransaccionmonetaria;
        /// <summary>
        /// Codigo de moneda con la que se ejecuta la transaccion.
        /// </summary>
        private string cmoneda;
        /// <summary>
        /// Monto total de la transaccion.
        /// </summary>
        private decimal monto;
        /// <summary>
        /// Codigo de instancia de un proceso de jbpm.
        /// </summary>
        private long cproceso;
        /// <summary>
        /// Texto libre que se asocia a los movimientos.
        /// </summary>
        private string comentario;
        /// <summary>
        /// código del modulo del producto.
        /// </summary>
        private int cmoduloproducto;
        /// <summary>
        /// código del producto de cartera.
        /// </summary>
        private int cproducto;
        /// <summary>
        /// código del tipo producto de cartera.
        /// </summary>
        private int ctipoproducto;

        public string Coperacion { get => coperacion; set => coperacion = value; }
        public string Imperativo { get => imperativo; set => imperativo = value; }
        public bool Comprobantecontable { get => comprobantecontable; set => comprobantecontable = value; }
        public string Documento { get => documento; set => documento = value; }
        public string Documentofinal { get => documentofinal; set => documentofinal = value; }
        public string Area { get => area; set => area = value; }
        public string Reverso { get => reverso; set => reverso = value; }
        public List<RqRubro> Rubros { get => rubros; set => rubros = value; }
        public bool CambiaDxC { get => cambiaDxC; set => cambiaDxC = value; }
        public bool Calculaccrual { get => calculaccrual; set => calculaccrual = value; }
        public string Cdetalle { get => cdetalle; set => cdetalle = value; }
        public int Ccatalogo { get => ccatalogo; set => ccatalogo = value; }
        public string Identificacion { get => identificacion; set => identificacion = value; }
        public long Cpersona { get => cpersona; set => cpersona = value; }
        public string Nombre { get => nombre; set => nombre = value; }
        public int Idcajamultiple { get => idcajamultiple; set => idcajamultiple = value; }
        public bool Accrualdaily { get => accrualdaily; set => accrualdaily = value; }
        public object Tgentransaccionmonetaria { get => tgentransaccionmonetaria; set => tgentransaccionmonetaria = value; }
        public string Cmoneda { get => cmoneda; set => cmoneda = value; }
        public decimal Monto { get => monto; set => monto = value; }
        public long Cproceso { get => cproceso; set => cproceso = value; }
        public string Comentario { get => comentario; set => comentario = value; }
        public int Cmoduloproducto { get => cmoduloproducto; set => cmoduloproducto = value; }
        public int Cproducto { get => cproducto; set => cproducto = value; }
        public int Ctipoproducto { get => ctipoproducto; set => ctipoproducto = value; }

        /// <summary>
        /// Adiciona rubros monetarios al request.
        /// </summary>
        /// <param name="rubros">Objeto que contiene lista de rubros monetarios que llegan desde la pagina.</param>
        public void AdicionarRubros(object rubros) {
            IList<Dictionary<string, object>> lrubros = null;
            if (rubros is Dictionary<string, object>) {
                Dictionary<string, object> m = (Dictionary<string, object>)rubros;
                JArray a = (JArray)m["ins"];
                lrubros = a.ToObject<IList<Dictionary<string, object>>>();

            } else if (!(rubros is RqRubro)) {
                lrubros = (List<Dictionary<string, object>>)rubros;
            }
            Crearubros(lrubros);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="lrubros">Lista de rubros que llegan desde la pagina.</param>
        private void Crearubros(IList<Dictionary<string, object>> lrubros) {
            List<int> l = new List<int>();
            List<RqRubro> lrqubros = new List<RqRubro>();

            foreach (Dictionary<string, object> map in lrubros) {
                RqRubro rubro = null;

                foreach (string key in map.Keys) {
                    object value = map[key];
                    if (value == null || value.Equals("") || value.ToString().Equals("0")) {
                        continue;
                    }
                    rubro = new RqRubro(key, value);
                    lrqubros.Add(rubro);
                    l.Add(rubro.Rubro);
                }

            }
            // Ordenar rubros por codigo de rubro.
            l.Sort();
            foreach (int crubro in l) {
                this.rubros.Add(this.GetRqRubro(lrqubros, crubro));
            }
        }

        /// <summary>
        /// Entrega un rubro dado el codigo de rubro.
        /// </summary>
        /// <param name="lrqubros"></param>
        /// <param name="crubro"></param>
        /// <returns></returns>
        private RqRubro GetRqRubro(List<RqRubro> lrqubros, int crubro) {
            RqRubro rqrubro = null;
            foreach (RqRubro obj in lrqubros) {
                if (obj.Rubro.CompareTo(crubro) == 0) {
                    rqrubro = obj;
                    break;
                }
            }
            return rqrubro;
        }

        /// <summary>
        /// Adiciona un rubro a la lista de rubros..
        /// </summary>
        /// <param name="rqrubro"></param>
        public void AdicionarRubro(RqRubro rqrubro) {
            rubros.Add(rqrubro);
        }

        /// <summary>
        /// Encera la lista de rubros.
        /// </summary>
        public void EncerarRubros()   {
            rubros.Clear();
	}

}
}
