using dal.socio;
using modelo;
using core.componente;
using System;
using util.dto.mantenimiento;
using socio.datos;
using util;

namespace socio.comp.mantenimiento.novedades {
    public class RegistroAutomatico : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm)
        {
            long cpersona = long.Parse(rm.GetDatos("cpersona").ToString());
            string reverso = "N";
            //ValidaSocio(rm, cpersona);

            tsocnovedadades novedades = TsocNovedadesDal.Crear();
            if (rm.Reverso.Equals("Y")) {
                reverso = "S";
            }

            // Valida monto de novedad
            decimal valornovedad = Constantes.CERO;
            if (rm.Mdatos.ContainsKey("montonovedad")) {
                valornovedad = (decimal)rm.GetDecimal("montonovedad");
            } else {
                valornovedad = rm.Monto;
            }

            novedades.cpersona = cpersona;
            novedades.ccompania = rm.Ccompania;
            novedades.coperacion = rm.Coperacion;
            novedades.ccatalogonovedad = 220;
            novedades.cdetallenovedad = rm.GetInt("tiponovedad").ToString();
            novedades.cusuario = rm.Cusuario;
            novedades.fecha = rm.Freal;
            novedades.novedad = rm.Comentario;
            novedades.valor = valornovedad;
            novedades.estadovalor = "ACT";
            novedades.retencion = false;
            novedades.pagado = false;
            novedades.numerooficio = rm.Documento;
            novedades.fechaoficio = DateTime.Parse(rm.GetDatos("fechaoficio").ToString());
            novedades.fecharecepcion = Fecha.GetFecha(rm.Fconatable);
            novedades.estado = "ACT";
            novedades.mensaje = rm.Mensaje;
            novedades.reverso = reverso;
            novedades.automatico = true;
            novedades.fvigencia = rm.Fconatable;

            rm.AdicionarTabla(typeof(tsocnovedadades).Name.ToUpper(), novedades, false);
        }


        public static void ValidaSocio(RqMantenimiento rq, long cpersona)
        {
            tsoccesantiahistorico hisbaja; tperpersonadetalle personadetalle;
            Socios socio = new Socios(cpersona, rq);
            hisbaja = socio.GetHistoricoSocioBaja();
            personadetalle = socio.GetPersona();

            if (hisbaja != null) {
                throw new AtlasException("PRE-017", "SOCIO ESTÁ EN BAJA {0}", personadetalle.identificacion);
            }
        }

    }
}
