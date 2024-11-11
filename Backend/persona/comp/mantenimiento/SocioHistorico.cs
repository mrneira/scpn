using core.componente;
using dal.socio;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace persona.comp.mantenimiento
{
    public class SocioHistorico : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {

            if (rm.GetTabla("SOCIO") == null || rm.GetTabla("SOCIO").Lregistros.Count() <= 0)
            {
                return;
            }

            long? cpersona = rm.GetLong("c_pk_cpersona");
            if (rm.GetTabla("SOCIO") != null)
            {
                List<IBean> ldatos = rm.GetTabla("SOCIO").Lregistros;
                foreach (IBean o in ldatos)
                {

                    tsoccesantia obj = (tsoccesantia)o;
                    #region Asignar Valores
                    if (rm.GetDatos("escarga") != null)
                    {
                        if (rm.GetDatos("escarga").ToString() == "1")
                        {
                            tsoccesantiahistorico historicoIngreso = new tsoccesantiahistorico();
                            DateTime forden = DateTime.Parse(obj.GetDatos("fordengen").ToString());
                            DateTime festado = DateTime.Parse(obj.GetDatos("fproceso").ToString());
                            //int ccatalogo = 24;
                            //string cdetalleestado = obj.GetDatos("ccdetalleestado").ToString();
                            int cestadosocio = int.Parse(obj.GetDatos("cestadosocio").ToString());
                            string ordengeneral = obj.GetDatos("ordengen").ToString();

                            long? cgrado = (long)obj.GetDatos("cgrado");
                            long? cgradoproximo = null;
                            int? csubestado = null;
                            string observaciones = string.Empty;
                            if (obj.GetDatos("cgradoproximo") != null)
                            {
                                cgradoproximo = (long)obj.GetDatos("cgradoproximo");
                            }
                            if (obj.GetDatos("csubestado") != null)
                            {
                                csubestado = (int)obj.GetDatos("csubestado");
                            }
                            if (obj.GetDatos("observaciones") != null)
                            {
                                observaciones = obj.GetDatos("observaciones").ToString();
                            }

                            #region Validar Fechas

                            FUtil.ValidaFechas(forden, "FECHA DE ORDEN GENERAL", null, null);
                            //FUtil.ValidaFechas(festado, "FECHA DE ESTADO", null, null);
                            if (festado <= forden)
                            {
                                throw new AtlasException("GEN-016", "EL CAMPO [{0}] NO PUEDE SE MAYOR A LA FECHA ORDEN ", festado);
                            }


                            #endregion Validar Fechas

                            #endregion Asignar Valores

                            #region Valores a insertar
                            if (obj.Esnuevo == true)
                            {
                                historicoIngreso.Esnuevo = true;

                            }
                            else
                            {

                                historicoIngreso = TsocCesantiaHistoricoDal.Find((long)cpersona, rm.Ccompania);
                                // historicoIngreso.AddDatos("BEANORIGINAL", historicoIngreso.Clone());
                                historicoIngreso.Actualizar = true;
                            }
                            historicoIngreso.cpersona = (int)cpersona;
                            historicoIngreso.ccompania = rm.Ccompania;
                            //historicoIngreso.ccatalogoestado = ccatalogo;
                            //historicoIngreso.ccdetalleestado = cdetalleestado;
                            historicoIngreso.cestadosocio = cestadosocio;
                            historicoIngreso.csubestado = csubestado;
                            historicoIngreso.festado = festado;
                            historicoIngreso.ordengen = ordengeneral;
                            historicoIngreso.fordengen = forden;
                            historicoIngreso.cgradoactual = cgrado;
                            historicoIngreso.cgradoproximo = cgradoproximo;
                            historicoIngreso.observaciones = observaciones;
                            historicoIngreso.cusuariomod = obj.cusuarioing;
                            historicoIngreso.fmodificacion = obj.fingreso;

                            rm.AdicionarTabla("tsoccesantiahistorico", historicoIngreso, 0, false);

                            #endregion Valores a insertar

                        }
                    }

                    if (obj.GetDatos("escarga") != null)
                    {
                        if (obj.GetDatos("escarga").ToString() == "2")
                        {
                            tsoccesantiahistorico historicoIngreso = new tsoccesantiahistorico();
                            DateTime forden = DateTime.Parse(obj.GetDatos("fordengen").ToString());
                            DateTime festado = DateTime.Parse(obj.GetDatos("fproceso").ToString());
                            //int ccatalogo = 24;
                            //string cdetalleestado = obj.GetDatos("ccdetalleestado").ToString();
                            int cestadosocio = int.Parse(obj.GetDatos("cestadosocio").ToString());
                            string ordengeneral = obj.GetDatos("ordengen").ToString();

                            long? cgrado = (long)obj.GetDatos("cgrado");
                            long? cgradoproximo = null;
                            int? csubestado = null;
                            string observaciones = string.Empty;
                            if (obj.GetDatos("cgradoproximo") != null)
                            {
                                cgradoproximo = (long)obj.GetDatos("cgradoproximo");
                            }
                            if (obj.GetDatos("csubestado") != null)
                            {
                                csubestado = (int)obj.GetDatos("csubestado");
                            }
                            if (obj.GetDatos("observaciones") != null)
                            {
                                observaciones = obj.GetDatos("observaciones").ToString();
                            }

                            #region Validar Fechas

                            FUtil.ValidaFechas(forden, "FECHA DE ORDEN GENERAL", null, null);
                            //FUtil.ValidaFechas(festado, "FECHA DE ESTADO", null, null);
                            if (festado > forden)
                            {
                                throw new AtlasException("GEN-016", "EL CAMPO [{0}] NO PUEDE SE MAYOR A LA FECHA ORDEN ", festado);
                            }
                            
                            #endregion Validar Fechas



                            #region Valores a insertar
                            if (obj.Esnuevo == true)
                            {
                                historicoIngreso.Esnuevo = true;
                              
                            }
                            else
                            {

                                historicoIngreso = TsocCesantiaHistoricoDal.Find((long)cpersona, rm.Ccompania);
                                // historicoIngreso.AddDatos("BEANORIGINAL", historicoIngreso.Clone());
                                historicoIngreso.Actualizar = true;
                              
                            }
                            historicoIngreso.cpersona = (int)cpersona;
                            historicoIngreso.ccompania = rm.Ccompania;
                            //historicoIngreso.ccatalogoestado = ccatalogo;
                            //historicoIngreso.ccdetalleestado = cdetalleestado;
                            historicoIngreso.cestadosocio = cestadosocio;
                            historicoIngreso.csubestado = csubestado;
                            historicoIngreso.festado = festado;
                            historicoIngreso.ordengen = ordengeneral;
                            historicoIngreso.fordengen = forden;
                            historicoIngreso.cgradoactual = cgrado;
                            historicoIngreso.cgradoproximo = cgradoproximo;
                            historicoIngreso.observaciones = observaciones;
                            historicoIngreso.cusuariomod = obj.cusuarioing;
                            historicoIngreso.fmodificacion = obj.fingreso;
                            //historicoIngreso.estado = true;
                            rm.AdicionarTabla("tsoccesantiahistorico", historicoIngreso, 0, false);

                            #endregion Valores a insertar
                        }
                    }
                }
            }



        }

    }
}
