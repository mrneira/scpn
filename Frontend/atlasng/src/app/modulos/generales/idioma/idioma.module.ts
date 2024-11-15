import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { IdiomaRoutingModule } from './idioma.routing';

import { IdiomaComponent } from './componentes/idioma.component';


@NgModule({
  imports: [SharedModule, IdiomaRoutingModule ],
  declarations: [IdiomaComponent]
})
export class IdiomaModule { }
