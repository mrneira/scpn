import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CobromigradasRoutingModule } from './cobromigradas.routing';
//import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
import { CobromigradasComponent } from './componentes/cobromigradas.component';


@NgModule({
  imports: [SharedModule, CobromigradasRoutingModule ],
  declarations: [ CobromigradasComponent]
})
export class CobromigradasModule { }
