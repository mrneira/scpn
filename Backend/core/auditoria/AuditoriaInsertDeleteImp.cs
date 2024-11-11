using dal.generales;
using modelo;
using modelo.helper;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using util;
using util.dto;
using util.interfaces;
using util.servicios.ef;
using util.thread;

namespace core.auditoria {

    public class AuditoriaInsertDeleteImp : IAuditoriaInsertDelete {
        private static readonly Random random = new Random();

        /// <summary>
        /// Crea un registro de auditoria de creacion y eliminaciomn de registros.
        /// </summary>
        /// <param name="bean">Objeto que contiene la informacion del registro a crear auditoria.</param>
        /// <param name="crear">true indica que se crea un registro, false se elimina un registro.</param>
        public void Procesar(AbstractDto bean, bool crear) {
            string beanName = EntityHelper.GetNombre((IBean)bean);
            if (!AuditoriaInsertDeleteImp.ManejaAuditoria(beanName)) {
                // Si el bean no maneja auditoria no hacer nada.
                return;
            }

            IEnumerable<FieldInfo> lcampos = DtoUtil.GetCampos((IBean)bean);
            string[] keys = DtoUtil.GetCamposPk((IBean)bean);

            String clavePrimaria = "";
            foreach (string campo in keys) {
                Object valor = DtoUtil.GetValorCampo((IBean)bean, campo);
                if (valor == null) {
                    tgenentidad te = TgenentidadDal.Find(beanName);
                    throw new AtlasException("GEN-013", "CLAVE NO PROPORCIONADA PARA LA TABLA: {0}", te.tname + ", CAMPO: " + campo.ToUpper());
                }
                String cambio = "{\"c\":" + "\"" + campo + "\"";
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
            foreach (string key in bean.Mdatos.Keys) {
                object valor = bean.GetDatos(key);
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
                if (f.FieldType.Name.Contains("ICollection") || f.FieldType.FullName.Contains("modelo.") || campo == "mdatos" || campo == "esnuevo" || campo == "actualizar" || campo == "idreg" || campo == "optlock") {
                    continue;
                }
                Object valor = null;
                try {
                    valor = DtoUtil.GetValorCampo((IBean)bean, campo);
                } catch (Exception) {
                    continue;
                }
                if (valor == null) {
                    continue;
                }
                String cambio = "{\"c\":" + "\"" + campo + "\"";
                cambio = cambio + ",\"va\":" + "\"" + valor + "\"";
                cambio = cambio + "}";

                if (registro.Equals("")) {
                    registro = registro + "{\"f\":[" + cambio;
                } else {
                    registro = registro + "," + cambio;
                }
            }
            registro = registro + "]}";
            AuditoriaInsertDeleteImp.SaveLog(clavePrimaria, beanName, registro, etiquetas, crear);
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
        /// Crea e inserta un rgistro en la tabla de auditoria TsegAuditoria.
        /// </summary>
        /// <param name="clavePrimaria">Clave primaria del registro.</param>
        /// <param name="beanName">Nombre del bean.</param>
        /// <param name="registro">Valor del registro.</param>
        /// <param name="crear">true indica que se crea un registro, false se elimina un registro.</param>
        private static void SaveLog(String clavePrimaria, String beanName, String registro, String etiquetas, bool crear) {
            Request rq = ThreadNegocio.GetDatos().Request;
            // Crea un objeto con los datos a almacenar auditoria.
            tsegauditoriainsdel obj = new tsegauditoriainsdel() {
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
                valoretiqueta = etiquetas,
                creado_eliminado = false
            };
            if (crear) {
                obj.creado_eliminado = true;
            }
            obj.particion = Constantes.GetParticion((int)obj.fecha);
            int hash = random.Next(999999999);
            obj.hash = hash;
            // Almacena el registro en la base.
            Sessionef.Save(obj);
        }
    }
}
