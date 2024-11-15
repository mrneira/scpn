import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HorasExtrasRoutingModule } from './horasExtras.routing';
import { HorasExtrasComponent } from './componentes/horasExtras.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, HorasExtrasRoutingModule, JasperModule, LovFuncionariosModule ],
  declarations: [HorasExtrasComponent]
})
export class HorasExtrasModule { }
