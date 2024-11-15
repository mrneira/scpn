import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { NumeroReferenciaBceRoutingModule } from './numeroreferenciabce.routing';

import { NumeroReferenciaBceComponent } from './componentes/numeroreferenciabce.component';


@NgModule({
  imports: [SharedModule, NumeroReferenciaBceRoutingModule ],
  declarations: [NumeroReferenciaBceComponent]
})
export class NumeroReferenciaBceModule { }
