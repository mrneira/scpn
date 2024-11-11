using dal.generales;
using dal.talentohumano;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.enums;

namespace talentohumano.datos
{
    public static class Solicitud
    {
        public static IList<tnomsolicitud> completarDatos(IList<tnomsolicitud> solbusqueda)
        {
            //Lista procesada
            IList<tnomsolicitud> solicitudes = new List<tnomsolicitud>();

            foreach (tnomsolicitud sol in solbusqueda)
            {
                tthcontratodetalle con = TthContratoDal.FindContratoFuncionario(sol.cfuncionario.Value);
                if (con != null)
                {

                    tthfuncionariodetalle fun = TthFuncionarioDal.Find(long.Parse(sol.cfuncionario.ToString()));
                    tthcargo carg = TthcargoDal.FindInDataBaseCodigo(con.ccargo);
                    tthdepartamento dep = TthDepartamentoDal.FindDepartamento(long.Parse(carg.cdepartamento.ToString()));
                    tgencatalogodetalle tipo = TgenCatalogoDetalleDal.Find(int.Parse(sol.tipoccatalogo.ToString()), sol.tipocdetalle);
                    tgencatalogodetalle estado = TgenCatalogoDetalleDal.Find(int.Parse(sol.estadoccatalogo.ToString()), sol.estadocdetalle);
                    tthproceso pro = TthProcesoDal.FindPrceso(dep.cproceso);

                    //Solicitud procesada
                    tnomsolicitud sp = sol;
                    //Datos generales de la solicitud
                    sp.AddDatos("ntipo", tipo.nombre);
                    sp.AddDatos("nestado", estado.nombre);

                    sp.AddDatos("nfuncionario", fun.primernombre + " " + fun.primerapellido);
                    sp.AddDatos("ncfuncionario", fun.primernombre + " " + fun.segundonombre + " " + fun.primerapellido + " " + fun.segundoapellido);

                    sp.AddDatos("ncargo", carg.nombre);
                    sp.AddDatos("ndepartamento", dep.nombre);
                    sp.AddDatos("nproceso", pro.nombre);

                    sp.AddDatos("ndepartamentoAb", dep.abreviatura);

                    if (sp.tipocdetalle.Equals(EnumSolicitud.PERMISO.Value))
                    {
                        tnompermiso per = TnomPermisoDal.FindSolicitud(sp.csolicitud);
                        tgencatalogodetalle tipopermiso = TgenCatalogoDetalleDal.Find(int.Parse(per.permisoccatalogo.ToString()), per.permisocdetalle);
                        sp.AddDatos("ntipoper", tipopermiso.nombre);

                        sp.AddDatos("finicio", per.finicio);
                        sp.AddDatos("ffin", per.ffin);
                        sp.AddDatos("diacompleto", per.diacompleto);
                        if (per.hinicio.HasValue)
                        {
                            sp.AddDatos("hinicio", per.hinicio.Value.ToString("HH:mm"));
                        }
                        if (per.hinicio.HasValue)
                        {
                            sp.AddDatos("hfin", per.hfin.Value.ToString("HH:mm"));
                        }
                        sp.AddDatos("motivo", per.motivo);
                        if (per.cgesarchivo.HasValue)
                        {
                            sp.AddDatos("archivo", true);
                            sp.AddDatos("cgesarchivo", per.cgesarchivo);
                        }
                        else
                        {
                            sp.AddDatos("archivo", false);
                        }

                    }
                    if (sp.tipocdetalle.Equals(EnumSolicitud.VACACION.Value))
                    {
                        tnomvacacion vac = TthnomVacacionDal.FindAnio(sp.csolicitud);
                        tthfuncionariodetalle remplazo = TthFuncionarioDal.Find(long.Parse(vac.remplazocfuncionario.ToString()));
                        sp.AddDatos("rnfuncionario", remplazo.primernombre + " " + remplazo.segundonombre);
                        sp.AddDatos("finicio", vac.finicio);
                        sp.AddDatos("ffin", vac.ffin);
                        sp.AddDatos("dias", vac.dias);
                        sp.AddDatos("restantes", vac.restantes);
                        sp.AddDatos("cambio", vac.cambio);
                        if (vac.cgesarchivo != null)
                        {
                            sp.AddDatos("archivo", true);
                            sp.AddDatos("cgesarchivo", vac.cgesarchivo);
                        }
                        else
                        {
                            sp.AddDatos("archivo", false);
                        }

                    }
                    if (sp.tipocdetalle.Equals(EnumSolicitud.HORAEXTRA.Value))
                    {
                        tnomhoraextra hex = TnomHoraExtraDal.FindSolicitud(sp.csolicitud);
                        //tipo de hora extra
                        tgencatalogodetalle tiph = TgenCatalogoDetalleDal.Find(int.Parse(hex.tipoccatalogo.ToString()), hex.tipocdetalle);
                        sp.AddDatos("ntipoh", tiph.nombre);
                        sp.AddDatos("finicio", hex.finicio);
                        sp.AddDatos("ffin", hex.ffin);
                        sp.AddDatos("totalhoras", hex.totalhoras);
                    }

                    solicitudes.Add(sp);
                }
            }
            return solicitudes;
        }
    }
}
