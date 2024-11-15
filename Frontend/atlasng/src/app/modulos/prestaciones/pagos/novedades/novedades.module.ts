import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagoNovedadRoutingModule } from './novedades.routing';

import { LovPersonasModule } from './../../../personas/lov/personas/lov.personas.module';
import { PagoNovedadesComponent } from './componentes/novedades.component';

import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';

@NgModule({
  imports: [SharedModule, PagoNovedadRoutingModule,LovPersonasModule,SplitButtonModule ],
  declarations: [PagoNovedadesComponent]
})
export class PagoNovedadModule { }
