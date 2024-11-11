using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.interfaces {
    public interface IVersionRegistro {
        bool IsVersionReg(IBean bean);
    }
}
