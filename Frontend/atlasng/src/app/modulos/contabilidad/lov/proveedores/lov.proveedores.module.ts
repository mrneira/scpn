import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovProveedoresRoutingModule } from './lov.proveedores.routing';

import { LovProveedoresComponent } from './componentes/lov.proveedores.component';

@NgModule({
  imports: [SharedModule, LovProveedoresRoutingModule],
  declarations: [LovProveedoresComponent],
  exports: [LovProveedoresComponent],
})
export class LovProveedoresModule { }