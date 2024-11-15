import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CalendarioRoutingModule } from './calendario.routing';
import { CalendarioComponent } from './componentes/calendario.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, CalendarioRoutingModule, JasperModule, TooltipModule],
  declarations: [CalendarioComponent]
})
export class CalendarioModule { }
