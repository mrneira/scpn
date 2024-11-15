import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { SolicitudPermisoRoutingModule } from './solicitudpermiso.routing';

import { SolicitudPermisoComponent } from './componentes/solicitudpermiso.component';

import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';
import {PermisoModule} from './submodulos/permiso/permiso.module';
@NgModule({
  imports: [SharedModule, SolicitudPermisoRoutingModule, LovFuncionariosModule,PermisoModule],
  declarations: [SolicitudPermisoComponent]
})
export class SolicitudPermisoModule { }
