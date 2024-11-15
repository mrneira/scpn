import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovUsuariosModule } from "../../../bancaenlinea/lov/usuarios/lov.usuarios.module";
import { LovSuscripcionMovilModule } from "../../lov/suscripcion/lov.suscripcionMovil.module";
import { ActivarRoutingModule } from './activar.routing';

import { ActivarComponent } from './componentes/activar.component';


@NgModule({
  imports: [SharedModule, ActivarRoutingModule, LovUsuariosModule, LovSuscripcionMovilModule ],
  declarations: [ActivarComponent]
})
export class ActivarModule { }
