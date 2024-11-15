import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CompuniversalesRoutingModule } from './compuniversales.routing';

import { CompuniversalesComponent } from './componentes/compuniversales.component';


@NgModule({
  imports: [SharedModule, CompuniversalesRoutingModule],
  declarations: [CompuniversalesComponent],
  exports: [CompuniversalesComponent]
})
export class CompuniversalesModule { }
