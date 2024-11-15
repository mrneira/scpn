import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {FuncionarionominaRoutingModule } from './funcionarionomina.routing';

import { FuncionarionominaComponent } from './componentes/funcionarionomina.component';


@NgModule({
  imports: [SharedModule, FuncionarionominaRoutingModule ],
  declarations: [FuncionarionominaComponent]
})
export class FuncionarionominaModule { }
