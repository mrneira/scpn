using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Remoting;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.consulta;
using util.dto.mantenimiento;

namespace cartera.comp.consulta.solicitud
{
   public class ValidacionProducto : ComponenteConsulta

    {
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            RqMantenimiento rqm = new RqMantenimiento();
            rqm = Copiar(rqconsulta);
            long cpersona = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            string componente = "cartera.comp.mantenimiento.solicitud.SolicitudValidaciones";
            rqm.Mdatos.Add("componente", componente);
            rqm = procesarMantenimiento(rqm);
            

        }
        private static RqMantenimiento Copiar(RqConsulta rqConsulta)
        {
            RqMantenimiento rq = new RqMantenimiento();
            Type tipo = rq.GetType();
            IEnumerable<FieldInfo> lcampos = tipo.GetTypeInfo().DeclaredFields;

            RequestBase rb = new RequestBase();
            Type tiporb = rb.GetType();
            IEnumerable<FieldInfo> lcamposrb = tiporb.GetTypeInfo().DeclaredFields;
            foreach (FieldInfo f in lcamposrb)
            {
                Object valor = f.GetValue(rqConsulta);
                f.SetValue(rq, valor);
            }
            rq.Mdatos = rqConsulta.Mdatos;
            rq.Response = rqConsulta.Response;

            return rq;
        }
        private RqMantenimiento procesarMantenimiento(RqMantenimiento rqMantenimiento)
        {

            string componete = "";

            ComponenteMantenimiento c = null;
            try
            {
                componete = rqMantenimiento.Mdatos["componente"].ToString();
                string assembly = componete.Substring(0, componete.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componete);
                object comp = handle.Unwrap();
                c = (ComponenteMantenimiento)comp;

            }
            catch (TypeLoadException e)
            {
                throw new AtlasException("GEN-001", "CLASE {0} A EJECUTAR NO EXISTE  MODULO: {1} TRANS: {2} ", e, componete,
                                 rqMantenimiento.Cmodulo, rqMantenimiento.Ctransaccion);
            }
            catch (InvalidCastException e)
            {
                throw new AtlasException("GEN-002", "PROCESO {0} A EJECUTAR MODULE: {1} TRANS: {2}  NO IMPLEMENTA {4}", e, componete,
                                 rqMantenimiento.Cmodulo, rqMantenimiento.Ctransaccion, c.GetType().FullName);
            }
            c.Ejecutar(rqMantenimiento);
            return rqMantenimiento;
        }
    }
}
