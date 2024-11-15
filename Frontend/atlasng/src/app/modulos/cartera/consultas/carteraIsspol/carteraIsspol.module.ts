import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CarteraIsspolRoutingModule } from './carteraIsspol.routing';

import { CarteraIsspolComponent } from './componentes/carteraIsspol.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, CarteraIsspolRoutingModule, JasperModule,LovPersonasModule],
  declarations: [CarteraIsspolComponent]
})
export class CarteraIsspolModule{ }
