using core.componente;
using dal.generales;
using dal.monetario;
using modelo;
using modelo.helper.cartera;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting;
using util;
using util.dto.mantenimiento;
using util.movimiento;

namespace monetario.util {
    public class MonetarioUtil {

        /// <summary>
        /// Constructor por defecto, tiene que ser privado ya que todos los metodos son estaticos.
        /// </summary>
        private MonetarioUtil() {
        }

        /// <summary>
        /// Metodo que completa fechas en el request, monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de transacciones monetarias.</param>
        public static void LlenarFechas(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.Fproceso == null) {
                rqmantenimiento.Fproceso = rqmantenimiento.Ftrabajo;
            }
            if (rqmantenimiento.Fvalor == null) {
                rqmantenimiento.Fvalor = rqmantenimiento.Fconatable;
            }
        }

        /// <summary>
        /// Metodo que obtine y fija en el rqmantenimiento, la definicion de la transaccion monetaria que se esta ejecutando.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de transacciones monetarias.</param>
        public static void LlenarTransaccionMonetaria(RqMantenimiento rqmantenimiento) {
            tgentransaccion tran = (tgentransaccion)rqmantenimiento.Tgentransaccion;
            rqmantenimiento.Tgentransaccionmonetaria = tran;
            // Si la transaccion original es diferente a la transaccion monetaria se cambia la transaccion monetaria.
            if (tran == null || !rqmantenimiento.Ctransaccion.Equals(tran.ctransaccion)
                    || !rqmantenimiento.Cmodulo.Equals(tran.cmodulo)) {
                tran = TgentransaccionDal.Find(rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion);
                rqmantenimiento.Tgentransaccionmonetaria = tran;
            }
        }

        public static void Adicionarrubrosnormal(RqMantenimiento rqmantenimiento, List<Rubro> lrubros) {
            tgentransaccion tran = (tgentransaccion)rqmantenimiento.Tgentransaccionmonetaria;
            List<RqRubro> lrqrubros = rqmantenimiento.Rubros;
            foreach (RqRubro rqRubro in lrqrubros) {
                IList<tmonrubro> ltmonrubro = TmonRubroDal.Find(tran, rqRubro.Rubro);
                // Adiciona rubros de impuestos cargos y comisiones.
                MonetarioUtil.AddRubroImpCarCom(rqmantenimiento, ltmonrubro, lrqrubros);
                foreach (tmonrubro tmonRubro in ltmonrubro) {
                    if (!MonetarioUtil.Exiterubro(rqmantenimiento, lrubros, tmonRubro, rqRubro)) {
                        MonetarioUtil.CrearRubro(rqmantenimiento, lrubros, lrqrubros, tmonRubro, rqRubro);
                    }
                }
            }
            MonetarioUtil.CompletarMoneda(lrubros);
        }

        /// <summary>
        /// Datos del request utilizado en la ejecucion de transacciones monetarias.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el cual se ejecuta el monetario.</param>
        /// <param name="lrubros">Objeto en el cual se adicionan rubos asociados a una transaccion, este rubro contiene los datos del movimiento asociado a un modulo.</param>
        /// <param name="lrqrubros">Lista de rubros que llegan en el request.</param>
        /// <param name="tmonRubro">Definicion de un rubro.</param>
        /// <param name="rqRubro">Datos de request del rubro.</param>
        private static void CrearRubro(RqMantenimiento rqmantenimiento, List<Rubro> lrubros, List<RqRubro> lrqrubros, tmonrubro tmonRubro, RqRubro rqRubro) {
            RqRubro itemrqmov = (RqRubro)rqRubro.Clone();
            if (rqRubro.Rubro.CompareTo(tmonRubro.crubro) != 0) {
                if (!MonetarioUtil.Existerqrubro(rqmantenimiento, tmonRubro, lrqrubros)) {
                    itemrqmov = (RqRubro)rqRubro.Clone();
                    itemrqmov.Rubro = (int)tmonRubro.crubro;
                    // Cuando tiene un rubro par se encera el codigo contable.
                    itemrqmov.Codigocontable = null;
                } else {
                    return;
                }
            }
            Rubro rubro = new Rubro(rqmantenimiento, tmonRubro, itemrqmov);
            lrubros.Add(rubro);
        }

        /// <summary>
        /// Metodo que crea y adiciona rubros en modo reverso.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de transacciones monetarias.</param>
        /// <param name="lrubros">Objeto en el cual se adicionan rubos asociados a una transaccion, este rubro contiene los datos del movimiento asociado a un modulo.</param>
        /// <param name="lmovimientoreverso">Lista de movimientos a reversar.</param>
        public static void Adicionarrubrosreverso(RqMantenimiento rqmantenimiento, List<Rubro> lrubros, List<Movimiento> lmovimientoreverso) {
            foreach (Movimiento movimiento in lmovimientoreverso) {
                Rubro rubro = new Rubro(rqmantenimiento, movimiento);
                lrubros.Add(rubro);
            }
        }

        /// <summary>
        /// Metodo que adiciona rubros de impuestos, cargos y/o comisiones.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de transacciones monetarias.</param>
        /// <param name="ltmonrubro">Lista de definicion de rubros.</param>
        /// <param name="lrqrubro">Lista datos del request de rubros.</param>
        private static void AddRubroImpCarCom(RqMantenimiento rqmantenimiento, IList<tmonrubro> ltmonrubro, List<RqRubro> lrqrubro) {
            tgentransaccion tran = (tgentransaccion)rqmantenimiento.Tgentransaccionmonetaria;
            if (!(bool)tran.completarubros) {
                return;
            }
            foreach (tmonrubro obj in ltmonrubro) {
                IList<tmonrubro> rubrostransaction = rubrostransaction = TmonRubroDal.FindRubroBase(tran, (int)obj.crubro);
                if (rubrostransaction == null) {
                    continue;
                }
                foreach (tmonrubro rubro in rubrostransaction) {
                    IList<tmonrubro> rubroscomplementarios = TmonRubroDal.FindRubroBase(tran, (int)rubro.crubro);
                    MonetarioUtil.AddRubroComplemtario(rqmantenimiento, ltmonrubro, lrqrubro, rubroscomplementarios);
                }// fin del hijo
            }// Fin del padre
        }

        /// <summary>
        /// Metodo que adiciona rubros a la transaccion, si el rubro no esta asociado previamente.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de transacciones monetarias.</param>
        /// <param name="lTmonRubro">Lista de definicion de rubros.</param>
        /// <param name="lrqrubro">Lista datos del request de rubros.</param>
        /// <param name="lTmonRubroComp">Lista que contiene la defincion de rubos.</param>
        private static void AddRubroComplemtario(RqMantenimiento rqmantenimiento, IList<tmonrubro> lTmonRubro, List<RqRubro> lrqrubro, IList<tmonrubro> lTmonRubroComp) {
            foreach (tmonrubro complemtaryitem in lTmonRubroComp) {
                // Si el rubro no existe en el request
                if (Existerqrubro(rqmantenimiento, complemtaryitem, lrqrubro)) {
                    continue;
                }
                // si el rubo no existe en la lista de rubros de la transaccion
                if (!MonetarioUtil.ExiterubroenTransaction(rqmantenimiento, complemtaryitem, lTmonRubro)) {
                    lTmonRubro.Add(complemtaryitem);
                }
            }
        }

        /// <summary>
        /// Metodo que verifica si la definicion de un rubro, forma parte de la lista de rubros con los cual es se va a ejecutar una transaccion.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de transacciones monetarias.</param>
        /// <param name="tmonrubro">Definicion de un rubro a verificar si existe en la lista de rubros.</param>
        /// <param name="lTmonRubro">Lista de definciones de rubro.</param>
        /// <returns></returns>
        private static bool ExiterubroenTransaction(RqMantenimiento rqmantenimiento, tmonrubro tmonrubro, IList<tmonrubro> lTmonRubro) {
            bool exists = false;
            if (rqmantenimiento.Comprobantecontable) {
                return exists;
            }
            foreach (tmonrubro obj in lTmonRubro) {
                if (((int)tmonrubro.crubro).CompareTo(obj.crubro) == 0) {
                    return true;
                }
            }
            return exists;
        }

        /// <summary>
        /// Verifica que el rubro esta en la lista de rubros a procesar en el comprobante contable.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de transacciones monetarias.</param>
        /// <param name="lrubros">Lista de rubros que se convierten en movimientos.</param>
        /// <param name="tmonrubro">Definicion del rubro.</param>
        /// <param name="rqrubro">Datos del request del rubro.</param>
        /// <returns></returns>
        private static bool Exiterubro(RqMantenimiento rqmantenimiento, List<Rubro> lrubros, tmonrubro tmonrubro, RqRubro rqrubro) {
            bool existe = false;
            if (rqmantenimiento.Comprobantecontable || rqrubro.Multiple) {
                return existe;
            }
            foreach (Rubro rubro in lrubros) {
                if (tmonrubro.crubro.Equals(rubro.Crubro)) {
                    return true;
                }
            }
            return existe;
        }

        /// <summary>
        /// Verifica que el rubro definido en TmonRubro existe en la lista de rubros que llegan en el request.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de transacciones monetarias.</param>
        /// <param name="tmonrubro">Definicion del rubro.</param>
        /// <param name="lrqrubros">Lista de rubros del request.</param>
        /// <returns></returns>
        private static bool Existerqrubro(RqMantenimiento rqmantenimiento, tmonrubro tmonrubro, List<RqRubro> lrqrubros) {
            bool exists = false;
            if (rqmantenimiento.Comprobantecontable) {
                return exists;
            }
            foreach (RqRubro obj in lrqrubros) {
                if (((int)tmonrubro.crubro).CompareTo(obj.Rubro) == 0) {
                    return true;
                }
            }
            return exists;
        }

        /// <summary>
        /// Completa la moneda con la primera moneda que encuentre.
        /// </summary>
        /// <param name="lrubros">Lista de rubros a completar moneda.</param>
        private static void CompletarMoneda(List<Rubro> lrubros) {
            string cmoneda = null;
            foreach (Rubro rubro in lrubros) {
                if (rubro.Movimiento.cmoneda != null) {
                    cmoneda = rubro.Movimiento.cmoneda;
                    break;
                }
            }
            foreach (Rubro rubro in lrubros) {
                if (rubro.Movimiento.cmoneda == null) {
                    rubro.Movimiento.cmoneda = cmoneda;
                }
            }
        }

        /// <summary>
        /// Ejecuta componentes de negocio de inicio asociados a la transaccion monetaria.
        /// </summary>
        /// <param name="comprobantemonetario">Datos del comprobante monetario utilizado en la ejecucion de transacciones monetarias.</param>
        public static void EjecutaComponentesInicio(object comprobantemonetario) {
            ComprobanteMonetario cm = (ComprobanteMonetario)comprobantemonetario;
            IList<tmoncomponentetransaccion> ldatos = TmonComponenteTransaccionDal.Find((tgentransaccion)cm.Rqmantenimiento.Tgentransaccionmonetaria);
            cm.Lcomponentetransaccion = ldatos;
            foreach (tmoncomponentetransaccion obj in ldatos) {
                if (obj.evento.CompareTo("I") != 0 || !(bool)obj.activo) {
                    continue;
                }
                // Si necesita enviar los rubros estos se tiene que adicionar al rqmantenimiento
                MonetarioUtil.EjecutarComponenteMonetarioInicio(comprobantemonetario, obj);
            }
        }

        /// <summary>
        /// Ejecuta componente monetario. Crea una instancia de la clase asociada al componete monetariao e invoca al metodo en modo normal o reverso dependiendo del modo en el que se ejecuta la transaccion.
        /// </summary>
        /// <param name="comprobantemonetario">Datos del comprobante monetario utilizado en la ejecucion de transacciones monetarias.</param>
        /// <param name="componentetransaccion">Objeto que contiene la clase a invocar dinamicamente.</param>
        private static void EjecutarComponenteMonetarioInicio(object comprobantemonetario, tmoncomponentetransaccion componentetransaccion) {
            ComponenteMonetarioInicio cmi = null;
            string componente = componentetransaccion.ccomponente;
            try {
                string assembly = componente.Substring(0, componente.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componente);
                object comp = handle.Unwrap();
                cmi = (ComponenteMonetarioInicio)comp;

            } catch (TypeLoadException e) {
                tgentransaccion tran = (tgentransaccion)((ComprobanteMonetario)comprobantemonetario).Rqmantenimiento.Tgentransaccionmonetaria;
                throw new AtlasException("MON-001", "COMPONENTE: {0} ASOCIADO A LA TRANSACCION NO EXISTE: MODULO{1} TRANSACCION: {2}", e, cmi.GetType().FullName,
                        tran.cmodulo, tran.ctransaccion);
            } catch (InvalidCastException e) {
                tgentransaccion tran = (tgentransaccion)((ComprobanteMonetario)comprobantemonetario).Rqmantenimiento.Tgentransaccionmonetaria;
                throw new AtlasException("MON-002", "COMPONENTE: {0} ASOCIADO A LA TRANSACCION: MODULO{1} TRANSACCION: {2} NO IMPLEMENTA: {3}", e, cmi.GetType().FullName, tran.cmodulo, tran.ctransaccion);
            }
            if (((ComprobanteMonetario)comprobantemonetario).Rqmantenimiento.Reverso.CompareTo("N") != 0) {
                cmi.EjecutarReverso(comprobantemonetario);
            } else {
                cmi.Ejecutar(comprobantemonetario);
            }
        }

        /// <summary>
        /// Ejecuta componentes de negocio de inicio asociados a la transaccion monetaria.
        /// </summary>
        /// <param name="comprobantemonetario">Datos del comprobante monetario utilizado en la ejecucion de transacciones monetarias.</param>
        public static void EjecutaComponentesFinalizacion(Object comprobantemonetario) {
            ComprobanteMonetario cm = (ComprobanteMonetario)comprobantemonetario;
            IList<tmoncomponentetransaccion> ldatos = cm.Lcomponentetransaccion;
            foreach (tmoncomponentetransaccion obj in ldatos) {
                if (obj.evento.CompareTo("I") == 0 || !(bool)obj.activo) {
                    continue;
                }
                // Si necesita enviar los rubros estos se tiene que adicionar al rqmantenimiento
                MonetarioUtil.EjecutarComponenteMonetarioFin(comprobantemonetario, obj);
            }
        }

        /// <summary>
        /// Ejecuta componente monetario. Crea una instancia de la clase asociada al componete monetariao e invoca al metodo en modo normal o  reverso dependiendo del modo en el que se ejecuta la transaccion.
        /// </summary>
        /// <param name="comprobantemonetario">Datos del comprobante monetario utilizado en la ejecucion de transacciones monetarias.</param>
        /// <param name="componentetransaccion">Objeto que contiene la clase a invocar dinamicamente.</param>
        private static void EjecutarComponenteMonetarioFin(Object comprobantemonetario, tmoncomponentetransaccion componentetransaccion) {
            ComponenteMonetarioFin cmf = null;
            string componente = componentetransaccion.ccomponente;
            try {
                string assembly = componente.Substring(0, componente.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componente);
                object comp = handle.Unwrap();
                cmf = (ComponenteMonetarioFin)comp;

            } catch (TypeLoadException e) {
                tgentransaccion tran = (tgentransaccion)((ComprobanteMonetario)comprobantemonetario).Rqmantenimiento.Tgentransaccionmonetaria;
                throw new AtlasException("MON-001", "COMPONENTE: {0} ASOCIADO A LA TRANSACCION NO EXISTE: MODULO{1} TRANSACCION: {2}", e, cmf.GetType().FullName,
                        tran.cmodulo, tran.ctransaccion);
            } catch (InvalidCastException e) {
                tgentransaccion tran = (tgentransaccion)((ComprobanteMonetario)comprobantemonetario).Rqmantenimiento.Tgentransaccionmonetaria;
                throw new AtlasException("MON-002", "COMPONENTE: {0} ASOCIADO A LA TRANSACCION: MODULO{1} TRANSACCION: {2} NO IMPLEMENTA: {3}", e, cmf.GetType().FullName, tran.cmodulo, tran.ctransaccion);
            }
            if (((ComprobanteMonetario)comprobantemonetario).Rqmantenimiento.Reverso.CompareTo("N") != 0) {
                cmf.EjecutarReverso(comprobantemonetario);
            } else {
                cmf.Ejecutar(comprobantemonetario);
            }
        }

    }
}
