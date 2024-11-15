import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ActividadesEconomicasRoutingModule } from './actividadesEconomicas.routing';

import { ActividadesEconomicasComponent } from './componentes/actividadesEconomicas.component';


@NgModule({
  imports: [SharedModule, ActividadesEconomicasRoutingModule ],
  declarations: [ActividadesEconomicasComponent]
})
export class ActividadesEconomicasModule { }
