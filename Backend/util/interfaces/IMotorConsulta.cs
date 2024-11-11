using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.interfaces {
    public interface IMotorConsulta {
        object ConsultarPorPk(string nombreBean, Dictionary<string, string> mcriterios);
    }
}
