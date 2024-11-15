import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CatalogopatrimonioRoutingModule } from './catalogopatrimonio.routing';

import { CatalogopatrimonioComponent } from './componentes/catalogopatrimonio.component';


@NgModule({
  imports: [SharedModule, CatalogopatrimonioRoutingModule ],
  declarations: [CatalogopatrimonioComponent]
})
export class CatalogopatrimonioModule { }
