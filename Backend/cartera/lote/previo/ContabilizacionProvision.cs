using cartera.contabilidad;
using cartera.monetario;
using dal.cartera;
using modelo;
using monetario.util;
using monetario.util.rubro;
using System;
using System.Collections.Generic;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;

namespace cartera.lote.previo {
    /// <summary>
    /// Clase que se encarga de contabilizar provisiones por calificacion de activos de riesgo. Reversa la provision contabilizada previamente y
    /// contabiliza la nueva provision.
    /// </summary>
    public class ContabilizacionProvision : ITareaPrevia {

        /// <summary>
        /// Objeto utilizado en la contabizacion de accruales.
        /// </summary>
        private RqMantenimiento rqmantenimiento = null;

        /// <summary>
        /// Objeto que almacena la defincion de rubros asociados a una transaccion.
        /// </summary>
        private TransaccionRubro transaccionRubro = null;


        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            rqmantenimiento = (RqMantenimiento)requestmodulo.GetDatos("RQMANTENIMIENTO");
            this.Inicializar();

            // reverso provision anterior
            this.CambiarTransaccion("REVERSO_PROVISION");
            // PARA LA CACEBCE no se reversa la provision esta se calcula con los nuevos saldos
            // TODO habilitar para un funcionamiento normal.
            // this.contabiliza(true);

            // contabilizacion de nuevos valores de provision.
            this.CambiarTransaccion("CONTABILIZA_PROVISION");
            this.Contabiliza(false);

            // Marca registros como contabilizados.
            TcarOperacionCalificacionDal.MarcaConatbilizados();
        }

        /// <summary>
        /// Metodo que se encarga de inicializar.
        /// </summary>
        private void Inicializar()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ThreadNegocio.RemoveDatos();
            Datos d = new Datos();
            ThreadNegocio.FijarDatos(d);
        }

        /// <summary>
        /// Ejecuta contabilizacion de provisiones.
        /// </summary>
        private void Contabiliza(Boolean reverso)
        {
            IList<Dictionary<string, object>> ldatos = null;
            if (reverso) {
                ldatos = TcarOperacionCalificacionDal.GetProvisonReversar();
            } else {
                ldatos = TcarOperacionCalificacionDal.getProvisonContabilizar();
            }
            if (ldatos == null) {
                return;
            }
            foreach (Dictionary<string, object> obj in ldatos) {
                this.Contabiliza(obj);
            }
        }

        /// <summary>
        /// Contabiliza accrual por cada registro del resultset
        /// </summary>
        private void Contabiliza(Dictionary<string, object> obj)
        {
            ActualizaRqmantenimiento(obj);
            String cestadooperacion = (String)obj["cestadooperacion"];
            String csegmento = (String)obj["csegmento"];
            String cmoneda = (String)obj["cmoneda"];
            int cmodulo = int.Parse(obj["cmodulo"].ToString());
            int cproducto = int.Parse(obj["cproducto"].ToString());
            int ctipoproducto = int.Parse(obj["ctipoproducto"].ToString());
            Decimal monto = decimal.Parse(obj["monto"].ToString());

            tmonrubro rubro = transaccionRubro.GetRubro(1);

            String codigocontable = Perfiles.GetCodigoContableTipoProducto(rubro.csaldo, cmodulo, cproducto, ctipoproducto, null);
            RubroHelper.AdicionarRubro(rqmantenimiento, rubro.crubro, codigocontable, monto, null, cmoneda, null);

            // rubro par ejemplo ingresos o orden por contra
            tmonrubro rubropar = transaccionRubro.GetRubro(rubro.crubropar ?? 0);
            String codigocontablepar = Perfiles.GetCodigoContableTipoProducto(rubropar.csaldo, cmodulo, cproducto, ctipoproducto, null);
            RubroHelper.AdicionarRubro(rqmantenimiento, rubro.crubropar ?? 0, codigocontablepar, monto, null, cmoneda, null);

            // Ejecuta la transaccion monetaria anidada.
            ComprobanteMonetario monetario = new ComprobanteMonetario();
            monetario.Ejecutar(rqmantenimiento);
        }

        /// <summary>
        /// Encera request monetario y actualiza sucursal oficina del accrual a contabilizar.
        /// </summary>
        private void ActualizaRqmantenimiento(Dictionary<string, object> obj)
        {
            rqmantenimiento.EncerarRubros();
            int csucursal = int.Parse(obj["csucursal"].ToString());
            int cagencia = int.Parse(obj["cagencia"].ToString());
            rqmantenimiento.Csucursal = csucursal;
            rqmantenimiento.Cagencia = cagencia;
        }

        /// <summary>
        /// Cambia la transa
        /// </summary>
        private void CambiarTransaccion(string cevento)
        {
            tcarevento evento = TcarEventoDal.Find(cevento);
            rqmantenimiento.Cambiartransaccion(evento.cmodulo ?? 0, evento.ctransaccion ?? 0);
            transaccionRubro = new TransaccionRubro(evento.cmodulo ?? 0, evento.ctransaccion ?? 0);
        }


    }


}
