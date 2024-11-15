import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { OperacionCobranzasRoutingModule } from './operacionCobranzas.routing';
import { JasperModule } from './../../../util/componentes/jasper/jasper.module';
import { OperacionCobranzasComponent } from './componentes/operacionCobranzas.component';
import { DireccionComponent } from './componentes/_direccion.component';

import { LovPersonaVistaModule } from '../../personas/lov/personavista/lov.personaVista.module';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovOperacionCobranzaModule } from '../lov/operacion/lov.operacionCobranza.module';
@NgModule({
  imports: [SharedModule, OperacionCobranzasRoutingModule, LovPersonaVistaModule, LovPersonasModule, LovOperacionCobranzaModule, JasperModule],
  declarations: [OperacionCobranzasComponent, DireccionComponent]
})
export class OperacionCobranzasModule { }
