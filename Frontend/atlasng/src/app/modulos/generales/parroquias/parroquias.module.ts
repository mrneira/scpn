import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ParroquiasRoutingModule } from './parroquias.routing';
import { ParroquiasComponent } from './componentes/parroquias.component';
import { LovPaisesModule } from '../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../generales/lov/cantones/lov.cantones.module';


@NgModule({
  imports: [SharedModule, ParroquiasRoutingModule, LovPaisesModule, LovProvinciasModule, LovCantonesModule ],
  declarations: [ParroquiasComponent]
})
export class ParroquiasModule { }

