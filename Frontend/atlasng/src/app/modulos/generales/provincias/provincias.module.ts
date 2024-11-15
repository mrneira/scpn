import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ProvinciasRoutingModule } from './provincias.routing';
import { ProvinciasComponent } from './componentes/provincias.component';
import { LovPaisesModule } from '../../generales/lov/paises/lov.paises.module';


@NgModule({
  imports: [SharedModule, ProvinciasRoutingModule, LovPaisesModule ],
  declarations: [ProvinciasComponent]
})
export class ProvinciasModule { }

