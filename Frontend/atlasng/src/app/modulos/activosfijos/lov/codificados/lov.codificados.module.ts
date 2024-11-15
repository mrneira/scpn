import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCodificadosRoutingModule } from './lov.codificados.routing';

import { LovCodificadosComponent } from './componentes/lov.codificados.component';

import { LovProductosModule } from '../productos/lov.productos.module';


@NgModule({
  imports: [SharedModule, LovCodificadosRoutingModule,LovProductosModule],
  declarations: [LovCodificadosComponent],
  exports: [LovCodificadosComponent]
})
export class LovCodificadosModule { }

