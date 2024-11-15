import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagoDescuentosRoutingModule } from './pagoDescuentos.routing';
import { PagoDescuentosComponent } from './componentes/pagoDescuentos.component';

@NgModule({
  imports: [SharedModule, PagoDescuentosRoutingModule],
  declarations: [PagoDescuentosComponent]
})
export class PagoDescuentosModule { }

