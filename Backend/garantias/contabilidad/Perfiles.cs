using dal.garantias.parametros;
using modelo;
using System;

namespace garantias.contabilidad {

    /// <summary>
    /// Clase que se encarga de remplazar los codigos contables asociados a perfiles.
    /// </summary>
    public class Perfiles {

        /// <summary>
        /// Datos de una garantia.
        /// </summary>
        private tgaroperacion tgaroperacion;

        private static String tipogartipobien = "-G";


        /// <summary>
        /// Crea una instancia de perfiles.
        /// </summary>
        /// <param name="tcaroperacion"></param>
        public Perfiles(tgaroperacion tgaroperacion) {
            this.tgaroperacion = tgaroperacion;
        }

        public String RemplazaCodigoContable(string codigocontable) {
		    if (codigocontable.IndexOf(Perfiles.tipogartipobien) < 0) {
			    return codigocontable;
		        }
            tgartipobien tbien = TgarTipoBienDal.Find(tgaroperacion.ctipogarantia, tgaroperacion.ctipobien);
            codigocontable = codigocontable.ToUpper().Replace(Perfiles.tipogartipobien, tbien.codigocontable);
		    return codigocontable;
	    }

    }
}
