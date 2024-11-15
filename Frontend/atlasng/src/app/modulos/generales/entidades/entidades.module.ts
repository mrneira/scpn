import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { EntidadesRoutingModule } from './entidades.routing';

import { EntidadesComponent } from './componentes/entidades.component';


@NgModule({
  imports: [SharedModule, EntidadesRoutingModule ],
  declarations: [EntidadesComponent]
})
export class EntidadesModule { }
