import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CatalogosRoutingModule } from './catalogos.routing';

import { CatalogosComponent } from './componentes/catalogos.component';
import { LovCatalogosModule } from '../../generales/lov/catalogos/lov.catalogos.module';
import { CatalogoPadreComponent } from './componentes/_catalogoPadre.component';
import { CatalogoDetalleComponent } from './componentes/_catalogoDetalle.component';


@NgModule({
  imports: [SharedModule, CatalogosRoutingModule, LovCatalogosModule ],
  declarations: [CatalogosComponent, CatalogoPadreComponent, CatalogoDetalleComponent]
})
export class CatalogosModule { }
