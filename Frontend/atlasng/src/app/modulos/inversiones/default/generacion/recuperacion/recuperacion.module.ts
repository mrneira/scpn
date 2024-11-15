import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { RecuperacionRoutingModule } from './recuperacion.routing';

import { RecuperacionComponent } from './componentes/recuperacion.component';
import { LovDefaultModule } from '../../../lov/default/lov.default.module'


@NgModule({
  imports: [SharedModule, RecuperacionRoutingModule,LovDefaultModule ],
  declarations: [RecuperacionComponent]
})
export class RecuperacionInversionModule { }
