import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ActivarRoutingModule } from './activar.routing';

import { ActivarComponent } from './componentes/activar.component';
import { LovUsuariosModule } from '../../lov/usuarios/lov.usuarios.module';


@NgModule({
  imports: [SharedModule, ActivarRoutingModule, LovUsuariosModule ],
  declarations: [ActivarComponent]
})
export class ActivarModule { }
