import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CargaArchivoLogRoutingModule } from './cargaarchivolog.routing';
import { CargaArchivoLogComponent } from './componentes/cargaarchivolog.component';


@NgModule({
  imports: [SharedModule, CargaArchivoLogRoutingModule ],
  declarations: [CargaArchivoLogComponent]
})
export class CargaArchivoLogModule { }
