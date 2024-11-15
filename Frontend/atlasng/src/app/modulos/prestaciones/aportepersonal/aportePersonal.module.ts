
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AportePersonalRoutingModule } from './aportePersonal.routing';
import { AportePersonalComponent } from './componentes/aportePersonal.component';
import { AportesModule } from './submodulos/aportes/aportes.module';

import { StepsModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, StepsModule, AportePersonalRoutingModule, LovPersonasModule, AportesModule],  
  declarations: [AportePersonalComponent], 
  exports: [AportePersonalComponent]
})  
export class AportePersonalModule { }

