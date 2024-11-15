import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CatalogoEstadoCashRoutingModule } from './catalogoestadocash.routing';

import { CatalogoEstadoCashComponent } from './componentes/catalogoestadocash.component';


@NgModule({
  imports: [SharedModule, CatalogoEstadoCashRoutingModule ],
  declarations: [CatalogoEstadoCashComponent]
})
export class CatalogoEstadoCashModule { }
