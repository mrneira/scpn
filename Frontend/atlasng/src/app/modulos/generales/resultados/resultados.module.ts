import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ResultadosRoutingModule } from './resultados.routing';

import { LovCatalogosDetalleModule } from '../../generales/lov/catalogosdetalle/lov.catalogosDetalle.module';
import { ResultadosComponent } from './componentes/resultados.component';


@NgModule({
  imports: [SharedModule, ResultadosRoutingModule, LovCatalogosDetalleModule ],
  declarations: [ResultadosComponent]
})
export class ResultadosModule { }
