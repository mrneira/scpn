import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CodigosLotesRoutingModule } from './codigosLotes.routing';
import { CodigosLotesComponent } from './componentes/codigosLotes.component';


@NgModule({
  imports: [SharedModule, CodigosLotesRoutingModule],
  declarations: [CodigosLotesComponent]
})
export class CodigosLotesModule { }
