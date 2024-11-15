import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AgendapagosRoutingModule } from './agendapagos.routing';
import { AgendapagosComponent } from './componentes/agendapagos.component';
import {FileUploadModule} from 'primeng/primeng';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';



import { ScheduleModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, 
    
    AgendapagosRoutingModule,FileUploadModule,ScheduleModule, JasperModule],
  declarations: [ AgendapagosComponent],
  exports: [AgendapagosComponent]
})
export class AgendapagosModule { }
