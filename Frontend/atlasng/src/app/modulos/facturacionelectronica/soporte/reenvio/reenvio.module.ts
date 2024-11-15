import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReenvioRoutingModule } from './reenvio.routing';

import {  ReenvioComponent } from './componentes/reenvio.component';
import {FileUploadModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ReenvioRoutingModule,FileUploadModule ],
  declarations: [ ReenvioComponent]
})
export class ReenvioModule { }
