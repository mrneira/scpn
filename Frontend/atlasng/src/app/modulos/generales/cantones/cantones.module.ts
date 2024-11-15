import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CantonesRoutingModule } from './cantones.routing';
import { CantonesComponent } from './componentes/cantones.component';
import { LovPaisesModule } from '../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../generales/lov/provincias/lov.provincias.module';


@NgModule({
  imports: [SharedModule, CantonesRoutingModule, LovPaisesModule, LovProvinciasModule ],
  declarations: [CantonesComponent]
})
export class CantonesModule { }

