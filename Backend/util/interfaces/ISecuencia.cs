using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {

    public interface ISecuencia {
        bool SetSecuencia(AbstractDto bean, String nombretabla, ref int isecuencial);
    }
}
