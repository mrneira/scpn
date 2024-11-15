import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCargoRoutingModule } from './lov.cargo.routing';
import { LovCargoComponent } from './componentes/lov.cargo.component';

@NgModule({
  imports: [SharedModule, LovCargoRoutingModule],
  declarations: [LovCargoComponent],
  exports: [LovCargoComponent]
})
export class LovCargoModule { }

