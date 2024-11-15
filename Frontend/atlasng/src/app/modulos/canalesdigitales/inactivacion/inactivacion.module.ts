import { NgModule } from '@angular/core';
import { SharedModule } from './../../../util/shared/shared.module';
import { LovUsuariosCanalesModule } from './../../canalesdigitales/lov/usuarios/lov.usuarios.module';
import { InactivacionCanalDigitalRoutingModule } from './inactivacion.routing';

import { InactivacionCanalDigitalComponent } from './componentes/inactivacion.component';


@NgModule({
  imports: [SharedModule, InactivacionCanalDigitalRoutingModule, LovUsuariosCanalesModule],
  declarations: [InactivacionCanalDigitalComponent]
})
export class InactivacionCanalDigitalModule { }
