import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AjustesFlujoRoutingModule } from './ajustesflujo.routing';

import { AjustesFlujoComponent } from './componentes/ajustesflujo.component';


@NgModule({
  imports: [SharedModule,AjustesFlujoRoutingModule ],
  declarations: [AjustesFlujoComponent]
})
export class AjustesFlujoModule { }
