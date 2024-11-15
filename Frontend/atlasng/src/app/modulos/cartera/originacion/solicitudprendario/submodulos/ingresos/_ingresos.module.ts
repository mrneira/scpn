import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { IngresosRoutingModule } from './_ingresos.routing';
import { IngresosComponent } from './componentes/_ingresos.component';

@NgModule({
  imports: [SharedModule, IngresosRoutingModule ],
  declarations: [IngresosComponent],
  exports: [IngresosComponent]
})
export class IngresosModule { }
