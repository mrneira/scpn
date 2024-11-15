import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { SolicitudRoutingModule } from './solicitud.routing';

import { SolicitudComponent } from './componentes/solicitud.component';

import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';
import {PermisoModule} from './submodulos/horasextras/horasextras.module';
@NgModule({
  imports: [SharedModule, SolicitudRoutingModule, LovFuncionariosModule,PermisoModule],
  declarations: [SolicitudComponent]
})
export class SolicitudModule { }
