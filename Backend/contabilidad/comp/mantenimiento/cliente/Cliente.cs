using core.componente;
using core.servicios;
using dal.generales;
using dal.persona;
using dal.seguridades;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using System.Text.RegularExpressions;
using dal.contabilidad;

namespace contabilidad.comp.mantenimiento.cliente {
    /// <summary>
    /// Metodo que se encarga de completar informacion faltante de clientes.
    /// </summary>
    public class Cliente : ComponenteMantenimiento
    {
        /// <summary>
        /// Actualiza informacion de proveedores.
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm) {
            tperproveedor tperproveedor;
            if (rm.GetTabla("PROVEEDOR") != null) {
                tperproveedor = (tperproveedor)rm.GetTabla("PROVEEDOR").Lregistros.ElementAt(0);
                if (tperproveedor.Esnuevo)
                {
                    VerificaProveedor(tperproveedor);
                }
                ValidarIdentificacion(tperproveedor.identificacion, tperproveedor.tipoidentificacioncdetalle);
                ValidaEmail(tperproveedor.email);
                long cpersona = tperproveedor.cpersona;
                if (cpersona == 0) {
                    cpersona = Secuencia.GetProximovalor("PERSONA");
                    tperpersona tperPersona = TperPersonaDal.Find((long)cpersona, rm.Ccompania);
                    if (tperPersona == null) {
                        tperPersona = new tperpersona();
                        tperPersona.cpersona = (long)cpersona;
                        tperPersona.ccompania = rm.Ccompania;
                        rm.AdicionarTabla("TPERPERSONA", tperPersona, true);
                    }
                }
                tperproveedor.cpersona = cpersona;
                rm.Mdatos["cpersona"] = cpersona;
                rm.Response["cpersona"] = cpersona;
                rm.AddDatos("cpersona", cpersona);
            }
        }


        /// <summary>
        /// Verifica que no exista una proveedor creado con la identificacion que se desea crear un registro.
        /// </summary>
        /// <param name="identificacion"></param>
        public void VerificaProveedor(tperproveedor tperproveedor)
        {
            try
            {
                if (TperProveedorDal.FindByIdentificacionAndTipo(tperproveedor.identificacion, true) != null) {
                    throw new AtlasException("BCLIE-001", "YA EXISTE UN CLIENTE CON IDENTIFICACION {0}", tperproveedor.identificacion);
                }
            }
            catch (AtlasException e)
            {
                if (!e.Codigo.Equals("BPER-007"))
                { // si no existe la persona no se hacer nada.
                    throw e;
                }
            }

        }

        private void ValidarIdentificacion(string identificacion, string ctipoidentificacion)
        {
            if (ctipoidentificacion.Equals("C"))
            {
                if (!Cedula.Validar(identificacion))
                {
                    throw new AtlasException("BCLIE-002", "IDENTIFICACION NO VALIDA {0}", identificacion);
                }
            }
            else if (ctipoidentificacion.Equals("R"))
            {
                if (!Ruc.Validar(identificacion))
                {
                    throw new AtlasException("BCLIE-002", "IDENTIFICACION NO VALIDA {0}", identificacion);
                }
            }
        }

        public void ValidaEmail(String email)
        {
            if (!String.IsNullOrEmpty(email))
            {
                String expresion;
                expresion = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
                if (Regex.IsMatch(email, expresion))
                {
                    if (Regex.Replace(email, expresion, String.Empty).Length != 0)
                    {
                        throw new AtlasException("BCLIE-003", "EMAIL NO TIENE EL FORMATO CORRECTO {0}", email);
                    }
                }
                else
                {
                    throw new AtlasException("BCLIE-003", "EMAIL NO TIENE EL FORMATO CORRECTO {0}", email);
                }
            }
        }
    }
}
