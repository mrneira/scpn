import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaDevolucionRoutingModule } from './consultaDevolucion.routing';
import { ConsultaDevolucionComponent } from './componentes/consultaDevolucion.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, ConsultaDevolucionRoutingModule, LovPersonasModule],
  declarations: [ConsultaDevolucionComponent]
})
export class ConsultaDevolucionModule { }
