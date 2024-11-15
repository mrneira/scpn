import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CuotasRoutingModule } from './cuotas.routing';

import { CuotasComponent } from './componentes/cuotas.component';


@NgModule({
  imports: [SharedModule, CuotasRoutingModule ],
  declarations: [CuotasComponent],
  exports: [CuotasComponent]
})
export class CuotasModule { }
