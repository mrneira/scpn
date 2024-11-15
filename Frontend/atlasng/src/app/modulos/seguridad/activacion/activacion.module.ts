import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ActivacionRoutingModule } from './activacion.routing';

import { ActivacionComponent } from './componentes/activacion.component';
import { LovUsuariosModule } from '../lov/usuarios/lov.usuarios.module';


@NgModule({
  imports: [SharedModule, ActivacionRoutingModule, LovUsuariosModule ],
  declarations: [ActivacionComponent]
})
export class ActivacionModule { }
