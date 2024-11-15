import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CamposArchivoRoutingModule } from './camposArchivo.routing';

import { CamposArchivoComponent } from './componentes/camposArchivo.component';


@NgModule({
  imports: [SharedModule, CamposArchivoRoutingModule ],
  declarations: [CamposArchivoComponent]
})
export class CamposArchivoModule { }
