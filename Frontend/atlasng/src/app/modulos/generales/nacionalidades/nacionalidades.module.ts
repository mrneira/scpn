import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { NacionalidadesRoutingModule } from './nacionalidades.routing';

import { NacionalidadesComponent } from './componentes/nacionalidades.component';


@NgModule({
  imports: [SharedModule, NacionalidadesRoutingModule ],
  declarations: [NacionalidadesComponent]
})
export class NacionalidadesModule { }
