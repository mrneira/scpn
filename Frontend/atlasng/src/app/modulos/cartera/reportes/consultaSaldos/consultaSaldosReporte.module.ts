import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaSaldosReporteRoutingModule } from './consultaSaldosReporte.routing';

import { ConsultaSaldosReporteComponent } from './componentes/consultaSaldosReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { ProductoModule } from '../../../generales/producto/producto.module';
import { TipoProductoModule } from '../../../generales/tipoproducto/tipoProducto.module';
import { ProductosModule }  from "./../../productos/productoingreso/submodulos/productos/_productos.module";



@NgModule({
  imports: [SharedModule, ConsultaSaldosReporteRoutingModule, JasperModule, ProductosModule, ProductoModule, TipoProductoModule ],
  declarations: [ConsultaSaldosReporteComponent]

})
export class ConsultaSaldosReporteModule { }
