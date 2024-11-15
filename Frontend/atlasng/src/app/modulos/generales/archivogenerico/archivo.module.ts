import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ArchivoRoutingModule } from './archivo.routing';

import {  ArchivoComponent } from './componentes/archivo.component';
import {FileUploadModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, ArchivoRoutingModule,FileUploadModule ],
  declarations: [ ArchivoComponent]
})
export class ArchivoModule { }
