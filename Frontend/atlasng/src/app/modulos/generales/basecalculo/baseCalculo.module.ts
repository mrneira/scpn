import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { BaseCalculoRoutingModule } from './baseCalculo.routing';

import { BaseCalculoComponent } from './componentes/baseCalculo.component';


@NgModule({
  imports: [SharedModule, BaseCalculoRoutingModule ],
  declarations: [BaseCalculoComponent]
})
export class BaseCalculoModule { }
