import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CamposGarantiasRoutingModule } from './camposGarantias.routing';
import { LovCatalogosDetalleModule } from '../../../generales/lov/catalogosdetalle/lov.catalogosDetalle.module';
import { LovCatalogosModule } from '../../../generales/lov/catalogos/lov.catalogos.module';

import { CamposGarantiasComponent } from './componentes/camposGarantias.component';


@NgModule({
  imports: [SharedModule, CamposGarantiasRoutingModule, LovCatalogosDetalleModule, LovCatalogosModule ],
  declarations: [CamposGarantiasComponent]
})
export class CamposGarantiasModule { }
