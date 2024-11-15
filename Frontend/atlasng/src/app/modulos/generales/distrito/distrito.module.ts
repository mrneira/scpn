import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { DistritoRoutingModule } from './distrito.routing';

import { DistritoComponent } from './componentes/distrito.component';


@NgModule({
  imports: [SharedModule, DistritoRoutingModule ],
  declarations: [DistritoComponent]
})
export class DistritoModule { }