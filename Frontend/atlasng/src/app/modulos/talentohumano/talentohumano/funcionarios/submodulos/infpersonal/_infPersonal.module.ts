import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { InformacionPersonalRoutingModule } from './_infPersonal.routing';
import { InformacionPersonalComponent } from './componentes/_infPersonal.component';

import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';
import { LovMapsModule } from '../../../../../../util/componentes/maps/lov.maps.module';
import { LovFuncionariosModule } from '../../../../lov/funcionarios/lov.funcionarios.module';

import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../../../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../../../../generales/lov/cantones/lov.cantones.module';
import { LovCiudadesModule } from '../../../../../generales/lov/ciudades/lov.ciudades.module';

import { SpinnerModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, InformacionPersonalRoutingModule, LovMapsModule, SpinnerModule,
    LovPersonasModule, LovPaisesModule, LovProvinciasModule, LovCantonesModule, LovCiudadesModule, LovFuncionariosModule],
  declarations: [InformacionPersonalComponent],
  exports: [InformacionPersonalComponent]
})
export class InformacionPersonalModule { }