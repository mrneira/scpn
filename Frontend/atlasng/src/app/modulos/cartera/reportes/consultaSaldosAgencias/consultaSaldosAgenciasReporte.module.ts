import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaSaldosAgenciasReporteRoutingModule } from './consultaSaldosAgenciasReporte.routing';

import { ConsultaSaldosAgenciasReporteComponent } from './componentes/consultaSaldosAgenciasReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { ProductosModule }  from "../../productos/productoingreso/submodulos/productos/_productos.module";



@NgModule({
  imports: [SharedModule, ConsultaSaldosAgenciasReporteRoutingModule, JasperModule, ProductosModule, ProductoModule, TipoProductoModule ],
  declarations: [ConsultaSaldosAgenciasReporteComponent]

})
export class ConsultaSaldosAgenciasReporteModule { }
