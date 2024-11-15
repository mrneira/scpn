import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargaProductosRoutingModule } from './cargaproductos.routing';
import {  CargaProductosComponent } from './componentes/cargaproductos.component';
import {FileUploadModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, CargaProductosRoutingModule,FileUploadModule],
  declarations: [ CargaProductosComponent]
})
export class CargaProductosModule { }
