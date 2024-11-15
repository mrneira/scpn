import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ModulosRoutingModule } from './clase.routing';

import { ClaseComponent } from './componentes/clase.component';


@NgModule({
  imports: [SharedModule, ModulosRoutingModule ],
  declarations: [ClaseComponent]
})
export class ClaseModule { }
