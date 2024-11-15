import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ReportesRoutingModule } from './_reportes.routing';

import { ReportesComponent } from './componentes/_reportes.component';


@NgModule({
  imports: [SharedModule, ReportesRoutingModule],
  declarations: [ReportesComponent],
  exports: [ReportesComponent]
})
export class ReportesModule { }
