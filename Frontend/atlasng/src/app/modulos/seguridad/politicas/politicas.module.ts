import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { PoliticasRoutingModule } from './politicas.routing';

import { PoliticasComponent } from './componentes/politicas.component';


@NgModule({
  imports: [SharedModule, PoliticasRoutingModule ],
  declarations: [PoliticasComponent]
})
export class PoliticasModule { }
