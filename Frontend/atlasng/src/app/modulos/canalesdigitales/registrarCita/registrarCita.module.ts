import { NgModule } from '@angular/core';
import { SharedModule } from './../../../util/shared/shared.module';
import { RegistrarCitaRoutingModule } from './registrarCita.routing';
import { LovPersonasModule } from 'app/modulos/personas/lov/personas/lov.personas.module';

import { RegistrarCitaComponent } from './componentes/registrarCita.component';

@NgModule({
  imports: [
      SharedModule,
      RegistrarCitaRoutingModule,
      LovPersonasModule
    ],
  declarations: [
    RegistrarCitaComponent
    ]
})
export class RegistrarCitaModule { }