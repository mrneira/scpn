import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovRentavariableRoutingModule } from './lov.rentavariable.routing';
import { LovRentavariableComponent } from './componentes/lov.rentavariable.component';

@NgModule({
  imports: [SharedModule, LovRentavariableRoutingModule ],
  declarations: [LovRentavariableComponent],
  exports: [LovRentavariableComponent],
})
export class LovRentavariableModule { }