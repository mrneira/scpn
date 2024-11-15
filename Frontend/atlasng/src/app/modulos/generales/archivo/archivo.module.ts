import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ArchivoRoutingModule } from './archivo.routing';

import {  ArchivoComponent } from './componentes/archivo.component';


@NgModule({
  imports: [SharedModule, ArchivoRoutingModule ],
  declarations: [ ArchivoComponent]
})
export class ArchivoModule { }
