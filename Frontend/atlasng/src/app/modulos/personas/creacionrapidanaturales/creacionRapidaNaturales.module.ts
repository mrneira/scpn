import { PersonaDireccionModule } from './../creacionnaturales/submodulos/direccion/_personaDireccion.module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CreacionRapidaNaturalesRoutingModule } from './creacionRapidaNaturales.routing';

import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovNacionalidadesModule } from '../../generales/lov/nacionalidades/lov.nacionalidades.module';
import { LovActividadEconomicaModule } from '../../personas/lov/actividadeconomica/lov.actividadEconomica.module';
import { LovPaisesModule } from '../../generales/lov/paises/lov.paises.module';
import { LovProvinciasModule } from '../../generales/lov/provincias/lov.provincias.module';
import { LovCantonesModule } from '../../generales/lov/cantones/lov.cantones.module';
import { LovParroquiasModule } from '../../generales/lov/parroquias/lov.parroquias.module';
import { LovCiudadesModule } from '../../generales/lov/ciudades/lov.ciudades.module';


import { InformacionGeneralModule } from '../creacionnaturales/submodulos/infgeneral/_informacionGeneral.module';

import { CreacionRapidaNaturalesComponent } from './componentes/creacionRapidaNaturales.component';


@NgModule({
  imports: [SharedModule, CreacionRapidaNaturalesRoutingModule, LovPersonasModule, LovNacionalidadesModule, LovActividadEconomicaModule,
            LovPaisesModule, LovProvinciasModule, LovCantonesModule, LovParroquiasModule, LovCiudadesModule,
            InformacionGeneralModule, PersonaDireccionModule],
  declarations: [CreacionRapidaNaturalesComponent ]
})
export class CreacionRapidaNaturalesModule { }
