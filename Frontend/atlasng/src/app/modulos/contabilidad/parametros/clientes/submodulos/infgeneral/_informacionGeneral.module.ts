import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { InformacionGeneralRoutingModule } from './_informacionGeneral.routing';
import { LovActividadEconomicaModule } from '../../../../../personas/lov/actividadeconomica/lov.actividadEconomica.module';
import { LovNacionalidadesModule } from '../../../../../generales/lov/nacionalidades/lov.nacionalidades.module';
import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';
import { LovCuentasContablesModule } from '../../../../lov/cuentascontables/lov.cuentasContables.module';

import { InformacionGeneralComponent } from './componentes/_informacionGeneral.component';
import { PersonaClienteComponent } from './componentes/_personaCliente.component';

@NgModule({
  imports: [SharedModule, InformacionGeneralRoutingModule, LovActividadEconomicaModule, LovNacionalidadesModule, 
    LovPersonasModule, LovCuentasContablesModule],
  declarations: [InformacionGeneralComponent, PersonaClienteComponent],
  exports: [InformacionGeneralComponent, PersonaClienteComponent]
})
export class InformacionGeneralModule { }
