using core.componente;
using dal.contabilidad;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;

namespace contabilidad.comp.mantenimiento.proveedor
{
   public class ValidaIdentificacion:ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            if (rqconsulta.Mdatos.ContainsKey("documento"))
            {
                string dto = rqconsulta.GetString("documento");
                string tipo = rqconsulta.GetString("tipo");
                bool esnuevo = bool.Parse(rqconsulta.Mdatos["esnuevo"].ToString());
                bool cliente= bool.Parse(rqconsulta.Mdatos["cliente"].ToString());
                if (tipo.Equals("C") || tipo.Equals("R"))
                {
                    ValidarIdentificacion(dto, tipo);
                    Existe(dto, esnuevo,cliente);
                    rqconsulta.Response["valida"] = true;
                }
                else
                {
                    rqconsulta.Response["valida"] = true;
                    return;

                }
            }
            else
            {
                return;
            }
        }
        private void ValidarIdentificacion(string identificacion, string ctipoidentificacion)
        {
            if (ctipoidentificacion.Equals("C"))
            {
                if (!Cedula.Validar(identificacion))
                {

                    throw new AtlasException("TTH-001", "IDENTIFICACION NO VALIDA {0}", identificacion);
                }

            }
            else if (ctipoidentificacion.Equals("R"))
            {
                if (!Ruc.Validar(identificacion))
                {
                    throw new AtlasException("TTH-002", "IDENTIFICACION NO VALIDA {0}", identificacion);
                }

            }
        }
        private void Existe(string identificacion, bool esnuevo,bool cliente)
        {
            List<tperproveedor> fun = TperProveedorDal.FindByIdentificacion(identificacion,cliente);
            if (fun.Count != 0 && esnuevo)
            {
                throw new AtlasException("TTH-003", "IDENTIFICACION YA EXISTENTE {0}", identificacion);
            }
            
        }

       
    }
}
