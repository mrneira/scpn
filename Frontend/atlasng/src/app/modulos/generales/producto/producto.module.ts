import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ProductoRoutingModule } from './producto.routing';

import { ProductoComponent } from './componentes/producto.component';


@NgModule({
  imports: [SharedModule, ProductoRoutingModule ],
  declarations: [ProductoComponent]
})
export class ProductoModule { }
