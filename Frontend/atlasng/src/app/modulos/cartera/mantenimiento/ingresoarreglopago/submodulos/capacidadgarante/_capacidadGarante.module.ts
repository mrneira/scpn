import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CapacidadGaranteRoutingModule } from './_capacidadGarante.routing';
import { CapacidadGaranteComponent } from './componentes/_capacidadGarante.component';
import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../../../personas/lov/personavista/lov.personaVista.module';
import { EgresosCapacidadModule } from '../egresoscapacidad/_egresosCapacidad.module';
import { IngresosCapacidadModule } from '../ingresoscapacidad/_ingresosCapacidad.module';
import { AbsorberGaranteComponent } from './componentes/_absorbergarante.component';

@NgModule({
  imports: [SharedModule, CapacidadGaranteRoutingModule, LovPersonasModule, LovPersonaVistaModule,
    EgresosCapacidadModule, IngresosCapacidadModule],
  declarations: [CapacidadGaranteComponent, AbsorberGaranteComponent],
  exports: [CapacidadGaranteComponent, AbsorberGaranteComponent]

})
export class CapacidadGaranteModule { }
