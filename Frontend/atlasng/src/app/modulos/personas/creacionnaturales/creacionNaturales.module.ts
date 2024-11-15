import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CreacionNaturalesRoutingModule } from './creacionNaturales.routing';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';

import { CreacionNaturalesComponent } from './componentes/creacionNaturales.component';
import { InformacionGeneralModule } from './submodulos/infgeneral/_informacionGeneral.module';
import { PersonaDireccionModule } from './submodulos/direccion/_personaDireccion.module';

import { PersonaRefBancariaModule } from './submodulos/refbancaria/_personaRefBancaria.module';
import { PersonaRefPersonalModule } from './submodulos/refpersonal/_personaRefPersonal.module';
import { PersonaRefComercialModule } from './submodulos/refcomercial/_personaRefComercial.module';
import { SocioCesantiaModule } from './submodulos/sociocesantia/sociocesantia.module';


@NgModule({
  imports: [SharedModule, CreacionNaturalesRoutingModule, LovPersonasModule, SocioCesantiaModule,
            PersonaRefBancariaModule, PersonaRefComercialModule, PersonaRefPersonalModule, PersonaDireccionModule,
            InformacionGeneralModule ],
  declarations: [CreacionNaturalesComponent],
  exports: []
})
export class CreacionNaturalesModule { }
