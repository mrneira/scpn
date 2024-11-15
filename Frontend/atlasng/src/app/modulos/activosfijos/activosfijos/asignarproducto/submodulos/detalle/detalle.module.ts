import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DetalleRoutingModule } from './detalle.routing';
import { DetalleComponent } from './componentes/_detalle.component';
import { LovProductosModule } from '../../../../lov/productos/lov.productos.module';
import { LovKardexProdCodiModule } from '../../../../lov/kardexprodcodi/lov.kardexprodcodi.module';


@NgModule({
  imports: [SharedModule, DetalleRoutingModule, LovProductosModule, LovKardexProdCodiModule ],
  declarations: [DetalleComponent],
  exports: [DetalleComponent]
})
export class DetalleModule { }
