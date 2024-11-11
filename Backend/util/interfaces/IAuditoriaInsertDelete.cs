using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.interfaces {
    public interface IAuditoriaInsertDelete {
        void Procesar(AbstractDto bean, bool crear);
    }
}
