import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CronogramaRoutingModule } from './cronogramainstitucional.routing';
import {  CronogramaComponent } from './componentes/cronogramainstitucional.component';
import {FileUploadModule} from 'primeng/primeng';

import { ScheduleModule } from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, CronogramaRoutingModule,FileUploadModule,ScheduleModule],
  declarations: [ CronogramaComponent]
})
export class CronogramaModule { }
