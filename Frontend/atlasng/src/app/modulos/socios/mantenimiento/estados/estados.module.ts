import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstadosRoutingModule } from './estados.routing';

import { EstadosComponent } from './componentes/estados.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, EstadosRoutingModule,JasperModule, LovPersonasModule ],
  declarations: [EstadosComponent],
  exports: [EstadosComponent]
})
export class EstadosModule { }
