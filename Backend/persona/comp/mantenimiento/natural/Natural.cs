using core.componente;
using core.servicios;
using dal.generales;
using dal.persona;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace persona.comp.mantenimiento.natural
{/// <summary>
 /// Metodo que se encarga de completar informacion faltante de personas naturales.
 /// </summary>
    public class Natural : ComponenteMantenimiento
    {


        /// <summary>
        /// Actualiza informacion de personas naturales.
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm)
        {

            if (rm.GetTabla("DETALLE") != null)
            {
                tperpersonadetalle tperPersonaDetalle = (tperpersonadetalle)rm.GetTabla("DETALLE").Lregistros.ElementAt(0);
                if (tperPersonaDetalle != null)
                {
                    if (tperPersonaDetalle.Esnuevo)
                    {
                        this.VerificaPersona(tperPersonaDetalle);
                    }
                    this.ValidaEmail(tperPersonaDetalle);
                    this.ValidarIdentificacion(tperPersonaDetalle.identificacion, tperPersonaDetalle.tipoidentificacdetalle);
                }
            }
            tpernatural tperNatural;
            if (rm.GetTabla("NATURAL") != null)
            {
                tperNatural = (tpernatural)rm.GetTabla("NATURAL").Lregistros.ElementAt(0);
                tgenparametros parametros = TgenParametrosDal.Find("EDAD_MINIMA_SOCIO", rm.Ccompania);
                if (tperNatural.cpersona == 0)
                {
                    long? cpersona = rm.GetLong("c_pk_cpersona");
                    if (cpersona == null)
                    {
                        cpersona = Secuencia.GetProximovalor("PERSONA");
                        rm.AddDatos("c_pk_cpersona", cpersona);
                    }
                    // TperPersonaDtoKey tperPersonaKey = new TperPersonaDtoKey((long)cpersona, rm.Ccompania);
                    tperpersona tperPersona = TperPersonaDal.Find((long)cpersona, rm.Ccompania);
                    if (tperPersona == null)
                    {

                        tperPersona = new tperpersona();
                        tperPersona.cpersona = (long)cpersona;
                        tperPersona.ccompania = rm.Ccompania;
                        rm.AdicionarTabla("TPERPERSONA", tperPersona, 0, false);


                    }
                    tperNatural.cpersona = (long)cpersona;
                    tperNatural.ccompania = rm.Ccompania;
                    rm.Response["c_pk_cpersona"] = tperNatural.cpersona;
                    rm.Response["c_pk_ccompania"] = tperNatural.ccompania;
                    rm.Response["c_nombre"] = NombreCambiado(tperNatural);
                }
                this.ValidaFechaNacimiento(tperNatural, parametros);
                FUtil.ValidaFechas(tperNatural.fnacimiento, "FECHA DE NACIMIENTO", null, null);
            }
        }

        /// <summary>
        /// Entrega el nombre completo de la persona.
        /// </summary>
        /// <param name="tperNatural">Objeto que contiene informacion de una persona natural.</param>
        /// <returns>string</returns>
        public static string NombreCambiado(tpernatural tperNatural)
        {
            if (tperNatural == null)
            {
                return null;
            }
            string nombre = "";
            if (tperNatural.apellidopaterno != null)
            {
                nombre += tperNatural.apellidopaterno + " ";
            }
            if (tperNatural.apellidomaterno != null)
            {
                nombre += tperNatural.apellidomaterno + " ";
            }
            if (tperNatural.primernombre != null)
            {
                nombre += tperNatural.primernombre + " ";
            }
            if (tperNatural.segundonombre != null)
            {
                nombre += tperNatural.segundonombre + " ";
            }
            if (nombre.CompareTo("") == 0)
            {
                nombre = null;
            }
            else
            {
                nombre = nombre.Substring(0, nombre.Length - 1);
            }
            return nombre;
        }



        private void ValidarIdentificacion(string identificacion, string ctipoidentificacion)
        {
            if (ctipoidentificacion.Equals("C"))
            {
                if (!Cedula.Validar(identificacion))
                {
                    throw new AtlasException("BPER-005", "IDENTIFICACION NO VALIDA {0}", identificacion);
                }
            }
            else if (ctipoidentificacion.Equals("R"))
            {
                if (!Ruc.Validar(identificacion))
                {
                    throw new AtlasException("BPER-005", "IDENTIFICACION NO VALIDA {0}", identificacion);
                }
            }
        }

        public bool ValidarIdentificacionArchivo(string identificacion, string ctipoidentificacion) {
            bool result = false;
            if(ctipoidentificacion.Equals("C")) {
                result =  Cedula.Validar(identificacion);
                    
            } else if(ctipoidentificacion.Equals("R")) {
                result = Ruc.Validar(identificacion);
            }
            return result;
        }


        /// <summary>
        /// Verifica que no exista una persona creada con la identificacion que se desea crear un registro.
        /// </summary>
        /// <param name="tperPersonaDetalle"></param>
        public void VerificaPersona(tperpersonadetalle tperPersonaDetalle)
        {
            try
            {
                tperpersonadetalle p = TperPersonaDetalleDal.Find(tperPersonaDetalle.identificacion);

                if (p != null)
                {
                    throw new AtlasException("BPER-008", "YA EXISTE UNA PERSONA CON IDENITICACION {0}", tperPersonaDetalle.identificacion);
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

        public void ValidaEmail(tperpersonadetalle tperPersonaDetalle)
        {
            if (!String.IsNullOrEmpty(tperPersonaDetalle.email))
            {
                String expresion;
                expresion = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
                if (Regex.IsMatch(tperPersonaDetalle.email, expresion))
                {
                    if (Regex.Replace(tperPersonaDetalle.email, expresion, String.Empty).Length != 0)
                    {
                        throw new AtlasException("BPER-010", "EMAIL PERSONAL NO TIENE EL FORMATO CORRCETO {0}", tperPersonaDetalle.email);
                    }
                }
                else
                {
                    throw new AtlasException("BPER-010", "EMAIL PERSONAL NO TIENE EL FORMATO CORRCETO {0}", tperPersonaDetalle.email);
                }
            }
            if (!String.IsNullOrEmpty(tperPersonaDetalle.emailcorporativo))
            {
                String expresion;
                expresion = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
                if (Regex.IsMatch(tperPersonaDetalle.emailcorporativo, expresion))
                {
                    if (Regex.Replace(tperPersonaDetalle.emailcorporativo, expresion, String.Empty).Length != 0)
                    {
                        throw new AtlasException("BPER-011", "EMAIL CORPORATIVO NO TIENE EL FORMATO CORRCETO {0}", tperPersonaDetalle.emailcorporativo);
                    }
                }
                else
                {
                    throw new AtlasException("BPER-011", "EMAIL CORPORATIVO NO TIENE EL FORMATO CORRCETO {0}", tperPersonaDetalle.emailcorporativo);
                }
            }
        }

        public void ValidaFechaNacimiento(tpernatural tperNat, tgenparametros parametros)
        {
            if (tperNat.fnacimiento != null)
            {
                var fsistema = Fecha.GetFechaSistema();
                DateTime fnacimiento = tperNat.fnacimiento.Value;
                var finit = (fsistema.Year * 100 + fsistema.Month) * 100 + fsistema.Day;
                var ffin = (fnacimiento.Year * 100 + fnacimiento.Month) * 100 + fnacimiento.Day;
                var fres = (finit - ffin) / 10000;
                var edad = (int)parametros.numero;
                if (fres <= edad)
                {
                    throw new AtlasException("FPER-003", "FECHA DE NACIMIENTO {0} DEBE SER MAYOR A {1} AÑOS", tperNat.fnacimiento, edad);
                }
            }
        }

        public string ValidaFechaNacimientoArchivo(tpernatural tperNat, tgenparametros parametros)
        {
            var res = "";
            if (tperNat.fnacimiento != null)
            {
                var fsistema = Fecha.GetFechaSistema();
                DateTime fnacimiento = tperNat.fnacimiento.Value;
                var finit = (fsistema.Year * 100 + fsistema.Month) * 100 + fsistema.Day;
                var ffin = (fnacimiento.Year * 100 + fnacimiento.Month) * 100 + fnacimiento.Day;
                var fres = (finit - ffin) / 10000;
                var edad = (int)parametros.numero;
                if (fres <= edad)
                {

                    res = "FECHA DE NACIMIENTO: " + tperNat.fnacimiento + " DEBE SER MAYOR A " + edad + " AÑOS, ";
                }
            }
            return res;
        }

        /// <summary>
        /// Verifica que no exista una persona creada con la identificacion que se desea crear un registro.
        /// </summary>
        /// <param name="tperPersonaDetalle"></param>
        public void ValidarSocio(tpernatural tperNatural, tperpersonadetalle tperPersonaDetalle, tsoccesantia tsocCesantia)
        {
            string Errores = string.Empty;
            tgencatalogodetalle c = new tgencatalogodetalle();
            //tperpersonadetalle p = null;
            tsocubicacion u = null;
            tsoctipogrado g = null;
            //   TsocUbicacionDto u = new TsocUbicacionDto();
            try
            {
                // private static String HQL_POR_IDENTIFICA = "select t from TperPersonaDetalleDto t where t.identificacion = :identificacion and t.pk.verreg = :verreg ";
                tperpersonadetalle personaDetalle = TperPersonaDetalleDal.Find(tperPersonaDetalle.identificacion);


                Errores = personaDetalle != null ? Errores + string.Format("IDENTIFICACIÓN REPETIDA: {0}, ", tperPersonaDetalle.identificacion) : Errores + String.Empty;

                // ValidarExistencia Generó
                c = TgenCatalogoDetalleDal.Find(302, tperNatural.genero);
                Errores = c == null ? Errores + string.Format("CÓDIGO DE GÉNERO INVÁLIDO: {0}, ", tperNatural.genero) : Errores + String.Empty;

                c = !string.IsNullOrEmpty(tperNatural.estadocivilcdetalle) ? TgenCatalogoDetalleDal.Find((int)tperNatural.estadocivilccatalogo, tperNatural.estadocivilcdetalle) : null;
                Errores = c == null ? Errores + string.Format("CÓDIGO DE ESTADO CIVIL INVÁLIDO: {0}, ", tperNatural.genero) : Errores + String.Empty;


                tgenparametros parametros = TgenParametrosDal.Find("EDAD_MINIMA_SOCIO", 1);
                Errores += ValidaFechaNacimientoArchivo(tperNatural, parametros);

                try
                {
                    ValidaEmail(tperPersonaDetalle);
                }
                catch (Exception e)
                {
                    Errores = Errores + e.Message;
                }


                //VALIDAR SOCIO// 
                //u = TsocUbicacionDal.Find((long)tsocCesantia.cubicacion);
                //Errores = u == null ? Errores + string.Format("UBICACIÓN INVÁLIDA: {0}, ", tsocCesantia.cubicacion) : Errores + String.Empty;

                // c = TgenCatalogoDetalleDal.Find(102, tsocCesantia.ccdetalleestado);
                // Errores = c == null ? Errores + string.Format("ESTADO DEL SOCIO INVALIDO: {0}, ", tperNatural.genero) : Errores + String.Empty;

                //g = TsocTipoGradoDal.Find((long)tsocCesantia.cgrado);
                // Errores = g == null ? Errores + string.Format("GRADO INVÁLIDO: {0}", tsocCesantia.cgrado) : Errores + String.Empty;

                if (!String.IsNullOrEmpty(Errores))
                    throw new AtlasException("CA-0011", Errores);
            }
            catch (Exception e)
            {

                throw e;

            }

        }

    }
}
