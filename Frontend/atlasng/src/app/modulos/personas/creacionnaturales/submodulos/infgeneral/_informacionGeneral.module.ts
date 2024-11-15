import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { InformacionGeneralRoutingModule } from './_informacionGeneral.routing';
import { LovNacionalidadesModule } from '../../../../generales/lov/nacionalidades/lov.nacionalidades.module';
import { LovPersonasModule } from '../../../../personas/lov/personas/lov.personas.module';

import { InformacionGeneralComponent } from './componentes/_informacionGeneral.component';
import { PersonaDetalleComponent } from './componentes/_personaDetalle.component';
import { PersonaNaturalComponent } from './componentes/_personaNatural.component';

@NgModule({
  imports: [SharedModule, InformacionGeneralRoutingModule, LovNacionalidadesModule, LovPersonasModule ],
  declarations: [InformacionGeneralComponent, PersonaDetalleComponent, PersonaNaturalComponent],
  exports: [InformacionGeneralComponent, PersonaDetalleComponent, PersonaNaturalComponent]
})
export class InformacionGeneralModule { }
