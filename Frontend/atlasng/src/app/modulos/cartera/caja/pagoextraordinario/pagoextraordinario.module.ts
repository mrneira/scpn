import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagoExtraordinarioRoutingModule } from './pagoextraordinario.routing';

import { PagoExtraordinarioComponent } from './componentes/pagoextraordinario.component';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';



@NgModule({
  imports: [SharedModule, PagoExtraordinarioRoutingModule, LovPersonasModule, LovOperacionCarteraModule ],
  declarations: [PagoExtraordinarioComponent]
})
export class PagoExtraordinarioModule { }
