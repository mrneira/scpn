import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { DevAporteAnterioresRoutingModule } from './devaporteAnteriores.routing';
import { DevAporteAnterioresComponent } from './componentes/devaporteAnteriores.component';
import { JasperModule } from 'app/util/componentes/jasper/jasper.module';
import { LovPersonasModule } from 'app/modulos/personas/lov/personas/lov.personas.module';


@NgModule({
  imports: [SharedModule, DevAporteAnterioresRoutingModule,  JasperModule, LovPersonasModule ],
  declarations: [DevAporteAnterioresComponent]
})
export class DevAporteAnterioresModule { }
