import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ClienteDireccionRoutingModule } from './_clienteDireccion.routing';
import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../../../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../../../../generales/lov/cantones/lov.cantones.module';
import { LovParroquiasModule } from '../../../../../generales/lov/parroquias/lov.parroquias.module';
import { LovCiudadesModule } from '../../../../../generales/lov/ciudades/lov.ciudades.module';

import { ClienteDireccionComponent } from './componentes/_clienteDireccion.component';

@NgModule({
  imports: [SharedModule, ClienteDireccionRoutingModule, 
    LovPaisesModule, LovProvinciasModule, LovCantonesModule, LovParroquiasModule, LovCiudadesModule ],
  declarations: [ClienteDireccionComponent],
  exports: [ClienteDireccionComponent]
})
export class ClienteDireccionModule { }
