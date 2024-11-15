import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';

import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';
import{LovEstablecimientoModule} from '../../../../lov/establecimiento/lov.establecimiento.module';

import { InstitucionFormalComponent } from './componentes/_institucionformal.component';
import {LovTituloModule} from '../../../../lov/titulo/lov.titulo.module';
@NgModule({
  imports: [SharedModule, LovPaisesModule,LovEstablecimientoModule,LovTituloModule ],
  declarations: [InstitucionFormalComponent],
  exports: [InstitucionFormalComponent]
})
export class InstitucionFormalModule { }
