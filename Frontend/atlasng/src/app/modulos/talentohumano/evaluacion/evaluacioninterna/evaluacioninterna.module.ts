import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionRoutingModule } from './evaluacioninterna.routing';
import { EvaluacionComponent } from './componentes/evaluacion.component';

//Submodulos
import { InternaDetalleModule } from './submodulos/internadetalle/internadetalle.module';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
//import {SidebarModule} from 'primeng/primeng';

//lov

import {LovMatrizCorrelacionDModule} from '../../lov/matrizcorrelaciondetalle/lov.matrizcorrelaciondetalle.module'

@NgModule({
  imports: [SharedModule, EvaluacionRoutingModule,
    InternaDetalleModule,CabeceraModule,LovMatrizCorrelacionDModule],
  declarations: [EvaluacionComponent]
})
export class EvaluacionInternaModule { }
