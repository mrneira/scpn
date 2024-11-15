import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TipoCreditoRoutingModule } from './tipoCredito.routing';

import {TipoCreditoComponent } from './componentes/tipoCredito.component';


@NgModule({
  imports: [SharedModule, TipoCreditoRoutingModule ],
  declarations: [TipoCreditoComponent]
})
export class TipoCreditoModule { }
