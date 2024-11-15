import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { InscripcionRoutingModule } from './_inscripcion.routing';

import { InscripcionComponent } from './componentes/_inscripcion.component';
import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';
import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';
import { LovCantonesModule } from '../../../../../generales/lov/cantones/lov.cantones.module';
import { LovProvinciasModule } from '../../../../../generales/lov/provincias/lov.provincias.module';

@NgModule({
  imports: [SharedModule, InscripcionRoutingModule, LovPersonasModule, LovPaisesModule, LovCantonesModule, LovProvinciasModule],
  declarations: [InscripcionComponent],
  exports: [InscripcionComponent]
})
export class InscripcionModule { }
