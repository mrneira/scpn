import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCatalogosRoutingModule } from './lov.catalogos.routing';

import { LovCatalogosComponent } from './componentes/lov.catalogos.component';

@NgModule({
  imports: [SharedModule, LovCatalogosRoutingModule],
  declarations: [LovCatalogosComponent],
  exports: [LovCatalogosComponent],
})
export class LovCatalogosModule { }

