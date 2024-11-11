using dal.monetario;
using modelo;
using modelo.servicios;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarSolicitudDesembolsoDal {

        /// <summary>
        /// Consulta los datos de los desembolsos asociadas a una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="ccompania">Numero de solicitud.</param>
        /// <returns></returns>
        public static IList<tcarsolicituddesembolso> Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicituddesembolso.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
        }

        /// <summary>
        /// Entrega el valor total de desembolso.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="ccompania">Numero de solicitud.</param>
        /// <returns></returns>
        public static decimal GetTotalDesembolso(long csolicitud)
        {
            List<tcarsolicituddesembolso> obj = new List<tcarsolicituddesembolso>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcarsolicituddesembolso.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
            return obj.Sum(a => a.valor.Value);
        }

        /// <summary>
        /// Metodo que transforma los datos de desembolsos asociados a una solicitud de credito, a una lista de desembolsos 
        /// asociadas a una operacion de cartera.
        /// </summary>
        /// <param name="lsolicituddesembolso">Lista de desembolsos asociadas a la solicitud.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static List<tcaroperaciondesembolso> ToTcarOperacionDesembolso(IList<tcarsolicituddesembolso> lsolicituddesembolso, string coperacion,int ccompania)
        {
            List<tcaroperaciondesembolso> ldesembolso = new List<tcaroperaciondesembolso>();
            foreach (tcarsolicituddesembolso soldes in lsolicituddesembolso) {
                tcaroperaciondesembolso d = new tcaroperaciondesembolso();
                d.coperacion = coperacion;
                d.secuencia = soldes.secuencia;
                d.tipo = soldes.tipo;
                d.valor = soldes.valor;                
                d.crubro = soldes.crubro;
                d.csaldo = soldes.csaldo;
                d.ccuenta = TmonSaldoDal.Find(d.csaldo).codigocontable;
                d.tipoidentificacionccatalogo = soldes.tipoidentificacionccatalogo;
                d.tipoidentificacioncdetalle = soldes.tipoidentificacioncdetalle;
                d.identificacionbeneficiario = soldes.identificacionbeneficiario;
                d.nombrebeneficiario = soldes.nombrebeneficiario;
                d.tipoinstitucionccatalogo = soldes.tipoinstitucionccatalogo;
                d.tipoinstitucioncdetalle = soldes.tipoinstitucioncdetalle;
                d.tipocuentaccatalogo = soldes.tipocuentaccatalogo;
                d.tipocuentacdetalle = soldes.tipocuentacdetalle;
                d.numerocuentabancaria = soldes.numerocuentabancaria;
                d.cuentacliente = soldes.cuentacliente;
                d.transferencia = soldes.transferencia;
                d.comentario = soldes.comentario;
                d.pagado = soldes.pagado;
                ldesembolso.Add(d);
            }
            return ldesembolso;
        }

    }
}
