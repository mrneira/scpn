import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CargosRoutingRouting } from './_cargos.routing';
import { CargosComponent } from './componentes/_cargos.component';

;

@NgModule({
  imports: [SharedModule, CargosRoutingRouting ],
  declarations: [CargosComponent],
  exports: [CargosComponent]
})
export class CargosModule { }
