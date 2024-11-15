import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { IdiomasRoutingModule } from './_idiomas.routing';

import { IdiomasComponent } from './componentes/_idiomas.component';
import { LovPaisesModule } from '../../../../../generales/lov/paises/lov.paises.module';
import { LovIdiomasModule } from '../../../../../generales/lov/idiomas/lov.idiomas.module';

import{LovEstablecimientoModule} from '../../../../lov/establecimiento/lov.establecimiento.module';


@NgModule({
  imports: [SharedModule, IdiomasRoutingModule,LovPaisesModule,LovIdiomasModule,LovEstablecimientoModule],
  declarations: [IdiomasComponent],
  exports: [IdiomasComponent]
})
export class IdiomasModule { }
