import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovNominaRoutingModule } from './lov.nomina.routing';
import { LovNominaComponent } from './componentes/lov.nomina.component';

@NgModule({
  imports: [SharedModule, LovNominaRoutingModule],
  declarations: [LovNominaComponent],
  exports: [LovNominaComponent]
})
export class LovNominaModule { }

