import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovUsuariosModule } from "../../../bancaenlinea/lov/usuarios/lov.usuarios.module";
import { LovSuscripcionMovilModule } from "../../lov/suscripcion/lov.suscripcionMovil.module";
import { InactivarRoutingModule } from './inactivar.routing';

import { InactivarComponent } from './componentes/inactivar.component';


@NgModule({
  imports: [SharedModule, InactivarRoutingModule, LovUsuariosModule, LovSuscripcionMovilModule ],
  declarations: [InactivarComponent]
})
export class InactivarModule { }
