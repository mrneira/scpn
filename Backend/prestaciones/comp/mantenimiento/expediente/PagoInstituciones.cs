using core.componente;
using dal.contabilidad;
using dal.generales;
using dal.persona;
using dal.prestaciones;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.expediente {
    public class PagoInstituciones : ComponenteMantenimiento {
        /// <summary>
        /// Clase que calcula los valores de los beneficiarios
        /// </summary>
        /// <param name="rm"></param>
        public override void Ejecutar(RqMantenimiento rm) {
            IList<tprebeneficiario> lresp = new List<tprebeneficiario>();
            IList<tprebeneficiario> lbenPago = new List<tprebeneficiario>();
            tperproveedor prov; tperreferenciabancaria refBan; tprebeneficiario ben;
            if (rm.GetTabla("BENEFICIARIOS") == null || rm.GetTabla("BENEFICIARIOS").Lregistros.Count() <= 0) {
                if (!rm.Mdatos.ContainsKey("secuencia")) {
                    return;
                }

               // if(rm.Cmodulo.Equals(28) && rm.Cterminal.Equals())

                int secuencia = int.Parse(rm.Mdatos["secuencia"].ToString());

                // beneficiarios pago externo ISPOL o comandancia
                IList<tsocnovedadades> lnovedad = TsocNovedadesDal.FindToNovedadesACT(int.Parse(rm.Mdatos["cpersona"].ToString()), rm.Ccompania);

                foreach (tsocnovedadades novedades in lnovedad) {
                    string nombrecomercial = string.Empty;
                    tprepago pago = TprePagoDal.Find(novedades.cdetallenovedad);
                    tprebeneficiario benAdd = null;

                    if (pago != null) {
                        foreach (tprebeneficiario obj in lbenPago) {
                            if (obj.Mdatos.ContainsKey("proveedor")) {
                                if (obj.GetInt("proveedor") == (pago.cpersona)) {
                                    benAdd = obj;
                                    break;
                                }
                            }
                        }
                        if (benAdd == null) {
                            prov = TperProveedorDal.Find((long)pago.cpersona, rm.Ccompania);
                            refBan = TperReferenciaBancariaDal.Find((long)pago.cpersona, rm.Ccompania);
                            ben = TpreBeneficiarioDal.FindToIdentidicacion(secuencia, prov.identificacion);
                            if (ben == null) {
                                benAdd = new tprebeneficiario();
                                benAdd.Esnuevo = true;
                            } else {
                                ben.Actualizar = true;
                                benAdd = ben;
                            }

                            benAdd.valorliquidacion = 0;
                            decimal? valornovedad = benAdd.valorliquidacion + novedades.valor;
                            benAdd.AddDatos("proveedor", pago.cpersona);
                            benAdd.secuencia = secuencia;
                            benAdd.identificacion = prov.identificacion;
                            benAdd.ccatalogoparentesco = 1126;
                            benAdd.cdetalleparentesco = "0";
                            benAdd.fechanacimiento = rm.Freal;
                            nombrecomercial = NormalizeLength(prov.nombrecomercial, 30);
                            benAdd.primernombre = nombrecomercial;
                            benAdd.segundonombre = string.Empty;
                            benAdd.primerapellido = string.Empty;
                            benAdd.segundoapellido = string.Empty;
                            benAdd.tipoinstitucionccatalogo = refBan.tipoinstitucionccatalogo;
                            benAdd.tipoinstitucioncdetalle = refBan.tipoinstitucioncdetalle;
                            benAdd.tipocuentaccatalogo = refBan.tipocuentaccatalogo;
                            benAdd.tipocuentacdetalle = refBan.tipocuentacdetalle;
                            benAdd.numerocuenta = refBan.numero;
                            benAdd.valorliquidacion = valornovedad;
                            benAdd.estado = true;
                            benAdd.pagoexterno = true;
                            benAdd.curador = false;
                            if (benAdd.ccatalogoparentesco != 0 && benAdd.cdetalleparentesco != null) {
                                tgencatalogodetalle catalogodetallep = TgenCatalogoDetalleDal.Find((int)benAdd.ccatalogoparentesco, benAdd.cdetalleparentesco);
                                benAdd.AddDatos("nparentezco", catalogodetallep.nombre);
                            }
                            if (benAdd.tipoinstitucionccatalogo != 0 && benAdd.tipoinstitucioncdetalle != null) {
                                tgencatalogodetalle catalogodetalle = TgenCatalogoDetalleDal.Find((int)benAdd.tipoinstitucionccatalogo, benAdd.tipoinstitucioncdetalle);
                                benAdd.AddDatos("nbanco", catalogodetalle.nombre);
                            }
                            // if (ben == null) {
                        
                            lbenPago.Add(benAdd);
                            lresp.Add(benAdd);
                            rm.AdicionarTabla("BENEFICIARIOPAGO", lbenPago, false);
                            //}
                        } else {
                            //   decimal? valornovedad = benAdd.valorliquidacion + novedades.valor;
                            benAdd.valorliquidacion = benAdd.valorliquidacion + novedades.valor;
                        }
                    }
                }
                rm.Response["BENEFICIARIOSFINALINST"] = lresp;
            }
        }

        public string NormalizeLength(string value, int maxLength) {
            return value.Length <= maxLength ? value : value.Substring(0, maxLength);
        }
    }
}
