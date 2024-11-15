import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CatalogoEstadoBceRoutingModule } from './catalogoestadobce.routing';

import { CatalogoEstadoBceComponent } from './componentes/catalogoestadobce.component';


@NgModule({
  imports: [SharedModule, CatalogoEstadoBceRoutingModule ],
  declarations: [CatalogoEstadoBceComponent]
})
export class CatalogoEstadoBceModule { }
