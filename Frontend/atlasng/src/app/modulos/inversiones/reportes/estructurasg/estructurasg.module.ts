import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstructurasgRoutingModule } from './estructurasg.routing';
import { EstructurasgComponent } from './componentes/estructurasg.component';
import {FileUploadModule} from 'primeng/primeng';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

import { ScheduleModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, 
    
    EstructurasgRoutingModule,FileUploadModule,ScheduleModule, JasperModule],
  declarations: [ EstructurasgComponent],
  exports: [EstructurasgComponent]
})
export class EstructurasgModule { }
