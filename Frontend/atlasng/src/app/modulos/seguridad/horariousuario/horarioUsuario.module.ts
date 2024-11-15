import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { HorarioUsuarioRoutingModule } from './horarioUsuario.routing';
import { LovUsuariosModule } from '../lov/usuarios/lov.usuarios.module';

import { HorarioUsuarioComponent } from './componentes/horarioUsuario.component';
import {InputMaskModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, HorarioUsuarioRoutingModule, InputMaskModule, LovUsuariosModule ],
  declarations: [HorarioUsuarioComponent]
})
export class HorarioUsuarioModule { }
