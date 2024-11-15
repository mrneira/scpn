using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionCalificaHistoria.
    /// </summary>
    public class TcarOperacionCalificaHistoriaDal {

        /// <summary>
        /// Metodo que crea y entraga un registro de historia de datos de la calificacion de operacion de cartera.
        /// </summary>
        public static void CreaHistoria(tcaroperacioncalificacion tcarOperacionCalificacion, int fcalificacion) {
		    if (tcarOperacionCalificacion.fcalificacion == null
				    || tcarOperacionCalificacion.fcalificacion.CompareTo(fcalificacion) == 0) {
			    return;
		    }
            tcaroperacioncalificahistoria obj = new tcaroperacioncalificahistoria();
            obj.coperacion = tcarOperacionCalificacion.coperacion;
            obj.fcalificacion = tcarOperacionCalificacion.fcalificacion;
		    
            List<String> lcampos = DtoUtil.GetCamposSinPK(obj);
		    foreach (string campo in lcampos) {
			    if (campo.Equals("mensaje") || campo.Equals("fcalificacion")) {
				    continue;
			    }
			    try {
                    Object valor = DtoUtil.GetValorCampo(tcarOperacionCalificacion, campo);
                    DtoUtil.SetValorCampo(obj, campo, valor);
			    } catch (Exception e) {
				    throw new AtlasException("BCAR-0004", "CAMPO: {0} NO DEFINIDO EN LA TABLA DE HISTORIA: {1} ", campo, obj.GetType().Name);
			    }
		    }
            Sessionef.Grabar(obj);
	    }

        /// <summary>
        /// Crea un objeto de tipo TcarOperacionCalificacion, sin incluir calificacion.
        /// </summary>
        public static tcaroperacioncalificacion Crear(tcaroperacion tcarOperacion) {
            tcaroperacioncalificacion obj = new tcaroperacioncalificacion();
            obj.coperacion = tcarOperacion.coperacion;
		    obj.cmoneda = tcarOperacion.cmoneda;
            obj.csegmento = tcarOperacion.csegmento;
            obj.cestadooperacion = tcarOperacion.cestadooperacion;
		    obj.monto = Decimal.Zero;
            obj.saldo = Decimal.Zero;
		    obj.porcentajeprovconstituida = Decimal.Zero;
		    obj.porcentajeprovconstituidaant = Decimal.Zero;
		    obj.porcentajeprovisionreq = Decimal.Zero;
		    obj.porcentajeprovisionreqant = Decimal.Zero;
            obj.provisionrequerida = Decimal.Zero;
            obj.provisionconstituida = Decimal.Zero;
            obj.provisionrequeridaant = Decimal.Zero;
            obj.provisionconstituidaant = Decimal.Zero;
            obj.diasmorosidad = 0;
		    obj.contabilizaprovision = false;
		    obj.reversoprovanterior = false;
		    return obj;
	    }

        /// <summary>
        /// Devuelbe la primera calificación, con la que se aperturó un crédito.
        /// </summary>
        public static tcaroperacioncalificahistoria GetPrimeCalificacion(int coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List <tcaroperacioncalificahistoria> calis = contexto.Database.SqlQuery<tcaroperacioncalificahistoria>("select top 1 * from tcaroperacioncalificahistoria where coperacion = @coperacion and ccalificacion is not null order by fcalificacion;", new SqlParameter("coperacion", coperacion)).ToList();
            if (calis != null && calis.Count>0)
            {
                return calis[0];
            }
            else
            {
                return null;
            }
        }
    }
}
