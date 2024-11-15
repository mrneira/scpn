import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCantonesModule } from '../../../generales/lov/cantones/lov.cantones.module';
import { LovCiudadesModule } from '../../../generales/lov/ciudades/lov.ciudades.module';
import { LovPaisesModule } from '../../../generales/lov/paises/lov.paises.module';
import { LovDistritosModule } from '../../../generales/lov/distritos/lov.distritos.module';
import { LovProvinciasModule } from '../../../generales/lov/provincias/lov.provincias.module';
import { UbicacionRoutingModule } from './ubicacion.routing';

import { UbicacionComponent } from './componentes/ubicacion.component';

import { AccionesArbolModule } from '../../../../util/componentes/accionesarbol/accionesArbol.module';
import { TreeTableModule} from 'primeng/primeng';
import { SelectButtonModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, UbicacionRoutingModule, TreeTableModule, SelectButtonModule, AccionesArbolModule, LovPaisesModule, LovProvinciasModule, LovCantonesModule, LovCiudadesModule, LovDistritosModule ],
  declarations: [UbicacionComponent]
})
export class UbicacionModule { }
