import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CronogramavacacionesRoutingModule } from './cronogramavacaciones.routing';
import {  CronogramavacacionesComponent } from './componentes/cronogramavacaciones.component';
import {FileUploadModule} from 'primeng/primeng';



@NgModule({
  imports: [SharedModule, CronogramavacacionesRoutingModule,FileUploadModule],
  declarations: [ CronogramavacacionesComponent]
})
export class CronogramavacacionesModule { }
