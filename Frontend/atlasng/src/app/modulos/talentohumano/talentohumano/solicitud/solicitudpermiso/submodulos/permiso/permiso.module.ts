import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../util/shared/shared.module';
import { PermisoRoutingModule } from './permiso.routing';

import { PermisoComponent } from './componentes/permiso.component';

import { LovFuncionariosModule } from '../../../../../lov/funcionarios/lov.funcionarios.module';
import { GestorDocumentalModule } from '../../../../../../gestordocumental/gestordocumental.module';

@NgModule({
  imports: [SharedModule, PermisoRoutingModule, LovFuncionariosModule,GestorDocumentalModule],
  declarations: [PermisoComponent],
  exports:[PermisoComponent]
})
export class PermisoModule { }
