import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CalendarioContableRoutingModule } from './calendarioContable.routing';

import { CalendarioContableComponent } from './componentes/calendarioContable.component';


@NgModule({
  imports: [SharedModule, CalendarioContableRoutingModule ],
  declarations: [CalendarioContableComponent]
})
export class CalendarioContableModule { }
