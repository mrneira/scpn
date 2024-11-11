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

namespace talentohumano.comp.mantenimiento.funcionario
{
    /// <summary>
    /// Metodo que se encarga de completar informacion faltante de proveedores.
    /// </summary>
    /// <author>amerchan</author>
    public class Funcionario : ComponenteMantenimiento
    {
        /// <summary>
        /// Actualiza informacion de proveedores.
        /// </summary>
        /// <param name="rm">Request del mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rm) {
            tthfuncionariodetalle tthfuncionariodetalle;
            if (rm.GetTabla("FUNCIONARIO") != null) {
                tthfuncionariodetalle = (tthfuncionariodetalle)rm.GetTabla("FUNCIONARIO").Lregistros.ElementAt(0);

                ValidarIdentificacion(tthfuncionariodetalle.documento.ToString(), tthfuncionariodetalle.tipodocumentocdetalle);
                if (tthfuncionariodetalle.email != null)
                    ValidaEmail(tthfuncionariodetalle.email);
                if (tthfuncionariodetalle.emailinstitucion != null)
                    ValidaEmail(tthfuncionariodetalle.emailinstitucion);

                long cfuncionario = tthfuncionariodetalle.cfuncionario;
                tthfuncionariodetalle.ccompania = rm.Ccompania;
                if (cfuncionario == 0) {
                    cfuncionario = Secuencia.GetProximovalor("TTH_FUNC");
                    crearFuncionario(rm, cfuncionario, rm.Ccompania);
                    tthfuncionariodetalle.cfuncionario = cfuncionario;
                }

                long? cpersona = tthfuncionariodetalle.cpersona;
                if (cpersona == null || cpersona == 0)
                {
                    tperpersonadetalle tperpersonadetallef = TperPersonaDetalleDal.Find(tthfuncionariodetalle.documento.ToString());
                    if (tperpersonadetallef == null)
                    {
                        cpersona = Secuencia.GetProximovalor("PERSONA");
                        tperpersona tperpersona = crearPersona(rm, (long)cpersona, rm.Ccompania);
                        tperpersonadetallef = crearPersonaDetalle(rm, tthfuncionariodetalle, tperpersona);
                    }
                    else
                    {
                        tperpersonadetallef.Actualizar = true;
                        tperpersonadetallef.Esnuevo = false;

                        cpersona = tperpersonadetallef.cpersona;
                        tperpersonadetallef.cusuariomod = rm.Cusuario;
                        tperpersonadetallef.fmodificacion = rm.Freal;
                        tperpersonadetallef.nombre =

                            tthfuncionariodetalle.primerapellido + " " +
                            tthfuncionariodetalle.segundoapellido + " " +
                             tthfuncionariodetalle.primernombre + " " +
                        tthfuncionariodetalle.segundonombre; 
                            
                        tperpersonadetallef.tipoidentificaccatalogo = tthfuncionariodetalle.tipodocumentoccatalogo;
                        tperpersonadetallef.tipoidentificacdetalle = tthfuncionariodetalle.tipodocumentocdetalle;
                        tperpersonadetallef.identificacion = tthfuncionariodetalle.documento.ToString();
                        tperpersonadetallef.email = tthfuncionariodetalle.email;
                        tperpersonadetallef.celular = tthfuncionariodetalle.telefonocelular;
                        tperpersonadetallef.emailcorporativo = tthfuncionariodetalle.emailinstitucion;

                        rm.AdicionarTabla("TPERPERSONADETALLE", tperpersonadetallef, true);
                    }
                    tthfuncionariodetalle.cpersona = (long)cpersona;
                }
                else {
                    tperpersonadetalle tperpersonadetallef = TperPersonaDetalleDal.Find(tthfuncionariodetalle.documento.ToString());
                    if (tperpersonadetallef != null)
                    {
                        tperpersonadetallef.Actualizar = true;
                        tperpersonadetallef.Esnuevo = false;

                        cpersona = tperpersonadetallef.cpersona;
                        tperpersonadetallef.cusuariomod = rm.Cusuario;
                        tperpersonadetallef.fmodificacion = rm.Freal;
                        tperpersonadetallef.nombre = tthfuncionariodetalle.primernombre + " " +
                            tthfuncionariodetalle.segundonombre + " " +
                            tthfuncionariodetalle.primerapellido + " " +
                            tthfuncionariodetalle.segundoapellido;
                        tperpersonadetallef.tipoidentificaccatalogo = tthfuncionariodetalle.tipodocumentoccatalogo;
                        tperpersonadetallef.tipoidentificacdetalle = tthfuncionariodetalle.tipodocumentocdetalle;
                        tperpersonadetallef.identificacion = tthfuncionariodetalle.documento.ToString();
                        tperpersonadetallef.email = tthfuncionariodetalle.email;
                        tperpersonadetallef.celular = tthfuncionariodetalle.telefonocelular;
                        tperpersonadetallef.emailcorporativo = tthfuncionariodetalle.emailinstitucion;

                        rm.AdicionarTabla("TPERPERSONADETALLE", tperpersonadetallef, true);
                    }
                }
                
                rm.Mdatos["cfuncionario"] = cfuncionario;
                rm.Response["cfuncionario"] = cfuncionario;
            }
        }
        
        private tperpersonadetalle crearPersonaDetalle(RqMantenimiento rm, tthfuncionariodetalle tthfuncionariodetalle, tperpersona tperpersona)
        {
            tperpersonadetalle tperpersonadetalle = new tperpersonadetalle();
            tperpersonadetalle.cpersona = tperpersona.cpersona;
            tperpersonadetalle.ccompania = tperpersona.ccompania;
            tperpersonadetalle.verreg = 1;
            tperpersonadetalle.optlock = 0;
            tperpersonadetalle.veractual = 1;
            tperpersonadetalle.cusuarioing = rm.Cusuario;
            tperpersonadetalle.cusuariomod = rm.Cusuario;
            tperpersonadetalle.fingreso = rm.Freal;
            tperpersonadetalle.fmodificacion = rm.Freal;
            tperpersonadetalle.nombre = tthfuncionariodetalle.primernombre + " " +
                tthfuncionariodetalle.segundonombre + " " +
                tthfuncionariodetalle.primerapellido + " " +
                tthfuncionariodetalle.segundoapellido;
            tperpersonadetalle.tipoidentificaccatalogo = tthfuncionariodetalle.tipodocumentoccatalogo;
            tperpersonadetalle.tipoidentificacdetalle = tthfuncionariodetalle.tipodocumentocdetalle;
            tperpersonadetalle.identificacion = tthfuncionariodetalle.documento.ToString();
            tperpersonadetalle.email = tthfuncionariodetalle.email;
            tperpersonadetalle.celular = tthfuncionariodetalle.telefonocelular;
            tperpersonadetalle.emailcorporativo = tthfuncionariodetalle.emailinstitucion;

            rm.AdicionarTabla("TPERPERSONADETALLE", tperpersonadetalle, true);
            return tperpersonadetalle;
        }

        private tperpersona crearPersona(RqMantenimiento rm, long cpersona, int ccompania)
        {
            tperpersona tperPersona = new tperpersona();
            tperPersona.cpersona = (long)cpersona;
            tperPersona.ccompania = rm.Ccompania;
            rm.AdicionarTabla("TPERPERSONA", tperPersona, true);
            return tperPersona;
        }

        private tthfuncionario crearFuncionario(RqMantenimiento rm, long cfuncionario, int ccompania)
        {
            tthfuncionario tthfuncionario = new tthfuncionario();
            tthfuncionario.cfuncionario = (long)cfuncionario;
            tthfuncionario.ccompania = rm.Ccompania;
            rm.AdicionarTabla("TTHFUNCIONARIO", tthfuncionario, true);
            return tthfuncionario;
        }

        /// <summary>
        /// Verifica que no exista una proveedor creado con la identificacion que se desea crear un registro.
        /// </summary>
        /// <param name="identificacion"></param>
        public void VerificaProveedor(tperproveedor tperproveedor)
        {
            try
            {
                if (TperProveedorDal.FindByIdentificacion(tperproveedor.identificacion).Count() >= 1)
                {
                    throw new AtlasException("BPROV-001", "YA EXISTE UN PROVEEDOR CON IDENITICACIÓN {0}", tperproveedor.identificacion);
                }
            }
            catch (AtlasException e)
            {
                if (!e.Codigo.Equals("BPER-007"))
                { 
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
                    throw new AtlasException("BPROV-002", "IDENTIFICACION NO VALIDA {0}", identificacion);
                }
            }
            else if (ctipoidentificacion.Equals("R"))
            {
                if (!Ruc.Validar(identificacion))
                {
                    throw new AtlasException("BPROV-002", "IDENTIFICACION NO VALIDA {0}", identificacion);
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
                        throw new AtlasException("BPROV-003", "EMAIL NO TIENE EL FORMATO CORRECTO {0}", email);
                    }
                }
                else
                {
                    throw new AtlasException("BPROV-003", "EMAIL NO TIENE EL FORMATO CORRECTO {0}", email);
                }
            }
        }
    }
}
