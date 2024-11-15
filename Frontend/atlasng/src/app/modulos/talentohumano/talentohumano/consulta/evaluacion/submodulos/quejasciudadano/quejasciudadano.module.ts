import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../util/shared/shared.module';
import { QuejasciudadanoRoutingModule } from './quejasciudadano.routing';

import { QuejasciudadanoComponent } from './componentes/quejasciudadano.component';

import { LovFuncionariosModule } from '../../../../../lov/funcionarios/lov.funcionarios.module';


@NgModule({
  imports: [SharedModule, QuejasciudadanoRoutingModule,LovFuncionariosModule],
  declarations: [QuejasciudadanoComponent],
  exports: [QuejasciudadanoComponent]
})
export class QuejasciudadanoModule { }
