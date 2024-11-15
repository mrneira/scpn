import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { GaranteRoutingModule } from './_garante.routing';
import { GaranteComponent } from './componentes/_garante.component';
import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../../../personas/lov/personavista/lov.personaVista.module';
import { EgresosModule } from '../egresos/_egresos.module';
import { IngresosModule } from '../ingresos/_ingresos.module';
import { AbsorberGaranteComponent } from './componentes/_absorbergarante.component';

@NgModule({
  imports: [SharedModule, GaranteRoutingModule, LovPersonasModule, LovPersonaVistaModule, EgresosModule, IngresosModule],
  declarations: [GaranteComponent, AbsorberGaranteComponent],
  exports: [GaranteComponent, AbsorberGaranteComponent]

})
export class GaranteModule { }
