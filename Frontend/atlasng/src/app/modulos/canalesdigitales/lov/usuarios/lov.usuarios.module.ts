import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovUsuariosCanalesRoutingModule } from './lov.usuarios.routing';
import { LovUsuariosCanalesComponent } from './componentes/lov.usuarios.component';

@NgModule({
  imports: [SharedModule, LovUsuariosCanalesRoutingModule],
  declarations: [LovUsuariosCanalesComponent],
  exports: [LovUsuariosCanalesComponent]
})
export class LovUsuariosCanalesModule { }

