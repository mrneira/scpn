import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { DevAporteRoutingModule } from './devaporte.routing';
import { DevAporteComponent } from './componentes/devaporte.component';
import { JasperModule } from 'app/util/componentes/jasper/jasper.module';
import { LovPersonasModule } from 'app/modulos/personas/lov/personas/lov.personas.module';


@NgModule({
  imports: [SharedModule, DevAporteRoutingModule,  JasperModule, LovPersonasModule ],
  declarations: [DevAporteComponent]
})
export class DevAporteModule { }
