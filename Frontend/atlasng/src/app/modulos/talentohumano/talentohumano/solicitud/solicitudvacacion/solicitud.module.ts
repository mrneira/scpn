import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { SolicitudRoutingModule } from './solicitud.routing';

import { SolicitudComponent } from './componentes/solicitud.component';

import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';
import {VacacionModule} from './submodulos/vacacion/vacacion.module';
@NgModule({
  imports: [SharedModule, SolicitudRoutingModule, LovFuncionariosModule,VacacionModule],
  declarations: [SolicitudComponent]
})
export class SolicitudModule { }
