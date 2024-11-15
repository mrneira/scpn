
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AportePatronalRoutingModule } from './aportePatronal.routing';
import { AportePatronalComponent } from './componentes/aportePatronal.component';
import { AportesModule } from './submodulos/aportes/aportes.module';

import { StepsModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, StepsModule, AportePatronalRoutingModule, LovPersonasModule, AportesModule],  
  declarations: [AportePatronalComponent], 
  exports: [AportePatronalComponent]
})  
export class AportePatronalModule { }

