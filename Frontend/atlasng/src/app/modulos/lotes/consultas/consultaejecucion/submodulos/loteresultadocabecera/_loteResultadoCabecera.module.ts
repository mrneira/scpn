import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { LoteResultadoCabeceraRoutingModule } from './_loteResultadoCabecera.routing';

import { LoteResultadoCabeceraComponent } from './componentes/_loteResultadoCabecera.component';

@NgModule({
  imports: [SharedModule, LoteResultadoCabeceraRoutingModule],
  declarations: [LoteResultadoCabeceraComponent],
  exports: [LoteResultadoCabeceraComponent]
})
export class LoteResultadoCabeceraModule { }
