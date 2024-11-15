import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CiudadesRoutingModule } from './ciudades.routing';
import { CiudadesComponent } from './componentes/ciudades.component';
import { LovPaisesModule } from '../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../generales/lov/cantones/lov.cantones.module';


@NgModule({
  imports: [SharedModule, CiudadesRoutingModule, LovPaisesModule, LovProvinciasModule, LovCantonesModule ],
  declarations: [CiudadesComponent]
})
export class CiudadesModule { }

