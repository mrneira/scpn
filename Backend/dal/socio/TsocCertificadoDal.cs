using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.socio {
    public class TsocCertificadoDal {
        /// <summary>
        /// Verificar si el socio ya fue registrado anteriormente para la generación del certificado (Socios que a un no se encuentran en el sistema atlas)
        /// </summary>
        /// <param name="identificacion"></param>
        /// <returns></returns>
        public static tsoccertificado Find(string identificacion)
        {
            tsoccertificado obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            if (identificacion != null)
            {
                obj = contexto.tsoccertificado.AsNoTracking().Where(x => x.identificacion == identificacion && x.verreg == 0).SingleOrDefault();
            }else {
                throw new Exception("SOC-777, NO A ENVIADO LA IDENTIFICACIÓN DEL SOCIO");
            }
            return obj;
        }
    }
}
