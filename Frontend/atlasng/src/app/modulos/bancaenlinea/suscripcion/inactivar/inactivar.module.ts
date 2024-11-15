import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InactivarRoutingModule } from './inactivar.routing';

import { InactivarComponent } from './componentes/inactivar.component';
import { LovUsuariosModule } from '../../lov/usuarios/lov.usuarios.module';


@NgModule({
  imports: [SharedModule, InactivarRoutingModule, LovUsuariosModule ],
  declarations: [InactivarComponent]
})
export class InactivarModule { }
