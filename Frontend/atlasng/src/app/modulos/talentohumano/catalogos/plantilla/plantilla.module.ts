import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PlantillaRoutingModule } from './plantilla.routing';

import { PlantillaComponent } from './componentes/plantilla.component';


@NgModule({
  imports: [SharedModule, PlantillaRoutingModule ],
  declarations: [PlantillaComponent]
})
export class PlantillaModule { }
