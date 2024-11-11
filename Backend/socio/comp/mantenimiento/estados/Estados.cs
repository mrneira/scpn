using core.componente;
using dal.socio;
using dal.prestaciones;
using modelo;
using modelo.interfaces;
using socio.datos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using modelo.helper;

namespace socio.comp.mantenimiento.estados {
    public class Estados : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {
            if (rm.GetTabla("HISTORICO") == null || rm.GetTabla("HISTORICO").Lregistros.Count() <= 0) {
                return;
            }
            //long? cpersona = rm.Cpersona;
            List<IBean> ldatos = rm.GetTabla("HISTORICO").Lregistros;
            tsoccesantiahistorico Registro;
            tsoccesantiahistorico his = null;
            IList<tpreaporte> laporte = null;
            IList<tpreaporte> laporteUpdate = new List<tpreaporte>();
            tsoccesantia socio;
            Registro = (tsoccesantiahistorico)rm.GetTabla("HISTORICO").Lregistros.ElementAt(0);

            TsocCesantiaHistoricoDal.eliminarRegistrosvreg(Registro.cpersona,rm.Ccompania);
            socio = TsocCesantiaDal.Find((int)Registro.cpersona, Registro.ccompania);
            Socios socios = new Socios((int)Registro.cpersona, rm);
            long maxsecuencia = (long)TsocCesantiaHistoricoDal.GetMaxSecuenciaHistorico((int)Registro.cpersona, Registro.ccompania) + 1;
            // Reincorporados
            if (socio.ccdetalletipoestado.Equals("BLQ")) {
                // Actualiza aportes - actualizar para que no sean validos los aportes
                laporte = TpreAportesDal.FindPorPersona((int)Registro.cpersona);
                foreach (tpreaporte aporte in laporte) {
                    EntityHelper.SetActualizar(aporte);
                    aporte.valido = false;
                    laporteUpdate.Add(aporte);
                }
                rm.AdicionarTabla("APORTESREINCO>RPORADOS", laporteUpdate, false);
            }

            if (Registro.Esnuevo) {
                tsocestadosocio EST = TsocEstadoSocioDal.Find(Registro.cestadosocio.Value);
                socio.ccdetalletipoestado = EST.cdetalleestatus;
                Registro.secuencia = (int)maxsecuencia;
                Registro.fechaproceso = rm.Freal;
                Registro.activo = Registro.activo ?? true;
                socio.secuenciahistorico = (int)maxsecuencia;
                socio.fingreso = Registro.cestadosocio != 8 ? socio.fingreso : Registro.festado;
                rm.AdicionarTabla("tsoccesantiahistorico", Registro, false);
                rm.AdicionarTabla("tsoccesantia", socio, false);
            }
            if (Registro.Actualizar) {

                long maxsecuenciaActiva = (long)TsocCesantiaHistoricoDal.GetMaxSecuenciaActiva((int)Registro.cpersona, Registro.ccompania);
                if (Registro.activo.Value) {

                    socio.secuenciahistorico = (Registro.secuencia > maxsecuenciaActiva) ? Registro.secuencia : (int)maxsecuenciaActiva;

                    tsoccesantiahistorico sh = TsocCesantiaHistoricoDal.Find(socio.cpersona, socio.ccompania, socio.secuenciahistorico);
                    tsocestadosocio EST = TsocEstadoSocioDal.Find(sh.cestadosocio.Value);
                    socio.ccdetalletipoestado = EST.cdetalleestatus;

                } else {
                    if (Registro.secuencia == maxsecuenciaActiva) {
                        socio.secuenciahistorico = (int)this.secuenciaActiva(maxsecuenciaActiva, Registro);
                        //socio.secuenciahistorico=(int)maxsecuenciaActiva - 1;
                        tsoccesantiahistorico sh = TsocCesantiaHistoricoDal.Find(socio.cpersona, socio.ccompania, socio.secuenciahistorico);
                        tsocestadosocio EST = TsocEstadoSocioDal.Find(sh.cestadosocio.Value);
                        socio.ccdetalletipoestado = EST.cdetalleestatus;

                        //rm.Mtablas["HISTORICO"] = null;
                    }
                }

                socio.fingreso = Registro.cestadosocio != 8 ? socio.fingreso : Registro.festado;

                if (maxsecuenciaActiva == 0 || Registro.secuencia == 1) {
                    throw new AtlasException("PRE-015", "NO SE PUEDE ACTUALIZAR EL ESTADO DEL REGISTRO {0}", Registro.secuencia);
                }

                rm.AdicionarTabla("tsoccesantia", socio, false);
            }

        }

        private long secuenciaActiva(long maxsecuenciaActiva, tsoccesantiahistorico Registro) {
            maxsecuenciaActiva = (long)TsocCesantiaHistoricoDal.GetMaxSecuenciaToSecuencia((int)Registro.cpersona, Registro.ccompania, (int)maxsecuenciaActiva);
            return maxsecuenciaActiva;
        }
    }
}



