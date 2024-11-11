using core.componente;
using core.servicios;
using dal.generales;
using dal.prestaciones;
using dal.socio;
using dal.contabilidad;
using dal.persona;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.expediente {
    class Beneficiario : ComponenteMantenimiento {
        /// <summary>
        /// Clase que calcula los valores de los beneficiarios
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            IList<tprebeneficiario> lresp = new List<tprebeneficiario>();
            IList<tprebeneficiario> lbenNormal = new List<tprebeneficiario>();
                       
            if (rm.GetTabla("BENEFICIARIOS") == null || rm.GetTabla("BENEFICIARIOS").Lregistros.Count() <= 0) {
                if (!rm.Mdatos.ContainsKey("secuencia")) {
                    return;
                }
                int secuencia = int.Parse(rm.Mdatos["secuencia"].ToString());
                bool anticipo = (bool)(rm.Mdatos["anticipo"]);
                IList<tprebeneficiario> lben = TpreBeneficiarioDal.FindBeneficiarios(secuencia, false);
                if (lben.Count() == 0) {
                    return;
                }

                decimal valor = 0, auxvalor = 0, valorsolicitado = 0, valorinicial = 0;

                if (anticipo) {
                    valorsolicitado = decimal.Parse(rm.Mdatos["valorsolicitado"].ToString());
                    if (valorsolicitado > 0) {
                        valorinicial = decimal.Round(valorsolicitado / lben.Count, 2);
                        valor = valorsolicitado;
                    } else {
                        valorinicial = decimal.Round(decimal.Parse(rm.Mdatos["total"].ToString()) / lben.Count, 2);
                        valor = decimal.Parse(rm.Mdatos["total"].ToString());
                    }
                } else {
                    valorinicial = decimal.Round(decimal.Parse(rm.Mdatos["total"].ToString()) / lben.Count, 2);
                    valor = decimal.Parse(rm.Mdatos["total"].ToString());
                }

                int i = 1;
                foreach (tprebeneficiario obj in lben) {
                    obj.Actualizar = true;
                    if (lben.Count().Equals(i)) {
                        obj.valorliquidacion = decimal.Round(valor, 2);
                    } else {
                        auxvalor = valor - valorinicial;
                        obj.valorliquidacion = decimal.Round(valorinicial, 2);
                    }
                    if (obj.ccatalogoparentesco != 0 && obj.cdetalleparentesco != null) {
                        tgencatalogodetalle catalogodetallep = TgenCatalogoDetalleDal.Find((int)obj.ccatalogoparentesco, obj.cdetalleparentesco);
                        obj.AddDatos("nparentezco", catalogodetallep.nombre);
                    }
                    if (obj.tipoinstitucionccatalogo != 0 && obj.tipoinstitucioncdetalle != null) {
                        tgencatalogodetalle catalogodetalle = TgenCatalogoDetalleDal.Find((int)obj.tipoinstitucionccatalogo, obj.tipoinstitucioncdetalle);
                        obj.AddDatos("nbanco", catalogodetalle.nombre);
                    }
                    valor = auxvalor;
                    i += 1;
                    lbenNormal.Add(obj);
                    lresp.Add(obj);
                }
                                
                rm.AdicionarTabla("BENEFICIARIOSFINAL", lbenNormal, false);
                rm.Response["BENEFICIARIOSFINAL"] = lresp;
            } else {
                List<tprebeneficiario> ldatos = rm.GetTabla("BENEFICIARIOS").Lregistros.Cast<tprebeneficiario>().ToList();
                int secuencia = int.Parse(rm.Mdatos["secuencia"].ToString());
                bool anticipo = (bool)(rm.Mdatos["anticipo"]);
                decimal valor = 0, auxvalor = 0, valorsolicitado = 0, valorinicial = 0;
                if (anticipo) {
                    valorsolicitado = decimal.Parse(rm.Mdatos["valorsolicitado"].ToString());
                    if (valorsolicitado > 0) {
                        valorinicial = decimal.Round(valorsolicitado / ldatos.Count, 2);
                        valor = valorsolicitado;
                    } else {
                        valorinicial = decimal.Round(decimal.Parse(rm.Mdatos["total"].ToString()) / ldatos.Count, 2);
                        valor = decimal.Parse(rm.Mdatos["total"].ToString());
                    }
                } else {
                    valorinicial = decimal.Round(decimal.Parse(rm.Mdatos["total"].ToString()) / ldatos.Count, 2);
                    valor = decimal.Parse(rm.Mdatos["total"].ToString());
                }

                int i = 1;
                foreach (tprebeneficiario obj in ldatos) {
                    if (obj.Esnuevo) {
                        obj.secuencia = secuencia;
                    }
                    if (ldatos.Count().Equals(i)) {
                        obj.valorliquidacion = decimal.Round(valor, 2);
                    } else {
                        auxvalor = valor - valorinicial;
                        obj.valorliquidacion = decimal.Round(valorinicial, 2);
                    }
                    valor = auxvalor;
                    i += 1;
                    lresp.Add(obj);
                }
                rm.Response["BENEFICIARIOSFINAL"] = lresp;
            }
        }
    }
}
