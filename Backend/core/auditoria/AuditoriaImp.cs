using dal.generales;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.interfaces;
using util.servicios.ef;
using util.thread;

namespace core.auditoria {
    public class AuditoriaImp : IAuditoria {

        private static readonly Random random = new Random();

        /// <summary>
        /// Metodo que obtiene lista de campos del registro, y procesa por campo , si el valor cambio se genera un registro de auditoria.
        /// </summary>
        /// <param name="beanNuevo">Objeto que contiene informacion del dto a generar auditoria.</param>
        public void Procesar(AbstractDto beanNuevo) {
            string beanName = EntityHelper.GetNombre((IBean)beanNuevo);
            if (!AuditoriaImp.ManejaAuditoria(beanName)) {
                // Si el bean no maneja auditoria no hacer nada.
                return;
            }
            AbstractDto beanOriginal = (AbstractDto)beanNuevo.GetDatos("BEANORIGINAL");
            if (beanOriginal == null) {
                return;
            }

            IEnumerable<FieldInfo> lcampos = DtoUtil.GetCampos((IBean)beanNuevo);
            string[] keys = DtoUtil.GetCamposPk((IBean)beanNuevo);
            String clavePrimaria = "";
            foreach (string campo in keys) {
                Object valor =  DtoUtil.GetValorCampo((IBean)beanOriginal, campo);
                string cambio = "{\"c\":" + "\"" + campo + "\"";
                cambio = cambio + ",\"v\":" + "\"" + valor.ToString() + "\"";
                cambio = cambio + "}";

                if (clavePrimaria.Equals("")) {
                    clavePrimaria = clavePrimaria + "{\"f\":[" + cambio;
                } else {
                    clavePrimaria = clavePrimaria + "," + cambio;
                }
            }
            clavePrimaria = clavePrimaria + "]}";

            // Etiquetas
            String etiquetas = "";
            foreach (string key in beanNuevo.Mdatos.Keys) {
                object valor = beanNuevo.GetDatos(key);
                if (key.StartsWith("n") && (valor != null)) {
                    if (!String.IsNullOrEmpty(valor.ToString())) {
                        String cambio = "\"" + key + "\"";
                        cambio = cambio + ":" + "\"" + valor + "\"";

                        if (etiquetas.Equals("")) {
                            etiquetas = etiquetas + "{" + cambio;
                        } else {
                            etiquetas = etiquetas + "," + cambio;
                        }
                    }
                }
            }
            if (etiquetas.CompareTo("") != 0) {
                etiquetas = etiquetas + "}";
            } else {
                etiquetas = null;
            }

            //Registro
            String registro = "";
            foreach (FieldInfo f in lcampos) {
                String campo = DtoUtil.GetNombreCampo(f.Name);
                if (f.FieldType.Name.Contains("ICollection") || f.FieldType.FullName.Contains("modelo.") || campo == "mdatos" || campo == "mbce"  || campo == "esnuevo" || campo == "actualizar" || campo == "idreg" || campo == "optlock") {
                    continue;
                }
                Object newvalue = null;
                try {
                    newvalue = DtoUtil.GetValorCampo((IBean)beanNuevo, campo);
                } catch (Exception) {
                    continue;
                }
                Object oldvalue = null;
                try {
                    oldvalue = DtoUtil.GetValorCampo((IBean)beanOriginal, campo);
                } catch (Exception) {
                    continue;
                }
                String cambio = "{\"c\":" + "\"" + campo + "\"";
                if (newvalue == null && oldvalue == null) {
                    continue;
                }
                if (newvalue == null && oldvalue != null || newvalue != null && oldvalue == null) {
                    cambio = cambio + ",\"va\":" + "\"" + oldvalue + "\"";
                    cambio = cambio + ",\"vn\":" + "\"" + newvalue + "\"";
                    cambio = cambio + "}";

                    if (registro.Equals("")) {
                        registro = registro + "{\"f\":[" + cambio;
                    } else {
                        registro = registro + "," + cambio;
                    }
                } else if (newvalue != null && ((IComparable)newvalue).CompareTo(oldvalue) != 0) {
                    cambio = cambio + ",\"va\":" + "\"" + oldvalue + "\"";
                    cambio = cambio + ",\"vn\":" + "\"" + newvalue + "\"";
                    cambio = cambio + "}";

                    if (registro.Equals("")) {
                        registro = registro + "{\"f\":[" + cambio;
                    } else {
                        registro = registro + "," + cambio;
                    }
                }
            }
            if (registro.CompareTo("") != 0) {
                registro = registro + "]}";
                AuditoriaImp.GrabarLog(clavePrimaria, beanName, registro, etiquetas);
            }


            
        }

        /// <summary>
        /// Metodo que verifica si un bean maneja auditoria.
        /// </summary>
        /// <param name="beanName">Nombre del dto.</param>
        /// <returns>bool</returns>
        private static bool ManejaAuditoria(String beanName) {
            //tgenentidad e = TgenentidadDal.FindInDataBase(beanName);
            tgenentidad e = TgenentidadDal.Find(beanName);
            if (Constantes.EsUno(e.log)) {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Metodo que verifica si los datos del campo son diferente de los valores del registro anterior.
        /// </summary>
        /// <param name="clavePrimaria">Clave primaria del registro.</param>
        /// <param name="beanName">Nombre del dto.</param>
        /// <param name="campo">Campo de la tabla.</param>
        /// <param name="valornuevo">Valor nuevo del campo.</param>
        /// <param name="valoranterior">Valor anterior del campo.</param>
        private static void ProcesarPorCampo(String clavePrimaria, String campo, AbstractDto beanNuevo, Object valornuevo, Object valoranterior) {
            if ((valornuevo == null) && (valoranterior == null)) {
                return;
            }
            string beanName = ((IBean)beanNuevo).GetType().Name;
            if (((valornuevo == null) && (valoranterior != null)) || ((valornuevo != null) && (valoranterior == null))) {
                // AuditoriaImp.GrabarLog(clavePrimaria, beanName, campo, valornuevo, valoranterior);
                return;
            }
            if ((valornuevo != null) && (((IComparable)valornuevo).CompareTo(valoranterior) != 0)) {
                // AuditoriaImp.GrabarLog(clavePrimaria, beanName, campo, valornuevo, valoranterior);
            }
        }

        /// <summary>
        /// Crea e inserta un rgistro en la tabla de auditoria TsegAuditoria.
        /// </summary>
        /// <param name="clavePrimaria">Clave primaria del registro.</param>
        /// <param name="beanName">Nombre del dto.</param>
        /// <param name="campo">Campo de la tabla.</param>
        /// <param name="valornuevo">Valor nuevo del campo.</param>
        /// <param name="valoranterior">Valor anterior del campo.</param>
        private static void GrabarLog(String clavePrimaria, String beanName, String registro, String etiquetas) {
            Request rq = ThreadNegocio.GetDatos().Request;
            // Crea un objeto con los datos a almacenar auditoria.
            tsegauditoria obj = new tsegauditoria() {
                fecha = rq.Fconatable,
                freal = rq.Freal,
                tabla = beanName.ToUpper(),
                pkregistro = clavePrimaria,
                cusuario = rq.Cusuario,
                cterminal = rq.Cterminal,
                cagencia = rq.Cagencia,
                csucursal = rq.Csucursal,
                ccompania = rq.Ccompania,
                ctransaccion = rq.Ctransaccion,
                cmodulo = rq.Cmodulo,
                valorregistro = registro,
                valoretiqueta = etiquetas
            };
            obj.particion = Constantes.GetParticion((int)obj.fecha);
            int hash = random.Next(999999999);
            obj.hash = hash;
            // Almacena el registro en la base.
            Sessionef.Save(obj);
        }


    }
}
