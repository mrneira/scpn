import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {PlanAnualRoutingModule } from './plananual.routing';
import { PlananualComponent } from './componentes/plananual.component';


import {DatosgeneralesModule} from './submodulos/datosgenerales/datosgenerales.module';
import {DetalleModule} from './submodulos/detalle/detalle.module';


@NgModule({
  imports: [SharedModule, PlanAnualRoutingModule,
    DatosgeneralesModule,DetalleModule],
  declarations: [PlananualComponent]
})
export class PlanAnualModule { }
