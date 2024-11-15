import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EmisordetalleRoutingModule } from './emisordetalle.routing';

import { EmisordetalleComponent } from './componentes/emisordetalle.component';
import {LovPaisesModule} from '../../../generales/lov/paises/lov.paises.module';

@NgModule({
  imports: [SharedModule, EmisordetalleRoutingModule,LovPaisesModule],
  declarations: [EmisordetalleComponent]
})
export class EmisordetalleModule { }
