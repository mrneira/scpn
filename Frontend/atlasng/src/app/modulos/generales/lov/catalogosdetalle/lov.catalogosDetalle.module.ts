import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCatalogosDetalleRoutingModule } from './lov.catalogosDetalle.routing';

import { LovCatalogosDetalleComponent } from './componentes/lov.catalogosDetalle.component';

@NgModule({
  imports: [SharedModule, LovCatalogosDetalleRoutingModule],
  declarations: [LovCatalogosDetalleComponent],
  exports: [LovCatalogosDetalleComponent],
})
export class LovCatalogosDetalleModule { }

