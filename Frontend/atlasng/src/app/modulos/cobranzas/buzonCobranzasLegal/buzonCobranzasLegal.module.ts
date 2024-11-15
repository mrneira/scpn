import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { BuzonCobranzasLegalRoutingModule } from './buzonCobranzasLegal.routing';

import { BuzonCobranzasLegalComponent } from './componentes/buzonCobranzasLegal.component';

@NgModule({
  imports: [SharedModule, BuzonCobranzasLegalRoutingModule],
  declarations: [BuzonCobranzasLegalComponent]
})
export class BuzonCobranzasLegalModule { }
