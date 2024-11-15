import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { SectoresEconomicosRoutingModule } from './sectoresEconomicos.routing';

import { SectoresEconomicosComponent } from './componentes/sectoresEconomicos.component';


@NgModule({
  imports: [SharedModule, SectoresEconomicosRoutingModule ],
  declarations: [SectoresEconomicosComponent]
})
export class SectoresEconomicosModule { }
