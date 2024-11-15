import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DefinicionPredecesoraRoutingModule } from './definicionPredecesoras.routing';
import { DefinicionPredeComponent } from './componentes/definicionPredecesoras.component';
@NgModule({
  imports: [SharedModule, DefinicionPredecesoraRoutingModule],
  declarations: [DefinicionPredeComponent]
})
export class DefinicionPrecesesoraModule { }
