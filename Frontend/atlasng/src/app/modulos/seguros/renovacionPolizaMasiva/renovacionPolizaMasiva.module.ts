import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { RenovacionPolizaMasivaRoutingModule } from './renovacionPolizaMasiva.routing';
import { RenovacionPolizaMasivaComponent } from './componentes/renovacionPolizaMasiva.component';
import { LovPersonaVistaModule } from '../../personas/lov/personavista/lov.personaVista.module';

@NgModule({
  imports: [SharedModule, RenovacionPolizaMasivaRoutingModule, LovPersonaVistaModule],
  declarations: [RenovacionPolizaMasivaComponent]
})
export class RenovacionPolizaMasivaModule { }
