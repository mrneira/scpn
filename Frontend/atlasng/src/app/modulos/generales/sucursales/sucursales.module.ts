import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { SucursalesRoutingModule } from './sucursales.routing';

import { SucursalesComponent } from './componentes/sucursales.component';


@NgModule({
  imports: [SharedModule, SucursalesRoutingModule ],
  declarations: [SucursalesComponent]
})
export class SucursalesModule { }
