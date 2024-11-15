import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { LovMapsRoutingModule } from './lov.maps.routing';

import { LovMapsComponent } from './componentes/lov.maps.component';
import { GMapModule } from 'primeng/primeng';
@NgModule({
  imports: [SharedModule, GMapModule, LovMapsRoutingModule],
  declarations: [LovMapsComponent],
  exports: [LovMapsComponent],
})
export class LovMapsModule { }