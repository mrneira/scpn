import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CronogramaRoutingModule } from './cronogramainversiones.routing';
import {  CronogramaComponent } from './componentes/cronogramainversiones.component';
import {FileUploadModule} from 'primeng/primeng';

import { ScheduleModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, CronogramaRoutingModule,FileUploadModule,ScheduleModule],
  declarations: [ CronogramaComponent]
})
export class CronogramaModule { }
