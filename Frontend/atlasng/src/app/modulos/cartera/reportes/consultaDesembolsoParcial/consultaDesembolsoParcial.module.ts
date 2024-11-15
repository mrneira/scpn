import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaDesembolsoParcialRoutingModule } from './consultaDesembolsoParcial.routing';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { ConsultaDesembolsoParcialComponent } from './componentes/consultaDesembolsoParcial.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, ConsultaDesembolsoParcialRoutingModule,JasperModule,LovPersonasModule],
  declarations: [ConsultaDesembolsoParcialComponent]
})
export class ConsultaDesembolsoParcialModule { }
