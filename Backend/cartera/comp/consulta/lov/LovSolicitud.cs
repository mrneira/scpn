using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util.dto.consulta;

namespace cartera.comp.consulta.lov {

    /// <summary>
    /// Clase que consulta solicitudes por cliente. 
    /// </summary>
    public class LovSolicitud : ComponenteConsulta {


        private Dictionary<string, object> mparametros = new Dictionary<string, object>();

        /// <summary>
        /// Map con el orden campos a aplicar a la consulta
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            DtoConsulta dtoconsulta = rqconsulta.Mconsulta["LOVSOLICITUDCARTERA"];
            List<tcarsolicitud> ldatos = new List<tcarsolicitud>();
            IList<Dictionary<string, object>> lresp = TcarSolicitudDal.ConsultarLovSolicitud(dtoconsulta, rqconsulta);

            foreach (Dictionary<string, object> obj in lresp) {
                tcarsolicitud d = new tcarsolicitud();
                d.AddDatos("producto", obj["producto"].ToString());
                d.AddDatos("tipo", obj["tipo"].ToString());
                d.AddDatos("moneda", obj["moneda"].ToString());
                d.AddDatos("estatus", obj["estatus"].ToString());
                d.AddDatos("montooriginal", obj["montooriginal"].ToString());
                d.AddDatos("csolicitud", obj["csolicitud"].ToString());
                ldatos.Add(d);
            }
            rqconsulta.Response["LOVSOLICITUDCARTERA"] = ldatos;
        }


    }

}
