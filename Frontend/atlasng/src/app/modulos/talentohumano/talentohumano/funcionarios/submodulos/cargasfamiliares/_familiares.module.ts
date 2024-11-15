import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { FamiliaresRoutingModule } from './_familiares.routing';
import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../../../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../../../../generales/lov/cantones/lov.cantones.module';
import { LovParroquiasModule } from '../../../../../generales/lov/parroquias/lov.parroquias.module';
import { LovCiudadesModule } from '../../../../../generales/lov/ciudades/lov.ciudades.module';

import { FamiliaresComponent } from './componentes/_familiares.component';
import { SpinnerModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, FamiliaresRoutingModule, SpinnerModule,
    LovPaisesModule, LovProvinciasModule, LovCantonesModule, LovParroquiasModule, LovCiudadesModule ],
  declarations: [FamiliaresComponent],
  exports: [FamiliaresComponent]
})
export class FamiliaresModule { }
