import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargamarcacionesRoutingModule } from './cargamarcaciones.routing';
import { CargaMarcacionesComponent } from './componentes/cargamarcaciones.component';
import {FileUploadModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, CargamarcacionesRoutingModule,FileUploadModule],
  declarations: [ CargaMarcacionesComponent]
})
export class CargamarcacionesModule { }
