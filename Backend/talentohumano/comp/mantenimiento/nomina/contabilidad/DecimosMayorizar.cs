using bce.util;
using core.componente;
using dal.contabilidad;
using dal.talentohumano;
using dal.talentohumano.nomina;
using modelo;
using modelo.helper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace talentohumano.comp.mantenimiento.nomina.contabilidad
{
    public class DecimosMayorizar : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            var dlnomina = JsonConvert.DeserializeObject<IList<tnomnomina>>(@rm.Mdatos["nomina"].ToString());
            bool aprobada = (bool)rm.Mdatos["aprobada"];
            tconcomprobante comp = null;
            IList<tconcomprobantedetalle> compdt = null;
            IList<tnomdecimotercero> dter = new List<tnomdecimotercero>();
            IList<tnomdecimocuarto> dcua = new List<tnomdecimocuarto>();

            foreach (tnomnomina nomina in dlnomina)
            {
                if (aprobada)
                {
                    comp = TconComprobanteDal.FindComprobante(nomina.ccomprobante);
                    //ACTUALIZO A MAYORIZADO
                    comp.automatico = true;
                    comp.Actualizar = true;
                    comp.actualizosaldo = true;
                    IList<tconcomprobantedetalle> compd = TconComprobanteDetalleDal.Find(nomina.ccomprobante, rm.Ccompania);
                    compdt = new List<tconcomprobantedetalle>();
                    IList<tpreexpedientedetalle> TPED = new List<tpreexpedientedetalle>();
                    foreach (tconcomprobantedetalle cd in compd)
                    {
                        EntityHelper.SetActualizar(cd);
                        cd.Actualizar = true;
                        compdt.Add(cd);
                    }

                    IList<tnomrol> rolpagos = TnomRolDal.FindNomina(nomina.cnomina);

                    foreach (tnomrol rol in rolpagos)
                    {


                        tthfuncionariodetalle fun = TthFuncionarioDal.Find(rol.cfuncionario.Value);
                        String nombre = ((fun.primernombre != null) ? fun.primernombre : "") + " " +
                                ((fun.primerapellido != null) ? fun.primerapellido : "");
                        if (rol.totalley.Value > 0) { 
                        GenerarBce.InsertarPagoBce(rm, fun.documento, nombre, fun.ncuenta,
                                             fun.cpersona, fun.tipocuentaccatalogo.Value, fun.tipocuentacdetalle, fun.bancoccatalago.Value,
                                             fun.bancocdetalle, rol.totalley.Value, fun.documento, (int)rol.crol,nomina.ccomprobante); //validar juanito
                        }
                        if (nomina.tipocdetalle.Equals("DTER")) {
                            IList<tnomdecimotercero> dterpagado = TnomDecimoTerceroDal.Find(fun.cfuncionario);
                            foreach (tnomdecimotercero dt in dterpagado) {
                                dt.aniopago = nomina.anio;
                                dt.fpago = rm.Freal;
                                dt.contabilizado = true;
                                EntityHelper.SetActualizar(dt);
                                dt.Actualizar = true;
                                
                                dter.Add(dt);
                            }
                        }
                        else if (nomina.tipocdetalle.Equals("DCUA")) {
                            IList<tnomdecimocuarto> dterpagado = TnomDecimoCuartoDal.Find(fun.cfuncionario);
                            foreach (tnomdecimocuarto dt in dterpagado)
                            {
                                dt.aniopago = nomina.anio;
                                dt.fpago = rm.Freal;
                                dt.contabilizado = true;
                                EntityHelper.SetActualizar(dt);
                                dt.Actualizar = true;
                                dcua.Add(dt);
                            }
                        }
                        
                    }
                }


               

            }
            //ACTUALIZACIÓN A CONTABILIZADO SEGÚN EL DÉCIMO QUE SE ESTE PAGANDO
            rm.AdicionarTabla("tnomdecimotercero", dter, false);
            rm.AdicionarTabla("tnomdecimocuarto", dcua, false);
            rm.AdicionarTabla("tconcomprobante", comp, false);
            rm.AdicionarTabla("tconcomprobantedetalle", compdt, false);
            rm.Mdatos.Add("actualizarsaldosenlinea", true);
        }
        }
    }

