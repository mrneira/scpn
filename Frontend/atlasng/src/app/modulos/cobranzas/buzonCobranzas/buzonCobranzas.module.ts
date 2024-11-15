import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { BuzonCobranzasRoutingModule } from './buzonCobranzas.routing';

import { BuzonCobranzasComponent } from './componentes/buzonCobranzas.component';

@NgModule({
  imports: [SharedModule, BuzonCobranzasRoutingModule],
  declarations: [BuzonCobranzasComponent]
})
export class BuzonCobranzasModule { }
