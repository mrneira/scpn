import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { InactivacionRoutingModule } from './inactivacion.routing';

import { InactivacionComponent } from './componentes/inactivacion.component';
import { LovUsuariosModule } from '../lov/usuarios/lov.usuarios.module';


@NgModule({
  imports: [SharedModule, InactivacionRoutingModule, LovUsuariosModule ],
  declarations: [InactivacionComponent]
})
export class InactivacionModule { }
