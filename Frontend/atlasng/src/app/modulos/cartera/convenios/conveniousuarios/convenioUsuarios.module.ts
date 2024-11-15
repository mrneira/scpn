import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConvenioUsuariosRoutingModule } from './convenioUsuarios.routing';
import { LovUsuariosModule } from '../../../seguridad/lov/usuarios/lov.usuarios.module';

import { ConvenioUsuariosComponent } from './componentes/convenioUsuarios.component';

@NgModule({
  imports: [SharedModule, ConvenioUsuariosRoutingModule, LovUsuariosModule],
  declarations: [ConvenioUsuariosComponent]
})
export class ConvenioUsuariosModule { }
