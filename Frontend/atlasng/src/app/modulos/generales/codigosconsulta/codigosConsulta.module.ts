import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CodigosConsultaRoutingModule } from './codigosConsulta.routing';

import { CodigosConsultaComponent } from './componentes/codigosConsulta.component';


@NgModule({
  imports: [SharedModule, CodigosConsultaRoutingModule ],
  declarations: [CodigosConsultaComponent]
})
export class CodigosConsultaModule { }
