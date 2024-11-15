import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { VinculacionesLegalesRoutingModule } from './vinculacionesLegales.routing';
import { VinculacionesLegalesComponent } from './componentes/vinculacionesLegales.component';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovCausalesVinculacionModule } from '../../personas/lov/causalesvinculacion/lov.causalesVinculacion.module';


@NgModule({
  imports: [SharedModule, VinculacionesLegalesRoutingModule, LovPersonasModule, LovCausalesVinculacionModule ],
  declarations: [VinculacionesLegalesComponent]
})
export class VinculacionesLegalesModule { }
