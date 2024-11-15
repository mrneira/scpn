import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargaBceRoutingModule } from './cargabce.routing';

import { CargaBceComponent } from './componentes/cargabce.component';


@NgModule({
  imports: [SharedModule,CargaBceRoutingModule ],
  declarations: [CargaBceComponent]
})
export class CargaBceModule { }
