import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargadescuentosRoutingModule } from './cargadescuentos.routing';
import {  CargadescuentosComponent } from './componentes/cargadescuentos.component';
import {FileUploadModule} from 'primeng/primeng';


import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';
@NgModule({
  imports: [SharedModule, CargadescuentosRoutingModule,FileUploadModule,ParametroAnualModule],
  declarations: [ CargadescuentosComponent]
})
export class CargadescuentosModule { }
