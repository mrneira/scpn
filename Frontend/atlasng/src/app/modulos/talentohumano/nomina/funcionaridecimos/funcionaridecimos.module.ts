import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {FuncionarioDecimoRoutingModule } from './funcionaridecimos.routing';

import { FuncionarionominaComponent } from './componentes/funcionaridecimos.component';


@NgModule({
  imports: [SharedModule, FuncionarioDecimoRoutingModule ],
  declarations: [FuncionarionominaComponent]
})
export class FuncionarioDecimoModule { }
