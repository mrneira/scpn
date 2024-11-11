using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Remoting;
using System.Text;
using System.Threading.Tasks;
using util.interfaces;
using util.thread;

namespace util.servicios.ef {
    /// <summary>
    /// Calse utilitaria que se encarga del manejo de una conexion a la base de datos.
    /// </summary>
    public class Sessionef {

        /// <summary>
        /// Thread local que almacena una conexion a la base de datos.
        /// </summary>
        [ThreadStatic]
        public static AtlasContexto thread_AtlasContexto = null;
        [ThreadStatic]
        public static bool thread_rollback = false;
        /// <summary>
        /// Fija un AtlasContexto en el thread local.
        /// </summary>
        /// <param name="atlasContexto"></param>
        public static void FijarAtlasContexto(AtlasContexto atlasContexto) {
            Sessionef.thread_rollback = false;
            Sessionef.thread_AtlasContexto = atlasContexto;
        }

        /// <summary>
        /// Obtiene y entraga una session del thread local.
        /// </summary>
        /// <returns>ISession</returns>
        public static AtlasContexto GetAtlasContexto() {
            AtlasContexto atlasContexto = Sessionef.thread_AtlasContexto;
            return atlasContexto;
        }

        public static void CerrarAtlasContexto(AtlasContexto atlasContexto) {
            atlasContexto.Dispose();
        }
        public static void FijarTimeOut() {
            AtlasContexto atlasContexto = Sessionef.GetAtlasContexto();
            atlasContexto.Database.ExecuteSqlCommand("exec  CESANTIA.dbo.timeout");
        }

        /// <summary>
        /// Elimina del contexto el bean.
        /// </summary>
        /// <param name="bean"></param>
        public static void Detach(IBean bean) {
            AtlasContexto atlasContexto = Sessionef.GetAtlasContexto();
            atlasContexto.Entry(bean).State = System.Data.Entity.EntityState.Detached;
        }

        /// <summary>
        /// Actualiza el registro en la base de datos.
        /// </summary>
        /// <param name="bean">Objeto que actualizar en la base de datos.</param>
        /// <returns></returns>
        public static IBean Actualizar(IBean bean) {
            AtlasContexto atlasContexto = Sessionef.GetAtlasContexto();

            if (!ValidarUpdate(bean)) {
                return bean; // si no existe cambio no hace el commit.
            }
            SetUsuarioMod(bean);
            SetFmodificacion(bean);
            // manejo de auditoria va antes del manejo de historia
            ObjectHandle handle = Activator.CreateInstance("core", "core.auditoria.AuditoriaImp");
            object obj = handle.Unwrap();
            IAuditoria a = (IAuditoria)obj;
            a.Procesar((AbstractDto)bean);
            // Limpieza del cahce del bean.
            CacheStore.Instance.Encerar(bean.GetType().Name);

            Versionregistro(bean);
            var set = atlasContexto.Set(bean.GetType());
            set.Add(bean);
            atlasContexto.Entry(bean).State = System.Data.Entity.EntityState.Modified;
            return bean;
        }

        public static void InsertOrUpdate<T>(T entity, AtlasContexto atlasContexto) where T : class {
            // atlasContexto.Set<IBean>().Add(bean);
            if (atlasContexto.Entry(entity).State == EntityState.Detached)
                atlasContexto.Set<T>().Add(entity);
        }
        /// <summary>
        /// Inserta un registro en la base de datos.
        /// </summary>
        /// <param name="bean">Objeto a inseratar en la base de datos.</param>
        public static void Grabar(IBean bean) {
            AtlasContexto atlasContexto = Sessionef.GetAtlasContexto();
            if (TieneVersionReg(bean)) {
                DtoUtil.SetValorCampoSinCambiarTipo(bean, "verreg", 0);
                SetFingreso(bean);
                SetUsuarioIng(bean);
                SetVersionActual(bean);
            }
            // manejo de auditoria va antes del manejo de historia
            ObjectHandle handle = Activator.CreateInstance("core", "core.auditoria.AuditoriaInsertDeleteImp");
            object obj = handle.Unwrap();
            IAuditoriaInsertDelete a = (IAuditoriaInsertDelete)obj;
            a.Procesar((AbstractDto)bean, true);
            var set = atlasContexto.Set(bean.GetType());
            set.Add(bean);
            atlasContexto.Entry(bean).State = System.Data.Entity.EntityState.Added;
        }

        /// <summary>
        /// Borra un registro de la base de datos.
        /// </summary>
        /// <param name="bean">Objeto a eliminar de la base de datos.</param>
        public static void Eliminar(IBean bean) {
            AtlasContexto atlasContexto = Sessionef.GetAtlasContexto();
            EntityKeyHelper ekh = EntityKeyHelper.Instance;
            Dictionary<string, string> keys = ekh.GetValoresPK(bean, atlasContexto, bean.GetType());

            if (keys.Count <= 0) {
                return;
            }

            if (TieneVersionReg(bean)) {
                Expire(bean, false);
            } else {
                ObjectHandle handlemc = Activator.CreateInstance("core", "core.servicios.consulta.MotorConsulta");
                object objmc = handlemc.Unwrap();
                IMotorConsulta mc = (IMotorConsulta)objmc;
                Object hb = mc.ConsultarPorPk(EntityHelper.GetNombre(bean), keys);
                if (hb != null) {
                    var set = atlasContexto.Set(bean.GetType());
                    set.Add(bean);
                    atlasContexto.Entry(bean).State = System.Data.Entity.EntityState.Deleted;
                }
            }
            // manejo de auditoria va antes del manejo de historia
            ObjectHandle handle = Activator.CreateInstance("core", "core.auditoria.AuditoriaInsertDeleteImp");
            object obj = handle.Unwrap();
            IAuditoriaInsertDelete a = (IAuditoriaInsertDelete)obj;
            a.Procesar((AbstractDto)bean, false);

            // Limpieza del cahce del bean.
            CacheStore.Instance.Encerar(bean.GetType().Name);
        }

        /// <summary>
        /// Inserta un registro en la base de datos sin generar auditoria ni historicos.
        /// </summary>
        /// <param name="bean">Objeto a inseratar en la base de datos.</param>
        public static void Save(IBean bean) {
            AtlasContexto atlasContexto = Sessionef.GetAtlasContexto();
            var set = atlasContexto.Set(bean.GetType());
            set.Add(bean);
            atlasContexto.Entry(bean).State = System.Data.Entity.EntityState.Added;
        }

        /// <summary>
        /// Metodo que verifica si un bean maneja version de registro.
        /// </summary>
        /// <param name="bean">Bean a verificar si maneja version de registro.</param>
        /// <returns>bool</returns>
        private static bool TieneVersionReg(IBean bean) {
            ObjectHandle handlevr = Activator.CreateInstance("core", "core.entidad.EntidadImp");
            object objvr = handlevr.Unwrap();
            IVersionRegistro vr = (IVersionRegistro)objvr;
            return vr.IsVersionReg(bean);
        }

        private static bool ValidarUpdate(IBean bean) {
            AtlasContexto atlasContexto = Sessionef.GetAtlasContexto();

            if ((atlasContexto.Entry(bean).State != System.Data.Entity.EntityState.Detached)) {
                // Si el bean no esta asociado al entity manager, hay que realizar un merge del bean.
                //throw new AtlasException("SER-005", "UPDATE NO PERMITIDO, BEAN DE LA TABLA: {0} YA SE ENCUAENTAR ASOCIADO AL CONTEXTO DEL ENTITYMANAGER", bean.GetType().Name);
            }
            Object optlock = null;
            try {
                optlock = DtoUtil.GetValorCampo(bean, "optlock");
            } catch (Exception e) {
                e.GetBaseException();
                // No hacr nada
            }
            IBean oldbean = (IBean)((AbstractDto)bean).GetDatos("BEANORIGINAL");
            if (optlock != null) {

                if (oldbean == null) {
                    throw new AtlasException("SER-007", "BLOQUEO OPTIMISTA DE LA TABLA: {0} REQUEIRE QUE EL BEAN ORIGINAL ESTE ASOCIADO AL BEAN CON EL KEY BEANORIGINAL", EntityHelper.GetNombre(bean));
                }

            }

            if (DtoUtil.Compare(bean, oldbean)) {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Fija la fecha de vigencia del registro.
        /// </summary>
        /// <param name="bean">Dto a fijar la fecha de ingreso del registro.</param>
        private static void SetFingreso(IBean bean) {
            Sessionef.SetFingreso(bean, ThreadNegocio.GetDatos().Request.Freal);
        }

        /// <summary>
        /// Fija la fecha de vigencia del registro.
        /// </summary>
        /// <param name="bean">Bean a fijar la fecha de ingreso del registro.</param>
        /// <param name="fingreso">Fecha de ingreso del registro.</param>
        private static void SetFingreso(IBean bean, DateTime fingreso) {
            try {
                DtoUtil.SetValorCampoSinCambiarTipo(bean, "fingreso", fingreso);
            } catch (Exception) {
                // Si no existe el campo en el bean no hacer nada.
                return;
            }
        }

        /// <summary>
        /// Fija fecha de modificacion del registro.
        /// </summary>
        /// <param name="bean"></param>
        private static void SetFmodificacion(IBean bean) {
            Sessionef.SetFmodificacion(bean, ThreadNegocio.GetDatos().Request.Freal);
        }

        /// <summary>
        /// Fija la fecha de vigencia del registro.
        /// </summary>
        /// <param name="bean"></param>
        /// <param name="fmodificacion"></param>
        private static void SetFmodificacion(IBean bean, DateTime fmodificacion) {
            try {
                DtoUtil.SetValorCampoSinCambiarTipo(bean, "fmodificacion", fmodificacion);
            } catch (Exception) {
                // Si no existe el campo en el bean no hacer nada.
                return;
            }
        }

        /// <summary>
        /// Fija la fecha de vigencia del registro.
        /// </summary>
        /// <param name="bean">Bean a fijar la fecha de vigencia del registro.</param>
        private static void SetUsuarioIng(IBean bean) {
            Sessionef.SetUsuarioIng(bean, ThreadNegocio.GetDatos().Request.Cusuario);
        }

        /// <summary>
        /// Fija usuario de ingreso del registro.
        /// </summary>
        /// <param name="bean">Bean a fijar el usuario que crea del registro.</param>
        /// <param name="cusuarioingreso">Codigo de usuario de ingreso.</param>
        private static void SetUsuarioIng(IBean bean, String cusuarioingreso) {
            try {
                DtoUtil.SetValorCampoSinCambiarTipo(bean, "cusuarioing", cusuarioingreso);
            } catch (Exception) {
                // Si no existe el campo en el bean no hacer nada.
                return;
            }
        }

        /// <summary>
        /// Fija usuario que modifica el registro.
        /// </summary>
        /// <param name="bean"></param>
        private static void SetUsuarioMod(IBean bean) {
            Sessionef.SetUsuarioMod(bean, ThreadNegocio.GetDatos().Request.Cusuario);
        }

        /// <summary>
        /// Fija usuario que modifica le registro.
        /// </summary>
        /// <param name="bean"></param>
        /// <param name="cusuariomodificacion"></param>
        private static void SetUsuarioMod(IBean bean, String cusuariomodificacion) {
            try {
                DtoUtil.SetValorCampoSinCambiarTipo(bean, "cusuariomod", cusuariomodificacion);
            } catch (Exception) {
                // Si no existe el campo en el bean no hacer nada.
                return;
            }
        }

        /// <summary>
        /// Fija version del registro actual del bean.
        /// </summary>
        /// <param name="pbean"></param>
        private static void SetVersionActual(IBean pbean) {
            ObjectHandle handle = Activator.CreateInstance("core", "core.util.VersionActualImp");
            object comp = handle.Unwrap();
            IVersionActual va = (IVersionActual)comp;

            int versionactual = va.GetVersionActual((AbstractDto)pbean);
            if (versionactual > 0) {
                DtoUtil.SetValorCampoSinCambiarTipo(pbean, "veractual", versionactual);
            }
        }

        private static IBean Versionregistro(IBean bean) {
            IBean oldbean = null;
            if (TieneVersionReg(bean)) {
                if (Constantes.EsUno(((AbstractDto)bean).GetString("registrohistoria"))) {
                    // Ya se genero historia del registro.
                    return bean;
                }
                oldbean = (IBean)((AbstractDto)bean).GetDatos("BEANORIGINAL");
                if (oldbean == null) {
                    throw new AtlasException("SER-004", "PARA MANEJAR HISTORIA EL BEAN ORIGINAL DE LA TABLA: {0} TIENE QUE ESTAR ASOCIADO AL BEAN CON EL KEY BEANORIGINAL", EntityHelper.GetNombre(bean));
                }

                if (oldbean != null && !DtoUtil.Compare(bean, oldbean)) {
                    int veractual = CreateVersionRecord(oldbean);
                    DtoUtil.SetValorCampoSinCambiarTipo(bean, "veractual", veractual);
                }
            }
            return bean;
        }

        private static int CreateVersionRecord(IBean oldBean) {
            AtlasContexto atlasContexto = Sessionef.GetAtlasContexto();

            EntityKeyHelper ekh = EntityKeyHelper.Instance;
            Dictionary<string, string> keys = ekh.GetValoresPK(oldBean, atlasContexto, oldBean.GetType());

            Object veractual = DtoUtil.GetValorCampo(oldBean, "veractual");
            int versionactual = 0;
            if (veractual != null) {
                versionactual = int.Parse(veractual.ToString());
            }
            versionactual = versionactual + 1;
            DtoUtil.SetValorCampoSinCambiarTipo(oldBean, "verreg", versionactual);
            Sessionef.Save(oldBean);
            return versionactual;
        }

        public static void Expire(IBean bean, bool delete) {
            AtlasContexto atlasContexto = Sessionef.GetAtlasContexto();
            EntityKeyHelper ekh = EntityKeyHelper.Instance;
            Dictionary<string, string> keys = ekh.GetValoresPK(bean, atlasContexto, bean.GetType());
            if (TieneVersionReg(bean)) {
                // isession.Evict(bean);
                IBean newbean = (IBean)bean.Clone();
                if (delete) {
                    atlasContexto.Entry(bean).State = System.Data.Entity.EntityState.Deleted;
                }

                object veractual = DtoUtil.GetValorCampo(newbean, "veractual");
                if (veractual == null) {
                    veractual = 0;
                }
                veractual = (int)veractual + 1;
                DtoUtil.SetValorCampoSinCambiarTipo(newbean, "verreg", veractual);
                SetUsuarioMod(newbean);
                SetFmodificacion(newbean);
                if (!(atlasContexto.Entry(bean).State != System.Data.Entity.EntityState.Detached)) {
                    // if (!isession.Contains(bean)) {
                    ObjectHandle handlemc = Activator.CreateInstance("core", "core.servicios.consulta.MotorConsulta");
                    object objmc = handlemc.Unwrap();
                    IMotorConsulta mc = (IMotorConsulta)objmc;
                    Object hb = mc.ConsultarPorPk(EntityHelper.GetNombre(bean), keys);
                    if (hb != null) {
                        if (DtoUtil.GetValorCampo(newbean, "fingreso") == null) {
                            object fing = DtoUtil.GetValorCampo((IBean)hb, "fingreso");
                            if (fing != null) {
                                SetFingreso(newbean, (DateTime)fing);
                            }
                            object uing = DtoUtil.GetValorCampo((IBean)hb, "cusuarioing");
                            if (uing != null) {
                                SetUsuarioIng(newbean, (String)uing);
                            }
                        }
                        var set = atlasContexto.Set(hb.GetType());
                        set.Add(hb);
                        atlasContexto.Entry(hb).State = System.Data.Entity.EntityState.Deleted;
                    }
                }
                Sessionef.Save(newbean);
            }
        }


    }
}
