import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DesembolsoSpiRoutingModule } from './desembolsospi.routing';
import { DesembolsoSpiComponent } from './componentes/desembolsospi.component';
import { LovPersonasModule } from 'app/modulos/personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, DesembolsoSpiRoutingModule, LovPersonasModule, LovOperacionCarteraModule],
  declarations: [DesembolsoSpiComponent]
})
export class DesembolsoSpiModule { }
