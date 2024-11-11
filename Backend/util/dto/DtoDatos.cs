using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace util.dto {
    public class DtoDatos : AbstractDto, ICloneable {
        public virtual object Clone() {
            DtoRubro obj = (DtoRubro)this.MemberwiseClone();
            return obj;
        }
    }
}