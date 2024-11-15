import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ProveedorDireccionRoutingModule } from './_proveedorDireccion.routing';
import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../../../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../../../../generales/lov/cantones/lov.cantones.module';
import { LovParroquiasModule } from '../../../../../generales/lov/parroquias/lov.parroquias.module';
import { LovCiudadesModule } from '../../../../../generales/lov/ciudades/lov.ciudades.module';

import { ProveedorDireccionComponent } from './componentes/_proveedorDireccion.component';

@NgModule({
  imports: [SharedModule, ProveedorDireccionRoutingModule, 
    LovPaisesModule, LovProvinciasModule, LovCantonesModule, LovParroquiasModule, LovCiudadesModule ],
  declarations: [ProveedorDireccionComponent],
  exports: [ProveedorDireccionComponent]
})
export class ProveedorDireccionModule { }
