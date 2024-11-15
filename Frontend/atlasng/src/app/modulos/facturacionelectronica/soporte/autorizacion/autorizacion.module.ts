import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AutorizacionRoutingModule } from './autorizacion.routing';

import {  AutorizacionComponent } from './componentes/autorizacion.component';
import {FileUploadModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AutorizacionRoutingModule,FileUploadModule ],
  declarations: [ AutorizacionComponent]
})
export class AutorizacionModule { }
