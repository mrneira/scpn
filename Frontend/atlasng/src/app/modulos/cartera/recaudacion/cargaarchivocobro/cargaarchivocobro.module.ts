import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargaArchivoCobroRoutingModule } from './cargaarchivocobro.routing';
import { CargaArchivoCobroComponent } from './componentes/cargaarchivocobro.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, CargaArchivoCobroRoutingModule, JasperModule,TooltipModule],
  declarations: [CargaArchivoCobroComponent]
})
export class CargaArchivoCobroModule { }
