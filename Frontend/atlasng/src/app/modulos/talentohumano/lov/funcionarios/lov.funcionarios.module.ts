import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovFuncionariosRoutingModule } from './lov.funcionarios.routing';
import { LovFuncionariosComponent } from './componentes/lov.funcionarios.component';

@NgModule({
  imports: [SharedModule, LovFuncionariosRoutingModule],
  declarations: [LovFuncionariosComponent],
  exports: [LovFuncionariosComponent]
})
export class LovFuncionariosModule { }

