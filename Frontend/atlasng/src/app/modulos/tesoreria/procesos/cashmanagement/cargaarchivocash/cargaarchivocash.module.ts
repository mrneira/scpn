import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { CargaArchivoCashRoutingModule } from './cargaarchivocash.routing';
import { CargaArchivoCashComponent } from './componentes/cargaarchivocash.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, CargaArchivoCashRoutingModule, JasperModule,TooltipModule],
  declarations: [CargaArchivoCashComponent]
})
export class CargaArchivoCashModule { }
