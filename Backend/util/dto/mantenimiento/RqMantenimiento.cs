using modelo.interfaces;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using util;
using util.thread;

namespace util.dto.mantenimiento
{
    /// <summary>
    /// Request de mantenimiento.
    /// </summary>
    public class RqMantenimiento : RqMantenimientoHelper, ICloneable
    {
        /// <summary>
        /// Crea una instancia de RqMantenimiento.
        /// </summary>
        public RqMantenimiento()
        {
        }

        public virtual object Clone()
        {
            List<RqRubro> rubros = new List<RqRubro>();
            rubros.AddRange(base.Rubros);

            RqMantenimiento rq = (RqMantenimiento)this.MemberwiseClone();
            rq.Rubros = rubros;
            return rq;
        }

        public void Grabar()
        {
            foreach (String key in base.Lorden)
            {
                if (key == null)
                {
                    continue;
                }
                Tabla tabla = base.Mtablas[key];
                if (tabla != null)
                {
                    tabla.Grabar();
                }
            }
        }

        /// <summary>
        /// Encera tablas que tienen dml contra la base.
        /// </summary>
        public void EncerarTablas()
        {
            Lorden.Clear();
            Mtablas.Clear();
        }

        /// <summary>
        /// Adiciona campos de pk al response, los cuales se completan en la pantalla. 
        /// </summary>
        /// <param name="response"></param>
        public static void AddSecunciaToResposnse(Response response)
        {
            Dictionary<String, Object> msecuencia = ThreadNegocio.GetDatos().Msecuencia;
            if (msecuencia == null)
            {
                return;
            }
            foreach (string key in msecuencia.Keys)
            {
                response[key] = msecuencia[key];
            }
        }

        /// <summary>
        /// Cambia el codigo de transaccion en el request.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo a fijar en el reques.</param>
        /// <param name="ctransaccion">Codigo de transaccion a fijar en el request.</param>
        public void Cambiartransaccion(int cmodulo, int ctransaccion)
        {
            this.Cmodulo = cmodulo;
            this.Ctransaccion = ctransaccion;
        }

        /// <summary>
        /// Adiciona una tabla al map de tablas, para que estas sean enviados a la base por save que esta en cada Tabla.
        /// </summary>
        /// <param name="nombretabla">Alias de la tabla.</param>
        /// <param name="datos">Datos asociados al alias de la tabla.</param>
        public void AdicionarTabla(String nombretabla, Object datos, bool? spValidacion)
        {
            this.AdicionarTabla(nombretabla, datos, null, spValidacion);
        }

        /// <summary>
        /// Adiciona una tabla al map de tablas considerando las que ya se enviaron, para que estas sean enviados a la base por save que esta en cada Tabla.
        /// </summary>
        /// <param name="nombretabla">Alias de la tabla.</param>
        /// <param name="datos">Datos asociados al alias de la tabla.</param>
        public void AdicionarTablaExistente(String nombretabla, Object datos, bool? spValidacion)
        {
            this.AdicionarTablaExistente(nombretabla, datos, null, spValidacion);
        }
        /// <summary>
        /// Adiciona una tabla al map de tablas, para que estas sean enviados a la base por save que esta en cada Tabla.
        /// </summary>
        /// <param name="nombretabla">Alias de la tabla.</param>
        /// <param name="datos">Datos asociados al alias de la tabla.</param>
        /// <param name="posicion">Posicion de insert.</param>
        public void AdicionarTablaExistente(string nombretabla, object datos, int? posicion, bool? spValidacion)
        {
            Tabla tabla;
            if (datos is IList && ((IList)datos).Count <= 0)
            {
                return;
            }
            if (Lorden.Contains(nombretabla))
            {  
                tabla = Mtablas[nombretabla];
                Lorden.Remove(nombretabla);
            }
            else {
                tabla = new Tabla(nombretabla);
            }

             
           
            
            if (posicion != null && Lorden.Count > 0)
            {
                if (posicion > Lorden.Count)
                {
                    Lorden.Insert(Lorden.Count, nombretabla);
                }
                else
                {
                    Lorden.Insert((int)posicion, nombretabla);
                }
            }
            else
            {
                Lorden.Add(nombretabla);
            }

            if (datos is List<IBean>)
            {

                if (tabla.Lregistros.Count > 0)
                {
                    List<IBean> reg = (List<IBean>)datos;

                    foreach (IBean lreg in reg) {
                        tabla.Lregistros.Add(lreg);
                    }
                    
                }
                else {
                    tabla.Lregistros = (List<IBean>)datos;
                }
                
            }
            else if (datos is IList)
            {
                List<IBean> lbean = new List<IBean>();
                foreach (object obj in (IList)datos)
                {
                    lbean.Add((IBean)obj);
                }
                if (tabla.Lregistros.Count > 0) {
                    foreach (IBean tb in lbean) {
                        tabla.Lregistros.Add(tb);
                        
                    }
                }
                else
                {
                    tabla.Lregistros = lbean;
                }
                
            }
            tabla.Registro = tabla.Lregistros;
            if (tabla.EnviarSP == null)
            {
                tabla.EnviarSP = spValidacion;
            }
            Mtablas[nombretabla] = tabla;
        }
        /// <summary>
        /// Adiciona una tabla al map de tablas, para que estas sean enviados a la base por save que esta en cada Tabla.
        /// </summary>
        /// <param name="nombretabla">Alias de la tabla.</param>
        /// <param name="datos">Datos asociados al alias de la tabla.</param>
        /// <param name="posicion">Posicion de insert.</param>
        public void AdicionarTabla(string nombretabla, object datos, int? posicion, bool? spValidacion)
        {
            if (datos is IList && ((IList)datos).Count <= 0)
            {
                return;
            }
            nombretabla = nombretabla.ToUpper();
            Tabla tabla = new Tabla(nombretabla);
            if (Lorden.Contains(nombretabla))
            {
                Lorden.Remove(nombretabla);
            }
            if (posicion != null && Lorden.Count > 0)
            {
                if (posicion > Lorden.Count)
                {
                    Lorden.Insert(Lorden.Count, nombretabla);
                }
                else
                {
                    Lorden.Insert((int)posicion, nombretabla);
                }
            }
            else
            {
                Lorden.Add(nombretabla);
            }

            if (datos is List<IBean>)
            {
                tabla.Lregistros = (List<IBean>)datos;
            }
            else if (datos is IList)
            {
                List<IBean> lbean = new List<IBean>();
                foreach (object obj in (IList)datos)
                {
                    lbean.Add((IBean)obj);
                }
                tabla.Lregistros = lbean;
            }
            tabla.Registro = datos;
            if (tabla.EnviarSP == null)
            {
                tabla.EnviarSP = spValidacion;
            }
            Mtablas[nombretabla] = tabla;
        }

        public static RqMantenimiento Copiar(RqMantenimiento rqMantenimiento)
        {
            RqMantenimiento rq = new RqMantenimiento();
            Type tipo = rq.GetType();
            IEnumerable<FieldInfo> lcampos = tipo.GetTypeInfo().DeclaredFields;
            foreach (FieldInfo f in lcampos)
            {
                Object valor = f.GetValue(rqMantenimiento);
                f.SetValue(rq, valor);
            }
            // Copiar campos del request base
            RequestBase rb = new RequestBase();
            Type tiporb = rb.GetType();
            IEnumerable<FieldInfo> lcamposrb = tiporb.GetTypeInfo().DeclaredFields;
            foreach (FieldInfo f in lcamposrb)
            {
                Object valor = f.GetValue(rqMantenimiento);
                f.SetValue(rq, valor);
            }
            rq.Mdatos = rqMantenimiento.Mdatos;
            // copiar los mantenimientos y consulta que van a la base 
            foreach (string alias in rqMantenimiento.Mtablas.Keys)
            {
                Tabla t = rqMantenimiento.Mtablas[alias];
                if ((bool)t.EnviarSP)
                {
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
