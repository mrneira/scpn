import { PersonaDireccionRoutingModule } from './_personaDireccion.routing';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';

import { LovPaisesModule } from '../../../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../../../generales/lov/cantones/lov.cantones.module';
import { LovParroquiasModule } from '../../../../generales/lov/parroquias/lov.parroquias.module';
import { LovCiudadesModule } from '../../../../generales/lov/ciudades/lov.ciudades.module';
import { LovMapsModule } from '../../../../../util/componentes/maps/lov.maps.module';

import { PersonaDireccionComponent } from './componentes/_personaDireccion.component';

@NgModule({
  imports: [SharedModule, PersonaDireccionRoutingModule, LovPaisesModule, LovProvinciasModule,
            LovCantonesModule, LovParroquiasModule, LovCiudadesModule, LovMapsModule ],
  declarations: [PersonaDireccionComponent],
  exports: [PersonaDireccionComponent]
})
export class PersonaDireccionModule { }
