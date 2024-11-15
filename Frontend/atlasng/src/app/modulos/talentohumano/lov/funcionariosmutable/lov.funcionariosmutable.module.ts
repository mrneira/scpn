import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovFuncionariosMutableRoutingModule } from './lov.funcionariosmutable.routing';
import { LovFuncionariosMutableComponent } from './componentes/lov.funcionariosmutable.component';

@NgModule({
  imports: [SharedModule, LovFuncionariosMutableRoutingModule],
  declarations: [LovFuncionariosMutableComponent],
  exports: [LovFuncionariosMutableComponent]
})
export class LovFuncionariosMutableModule { }

