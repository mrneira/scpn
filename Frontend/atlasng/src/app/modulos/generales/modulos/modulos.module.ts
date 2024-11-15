import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ModulosRoutingModule } from './modulos.routing';

import { ModulosComponent } from './componentes/modulos.component';


@NgModule({
  imports: [SharedModule, ModulosRoutingModule ],
  declarations: [ModulosComponent]
})
export class ModulosModule { }
