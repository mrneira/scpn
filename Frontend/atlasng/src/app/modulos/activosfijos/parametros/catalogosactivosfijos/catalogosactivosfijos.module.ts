import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CatalogosActivosfijosRoutingModule } from './catalogosactivosfijos.routing';

import { CatalogosActivosfijosComponent } from './componentes/catalogosactivosfijos.component';
import { LovCatalogosModule } from '../../../generales/lov/catalogos/lov.catalogos.module';
import { CatalogoPadreComponent } from './submodulos/_catalogoPadre.component';
import { CatalogoDetalleComponent } from './submodulos/_catalogoDetalle.component';


@NgModule({
  imports: [SharedModule, CatalogosActivosfijosRoutingModule, LovCatalogosModule ],
  declarations: [CatalogosActivosfijosComponent, CatalogoPadreComponent, CatalogoDetalleComponent]
})
export class CatalogosActivosfijosModule { }
